#!/bin/bash
# Garage-MCP post-process hook: Regenerate CTB docs
REPO_PATH="$1"

echo "[GARAGE-MCP] Post-processing CTB for: $(basename "$REPO_PATH")"

if [ -f "$REPO_PATH/tools/generate_ctb.py" ] && [ -f "$REPO_PATH/spec/process_map.yaml" ]; then
    echo "[GARAGE-MCP] Regenerating CTB docs..."
    cd "$REPO_PATH"
    python3 tools/generate_ctb.py spec/process_map.yaml
    
    # Update ui-build
    mkdir -p ui-build
    for file in docs/ctb_horiz.md docs/catalog.md docs/flows.md docs/altitude/30k.md; do
        if [ -f "$file" ]; then
            cp "$file" "ui-build/$(basename "$file")"
        fi
    done
    
    echo "[GARAGE-MCP] ✓ CTB docs updated"
else
    echo "[GARAGE-MCP] No CTB generator found"
fi
