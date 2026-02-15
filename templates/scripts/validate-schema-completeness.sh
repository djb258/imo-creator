#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# VALIDATE SCHEMA COMPLETENESS — DBA Enforcement Gate
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Validate every table and column in column_registry.yml has complete metadata
# Doctrine: DBA_ENFORCEMENT_DOCTRINE.md Gate B, DOCUMENTATION_ERD_DOCTRINE.md
# Usage: ./scripts/validate-schema-completeness.sh
# Exit: 0 = complete, 1 = violations found, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0
WARNINGS=0
TABLES_CHECKED=0
COLUMNS_CHECKED=0

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SCHEMA COMPLETENESS VALIDATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
if ! command -v yq &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} yq is required but not installed"
    echo "        Install: https://github.com/mikefarah/yq"
    echo "        yq is already required by codegen-generate.sh"
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
echo ""

# ───────────────────────────────────────────────────────────────────
# VALIDATION CONSTANTS
# ───────────────────────────────────────────────────────────────────
VALID_SEMANTIC_ROLES="identifier foreign_key attribute metric"
VALID_FORMATS="UUID ISO-8601 USD_CENTS EMAIL ENUM JSON BOOLEAN STRING INTEGER"
VALID_LEAF_TYPES="CANONICAL ERROR"
VALID_STRATEGIES="UUID SERIAL COMPOSITE"
VALID_DB_TYPES="UUID TEXT VARCHAR CHAR INTEGER INT BIGINT SMALLINT SERIAL BIGSERIAL BOOLEAN BOOL TIMESTAMP TIMESTAMPTZ DATE TIME TIMETZ NUMERIC DECIMAL FLOAT REAL JSON JSONB BYTEA ARRAY INTERVAL MONEY INET"

# ───────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────────
is_placeholder() {
    local val="$1"
    if [ -z "$val" ] || [ "$val" = "null" ]; then
        return 0  # true: is placeholder
    fi
    # Check for bracket placeholders: [VALUE]
    if echo "$val" | grep -qE '^\[.*\]$'; then
        return 0  # true: is placeholder
    fi
    return 1  # false: not placeholder
}

list_contains() {
    local item="$1"
    local list="$2"
    for entry in $list; do
        if [ "$(echo "$item" | tr '[:lower:]' '[:upper:]')" = "$(echo "$entry" | tr '[:lower:]' '[:upper:]')" ]; then
            return 0
        fi
    done
    return 1
}

violation() {
    echo -e "${RED}[VIOLATION]${NC} $1"
    ((VIOLATIONS++))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    ((WARNINGS++))
}

# ───────────────────────────────────────────────────────────────────
# VALIDATE COLUMN
# ───────────────────────────────────────────────────────────────────
validate_column() {
    local table_name="$1"
    local col_path="$2"
    ((COLUMNS_CHECKED++))

    local col_name col_desc col_type col_nullable col_role col_format
    col_name=$(yq "$col_path.name" "$REGISTRY_FILE")
    col_desc=$(yq "$col_path.description" "$REGISTRY_FILE")
    col_type=$(yq "$col_path.type" "$REGISTRY_FILE")
    col_nullable=$(yq "$col_path.nullable" "$REGISTRY_FILE")
    col_role=$(yq "$col_path.semantic_role" "$REGISTRY_FILE")
    col_format=$(yq "$col_path.format" "$REGISTRY_FILE")

    local prefix="Table '$table_name', Column '${col_name:-???}'"

    # name
    if is_placeholder "$col_name"; then
        violation "$prefix: 'name' is missing or placeholder"
    fi

    # description (min 10 chars, no placeholders)
    if is_placeholder "$col_desc"; then
        violation "$prefix: 'description' is missing or placeholder"
    elif [ "${#col_desc}" -lt 10 ]; then
        violation "$prefix: 'description' too short (${#col_desc} chars, min 10)"
    fi

    # type (recognized database type)
    if is_placeholder "$col_type"; then
        violation "$prefix: 'type' is missing or placeholder"
    elif ! list_contains "$col_type" "$VALID_DB_TYPES"; then
        warning "$prefix: 'type' = '$col_type' not in standard list (may be valid)"
    fi

    # nullable (explicit true or false)
    if is_placeholder "$col_nullable"; then
        violation "$prefix: 'nullable' must be explicitly true or false"
    elif [ "$col_nullable" != "true" ] && [ "$col_nullable" != "false" ]; then
        violation "$prefix: 'nullable' = '$col_nullable' (must be true or false)"
    fi

    # semantic_role
    if is_placeholder "$col_role"; then
        violation "$prefix: 'semantic_role' is missing or placeholder"
    elif ! list_contains "$col_role" "$VALID_SEMANTIC_ROLES"; then
        violation "$prefix: 'semantic_role' = '$col_role' (must be: $VALID_SEMANTIC_ROLES)"
    fi

    # format
    if is_placeholder "$col_format"; then
        violation "$prefix: 'format' is missing or placeholder"
    elif ! list_contains "$col_format" "$VALID_FORMATS"; then
        warning "$prefix: 'format' = '$col_format' not in standard list (may be valid)"
    fi
}

# ───────────────────────────────────────────────────────────────────
# VALIDATE TABLE
# ───────────────────────────────────────────────────────────────────
validate_table() {
    local table_path="$1"
    local is_spine="${2:-false}"
    ((TABLES_CHECKED++))

    local table_name table_desc leaf_type sot ris
    table_name=$(yq "$table_path.name" "$REGISTRY_FILE")
    table_desc=$(yq "$table_path.description" "$REGISTRY_FILE")
    leaf_type=$(yq "$table_path.leaf_type" "$REGISTRY_FILE")
    sot=$(yq "$table_path.source_of_truth" "$REGISTRY_FILE")
    ris=$(yq "$table_path.row_identity_strategy" "$REGISTRY_FILE")

    local prefix="Table '${table_name:-???}'"

    # name
    if is_placeholder "$table_name"; then
        violation "$prefix: 'name' is missing or placeholder"
    fi

    # description (min 10 chars, no placeholders)
    if is_placeholder "$table_desc"; then
        violation "$prefix: 'description' is missing or placeholder"
    elif [ "${#table_desc}" -lt 10 ]; then
        violation "$prefix: 'description' too short (${#table_desc} chars, min 10)"
    fi

    # leaf_type (CANONICAL or ERROR; others require ADR)
    if is_placeholder "$leaf_type"; then
        violation "$prefix: 'leaf_type' is missing or placeholder"
    elif ! list_contains "$leaf_type" "$VALID_LEAF_TYPES"; then
        warning "$prefix: 'leaf_type' = '$leaf_type' (not CANONICAL/ERROR — ADR required)"
    fi

    # source_of_truth (explicit true or false)
    if is_placeholder "$sot"; then
        violation "$prefix: 'source_of_truth' must be explicitly true or false"
    elif [ "$sot" != "true" ] && [ "$sot" != "false" ]; then
        violation "$prefix: 'source_of_truth' = '$sot' (must be true or false)"
    fi

    # row_identity_strategy
    if is_placeholder "$ris"; then
        violation "$prefix: 'row_identity_strategy' is missing or placeholder"
    elif ! list_contains "$ris" "$VALID_STRATEGIES"; then
        violation "$prefix: 'row_identity_strategy' = '$ris' (must be: $VALID_STRATEGIES)"
    fi

    # owning_subhub (validate only for non-spine tables)
    if [ "$is_spine" != "true" ]; then
        local owning_subhub
        owning_subhub=$(yq "$table_path.owning_subhub" "$REGISTRY_FILE" 2>/dev/null || echo "null")
        # Sub-hub tables get their owning_subhub from parent structure; not required in table block
    fi

    # Validate columns
    local col_count
    col_count=$(yq "$table_path.columns | length" "$REGISTRY_FILE")
    if [ "$col_count" = "0" ] || [ "$col_count" = "null" ]; then
        violation "$prefix: No columns declared"
    else
        for (( c=0; c<col_count; c++ )); do
            validate_column "$table_name" "$table_path.columns[$c]"
        done
    fi
}

# ───────────────────────────────────────────────────────────────────
# VALIDATE SPINE TABLE
# ───────────────────────────────────────────────────────────────────
echo "─── Spine Table ───────────────────────────────────────────────"

SPINE_NAME=$(yq '.spine_table.name' "$REGISTRY_FILE")
if [ "$SPINE_NAME" != "null" ] && [ -n "$SPINE_NAME" ] && ! is_placeholder "$SPINE_NAME"; then
    validate_table ".spine_table" "true"
    echo -e "  ${GREEN}[CHECKED]${NC} Spine: $SPINE_NAME"
else
    echo -e "  ${YELLOW}[SKIP]${NC} No spine table declared or still placeholder"
fi

# ───────────────────────────────────────────────────────────────────
# VALIDATE SUB-HUB TABLES
# ───────────────────────────────────────────────────────────────────
echo ""
echo "─── Sub-Hub Tables ──────────────────────────────────────────"

SUBHUB_COUNT=$(yq '.subhubs | length' "$REGISTRY_FILE")

if [ "$SUBHUB_COUNT" = "0" ] || [ "$SUBHUB_COUNT" = "null" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} No sub-hubs declared"
else
    for (( s=0; s<SUBHUB_COUNT; s++ )); do
        SUBHUB_ID=$(yq ".subhubs[$s].subhub_id" "$REGISTRY_FILE")
        SUBHUB_NAME=$(yq ".subhubs[$s].name" "$REGISTRY_FILE")
        echo ""
        echo "  Sub-hub: $SUBHUB_NAME ($SUBHUB_ID)"

        TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE")
        if [ "$TABLE_COUNT" = "0" ] || [ "$TABLE_COUNT" = "null" ]; then
            echo -e "    ${YELLOW}[SKIP]${NC} No tables declared"
            continue
        fi

        for (( t=0; t<TABLE_COUNT; t++ )); do
            local_table_name=$(yq ".subhubs[$s].tables[$t].name" "$REGISTRY_FILE")
            validate_table ".subhubs[$s].tables[$t]" "false"
            echo -e "    ${GREEN}[CHECKED]${NC} $local_table_name"
        done
    done
fi

# ───────────────────────────────────────────────────────────────────
# VALIDATE DECLARED SUBHUB REFERENCES
# ───────────────────────────────────────────────────────────────────
# Collect all declared subhub_ids for cross-referencing
if [ "$SUBHUB_COUNT" != "0" ] && [ "$SUBHUB_COUNT" != "null" ]; then
    for (( s=0; s<SUBHUB_COUNT; s++ )); do
        SH_ID=$(yq ".subhubs[$s].subhub_id" "$REGISTRY_FILE")
        if is_placeholder "$SH_ID"; then
            violation "Sub-hub [$s]: 'subhub_id' is missing or placeholder"
        fi
        SH_NAME=$(yq ".subhubs[$s].name" "$REGISTRY_FILE")
        if is_placeholder "$SH_NAME"; then
            violation "Sub-hub [$s]: 'name' is missing or placeholder"
        fi
    done
fi

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "───────────────────────────────────────────────────────────────"
echo "  Tables checked:  $TABLES_CHECKED"
echo "  Columns checked: $COLUMNS_CHECKED"
echo ""

if [ $VIOLATIONS -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS violation(s), $WARNINGS warning(s)"
    echo ""
    echo "Schema metadata incomplete. Every table needs description +"
    echo "leaf_type + source_of_truth + row_identity_strategy."
    echo "Every column needs description + type + nullable +"
    echo "semantic_role + format. No placeholders."
    echo ""
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}PASSED WITH WARNINGS${NC}: $WARNINGS warning(s)"
    echo ""
    exit 0
else
    echo -e "${GREEN}PASSED${NC}: Schema metadata complete"
    echo ""
    exit 0
fi
