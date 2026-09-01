#!/usr/bin/env bash
set -Eeuo pipefail

DOMINIO_MOVEON="${1:?Informe o domínio sem protocolo.}"
EMAIL_CERTIFICADO="${2:?Informe o e-mail do certificado.}"
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"
DATA="$(date +%Y%m%d%H%M%S)"
PASTA_BACKUP="/var/backups/moveon-proxy-$DATA"
RAIZ_ACME="/var/www/letsencrypt"
DOMINIOS=("$DOMINIO_MOVEON" "painel.orkeep.com" "stream.orkeep.com" "realtime.orkeep.com" "mini-tarefas.apps.orkeep.com")
CADDY_ATIVO=false
NGINX_ATIVO=false
MIGRACAO_CONCLUIDA=false

restaurar() {
  local codigo=$?
  trap - EXIT
  if [[ $codigo -ne 0 && "$MIGRACAO_CONCLUIDA" != true ]]; then
    echo "Falha na substituição; restaurando a configuração anterior..." >&2
    $SUDO systemctl stop nginx 2>/dev/null || true
    if [[ -d "$PASTA_BACKUP/caddy" ]]; then $SUDO cp -a "$PASTA_BACKUP/caddy/." /etc/caddy/; fi
    $SUDO rm -f /etc/nginx/sites-available/{moveon,painel-orkeep,stream-orkeep,realtime-orkeep,mini-tarefas}.conf
    $SUDO rm -f /etc/nginx/sites-enabled/{moveon,painel-orkeep,stream-orkeep,realtime-orkeep,mini-tarefas}.conf
    if [[ -d "$PASTA_BACKUP/nginx" ]]; then $SUDO cp -a "$PASTA_BACKUP/nginx/." /etc/nginx/; fi
    if $CADDY_ATIVO; then
      $SUDO systemctl enable caddy 2>/dev/null || true
      $SUDO systemctl restart caddy 2>/dev/null || true
    fi
    if $NGINX_ATIVO; then $SUDO systemctl restart nginx 2>/dev/null || true; fi
  fi
  exit "$codigo"
}
trap restaurar EXIT

$SUDO mkdir -p "$PASTA_BACKUP"
$SUDO chmod 700 "$PASTA_BACKUP"
if $SUDO systemctl is-active --quiet caddy 2>/dev/null; then CADDY_ATIVO=true; fi
if $SUDO systemctl is-active --quiet nginx 2>/dev/null; then NGINX_ATIVO=true; fi
[[ -d /etc/caddy ]] && $SUDO cp -a /etc/caddy "$PASTA_BACKUP/caddy"
[[ -d /etc/nginx ]] && $SUDO cp -a /etc/nginx "$PASTA_BACKUP/nginx"

CONFIGURACAO_CADDY="$(mktemp)"
if ! curl -fsS --max-time 5 http://127.0.0.1:2019/config/ > "$CONFIGURACAO_CADDY"; then
  echo "Não foi possível ler a configuração ativa do Caddy." >&2; exit 1
fi
$SUDO apt-get install -y jq
ROTA_AUTENTICACAO="$(jq -r '.. | objects | .rewrite?.uri? // empty' "$CONFIGURACAO_CADDY" | grep '^/runtime-auth/' | head -n 1)"
UPSTREAM_MINI_TAREFAS="$(jq -r '.. | objects | .dial? // empty' "$CONFIGURACAO_CADDY" | grep -E '^[0-9.]+:8080$' | head -n 1)"
rm -f "$CONFIGURACAO_CADDY"
[[ -n "$ROTA_AUTENTICACAO" ]] || { echo "Rota de autenticação do mini-tarefas não encontrada." >&2; exit 1; }
[[ -n "$UPSTREAM_MINI_TAREFAS" ]] || { echo "Upstream do mini-tarefas não encontrado." >&2; exit 1; }
[[ -S /run/php/vupi.us.sock ]] || { echo "Socket PHP-FPM /run/php/vupi.us.sock não encontrado." >&2; exit 1; }

# NGINX não pode assumir as portas enquanto o Caddy estiver escutando nelas.
if $CADDY_ATIVO; then $SUDO systemctl stop caddy; fi
$SUDO apt-get install -y nginx certbot
$SUDO mkdir -p "$RAIZ_ACME/.well-known/acme-challenge" /etc/nginx/sites-available /etc/nginx/sites-enabled

criar_http() {
  local dominio="$1" arquivo="/etc/nginx/sites-available/$2.conf"
  local temporario="$(mktemp)"
  cat > "$temporario" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $dominio;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; default_type text/plain; }
    location / { return 301 https://\$host\$request_uri; }
}
EOF
  $SUDO install -m 0644 "$temporario" "$arquivo"
  rm -f "$temporario"
  $SUDO ln -sfn "$arquivo" "/etc/nginx/sites-enabled/$2.conf"
}

criar_http "$DOMINIO_MOVEON" moveon
criar_http painel.orkeep.com painel-orkeep
criar_http stream.orkeep.com stream-orkeep
criar_http realtime.orkeep.com realtime-orkeep
criar_http mini-tarefas.apps.orkeep.com mini-tarefas
$SUDO nginx -t
$SUDO systemctl enable --now nginx
$SUDO systemctl reload nginx

for dominio in "${DOMINIOS[@]}"; do
  if ! dig +short A "$dominio" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'; then
    echo "O domínio $dominio não possui registro DNS A." >&2; exit 1
  fi
  $SUDO certbot certonly --webroot -w "$RAIZ_ACME" -d "$dominio" \
    --non-interactive --agree-tos --email "$EMAIL_CERTIFICADO" --keep-until-expiring
done

cabecalhos_seguranca() {
  cat <<'EOF'
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()" always;
EOF
}

ARQUIVO="$(mktemp)"
cat > "$ARQUIVO" <<EOF
server {
    listen 80; listen [::]:80; server_name $DOMINIO_MOVEON;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl http2; listen [::]:443 ssl http2;
    server_name $DOMINIO_MOVEON;
    ssl_certificate /etc/letsencrypt/live/$DOMINIO_MOVEON/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMINIO_MOVEON/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    client_max_body_size 260M;
$(cabecalhos_seguranca)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 10s; proxy_read_timeout 120s; proxy_send_timeout 120s;
    }
}
EOF
$SUDO install -m 0644 "$ARQUIVO" /etc/nginx/sites-available/moveon.conf
rm -f "$ARQUIVO"

ARQUIVO="$(mktemp)"
cat > "$ARQUIVO" <<EOF
server {
    listen 80; listen [::]:80; server_name painel.orkeep.com;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl http2; listen [::]:443 ssl http2;
    server_name painel.orkeep.com;
    ssl_certificate /etc/letsencrypt/live/painel.orkeep.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/painel.orkeep.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    root /var/www/vupi/public;
    client_max_body_size 10M;
    gzip on; gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    access_log off;
$(cabecalhos_seguranca)
    if (\$http_user_agent ~* "(sqlmap|nikto|nmap|masscan|nuclei|dirbuster|gobuster|wfuzz|ffuf|feroxbuster|hydra|acunetix|nessus|openvas|zgrab|libwww-perl|scrapy)") { return 403; }
    location ~ ^/(\.env|\.git|.*\.(json|lock|md|sh|sql|ya?ml)) { return 404; }
    location ~* \.(css|js|png|jpe?g|gif|svg|ico|woff2?|ttf|webp)$ {
        try_files \$uri =404;
        expires 1y; add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location / {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/vupi/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
        fastcgi_param HTTPS on;
        fastcgi_pass unix:/run/php/vupi.us.sock;
    }
}
EOF
$SUDO install -m 0644 "$ARQUIVO" /etc/nginx/sites-available/painel-orkeep.conf
rm -f "$ARQUIVO"

ARQUIVO="$(mktemp)"
cat > "$ARQUIVO" <<EOF
server {
    listen 80; listen [::]:80; server_name stream.orkeep.com;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl http2; listen [::]:443 ssl http2;
    server_name stream.orkeep.com;
    ssl_certificate /etc/letsencrypt/live/stream.orkeep.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stream.orkeep.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3; client_max_body_size 1M; access_log off;
$(cabecalhos_seguranca)
    location = /api/dashboard/stream {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/vupi/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
        fastcgi_param HTTPS on;
        fastcgi_pass unix:/run/php/vupi.us.sock;
        fastcgi_buffering off; fastcgi_read_timeout 1h;
        add_header X-Accel-Buffering "no" always;
    }
    location / { return 404; }
}
EOF
$SUDO install -m 0644 "$ARQUIVO" /etc/nginx/sites-available/stream-orkeep.conf
rm -f "$ARQUIVO"

ARQUIVO="$(mktemp)"
cat > "$ARQUIVO" <<EOF
server {
    listen 80; listen [::]:80; server_name realtime.orkeep.com;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl http2; listen [::]:443 ssl http2;
    server_name realtime.orkeep.com;
    ssl_certificate /etc/letsencrypt/live/realtime.orkeep.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/realtime.orkeep.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3; gzip on;
$(cabecalhos_seguranca)
    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade \$http_upgrade; proxy_set_header Connection "upgrade";
        proxy_buffering off; proxy_read_timeout 1h; proxy_send_timeout 1h;
    }
}
EOF
$SUDO install -m 0644 "$ARQUIVO" /etc/nginx/sites-available/realtime-orkeep.conf
rm -f "$ARQUIVO"

ARQUIVO="$(mktemp)"
cat > "$ARQUIVO" <<EOF
server {
    listen 80; listen [::]:80; server_name mini-tarefas.apps.orkeep.com;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; }
    location / { return 301 https://\$host\$request_uri; }
}
server {
    listen 443 ssl http2; listen [::]:443 ssl http2;
    server_name mini-tarefas.apps.orkeep.com;
    ssl_certificate /etc/letsencrypt/live/mini-tarefas.apps.orkeep.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mini-tarefas.apps.orkeep.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3; client_max_body_size 16M; gzip on;
$(cabecalhos_seguranca)
    location = /_vupi_autorizacao {
        internal; proxy_pass http://127.0.0.1:8090$ROTA_AUTENTICACAO;
        proxy_method GET; proxy_pass_request_body off; proxy_set_header Content-Length "";
        proxy_set_header X-Api-Key \$http_x_api_key;
        proxy_set_header X-Forwarded-Method \$request_method;
        proxy_set_header X-Forwarded-Uri \$request_uri;
        proxy_set_header X-Vupi-Auth-Proxy caddy;
        proxy_set_header X-Vupi-Ide-Authorization \$http_x_vupi_ide_authorization;
    }
    location / {
        auth_request /_vupi_autorizacao;
        auth_request_set \$vupi_autorizado \$upstream_http_x_vupi_gateway_authorized;
        proxy_pass http://$UPSTREAM_MINI_TAREFAS;
        proxy_http_version 1.1;
        proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Vupi-Gateway-Authorized \$vupi_autorizado;
        proxy_set_header X-API-Key ""; proxy_set_header X-Vupi-IDE-Authorization "";
        proxy_set_header Upgrade \$http_upgrade; proxy_set_header Connection "upgrade";
    }
}
EOF
$SUDO install -m 0644 "$ARQUIVO" /etc/nginx/sites-available/mini-tarefas.conf
rm -f "$ARQUIVO"

$SUDO nginx -t
$SUDO systemctl reload nginx

# Testes diretos no origin, ignorando desafios do Cloudflare.
for dominio in "${DOMINIOS[@]}"; do
  codigo="$(curl -ksS --max-time 20 --resolve "$dominio:443:127.0.0.1" -o /dev/null -w '%{http_code}' "https://$dominio" || true)"
  [[ "$codigo" != "000" && "$codigo" -lt 500 ]] || { echo "Teste falhou em $dominio (HTTP $codigo)." >&2; exit 1; }
done
curl -fsS --max-time 20 --resolve "$DOMINIO_MOVEON:443:127.0.0.1" "https://$DOMINIO_MOVEON" >/dev/null

HOOK="$(mktemp)"
cat > "$HOOK" <<'EOF'
#!/usr/bin/env bash
nginx -t && systemctl reload nginx
EOF
$SUDO install -m 0755 "$HOOK" /etc/letsencrypt/renewal-hooks/deploy/recarregar-nginx
rm -f "$HOOK"
$SUDO systemctl enable --now certbot.timer 2>/dev/null || true

$SUDO systemctl disable caddy 2>/dev/null || true
$SUDO systemctl stop caddy 2>/dev/null || true
$SUDO systemctl enable nginx
MIGRACAO_CONCLUIDA=true
echo "Substituição completa: NGINX atende os cinco domínios e Caddy está desativado. Backup: $PASTA_BACKUP"
