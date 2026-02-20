-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 008: Vendor JSON Table Template
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Template for per-sub-hub vendor JSON landing tables.
--          JSON is allowed ONLY at this layer. Bridges decompose it into RAW.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §9.1
-- Depends: 001_ctb_table_registry.sql, 005_raw_immutability.sql
-- Idempotent: YES (safe to re-run)
--
-- USAGE: Copy this template and replace <subhub> with your sub-hub name.
--        Example: vendor_claude_companies, vendor_claude_invoices
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- TEMPLATE: vendor_claude_<subhub>
--
-- Replace <subhub> with the actual sub-hub name before applying.
-- This is a TEMPLATE — do not apply as-is.
--
-- JSON (JSONB) columns are allowed ONLY in vendor_claude_* tables.
-- All downstream tables (RAW, SUPPORTING, CANONICAL) must be
-- fully structured with no JSON columns.
-- ───────────────────────────────────────────────────────────────────

-- Step 1: Register the vendor table in ctb.table_registry
-- INSERT INTO ctb.table_registry (table_schema, table_name, hub_id, subhub_id, leaf_type, description)
-- VALUES ('public', 'vendor_claude_<subhub>', '<hub_id>', '<subhub_id>', 'STAGING',
--         'Vendor JSON landing table for <subhub> — JSON sandbox, bridge required for RAW promotion');

-- Step 2: Create the vendor table
CREATE TABLE IF NOT EXISTS public.vendor_claude_template (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingestion_batch_id  UUID NOT NULL,
    tool_name           TEXT NOT NULL,
    payload_json        JSONB NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Metadata (populated by the ingestion process)
    vendor_source       TEXT,
    bridge_version      TEXT
);

COMMENT ON TABLE public.vendor_claude_template IS
    'TEMPLATE — Vendor JSON landing table. JSON allowed ONLY here. '
    'Replace "template" with your sub-hub name. '
    'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §9.1';

COMMENT ON COLUMN public.vendor_claude_template.payload_json IS
    'Raw JSON payload from external tool. Decomposed by bridge function into structured RAW columns.';

COMMENT ON COLUMN public.vendor_claude_template.tool_name IS
    'External tool that produced this payload (e.g., composio-hubspot, manual-csv-import)';

-- Step 3: Attach immutability guard (INSERT only)
-- SELECT ctb.create_immutability_guard('public', 'vendor_claude_<subhub>');

-- Step 4: Create index on batch_id for bridge lookups
CREATE INDEX IF NOT EXISTS idx_vendor_claude_template_batch
    ON public.vendor_claude_template (ingestion_batch_id);

CREATE INDEX IF NOT EXISTS idx_vendor_claude_template_tool
    ON public.vendor_claude_template (tool_name);

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Validate a vendor table has the required structure
--
-- Usage: SELECT * FROM ctb.validate_vendor_table('public', 'vendor_claude_companies');
-- Returns: required_column, expected_type, present, type_match
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.validate_vendor_table(
    p_schema TEXT,
    p_table TEXT
)
RETURNS TABLE (
    required_column TEXT,
    expected_type TEXT,
    present BOOLEAN,
    type_match BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    col_rec RECORD;
    required_cols TEXT[][] := ARRAY[
        ARRAY['id', 'uuid'],
        ARRAY['ingestion_batch_id', 'uuid'],
        ARRAY['tool_name', 'text'],
        ARRAY['payload_json', 'jsonb'],
        ARRAY['created_at', 'timestamp with time zone']
    ];
    i INTEGER;
BEGIN
    -- Verify table name matches vendor convention
    IF p_table NOT LIKE 'vendor_claude_%' THEN
        RAISE WARNING 'CTB_VENDOR: Table %.% does not follow vendor_claude_<subhub> naming convention',
                      p_schema, p_table;
    END IF;

    FOR i IN 1..array_length(required_cols, 1) LOOP
        required_column := required_cols[i][1];
        expected_type := required_cols[i][2];

        SELECT
            EXISTS(
                SELECT 1 FROM information_schema.columns ic
                WHERE ic.table_schema = p_schema
                  AND ic.table_name = p_table
                  AND ic.column_name = required_cols[i][1]
            ),
            EXISTS(
                SELECT 1 FROM information_schema.columns ic
                WHERE ic.table_schema = p_schema
                  AND ic.table_name = p_table
                  AND ic.column_name = required_cols[i][1]
                  AND ic.data_type = required_cols[i][2]
            )
        INTO present, type_match;

        RETURN NEXT;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION ctb.validate_vendor_table(TEXT, TEXT) IS
    'Validates a vendor table has required columns per §9.1';

-- ═══════════════════════════════════════════════════════════════════
-- CLEANUP: Drop the template table (it's just a reference)
-- Uncomment if you don't want the template table to persist.
-- ═══════════════════════════════════════════════════════════════════
-- DROP TABLE IF EXISTS public.vendor_claude_template;

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.validate_vendor_table(TEXT, TEXT);
-- DROP TABLE IF EXISTS public.vendor_claude_template;
