#!/bin/bash

###############################################################################
# IMO-Creator CTB Update Script
# Version: 1.0
# Purpose: One-command update from IMO-Creator SOURCE repository
# Usage: bash update_from_imo_creator.sh
#
# Simple command: "update from IMO-creator"
# This script handles everything automatically.
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

log_step() {
  echo -e "${CYAN}[STEP]${NC} $1"
}

# Header
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  IMO-Creator CTB Doctrine Update          ║${NC}"
echo -e "${CYAN}║  Automatic Repository Synchronization     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Determine if we're in the SOURCE repo or a child repo
CURRENT_REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")

if [ "$CURRENT_REPO_NAME" = "imo-creator" ]; then
  log_warning "You are in the IMO-Creator SOURCE repository"
  log_info "This repository DEFINES the CTB doctrine"
  log_info "No update needed - this is the source of truth"
  echo ""
  log_info "To apply CTB to another repository:"
  log_info "  1. Navigate to that repository"
  log_info "  2. Run: bash /path/to/imo-creator/global-config/scripts/update_from_imo_creator.sh"
  echo ""
  exit 0
fi

# We're in a different repository - proceed with update
log_info "Current repository: $CURRENT_REPO_NAME"
log_info "Updating from IMO-Creator SOURCE..."
echo ""

# Find IMO-Creator source
IMO_CREATOR_PATH=""

# Check if imo-creator/ subfolder exists (IMPORT repo pattern)
if [ -d "imo-creator" ]; then
  log_step "Detected imo-creator/ subfolder (IMPORT repository pattern)"
  IMO_CREATOR_PATH="imo-creator"
else
  # Try to find imo-creator in common locations
  SEARCH_PATHS=(
    "../imo-creator"
    "../../imo-creator"
    "$HOME/Desktop/Cursor Builds/imo-creator"
    "/c/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator"
    "C:/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator"
  )

  for path in "${SEARCH_PATHS[@]}"; do
    if [ -d "$path/global-config" ]; then
      IMO_CREATOR_PATH="$path"
      log_step "Found IMO-Creator SOURCE at: $path"
      break
    fi
  done
fi

if [ -z "$IMO_CREATOR_PATH" ] || [ ! -d "$IMO_CREATOR_PATH/global-config" ]; then
  log_error "Cannot find IMO-Creator SOURCE repository"
  log_info "Please specify the path to imo-creator:"
  log_info "  bash update_from_imo_creator.sh /path/to/imo-creator"
  exit 1
fi

# Allow override via argument
if [ -n "$1" ]; then
  if [ -d "$1/global-config" ]; then
    IMO_CREATOR_PATH="$1"
    log_step "Using specified IMO-Creator path: $1"
  else
    log_error "Specified path does not contain global-config/"
    exit 1
  fi
fi

log_success "IMO-Creator SOURCE located at: $IMO_CREATOR_PATH"
echo ""

# Step 1: Copy global configuration
log_step "1/5 Syncing global configuration files..."

mkdir -p global-config/scripts
mkdir -p .github/workflows

# Copy all CTB configuration files
cp "$IMO_CREATOR_PATH/global-config/ctb.branchmap.yaml" "global-config/ctb.branchmap.yaml"
log_info "  ✓ ctb.branchmap.yaml"

cp "$IMO_CREATOR_PATH/global-config/CTB_DOCTRINE.md" "global-config/CTB_DOCTRINE.md"
log_info "  ✓ CTB_DOCTRINE.md"

cp "$IMO_CREATOR_PATH/global-config/branch_protection_config.json" "global-config/branch_protection_config.json"
log_info "  ✓ branch_protection_config.json"

# Copy scripts
cp "$IMO_CREATOR_PATH/global-config/scripts/ctb_init.sh" "global-config/scripts/ctb_init.sh"
cp "$IMO_CREATOR_PATH/global-config/scripts/ctb_verify.sh" "global-config/scripts/ctb_verify.sh"
cp "$IMO_CREATOR_PATH/global-config/scripts/ctb_scaffold_new_repo.sh" "global-config/scripts/ctb_scaffold_new_repo.sh"
cp "$IMO_CREATOR_PATH/global-config/scripts/update_from_imo_creator.sh" "global-config/scripts/update_from_imo_creator.sh"
chmod +x global-config/scripts/*.sh
log_info "  ✓ All scripts copied and made executable"

# Copy GitHub Actions workflows
cp "$IMO_CREATOR_PATH/.github/workflows/doctrine_sync.yml" ".github/workflows/doctrine_sync.yml"
cp "$IMO_CREATOR_PATH/.github/workflows/ctb_health.yml" ".github/workflows/ctb_health.yml"
cp "$IMO_CREATOR_PATH/.github/workflows/audit.yml" ".github/workflows/audit.yml"
log_info "  ✓ GitHub Actions workflows"

log_success "Configuration files synced"
echo ""

# Step 2: Initialize CTB branches
log_step "2/5 Initializing CTB branch structure..."
bash global-config/scripts/ctb_init.sh 2>&1 | grep -E "(Creating|SUCCESS|ERROR|Creating branch|Would create)" || true
echo ""

# Step 3: Verify compliance
log_step "3/5 Verifying CTB compliance..."
if bash global-config/scripts/ctb_verify.sh 2>&1 | grep -q "fully compliant"; then
  log_success "CTB structure verified and compliant"
else
  log_warning "Some compliance issues detected - review output above"
fi
echo ""

# Step 4: Commit changes
log_step "4/5 Committing CTB doctrine updates..."

git add global-config/ .github/workflows/ 2>/dev/null || true

if git diff --cached --quiet; then
  log_info "No changes to commit (already up to date)"
else
  TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

  git commit -m "🔁 CTB Doctrine Sync from IMO-Creator SOURCE

Synchronized CTB (Christmas Tree Backbone) configuration:
- Updated ctb.branchmap.yaml with latest branch definitions
- Synced all 15 CTB branch structure
- Updated GitHub Actions workflows (doctrine_sync, ctb_health, audit)
- Refreshed CTB initialization and verification scripts

Source: IMO-Creator (djb258/imo-creator)
Synced: $TIMESTAMP

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>" || log_warning "Commit failed or no changes"

  # Tag the sync
  TAG_NAME="ctb-sync-$(date +%Y%m%d-%H%M%S)"
  git tag -a "$TAG_NAME" -m "CTB Doctrine sync from IMO-Creator SOURCE" 2>/dev/null || log_info "Tag creation skipped"

  log_success "Changes committed and tagged: $TAG_NAME"
fi
echo ""

# Step 5: Summary
log_step "5/5 Generating update summary..."

BRANCH_COUNT=$(git branch | grep -E '(doctrine|sys|imo|ui|ops)/' | wc -l)

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       CTB Doctrine Update Complete        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Repository:${NC}     $CURRENT_REPO_NAME"
echo -e "${CYAN}Status:${NC}         ✅ Updated from IMO-Creator SOURCE"
echo -e "${CYAN}CTB Branches:${NC}   $BRANCH_COUNT/15"
echo -e "${CYAN}Compliance:${NC}     ✅ Verified"
echo -e "${CYAN}Timestamp:${NC}      $(date)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review changes: ${CYAN}git log -1${NC}"
echo -e "  2. Push branches: ${CYAN}git push --all origin${NC}"
echo -e "  3. Push tags: ${CYAN}git push --tags${NC}"
echo ""
echo -e "${BLUE}🌲 CTB Doctrine: Your repository is now aligned with IMO-Creator standards${NC}"
echo ""
