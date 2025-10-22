#!/bin/bash
################################################################################
# Log Rotation Script
# Version: 1.0
# Last Updated: 2025-10-22
#
# This script rotates and archives old log files to prevent disk space issues.
#
# Usage:
#   ./scripts/maintenance/rotate_logs.sh
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
ARCHIVE_DIR="$LOG_DIR/archives"
RETENTION_DAYS=90

# Colors
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

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "╔════════════════════════════════════════════╗"
echo "║         Log Rotation Script                ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Create archive directory
mkdir -p "$ARCHIVE_DIR"

# Get current date for archive naming
ARCHIVE_DATE=$(date +%Y%m%d)

# Rotate DeepWiki audit log
if [ -f "$LOG_DIR/deepwiki_audit.log" ] && [ -s "$LOG_DIR/deepwiki_audit.log" ]; then
    log_info "Rotating DeepWiki audit log..."
    gzip -c "$LOG_DIR/deepwiki_audit.log" > "$ARCHIVE_DIR/deepwiki_audit_${ARCHIVE_DATE}.log.gz"
    echo "" > "$LOG_DIR/deepwiki_audit.log"
    log_success "DeepWiki audit log rotated"
fi

# Rotate DeepWiki error log
if [ -f "$LOG_DIR/deepwiki_error.log" ] && [ -s "$LOG_DIR/deepwiki_error.log" ]; then
    log_info "Rotating DeepWiki error log..."
    gzip -c "$LOG_DIR/deepwiki_error.log" > "$ARCHIVE_DIR/deepwiki_error_${ARCHIVE_DATE}.log.gz"
    echo "" > "$LOG_DIR/deepwiki_error.log"
    log_success "DeepWiki error log rotated"
fi

# Rotate CTB enforcement log
if [ -f "$LOG_DIR/ctb_enforcement.log" ] && [ -s "$LOG_DIR/ctb_enforcement.log" ]; then
    log_info "Rotating CTB enforcement log..."
    gzip -c "$LOG_DIR/ctb_enforcement.log" > "$ARCHIVE_DIR/ctb_enforcement_${ARCHIVE_DATE}.log.gz"
    echo "" > "$LOG_DIR/ctb_enforcement.log"
    log_success "CTB enforcement log rotated"
fi

# Delete old archives
log_info "Cleaning up old archives (older than $RETENTION_DAYS days)..."
DELETED_COUNT=$(find "$ARCHIVE_DIR" -name "*.log.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)

if [ "$DELETED_COUNT" -gt 0 ]; then
    log_success "Deleted $DELETED_COUNT old archive(s)"
else
    log_info "No old archives to delete"
fi

# Calculate disk usage
DISK_USAGE=$(du -sh "$LOG_DIR" | cut -f1)
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_DIR" | cut -f1)

echo ""
echo "Log Rotation Summary:"
echo "  - Active logs: $DISK_USAGE"
echo "  - Archives: $ARCHIVE_SIZE"
echo "  - Retention period: $RETENTION_DAYS days"
echo ""

log_success "Log rotation complete!"
