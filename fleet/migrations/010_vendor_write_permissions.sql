-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 010: Vendor Write Permissions (Role Separation)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Template for role-based access control separating vendor ingestion
--          from structured data access. The claude_role can INSERT into vendor
--          tables and EXECUTE bridges, but CANNOT write directly to RAW,
--          SUPPORTING, or CANONICAL tables.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §9.1, §9.2
-- Depends: 001_ctb_table_registry.sql, 005_raw_immutability.sql,
--          008_vendor_json_template.sql, 009_bridge_template.sql
-- Idempotent: YES (safe to re-run)
--
-- USAGE: Replace <subhub> with your sub-hub name. Replace <bridge_function>
--        with the actual bridge function name. Customize roles as needed.
--
-- NOTE: This migration creates ROLES. Roles are cluster-wide in PostgreSQL.
--       On managed platforms (Neon, Supabase), check role creation permissions.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- ROLE: ctb_vendor_writer
--
-- This role can:
--   - INSERT into vendor_claude_* tables
--   - EXECUTE bridge functions in ctb schema
--   - SELECT from vendor_claude_* tables (for bridge reads)
--
-- This role CANNOT:
--   - INSERT/UPDATE/DELETE on raw_* tables
--   - INSERT/UPDATE/DELETE on SUPPORTING or CANONICAL tables
--   - ALTER or DROP any table
--   - Access ctb.table_registry directly
-- ───────────────────────────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_vendor_writer') THEN
        CREATE ROLE ctb_vendor_writer NOLOGIN;
        COMMENT ON ROLE ctb_vendor_writer IS
            'CTB vendor writer — INSERT into vendor tables, EXECUTE bridges. '
            'No direct RAW/SUPPORTING/CANONICAL access. §9.1';
    END IF;
END
$$;

-- ───────────────────────────────────────────────────────────────────
-- ROLE: ctb_data_reader
--
-- This role can:
--   - SELECT from _active views
--   - SELECT from SUPPORTING and CANONICAL tables
--
-- This role CANNOT:
--   - INSERT/UPDATE/DELETE on any table
--   - Access vendor_claude_* tables
--   - Execute bridge functions
-- ───────────────────────────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_data_reader') THEN
        CREATE ROLE ctb_data_reader NOLOGIN;
        COMMENT ON ROLE ctb_data_reader IS
            'CTB data reader — SELECT from _active views, SUPPORTING, CANONICAL. '
            'No write access. No vendor table access. §9.4';
    END IF;
END
$$;

-- ───────────────────────────────────────────────────────────────────
-- ROLE: ctb_bridge_executor
--
-- This role can:
--   - EXECUTE bridge functions in ctb schema
--   - INSERT into raw_* tables (via bridge only — SECURITY DEFINER)
--   - INSERT into ctb.raw_batch_registry (via bridge only)
--
-- Bridge functions use SECURITY DEFINER, so the bridge runs with
-- elevated permissions. The calling role (ctb_vendor_writer) only
-- needs EXECUTE permission on the bridge function.
-- ───────────────────────────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_bridge_executor') THEN
        CREATE ROLE ctb_bridge_executor NOLOGIN;
        COMMENT ON ROLE ctb_bridge_executor IS
            'CTB bridge executor — can execute bridge functions. '
            'RAW writes happen via SECURITY DEFINER in bridge. §9.2';
    END IF;
END
$$;

-- ───────────────────────────────────────────────────────────────────
-- GRANT TEMPLATES
--
-- Uncomment and customize these for your specific tables and bridges.
-- Replace <subhub> and <bridge_function> with actual values.
-- ───────────────────────────────────────────────────────────────────

-- Vendor writer: INSERT into vendor tables, SELECT for bridge reads
-- GRANT INSERT, SELECT ON public.vendor_claude_<subhub> TO ctb_vendor_writer;

-- Vendor writer: EXECUTE bridge functions
-- GRANT EXECUTE ON FUNCTION ctb.<bridge_function>(UUID, TEXT) TO ctb_vendor_writer;

-- Bridge executor inherits vendor writer permissions
-- GRANT ctb_vendor_writer TO ctb_bridge_executor;

-- Data reader: SELECT from _active views
-- GRANT SELECT ON public.raw_<entity>_active TO ctb_data_reader;
-- GRANT SELECT ON public.<supporting_table> TO ctb_data_reader;
-- GRANT SELECT ON public.<canonical_table> TO ctb_data_reader;

-- ───────────────────────────────────────────────────────────────────
-- DENY PATTERNS (explicit revokes for defense in depth)
--
-- These ensure the vendor writer cannot bypass the bridge.
-- ───────────────────────────────────────────────────────────────────

-- Revoke direct RAW table access from vendor writer
-- REVOKE ALL ON public.raw_<entity> FROM ctb_vendor_writer;

-- Revoke SUPPORTING and CANONICAL access from vendor writer
-- REVOKE ALL ON public.<supporting_table> FROM ctb_vendor_writer;
-- REVOKE ALL ON public.<canonical_table> FROM ctb_vendor_writer;

-- Revoke vendor table access from data reader
-- REVOKE ALL ON public.vendor_claude_<subhub> FROM ctb_data_reader;

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Validate role separation for a sub-hub
--
-- Checks that the vendor writer role cannot access RAW tables
-- directly and that the data reader cannot access vendor tables.
--
-- Usage: SELECT * FROM ctb.validate_role_separation('public', 'companies');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.validate_role_separation(
    p_schema TEXT,
    p_subhub TEXT
)
RETURNS TABLE (
    check_name TEXT,
    passed BOOLEAN,
    detail TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    vendor_table TEXT;
    raw_table TEXT;
BEGIN
    vendor_table := 'vendor_claude_' || p_subhub;
    raw_table := 'raw_' || p_subhub;

    -- Check 1: ctb_vendor_writer role exists
    check_name := 'vendor_writer_role_exists';
    passed := EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_vendor_writer');
    detail := CASE WHEN passed THEN 'Role ctb_vendor_writer exists' ELSE 'Role ctb_vendor_writer missing' END;
    RETURN NEXT;

    -- Check 2: ctb_data_reader role exists
    check_name := 'data_reader_role_exists';
    passed := EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_data_reader');
    detail := CASE WHEN passed THEN 'Role ctb_data_reader exists' ELSE 'Role ctb_data_reader missing' END;
    RETURN NEXT;

    -- Check 3: Vendor table exists
    check_name := 'vendor_table_exists';
    passed := EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = p_schema AND table_name = vendor_table
    );
    detail := CASE WHEN passed THEN p_schema || '.' || vendor_table || ' exists'
                   ELSE p_schema || '.' || vendor_table || ' not found' END;
    RETURN NEXT;

    -- Check 4: RAW table exists
    check_name := 'raw_table_exists';
    passed := EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = p_schema AND table_name = raw_table
    );
    detail := CASE WHEN passed THEN p_schema || '.' || raw_table || ' exists'
                   ELSE p_schema || '.' || raw_table || ' not found' END;
    RETURN NEXT;

    -- Check 5: Vendor table has JSONB column
    check_name := 'vendor_has_jsonb';
    passed := EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = p_schema
          AND table_name = vendor_table
          AND data_type = 'jsonb'
    );
    detail := CASE WHEN passed THEN 'Vendor table has JSONB column (correct)'
                   ELSE 'Vendor table missing JSONB column' END;
    RETURN NEXT;

    -- Check 6: RAW table has NO JSONB/JSON columns
    check_name := 'raw_no_json';
    passed := NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = p_schema
          AND table_name = raw_table
          AND data_type IN ('jsonb', 'json')
    );
    detail := CASE WHEN passed THEN 'RAW table has no JSON columns (correct)'
                   ELSE 'VIOLATION: RAW table contains JSON columns' END;
    RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION ctb.validate_role_separation(TEXT, TEXT) IS
    'Validates role separation and JSON containment for a sub-hub. §9.1, §9.2';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.validate_role_separation(TEXT, TEXT);
-- Roles are cluster-wide — drop manually if needed:
-- DROP ROLE IF EXISTS ctb_bridge_executor;
-- DROP ROLE IF EXISTS ctb_data_reader;
-- DROP ROLE IF EXISTS ctb_vendor_writer;
