#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# VERIFY MANIFEST — Disk vs Manifest Sync Check
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Ensure every file in templates/ is listed in TEMPLATES_MANIFEST.yaml
#          and every manifest entry has a corresponding file on disk
# Usage: ./scripts/verify_manifest.sh
# Exit: 0 = in sync, 1 = mismatch found
# ═══════════════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0
WARNINGS=0

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  MANIFEST SYNC VERIFICATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ───────────────────────────────────────────────────────────────────
# LOCATE MANIFEST
# ───────────────────────────────────────────────────────────────────
MANIFEST=""
if [ -f "templates/TEMPLATES_MANIFEST.yaml" ]; then
    MANIFEST="templates/TEMPLATES_MANIFEST.yaml"
elif [ -f "TEMPLATES_MANIFEST.yaml" ]; then
    MANIFEST="TEMPLATES_MANIFEST.yaml"
else
    echo -e "${RED}[ERROR]${NC} TEMPLATES_MANIFEST.yaml not found"
    exit 1
fi

echo "  Manifest: $MANIFEST"
echo ""

# ───────────────────────────────────────────────────────────────────
# COLLECT: Files on disk
# ───────────────────────────────────────────────────────────────────
DISK_FILES=$(find templates -type f | sort)
DISK_COUNT=$(echo "$DISK_FILES" | wc -l | tr -d ' ')

# ───────────────────────────────────────────────────────────────────
# COLLECT: Files in manifest
# ───────────────────────────────────────────────────────────────────
MANIFEST_FILES=$(grep -E '^\s+- path:' "$MANIFEST" | sed 's/.*path: "//;s/"//' | sort)
MANIFEST_COUNT=$(echo "$MANIFEST_FILES" | wc -l | tr -d ' ')

# ───────────────────────────────────────────────────────────────────
# EXTRACT: total_file_count from manifest header
# ───────────────────────────────────────────────────────────────────
DECLARED_COUNT=$(grep -E '^\s+total_file_count:' "$MANIFEST" | head -1 | sed 's/.*total_file_count:\s*//;s/\s*#.*//' | tr -d ' ')

echo "─── Counts ────────────────────────────────────────────────────"
echo "  Files on disk:           $DISK_COUNT"
echo "  Files in manifest:       $MANIFEST_COUNT"
echo "  Declared total_file_count: $DECLARED_COUNT"
echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK: Files on disk but NOT in manifest
# ───────────────────────────────────────────────────────────────────
echo "─── On disk but NOT in manifest ─────────────────────────────"

MISSING_FROM_MANIFEST=$(comm -23 <(echo "$DISK_FILES") <(echo "$MANIFEST_FILES"))

if [ -n "$MISSING_FROM_MANIFEST" ]; then
    while IFS= read -r file; do
        echo -e "  ${RED}[VIOLATION]${NC} MANIFEST_DRIFT: $file"
        echo "              File exists on disk but is not listed in manifest"
        ((VIOLATIONS++))
    done <<< "$MISSING_FROM_MANIFEST"
else
    echo -e "  ${GREEN}[OK]${NC} All disk files are in manifest"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK: Files in manifest but NOT on disk
# ───────────────────────────────────────────────────────────────────
echo "─── In manifest but NOT on disk ─────────────────────────────"

MISSING_FROM_DISK=$(comm -13 <(echo "$DISK_FILES") <(echo "$MANIFEST_FILES"))

if [ -n "$MISSING_FROM_DISK" ]; then
    while IFS= read -r file; do
        echo -e "  ${RED}[VIOLATION]${NC} MANIFEST_GHOST: $file"
        echo "              Listed in manifest but does not exist on disk"
        ((VIOLATIONS++))
    done <<< "$MISSING_FROM_DISK"
else
    echo -e "  ${GREEN}[OK]${NC} All manifest entries exist on disk"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK: total_file_count matches actual manifest entries
# ───────────────────────────────────────────────────────────────────
echo "─── Count verification ────────────────────────────────────────"

if [ "$DECLARED_COUNT" != "$MANIFEST_COUNT" ]; then
    echo -e "  ${RED}[VIOLATION]${NC} COUNT_MISMATCH: total_file_count ($DECLARED_COUNT) != manifest entries ($MANIFEST_COUNT)"
    echo "              Update total_file_count in manifest header"
    ((VIOLATIONS++))
else
    echo -e "  ${GREEN}[OK]${NC} total_file_count matches manifest entries ($MANIFEST_COUNT)"
fi

if [ "$MANIFEST_COUNT" != "$DISK_COUNT" ]; then
    echo -e "  ${RED}[VIOLATION]${NC} SYNC_MISMATCH: manifest entries ($MANIFEST_COUNT) != files on disk ($DISK_COUNT)"
    echo "              Manifest and disk are out of sync"
    ((VIOLATIONS++))
else
    echo -e "  ${GREEN}[OK]${NC} Manifest entries match files on disk ($DISK_COUNT)"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# CHECK: Empty directories in templates/
# ───────────────────────────────────────────────────────────────────
echo "─── Empty directories ───────────────────────────────────────"

EMPTY_DIRS=$(find templates -type d -empty 2>/dev/null)

if [ -n "$EMPTY_DIRS" ]; then
    while IFS= read -r dir; do
        echo -e "  ${YELLOW}[WARNING]${NC} EMPTY_DIR: $dir"
        echo "              Empty directory — add content or delete"
        ((WARNINGS++))
    done <<< "$EMPTY_DIRS"
else
    echo -e "  ${GREEN}[OK]${NC} No empty directories"
fi

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "───────────────────────────────────────────────────────────────"

if [ $VIOLATIONS -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS violation(s) found"
    echo ""
    echo "Manifest is out of sync with disk."
    echo "Action: Update TEMPLATES_MANIFEST.yaml to match reality."
    echo ""
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}PASSED WITH WARNINGS${NC}: $WARNINGS warning(s)"
    echo ""
    exit 0
else
    echo -e "${GREEN}PASSED${NC}: Manifest in sync with disk"
    echo ""
    exit 0
fi
