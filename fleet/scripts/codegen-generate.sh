#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# CODEGEN GENERATE — Registry-First Schema Generator
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (Constitutional)
# Purpose: Read column_registry.yml and generate TypeScript types + Zod schemas
# Usage: ./scripts/codegen-generate.sh [--output-dir <dir>]
# ═══════════════════════════════════════════════════════════════════════════════
#
# This script reads column_registry.yml and produces:
#   - TypeScript interface files (.ts)
#   - Zod schema files (.schema.ts)
#
# Output locations (default):
#   - src/data/hub/generated/    (spine table types)
#   - src/data/spokes/generated/ (sub-hub table types)
#
# Override output with --output-dir for verification against a temp directory.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

AUTOGEN_MARKER="// AUTO-GENERATED FROM column_registry.yml — DO NOT EDIT"

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

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  CODEGEN GENERATE — Registry-First Schema Generator"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Registry: $REGISTRY_FILE"

# ───────────────────────────────────────────────────────────────────
# PARSE OUTPUT DIR
# ───────────────────────────────────────────────────────────────────
OUTPUT_BASE=""
if [ "$1" = "--output-dir" ] && [ -n "$2" ]; then
    OUTPUT_BASE="$2"
    echo "  Output:   $OUTPUT_BASE (override)"
else
    OUTPUT_BASE="."
    echo "  Output:   src/data/ (default)"
fi

HUB_OUT="$OUTPUT_BASE/src/data/hub/generated"
SPOKE_OUT="$OUTPUT_BASE/src/data/spokes/generated"

mkdir -p "$HUB_OUT"
mkdir -p "$SPOKE_OUT"

# ───────────────────────────────────────────────────────────────────
# DEPENDENCY CHECK
# ───────────────────────────────────────────────────────────────────
if ! command -v yq &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} yq is required but not installed"
    echo "        Install: https://github.com/mikefarah/yq"
    exit 1
fi

# ───────────────────────────────────────────────────────────────────
# TYPE MAPPING: YAML types → TypeScript types
# ───────────────────────────────────────────────────────────────────
map_type_ts() {
    local yaml_type="$1"
    case "$yaml_type" in
        UUID|TEXT|VARCHAR|CHAR|STRING)  echo "string" ;;
        INTEGER|INT|BIGINT|SMALLINT)   echo "number" ;;
        NUMERIC|DECIMAL|FLOAT|DOUBLE)  echo "number" ;;
        BOOLEAN|BOOL)                  echo "boolean" ;;
        TIMESTAMPTZ|TIMESTAMP|DATE)    echo "string" ;;
        JSON|JSONB)                    echo "Record<string, unknown>" ;;
        *)                             echo "unknown" ;;
    esac
}

# ───────────────────────────────────────────────────────────────────
# TYPE MAPPING: YAML types → Zod types
# ───────────────────────────────────────────────────────────────────
map_type_zod() {
    local yaml_type="$1"
    case "$yaml_type" in
        UUID)                          echo "z.string().uuid()" ;;
        TEXT|VARCHAR|CHAR|STRING)       echo "z.string()" ;;
        INTEGER|INT|BIGINT|SMALLINT)   echo "z.number().int()" ;;
        NUMERIC|DECIMAL|FLOAT|DOUBLE)  echo "z.number()" ;;
        BOOLEAN|BOOL)                  echo "z.boolean()" ;;
        TIMESTAMPTZ|TIMESTAMP|DATE)    echo "z.string().datetime()" ;;
        JSON|JSONB)                    echo "z.record(z.unknown())" ;;
        *)                            echo "z.unknown()" ;;
    esac
}

# ───────────────────────────────────────────────────────────────────
# HELPER: Convert snake_case to PascalCase
# ───────────────────────────────────────────────────────────────────
to_pascal_case() {
    echo "$1" | sed -r 's/(^|_)([a-z])/\U\2/g'
}

# ───────────────────────────────────────────────────────────────────
# GENERATE: TypeScript interface + Zod schema for a single table
# ───────────────────────────────────────────────────────────────────
generate_table() {
    local table_path="$1"  # yq path to table
    local out_dir="$2"     # output directory

    local table_name
    table_name=$(yq "$table_path.name" "$REGISTRY_FILE")
    local table_desc
    table_desc=$(yq "$table_path.description" "$REGISTRY_FILE")
    local pascal_name
    pascal_name=$(to_pascal_case "$table_name")

    local col_count
    col_count=$(yq "$table_path.columns | length" "$REGISTRY_FILE")

    if [ "$col_count" = "0" ] || [ "$col_count" = "null" ]; then
        echo -e "  ${YELLOW}[SKIP]${NC} $table_name — no columns declared"
        return
    fi

    # ─── TypeScript Interface ───
    local ts_file="$out_dir/${table_name}.types.ts"
    {
        echo "$AUTOGEN_MARKER"
        echo ""
        echo "/**"
        echo " * $table_desc"
        echo " * Table: $table_name"
        echo " */"
        echo "export interface ${pascal_name}Row {"
    } > "$ts_file"

    for (( i=0; i<col_count; i++ )); do
        local col_name col_type col_nullable col_desc
        col_name=$(yq "$table_path.columns[$i].name" "$REGISTRY_FILE")
        col_type=$(yq "$table_path.columns[$i].type" "$REGISTRY_FILE")
        col_nullable=$(yq "$table_path.columns[$i].nullable" "$REGISTRY_FILE")
        col_desc=$(yq "$table_path.columns[$i].description" "$REGISTRY_FILE")

        local ts_type
        ts_type=$(map_type_ts "$col_type")

        local optional=""
        local null_union=""
        if [ "$col_nullable" = "true" ]; then
            optional="?"
            null_union=" | null"
        fi

        echo "  /** $col_desc */" >> "$ts_file"
        echo "  ${col_name}${optional}: ${ts_type}${null_union};" >> "$ts_file"
    done

    echo "}" >> "$ts_file"

    # ─── Zod Schema ───
    local zod_file="$out_dir/${table_name}.schema.ts"
    {
        echo "$AUTOGEN_MARKER"
        echo ""
        echo "import { z } from 'zod';"
        echo ""
        echo "/**"
        echo " * $table_desc"
        echo " * Table: $table_name"
        echo " */"
        echo "export const ${pascal_name}Schema = z.object({"
    } > "$zod_file"

    for (( i=0; i<col_count; i++ )); do
        local col_name col_type col_nullable
        col_name=$(yq "$table_path.columns[$i].name" "$REGISTRY_FILE")
        col_type=$(yq "$table_path.columns[$i].type" "$REGISTRY_FILE")
        col_nullable=$(yq "$table_path.columns[$i].nullable" "$REGISTRY_FILE")

        local zod_type
        zod_type=$(map_type_zod "$col_type")

        if [ "$col_nullable" = "true" ]; then
            zod_type="${zod_type}.nullable().optional()"
        fi

        local trailing=","
        echo "  ${col_name}: ${zod_type}${trailing}" >> "$zod_file"
    done

    echo "});" >> "$zod_file"
    echo "" >> "$zod_file"
    echo "export type ${pascal_name} = z.infer<typeof ${pascal_name}Schema>;" >> "$zod_file"

    echo -e "  ${GREEN}[OK]${NC} $table_name → ${table_name}.types.ts, ${table_name}.schema.ts"
}

# ───────────────────────────────────────────────────────────────────
# GENERATE: Spine table
# ───────────────────────────────────────────────────────────────────
echo ""
echo "─── Spine Table ───────────────────────────────────────────────"

SPINE_NAME=$(yq '.spine_table.name' "$REGISTRY_FILE")
if [ "$SPINE_NAME" != "null" ] && [ -n "$SPINE_NAME" ]; then
    generate_table ".spine_table" "$HUB_OUT"
else
    echo -e "  ${YELLOW}[SKIP]${NC} No spine table declared"
fi

# ───────────────────────────────────────────────────────────────────
# GENERATE: Sub-hub tables
# ───────────────────────────────────────────────────────────────────
echo ""
echo "─── Sub-Hub Tables ──────────────────────────────────────────"

SUBHUB_COUNT=$(yq '.subhubs | length' "$REGISTRY_FILE")

if [ "$SUBHUB_COUNT" = "0" ] || [ "$SUBHUB_COUNT" = "null" ]; then
    echo -e "  ${YELLOW}[SKIP]${NC} No sub-hubs declared"
else
    for (( s=0; s<SUBHUB_COUNT; s++ )); do
        local_subhub_name=$(yq ".subhubs[$s].name" "$REGISTRY_FILE")
        echo ""
        echo "  Sub-hub: $local_subhub_name"

        TABLE_COUNT=$(yq ".subhubs[$s].tables | length" "$REGISTRY_FILE")
        if [ "$TABLE_COUNT" = "0" ] || [ "$TABLE_COUNT" = "null" ]; then
            echo -e "    ${YELLOW}[SKIP]${NC} No tables declared"
            continue
        fi

        for (( t=0; t<TABLE_COUNT; t++ )); do
            generate_table ".subhubs[$s].tables[$t]" "$SPOKE_OUT"
        done
    done
fi

# ───────────────────────────────────────────────────────────────────
# GENERATE: Index file
# ───────────────────────────────────────────────────────────────────
echo ""
echo "─── Index Files ─────────────────────────────────────────────"

for dir in "$HUB_OUT" "$SPOKE_OUT"; do
    INDEX_FILE="$dir/index.ts"
    {
        echo "$AUTOGEN_MARKER"
        echo ""
    } > "$INDEX_FILE"

    for ts_file in "$dir"/*.types.ts; do
        [ -f "$ts_file" ] || continue
        local_basename=$(basename "$ts_file" .types.ts)
        echo "export * from './${local_basename}.types';" >> "$INDEX_FILE"
    done

    for schema_file in "$dir"/*.schema.ts; do
        [ -f "$schema_file" ] || continue
        local_basename=$(basename "$schema_file" .schema.ts)
        echo "export * from './${local_basename}.schema';" >> "$INDEX_FILE"
    done

    echo -e "  ${GREEN}[OK]${NC} $(basename "$(dirname "$dir")")/generated/index.ts"
done

# ───────────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}CODEGEN COMPLETE${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
