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
PROXY_GERENCIADO=false; OUTRO_PROXY=""
if ! $AMBIENTE_LOCAL; then
  for servico in caddy apache2 haproxy; do
    if $SUDO systemctl is-active --quiet "$servico" 2>/dev/null; then OUTRO_PROXY="$servico"; break; fi
  done
  if [[ -n "$OUTRO_PROXY" ]]; then
    echo "O serviço $OUTRO_PROXY já controla o proxy da VPS. Ele foi preservado; NGINX não será instalado."
  else
    if command -v nginx >/dev/null && ! $SUDO systemctl is-active --quiet nginx 2>/dev/null && $SUDO ss -ltn | grep -Eq ':(80|443)[[:space:]]'; then
      echo "NGINX está parado e as portas 80/443 pertencem a outro processo. Nada foi alterado." >&2; exit 1
    fi
    if ! command -v nginx >/dev/null; then
      if $SUDO ss -ltn | grep -Eq ':(80|443)[[:space:]]'; then
        echo "As portas 80/443 estão ocupadas. Nada foi alterado." >&2; exit 1
      fi
      $SUDO apt-get install -y nginx
    fi
    $SUDO systemctl enable --now nginx
    ARQUIVO_NGINX="$(mktemp)"
    cat > "$ARQUIVO_NGINX" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMINIO;
    client_max_body_size 260M;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }
}
EOF
    $SUDO install -m 0644 "$ARQUIVO_NGINX" /etc/nginx/sites-available/moveon
    rm -f "$ARQUIVO_NGINX"
    $SUDO ln -sfn /etc/nginx/sites-available/moveon /etc/nginx/sites-enabled/moveon
    $SUDO nginx -t; $SUDO systemctl reload nginx; PROXY_GERENCIADO=true
    if $HTTPS; then
      $SUDO apt-get install -y certbot python3-certbot-nginx
      if ! dig +short A "$DOMINIO" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'; then
        echo "O domínio $DOMINIO ainda não possui registro DNS A. Configure o DNS e execute novamente." >&2; exit 1
      fi
      $SUDO certbot --nginx -d "$DOMINIO" --non-interactive --agree-tos --email "$EMAIL_CERTIFICADO" --redirect --keep-until-expiring
    fi
    $SUDO systemctl enable --now certbot.timer 2>/dev/null || true
  fi
fi

echo "[9/9] Auditoria final..."
$SUDO systemctl is-enabled --quiet moveon.service; $SUDO systemctl is-active --quiet moveon.service
$SUDO docker compose ps --status running | grep -q banco
$SUDO docker compose ps --status running | grep -q redis
if $PROXY_GERENCIADO; then $SUDO nginx -t; fi
if ! curl -fsS "$URL_PLATAFORMA" >/dev/null 2>&1; then
  echo "A aplicação local está saudável, mas $URL_PLATAFORMA ainda não respondeu. Verifique DNS, firewall ou o proxy existente." >&2
  [[ -z "$OUTRO_PROXY" ]] && exit 1
fi
echo "MOVE.ON instalado/atualizado com sucesso em $URL_PLATAFORMA"
