#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "Falha na linha $LINENO. Corrija a mensagem acima e execute novamente; etapas concluídas são reaproveitadas." >&2' ERR

URL_PLATAFORMA="${1:-http://localhost:3000}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RAIZ"

if [[ ! "$URL_PLATAFORMA" =~ ^https?://[A-Za-z0-9._:-]+/?$ ]]; then
  echo "URL inválida. Use, por exemplo: https://blog.seudominio.com.br" >&2
  exit 1
fi

if [[ $EUID -eq 0 ]]; then SUDO=""; else SUDO="sudo"; fi
$SUDO apt-get update
$SUDO apt-get install -y ca-certificates curl gnupg openssl
if ! command -v docker >/dev/null; then curl -fsSL https://get.docker.com | $SUDO sh; fi
if ! docker compose version >/dev/null 2>&1; then
  $SUDO apt-get install -y docker-compose-plugin
fi
$SUDO systemctl enable --now docker
if ! command -v node >/dev/null || [[ "$(node -p 'Number(process.versions.node.split(`.`)[0])')" -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  SENHA_BANCO="$(openssl rand -hex 24)"
  SENHA_ADMIN="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)A1!"
  SEGREDO_EMAIL="$(openssl rand -hex 32)"
  sed -i "s|^URL_PUBLICA_PORTAL=.*|URL_PUBLICA_PORTAL=$URL_PLATAFORMA|" .env
  sed -i "s|^POSTGRES_SENHA=.*|POSTGRES_SENHA=$SENHA_BANCO|" .env
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=postgresql://moveon:$SENHA_BANCO@127.0.0.1:5434/moveon|" .env
  sed -i "s|^ADMIN_SENHA=.*|ADMIN_SENHA=$SENHA_ADMIN|" .env
  sed -i "s|^EMAIL_SEGREDO_CANCELAMENTO=.*|EMAIL_SEGREDO_CANCELAMENTO=$SEGREDO_EMAIL|" .env
  printf '\nCredenciais iniciais: admin@moveon / %s\n' "$SENHA_ADMIN" | tee CREDENCIAIS-INICIAIS.txt
  chmod 600 .env CREDENCIAIS-INICIAIS.txt
fi
sed -i "s|^URL_PUBLICA_PORTAL=.*|URL_PUBLICA_PORTAL=$URL_PLATAFORMA|" .env
sed -i "s|^ORIGENS_PERMITIDAS=.*|ORIGENS_PERMITIDAS=$URL_PLATAFORMA,http://localhost:3000,http://127.0.0.1:3000|" .env
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
if [[ "$URL_PLATAFORMA" == https://* ]]; then
  sed -i 's/^COOKIE_SEGURO=.*/COOKIE_SEGURO=true/' .env
else
  sed -i 's/^COOKIE_SEGURO=.*/COOKIE_SEGURO=false/' .env
fi

# Instala exatamente as versões validadas e registradas no package-lock.json.
# Atualizações automáticas durante a implantação podem introduzir versões
# incompatíveis sem que o código tenha passado pelos testes do projeto.
if [[ -f package-lock.json ]]; then
  npm ci || { npm cache verify; npm ci; }
else
  npm install || { npm cache verify; npm install; }
fi

# A auditoria é informativa. Correções, especialmente com --force, devem ser
# aplicadas no desenvolvimento, testadas e versionadas antes da implantação.
npm audit || true
$SUDO docker compose up -d banco
for tentativa in {1..30}; do $SUDO docker compose exec -T banco pg_isready -U moveon -d moveon >/dev/null 2>&1 && break; sleep 2; [[ $tentativa -eq 30 ]] && exit 1; done
npm run banco:migrar
npm run banco:semear
npm run tipos
npm run build
mkdir -p logs uploads/capas uploads/perfis

# O banco usa restart: unless-stopped no Docker Compose. Portal e API são
# supervisionados pelo systemd e voltam automaticamente após falha ou reboot.
USUARIO_SERVICO="${SUDO_USER:-$(id -un)}"
GRUPO_SERVICO="$(id -gn "$USUARIO_SERVICO")"
CAMINHO_NPM="$(command -v npm)"
ARQUIVO_SERVICO="$(mktemp)"
cat > "$ARQUIVO_SERVICO" <<EOF
[Unit]
Description=Portal de Conteudo MOVE.ON
Requires=docker.service
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=simple
User=$USUARIO_SERVICO
Group=$GRUPO_SERVICO
WorkingDirectory=$RAIZ
Environment=NODE_ENV=production
ExecStart=$CAMINHO_NPM run start:producao
Restart=always
RestartSec=5
TimeoutStopSec=30
KillSignal=SIGTERM
KillMode=control-group
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
$SUDO install -m 0644 "$ARQUIVO_SERVICO" /etc/systemd/system/moveon.service
rm -f "$ARQUIVO_SERVICO"
if [[ -f moveon.pid ]]; then
  PID_ANTIGO="$(cat moveon.pid 2>/dev/null || true)"
  if [[ -n "$PID_ANTIGO" ]] && kill -0 "$PID_ANTIGO" 2>/dev/null; then kill "$PID_ANTIGO" || true; fi
  rm -f moveon.pid
fi
$SUDO systemctl daemon-reload
$SUDO systemctl enable moveon.service
$SUDO systemctl restart moveon.service

for tentativa in {1..30}; do
  if curl -fsS http://127.0.0.1:3001/api/saude >/dev/null 2>&1 && curl -fsS http://127.0.0.1:3000 >/dev/null 2>&1; then break; fi
  sleep 2
  if [[ $tentativa -eq 30 ]]; then
    $SUDO systemctl status moveon.service --no-pager || true
    $SUDO journalctl -u moveon.service -n 100 --no-pager || true
    exit 1
  fi
done
$SUDO systemctl is-enabled --quiet moveon.service
$SUDO systemctl is-active --quiet moveon.service
echo "MOVE.ON instalado e funcionando em $URL_PLATAFORMA"
