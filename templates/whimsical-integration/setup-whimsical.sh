#!/bin/bash
# Whimsical Integration Setup Script
# Run this in any repository to enable automatic Whimsical visualization

set -e

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
WEBHOOK_URL="${WEBHOOK_URL:-http://localhost:3007/webhook/github}"
BOARD_ID="${WHIMSICAL_BOARD_ID:-}"

echo "Setting up Whimsical integration for: $(basename "$REPO_ROOT")"

# Create .whimsical directory
mkdir -p "$REPO_ROOT/.whimsical"

# Create config file
cat > "$REPO_ROOT/.whimsical/config.json" << EOF
{
  "enabled": true,
  "webhook_url": "$WEBHOOK_URL",
  "board_id": "$BOARD_ID",
  "auto_update": true,
  "visualization_types": [
    "architecture",
    "mcp_servers",
    "compliance",
    "relationships"
  ],
  "update_triggers": [
    "push",
    "pull_request_merge"
  ],
  "exclusions": {
    "paths": [
      "node_modules/",
      ".git/",
      "venv/",
      "__pycache__/",
      ".whimsical/"
    ],
    "files": [
      "*.log",
      "*.tmp"
    ]
  },
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "repository": "$(basename "$REPO_ROOT")"
}
EOF

# Create GitHub workflow directory
mkdir -p "$REPO_ROOT/.github/workflows"

# Create GitHub workflow
cat > "$REPO_ROOT/.github/workflows/whimsical-update.yml" << 'EOF'
name: Update Whimsical Diagram

on:
  push:
    branches: [ main, master ]
  pull_request:
    types: [ closed ]
    branches: [ main, master ]

jobs:
  update-whimsical:
    if: github.event_name == 'push' || (github.event.pull_request.merged == true)
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Trigger Whimsical Update
      env:
        WEBHOOK_URL: ${{ secrets.WHIMSICAL_WEBHOOK_URL }}
      run: |
        if [ -n "$WEBHOOK_URL" ]; then
          curl -X POST "$WEBHOOK_URL/trigger" \
            -H "Content-Type: application/json" \
            -d "{
              \"repo_url\": \"${{ github.event.repository.clone_url }}\",
              \"repo_name\": \"${{ github.event.repository.name }}\",
              \"ref\": \"${{ github.ref_name }}\"
            }" || echo "Webhook failed - continuing anyway"
        else
          echo "WHIMSICAL_WEBHOOK_URL secret not configured"
        fi
EOF

# Create local trigger script
cat > "$REPO_ROOT/.whimsical/trigger-update.sh" << EOF
#!/bin/bash
# Manually trigger Whimsical update for this repository

REPO_ROOT=\$(git rev-parse --show-toplevel 2>/dev/null || pwd)
CONFIG_FILE="\$REPO_ROOT/.whimsical/config.json"

if [ ! -f "\$CONFIG_FILE" ]; then
    echo "Error: .whimsical/config.json not found"
    exit 1
fi

WEBHOOK_URL=\$(cat "\$CONFIG_FILE" | python3 -c "import sys, json; print(json.load(sys.stdin)['webhook_url'])")
REPO_NAME=\$(basename "\$REPO_ROOT")
REPO_URL=\$(git remote get-url origin 2>/dev/null || echo "unknown")

echo "Triggering Whimsical update for: \$REPO_NAME"
echo "Webhook URL: \$WEBHOOK_URL"

curl -X POST "\$WEBHOOK_URL/trigger" \\
    -H "Content-Type: application/json" \\
    -d "{
        \"repo_url\": \"\$REPO_URL\",
        \"repo_name\": \"\$REPO_NAME\",
        \"ref\": \"main\"
    }"
EOF

chmod +x "$REPO_ROOT/.whimsical/trigger-update.sh"

# Add to .gitignore if exists
if [ -f "$REPO_ROOT/.gitignore" ]; then
    if ! grep -q ".whimsical/temp" "$REPO_ROOT/.gitignore"; then
        echo "" >> "$REPO_ROOT/.gitignore"
        echo "# Whimsical integration temporary files" >> "$REPO_ROOT/.gitignore"
        echo ".whimsical/temp/" >> "$REPO_ROOT/.gitignore"
    fi
fi

echo "✅ Whimsical integration setup complete!"
echo ""
echo "Next steps:"
echo "1. Set GitHub secrets:"
echo "   - WHIMSICAL_WEBHOOK_URL: $WEBHOOK_URL"
echo "   - WHIMSICAL_API_KEY: your_api_key"
echo "   - WHIMSICAL_BOARD_ID: your_board_id"
echo ""
echo "2. Test the integration:"
echo "   cd '$REPO_ROOT' && ./.whimsical/trigger-update.sh"
echo ""
echo "3. Commit the changes:"
echo "   git add .whimsical .github/workflows/whimsical-update.yml"
echo "   git commit -m 'Add Whimsical integration'"