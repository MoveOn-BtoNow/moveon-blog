#!/usr/bin/env bash
set -Eeuo pipefail

DOMINIO="${1:?Informe o domínio sem protocolo.}"
SUDO=""; [[ $EUID -ne 0 ]] && SUDO="sudo"
CADDYFILE="/etc/caddy/Caddyfile"
INICIO="# BEGIN MOVEON PORTAL - $DOMINIO"
FIM="# END MOVEON PORTAL - $DOMINIO"
BACKUP="/var/backups/moveon-caddy-$DOMINIO-$(date +%Y%m%d%H%M%S).bak"
CONCLUIDO=false

restaurar() {
  local codigo=$?
  trap - EXIT
  if [[ $codigo -ne 0 && "$CONCLUIDO" != true && -f "$BACKUP" ]]; then
    echo "Falha ao configurar o Caddy; restaurando o Caddyfile anterior..." >&2
    $SUDO cp "$BACKUP" "$CADDYFILE"
    $SUDO systemctl reload caddy 2>/dev/null || $SUDO systemctl restart caddy 2>/dev/null || true
  fi
  exit "$codigo"
}
trap restaurar EXIT

$SUDO systemctl is-active --quiet caddy || { echo "Caddy não está ativo." >&2; exit 1; }
[[ -f "$CADDYFILE" ]] || { echo "Caddyfile não encontrado em $CADDYFILE." >&2; exit 1; }

if ! grep -Fq "$INICIO" "$CADDYFILE"; then
  CONFIGURACAO_ATIVA="$(curl -fsS --max-time 5 http://127.0.0.1:2019/config/ 2>/dev/null || true)"
  if printf '%s' "$CONFIGURACAO_ATIVA" | grep -Fq '"'"$DOMINIO"'"'; then
    if curl --noproxy '*' -fsS --max-time 10 --resolve "$DOMINIO:443:127.0.0.1" "https://$DOMINIO" >/dev/null 2>&1; then
      CONCLUIDO=true
      echo "O domínio $DOMINIO já está configurado e saudável no Caddy."
      exit 0
    fi
    echo "O domínio $DOMINIO já pertence a uma configuração Caddy externa ao MOVE.ON. Nada foi sobrescrito." >&2
    exit 1
  fi
fi
$SUDO install -d -m 0700 /var/backups
$SUDO cp "$CADDYFILE" "$BACKUP"
$SUDO chmod 600 "$BACKUP"

TEMPORARIO="$(mktemp)"
awk -v inicio="$INICIO" -v fim="$FIM" '
  $0 == inicio { ignorar=1; next }
  $0 == fim { ignorar=0; next }
  !ignorar { print }
' "$CADDYFILE" > "$TEMPORARIO"
cat >> "$TEMPORARIO" <<EOF

$INICIO
$DOMINIO {
    encode zstd gzip
    request_body {
        max_size 260MB
    }
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()"
        -Server
        -X-Powered-By
    }
    reverse_proxy 127.0.0.1:3000 {
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
$FIM
EOF
$SUDO install -m 0644 "$TEMPORARIO" "$CADDYFILE"
rm -f "$TEMPORARIO"

if ! $SUDO systemctl reload caddy; then
  $SUDO systemctl restart caddy
fi
$SUDO systemctl is-active --quiet caddy

for tentativa in {1..30}; do
  if curl --noproxy '*' -fsS --max-time 10 --resolve "$DOMINIO:443:127.0.0.1" "https://$DOMINIO" >/dev/null 2>&1; then
    CONCLUIDO=true
    echo "Caddy e HTTPS configurados exclusivamente para $DOMINIO."
    exit 0
  fi
  sleep 3
done
echo "O certificado TLS do Caddy não ficou disponível dentro de 90 segundos." >&2
exit 1
