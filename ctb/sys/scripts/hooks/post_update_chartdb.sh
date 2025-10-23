#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:36.421615
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: scripts
# # Compliance: 90%
# # HEIR ID: HEIR-2025-10-SYS-SCRIPT-01

################################################################################
# ChartDB Post-Update Hook
# Version: 1.0
# Last Updated: 2025-10-22
#
# This hook runs after every successful git push to automatically update
# ChartDB database schema diagrams with the latest changes.
#
# Installation:
#   1. Copy to: .git/hooks/post-commit
#   2. Make executable: chmod +x .git/hooks/post-commit
#   3. Configure global_manifest.yaml
#
# Usage:
#   Runs automatically on commit or manually:
#   ./scripts/hooks/post_update_chartdb.sh
################################################################################

set -e  # Exit on error

# ============================================================
# CONFIGURATION
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
GLOBAL_CONFIG="$REPO_ROOT/global-config/global_manifest.yaml"
CHARTDB_DIR="$REPO_ROOT/chartdb"
OUTPUT_DIR="$REPO_ROOT/chartdb_schemas"
LOG_DIR="$REPO_ROOT/logs"
AUDIT_LOG="$LOG_DIR/chartdb_audit.log"
ERROR_LOG="$LOG_DIR/chartdb_error.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# HELPER FUNCTIONS
# ============================================================

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
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] ERROR - $1" >> "$ERROR_LOG"
}

log_audit() {
    local message="$1"
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $message" >> "$AUDIT_LOG"
}

# ============================================================
# CONFIGURATION CHECKS
# ============================================================

check_configuration() {
    log_info "Checking ChartDB configuration..."

    # Check if global manifest exists
    if [ ! -f "$GLOBAL_CONFIG" ]; then
        log_error "Global manifest not found: $GLOBAL_CONFIG"
        return 1
    fi

    # Check if ChartDB is enabled
    CHARTDB_ENABLED=$(grep -A 1 "chartdb:" "$GLOBAL_CONFIG" | grep "enabled:" | awk '{print $2}')
    if [ "$CHARTDB_ENABLED" != "true" ]; then
        log_warning "ChartDB is disabled in global configuration"
        return 1
    fi

    # Check kill switch
    KILL_SWITCH=$(grep -A 5 "chartdb:" "$GLOBAL_CONFIG" | grep -A 5 "kill_switch:" | grep "enabled:" | head -1 | awk '{print $2}')
    if [ "$KILL_SWITCH" == "true" ]; then
        KILL_REASON=$(grep -A 5 "chartdb:" "$GLOBAL_CONFIG" | grep -A 5 "kill_switch:" | grep "reason:" | cut -d':' -f2- | xargs)
        log_error "ChartDB kill switch is ACTIVE. Reason: $KILL_REASON"
        return 1
    fi

    # Check if run_on_update is enabled
    RUN_ON_UPDATE=$(grep -A 2 "chartdb:" "$GLOBAL_CONFIG" | grep "run_on_update:" | awk '{print $2}')
    if [ "$RUN_ON_UPDATE" != "true" ]; then
        log_warning "ChartDB run_on_update is disabled"
        return 1
    fi

    log_success "Configuration checks passed"
    return 0
}

# ============================================================
# ENVIRONMENT SETUP
# ============================================================

setup_environment() {
    log_info "Setting up environment..."

    # Create necessary directories
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR/schemas"
    mkdir -p "$OUTPUT_DIR/diagrams"
    mkdir -p "$LOG_DIR"
    touch "$AUDIT_LOG"
    touch "$ERROR_LOG"

    log_success "Environment setup complete"
    return 0
}

# ============================================================
# GIT INFORMATION
# ============================================================

get_git_info() {
    log_info "Gathering git information..."

    cd "$REPO_ROOT"

    # Get repository information
    REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
    COMMIT_HASH=$(git rev-parse HEAD)
    COMMIT_SHORT=$(git rev-parse --short HEAD)
    AUTHOR_NAME=$(git log -1 --format='%an')
    AUTHOR_EMAIL=$(git log -1 --format='%ae')
    COMMIT_MESSAGE=$(git log -1 --format='%s')
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Count changed schema files in last commit
    CHANGED_SCHEMA=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | grep -E '\.(sql|prisma)$|migrations/|models/|entities/' | wc -l || echo "0")

    # Export for later use
    export REPO_NAME BRANCH_NAME COMMIT_HASH COMMIT_SHORT
    export AUTHOR_NAME AUTHOR_EMAIL COMMIT_MESSAGE TIMESTAMP
    export CHANGED_SCHEMA

    log_info "Repository: $REPO_NAME"
    log_info "Branch: $BRANCH_NAME"
    log_info "Commit: $COMMIT_SHORT"
    log_info "Changed schema files: $CHANGED_SCHEMA"

    return 0
}

# ============================================================
# SCHEMA DETECTION
# ============================================================

detect_database_schemas() {
    log_info "Detecting database schema files..."

    cd "$REPO_ROOT"

    # Find all schema files
    SCHEMA_FILES=$(find . -type f \( \
        -name "*.sql" -o \
        -name "schema.prisma" -o \
        -path "*/migrations/*" -o \
        -path "*/models/*" -o \
        -path "*/entities/*" \
    \) ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/chartdb/*" || echo "")

    SCHEMA_COUNT=$(echo "$SCHEMA_FILES" | grep -c . || echo "0")
    export SCHEMA_COUNT

    if [ "$SCHEMA_COUNT" -eq 0 ]; then
        log_warning "No database schema files found"
        return 1
    fi

    log_success "Found $SCHEMA_COUNT schema files"

    # Save schema file list
    echo "$SCHEMA_FILES" > "$OUTPUT_DIR/detected_schemas.txt"

    return 0
}

# ============================================================
# SCHEMA PROCESSING
# ============================================================

process_schemas() {
    log_info "Processing database schemas..."

    cd "$REPO_ROOT"

    # For each SQL file, create a summary
    find . -name "*.sql" ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/chartdb/*" | while read -r file; do
        BASENAME=$(basename "$file" .sql)
        DIRNAME=$(dirname "$file" | sed 's/^\.\///')

        # Create schema metadata
        cat > "$OUTPUT_DIR/schemas/$BASENAME.json" <<EOF
{
  "name": "$BASENAME",
  "path": "$file",
  "directory": "$DIRNAME",
  "type": "sql",
  "last_modified": "$TIMESTAMP",
  "commit": "$COMMIT_SHORT",
  "author": "$AUTHOR_NAME"
}
EOF

        log_info "Processed: $file"
    done

    log_success "Schema processing complete"
    return 0
}

# ============================================================
# INDEX MANAGEMENT
# ============================================================

update_chartdb_index() {
    log_info "Updating ChartDB schema index..."

    local index_file="$OUTPUT_DIR/schema_index.json"

    if [ -f "$index_file" ]; then
        # Update existing index
        jq --arg repo "$REPO_NAME" \
           --arg branch "$BRANCH_NAME" \
           --arg commit "$COMMIT_HASH" \
           --arg timestamp "$TIMESTAMP" \
           --arg author "$AUTHOR_NAME" \
           --arg email "$AUTHOR_EMAIL" \
           --arg message "$COMMIT_MESSAGE" \
           '.repositories[$repo] = {
             "branch": $branch,
             "last_commit": $commit,
             "last_updated": $timestamp,
             "author": $author,
             "email": $email,
             "commit_message": $message,
             "status": "success",
             "schema_count": '"$SCHEMA_COUNT"'
           } | .last_updated = $timestamp' "$index_file" > "$index_file.tmp"

        mv "$index_file.tmp" "$index_file"
    else
        # Create new index
        cat > "$index_file" <<EOF
{
  "version": "1.0",
  "last_updated": "$TIMESTAMP",
  "repositories": {
    "$REPO_NAME": {
      "branch": "$BRANCH_NAME",
      "last_commit": "$COMMIT_HASH",
      "last_updated": "$TIMESTAMP",
      "author": "$AUTHOR_NAME",
      "email": "$AUTHOR_EMAIL",
      "commit_message": "$COMMIT_MESSAGE",
      "status": "success",
      "schema_count": $SCHEMA_COUNT
    }
  }
}
EOF
    fi

    log_success "ChartDB schema index updated"
    return 0
}

# ============================================================
# GIT OPERATIONS
# ============================================================

commit_and_push_changes() {
    log_info "Checking for changes to commit..."

    cd "$REPO_ROOT"

    # Check if there are changes
    if [ -z "$(git status --porcelain chartdb_schemas/ logs/)" ]; then
        log_info "No changes to commit"
        return 0
    fi

    # Stage changes
    git add chartdb_schemas/ logs/

    # Create commit message
    local commit_msg="📊 ChartDB: Auto-update database schemas [skip ci]

Repository: $REPO_NAME
Branch: $BRANCH_NAME
Commit: $COMMIT_SHORT
Author: $AUTHOR_NAME <$AUTHOR_EMAIL>
Timestamp: $TIMESTAMP
Schema Files: $SCHEMA_COUNT

Original commit: $COMMIT_MESSAGE

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

    # Commit changes
    git commit -m "$commit_msg"

    # Check if auto-commit is enabled
    AUTO_COMMIT=$(grep -A 20 "chartdb:" "$GLOBAL_CONFIG" | grep -A 20 "target_repos:" | grep -A 3 "name: $REPO_NAME" | grep "auto_commit:" | awk '{print $2}')

    if [ "$AUTO_COMMIT" == "true" ]; then
        log_info "Auto-commit enabled, pushing changes..."
        git push
        log_success "Changes pushed to remote"
    else
        log_warning "Auto-commit disabled, changes committed locally only"
    fi

    return 0
}

# ============================================================
# MAIN EXECUTION
# ============================================================

main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║      ChartDB Post-Update Hook              ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""

    # Start audit log entry
    log_audit "START - ChartDB post-update hook execution"

    # Run configuration checks
    if ! check_configuration; then
        log_warning "Configuration checks failed, exiting gracefully"
        log_audit "SKIP - Configuration checks failed"
        exit 0  # Exit gracefully, don't block the commit
    fi

    # Setup environment
    if ! setup_environment; then
        log_error "Environment setup failed"
        log_audit "FAILED - Environment setup error"
        exit 1
    fi

    # Get git information
    if ! get_git_info; then
        log_error "Failed to get git information"
        log_audit "FAILED - Git information error"
        exit 1
    fi

    # Start audit entry with details
    log_audit "PROCESSING - Repo: $REPO_NAME, Branch: $BRANCH_NAME, Commit: $COMMIT_SHORT, Schema Files: $CHANGED_SCHEMA"

    # Detect schemas
    if ! detect_database_schemas; then
        log_warning "No schemas detected, exiting gracefully"
        log_audit "SKIP - No schemas found"
        exit 0
    fi

    # Process schemas
    if ! process_schemas; then
        log_error "Schema processing failed"
        log_audit "FAILED - Schema processing error"
        exit 1
    fi

    # Update index
    if ! update_chartdb_index; then
        log_error "Failed to update ChartDB index"
        log_audit "FAILED - Index update error"
        exit 1
    fi

    # Commit and push changes
    if ! commit_and_push_changes; then
        log_warning "Failed to commit/push changes (non-fatal)"
        log_audit "WARNING - Commit/push warning"
    fi

    # Final audit log entry
    log_audit "SUCCESS - Repo: $REPO_NAME, Branch: $BRANCH_NAME, Commit: $COMMIT_SHORT"

    echo ""
    log_success "ChartDB post-update hook completed successfully"
    echo ""

    return 0
}

# Execute main function
main "$@"
