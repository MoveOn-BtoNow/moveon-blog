#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "Falha na linha $LINENO. Etapas concluídas foram preservadas; corrija a mensagem e execute novamente." >&2' ERR

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RAIZ"
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"

valor_env() { [[ -f .env ]] && sed -n "s/^$1=//p" .env | tail -n 1 || true; }
definir_env() {
  local chave="$1" valor="$2"
  if grep -q "^${chave}=" .env; then sed -i "s|^${chave}=.*|${chave}=${valor}|" .env
  else printf '\n%s=%s\n' "$chave" "$valor" >> .env; fi
}

URL_PLATAFORMA="${1:-}"
URL_ATUAL="$(valor_env URL_PUBLICA_PORTAL)"
if [[ -z "$URL_PLATAFORMA" ]]; then
  if [[ -t 0 ]]; then
    PADRAO_URL="${URL_ATUAL:-https://portal.seudominio.com.br}"
    read -r -p "Domínio público do portal [$PADRAO_URL]: " URL_PLATAFORMA
    URL_PLATAFORMA="${URL_PLATAFORMA:-$PADRAO_URL}"
  elif [[ -n "$URL_ATUAL" ]]; then URL_PLATAFORMA="$URL_ATUAL"
  else echo "Informe o domínio: ./scripts/instalar.sh https://portal.seudominio.com.br" >&2; exit 1; fi
fi
if [[ ! "$URL_PLATAFORMA" =~ ^https?://([A-Za-z0-9-]+\.)*[A-Za-z0-9-]+(:[0-9]{1,5})?/?$ ]]; then
  echo "URL inválida. Exemplo: https://portal.seudominio.com.br" >&2; exit 1
fi
URL_PLATAFORMA="${URL_PLATAFORMA%/}"
DOMINIO="${URL_PLATAFORMA#*://}"; DOMINIO="${DOMINIO%%:*}"
HTTPS=false; [[ "$URL_PLATAFORMA" == https://* ]] && HTTPS=true
AMBIENTE_LOCAL=false; [[ "$DOMINIO" == "localhost" || "$DOMINIO" == "127.0.0.1" ]] && AMBIENTE_LOCAL=true
EMAIL_CERTIFICADO="${2:-contato@$DOMINIO}"
PROXY_EXTERNO=false
if ! $AMBIENTE_LOCAL; then
  PORTAS_PUBLICAS="$($SUDO ss -ltnp '( sport = :80 or sport = :443 )' 2>/dev/null || true)"
  OUTROS_PROXY="$(printf '%s\n' "$PORTAS_PUBLICAS" | sed '1d' | sed '/^[[:space:]]*$/d' | grep -v 'nginx' || true)"
  if [[ -n "$OUTROS_PROXY" ]]; then
    PROXY_EXTERNO=true
    echo "Proxy externo detectado nas portas 80/443; ele será preservado:"
    printf '%s\n' "$OUTROS_PROXY"
  fi
fi

echo "[1/9] Verificando sistema e dependências..."
$SUDO apt-get update
$SUDO apt-get install -y ca-certificates curl gnupg openssl dnsutils
if ! command -v docker >/dev/null; then curl -fsSL https://get.docker.com | $SUDO sh; fi
if ! docker compose version >/dev/null 2>&1; then $SUDO apt-get install -y docker-compose-plugin; fi
$SUDO systemctl enable --now docker
if ! command -v node >/dev/null || [[ "$(node -p 'Number(process.versions.node.split(`.`)[0])')" -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
fi

echo "[2/9] Preservando e completando a configuração..."
if [[ ! -f .env ]]; then
  cp .env.example .env
  SENHA_BANCO="$(openssl rand -hex 24)"; SENHA_REDIS="$(openssl rand -hex 32)"
  SENHA_ADMIN="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)A1!"; SEGREDO_EMAIL="$(openssl rand -hex 32)"
  definir_env POSTGRES_SENHA "$SENHA_BANCO"
  definir_env DATABASE_URL "postgresql://moveon:$SENHA_BANCO@127.0.0.1:5434/moveon"
  definir_env REDIS_SENHA "$SENHA_REDIS"; definir_env REDIS_URL "redis://:$SENHA_REDIS@127.0.0.1:6380"
  definir_env ADMIN_SENHA "$SENHA_ADMIN"; definir_env EMAIL_SEGREDO_CANCELAMENTO "$SEGREDO_EMAIL"
  printf 'Credenciais iniciais: admin@moveon / %s\n' "$SENHA_ADMIN" > CREDENCIAIS-INICIAIS.txt
  chmod 600 CREDENCIAIS-INICIAIS.txt
else cp .env ".env.backup.$(date +%Y%m%d%H%M%S)"; fi

[[ -n "$(valor_env REDIS_SENHA)" ]] || definir_env REDIS_SENHA "$(openssl rand -hex 32)"
[[ -n "$(valor_env REDIS_IMAGEM)" ]] || definir_env REDIS_IMAGEM "redis:8-alpine"
[[ -n "$(valor_env REDIS_CONTAINER)" ]] || definir_env REDIS_CONTAINER "moveon_redis"
[[ -n "$(valor_env REDIS_HOST)" ]] || definir_env REDIS_HOST "127.0.0.1"
[[ -n "$(valor_env REDIS_PORTA)" ]] || definir_env REDIS_PORTA "6380"
[[ -n "$(valor_env REDIS_PREFIXO)" ]] || definir_env REDIS_PREFIXO "moveon"
definir_env REDIS_ATIVO true
definir_env REDIS_URL "redis://:$(valor_env REDIS_SENHA)@127.0.0.1:$(valor_env REDIS_PORTA)"
definir_env URL_PUBLICA_PORTAL "$URL_PLATAFORMA"
definir_env ORIGENS_PERMITIDAS "$URL_PLATAFORMA,http://localhost:3000,http://127.0.0.1:3000"
definir_env NODE_ENV production
if $HTTPS; then definir_env COOKIE_SEGURO true; else definir_env COOKIE_SEGURO false; fi
chmod 600 .env

echo "[3/9] Instalando versões validadas..."
mkdir -p .estado-instalacao
HASH_DEPENDENCIAS="$(sha256sum package-lock.json 2>/dev/null | awk '{print $1}' || true)"
HASH_INSTALADO="$(cat .estado-instalacao/package-lock.sha256 2>/dev/null || true)"
if [[ ! -d node_modules || -z "$HASH_DEPENDENCIAS" || "$HASH_DEPENDENCIAS" != "$HASH_INSTALADO" ]]; then
  if [[ -f package-lock.json ]]; then npm ci || { npm cache verify; npm ci; }
  else npm install || { npm cache verify; npm install; }; fi
  [[ -n "$HASH_DEPENDENCIAS" ]] && printf '%s\n' "$HASH_DEPENDENCIAS" > .estado-instalacao/package-lock.sha256
  npm audit || true
else
  echo "Dependências não mudaram; instalação preservada."
fi

echo "[4/9] Iniciando PostgreSQL e Redis..."
if ! $SUDO docker compose up -d --wait --wait-timeout 90 banco redis; then
  echo "Primeira verificação falhou; reiniciando apenas os containers do MOVE.ON..." >&2
  $SUDO docker compose restart banco redis
  if ! $SUDO docker compose up -d --wait --wait-timeout 60 banco redis; then
    $SUDO docker compose ps
    $SUDO docker compose logs --tail 80 banco redis
    echo "PostgreSQL ou Redis não ficou saudável dentro do limite." >&2
    exit 1
  fi
fi
echo "PostgreSQL e Redis saudáveis."

echo "[5/9] Aplicando banco e validando o código..."
npm run banco:migrar; npm run banco:semear; npm run tipos; npm run build
mkdir -p logs uploads/capas uploads/perfis

echo "[6/9] Configurando reinício automático..."
USUARIO_SERVICO="${SUDO_USER:-$(id -un)}"; GRUPO_SERVICO="$(id -gn "$USUARIO_SERVICO")"
CAMINHO_NPM="$(command -v npm)"; ARQUIVO_SERVICO="$(mktemp)"
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
$SUDO systemctl daemon-reload; $SUDO systemctl enable moveon.service; $SUDO systemctl restart moveon.service

echo "[7/9] Verificando a aplicação local..."
for tentativa in {1..30}; do
  if curl -fsS http://127.0.0.1:3001/api/saude >/dev/null 2>&1 && curl -fsS http://127.0.0.1:3000 >/dev/null 2>&1; then break; fi
  sleep 2
  if [[ $tentativa -eq 30 ]]; then
    $SUDO systemctl status moveon.service --no-pager || true
    $SUDO journalctl -u moveon.service -n 100 --no-pager || true
    exit 1
  fi
done

echo "[8/9] Configurando proxy reverso e HTTPS..."
PROXY_GERENCIADO=false
if ! $AMBIENTE_LOCAL && ! $PROXY_EXTERNO; then
  "$RAIZ/scripts/configurar-nginx.sh" "$DOMINIO" "$EMAIL_CERTIFICADO"
  PROXY_GERENCIADO=true
elif $PROXY_EXTERNO; then
  echo "Configuração NGINX ignorada: o encaminhamento do domínio para 127.0.0.1:3000 pertence ao proxy externo."
fi

echo "[9/9] Auditoria final..."
$SUDO systemctl is-enabled --quiet moveon.service; $SUDO systemctl is-active --quiet moveon.service
$SUDO docker compose ps --status running | grep -q banco
$SUDO docker compose ps --status running | grep -q redis
if $PROXY_GERENCIADO; then $SUDO nginx -t; fi
# Valida o origin diretamente; o Cloudflare pode responder com desafio 403
# para clientes de terminal mesmo quando o portal está saudável.
if $PROXY_GERENCIADO && $HTTPS; then
  curl --noproxy '*' -fsS --max-time 15 --resolve "$DOMINIO:443:127.0.0.1" "https://$DOMINIO" >/dev/null
elif ! $PROXY_EXTERNO; then
  curl -fsS --max-time 15 "$URL_PLATAFORMA" >/dev/null
fi
if $PROXY_EXTERNO; then
  echo "MOVE.ON instalado/atualizado e saudável em 127.0.0.1:3000. O proxy externo deve publicar $URL_PLATAFORMA."
else
  echo "MOVE.ON instalado/atualizado com sucesso em $URL_PLATAFORMA"
fi
