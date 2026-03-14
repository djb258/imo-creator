#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# GENERATE DATA DICTIONARY — Registry-First Documentation
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Generate docs/data/COLUMN_DATA_DICTIONARY.md from column_registry.yml
# Doctrine: DOCUMENTATION_ERD_DOCTRINE.md — Column Data Dictionary Requirements
# Usage: ./scripts/generate-data-dictionary.sh
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script reads column_registry.yml and produces a Markdown data dictionary.
# The output is a PROJECTION of the registry — never hand-edit the output.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

AUTOGEN_MARKER="<!-- AUTO-GENERATED FROM column_registry.yml — DO NOT HAND EDIT -->"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  GENERATE DATA DICTIONARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
if ! command -v yq &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} yq is required but not installed"
    echo "        Install: https://github.com/mikefarah/yq"
    exit 2
fi

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
# OUTPUT SETUP
# ───────────────────────────────────────────────────────────────────
OUT_DIR="docs/data"
OUT_FILE="$OUT_DIR/COLUMN_DATA_DICTIONARY.md"
mkdir -p "$OUT_DIR"

echo "  Output:   $OUT_FILE"
echo ""

# ───────────────────────────────────────────────────────────────────
# HELPER: Generate table section
# ───────────────────────────────────────────────────────────────────
generate_table_section() {
    local table_path="$1"
    local subhub_label="${2:-Hub-level (spine)}"

    local table_name table_desc leaf_type sot ris
    table_name=$(yq "$table_path.name" "$REGISTRY_FILE")
    table_desc=$(yq "$table_path.description" "$REGISTRY_FILE")
    leaf_type=$(yq "$table_path.leaf_type" "$REGISTRY_FILE")
    sot=$(yq "$table_path.source_of_truth" "$REGISTRY_FILE")
    ris=$(yq "$table_path.row_identity_strategy" "$REGISTRY_FILE")

    {
        echo ""
        echo "## $table_name"
        echo ""
        echo "$table_desc"
        echo ""
        echo "| Owning Sub-Hub | Leaf Type | Source of Truth | Row Identity |"
        echo "|----------------|-----------|-----------------|--------------|"
        echo "| $subhub_label | $leaf_type | $sot | $ris |"
        echo ""
    } >> "$OUT_FILE"

    local col_count
    col_count=$(yq "$table_path.columns | length" "$REGISTRY_FILE")

    if [ "$col_count" = "0" ] || [ "$col_count" = "null" ]; then
        echo "*No columns declared.*" >> "$OUT_FILE"
        return
    fi

    {
        echo "| Column | Type | Format | Nullable | Semantic Role | Description |"
        echo "|--------|------|--------|----------|---------------|-------------|"
    } >> "$OUT_FILE"

    for (( c=0; c<col_count; c++ )); do
        local col_name col_type col_format col_nullable col_role col_desc
        col_name=$(yq "$table_path.columns[$c].name" "$REGISTRY_FILE")
        col_type=$(yq "$table_path.columns[$c].type" "$REGISTRY_FILE")
        col_format=$(yq "$table_path.columns[$c].format" "$REGISTRY_FILE")
        col_nullable=$(yq "$table_path.columns[$c].nullable" "$REGISTRY_FILE")
        col_role=$(yq "$table_path.columns[$c].semantic_role" "$REGISTRY_FILE")
        col_desc=$(yq "$table_path.columns[$c].description" "$REGISTRY_FILE")

        echo "| \`$col_name\` | $col_type | $col_format | $col_nullable | $col_role | $col_desc |" >> "$OUT_FILE"
    done

    echo -e "  ${GREEN}[OK]${NC} $table_name (${col_count} columns)"
}

# ───────────────────────────────────────────────────────────────────
# GENERATE HEADER
# ───────────────────────────────────────────────────────────────────
HUB_NAME=$(yq '.hub.hub_name' "$REGISTRY_FILE")
HUB_ID=$(yq '.hub.hub_id' "$REGISTRY_FILE")
REGISTRY_VERSION=$(yq '.version' "$REGISTRY_FILE")
GENERATED_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

{
    echo "$AUTOGEN_MARKER"
    echo ""
    echo "# Column Data Dictionary"
    echo ""
    echo "Generated from \`column_registry.yml\` — **DO NOT HAND EDIT**"
    echo ""
    echo "| Field | Value |"
    echo "|-------|-------|"
    echo "| Hub | $HUB_NAME ($HUB_ID) |"
    echo "| Registry Version | $REGISTRY_VERSION |"
    echo "| Generated | $GENERATED_DATE |"
    echo "| Regenerate | \`./scripts/generate-data-dictionary.sh\` |"
    echo ""
    echo "---"
} > "$OUT_FILE"

# ───────────────────────────────────────────────────────────────────
# GENERATE SPINE TABLE
# ───────────────────────────────────────────────────────────────────
echo "─── Spine Table ───────────────────────────────────────────────"

SPINE_NAME=$(yq '.spine_table.name' "$REGISTRY_FILE")
if [ "$SPINE_NAME" != "null" ] && [ -n "$SPINE_NAME" ]; then
    generate_table_section ".spine_table" "Hub-level (spine)"
else
    echo -e "  ${YELLOW}[SKIP]${NC} No spine table declared"
fi

# ───────────────────────────────────────────────────────────────────
# GENERATE SUB-HUB TABLES
# ───────────────────────────────────────────────────────────────────
echo ""
echo "─── Sub-Hub Tables ──────────────────────────────────────────"

SUBHUB_COUNT=$(yq '.subhubs | length' "$REGISTRY_FILE")

if [ "$SUBHUB_COUNT" = "0" ] || [ "$SUBHUB_COUNT" = "null" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} No sub-hubs declared"
else
    for (( s=0; s<SUBHUB_COUNT; s++ )); do
        SUBHUB_NAME=$(yq ".subhubs[$s].name" "$REGISTRY_FILE")
        SUBHUB_ID=$(yq ".subhubs[$s].subhub_id" "$REGISTRY_FILE")

        {
            echo ""
            echo "---"
            echo ""
            echo "# Sub-Hub: $SUBHUB_NAME"
            echo ""
        } >> "$OUT_FILE"

        echo ""
        echo "  Sub-hub: $SUBHUB_NAME ($SUBHUB_ID)"

        TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE")
        if [ "$TABLE_COUNT" = "0" ] || [ "$TABLE_COUNT" = "null" ]; then
            echo -e "    ${YELLOW}[SKIP]${NC} No tables declared"
            continue
        fi

        for (( t=0; t<TABLE_COUNT; t++ )); do
            generate_table_section ".subhubs[$s].tables[$t]" "$SUBHUB_NAME"
        done
    done
fi

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}DATA DICTIONARY GENERATED${NC}: $OUT_FILE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
