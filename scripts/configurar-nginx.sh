#!/usr/bin/env bash
set -Eeuo pipefail

DOMINIO="${1:?Informe o domínio sem protocolo.}"
EMAIL_CERTIFICADO="${2:?Informe o e-mail do certificado.}"
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"
SITE_NGINX="/etc/nginx/sites-available/moveon-${DOMINIO}.conf"
LINK_NGINX="/etc/nginx/sites-enabled/moveon-${DOMINIO}.conf"
CADDY_ESTAVA_ATIVO=false
MIGRACAO_CONCLUIDA=false
BACKUP_SITE=""

restaurar_proxy_anterior() {
  local codigo=$?
  if [[ $codigo -ne 0 && "$MIGRACAO_CONCLUIDA" != true ]]; then
    echo "A configuração NGINX falhou; restaurando o proxy anterior..." >&2
    if [[ -n "$BACKUP_SITE" && -f "$BACKUP_SITE" ]]; then
      $SUDO cp "$BACKUP_SITE" "$SITE_NGINX"
    else
      $SUDO rm -f "$SITE_NGINX" "$LINK_NGINX"
    fi
    $SUDO nginx -t >/dev/null 2>&1 && $SUDO systemctl reload nginx 2>/dev/null || true
    if $CADDY_ESTAVA_ATIVO; then
      $SUDO systemctl stop nginx 2>/dev/null || true
      $SUDO systemctl start caddy 2>/dev/null || true
    fi
  fi
  exit "$codigo"
}
trap restaurar_proxy_anterior EXIT

if $SUDO systemctl is-active --quiet caddy 2>/dev/null; then
  CADDY_ESTAVA_ATIVO=true
  $SUDO apt-get install -y jq
  CONFIGURACAO_CADDY="$(mktemp)"
  if ! curl -fsS --max-time 5 http://127.0.0.1:2019/config/ > "$CONFIGURACAO_CADDY"; then
    if [[ -f /etc/caddy/Caddyfile ]]; then
      $SUDO caddy adapt --config /etc/caddy/Caddyfile --pretty > "$CONFIGURACAO_CADDY"
    else
      echo "Não foi possível auditar a configuração ativa do Caddy. Nada foi alterado." >&2
      exit 1
    fi
  fi
  mapfile -t DOMINIOS_CADDY < <(jq -r '.. | objects | .host? // empty | .[]?' "$CONFIGURACAO_CADDY" | sort -u)
  rm -f "$CONFIGURACAO_CADDY"
  OUTROS_DOMINIOS=()
  for dominio_caddy in "${DOMINIOS_CADDY[@]}"; do
    [[ "$dominio_caddy" == "$DOMINIO" ]] || OUTROS_DOMINIOS+=("$dominio_caddy")
  done
  if [[ ${#DOMINIOS_CADDY[@]} -eq 0 ]]; then
    echo "O Caddy não declarou hosts auditáveis. Migração automática cancelada para proteger outras aplicações." >&2
    exit 1
  fi
  if [[ ${#OUTROS_DOMINIOS[@]} -gt 0 ]]; then
    echo "O Caddy também atende: ${OUTROS_DOMINIOS[*]}. Migração cancelada para não interromper esses sites." >&2
    exit 1
  fi
  echo "Caddy atende somente $DOMINIO; iniciando migração protegida para NGINX."
  $SUDO systemctl stop caddy
fi

if ! command -v nginx >/dev/null; then $SUDO apt-get install -y nginx; fi
$SUDO apt-get install -y certbot python3-certbot-nginx
if [[ -f "$SITE_NGINX" ]]; then
  BACKUP_SITE="$(mktemp)"; $SUDO cp "$SITE_NGINX" "$BACKUP_SITE"
fi

ARQUIVO_TEMPORARIO="$(mktemp)"
cat > "$ARQUIVO_TEMPORARIO" <<EOF
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
        proxy_connect_timeout 10s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }
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
$SUDO certbot --nginx -d "$DOMINIO" --non-interactive --agree-tos \
  --email "$EMAIL_CERTIFICADO" --redirect --keep-until-expiring
$SUDO nginx -t
$SUDO systemctl reload nginx
$SUDO systemctl enable --now certbot.timer 2>/dev/null || true

for tentativa in {1..12}; do
  curl -fsS --max-time 10 "https://$DOMINIO" >/dev/null && break
  sleep 5
  [[ $tentativa -eq 12 ]] && { echo "HTTPS não respondeu após a configuração." >&2; exit 1; }
done

if $CADDY_ESTAVA_ATIVO; then $SUDO systemctl disable caddy 2>/dev/null || true; fi
MIGRACAO_CONCLUIDA=true
[[ -n "$BACKUP_SITE" ]] && rm -f "$BACKUP_SITE"
echo "NGINX e HTTPS configurados para $DOMINIO sem alterar outros virtual hosts."
