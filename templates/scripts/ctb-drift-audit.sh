#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# CTB DRIFT AUDIT — Live Database vs Registry Drift Detection
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Detect drift between live database state, ctb.table_registry,
#          and column_registry.yml
# Doctrine: CTB_REGISTRY_ENFORCEMENT.md §6
# Usage:
#   DATABASE_URL="postgres://..." ./scripts/ctb-drift-audit.sh [OPTIONS]
#
# Options:
#   --mode=strict     Fail on ANY rogue table (default)
#   --mode=baseline   Fail only on NEW rogue tables since last baseline
#   --write-baseline  Capture current state to docs/CTB_DRIFT_BASELINE.json
#
# Exit: 0 = no drift, 1 = drift detected, 2 = dependency/connection error
# ═══════════════════════════════════════════════════════════════════════════════
#
# COMPARISON SURFACES:
#   Surface A: Live database (information_schema.tables + columns)
#   Surface B: ctb.table_registry (runtime registry in DB)
#   Surface C: column_registry.yml (build-time YAML registry)
#
# DRIFT CLASSES:
#   ROGUE_TABLE    — exists in DB but NOT in ctb.table_registry
#   PHANTOM_TABLE  — registered in ctb.table_registry but NOT in DB
#   ORPHAN_TABLE   — in DB but NOT in column_registry.yml
#   GHOST_TABLE    — in column_registry.yml but NOT in DB
#   COLUMN_DRIFT   — column mismatch between DB and column_registry.yml
#   REGISTRY_DESYNC — ctb.table_registry disagrees with column_registry.yml
#
# MODES:
#   strict   — ROGUE_TABLE = VIOLATION (fail on any rogue table)
#   baseline — Only NEW rogue tables (not in baseline) are VIOLATIONS.
#              Known rogue tables from baseline are WARNINGS.
#              New undocumented columns on CANONICAL tables are VIOLATIONS.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

VIOLATIONS=0
WARNINGS=0
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)
BASELINE_FILE="docs/CTB_DRIFT_BASELINE.json"

# ───────────────────────────────────────────────────────────────────
# ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────────
MODE="strict"
WRITE_BASELINE=false

for arg in "$@"; do
    case "$arg" in
        --mode=strict)   MODE="strict" ;;
        --mode=baseline) MODE="baseline" ;;
        --write-baseline) WRITE_BASELINE=true ;;
        --help|-h)
            echo "Usage: DATABASE_URL=\"postgres://...\" $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --mode=strict      Fail on ANY rogue table (default)"
            echo "  --mode=baseline    Fail only on NEW rogue tables since last baseline"
            echo "  --write-baseline   Capture current state to $BASELINE_FILE"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown argument: $arg"
            echo "Use --help for usage"
            exit 2
            ;;
    esac
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  CTB DRIFT AUDIT"
echo "═══════════════════════════════════════════════════════════════"
echo "  Date: $TIMESTAMP"
echo "  Mode: $MODE"
if [ "$WRITE_BASELINE" = true ]; then
    echo "  Action: WRITE BASELINE"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
if ! command -v psql &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} psql is required but not installed"
    echo "        Install: apt-get install postgresql-client"
    exit 2
fi

if [ -z "${DATABASE_URL:-}" ]; then
    echo -e "${RED}[ERROR]${NC} DATABASE_URL environment variable is required"
    echo "        Usage: DATABASE_URL=\"postgres://...\" ./scripts/ctb-drift-audit.sh"
    exit 2
fi

if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}[WARNING]${NC} jq not installed — baseline mode unavailable"
    if [ "$MODE" = "baseline" ]; then
        echo -e "${RED}[ERROR]${NC} jq is required for baseline mode"
        exit 2
    fi
fi

# ───────────────────────────────────────────────────────────────────
# LOCATE column_registry.yml
# ───────────────────────────────────────────────────────────────────
REGISTRY_FILE=""
if [ -f "column_registry.yml" ]; then
    REGISTRY_FILE="column_registry.yml"
elif [ -f "src/data/db/registry/column_registry.yml" ]; then
    REGISTRY_FILE="src/data/db/registry/column_registry.yml"
fi

HAS_YQ=false
if command -v yq &> /dev/null; then
    HAS_YQ=true
fi

echo "  Database:  [connected via DATABASE_URL]"
echo "  Registry:  ${REGISTRY_FILE:-<not found>}"
echo "  yq:        $HAS_YQ"
echo "  Baseline:  ${BASELINE_FILE}"
echo ""

# ───────────────────────────────────────────────────────────────────
# LOAD BASELINE (if baseline mode)
# ───────────────────────────────────────────────────────────────────
BASELINE_ROGUE_TABLES=()
BASELINE_COLUMNS=()
BASELINE_LOADED=false

if [ "$MODE" = "baseline" ]; then
    if [ -f "$BASELINE_FILE" ]; then
        echo "─── Loading Baseline ───────────────────────────────────────"
        # Extract known rogue tables from baseline
        while IFS= read -r table; do
            [ -z "$table" ] && continue
            BASELINE_ROGUE_TABLES+=("$table")
        done < <(jq -r '.known_rogue_tables[]? // empty' "$BASELINE_FILE" 2>/dev/null)

        # Extract known column state from baseline
        while IFS= read -r entry; do
            [ -z "$entry" ] && continue
            BASELINE_COLUMNS+=("$entry")
        done < <(jq -r '.canonical_columns[]? // empty' "$BASELINE_FILE" 2>/dev/null)

        BASELINE_LOADED=true
        echo -e "  ${GREEN}[OK]${NC} Baseline loaded: ${#BASELINE_ROGUE_TABLES[@]} known rogue table(s), ${#BASELINE_COLUMNS[@]} canonical column(s)"
        echo ""
    else
        echo -e "${YELLOW}[WARNING]${NC} Baseline file not found: $BASELINE_FILE"
        echo "          Run with --write-baseline to create it"
        echo "          Falling back to strict mode behavior"
        echo ""
    fi
fi

# ───────────────────────────────────────────────────────────────────
# HELPERS
# ───────────────────────────────────────────────────────────────────
violation() {
    echo -e "  ${RED}[VIOLATION]${NC} $1"
    ((VIOLATIONS++))
}

warning() {
    echo -e "  ${YELLOW}[WARNING]${NC} $1"
    ((WARNINGS++))
}

run_sql() {
    psql "$DATABASE_URL" -t -A -c "$1" 2>/dev/null
}

# Check if a table is in the baseline rogue list
is_baseline_rogue() {
    local table="$1"
    for bt in "${BASELINE_ROGUE_TABLES[@]}"; do
        if [ "$bt" = "$table" ]; then
            return 0
        fi
    done
    return 1
}

# Check if a column is in the baseline canonical columns list
is_baseline_column() {
    local entry="$1"
    for bc in "${BASELINE_COLUMNS[@]}"; do
        if [ "$bc" = "$entry" ]; then
            return 0
        fi
    done
    return 1
}

# ───────────────────────────────────────────────────────────────────
# TEST CONNECTION
# ───────────────────────────────────────────────────────────────────
echo "─── Connection Test ──────────────────────────────────────────"
if ! run_sql "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}[ERROR]${NC} Cannot connect to database"
    exit 2
fi
echo -e "  ${GREEN}[OK]${NC} Database connection verified"
echo ""

# ───────────────────────────────────────────────────────────────────
# SURFACE A: Live database tables (exclude system schemas)
# ───────────────────────────────────────────────────────────────────
echo "─── Surface A: Live Database Tables ──────────────────────────"

DB_TABLES=$(run_sql "
    SELECT table_schema || '.' || table_name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog', 'information_schema', 'ctb')
      AND table_schema NOT LIKE 'pg_temp%'
    ORDER BY table_schema, table_name;
")

DB_TABLE_COUNT=$(echo "$DB_TABLES" | grep -c '.' 2>/dev/null || echo "0")
echo "  Found $DB_TABLE_COUNT table(s) in live database"
echo ""

# ───────────────────────────────────────────────────────────────────
# SURFACE B: ctb.table_registry (if it exists)
# ───────────────────────────────────────────────────────────────────
echo "─── Surface B: ctb.table_registry ────────────────────────────"

CTB_REGISTRY_EXISTS=$(run_sql "
    SELECT EXISTS(
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'ctb' AND table_name = 'table_registry'
    );" 2>/dev/null || echo "f")

REGISTRY_TABLES=""
REGISTRY_TABLE_COUNT=0

if [ "$CTB_REGISTRY_EXISTS" = "t" ]; then
    REGISTRY_TABLES=$(run_sql "
        SELECT table_schema || '.' || table_name
        FROM ctb.table_registry
        ORDER BY table_schema, table_name;
    ")
    REGISTRY_TABLE_COUNT=$(echo "$REGISTRY_TABLES" | grep -c '.' 2>/dev/null || echo "0")
    echo "  Found $REGISTRY_TABLE_COUNT table(s) in ctb.table_registry"
else
    echo -e "  ${YELLOW}[SKIP]${NC} ctb.table_registry does not exist (migrations not applied)"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# SURFACE C: column_registry.yml (if available + yq)
# ───────────────────────────────────────────────────────────────────
echo "─── Surface C: column_registry.yml ───────────────────────────"

YAML_TABLES=()
CANONICAL_TABLES=()
if [ -n "$REGISTRY_FILE" ] && [ "$HAS_YQ" = true ]; then
    # Spine table
    SPINE_SCHEMA=$(yq '.spine_table.schema' "$REGISTRY_FILE" 2>/dev/null || echo "null")
    SPINE_NAME=$(yq '.spine_table.name' "$REGISTRY_FILE" 2>/dev/null || echo "null")

    if [ "$SPINE_NAME" != "null" ] && [ -n "$SPINE_NAME" ] && ! echo "$SPINE_NAME" | grep -qE '^\['; then
        if [ "$SPINE_SCHEMA" != "null" ] && [ -n "$SPINE_SCHEMA" ] && ! echo "$SPINE_SCHEMA" | grep -qE '^\['; then
            YAML_TABLES+=("${SPINE_SCHEMA}.${SPINE_NAME}")
        else
            YAML_TABLES+=("public.${SPINE_NAME}")
        fi
    fi

    # Sub-hub tables
    SUBHUB_COUNT=$(yq '.subhubs | length' "$REGISTRY_FILE" 2>/dev/null || echo "0")
    if [ "$SUBHUB_COUNT" != "0" ] && [ "$SUBHUB_COUNT" != "null" ]; then
        for (( s=0; s<SUBHUB_COUNT; s++ )); do
            TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE" 2>/dev/null || echo "0")
            if [ "$TABLE_COUNT" != "0" ] && [ "$TABLE_COUNT" != "null" ]; then
                for (( t=0; t<TABLE_COUNT; t++ )); do
                    T_NAME=$(yq ".subhubs[$s].tables[$t].name" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                    T_SCHEMA=$(yq ".subhubs[$s].tables[$t].schema" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                    T_LEAF=$(yq ".subhubs[$s].tables[$t].leaf_type" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                    if [ "$T_NAME" != "null" ] && [ -n "$T_NAME" ] && ! echo "$T_NAME" | grep -qE '^\['; then
                        FULL_NAME=""
                        if [ "$T_SCHEMA" != "null" ] && [ -n "$T_SCHEMA" ] && ! echo "$T_SCHEMA" | grep -qE '^\['; then
                            FULL_NAME="${T_SCHEMA}.${T_NAME}"
                        else
                            FULL_NAME="public.${T_NAME}"
                        fi
                        YAML_TABLES+=("$FULL_NAME")
                        # Track CANONICAL tables for baseline mode column checks
                        if [ "$T_LEAF" = "CANONICAL" ]; then
                            CANONICAL_TABLES+=("$FULL_NAME")
                        fi
                    fi
                done
            fi
        done
    fi

    echo "  Found ${#YAML_TABLES[@]} table(s) in column_registry.yml"
    echo "  CANONICAL tables: ${#CANONICAL_TABLES[@]}"
elif [ -z "$REGISTRY_FILE" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} column_registry.yml not found"
else
    echo -e "  ${YELLOW}[SKIP]${NC} yq not installed — cannot parse column_registry.yml"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DRIFT CHECK 1: ROGUE tables (in DB, NOT in ctb.table_registry)
# ───────────────────────────────────────────────────────────────────
echo "─── Drift Check 1: Rogue Tables (DB vs ctb.table_registry) ──"

ROGUE_LIST=()
if [ "$CTB_REGISTRY_EXISTS" = "t" ] && [ -n "$DB_TABLES" ]; then
    ROGUE_COUNT=0
    while IFS= read -r db_table; do
        [ -z "$db_table" ] && continue
        if ! echo "$REGISTRY_TABLES" | grep -qx "$db_table"; then
            ROGUE_LIST+=("$db_table")
            if [ "$MODE" = "baseline" ] && [ "$BASELINE_LOADED" = true ]; then
                if is_baseline_rogue "$db_table"; then
                    warning "ROGUE_TABLE (KNOWN): $db_table — in baseline, not new entropy"
                else
                    violation "ROGUE_TABLE (NEW): $db_table — NOT in baseline, new unregistered table"
                fi
            else
                violation "ROGUE_TABLE: $db_table exists in DB but NOT in ctb.table_registry"
            fi
            ((ROGUE_COUNT++))
        fi
    done <<< "$DB_TABLES"

    if [ "$ROGUE_COUNT" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} All DB tables are registered in ctb.table_registry"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} ctb.table_registry not available"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DRIFT CHECK 2: PHANTOM tables (in ctb.table_registry, NOT in DB)
# ───────────────────────────────────────────────────────────────────
echo "─── Drift Check 2: Phantom Tables (registry vs DB) ──────────"

if [ "$CTB_REGISTRY_EXISTS" = "t" ] && [ -n "$REGISTRY_TABLES" ]; then
    PHANTOM_COUNT=0
    while IFS= read -r reg_table; do
        [ -z "$reg_table" ] && continue
        if ! echo "$DB_TABLES" | grep -qx "$reg_table"; then
            warning "PHANTOM_TABLE: $reg_table in ctb.table_registry but NOT in DB"
            ((PHANTOM_COUNT++))
        fi
    done <<< "$REGISTRY_TABLES"

    if [ "$PHANTOM_COUNT" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} All registered tables exist in DB"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} ctb.table_registry not available"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DRIFT CHECK 3: ORPHAN tables (in DB, NOT in column_registry.yml)
# ───────────────────────────────────────────────────────────────────
echo "─── Drift Check 3: Orphan Tables (DB vs YAML) ───────────────"

if [ ${#YAML_TABLES[@]} -gt 0 ] && [ -n "$DB_TABLES" ]; then
    ORPHAN_COUNT=0
    while IFS= read -r db_table; do
        [ -z "$db_table" ] && continue
        FOUND=false
        for yaml_table in "${YAML_TABLES[@]}"; do
            if [ "$db_table" = "$yaml_table" ]; then
                FOUND=true
                break
            fi
            db_bare="${db_table##*.}"
            yaml_bare="${yaml_table##*.}"
            if [ "$db_bare" = "$yaml_bare" ]; then
                FOUND=true
                break
            fi
        done
        if [ "$FOUND" = false ]; then
            warning "ORPHAN_TABLE: $db_table in DB but NOT in column_registry.yml"
            ((ORPHAN_COUNT++))
        fi
    done <<< "$DB_TABLES"

    if [ "$ORPHAN_COUNT" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} All DB tables found in column_registry.yml"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} column_registry.yml not available or empty"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DRIFT CHECK 4: GHOST tables (in column_registry.yml, NOT in DB)
# ───────────────────────────────────────────────────────────────────
echo "─── Drift Check 4: Ghost Tables (YAML vs DB) ────────────────"

if [ ${#YAML_TABLES[@]} -gt 0 ] && [ -n "$DB_TABLES" ]; then
    GHOST_COUNT=0
    for yaml_table in "${YAML_TABLES[@]}"; do
        FOUND=false
        while IFS= read -r db_table; do
            [ -z "$db_table" ] && continue
            if [ "$yaml_table" = "$db_table" ]; then
                FOUND=true
                break
            fi
            yaml_bare="${yaml_table##*.}"
            db_bare="${db_table##*.}"
            if [ "$yaml_bare" = "$db_bare" ]; then
                FOUND=true
                break
            fi
        done <<< "$DB_TABLES"

        if [ "$FOUND" = false ]; then
            warning "GHOST_TABLE: $yaml_table in column_registry.yml but NOT in DB"
            ((GHOST_COUNT++))
        fi
    done

    if [ "$GHOST_COUNT" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} All YAML tables exist in DB"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} column_registry.yml not available or empty"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DRIFT CHECK 5: REGISTRY DESYNC (ctb.table_registry vs column_registry.yml)
# ───────────────────────────────────────────────────────────────────
echo "─── Drift Check 5: Registry Desync ───────────────────────────"

if [ "$CTB_REGISTRY_EXISTS" = "t" ] && [ ${#YAML_TABLES[@]} -gt 0 ]; then
    DESYNC_COUNT=0

    while IFS= read -r reg_table; do
        [ -z "$reg_table" ] && continue
        FOUND=false
        for yaml_table in "${YAML_TABLES[@]}"; do
            if [ "$reg_table" = "$yaml_table" ]; then
                FOUND=true; break
            fi
            reg_bare="${reg_table##*.}"
            yaml_bare="${yaml_table##*.}"
            if [ "$reg_bare" = "$yaml_bare" ]; then
                FOUND=true; break
            fi
        done
        if [ "$FOUND" = false ]; then
            warning "REGISTRY_DESYNC: $reg_table in ctb.table_registry but NOT in column_registry.yml"
            ((DESYNC_COUNT++))
        fi
    done <<< "$REGISTRY_TABLES"

    for yaml_table in "${YAML_TABLES[@]}"; do
        FOUND=false
        while IFS= read -r reg_table; do
            [ -z "$reg_table" ] && continue
            if [ "$yaml_table" = "$reg_table" ]; then
                FOUND=true; break
            fi
            yaml_bare="${yaml_table##*.}"
            reg_bare="${reg_table##*.}"
            if [ "$yaml_bare" = "$reg_bare" ]; then
                FOUND=true; break
            fi
        done <<< "$REGISTRY_TABLES"

        if [ "$FOUND" = false ]; then
            warning "REGISTRY_DESYNC: $yaml_table in column_registry.yml but NOT in ctb.table_registry"
            ((DESYNC_COUNT++))
        fi
    done

    if [ "$DESYNC_COUNT" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} ctb.table_registry and column_registry.yml are in sync"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} Cannot compare (one or both registries unavailable)"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# DRIFT CHECK 6: COLUMN DRIFT (DB columns vs column_registry.yml)
# ───────────────────────────────────────────────────────────────────
echo "─── Drift Check 6: Column Drift ─────────────────────────────"

COLUMN_DRIFT_COUNT=0
CANONICAL_COLUMN_STATE=()
if [ ${#YAML_TABLES[@]} -gt 0 ] && [ "$HAS_YQ" = true ] && [ -n "$REGISTRY_FILE" ]; then
    for yaml_table in "${YAML_TABLES[@]}"; do
        yaml_schema="${yaml_table%%.*}"
        yaml_name="${yaml_table##*.}"

        # Determine if this is a CANONICAL table
        IS_CANONICAL=false
        for ct in "${CANONICAL_TABLES[@]}"; do
            if [ "$ct" = "$yaml_table" ]; then
                IS_CANONICAL=true
                break
            fi
        done

        # Get DB columns for this table
        DB_COLS=$(run_sql "
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = '$yaml_schema' AND table_name = '$yaml_name'
            ORDER BY ordinal_position;
        " 2>/dev/null || echo "")

        if [ -z "$DB_COLS" ]; then
            continue
        fi

        # Record CANONICAL column state for baseline
        if [ "$IS_CANONICAL" = true ]; then
            while IFS= read -r col; do
                [ -z "$col" ] && continue
                CANONICAL_COLUMN_STATE+=("${yaml_table}.${col}")
            done <<< "$DB_COLS"
        fi

        # Get YAML columns for this table
        YAML_COLS=""

        # Check spine
        SPINE_N=$(yq '.spine_table.name' "$REGISTRY_FILE" 2>/dev/null || echo "null")
        if [ "$SPINE_N" = "$yaml_name" ]; then
            COL_COUNT=$(yq '.spine_table.columns | length' "$REGISTRY_FILE" 2>/dev/null || echo "0")
            for (( c=0; c<COL_COUNT; c++ )); do
                COL_NAME=$(yq ".spine_table.columns[$c].name" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                if [ "$COL_NAME" != "null" ] && ! echo "$COL_NAME" | grep -qE '^\['; then
                    YAML_COLS="$YAML_COLS
$COL_NAME"
                fi
            done
        fi

        # Check sub-hub tables
        if [ -z "$YAML_COLS" ]; then
            SUBHUB_COUNT=$(yq '.subhubs | length' "$REGISTRY_FILE" 2>/dev/null || echo "0")
            for (( s=0; s<SUBHUB_COUNT; s++ )); do
                TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE" 2>/dev/null || echo "0")
                for (( t=0; t<TABLE_COUNT; t++ )); do
                    T_N=$(yq ".subhubs[$s].tables[$t].name" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                    if [ "$T_N" = "$yaml_name" ]; then
                        COL_COUNT=$(yq ".subhubs[$s].tables[$t].columns | length" "$REGISTRY_FILE" 2>/dev/null || echo "0")
                        for (( c=0; c<COL_COUNT; c++ )); do
                            COL_NAME=$(yq ".subhubs[$s].tables[$t].columns[$c].name" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                            if [ "$COL_NAME" != "null" ] && ! echo "$COL_NAME" | grep -qE '^\['; then
                                YAML_COLS="$YAML_COLS
$COL_NAME"
                            fi
                        done
                        break 2
                    fi
                done
            done
        fi

        YAML_COLS=$(echo "$YAML_COLS" | sed '/^$/d' | sort)
        DB_COLS_SORTED=$(echo "$DB_COLS" | sed '/^$/d' | sort)

        if [ -n "$YAML_COLS" ]; then
            # Columns in DB but not in YAML
            EXTRA_COLS=$(comm -23 <(echo "$DB_COLS_SORTED") <(echo "$YAML_COLS") 2>/dev/null || true)
            if [ -n "$EXTRA_COLS" ]; then
                while IFS= read -r col; do
                    [ -z "$col" ] && continue
                    ENTRY="${yaml_table}.${col}"
                    if [ "$MODE" = "baseline" ] && [ "$IS_CANONICAL" = true ] && [ "$BASELINE_LOADED" = true ]; then
                        if ! is_baseline_column "$ENTRY"; then
                            violation "COLUMN_DRIFT (NEW on CANONICAL): $ENTRY exists in DB but NOT in column_registry.yml"
                        else
                            warning "COLUMN_DRIFT (KNOWN): $ENTRY — in baseline"
                        fi
                    else
                        warning "COLUMN_DRIFT: $ENTRY exists in DB but NOT in column_registry.yml"
                    fi
                    ((COLUMN_DRIFT_COUNT++))
                done <<< "$EXTRA_COLS"
            fi

            # Columns in YAML but not in DB
            MISSING_COLS=$(comm -13 <(echo "$DB_COLS_SORTED") <(echo "$YAML_COLS") 2>/dev/null || true)
            if [ -n "$MISSING_COLS" ]; then
                while IFS= read -r col; do
                    [ -z "$col" ] && continue
                    warning "COLUMN_DRIFT: $yaml_table.$col in column_registry.yml but NOT in DB"
                    ((COLUMN_DRIFT_COUNT++))
                done <<< "$MISSING_COLS"
            fi
        fi
    done

    if [ "$COLUMN_DRIFT_COUNT" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} No column drift detected"
    fi
else
    echo -e "  ${CYAN}[SKIP]${NC} column_registry.yml or yq not available"
fi
echo ""

# ───────────────────────────────────────────────────────────────────
# WRITE BASELINE (if --write-baseline)
# ───────────────────────────────────────────────────────────────────
if [ "$WRITE_BASELINE" = true ]; then
    echo "─── Writing Baseline ─────────────────────────────────────────"

    # Ensure docs/ directory exists
    mkdir -p "$(dirname "$BASELINE_FILE")"

    # Build JSON arrays for jq
    ROGUE_JSON="[]"
    if [ ${#ROGUE_LIST[@]} -gt 0 ]; then
        ROGUE_JSON=$(printf '%s\n' "${ROGUE_LIST[@]}" | jq -R . | jq -s .)
    fi

    CANONICAL_COL_JSON="[]"
    if [ ${#CANONICAL_COLUMN_STATE[@]} -gt 0 ]; then
        CANONICAL_COL_JSON=$(printf '%s\n' "${CANONICAL_COLUMN_STATE[@]}" | jq -R . | jq -s .)
    fi

    DB_TABLES_JSON="[]"
    if [ -n "$DB_TABLES" ]; then
        DB_TABLES_JSON=$(echo "$DB_TABLES" | sed '/^$/d' | jq -R . | jq -s .)
    fi

    jq -n \
        --arg timestamp "$TIMESTAMP" \
        --arg mode "$MODE" \
        --argjson db_table_count "$DB_TABLE_COUNT" \
        --argjson registry_table_count "$REGISTRY_TABLE_COUNT" \
        --argjson yaml_table_count "${#YAML_TABLES[@]}" \
        --argjson known_rogue_tables "$ROGUE_JSON" \
        --argjson canonical_columns "$CANONICAL_COL_JSON" \
        --argjson all_db_tables "$DB_TABLES_JSON" \
        '{
            "baseline_version": "1.0.0",
            "created": $timestamp,
            "mode_at_capture": $mode,
            "surfaces": {
                "db_tables": $db_table_count,
                "ctb_registry_tables": $registry_table_count,
                "yaml_tables": $yaml_table_count
            },
            "known_rogue_tables": $known_rogue_tables,
            "canonical_columns": $canonical_columns,
            "all_db_tables": $all_db_tables,
            "note": "Baseline captured by ctb-drift-audit.sh --write-baseline. Tables listed here are known legacy drift — not new entropy."
        }' > "$BASELINE_FILE"

    echo -e "  ${GREEN}[OK]${NC} Baseline written to $BASELINE_FILE"
    echo "  Known rogue tables: ${#ROGUE_LIST[@]}"
    echo "  Canonical columns:  ${#CANONICAL_COLUMN_STATE[@]}"
    echo "  All DB tables:      $DB_TABLE_COUNT"
    echo ""
fi

# ───────────────────────────────────────────────────────────────────
# GENERATE REPORTS
# ───────────────────────────────────────────────────────────────────
STATUS=$([ "$VIOLATIONS" -gt 0 ] && echo "FAIL" || echo "PASS")
REPORT_JSON=".ctb-drift-audit-report.json"
REPORT_MD=".ctb-drift-audit-report.md"

cat > "$REPORT_JSON" << ENDJSON
{
  "timestamp": "$TIMESTAMP",
  "mode": "$MODE",
  "baseline_loaded": $BASELINE_LOADED,
  "database": "connected",
  "registry_file": "${REGISTRY_FILE:-null}",
  "ctb_table_registry_exists": $([ "$CTB_REGISTRY_EXISTS" = "t" ] && echo "true" || echo "false"),
  "surfaces": {
    "db_tables": $DB_TABLE_COUNT,
    "ctb_registry_tables": $REGISTRY_TABLE_COUNT,
    "yaml_tables": ${#YAML_TABLES[@]}
  },
  "violations": $VIOLATIONS,
  "warnings": $WARNINGS,
  "status": "$STATUS"
}
ENDJSON

cat > "$REPORT_MD" << ENDMD
# CTB Drift Audit Report

**Date**: $TIMESTAMP
**Mode**: $MODE
**Baseline Loaded**: $BASELINE_LOADED
**Status**: **$STATUS**

## Surfaces Compared

| Surface | Source | Tables |
|---------|--------|--------|
| A | Live database | $DB_TABLE_COUNT |
| B | ctb.table_registry | $REGISTRY_TABLE_COUNT |
| C | column_registry.yml | ${#YAML_TABLES[@]} |

## Results

| Metric | Count |
|--------|-------|
| Violations | $VIOLATIONS |
| Warnings | $WARNINGS |
| **Overall** | **$STATUS** |

## Mode: $MODE

$(if [ "$MODE" = "baseline" ]; then
    echo "Baseline mode: only NEW rogue tables and NEW undocumented columns on CANONICAL tables are violations."
    echo "Known legacy drift from baseline is reported as warnings."
else
    echo "Strict mode: ALL rogue tables are violations."
fi)

## Doctrine

Enforcement: CTB_REGISTRY_ENFORCEMENT.md §6
Model: Fail-closed — rogue tables are violations, all others are warnings.
ENDMD

echo "  Reports: $REPORT_JSON, $REPORT_MD"

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ "$VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS violation(s), $WARNINGS warning(s) [mode=$MODE]"
    echo ""
    if [ "$MODE" = "baseline" ]; then
        echo "NEW rogue tables or NEW undocumented CANONICAL columns detected."
        echo "These are not in the baseline — they represent new entropy."
    else
        echo "ROGUE tables (in DB, not registered) are VIOLATIONS."
        echo "All other drift classes are WARNINGS."
    fi
    echo "Doctrine: CTB_REGISTRY_ENFORCEMENT.md §6"
    echo ""
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}PASSED WITH WARNINGS${NC}: $WARNINGS warning(s) [mode=$MODE]"
    echo ""
    exit 0
else
    echo -e "${GREEN}PASSED${NC}: No drift detected [mode=$MODE]"
    echo ""
    exit 0
fi
