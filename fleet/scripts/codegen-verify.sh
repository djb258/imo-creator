#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# CODEGEN VERIFY — Registry-First Drift Detection
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Verify generated files match column_registry.yml
# Usage: ./scripts/codegen-verify.sh
# Exit: 0 = in sync, 1 = drift detected
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script:
#   1. Reads column_registry.yml
#   2. Generates TypeScript types + Zod schemas into a temp directory
#   3. Diffs temp output against actual generated files
#   4. Reports any drift and exits non-zero if found
#
# Runnable standalone AND as a CI step.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  CODEGEN VERIFY — Registry Drift Detection"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ───────────────────────────────────────────────────────────────────
# LOCATE REGISTRY
# ───────────────────────────────────────────────────────────────────
REGISTRY_FILE=""
if [ -f "column_registry.yml" ]; then
    REGISTRY_FILE="column_registry.yml"
elif [ -f "src/data/db/registry/column_registry.yml" ]; then
    REGISTRY_FILE="src/data/db/registry/column_registry.yml"
else
    echo -e "${RED}[ERROR]${NC} column_registry.yml not found"
    echo "        Searched: ./column_registry.yml"
    echo "        Searched: ./src/data/db/registry/column_registry.yml"
    exit 1
fi

echo "  Registry: $REGISTRY_FILE"

# ───────────────────────────────────────────────────────────────────
# LOCATE CODEGEN SCRIPT
# ───────────────────────────────────────────────────────────────────
CODEGEN_SCRIPT=""
if [ -f "scripts/codegen-generate.sh" ]; then
    CODEGEN_SCRIPT="scripts/codegen-generate.sh"
elif [ -f "./codegen-generate.sh" ]; then
    CODEGEN_SCRIPT="./codegen-generate.sh"
else
    echo -e "${RED}[ERROR]${NC} codegen-generate.sh not found"
    echo "        Searched: ./scripts/codegen-generate.sh"
    echo "        Searched: ./codegen-generate.sh"
    exit 1
fi

# ───────────────────────────────────────────────────────────────────
# CREATE TEMP DIRECTORY
# ───────────────────────────────────────────────────────────────────
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

echo "  Temp dir: $TEMP_DIR"
echo ""

# ───────────────────────────────────────────────────────────────────
# GENERATE INTO TEMP
# ───────────────────────────────────────────────────────────────────
echo "─── Generating from registry ────────────────────────────────"
bash "$CODEGEN_SCRIPT" --output-dir "$TEMP_DIR" > /dev/null 2>&1

# ───────────────────────────────────────────────────────────────────
# DIFF: Hub generated files
# ───────────────────────────────────────────────────────────────────
echo ""
echo "─── Comparing generated output ──────────────────────────────"

diff_directory() {
    local expected_dir="$1"
    local actual_dir="$2"
    local label="$3"

    if [ ! -d "$actual_dir" ]; then
        if [ -d "$expected_dir" ] && [ "$(ls -A "$expected_dir" 2>/dev/null)" ]; then
            echo -e "${RED}[VIOLATION]${NC} $label: Directory missing — $actual_dir"
            echo "            Expected generated files but directory does not exist"
            echo "            Action: Run codegen-generate.sh"
            ((VIOLATIONS++))
        fi
        return
    fi

    if [ ! -d "$expected_dir" ]; then
        return
    fi

    # Check each expected file
    for expected_file in "$expected_dir"/*; do
        [ -f "$expected_file" ] || continue
        local filename
        filename=$(basename "$expected_file")
        local actual_file="$actual_dir/$filename"

        if [ ! -f "$actual_file" ]; then
            echo -e "${RED}[VIOLATION]${NC} $label: Missing file — $filename"
            echo "            Expected: $actual_file"
            echo "            Action: Run codegen-generate.sh"
            ((VIOLATIONS++))
        elif ! diff -q "$expected_file" "$actual_file" > /dev/null 2>&1; then
            echo -e "${RED}[VIOLATION]${NC} $label: Out of sync — $filename"
            echo "            Diff:"
            diff --unified=3 "$expected_file" "$actual_file" | head -20 | sed 's/^/              /'
            echo "            Action: Run codegen-generate.sh"
            ((VIOLATIONS++))
        else
            echo -e "  ${GREEN}[OK]${NC} $label/$filename"
        fi
    done

    # Check for unexpected files in actual that aren't in expected
    for actual_file in "$actual_dir"/*; do
        [ -f "$actual_file" ] || continue
        local filename
        filename=$(basename "$actual_file")
        local expected_file="$expected_dir/$filename"

        if [ ! -f "$expected_file" ]; then
            echo -e "${YELLOW}[WARNING]${NC} $label: Unexpected file — $filename"
            echo "            File exists in generated/ but not produced by registry"
            echo "            Action: Remove or add source to column_registry.yml"
        fi
    done
}

diff_directory "$TEMP_DIR/src/data/hub/generated" "src/data/hub/generated" "hub/generated"
diff_directory "$TEMP_DIR/src/data/spokes/generated" "src/data/spokes/generated" "spokes/generated"

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "───────────────────────────────────────────────────────────────"

if [ $VIOLATIONS -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS file(s) out of sync with column_registry.yml"
    echo ""
    echo "Generated files are PROJECTIONS of column_registry.yml."
    echo "Run: ./scripts/codegen-generate.sh"
    echo "Then commit both the registry and generated files together."
    echo ""
    exit 1
else
    echo -e "${GREEN}PASSED${NC}: All generated files match column_registry.yml"
    echo ""
    exit 0
fi
