-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 009: Frozen Bridge Function Template
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Template for versioned bridge functions that transform vendor JSON
--          into structured RAW columns. Bridges are the ONLY path from vendor
--          tables to RAW tables.
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §9.2
-- Depends: 001_ctb_table_registry.sql, 005_raw_immutability.sql,
--          006_raw_batch_registry.sql, 008_vendor_json_template.sql
-- Idempotent: YES (safe to re-run)
--
-- USAGE: Copy this template per bridge. Replace all <placeholders>.
--        Each bridge version is a separate migration file.
--        Old bridge versions remain in history — never modify in place.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- BRIDGE FUNCTION TEMPLATE
--
-- This is a REFERENCE IMPLEMENTATION. Copy and customize per sub-hub.
--
-- The bridge function:
--   1. Reads from vendor_claude_<subhub> (JSON payload)
--   2. Explicitly extracts and casts each field
--   3. Validates required keys exist and types match
--   4. Inserts structured rows into raw_<entity>
--   5. Registers the batch in ctb.raw_batch_registry
--   6. Returns the batch_id for tracking
--
-- Bridge prohibitions (§9.2):
--   - No dynamic JSON key iteration (jsonb_each, jsonb_object_keys)
--   - No silent NULL coercion (must validate before extracting)
--   - No mutating RAW rows (INSERT only)
--   - No updating previous batches (supersede only)
-- ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION ctb.bridge_template_v1(
    p_batch_id UUID,
    p_vendor_source TEXT DEFAULT 'unknown'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
DECLARE
    -- ═══════════════════════════════════════════════════════════════
    -- BRIDGE METADATA (FROZEN — bump version for any change)
    -- ═══════════════════════════════════════════════════════════════
    BRIDGE_VERSION CONSTANT TEXT := '1.0.0';
    BRIDGE_ID CONSTANT TEXT := 'template-bridge-v1';
    TARGET_SCHEMA CONSTANT TEXT := 'public';
    TARGET_TABLE CONSTANT TEXT := 'raw_template';
    VENDOR_TABLE CONSTANT TEXT := 'vendor_claude_template';

    v_row RECORD;
    v_row_count INTEGER := 0;
    v_extracted_name TEXT;
    v_extracted_email TEXT;
    v_extracted_created_at TIMESTAMPTZ;
BEGIN
    -- ═══════════════════════════════════════════════════════════════
    -- STEP 1: Validate bridge is registered
    -- ═══════════════════════════════════════════════════════════════
    IF NOT EXISTS (
        SELECT 1 FROM ctb.vendor_bridges
        WHERE bridge_id = BRIDGE_ID
          AND is_active = true
    ) THEN
        RAISE EXCEPTION 'CTB_BRIDGE: Bridge "%" is not registered or not active in ctb.vendor_bridges. '
                        'Register the bridge before executing. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §9.2',
                        BRIDGE_ID;
    END IF;

    -- ═══════════════════════════════════════════════════════════════
    -- STEP 2: Process each vendor row in this batch
    -- ═══════════════════════════════════════════════════════════════
    FOR v_row IN
        SELECT id, payload_json
        FROM public.vendor_claude_template
        WHERE ingestion_batch_id = p_batch_id
    LOOP
        -- ─────────────────────────────────────────────────────────
        -- EXPLICIT JSON EXTRACTION (no dynamic iteration)
        -- Each field is extracted by name and cast to target type.
        -- Missing required keys → RAISE EXCEPTION.
        -- ─────────────────────────────────────────────────────────

        -- Required field: name (TEXT)
        IF NOT (v_row.payload_json ? 'name') THEN
            RAISE EXCEPTION 'CTB_BRIDGE: Missing required key "name" in payload for vendor row %. '
                            'Bridge: %, Version: %',
                            v_row.id, BRIDGE_ID, BRIDGE_VERSION;
        END IF;
        v_extracted_name := v_row.payload_json->>'name';
        IF v_extracted_name IS NULL OR v_extracted_name = '' THEN
            RAISE EXCEPTION 'CTB_BRIDGE: Key "name" is NULL or empty in vendor row %. '
                            'Bridge: %, Version: %',
                            v_row.id, BRIDGE_ID, BRIDGE_VERSION;
        END IF;

        -- Required field: email (TEXT)
        IF NOT (v_row.payload_json ? 'email') THEN
            RAISE EXCEPTION 'CTB_BRIDGE: Missing required key "email" in payload for vendor row %. '
                            'Bridge: %, Version: %',
                            v_row.id, BRIDGE_ID, BRIDGE_VERSION;
        END IF;
        v_extracted_email := v_row.payload_json->>'email';

        -- Optional field: created_at (TIMESTAMPTZ, with explicit cast)
        BEGIN
            v_extracted_created_at := (v_row.payload_json->>'created_at')::TIMESTAMPTZ;
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'CTB_BRIDGE: Type mismatch for "created_at" in vendor row % — '
                            'expected TIMESTAMPTZ, got: %. Bridge: %, Version: %',
                            v_row.id,
                            v_row.payload_json->>'created_at',
                            BRIDGE_ID, BRIDGE_VERSION;
        END;

        -- ─────────────────────────────────────────────────────────
        -- INSERT into structured RAW table (no JSON columns)
        -- ─────────────────────────────────────────────────────────
        INSERT INTO public.raw_template (
            ingestion_batch_id,
            vendor_source,
            bridge_version,
            supersedes_batch_id,
            created_at,
            -- Structured columns (from JSON extraction)
            name,
            email,
            source_created_at
        ) VALUES (
            p_batch_id,
            p_vendor_source,
            BRIDGE_VERSION,
            NULL,  -- Set supersedes_batch_id if this is a correction batch
            now(),
            -- Extracted values
            v_extracted_name,
            v_extracted_email,
            v_extracted_created_at
        );

        v_row_count := v_row_count + 1;
    END LOOP;

    -- ═══════════════════════════════════════════════════════════════
    -- STEP 3: Register batch in ctb.raw_batch_registry
    -- ═══════════════════════════════════════════════════════════════
    INSERT INTO ctb.raw_batch_registry (
        batch_id,
        bridge_id,
        vendor_source,
        bridge_version,
        target_schema,
        target_table,
        row_count,
        supersedes_batch_id,
        status
    ) VALUES (
        p_batch_id,
        BRIDGE_ID,
        p_vendor_source,
        BRIDGE_VERSION,
        TARGET_SCHEMA,
        TARGET_TABLE,
        v_row_count,
        NULL,  -- Set if this batch supersedes a previous one
        'ACTIVE'
    );

    RAISE NOTICE 'CTB_BRIDGE: % processed % rows from % → %.% (version %)',
                 BRIDGE_ID, v_row_count, VENDOR_TABLE, TARGET_SCHEMA, TARGET_TABLE, BRIDGE_VERSION;

    RETURN p_batch_id;
END;
$$;

COMMENT ON FUNCTION ctb.bridge_template_v1(UUID, TEXT) IS
    'TEMPLATE — Frozen bridge function. Transforms vendor JSON → structured RAW. '
    'Copy and customize per sub-hub. Version bump required for any change. '
    'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §9.2';

-- ───────────────────────────────────────────────────────────────────
-- HELPER: Validate a bridge function has a BRIDGE_VERSION constant
--
-- Checks that a function in the ctb schema contains the required
-- bridge metadata constants. Used by drift audit.
--
-- Usage: SELECT ctb.validate_bridge_function('bridge_template_v1');
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.validate_bridge_function(
    p_function_name TEXT
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
    func_source TEXT;
BEGIN
    -- Get function source
    SELECT prosrc INTO func_source
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'ctb'
      AND p.proname = p_function_name;

    IF func_source IS NULL THEN
        check_name := 'function_exists';
        passed := false;
        detail := 'Function ctb.' || p_function_name || ' not found';
        RETURN NEXT;
        RETURN;
    END IF;

    -- Check BRIDGE_VERSION constant
    check_name := 'bridge_version_constant';
    passed := func_source LIKE '%BRIDGE_VERSION CONSTANT TEXT%';
    detail := CASE WHEN passed THEN 'Found BRIDGE_VERSION constant' ELSE 'Missing BRIDGE_VERSION constant' END;
    RETURN NEXT;

    -- Check BRIDGE_ID constant
    check_name := 'bridge_id_constant';
    passed := func_source LIKE '%BRIDGE_ID CONSTANT TEXT%';
    detail := CASE WHEN passed THEN 'Found BRIDGE_ID constant' ELSE 'Missing BRIDGE_ID constant' END;
    RETURN NEXT;

    -- Check for prohibited dynamic iteration
    check_name := 'no_dynamic_iteration';
    passed := NOT (func_source LIKE '%jsonb_each%' OR func_source LIKE '%jsonb_object_keys%');
    detail := CASE WHEN passed THEN 'No dynamic JSON iteration found' ELSE 'PROHIBITED: dynamic JSON iteration detected' END;
    RETURN NEXT;

    -- Check for explicit exception handling
    check_name := 'has_exception_handling';
    passed := func_source LIKE '%RAISE EXCEPTION%';
    detail := CASE WHEN passed THEN 'Has explicit error handling' ELSE 'Missing RAISE EXCEPTION for validation' END;
    RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION ctb.validate_bridge_function(TEXT) IS
    'Validates a bridge function has required metadata and follows §9.2 rules';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS ctb.validate_bridge_function(TEXT);
-- DROP FUNCTION IF EXISTS ctb.bridge_template_v1(UUID, TEXT);
