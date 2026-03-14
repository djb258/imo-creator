-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 005: RAW Immutability Enforcement
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: INSERT-only enforcement on STAGING, SUPPORTING, and CANONICAL tables.
--          UPDATE and DELETE are rejected at the trigger level.
--          ERROR tables allow INSERT + UPDATE but not DELETE.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.2
-- Depends: 001_ctb_table_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- TABLE: ctb.vendor_bridges
-- Declares allowed vendor integration points for RAW ingestion.
-- Every vendor bridge must be registered before writing to RAW tables.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.1
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ctb.vendor_bridges (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bridge_id           TEXT NOT NULL,
    vendor_source       TEXT NOT NULL,
    bridge_version      TEXT NOT NULL,
    target_schema       TEXT NOT NULL DEFAULT 'public',
    target_table        TEXT NOT NULL,
    hub_id              TEXT NOT NULL,
    subhub_id           TEXT NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    description         TEXT,
    registered_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    registered_by       TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT uq_vendor_bridge UNIQUE (bridge_id)
);

COMMENT ON TABLE ctb.vendor_bridges IS 'Registered vendor bridges — each declares an allowed integration point for RAW ingestion';
COMMENT ON COLUMN ctb.vendor_bridges.bridge_id IS 'Unique bridge identifier (e.g., stripe-invoices-v2)';
COMMENT ON COLUMN ctb.vendor_bridges.vendor_source IS 'External system name (e.g., stripe, hubspot, manual_csv)';
COMMENT ON COLUMN ctb.vendor_bridges.bridge_version IS 'Semantic version of the bridge logic';
COMMENT ON COLUMN ctb.vendor_bridges.target_table IS 'RAW table this bridge writes to';

CREATE INDEX IF NOT EXISTS idx_vendor_bridges_target
    ON ctb.vendor_bridges (target_schema, target_table);

CREATE INDEX IF NOT EXISTS idx_vendor_bridges_source
    ON ctb.vendor_bridges (vendor_source);

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Immutability enforcement trigger
--
-- Enforces INSERT-only on STAGING, MV, REGISTRY, CANONICAL tables.
-- ERROR tables allow INSERT + UPDATE but not DELETE.
-- Checks ctb.table_registry for the leaf_type of the target table.
--
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.2
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.enforce_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    target_leaf_type TEXT;
BEGIN
    -- Look up the leaf_type for this table
    SELECT tr.leaf_type INTO target_leaf_type
    FROM ctb.table_registry tr
    WHERE tr.table_schema = TG_TABLE_SCHEMA
      AND tr.table_name = TG_TABLE_NAME;

    -- If table is not registered, let write_guard_check handle it
    IF target_leaf_type IS NULL THEN
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
    END IF;

    -- ERROR tables: allow INSERT and UPDATE, reject DELETE
    IF target_leaf_type = 'ERROR' THEN
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'CTB_IMMUTABILITY: DELETE on ERROR table %.% is not allowed. '
                            'ERROR tables are append-only (INSERT + UPDATE permitted). '
                            'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.2',
                            TG_TABLE_SCHEMA, TG_TABLE_NAME;
        END IF;
        -- INSERT and UPDATE are allowed on ERROR tables
        RETURN NEW;
    END IF;

    -- STAGING, MV, REGISTRY, CANONICAL: INSERT only — reject UPDATE and DELETE
    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'CTB_IMMUTABILITY: UPDATE on %.% (leaf_type=%) is not allowed. '
                        'All STAGING, SUPPORTING, and CANONICAL tables are INSERT-only. '
                        'Corrections must flow through batch supersede. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.2',
                        TG_TABLE_SCHEMA, TG_TABLE_NAME, target_leaf_type;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'CTB_IMMUTABILITY: DELETE on %.% (leaf_type=%) is not allowed. '
                        'All governed tables are append-only. Rows are permanent. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.2',
                        TG_TABLE_SCHEMA, TG_TABLE_NAME, target_leaf_type;
    END IF;

    -- INSERT is allowed
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION ctb.enforce_immutability() IS 'Row-level trigger: enforces INSERT-only on governed tables (ERROR allows UPDATE)';

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Attach immutability enforcement to a table
-- Usage: SELECT ctb.create_immutability_guard('public', 'raw_companies');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.create_immutability_guard(
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
    trigger_name := 'trg_ctb_immutability_' || p_table;
    full_table := quote_ident(p_schema) || '.' || quote_ident(p_table);

    -- Drop existing trigger if present (idempotent)
    EXECUTE format(
        'DROP TRIGGER IF EXISTS %I ON %s',
        trigger_name, full_table
    );

    -- Create BEFORE trigger for UPDATE and DELETE
    -- INSERT passes through (immutability only blocks mutations)
    EXECUTE format(
        'CREATE TRIGGER %I BEFORE UPDATE OR DELETE ON %s '
        'FOR EACH ROW EXECUTE FUNCTION ctb.enforce_immutability()',
        trigger_name, full_table
    );

    RAISE NOTICE 'CTB immutability guard attached to %', full_table;
END;
$$;

COMMENT ON FUNCTION ctb.create_immutability_guard(TEXT, TEXT) IS 'Helper: attach INSERT-only enforcement trigger to a governed table';

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Remove immutability guard from a table
-- Usage: SELECT ctb.remove_immutability_guard('public', 'raw_companies');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.remove_immutability_guard(
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
    trigger_name := 'trg_ctb_immutability_' || p_table;
    full_table := quote_ident(p_schema) || '.' || quote_ident(p_table);

    EXECUTE format(
        'DROP TRIGGER IF EXISTS %I ON %s',
        trigger_name, full_table
    );

    RAISE NOTICE 'CTB immutability guard removed from %', full_table;
END;
$$;

COMMENT ON FUNCTION ctb.remove_immutability_guard(TEXT, TEXT) IS 'Helper: remove INSERT-only enforcement trigger from a table';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.remove_immutability_guard(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS ctb.create_immutability_guard(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS ctb.enforce_immutability();
-- DROP TABLE IF EXISTS ctb.vendor_bridges;
