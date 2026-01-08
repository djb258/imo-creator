#!/bin/bash
# push-doctrine-update.sh
# Commits and pushes doctrine updates to GitHub
# Run from imo-creator root: ./scripts/push-doctrine-update.sh

set -e

REPO_PATH="$(cd "$(dirname "$0")/.." && pwd)"
MESSAGE="${1:-"Update doctrine: Add REPO_REFACTOR_PROTOCOL.md"}"

cd "$REPO_PATH"

echo "[GIT] Repository: $REPO_PATH"
echo "[GIT] Checking status..."
git status --short

echo ""
echo "[GIT] Adding doctrine files..."
git add templates/doctrine/

echo "[GIT] Committing: $MESSAGE"
git commit -m "$MESSAGE"

echo "[GIT] Pushing to origin..."
git push origin master

echo ""
echo "[DONE] Doctrine updated on GitHub"
