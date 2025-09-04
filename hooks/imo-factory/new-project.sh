#!/bin/bash
# IMO-Factory new project hook: Auto-seed CTB
PROJECT_PATH="$1" 
PROJECT_NAME="$2"
PROJECT_TYPE="$3"

FACTORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/factory"

echo "[IMO-FACTORY] Setting up CTB for new project: $PROJECT_NAME"

# Seed with project-specific customization
python3 "$FACTORY_DIR/auto_seed_ctb.py" "$PROJECT_PATH" \
    --project-name "$PROJECT_NAME" \
    --owner "IMO-Factory"

# Generate initial docs
cd "$PROJECT_PATH"
if [ -f "tools/generate_ctb.py" ]; then
    python3 tools/generate_ctb.py spec/process_map.json
    echo "[IMO-FACTORY] ✓ Initial CTB docs generated"
fi

echo "[IMO-FACTORY] ✓ CTB integration complete for $PROJECT_NAME"
