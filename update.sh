#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "❌ Fichier .env manquant dans $(pwd)"
  echo "   Lance d'abord : cp .env.production.example .env"
  exit 1
fi

if [ ! -d .git ]; then
  echo "❌ Ce dossier n'est pas un dépôt git."
  exit 1
fi

echo "═══════════════════════════════════════"
echo "  Try Fit — Mise à jour depuis GitHub"
echo "═══════════════════════════════════════"
echo ""

BRANCH="${1:-main}"
REMOTE="${GIT_REMOTE:-origin}"

echo "→ Récupération de ${REMOTE}/${BRANCH}..."
git fetch "${REMOTE}" "${BRANCH}"

LOCAL="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse "${REMOTE}/${BRANCH}")"

if [ "${LOCAL}" = "${REMOTE_SHA}" ]; then
  echo "✓ Déjà à jour ($(git log -1 --oneline))"
else
  echo "→ Nouvelle version disponible :"
  git log --oneline "${LOCAL}..${REMOTE_SHA}" | sed 's/^/   /'
  echo ""
  git pull --ff-only "${REMOTE}" "${BRANCH}"
  echo "✓ Code mis à jour"
fi

echo ""
echo "→ Rebuild et redémarrage Docker..."
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

echo ""
echo "→ Nettoyage des anciennes images..."
docker image prune -f >/dev/null 2>&1 || true

# shellcheck disable=SC1091
set -a && source .env && set +a
APP_PORT="${APP_PORT:-82}"

echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Mise à jour terminée"
echo "  App : http://$(hostname -I | awk '{print $1}'):${APP_PORT}"
echo "═══════════════════════════════════════"
echo ""
docker compose -f docker-compose.prod.yml ps
