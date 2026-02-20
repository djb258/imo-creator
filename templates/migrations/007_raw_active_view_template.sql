-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 007: RAW Active View Template + Validation Function
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Provides a helper function to create _active views for RAW tables,
--          and a validation function to check that every STAGING table has one.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.4
-- Depends: 001_ctb_table_registry.sql, 006_raw_batch_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Create a _active view for a RAW table
--
-- Creates a view named {table_name}_active that joins on
-- ctb.raw_batch_registry to filter only ACTIVE batches.
--
-- Usage: SELECT ctb.create_raw_active_view('public', 'raw_companies');
-- Result: Creates public.raw_companies_active view
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.create_raw_active_view(
    p_schema TEXT,
    p_table TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    view_name TEXT;
    full_table TEXT;
    full_view TEXT;
BEGIN
    view_name := p_table || '_active';
    full_table := quote_ident(p_schema) || '.' || quote_ident(p_table);
    full_view := quote_ident(p_schema) || '.' || quote_ident(view_name);

    -- Verify the table exists and is a STAGING table
    IF NOT EXISTS (
        SELECT 1 FROM ctb.table_registry
        WHERE table_schema = p_schema
          AND table_name = p_table
          AND leaf_type = 'STAGING'
    ) THEN
        RAISE EXCEPTION 'CTB_RAW_ACTIVE: Table %.% is not registered as STAGING in ctb.table_registry. '
                        'Only STAGING (RAW) tables require _active views. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.4',
                        p_schema, p_table;
    END IF;

    -- Verify the table has an ingestion_batch_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = p_schema
          AND table_name = p_table
          AND column_name = 'ingestion_batch_id'
    ) THEN
        RAISE EXCEPTION 'CTB_RAW_ACTIVE: Table %.% is missing required column ingestion_batch_id. '
                        'RAW tables must have ingestion_batch_id for batch tracking. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.2',
                        p_schema, p_table;
    END IF;

    -- Create or replace the _active view
    EXECUTE format(
        'CREATE OR REPLACE VIEW %s AS '
        'SELECT r.* '
        'FROM %s r '
        'INNER JOIN ctb.raw_batch_registry b '
        '    ON b.batch_id = r.ingestion_batch_id '
        'WHERE b.status = ''ACTIVE''',
        full_view, full_table
    );

    RAISE NOTICE 'CTB raw_active view created: %', full_view;
END;
$$;

COMMENT ON FUNCTION ctb.create_raw_active_view(TEXT, TEXT) IS 'Helper: create a _active view for a STAGING (RAW) table that filters to ACTIVE batches only';

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Validate that all STAGING tables have _active views
--
-- Returns a table of STAGING tables missing their companion _active view.
-- Used by drift audit (§8 violations).
--
-- Usage: SELECT * FROM ctb.validate_raw_active_views();
-- Returns: table_schema, table_name, expected_view, has_view
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.validate_raw_active_views()
RETURNS TABLE (
    table_schema TEXT,
    table_name TEXT,
    expected_view TEXT,
    has_view BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    SELECT
        tr.table_schema,
        tr.table_name,
        (tr.table_name || '_active')::TEXT AS expected_view,
        EXISTS (
            SELECT 1 FROM information_schema.views v
            WHERE v.table_schema = tr.table_schema
              AND v.table_name = tr.table_name || '_active'
        ) AS has_view
    FROM ctb.table_registry tr
    WHERE tr.leaf_type = 'STAGING'
    ORDER BY tr.table_schema, tr.table_name;
END;
$$;

COMMENT ON FUNCTION ctb.validate_raw_active_views() IS 'Returns all STAGING tables and whether they have a companion _active view';

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Validate RAW table has required columns
--
-- Checks that a RAW table has all 5 required columns per §8.2:
-- ingestion_batch_id, vendor_source, bridge_version,
-- supersedes_batch_id, created_at
--
-- Usage: SELECT * FROM ctb.validate_raw_columns('public', 'raw_companies');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.validate_raw_columns(
    p_schema TEXT,
    p_table TEXT
)
RETURNS TABLE (
    required_column TEXT,
    present BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    required_cols TEXT[] := ARRAY[
        'ingestion_batch_id',
        'vendor_source',
        'bridge_version',
        'supersedes_batch_id',
        'created_at'
    ];
    col TEXT;
BEGIN
    FOREACH col IN ARRAY required_cols LOOP
        required_column := col;
        present := EXISTS (
            SELECT 1 FROM information_schema.columns ic
            WHERE ic.table_schema = p_schema
              AND ic.table_name = p_table
              AND ic.column_name = col
        );
        RETURN NEXT;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION ctb.validate_raw_columns(TEXT, TEXT) IS 'Validates a RAW table has all 5 required columns per §8.2';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.validate_raw_columns(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS ctb.validate_raw_active_views();
-- DROP FUNCTION IF EXISTS ctb.create_raw_active_view(TEXT, TEXT);
