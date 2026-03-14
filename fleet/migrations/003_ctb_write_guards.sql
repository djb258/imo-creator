-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 003: CTB Write Guards
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Row-level BEFORE triggers that block writes to unregistered/frozen tables
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.3
-- Depends: 001_ctb_table_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Write guard check
-- Attach this trigger to any protected table.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.write_guard_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    is_registered BOOLEAN;
    is_frozen BOOLEAN;
BEGIN
    -- Check if table is registered
    SELECT EXISTS(
        SELECT 1 FROM ctb.table_registry
        WHERE table_registry.table_schema = TG_TABLE_SCHEMA
          AND table_registry.table_name = TG_TABLE_NAME
    ) INTO is_registered;

    IF NOT is_registered THEN
        RAISE EXCEPTION 'CTB_WRITE_GUARD: Table %.% is not registered in ctb.table_registry. '
                        'Register the table before writing to it. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.3',
                        TG_TABLE_SCHEMA, TG_TABLE_NAME;
    END IF;

    -- Check if table is frozen (no writes allowed)
    SELECT tr.is_frozen INTO is_frozen
    FROM ctb.table_registry tr
    WHERE tr.table_schema = TG_TABLE_SCHEMA
      AND tr.table_name = TG_TABLE_NAME;

    IF is_frozen THEN
        RAISE EXCEPTION 'CTB_WRITE_GUARD: Table %.% is FROZEN — writes are blocked. '
                        'Unfreeze via ctb.table_registry before writing.',
                        TG_TABLE_SCHEMA, TG_TABLE_NAME;
    END IF;

    -- Allow the operation
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

COMMENT ON FUNCTION ctb.write_guard_check() IS 'Row-level trigger: blocks writes to unregistered or frozen tables';

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Attach write guard to a table
-- Usage: SELECT ctb.create_write_guard('public', 'my_table');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.create_write_guard(
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
    trigger_name := 'trg_ctb_write_guard_' || p_table;
    full_table := quote_ident(p_schema) || '.' || quote_ident(p_table);

    -- Drop existing trigger if present (idempotent)
    EXECUTE format(
        'DROP TRIGGER IF EXISTS %I ON %s',
        trigger_name, full_table
    );

    -- Create BEFORE trigger for INSERT, UPDATE, DELETE
    EXECUTE format(
        'CREATE TRIGGER %I BEFORE INSERT OR UPDATE OR DELETE ON %s '
        'FOR EACH ROW EXECUTE FUNCTION ctb.write_guard_check()',
        trigger_name, full_table
    );

    RAISE NOTICE 'CTB write guard attached to %', full_table;
END;
$$;

COMMENT ON FUNCTION ctb.create_write_guard(TEXT, TEXT) IS 'Helper: attach ctb.write_guard_check trigger to a table';

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Remove write guard from a table
-- Usage: SELECT ctb.remove_write_guard('public', 'my_table');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.remove_write_guard(
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
    trigger_name := 'trg_ctb_write_guard_' || p_table;
    full_table := quote_ident(p_schema) || '.' || quote_ident(p_table);

    EXECUTE format(
        'DROP TRIGGER IF EXISTS %I ON %s',
        trigger_name, full_table
    );

    RAISE NOTICE 'CTB write guard removed from %', full_table;
END;
$$;

COMMENT ON FUNCTION ctb.remove_write_guard(TEXT, TEXT) IS 'Helper: remove ctb.write_guard_check trigger from a table';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.remove_write_guard(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS ctb.create_write_guard(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS ctb.write_guard_check();
