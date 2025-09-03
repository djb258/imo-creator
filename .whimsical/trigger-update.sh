#!/bin/bash
# Manually trigger Whimsical update for imo-creator

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
CONFIG_FILE="$REPO_ROOT/.whimsical/config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: .whimsical/config.json not found"
    exit 1
fi

WEBHOOK_URL="http://localhost:3007/trigger"
REPO_NAME="imo-creator"
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "local")

echo "Triggering Whimsical update for: $REPO_NAME"
echo "Webhook URL: $WEBHOOK_URL"

curl -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{
        \"repo_url\": \"$REPO_URL\",
        \"repo_name\": \"$REPO_NAME\",
        \"ref\": \"main\"
    }"

echo ""
echo "You can also run the Python visualizer directly:"
echo "python tools/whimsical_visualizer.py . --export-only"