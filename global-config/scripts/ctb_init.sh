#!/bin/bash

###############################################################################
# CTB (Christmas Tree Backbone) Initialization Script
# Version: 1.0
# Purpose: Initialize CTB branch structure in any Barton Enterprises repository
# Usage: bash global-config/scripts/ctb_init.sh [--dry-run] [--force]
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
FORCE=false
BRANCH_MAP_FILE="global-config/ctb.branchmap.yaml"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run] [--force]"
      exit 1
      ;;
  esac
done

# Logging functions
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

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  log_error "Not a git repository. Please run this script from inside a git repository."
  exit 1
fi

# Check if branch map exists
if [ ! -f "$BRANCH_MAP_FILE" ]; then
  log_error "CTB branch map not found at: $BRANCH_MAP_FILE"
  log_info "Please ensure global-config/ctb.branchmap.yaml exists"
  exit 1
fi

log_info "🌲 Initializing CTB (Christmas Tree Backbone) Structure"
log_info "Repository: $(git remote get-url origin 2>/dev/null || echo 'local')"
log_info "Current branch: $(git branch --show-current)"

if [ "$DRY_RUN" = true ]; then
  log_warning "DRY RUN MODE - No changes will be made"
fi

# Define all CTB branches by altitude
declare -A BRANCHES
BRANCHES[40k]="doctrine/get-ingest sys/composio-mcp sys/neon-vault sys/firebase-workbench sys/bigquery-warehouse sys/github-factory sys/builder-bridge sys/security-audit"
BRANCHES[20k]="imo/input imo/middle imo/output"
BRANCHES[10k]="ui/figma-bolt ui/builder-templates"
BRANCHES[5k]="ops/automation-scripts ops/report-builder"

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ] && [ "$CURRENT_BRANCH" != "main" ]; then
  log_warning "Not on main/master branch. Current: $CURRENT_BRANCH"
  if [ "$FORCE" = false ]; then
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      log_info "Aborted by user"
      exit 0
    fi
  fi
fi

# Function to create a branch
create_branch() {
  local branch_name=$1
  local altitude=$2

  if git show-ref --verify --quiet "refs/heads/$branch_name"; then
    log_warning "Branch already exists: $branch_name"
    return 0
  fi

  if [ "$DRY_RUN" = true ]; then
    log_info "Would create branch: $branch_name (altitude: $altitude)"
    return 0
  fi

  log_info "Creating branch: $branch_name (altitude: $altitude)"

  # Create branch from main
  if git checkout -b "$branch_name" 2>/dev/null; then
    log_success "Created branch: $branch_name"

    # Create a .ctb-metadata file
    cat > ".ctb-metadata" << EOF
altitude: $altitude
branch: $branch_name
created: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
purpose: CTB branch at $altitude altitude
EOF

    git add .ctb-metadata
    git commit -m "🌲 Initialize CTB branch: $branch_name at $altitude altitude" || true

    # Return to main
    git checkout "$CURRENT_BRANCH" 2>/dev/null || git checkout main
  else
    log_error "Failed to create branch: $branch_name"
    return 1
  fi
}

# Create branches by altitude
log_info ""
log_info "=== Creating CTB Branch Structure ==="
log_info ""

for altitude in "40k" "20k" "10k" "5k"; do
  log_info "📍 Altitude: $altitude"

  for branch in ${BRANCHES[$altitude]}; do
    create_branch "$branch" "$altitude"
  done

  log_info ""
done

# Summary
log_info "=== CTB Initialization Summary ==="
log_info ""

if [ "$DRY_RUN" = false ]; then
  log_info "Created branches:"
  git branch | grep -E '(doctrine|sys|imo|ui|ops)/' || log_warning "No CTB branches found"

  log_info ""
  log_success "✅ CTB structure initialized successfully!"
  log_info ""
  log_info "Next steps:"
  log_info "1. Review the created branches: git branch"
  log_info "2. Push branches to remote: git push --all origin"
  log_info "3. Run health check: bash global-config/scripts/ctb_verify.sh"
  log_info "4. Organize files into appropriate branches"
else
  log_info "DRY RUN complete - no changes made"
  log_info "Run without --dry-run to create branches"
fi

log_info ""
log_info "🌲 CTB Doctrine: Branches are the structure, main is the trunk"
