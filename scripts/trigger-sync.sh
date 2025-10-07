#!/bin/bash

# IMO-Creator Sync Trigger Script
# Usage: ./trigger-sync.sh [target_repo] [sync_type]
# Example: ./trigger-sync.sh sales-hive workflows-only

set -e

# Configuration
REPO_OWNER="djb258"
IMO_CREATOR_REPO="imo-creator"
GITHUB_API="https://api.github.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    cat << EOF
IMO-Creator Sync Trigger Script

USAGE:
    ./trigger-sync.sh [TARGET_REPO] [SYNC_TYPE]

PARAMETERS:
    TARGET_REPO     Repository to sync to (sales-hive, client-hive, outreach-hive, all-repos)
                    Default: all-repos

    SYNC_TYPE       Type of sync operation (workflows-only, configs-only, full-sync)
                    Default: workflows-only

EXAMPLES:
    ./trigger-sync.sh                           # Sync workflows to all repos
    ./trigger-sync.sh sales-hive                # Sync workflows to sales-hive only
    ./trigger-sync.sh client-hive configs-only  # Sync configs to client-hive only
    ./trigger-sync.sh all-repos full-sync       # Full sync to all repos

ENVIRONMENT VARIABLES:
    GITHUB_TOKEN    GitHub personal access token (required)
    REPO_OWNER      GitHub repository owner (default: djb258)

EOF
}

# Parse arguments
TARGET_REPO="${1:-all-repos}"
SYNC_TYPE="${2:-workflows-only}"

# Show help if requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Check for required environment variables
if [[ -z "$GITHUB_TOKEN" ]]; then
    log_error "GITHUB_TOKEN environment variable is required"
    log_info "Get a token from: https://github.com/settings/tokens"
    log_info "Set it with: export GITHUB_TOKEN=your_token_here"
    exit 1
fi

# Validate parameters
valid_repos=("sales-hive" "client-hive" "outreach-hive" "all-repos")
valid_sync_types=("workflows-only" "configs-only" "full-sync")

if [[ ! " ${valid_repos[@]} " =~ " ${TARGET_REPO} " ]]; then
    log_error "Invalid target repository: $TARGET_REPO"
    log_info "Valid options: ${valid_repos[*]}"
    exit 1
fi

if [[ ! " ${valid_sync_types[@]} " =~ " ${SYNC_TYPE} " ]]; then
    log_error "Invalid sync type: $SYNC_TYPE"
    log_info "Valid options: ${valid_sync_types[*]}"
    exit 1
fi

# Create dispatch payload
PAYLOAD=$(cat <<EOF
{
  "event_type": "sync-imo-creator",
  "client_payload": {
    "target_repo": "$TARGET_REPO",
    "sync_type": "$SYNC_TYPE",
    "triggered_by": "$(whoami)",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
}
EOF
)

log_info "Triggering IMO-Creator sync..."
log_info "Target Repository: $TARGET_REPO"
log_info "Sync Type: $SYNC_TYPE"
log_info ""

# Send repository dispatch event
RESPONSE=$(curl -s -w "%{http_code}" \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "User-Agent: imo-creator-sync-script" \
  -d "$PAYLOAD" \
  "$GITHUB_API/repos/$REPO_OWNER/$IMO_CREATOR_REPO/dispatches")

HTTP_CODE="${RESPONSE: -3}"
RESPONSE_BODY="${RESPONSE%???}"

if [[ "$HTTP_CODE" == "204" ]]; then
    log_success "Sync trigger sent successfully!"
    log_info "Check workflow status at:"
    log_info "https://github.com/$REPO_OWNER/$IMO_CREATOR_REPO/actions"
else
    log_error "Failed to trigger sync (HTTP $HTTP_CODE)"
    if [[ -n "$RESPONSE_BODY" ]]; then
        log_error "Response: $RESPONSE_BODY"
    fi
    exit 1
fi

log_info ""
log_info "The sync workflow should start shortly. You can monitor progress at:"
log_info "https://github.com/$REPO_OWNER/$IMO_CREATOR_REPO/actions/workflows/sync-updates.yml"