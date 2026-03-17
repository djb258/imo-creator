#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# INSTALL GIT HOOKS
# ═══════════════════════════════════════════════════════════════════════════════
# Copies doctrine compliance hooks to .git/hooks/
# Run from repo root: ./scripts/install-hooks.sh
# ═══════════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_SRC="$SCRIPT_DIR/hooks"
HOOKS_DEST="$REPO_ROOT/.git/hooks"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  INSTALLING DOCTRINE COMPLIANCE HOOKS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Source:      $HOOKS_SRC"
echo "Destination: $HOOKS_DEST"
echo ""

# Check if we're in a git repo
if [ ! -d "$REPO_ROOT/.git" ]; then
    echo "[ERROR] Not a git repository: $REPO_ROOT"
    exit 1
fi

# Create hooks directory if missing
mkdir -p "$HOOKS_DEST"

# Install pre-commit hook
if [ -f "$HOOKS_SRC/pre-commit" ]; then
    cp "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"
    chmod +x "$HOOKS_DEST/pre-commit"
    echo "[INSTALLED] pre-commit hook"
else
    echo "[SKIP] pre-commit hook not found in source"
fi

echo ""
echo "───────────────────────────────────────────────────────────────"
echo "  DONE"
echo "───────────────────────────────────────────────────────────────"
echo ""
echo "Hooks installed. They will run automatically on git commit."
echo "To bypass (not recommended): git commit --no-verify"
echo ""
