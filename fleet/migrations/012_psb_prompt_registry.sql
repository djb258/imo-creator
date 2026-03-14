-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 012: PSB Prompt Registry
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Versioned, searchable prompt library for the Prompt and Skills Bay.
--          Every prompt is registered with Transformation Law metadata, CC layer,
--          ORBT modes, and structured constants/variables blocks.
-- Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part XV, ADR-023
-- Depends: 001_ctb_table_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- SCHEMA: psb
-- Dedicated schema for Prompt and Skills Bay tables.
-- Keeps PSB data separated from ctb operational tables.
-- ───────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS psb;

COMMENT ON SCHEMA psb IS 'Prompt and Skills Bay — sovereign-level prompt, reverse-prompt, and skill libraries';

-- ───────────────────────────────────────────────────────────────────
-- TABLE: psb.prompt_registry (CONFIG)
-- Master registry for all prompts. Each row is a specific version
-- of a prompt. Status lifecycle: DRAFT → ACTIVE → DEPRECATED.
-- No physical DELETE — DEPRECATED is the terminal state.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS psb.prompt_registry (
    prompt_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                    TEXT NOT NULL UNIQUE,
    title                   TEXT NOT NULL,
    description             TEXT NOT NULL,
    version                 TEXT NOT NULL DEFAULT '1.0.0',

    -- Transformation Law metadata
    transformation_statement TEXT NOT NULL,
    constants_declared      TEXT[] NOT NULL DEFAULT '{}',
    variables_produced      TEXT[] NOT NULL DEFAULT '{}',

    -- Classification
    cc_layer                TEXT NOT NULL CHECK (cc_layer IN ('CC-01', 'CC-02', 'CC-03', 'CC-04')),
    orbt_modes              TEXT[] NOT NULL DEFAULT '{operate}',
    category                TEXT NOT NULL CHECK (category IN (
                                'intake', 'enforcement', 'regeneration', 'migration',
                                'declaration', 'projection', 'auxiliary'
                            )),

    -- Content
    template_text           TEXT NOT NULL,
    template_text_hash      TEXT NOT NULL,

    -- Provenance
    source_file             TEXT,
    doctrine_version        TEXT NOT NULL,
    tags                    TEXT[] NOT NULL DEFAULT '{}',

    -- Lifecycle
    status                  TEXT NOT NULL DEFAULT 'DRAFT'
                            CHECK (status IN ('DRAFT', 'ACTIVE', 'DEPRECATED')),
    deprecated_by           UUID,
    deprecation_reason      TEXT,

    -- Audit
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by              TEXT NOT NULL DEFAULT current_user,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by              TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT chk_orbt_modes CHECK (
        orbt_modes <@ ARRAY['operate', 'repair', 'build', 'troubleshoot', 'train']::TEXT[]
    ),
    CONSTRAINT chk_deprecated_reason CHECK (
        (status = 'DEPRECATED' AND deprecation_reason IS NOT NULL)
        OR status != 'DEPRECATED'
    )
);

COMMENT ON TABLE psb.prompt_registry IS 'CONFIG — Master prompt registry for the Prompt and Skills Bay. Versioned, searchable, Transformation Law compliant.';
COMMENT ON COLUMN psb.prompt_registry.prompt_id IS 'Unique prompt identifier (UUID)';
COMMENT ON COLUMN psb.prompt_registry.slug IS 'URL-safe unique identifier for human reference';
COMMENT ON COLUMN psb.prompt_registry.transformation_statement IS 'Transformation Law statement: "This transforms X constants into Y variables"';
COMMENT ON COLUMN psb.prompt_registry.constants_declared IS 'Array of declared constants this prompt operates on';
COMMENT ON COLUMN psb.prompt_registry.variables_produced IS 'Array of declared variables this prompt produces';
COMMENT ON COLUMN psb.prompt_registry.cc_layer IS 'Canonical Chain layer: CC-01 through CC-04';
COMMENT ON COLUMN psb.prompt_registry.orbt_modes IS 'Applicable ORBT modes: operate, repair, build, troubleshoot, train';
COMMENT ON COLUMN psb.prompt_registry.category IS 'Prompt category: intake, enforcement, regeneration, migration, declaration, projection, auxiliary';
COMMENT ON COLUMN psb.prompt_registry.template_text IS 'The full prompt template text';
COMMENT ON COLUMN psb.prompt_registry.template_text_hash IS 'SHA-256 hash of template_text for integrity verification';
COMMENT ON COLUMN psb.prompt_registry.source_file IS 'Source file path if migrated from markdown (e.g., templates/claude/DBA_ENFORCEMENT.prompt.md)';
COMMENT ON COLUMN psb.prompt_registry.doctrine_version IS 'Doctrine version at time of registration';
COMMENT ON COLUMN psb.prompt_registry.status IS 'DRAFT (not yet certified), ACTIVE (certified and available), DEPRECATED (replaced or retired)';

CREATE INDEX IF NOT EXISTS idx_prompt_registry_status
    ON psb.prompt_registry (status);

CREATE INDEX IF NOT EXISTS idx_prompt_registry_cc_layer
    ON psb.prompt_registry (cc_layer);

CREATE INDEX IF NOT EXISTS idx_prompt_registry_category
    ON psb.prompt_registry (category);

CREATE INDEX IF NOT EXISTS idx_prompt_registry_tags
    ON psb.prompt_registry USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_prompt_registry_orbt
    ON psb.prompt_registry USING GIN (orbt_modes);

CREATE INDEX IF NOT EXISTS idx_prompt_registry_constants
    ON psb.prompt_registry USING GIN (constants_declared);

CREATE INDEX IF NOT EXISTS idx_prompt_registry_variables
    ON psb.prompt_registry USING GIN (variables_produced);

-- ───────────────────────────────────────────────────────────────────
-- TABLE: psb.prompt_versions (EVENT)
-- Immutable version history. INSERT-only. Every version change
-- to a prompt is recorded here with the full text hash.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS psb.prompt_versions (
    version_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id               UUID NOT NULL REFERENCES psb.prompt_registry (prompt_id),
    version_number          TEXT NOT NULL,
    template_text_hash      TEXT NOT NULL,
    change_description      TEXT NOT NULL,
    adr_reference           TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by              TEXT NOT NULL DEFAULT current_user
);

COMMENT ON TABLE psb.prompt_versions IS 'EVENT — Immutable version history for prompts. INSERT-only. Never UPDATE or DELETE.';
COMMENT ON COLUMN psb.prompt_versions.version_id IS 'Unique version record identifier';
COMMENT ON COLUMN psb.prompt_versions.prompt_id IS 'FK to psb.prompt_registry';
COMMENT ON COLUMN psb.prompt_versions.version_number IS 'Semantic version at this point in history';
COMMENT ON COLUMN psb.prompt_versions.template_text_hash IS 'SHA-256 hash of template_text at this version';
COMMENT ON COLUMN psb.prompt_versions.change_description IS 'What changed in this version';
COMMENT ON COLUMN psb.prompt_versions.adr_reference IS 'ADR ID if this was a structural change (e.g., ADR-023)';

CREATE INDEX IF NOT EXISTS idx_prompt_versions_prompt
    ON psb.prompt_versions (prompt_id);

CREATE INDEX IF NOT EXISTS idx_prompt_versions_created
    ON psb.prompt_versions (created_at);

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Prompt version immutability
-- EVENT tables are INSERT-only. No UPDATE, no DELETE.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.enforce_prompt_version_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PSB_VERSION_IMMUTABILITY: DELETE on psb.prompt_versions is not allowed. '
                        'Version history is permanent. '
                        'Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part IV (EVENT classification)';
    END IF;

    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'PSB_VERSION_IMMUTABILITY: UPDATE on psb.prompt_versions is not allowed. '
                        'Version history is immutable after insertion. '
                        'Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part IV (EVENT classification)';
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION psb.enforce_prompt_version_immutability() IS 'Enforces INSERT-only on prompt version history (EVENT classification)';

DROP TRIGGER IF EXISTS trg_prompt_version_immutability ON psb.prompt_versions;
CREATE TRIGGER trg_prompt_version_immutability
    BEFORE UPDATE OR DELETE ON psb.prompt_versions
    FOR EACH ROW EXECUTE FUNCTION psb.enforce_prompt_version_immutability();

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Prompt status transition enforcement
-- DRAFT → ACTIVE → DEPRECATED only. No backward movement.
-- No physical DELETE on prompt_registry.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.enforce_prompt_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PSB_PROMPT_IMMUTABILITY: DELETE on psb.prompt_registry is not allowed. '
                        'Use status = DEPRECATED instead. '
                        'Doctrine: ADR-023';
    END IF;

    IF TG_OP = 'UPDATE' THEN
        -- Status transitions: DRAFT → ACTIVE, DRAFT → DEPRECATED, ACTIVE → DEPRECATED
        IF OLD.status = 'DEPRECATED' THEN
            RAISE EXCEPTION 'PSB_PROMPT_STATUS: Prompt % is DEPRECATED and cannot be modified. '
                            'Doctrine: ADR-023',
                            OLD.prompt_id;
        END IF;

        IF OLD.status = 'ACTIVE' AND NEW.status = 'DRAFT' THEN
            RAISE EXCEPTION 'PSB_PROMPT_STATUS: Cannot transition from ACTIVE back to DRAFT. '
                            'Status transitions are forward-only: DRAFT → ACTIVE → DEPRECATED. '
                            'Doctrine: ADR-023';
        END IF;

        -- Auto-update updated_at
        NEW.updated_at := now();
        NEW.updated_by := current_user;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION psb.enforce_prompt_status_transition() IS 'Enforces forward-only status transitions and prevents DELETE on prompt_registry';

DROP TRIGGER IF EXISTS trg_prompt_status ON psb.prompt_registry;
CREATE TRIGGER trg_prompt_status
    BEFORE UPDATE OR DELETE ON psb.prompt_registry
    FOR EACH ROW EXECUTE FUNCTION psb.enforce_prompt_status_transition();

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Auto-create version record on prompt insert/update
-- Every change to a prompt creates an immutable version record.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.auto_version_prompt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO psb.prompt_versions (prompt_id, version_number, template_text_hash, change_description)
        VALUES (NEW.prompt_id, NEW.version, NEW.template_text_hash, 'Initial registration');
    ELSIF TG_OP = 'UPDATE' AND OLD.template_text_hash != NEW.template_text_hash THEN
        INSERT INTO psb.prompt_versions (prompt_id, version_number, template_text_hash, change_description)
        VALUES (NEW.prompt_id, NEW.version, NEW.template_text_hash, 'Version update: content changed');
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO psb.prompt_versions (prompt_id, version_number, template_text_hash, change_description)
        VALUES (NEW.prompt_id, NEW.version, NEW.template_text_hash, 'Status transition: ' || OLD.status || ' → ' || NEW.status);
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION psb.auto_version_prompt() IS 'Auto-creates version record on prompt insert or content/status change';

DROP TRIGGER IF EXISTS trg_auto_version_prompt ON psb.prompt_registry;
CREATE TRIGGER trg_auto_version_prompt
    AFTER INSERT OR UPDATE ON psb.prompt_registry
    FOR EACH ROW EXECUTE FUNCTION psb.auto_version_prompt();

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP TRIGGER IF EXISTS trg_auto_version_prompt ON psb.prompt_registry;
-- DROP FUNCTION IF EXISTS psb.auto_version_prompt();
-- DROP TRIGGER IF EXISTS trg_prompt_status ON psb.prompt_registry;
-- DROP FUNCTION IF EXISTS psb.enforce_prompt_status_transition();
-- DROP TRIGGER IF EXISTS trg_prompt_version_immutability ON psb.prompt_versions;
-- DROP FUNCTION IF EXISTS psb.enforce_prompt_version_immutability();
-- DROP TABLE IF EXISTS psb.prompt_versions;
-- DROP TABLE IF EXISTS psb.prompt_registry;
-- DROP SCHEMA IF EXISTS psb;
