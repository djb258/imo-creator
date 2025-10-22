#!/bin/bash
################################################################################
# DeepWiki Post-Update Hook
# Version: 1.0
# Last Updated: 2025-10-22
#
# This hook runs after every successful git push to automatically update
# DeepWiki documentation with the latest changes.
#
# Installation:
#   1. Copy to: .git/hooks/post-commit
#   2. Make executable: chmod +x .git/hooks/post-commit
#   3. Configure global_manifest.yaml
#
# Usage:
#   Runs automatically on commit or manually:
#   ./scripts/hooks/post_update_deepwiki.sh
################################################################################

set -e  # Exit on error

# ============================================================
# CONFIGURATION
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
GLOBAL_CONFIG="$REPO_ROOT/global-config/global_manifest.yaml"
DEEPWIKI_DIR="$REPO_ROOT/deepwiki"
OUTPUT_DIR="$REPO_ROOT/deep_wiki"
LOG_DIR="$REPO_ROOT/logs"
AUDIT_LOG="$LOG_DIR/deepwiki_audit.log"
ERROR_LOG="$LOG_DIR/deepwiki_error.log"

# API Configuration
DEEPWIKI_API_URL="http://localhost:8001"
DEEPWIKI_API_TIMEOUT=600  # 10 minutes

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
    log_info "Checking DeepWiki configuration..."

    # Check if global manifest exists
    if [ ! -f "$GLOBAL_CONFIG" ]; then
        log_error "Global manifest not found: $GLOBAL_CONFIG"
        return 1
    fi

    # Check if DeepWiki is enabled
    DEEPWIKI_ENABLED=$(grep -A 1 "deep_wiki:" "$GLOBAL_CONFIG" | grep "enabled:" | awk '{print $2}')
    if [ "$DEEPWIKI_ENABLED" != "true" ]; then
        log_warning "DeepWiki is disabled in global configuration"
        return 1
    fi

    # Check kill switch
    KILL_SWITCH=$(grep -A 5 "kill_switch:" "$GLOBAL_CONFIG" | grep "enabled:" | awk '{print $2}')
    if [ "$KILL_SWITCH" == "true" ]; then
        KILL_REASON=$(grep -A 5 "kill_switch:" "$GLOBAL_CONFIG" | grep "reason:" | cut -d':' -f2- | xargs)
        log_error "DeepWiki kill switch is ACTIVE. Reason: $KILL_REASON"
        return 1
    fi

    # Check if run_on_update is enabled
    RUN_ON_UPDATE=$(grep -A 2 "deep_wiki:" "$GLOBAL_CONFIG" | grep "run_on_update:" | awk '{print $2}')
    if [ "$RUN_ON_UPDATE" != "true" ]; then
        log_warning "DeepWiki run_on_update is disabled"
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
    mkdir -p "$LOG_DIR"
    touch "$AUDIT_LOG"
    touch "$ERROR_LOG"

    # Check if DeepWiki directory exists
    if [ ! -d "$DEEPWIKI_DIR" ]; then
        log_error "DeepWiki directory not found: $DEEPWIKI_DIR"
        return 1
    fi

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

    # Count changed files in last commit
    CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | wc -l || echo "0")

    # Export for later use
    export REPO_NAME BRANCH_NAME COMMIT_HASH COMMIT_SHORT
    export AUTHOR_NAME AUTHOR_EMAIL COMMIT_MESSAGE TIMESTAMP
    export CHANGED_FILES

    log_info "Repository: $REPO_NAME"
    log_info "Branch: $BRANCH_NAME"
    log_info "Commit: $COMMIT_SHORT"
    log_info "Changed files: $CHANGED_FILES"

    return 0
}

# ============================================================
# DEEPWIKI API INTERACTION
# ============================================================

check_deepwiki_api() {
    log_info "Checking DeepWiki API availability..."

    # Try to connect to DeepWiki API
    if curl -s --max-time 5 "$DEEPWIKI_API_URL/health" > /dev/null 2>&1; then
        log_success "DeepWiki API is running"
        return 0
    else
        log_warning "DeepWiki API is not running on $DEEPWIKI_API_URL"
        log_info "Attempting to start DeepWiki API..."

        # Try to start the API
        cd "$DEEPWIKI_DIR"
        python -m api.main > /dev/null 2>&1 &
        DEEPWIKI_PID=$!

        # Wait for API to start
        for i in {1..30}; do
            if curl -s --max-time 2 "$DEEPWIKI_API_URL/health" > /dev/null 2>&1; then
                log_success "DeepWiki API started (PID: $DEEPWIKI_PID)"
                export DEEPWIKI_PID
                return 0
            fi
            sleep 1
        done

        log_error "Failed to start DeepWiki API"
        return 1
    fi
}

run_deepwiki_analysis() {
    log_info "Running DeepWiki analysis..."

    cd "$REPO_ROOT"

    # Determine if we should analyze diff only or full repo
    ANALYZE_DIFF_ONLY=$(grep -A 10 "processing:" "$GLOBAL_CONFIG" | grep "analyze_diffs_only:" | awk '{print $2}')

    local repo_url="file://$REPO_ROOT"

    # Prepare API request
    local request_payload=$(cat <<EOF
{
  "repository_url": "$repo_url",
  "ai_provider": "google",
  "embedder_type": "google",
  "generate_diagrams": true,
  "branch": "$BRANCH_NAME",
  "analyze_diff_only": $ANALYZE_DIFF_ONLY,
  "commit_hash": "$COMMIT_HASH"
}
EOF
)

    # Call DeepWiki API
    log_info "Calling DeepWiki API (timeout: ${DEEPWIKI_API_TIMEOUT}s)..."

    RESPONSE=$(curl -s --max-time $DEEPWIKI_API_TIMEOUT \
        -X POST "$DEEPWIKI_API_URL/api/generate" \
        -H "Content-Type: application/json" \
        -d "$request_payload")

    # Check response
    if echo "$RESPONSE" | jq -e '.status == "success"' > /dev/null 2>&1; then
        REPO_ID=$(echo "$RESPONSE" | jq -r '.repository_id')
        export REPO_ID

        log_success "DeepWiki analysis completed successfully"
        log_info "Repository ID: $REPO_ID"

        # Save response to file
        echo "$RESPONSE" > "$OUTPUT_DIR/last_analysis.json"

        return 0
    else
        ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error // "Unknown error"')
        log_error "DeepWiki analysis failed: $ERROR_MSG"
        echo "$RESPONSE" > "$OUTPUT_DIR/last_error.json"
        return 1
    fi
}

# ============================================================
# INDEX MANAGEMENT
# ============================================================

update_deepwiki_index() {
    log_info "Updating DeepWiki index..."

    local index_file="$OUTPUT_DIR/deepwiki_index.json"

    if [ -f "$index_file" ]; then
        # Update existing index
        jq --arg repo "$REPO_NAME" \
           --arg branch "$BRANCH_NAME" \
           --arg commit "$COMMIT_HASH" \
           --arg timestamp "$TIMESTAMP" \
           --arg repo_id "$REPO_ID" \
           --arg author "$AUTHOR_NAME" \
           --arg email "$AUTHOR_EMAIL" \
           --arg message "$COMMIT_MESSAGE" \
           '.repositories[$repo] = {
             "branch": $branch,
             "last_commit": $commit,
             "last_updated": $timestamp,
             "repository_id": $repo_id,
             "author": $author,
             "email": $email,
             "commit_message": $message,
             "status": "success",
             "changed_files": '"$CHANGED_FILES"'
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
      "repository_id": "$REPO_ID",
      "author": "$AUTHOR_NAME",
      "email": "$AUTHOR_EMAIL",
      "commit_message": "$COMMIT_MESSAGE",
      "status": "success",
      "changed_files": $CHANGED_FILES
    }
  }
}
EOF
    fi

    log_success "DeepWiki index updated"
    return 0
}

# ============================================================
# GIT OPERATIONS
# ============================================================

commit_and_push_changes() {
    log_info "Checking for changes to commit..."

    cd "$REPO_ROOT"

    # Check if there are changes
    if [ -z "$(git status --porcelain deep_wiki/ logs/)" ]; then
        log_info "No changes to commit"
        return 0
    fi

    # Stage changes
    git add deep_wiki/ logs/

    # Create commit message
    local commit_msg="📚 DeepWiki: Auto-update documentation [skip ci]

Repository: $REPO_NAME
Branch: $BRANCH_NAME
Commit: $COMMIT_SHORT
Author: $AUTHOR_NAME <$AUTHOR_EMAIL>
Timestamp: $TIMESTAMP
Changed files: $CHANGED_FILES

Original commit: $COMMIT_MESSAGE

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

    # Commit changes
    git commit -m "$commit_msg"

    # Check if auto-commit is enabled
    AUTO_COMMIT=$(grep -A 20 "target_repos:" "$GLOBAL_CONFIG" | grep -A 3 "name: $REPO_NAME" | grep "auto_commit:" | awk '{print $2}')

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
# CLEANUP
# ============================================================

cleanup() {
    log_info "Performing cleanup..."

    # Stop DeepWiki API if we started it
    if [ -n "$DEEPWIKI_PID" ]; then
        log_info "Stopping DeepWiki API (PID: $DEEPWIKI_PID)..."
        kill "$DEEPWIKI_PID" 2>/dev/null || true
    fi

    log_success "Cleanup complete"
}

# ============================================================
# MAIN EXECUTION
# ============================================================

main() {
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║      DeepWiki Post-Update Hook            ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""

    # Start audit log entry
    log_audit "START - DeepWiki post-update hook execution"

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
    log_audit "PROCESSING - Repo: $REPO_NAME, Branch: $BRANCH_NAME, Commit: $COMMIT_SHORT, Files: $CHANGED_FILES"

    # Check/start DeepWiki API
    if ! check_deepwiki_api; then
        log_error "DeepWiki API check failed"
        log_audit "FAILED - API unavailable"
        exit 1
    fi

    # Run DeepWiki analysis
    if ! run_deepwiki_analysis; then
        log_error "DeepWiki analysis failed"
        log_audit "FAILED - Analysis error"
        cleanup
        exit 1
    fi

    # Update index
    if ! update_deepwiki_index; then
        log_error "Failed to update DeepWiki index"
        log_audit "FAILED - Index update error"
        cleanup
        exit 1
    fi

    # Commit and push changes
    if ! commit_and_push_changes; then
        log_warning "Failed to commit/push changes (non-fatal)"
        log_audit "WARNING - Commit/push warning"
    fi

    # Cleanup
    cleanup

    # Final audit log entry
    log_audit "SUCCESS - Repo: $REPO_NAME, Branch: $BRANCH_NAME, Commit: $COMMIT_SHORT"

    echo ""
    log_success "DeepWiki post-update hook completed successfully"
    echo ""

    return 0
}

# Handle script interruption
trap cleanup EXIT INT TERM

# Execute main function
main "$@"
