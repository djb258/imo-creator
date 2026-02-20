-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 011: Enforce Application Role (Non-Superuser Guarantee)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Ensure child repos do NOT run application logic as superuser.
--          The ctb_app_role consolidates all application-level permissions into
--          a single non-superuser role that can only do what governance allows.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §10, FAIL_CLOSED_CI_CONTRACT.md §7
-- Depends: 001_ctb_table_registry.sql, 005_raw_immutability.sql,
--          008_vendor_json_template.sql, 009_bridge_template.sql,
--          010_vendor_write_permissions.sql
-- Idempotent: YES (safe to re-run)
--
-- USAGE: Replace <subhub>, <bridge_function>, <entity> with actual values.
--        Run after migrations 001-010 have been applied.
--
-- CRITICAL: Application code MUST connect as ctb_app_role, NOT as postgres.
--           Database triggers and event triggers do NOT fire for superusers.
--           If you connect as postgres, ALL database-level governance is inert.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- ROLE: ctb_app_role
--
-- This is the ONLY role application code should use.
-- It consolidates permissions from ctb_vendor_writer (010):
--   - INSERT into vendor_claude_* tables
--   - EXECUTE bridge functions
--   - SELECT from _active views
--   - NOTHING else
--
-- Explicitly prohibited:
--   - SUPERUSER
--   - CREATEDB
--   - CREATEROLE
--   - BYPASSRLS
--   - INSERT/UPDATE/DELETE on RAW tables directly
--   - UPDATE/DELETE on SUPPORTING tables
--   - UPDATE/DELETE on CANONICAL tables
-- ───────────────────────────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_app_role') THEN
        CREATE ROLE ctb_app_role
            NOLOGIN
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOBYPASSRLS;
        COMMENT ON ROLE ctb_app_role IS
            'CTB application role — non-superuser, limited to vendor INSERT, '
            'bridge EXECUTE, and _active view SELECT. All database-level '
            'governance (event triggers, write guards, immutability) fires '
            'for this role. §10';
    END IF;
END
$$;

-- ───────────────────────────────────────────────────────────────────
-- GRANT TEMPLATES
--
-- Uncomment and customize for your specific tables and bridges.
-- Replace <subhub>, <bridge_function>, <entity> with actual values.
-- ───────────────────────────────────────────────────────────────────

-- Inherit vendor writer permissions (INSERT vendor, EXECUTE bridges)
-- GRANT ctb_vendor_writer TO ctb_app_role;

-- SELECT on _active views (read structured data)
-- GRANT SELECT ON public.raw_<entity>_active TO ctb_app_role;

-- SELECT on SUPPORTING and CANONICAL (read final data)
-- GRANT SELECT ON public.<supporting_table> TO ctb_app_role;
-- GRANT SELECT ON public.<canonical_table> TO ctb_app_role;

-- INSERT on vendor tables (JSON landing zone)
-- GRANT INSERT ON public.vendor_claude_<subhub> TO ctb_app_role;

-- EXECUTE bridge functions (JSON → structured)
-- GRANT EXECUTE ON FUNCTION ctb.<bridge_function>(UUID, TEXT) TO ctb_app_role;

-- ───────────────────────────────────────────────────────────────────
-- EXPLICIT REVOKES (defense in depth)
--
-- These ensure ctb_app_role cannot bypass governance paths.
-- Uncomment and customize for your specific tables.
-- ───────────────────────────────────────────────────────────────────

-- Revoke direct RAW table access (must go through bridge)
-- REVOKE INSERT ON public.raw_<entity> FROM ctb_app_role;
-- REVOKE UPDATE ON public.raw_<entity> FROM ctb_app_role;
-- REVOKE DELETE ON public.raw_<entity> FROM ctb_app_role;

-- Revoke UPDATE/DELETE on SUPPORTING tables (INSERT-only, §8.2)
-- REVOKE UPDATE ON public.<supporting_table> FROM ctb_app_role;
-- REVOKE DELETE ON public.<supporting_table> FROM ctb_app_role;

-- Revoke UPDATE/DELETE on CANONICAL tables (INSERT-only, §8.2)
-- REVOKE UPDATE ON public.<canonical_table> FROM ctb_app_role;
-- REVOKE DELETE ON public.<canonical_table> FROM ctb_app_role;

-- ───────────────────────────────────────────────────────────────────
-- VALIDATION: ctb.validate_application_role()
--
-- Call this at application startup or during bootstrap audit.
-- RAISES EXCEPTION if:
--   - current_user is 'postgres' (superuser default)
--   - current_user has superuser privileges
--   - ctb_app_role does not exist
--
-- Usage: SELECT * FROM ctb.validate_application_role();
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.validate_application_role()
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
    v_is_superuser BOOLEAN;
    v_current_user TEXT;
BEGIN
    v_current_user := current_user;

    -- Check 1: ctb_app_role exists
    check_name := 'app_role_exists';
    passed := EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_app_role');
    detail := CASE WHEN passed
        THEN 'Role ctb_app_role exists'
        ELSE 'VIOLATION: Role ctb_app_role does not exist — run migration 011'
    END;
    RETURN NEXT;

    -- Check 2: Current user is NOT 'postgres'
    check_name := 'not_postgres_user';
    passed := (v_current_user <> 'postgres');
    detail := CASE WHEN passed
        THEN 'Connected as ' || v_current_user || ' (not postgres)'
        ELSE 'VIOLATION: Connected as postgres — application code must use ctb_app_role'
    END;
    RETURN NEXT;

    -- Check 3: Current user does NOT have superuser privileges
    check_name := 'not_superuser';
    SELECT usesuper INTO v_is_superuser
    FROM pg_user WHERE usename = v_current_user;
    passed := NOT COALESCE(v_is_superuser, false);
    detail := CASE WHEN passed
        THEN 'User ' || v_current_user || ' is not a superuser (governance triggers will fire)'
        ELSE 'VIOLATION: User ' || v_current_user || ' has superuser privileges — ALL database governance is INERT'
    END;
    RETURN NEXT;

    -- Check 4: ctb_app_role does NOT have superuser
    check_name := 'app_role_not_superuser';
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_app_role') THEN
        passed := NOT (SELECT rolsuper FROM pg_roles WHERE rolname = 'ctb_app_role');
        detail := CASE WHEN passed
            THEN 'ctb_app_role is NOSUPERUSER (correct)'
            ELSE 'VIOLATION: ctb_app_role has superuser — this defeats all governance'
        END;
    ELSE
        passed := false;
        detail := 'Cannot check — ctb_app_role does not exist';
    END IF;
    RETURN NEXT;

    -- Check 5: ctb_app_role does NOT have CREATEDB
    check_name := 'app_role_no_createdb';
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_app_role') THEN
        passed := NOT (SELECT rolcreatedb FROM pg_roles WHERE rolname = 'ctb_app_role');
        detail := CASE WHEN passed
            THEN 'ctb_app_role is NOCREATEDB (correct)'
            ELSE 'VIOLATION: ctb_app_role can create databases'
        END;
    ELSE
        passed := false;
        detail := 'Cannot check — ctb_app_role does not exist';
    END IF;
    RETURN NEXT;

    -- Check 6: ctb_app_role does NOT have CREATEROLE
    check_name := 'app_role_no_createrole';
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_app_role') THEN
        passed := NOT (SELECT rolcreaterole FROM pg_roles WHERE rolname = 'ctb_app_role');
        detail := CASE WHEN passed
            THEN 'ctb_app_role is NOCREATEROLE (correct)'
            ELSE 'VIOLATION: ctb_app_role can create roles'
        END;
    ELSE
        passed := false;
        detail := 'Cannot check — ctb_app_role does not exist';
    END IF;
    RETURN NEXT;

    -- Check 7: ctb_app_role does NOT have BYPASSRLS
    check_name := 'app_role_no_bypassrls';
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctb_app_role') THEN
        passed := NOT (SELECT rolbypassrls FROM pg_roles WHERE rolname = 'ctb_app_role');
        detail := CASE WHEN passed
            THEN 'ctb_app_role is NOBYPASSRLS (correct)'
            ELSE 'VIOLATION: ctb_app_role can bypass RLS'
        END;
    ELSE
        passed := false;
        detail := 'Cannot check — ctb_app_role does not exist';
    END IF;
    RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION ctb.validate_application_role() IS
    'Validates that the application is NOT running as superuser and that '
    'ctb_app_role exists with restricted privileges. CRITICAL: If application '
    'connects as superuser, ALL database-level governance is silently inert. §10';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.validate_application_role();
-- Roles are cluster-wide — drop manually if needed:
-- DROP ROLE IF EXISTS ctb_app_role;
