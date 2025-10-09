#!/bin/bash

###############################################################################
# CTB (Christmas Tree Backbone) Verification Script
# Version: 1.0
# Purpose: Verify CTB branch structure compliance
# Usage: bash global-config/scripts/ctb_verify.sh
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
  echo -e "${GREEN}[✅]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[⚠️ ]${NC} $1"
}

log_error() {
  echo -e "${RED}[❌]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  log_error "Not a git repository"
  exit 1
fi

log_info "🌲 CTB Structure Verification"
log_info "Repository: $(basename $(git rev-parse --show-toplevel))"
log_info ""

# Define expected branches
EXPECTED_BRANCHES=(
  "doctrine/get-ingest"
  "sys/composio-mcp"
  "sys/neon-vault"
  "sys/firebase-workbench"
  "sys/bigquery-warehouse"
  "sys/github-factory"
  "sys/builder-bridge"
  "sys/security-audit"
  "imo/input"
  "imo/middle"
  "imo/output"
  "ui/figma-bolt"
  "ui/builder-templates"
  "ops/automation-scripts"
  "ops/report-builder"
)

MISSING_BRANCHES=()
PRESENT_BRANCHES=()

log_info "=== Branch Structure Check ==="
log_info ""

for branch in "${EXPECTED_BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    log_success "$branch"
    PRESENT_BRANCHES+=("$branch")
  else
    log_error "$branch (MISSING)"
    MISSING_BRANCHES+=("$branch")
  fi
done

log_info ""
log_info "=== Required Files Check ==="
log_info ""

REQUIRED_FILES=(
  "heir.doctrine.yaml"
  "global-config/ctb.branchmap.yaml"
  "global-config/scripts/ctb_init.sh"
  "global-config/scripts/ctb_verify.sh"
  ".github/workflows/doctrine_sync.yml"
  ".github/workflows/ctb_health.yml"
  ".github/workflows/audit.yml"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    log_success "$file"
  else
    log_error "$file (MISSING)"
    MISSING_FILES+=("$file")
  fi
done

log_info ""
log_info "=== Branch Metadata Check ==="
log_info ""

METADATA_COUNT=0
for branch in "${EXPECTED_BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    if git show "$branch:.ctb-metadata" > /dev/null 2>&1; then
      METADATA_COUNT=$((METADATA_COUNT + 1))
    fi
  fi
done

if [ $METADATA_COUNT -gt 0 ]; then
  log_success "$METADATA_COUNT branches have .ctb-metadata files"
else
  log_warning "No branches have .ctb-metadata files"
fi

log_info ""
log_info "=== Summary ==="
log_info ""

log_info "Present branches: ${#PRESENT_BRANCHES[@]}/15"
log_info "Missing branches: ${#MISSING_BRANCHES[@]}"
log_info "Missing files: ${#MISSING_FILES[@]}"

if [ ${#MISSING_BRANCHES[@]} -eq 0 ] && [ ${#MISSING_FILES[@]} -eq 0 ]; then
  log_success "✅ CTB structure is fully compliant!"
  exit 0
else
  log_error "❌ CTB structure has issues"

  if [ ${#MISSING_BRANCHES[@]} -gt 0 ]; then
    log_info ""
    log_info "To create missing branches, run:"
    log_info "  bash global-config/scripts/ctb_init.sh"
  fi

  if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    log_info ""
    log_info "Missing files need to be created manually or copied from imo-creator"
  fi

  exit 1
fi
