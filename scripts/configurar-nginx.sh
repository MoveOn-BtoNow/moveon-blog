#!/usr/bin/env bash
set -Eeuo pipefail

DOMINIO="${1:?Informe o domínio sem protocolo.}"
EMAIL_CERTIFICADO="${2:?Informe o e-mail do certificado.}"
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"
SITE_NGINX="/etc/nginx/sites-available/moveon-${DOMINIO}.conf"
LINK_NGINX="/etc/nginx/sites-enabled/moveon-${DOMINIO}.conf"
RAIZ_ACME="/var/www/letsencrypt"
BACKUP_SITE=""
CONFIGURACAO_CONCLUIDA=false

restaurar_site() {
  local codigo=$?
  trap - EXIT
  if [[ $codigo -ne 0 && "$CONFIGURACAO_CONCLUIDA" != true ]]; then
    echo "Falha na configuração MOVE.ON; restaurando somente seu virtual host..." >&2
    if [[ -n "$BACKUP_SITE" && -f "$BACKUP_SITE" ]]; then
      $SUDO cp "$BACKUP_SITE" "$SITE_NGINX"
    else
      $SUDO rm -f "$SITE_NGINX" "$LINK_NGINX"
    fi
    if command -v nginx >/dev/null && $SUDO nginx -t >/dev/null 2>&1; then
      $SUDO systemctl reload nginx 2>/dev/null || true
    fi
  fi
  exit "$codigo"
}
trap restaurar_site EXIT

# Nunca toma portas pertencentes a Caddy, Apache, HAProxy ou outra aplicação.
OCUPANTES="$($SUDO ss -ltnp '( sport = :80 or sport = :443 )' 2>/dev/null || true)"
OUTROS_OCUPANTES="$(printf '%s\n' "$OCUPANTES" | sed '1d' | sed '/^[[:space:]]*$/d' | grep -v 'nginx' || true)"
if [[ -n "$OUTROS_OCUPANTES" ]]; then
  echo "As portas 80/443 já pertencem a outro serviço:" >&2
  printf '%s\n' "$OUTROS_OCUPANTES" >&2
  echo "Nada foi alterado. Use uma VPS livre, um domínio no proxy existente ou migre esse proxy fora do instalador MOVE.ON." >&2
  exit 1
fi

$SUDO apt-get install -y nginx certbot
$SUDO mkdir -p "$RAIZ_ACME/.well-known/acme-challenge" /etc/nginx/sites-available /etc/nginx/sites-enabled
if [[ -f "$SITE_NGINX" ]]; then BACKUP_SITE="$(mktemp)"; $SUDO cp "$SITE_NGINX" "$BACKUP_SITE"; fi

# Protege virtual hosts preexistentes que já reivindiquem o mesmo domínio.
while IFS= read -r arquivo_existente; do
  [[ -z "$arquivo_existente" || "$arquivo_existente" == "$SITE_NGINX" || "$arquivo_existente" == "$LINK_NGINX" ]] && continue
  echo "O domínio $DOMINIO já está configurado por $arquivo_existente. Nada foi sobrescrito." >&2
  exit 1
done < <($SUDO grep -RslE "server_name[[:space:]]+([^;[:space:]]+[[:space:]]+)*${DOMINIO//./\\.}([[:space:];]|$)" /etc/nginx/sites-available /etc/nginx/conf.d 2>/dev/null || true)

ARQUIVO_TEMPORARIO="$(mktemp)"
cat > "$ARQUIVO_TEMPORARIO" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMINIO;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; default_type text/plain; }
    location / { return 301 https://\$host\$request_uri; }
}
EOF
$SUDO install -m 0644 "$ARQUIVO_TEMPORARIO" "$SITE_NGINX"
rm -f "$ARQUIVO_TEMPORARIO"
$SUDO ln -sfn "$SITE_NGINX" "$LINK_NGINX"
$SUDO nginx -t
$SUDO systemctl enable --now nginx
$SUDO systemctl reload nginx

if ! dig +short A "$DOMINIO" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "O domínio $DOMINIO não possui registro DNS A; o certificado não pode ser emitido." >&2
  exit 1
fi
if [[ ! -f "/etc/letsencrypt/live/$DOMINIO/fullchain.pem" ]]; then
  $SUDO certbot certonly --webroot -w "$RAIZ_ACME" -d "$DOMINIO" \
    --non-interactive --agree-tos --email "$EMAIL_CERTIFICADO"
fi

ARQUIVO_TEMPORARIO="$(mktemp)"
cat > "$ARQUIVO_TEMPORARIO" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMINIO;
    location ^~ /.well-known/acme-challenge/ { root $RAIZ_ACME; default_type text/plain; }
    location / { return 301 https://\$host\$request_uri; }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name $DOMINIO;
    ssl_certificate /etc/letsencrypt/live/$DOMINIO/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMINIO/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    client_max_body_size 260M;
    server_tokens off;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()" always;

    location ^~ /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_connect_timeout 10s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

    location ^~ /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_connect_timeout 10s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 10s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }
}
EOF
$SUDO install -m 0644 "$ARQUIVO_TEMPORARIO" "$SITE_NGINX"
rm -f "$ARQUIVO_TEMPORARIO"
$SUDO nginx -t
$SUDO systemctl reload nginx
$SUDO systemctl is-active --quiet nginx
$SUDO ss -ltnp '( sport = :443 )' | grep -q nginx

curl --noproxy '*' -fsS --max-time 15 --resolve "$DOMINIO:443:127.0.0.1" "https://$DOMINIO" >/dev/null
curl --noproxy '*' -fsS --max-time 15 --resolve "$DOMINIO:443:127.0.0.1" "https://$DOMINIO/api/saude" >/dev/null

HOOK="$(mktemp)"
cat > "$HOOK" <<'EOF'
#!/usr/bin/env bash
nginx -t && systemctl reload nginx
EOF
$SUDO install -m 0755 "$HOOK" /etc/letsencrypt/renewal-hooks/deploy/recarregar-nginx-moveon
rm -f "$HOOK"
$SUDO systemctl enable --now certbot.timer 2>/dev/null || true

CONFIGURACAO_CONCLUIDA=true
[[ -n "$BACKUP_SITE" ]] && rm -f "$BACKUP_SITE"
echo "NGINX e HTTPS configurados exclusivamente para $DOMINIO."
