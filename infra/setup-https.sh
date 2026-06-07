#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-}"
APP_PORT="${APP_PORT:-82}"
EMAIL="${2:-}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: ./infra/setup-https.sh ton-domaine.com [email@exemple.com]"
  echo ""
  echo "Prérequis : un enregistrement DNS A pointant vers ce serveur."
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "Installation de nginx et certbot..."
  apt update
  apt install -y nginx certbot python3-certbot-nginx
  systemctl enable nginx
  systemctl start nginx
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_PATH="/etc/nginx/sites-available/tryfit"

sed "s/__DOMAIN__/${DOMAIN}/g; s/__PORT__/${APP_PORT}/g" \
  "$SCRIPT_DIR/nginx-tryfit.conf.template" > "$CONFIG_PATH"

ln -sf "$CONFIG_PATH" /etc/nginx/sites-enabled/tryfit

nginx -t
systemctl reload nginx

CERTBOT_ARGS=(--nginx -d "$DOMAIN" --redirect)
if [ -n "$EMAIL" ]; then
  CERTBOT_ARGS+=(--email "$EMAIL" --agree-tos)
else
  CERTBOT_ARGS+=(--register-unsafely-without-email --agree-tos)
fi

echo "Obtention du certificat Let's Encrypt pour ${DOMAIN}..."
certbot "${CERTBOT_ARGS[@]}"

ufw allow 443 2>/dev/null || true

echo ""
echo "HTTPS activé : https://${DOMAIN}"
echo "Le renouvellement est automatique via certbot."
