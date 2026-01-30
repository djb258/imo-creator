#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# TEMPLATES MANIFEST VERIFICATION
# ═══════════════════════════════════════════════════════════════════════════════
# Purpose: Verify templates/TEMPLATES_MANIFEST.yaml matches actual files
# Usage: ./scripts/verify_templates_manifest.sh [--show-missing] [--auto-update]
# ═══════════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_ROOT/templates/TEMPLATES_MANIFEST.yaml"
TEMPLATES_DIR="$REPO_ROOT/templates"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  TEMPLATES MANIFEST VERIFICATION"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Check manifest exists
if [ ! -f "$MANIFEST" ]; then
    echo -e "${RED}ERROR: TEMPLATES_MANIFEST.yaml not found${NC}"
    echo "Location: $MANIFEST"
    exit 1
fi

# Count actual files
ACTUAL_COUNT=$(find "$TEMPLATES_DIR" -type f | wc -l | tr -d ' ')
echo "Actual files in templates/: $ACTUAL_COUNT"

# Extract declared count from manifest
DECLARED_COUNT=$(grep "total_file_count:" "$MANIFEST" | head -1 | awk '{print $2}')
echo "Declared in manifest:        $DECLARED_COUNT"
echo ""

# Compare counts
if [ "$ACTUAL_COUNT" -eq "$DECLARED_COUNT" ]; then
    echo -e "${GREEN}✓ File count matches${NC}"
else
    echo -e "${RED}✗ FILE COUNT MISMATCH${NC}"
    echo ""
    echo "  Actual:   $ACTUAL_COUNT"
    echo "  Declared: $DECLARED_COUNT"
    echo "  Difference: $((ACTUAL_COUNT - DECLARED_COUNT))"
    echo ""

    if [ "$1" == "--show-missing" ]; then
        echo "Files in templates/ (for comparison):"
        echo "────────────────────────────────────────"
        find "$TEMPLATES_DIR" -type f | sort | sed "s|$REPO_ROOT/||"
    fi

    echo ""
    echo -e "${YELLOW}ACTION REQUIRED:${NC}"
    echo "  1. Update templates/TEMPLATES_MANIFEST.yaml"
    echo "  2. Add/remove files to match reality"
    echo "  3. Update total_file_count to: $ACTUAL_COUNT"
    echo "  4. See MAINTAINER_CHECKLIST.md for protocol"
    echo ""
    exit 1
fi

echo ""

# List actual files for reference
if [ "$1" == "--list" ]; then
    echo "Files in templates/:"
    echo "────────────────────────────────────────"
    find "$TEMPLATES_DIR" -type f | sort | sed "s|$REPO_ROOT/||"
fi

echo "───────────────────────────────────────────────────────────────────────────────"
echo -e "${GREEN}  VERIFICATION PASSED${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
echo ""
echo "Manifest is consistent with templates/ folder."
echo ""
