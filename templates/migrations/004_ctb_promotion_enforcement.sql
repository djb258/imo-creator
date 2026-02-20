-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 004: CTB Promotion Enforcement
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Enforce declared promotion paths from SUPPORTING → CANONICAL tables
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.4
-- Depends: 001_ctb_table_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- TABLE: ctb.promotion_paths
-- Declares allowed data flow from SUPPORTING tables to CANONICAL tables.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ctb.promotion_paths (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_schema       TEXT NOT NULL DEFAULT 'public',
    source_table        TEXT NOT NULL,
    target_schema       TEXT NOT NULL DEFAULT 'public',
    target_table        TEXT NOT NULL,
    hub_id              TEXT NOT NULL,
    subhub_id           TEXT NOT NULL,
    description         TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by          TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT uq_promotion_path UNIQUE (source_schema, source_table, target_schema, target_table)
);

COMMENT ON TABLE ctb.promotion_paths IS 'Declared data flow paths from SUPPORTING → CANONICAL tables';
COMMENT ON COLUMN ctb.promotion_paths.source_table IS 'SUPPORTING table (STAGING, MV, REGISTRY)';
COMMENT ON COLUMN ctb.promotion_paths.target_table IS 'CANONICAL table — destination of promoted data';

CREATE INDEX IF NOT EXISTS idx_promotion_paths_target
    ON ctb.promotion_paths (target_schema, target_table);

CREATE INDEX IF NOT EXISTS idx_promotion_paths_source
    ON ctb.promotion_paths (source_schema, source_table);

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Enforce promotion path on CANONICAL table writes
--
-- Before writing to a CANONICAL table, the caller must:
--   1. Set session variable: SET LOCAL ctb.promotion_source = 'schema.source_table'
--   2. Have a registered path in ctb.promotion_paths
--
-- Direct writes to CANONICAL without a promotion source are rejected.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.enforce_promotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    target_leaf_type TEXT;
    promotion_source TEXT;
    src_schema TEXT;
    src_table TEXT;
    path_exists BOOLEAN;
BEGIN
    -- Only enforce on CANONICAL tables
    SELECT tr.leaf_type INTO target_leaf_type
    FROM ctb.table_registry tr
    WHERE tr.table_schema = TG_TABLE_SCHEMA
      AND tr.table_name = TG_TABLE_NAME;

    -- If not CANONICAL, allow (other table types don't need promotion)
    IF target_leaf_type IS NULL OR target_leaf_type != 'CANONICAL' THEN
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
    END IF;

    -- Check for promotion source session variable
    BEGIN
        promotion_source := current_setting('ctb.promotion_source', true);
    EXCEPTION WHEN OTHERS THEN
        promotion_source := NULL;
    END;

    -- If no promotion source set, this is a direct write — reject
    IF promotion_source IS NULL OR promotion_source = '' THEN
        RAISE EXCEPTION 'CTB_PROMOTION_GATE: Direct write to CANONICAL table %.% is not allowed. '
                        'Set ctb.promotion_source session variable to declare the source table. '
                        'Usage: SET LOCAL ctb.promotion_source = ''schema.source_table''; '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.4',
                        TG_TABLE_SCHEMA, TG_TABLE_NAME;
    END IF;

    -- Parse source schema.table
    IF position('.' in promotion_source) > 0 THEN
        src_schema := split_part(promotion_source, '.', 1);
        src_table := split_part(promotion_source, '.', 2);
    ELSE
        src_schema := 'public';
        src_table := promotion_source;
    END IF;

    -- Verify promotion path exists
    SELECT EXISTS(
        SELECT 1 FROM ctb.promotion_paths pp
        WHERE pp.source_schema = src_schema
          AND pp.source_table = src_table
          AND pp.target_schema = TG_TABLE_SCHEMA
          AND pp.target_table = TG_TABLE_NAME
          AND pp.is_active = true
    ) INTO path_exists;

    IF NOT path_exists THEN
        RAISE EXCEPTION 'CTB_PROMOTION_GATE: No registered promotion path from %.% to %.%. '
                        'Register the path in ctb.promotion_paths before promoting data. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.4',
                        src_schema, src_table, TG_TABLE_SCHEMA, TG_TABLE_NAME;
    END IF;

    -- Path is valid — allow the write
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

COMMENT ON FUNCTION ctb.enforce_promotion() IS 'Row-level trigger: blocks direct writes to CANONICAL tables without registered promotion path';

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Attach promotion enforcement to a CANONICAL table
-- Usage: SELECT ctb.create_promotion_guard('public', 'my_canonical_table');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.create_promotion_guard(
    p_schema TEXT,
    p_table TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    trigger_name TEXT;
    full_table TEXT;
BEGIN
    trigger_name := 'trg_ctb_promotion_' || p_table;
    full_table := quote_ident(p_schema) || '.' || quote_ident(p_table);

    -- Drop existing trigger if present (idempotent)
    EXECUTE format(
        'DROP TRIGGER IF EXISTS %I ON %s',
        trigger_name, full_table
    );

    -- Create BEFORE trigger for INSERT and UPDATE (not DELETE)
    EXECUTE format(
        'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON %s '
        'FOR EACH ROW EXECUTE FUNCTION ctb.enforce_promotion()',
        trigger_name, full_table
    );

    RAISE NOTICE 'CTB promotion guard attached to %', full_table;
END;
$$;

COMMENT ON FUNCTION ctb.create_promotion_guard(TEXT, TEXT) IS 'Helper: attach promotion enforcement trigger to a CANONICAL table';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.create_promotion_guard(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS ctb.enforce_promotion();
-- DROP TABLE IF EXISTS ctb.promotion_paths;
