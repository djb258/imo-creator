#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:40.815893
# # CTB Version: 1.3.3
# # Division: Documentation
# # Category: global-config
# # Compliance: 90%
# # HEIR ID: HEIR-2025-10-DOC-GLOBAL-01


###############################################################################
# CTB Scaffold New Repository Script
# Version: 1.0
# Purpose: Apply CTB structure to a newly created repository
# Usage: bash global-config/scripts/ctb_scaffold_new_repo.sh <repo-path>
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ -z "$1" ]; then
  log_error "Usage: $0 <repo-path>"
  log_info "Example: $0 /path/to/new-repo"
  exit 1
fi

TARGET_REPO="$1"
SOURCE_REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

log_info "🌲 CTB Scaffolding New Repository"
log_info "Source (imo-creator): $SOURCE_REPO"
log_info "Target: $TARGET_REPO"
log_info ""

# Verify source repository has CTB structure
if [ ! -f "$SOURCE_REPO/global-config/ctb.branchmap.yaml" ]; then
  log_error "Source repository is not CTB-compliant"
  log_error "Please run ctb_init.sh in the source repository first"
  exit 1
fi

# Verify target is a git repository
if [ ! -d "$TARGET_REPO/.git" ]; then
  log_error "Target is not a git repository: $TARGET_REPO"
  exit 1
fi

cd "$TARGET_REPO"

log_info "Step 1: Copying CTB configuration files..."

# Create directories
mkdir -p "global-config/scripts"
mkdir -p ".github/workflows"

# Copy CTB configuration files
cp "$SOURCE_REPO/global-config/ctb.branchmap.yaml" "global-config/ctb.branchmap.yaml"
cp "$SOURCE_REPO/templates/scripts/ctb_init.sh" "templates/scripts/ctb_init.sh"
cp "$SOURCE_REPO/templates/scripts/ctb_verify.sh" "templates/scripts/ctb_verify.sh"
cp "$SOURCE_REPO/global-config/scripts/ctb_scaffold_new_repo.sh" "global-config/scripts/ctb_scaffold_new_repo.sh"

# Make scripts executable
chmod +x global-config/scripts/*.sh

log_success "Configuration files copied"

log_info "Step 2: Copying GitHub Actions workflows..."

# Copy workflow files
cp "$SOURCE_REPO/.github/workflows/doctrine_sync.yml" ".github/workflows/doctrine_sync.yml"
cp "$SOURCE_REPO/.github/workflows/ctb_health.yml" ".github/workflows/ctb_health.yml"
cp "$SOURCE_REPO/.github/workflows/audit.yml" ".github/workflows/audit.yml"

log_success "Workflows copied"

log_info "Step 3: Copying HEIR doctrine files..."

# Copy HEIR files if they don't exist
if [ -f "$SOURCE_REPO/heir.doctrine.yaml" ] && [ ! -f "heir.doctrine.yaml" ]; then
  cp "$SOURCE_REPO/heir.doctrine.yaml" "heir.doctrine.yaml"
  log_success "heir.doctrine.yaml copied (please customize for this repo)"
fi

log_info "Step 4: Committing CTB structure..."

git add global-config/ .github/workflows/
[ -f "heir.doctrine.yaml" ] && git add heir.doctrine.yaml || true

git commit -m "🌲 Initialize CTB (Christmas Tree Backbone) structure

- Added CTB branch map configuration
- Added CTB initialization and verification scripts
- Added GitHub Actions workflows for doctrine sync and health checks
- Added HEIR compliance configuration

This repository now follows CTB Doctrine.
" || log_info "No changes to commit (files may already exist)"

log_info "Step 5: Creating CTB branches..."

bash templates/scripts/ctb_init.sh

log_info ""
log_success "✅ CTB scaffolding complete!"
log_info ""
log_info "Next steps:"
log_info "1. Customize heir.doctrine.yaml for this repository"
log_info "2. Push all branches: git push --all origin"
log_info "3. Configure branch protection rules in GitHub"
log_info "4. Run health check: bash templates/scripts/ctb_verify.sh"
log_info ""
log_info "🌲 Welcome to the CTB ecosystem!"
