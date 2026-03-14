#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# CTB REGISTRY GATE — Build-Time Registry Enforcement
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Validate migrations vs column_registry.yml + sub-hub cardinality
# Doctrine: CTB_REGISTRY_ENFORCEMENT.md §3, ARCHITECTURE.md Part X §3
# Usage: ./scripts/ctb-registry-gate.sh
# Exit: 0 = pass, 1 = violations found, 2 = dependency error
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0
WARNINGS=0
TABLES_IN_MIGRATIONS=()
TABLES_IN_REGISTRY=()

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  CTB REGISTRY GATE"
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
# LOCATE ARTIFACTS
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

MIGRATIONS_DIR=""
if [ -d "migrations" ]; then
    MIGRATIONS_DIR="migrations"
elif [ -d "src/data/db/migrations" ]; then
    MIGRATIONS_DIR="src/data/db/migrations"
else
    echo -e "${YELLOW}[WARNING]${NC} migrations/ directory not found — skipping migration cross-reference"
    echo "          Only cardinality checks will run"
fi

echo "  Registry:   $REGISTRY_FILE"
echo "  Migrations: ${MIGRATIONS_DIR:-<not found>}"
echo ""

# ───────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────────
violation() {
    echo -e "${RED}[VIOLATION]${NC} $1"
    ((VIOLATIONS++))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    ((WARNINGS++))
}

is_placeholder() {
    local val="$1"
    if [ -z "$val" ] || [ "$val" = "null" ]; then
        return 0
    fi
    if echo "$val" | grep -qE '^\[.*\]$'; then
        return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────────
# GATE 1: Extract tables from migrations
# ───────────────────────────────────────────────────────────────────
echo "─── Gate 1: Migration Table Discovery ────────────────────────"

if [ -n "$MIGRATIONS_DIR" ]; then
    # Find CREATE TABLE statements in SQL files
    while IFS= read -r line; do
        # Extract schema.table or just table from CREATE TABLE statements
        table_name=$(echo "$line" | grep -oiE 'CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?[a-zA-Z_][a-zA-Z0-9_.]*' \
            | sed -E 's/CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?//i' \
            | tr -d '(' | xargs)
        if [ -n "$table_name" ]; then
            # Skip ctb schema tables (they are governance infrastructure, not application tables)
            if echo "$table_name" | grep -q "^ctb\."; then
                continue
            fi
            TABLES_IN_MIGRATIONS+=("$table_name")
        fi
    done < <(grep -rihE 'CREATE\s+TABLE' "$MIGRATIONS_DIR"/*.sql 2>/dev/null || true)

    if [ ${#TABLES_IN_MIGRATIONS[@]} -eq 0 ]; then
        echo -e "  ${YELLOW}[INFO]${NC} No CREATE TABLE statements found in $MIGRATIONS_DIR/"
    else
        echo "  Found ${#TABLES_IN_MIGRATIONS[@]} table(s) in migrations:"
        for t in "${TABLES_IN_MIGRATIONS[@]}"; do
            echo "    - $t"
        done
    fi
else
    echo -e "  ${YELLOW}[SKIP]${NC} No migrations directory"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# GATE 2: Extract tables from column_registry.yml
# ───────────────────────────────────────────────────────────────────
echo "─── Gate 2: Registry Table Discovery ─────────────────────────"

# Spine table
SPINE_NAME=$(yq '.spine_table.name' "$REGISTRY_FILE" 2>/dev/null || echo "null")
SPINE_SCHEMA=$(yq '.spine_table.schema' "$REGISTRY_FILE" 2>/dev/null || echo "null")

if ! is_placeholder "$SPINE_NAME"; then
    if ! is_placeholder "$SPINE_SCHEMA"; then
        TABLES_IN_REGISTRY+=("${SPINE_SCHEMA}.${SPINE_NAME}")
    else
        TABLES_IN_REGISTRY+=("$SPINE_NAME")
    fi
    echo "  Spine: $SPINE_NAME"
fi

# Sub-hub tables
SUBHUB_COUNT=$(yq '.subhubs | length' "$REGISTRY_FILE" 2>/dev/null || echo "0")

if [ "$SUBHUB_COUNT" != "0" ] && [ "$SUBHUB_COUNT" != "null" ]; then
    for (( s=0; s<SUBHUB_COUNT; s++ )); do
        TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE" 2>/dev/null || echo "0")
        SUBHUB_ID=$(yq ".subhubs[$s].subhub_id" "$REGISTRY_FILE" 2>/dev/null || echo "unknown")

        if [ "$TABLE_COUNT" != "0" ] && [ "$TABLE_COUNT" != "null" ]; then
            for (( t=0; t<TABLE_COUNT; t++ )); do
                T_NAME=$(yq ".subhubs[$s].tables[$t].name" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                T_SCHEMA=$(yq ".subhubs[$s].tables[$t].schema" "$REGISTRY_FILE" 2>/dev/null || echo "null")

                if ! is_placeholder "$T_NAME"; then
                    if ! is_placeholder "$T_SCHEMA"; then
                        TABLES_IN_REGISTRY+=("${T_SCHEMA}.${T_NAME}")
                    else
                        TABLES_IN_REGISTRY+=("$T_NAME")
                    fi
                fi
            done
        fi
    done
fi

echo "  Found ${#TABLES_IN_REGISTRY[@]} table(s) in registry"
for t in "${TABLES_IN_REGISTRY[@]}"; do
    echo "    - $t"
done

echo ""

# ───────────────────────────────────────────────────────────────────
# GATE 3: Cross-reference — orphaned tables (in migrations, not registry)
# ───────────────────────────────────────────────────────────────────
echo "─── Gate 3: Orphaned Table Detection ─────────────────────────"

ORPHANED=0
if [ -n "$MIGRATIONS_DIR" ] && [ ${#TABLES_IN_MIGRATIONS[@]} -gt 0 ]; then
    for m_table in "${TABLES_IN_MIGRATIONS[@]}"; do
        FOUND=false
        for r_table in "${TABLES_IN_REGISTRY[@]}"; do
            # Compare with and without schema prefix
            if [ "$m_table" = "$r_table" ]; then
                FOUND=true
                break
            fi
            # Also check just the table name (without schema)
            m_bare=$(echo "$m_table" | sed 's/^[^.]*\.//')
            r_bare=$(echo "$r_table" | sed 's/^[^.]*\.//')
            if [ "$m_bare" = "$r_bare" ]; then
                FOUND=true
                break
            fi
        done

        if [ "$FOUND" = false ]; then
            violation "ORPHANED_TABLE: $m_table exists in migrations but NOT in column_registry.yml"
            ((ORPHANED++))
        fi
    done

    if [ "$ORPHANED" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} All migration tables are registered"
    fi
else
    echo -e "  ${YELLOW}[SKIP]${NC} No migration tables to cross-reference"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# GATE 4: Phantom tables (in registry, no migration)
# ───────────────────────────────────────────────────────────────────
echo "─── Gate 4: Phantom Table Detection ──────────────────────────"

PHANTOMS=0
if [ -n "$MIGRATIONS_DIR" ] && [ ${#TABLES_IN_REGISTRY[@]} -gt 0 ]; then
    for r_table in "${TABLES_IN_REGISTRY[@]}"; do
        FOUND=false
        for m_table in "${TABLES_IN_MIGRATIONS[@]}"; do
            if [ "$r_table" = "$m_table" ]; then
                FOUND=true
                break
            fi
            r_bare=$(echo "$r_table" | sed 's/^[^.]*\.//')
            m_bare=$(echo "$m_table" | sed 's/^[^.]*\.//')
            if [ "$r_bare" = "$m_bare" ]; then
                FOUND=true
                break
            fi
        done

        if [ "$FOUND" = false ]; then
            warning "PHANTOM_TABLE: $r_table in column_registry.yml but no migration found"
            ((PHANTOMS++))
        fi
    done

    if [ "$PHANTOMS" -eq 0 ]; then
        echo -e "  ${GREEN}[PASS]${NC} All registry tables have migrations"
    fi
else
    echo -e "  ${YELLOW}[SKIP]${NC} No tables to cross-reference"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# GATE 5: Sub-hub cardinality enforcement
# Doctrine: ARCHITECTURE.md Part X §3 (OWN-10a, OWN-10b, OWN-10c)
#   1 CANONICAL (exactly)
#   1 ERROR (exactly)
#   0-2 SUPPORTING (STAGING, MV, REGISTRY — grouping term, not leaf_type)
# ───────────────────────────────────────────────────────────────────
echo "─── Gate 5: Sub-Hub Cardinality Enforcement ──────────────────"

if [ "$SUBHUB_COUNT" != "0" ] && [ "$SUBHUB_COUNT" != "null" ]; then
    for (( s=0; s<SUBHUB_COUNT; s++ )); do
        SUBHUB_ID=$(yq ".subhubs[$s].subhub_id" "$REGISTRY_FILE" 2>/dev/null || echo "unknown")
        SUBHUB_NAME=$(yq ".subhubs[$s].name" "$REGISTRY_FILE" 2>/dev/null || echo "unknown")
        TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE" 2>/dev/null || echo "0")

        CANONICAL_COUNT=0
        ERROR_COUNT=0
        SUPPORTING_COUNT=0

        if [ "$TABLE_COUNT" != "0" ] && [ "$TABLE_COUNT" != "null" ]; then
            for (( t=0; t<TABLE_COUNT; t++ )); do
                LEAF=$(yq ".subhubs[$s].tables[$t].leaf_type" "$REGISTRY_FILE" 2>/dev/null || echo "null")
                LEAF_UPPER=$(echo "$LEAF" | tr '[:lower:]' '[:upper:]')

                case "$LEAF_UPPER" in
                    CANONICAL) ((CANONICAL_COUNT++)) ;;
                    ERROR)     ((ERROR_COUNT++)) ;;
                    STAGING|MV|REGISTRY) ((SUPPORTING_COUNT++)) ;;
                    NULL|"") ;; # placeholder, skip
                    *)
                        warning "Sub-hub $SUBHUB_NAME ($SUBHUB_ID): Unrecognized leaf_type '$LEAF'"
                        ;;
                esac
            done
        fi

        echo "  Sub-hub: $SUBHUB_NAME ($SUBHUB_ID)"
        echo "    CANONICAL: $CANONICAL_COUNT  ERROR: $ERROR_COUNT  SUPPORTING: $SUPPORTING_COUNT"

        # Skip cardinality checks if all counts are 0 (template/placeholder state)
        if [ "$CANONICAL_COUNT" -eq 0 ] && [ "$ERROR_COUNT" -eq 0 ] && [ "$SUPPORTING_COUNT" -eq 0 ]; then
            echo -e "    ${YELLOW}[SKIP]${NC} No populated leaf_types (template state)"
            continue
        fi

        # OWN-10a: Exactly 1 CANONICAL
        if [ "$CANONICAL_COUNT" -ne 1 ]; then
            violation "Sub-hub $SUBHUB_NAME ($SUBHUB_ID): Must have exactly 1 CANONICAL table (found $CANONICAL_COUNT)"
        fi

        # OWN-10b: Exactly 1 ERROR
        if [ "$ERROR_COUNT" -ne 1 ]; then
            violation "Sub-hub $SUBHUB_NAME ($SUBHUB_ID): Must have exactly 1 ERROR table (found $ERROR_COUNT)"
        fi

        # OWN-10c: At most 2 SUPPORTING
        if [ "$SUPPORTING_COUNT" -gt 2 ]; then
            violation "Sub-hub $SUBHUB_NAME ($SUBHUB_ID): At most 2 SUPPORTING tables allowed (found $SUPPORTING_COUNT)"
        fi

        if [ "$CANONICAL_COUNT" -eq 1 ] && [ "$ERROR_COUNT" -eq 1 ] && [ "$SUPPORTING_COUNT" -le 2 ]; then
            echo -e "    ${GREEN}[PASS]${NC} Cardinality OK"
        fi
    done
else
    echo -e "  ${YELLOW}[SKIP]${NC} No sub-hubs declared (template state)"
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# GENERATE REPORTS
# ───────────────────────────────────────────────────────────────────
REPORT_JSON=".ctb-registry-gate-report.json"
REPORT_MD=".ctb-registry-gate-report.md"

# JSON report
cat > "$REPORT_JSON" << ENDJSON
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)",
  "registry_file": "$REGISTRY_FILE",
  "migrations_dir": "${MIGRATIONS_DIR:-null}",
  "tables_in_migrations": ${#TABLES_IN_MIGRATIONS[@]},
  "tables_in_registry": ${#TABLES_IN_REGISTRY[@]},
  "violations": $VIOLATIONS,
  "warnings": $WARNINGS,
  "status": "$([ $VIOLATIONS -gt 0 ] && echo "FAIL" || echo "PASS")"
}
ENDJSON

# Markdown report
cat > "$REPORT_MD" << ENDMD
# CTB Registry Gate Report

**Date**: $(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date)
**Registry**: $REGISTRY_FILE
**Migrations**: ${MIGRATIONS_DIR:-N/A}

## Summary

| Metric | Count |
|--------|-------|
| Tables in migrations | ${#TABLES_IN_MIGRATIONS[@]} |
| Tables in registry | ${#TABLES_IN_REGISTRY[@]} |
| Violations | $VIOLATIONS |
| Warnings | $WARNINGS |
| **Status** | **$([ $VIOLATIONS -gt 0 ] && echo "FAIL" || echo "PASS")** |
ENDMD

echo "  Reports written:"
echo "    $REPORT_JSON"
echo "    $REPORT_MD"

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"

if [ $VIOLATIONS -gt 0 ]; then
    echo -e "${RED}FAILED${NC}: $VIOLATIONS violation(s), $WARNINGS warning(s)"
    echo ""
    echo "Registry-first enforcement: register tables in column_registry.yml"
    echo "BEFORE creating migrations. See CTB_REGISTRY_ENFORCEMENT.md."
    echo ""
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}PASSED WITH WARNINGS${NC}: $WARNINGS warning(s)"
    echo ""
    exit 0
else
    echo -e "${GREEN}PASSED${NC}: Registry gate clear"
    echo ""
    exit 0
fi
