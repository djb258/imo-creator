#!/bin/bash
# Garage-MCP pre-process hook: Seed CTB if needed
REPO_PATH="$1"
FACTORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/factory"

echo "[GARAGE-MCP] Pre-processing CTB for: $(basename "$REPO_PATH")"

if [ ! -f "$REPO_PATH/tools/generate_ctb.py" ]; then
    echo "[GARAGE-MCP] Seeding CTB generator..."
    python3 "$FACTORY_DIR/auto_seed_ctb.py" "$REPO_PATH" \
        --project-name "$(basename "$REPO_PATH" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')"
else
    echo "[GARAGE-MCP] CTB generator already present"
fi
