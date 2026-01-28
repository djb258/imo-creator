#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.794564
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 90%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01


###############################################################################
# CTB Version Check & Auto-Update Script
# Version: 1.0
# Purpose: Check if imo-creator has a newer CTB Doctrine version and auto-update
# Usage: bash ctb_check_version.sh [--auto-update]
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

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

# Header
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    CTB Doctrine Version Check             ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in imo-creator (source repo)
CURRENT_REPO=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")

if [ "$CURRENT_REPO" = "imo-creator" ]; then
  log_warning "You are in the imo-creator SOURCE repository"
  log_info "This repository defines the CTB doctrine - no version check needed"
  exit 0
fi

# Function to extract version without jq (fallback)
get_version_from_json() {
  local file="$1"
  if command -v jq &> /dev/null; then
    jq -r '.current_version' "$file" 2>/dev/null || echo "unknown"
  else
    # Fallback: simple grep/sed extraction
    grep -o '"current_version"[[:space:]]*:[[:space:]]*"[^"]*"' "$file" | sed 's/.*"\([^"]*\)".*/\1/' || echo "unknown"
  fi
}

# Read local version
VERSION_FILE="global-config/ctb_version.json"

if [ ! -f "$VERSION_FILE" ]; then
  log_error "Version file not found: $VERSION_FILE"
  log_info "Run: bash global-config/scripts/update_from_imo_creator.sh"
  exit 1
fi

LOCAL_VER=$(get_version_from_json "$VERSION_FILE")
log_info "Local CTB version: $LOCAL_VER"

# Create temp directory for clone
TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'ctb-check')
trap "rm -rf '$TMP_DIR'" EXIT

# Clone imo-creator to check remote version
IMO_REPO="https://github.com/[OWNER]/imo-creator.git"
log_info "Checking remote version from: $IMO_REPO"

if git clone --depth 1 --quiet "$IMO_REPO" "$TMP_DIR/imo-creator" 2>/dev/null; then
  REMOTE_VER=$(get_version_from_json "$TMP_DIR/imo-creator/templates/config/ctb_version.json")
  log_info "Remote CTB version: $REMOTE_VER"
else
  log_error "Failed to clone imo-creator repository"
  log_warning "Continuing with local version check only"
  REMOTE_VER="unknown"
fi

# Compare versions
if [ "$REMOTE_VER" = "unknown" ]; then
  log_warning "Could not determine remote version - skipping update"
  exit 0
fi

if [ "$LOCAL_VER" = "$REMOTE_VER" ]; then
  log_success "✅ Repository is up-to-date (v$LOCAL_VER)"

  # Update last_checked timestamp
  if command -v jq &> /dev/null; then
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u +"%FT%TZ")
    jq --arg t "$TIMESTAMP" '.last_checked=$t' "$VERSION_FILE" > "${VERSION_FILE}.tmp" && mv "${VERSION_FILE}.tmp" "$VERSION_FILE"
    log_info "Updated last_checked timestamp"
  fi

  exit 0
fi

# Version mismatch detected
echo ""
log_warning "⚠️  Version mismatch detected!"
log_warning "   Local:  v$LOCAL_VER"
log_warning "   Remote: v$REMOTE_VER"
echo ""

# Check if auto-update is enabled
AUTO_UPDATE=false
if [ "$1" = "--auto-update" ] || [ "$1" = "-a" ]; then
  AUTO_UPDATE=true
fi

if [ "$AUTO_UPDATE" = false ]; then
  echo -e "${YELLOW}To update, run:${NC}"
  echo -e "  ${CYAN}bash global-config/scripts/update_from_imo_creator.sh${NC}"
  echo ""
  echo -e "${YELLOW}Or enable auto-update:${NC}"
  echo -e "  ${CYAN}bash global-config/scripts/ctb_check_version.sh --auto-update${NC}"
  echo ""
  exit 1
fi

# Auto-update enabled
log_info "Auto-update enabled - updating to v$REMOTE_VER..."
echo ""

# Run update script
if [ -f "global-config/scripts/update_from_imo_creator.sh" ]; then
  bash global-config/scripts/update_from_imo_creator.sh
else
  log_error "Update script not found!"
  log_info "Please run manually: bash /path/to/imo-creator/global-config/scripts/update_from_imo_creator.sh"
  exit 1
fi

# Update version file
if command -v jq &> /dev/null; then
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u +"%FT%TZ")
  jq --arg v "$REMOTE_VER" --arg t "$TIMESTAMP" \
    '.current_version=$v | .last_updated=$t | .last_checked=$t' \
    "$VERSION_FILE" > "${VERSION_FILE}.tmp" && mv "${VERSION_FILE}.tmp" "$VERSION_FILE"

  log_success "Updated version file to v$REMOTE_VER"

  # Commit and push if in git repo
  if git rev-parse --git-dir > /dev/null 2>&1; then
    git add "$VERSION_FILE" 2>/dev/null || true

    if ! git diff --cached --quiet 2>/dev/null; then
      git commit -m "🔄 Auto-update: synced to CTB Doctrine v$REMOTE_VER

Automated version sync from imo-creator SOURCE repository.

Changes:
- Updated from v$LOCAL_VER to v$REMOTE_VER
- Synced all CTB configuration and scripts
- Updated version file timestamp

🤖 Generated with Claude Code (Auto-update)
Co-Authored-By: Claude <noreply@anthropic.com>" 2>/dev/null || log_warning "Commit failed"

      log_info "Changes committed locally"

      # Try to push (may fail if no remote configured)
      if git push 2>/dev/null; then
        log_success "Changes pushed to remote"
      else
        log_warning "Could not push to remote - push manually if needed"
      fi
    fi
  fi
else
  log_warning "jq not installed - manual version file update required"
fi

echo ""
log_success "✅ Repository updated to CTB Doctrine v$REMOTE_VER"
echo ""
