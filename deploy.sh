#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Fichier .env manquant. Copie .env.production.example vers .env et remplis les valeurs."
  exit 1
fi

docker compose -f docker-compose.prod.yml pull db 2>/dev/null || true
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "Déploiement terminé. L'app est accessible sur le port 80."
docker compose -f docker-compose.prod.yml ps
