-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 002: CTB DDL Event Trigger
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Block CREATE/ALTER/DROP TABLE on tables not registered in ctb.table_registry
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.2
-- Depends: 001_ctb_table_registry.sql
-- Idempotent: YES (safe to re-run)
-- Note: PostgreSQL event triggers exempt superusers by design
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Enforce table registration on DDL
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.enforce_table_registration()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    obj RECORD;
    tbl_schema TEXT;
    tbl_name TEXT;
    is_registered BOOLEAN;
    is_frozen BOOLEAN;
BEGIN
    -- Iterate over all objects affected by this DDL command
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands()
    LOOP
        -- Only enforce on tables (not indexes, sequences, etc.)
        IF obj.object_type != 'table' THEN
            CONTINUE;
        END IF;

        -- Parse schema and table name from object_identity (format: schema.table)
        tbl_schema := split_part(obj.object_identity, '.', 1);
        tbl_name := split_part(obj.object_identity, '.', 2);

        -- Skip ctb schema itself (governance infrastructure)
        IF tbl_schema = 'ctb' THEN
            CONTINUE;
        END IF;

        -- Skip pg_temp schemas (temporary tables)
        IF tbl_schema LIKE 'pg_temp%' THEN
            CONTINUE;
        END IF;

        -- Check registration
        SELECT EXISTS(
            SELECT 1 FROM ctb.table_registry
            WHERE table_registry.table_schema = tbl_schema
              AND table_registry.table_name = tbl_name
        ) INTO is_registered;

        IF NOT is_registered THEN
            RAISE EXCEPTION 'CTB_DDL_GATE: Table %.% is not registered in ctb.table_registry. '
                            'Register the table BEFORE creating/altering it. '
                            'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.2',
                            tbl_schema, tbl_name;
        END IF;

        -- Check frozen status for ALTER operations
        IF obj.command_tag LIKE 'ALTER%' THEN
            SELECT tr.is_frozen INTO is_frozen
            FROM ctb.table_registry tr
            WHERE tr.table_schema = tbl_schema
              AND tr.table_name = tbl_name;

            IF is_frozen THEN
                RAISE EXCEPTION 'CTB_DDL_GATE: Table %.% is FROZEN — structure cannot be altered. '
                                'Unfreeze via ctb.table_registry before making changes.',
                                tbl_schema, tbl_name;
            END IF;
        END IF;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION ctb.enforce_table_registration() IS 'Event trigger: blocks DDL on unregistered tables';

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Enforce registration on DROP
-- pg_event_trigger_dropped_objects() is used for DROP events
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.enforce_table_drop_registration()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    obj RECORD;
    tbl_schema TEXT;
    tbl_name TEXT;
    is_registered BOOLEAN;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
    LOOP
        IF obj.object_type != 'table' THEN
            CONTINUE;
        END IF;

        tbl_schema := obj.schema_name;
        tbl_name := obj.object_name;

        -- Skip ctb schema
        IF tbl_schema = 'ctb' THEN
            CONTINUE;
        END IF;

        -- Skip pg_temp schemas
        IF tbl_schema LIKE 'pg_temp%' THEN
            CONTINUE;
        END IF;

        -- Verify the table was registered (dropping unregistered = violation)
        SELECT EXISTS(
            SELECT 1 FROM ctb.table_registry
            WHERE table_registry.table_schema = tbl_schema
              AND table_registry.table_name = tbl_name
        ) INTO is_registered;

        IF NOT is_registered THEN
            RAISE EXCEPTION 'CTB_DDL_GATE: Cannot DROP %.% — not registered in ctb.table_registry. '
                            'Only registered tables may be dropped (with proper ADR + rollback migration).',
                            tbl_schema, tbl_name;
        END IF;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION ctb.enforce_table_drop_registration() IS 'Event trigger: blocks DROP on unregistered tables';

-- ───────────────────────────────────────────────────────────────────
-- EVENT TRIGGERS
-- ───────────────────────────────────────────────────────────────────

-- Drop existing triggers first (idempotent)
DROP EVENT TRIGGER IF EXISTS ctb_enforce_table_registration;
DROP EVENT TRIGGER IF EXISTS ctb_enforce_table_drop;

-- CREATE/ALTER gate
CREATE EVENT TRIGGER ctb_enforce_table_registration
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE', 'ALTER TABLE')
    EXECUTE FUNCTION ctb.enforce_table_registration();

-- DROP gate
CREATE EVENT TRIGGER ctb_enforce_table_drop
    ON sql_drop
    WHEN TAG IN ('DROP TABLE')
    EXECUTE FUNCTION ctb.enforce_table_drop_registration();

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP EVENT TRIGGER IF EXISTS ctb_enforce_table_registration;
-- DROP EVENT TRIGGER IF EXISTS ctb_enforce_table_drop;
-- DROP FUNCTION IF EXISTS ctb.enforce_table_registration();
-- DROP FUNCTION IF EXISTS ctb.enforce_table_drop_registration();
