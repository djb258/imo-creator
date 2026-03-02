-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 014: PSB Skill Registry
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Versioned skill library for the Prompt and Skills Bay. Every skill
--          is registered with input/output contracts, dependencies, and
--          Transformation Law metadata. Includes prompt-skill binding.
-- Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part XV, ADR-023
-- Depends: 012_psb_prompt_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- TABLE: psb.skill_registry (CONFIG)
-- Master registry for all skills. Each skill has declared input/output
-- contracts, dependencies, and a Transformation Law statement.
-- Status lifecycle: DRAFT → ACTIVE → DEPRECATED. No backward movement.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS psb.skill_registry (
    skill_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                    TEXT NOT NULL UNIQUE,
    name                    TEXT NOT NULL,
    description             TEXT NOT NULL,
    version                 TEXT NOT NULL DEFAULT '1.0.0',

    -- Transformation Law metadata
    transformation_statement TEXT NOT NULL,
    constants_declared      TEXT[] NOT NULL DEFAULT '{}',
    variables_produced      TEXT[] NOT NULL DEFAULT '{}',

    -- Classification
    agent_type              TEXT NOT NULL CHECK (agent_type IN (
                                'orchestrator', 'planner', 'worker', 'db_agent',
                                'auditor', 'refit_coordinator', 'general_purpose'
                            )),
    cc_layer                TEXT NOT NULL CHECK (cc_layer IN ('CC-01', 'CC-02', 'CC-03', 'CC-04')),
    orbt_modes              TEXT[] NOT NULL DEFAULT '{operate}',

    -- Contracts
    input_contract_fields   TEXT[] NOT NULL DEFAULT '{}',
    output_contract_fields  TEXT[] NOT NULL DEFAULT '{}',
    input_description       TEXT NOT NULL,
    output_description      TEXT NOT NULL,

    -- Dependencies
    depends_on_skills       UUID[] NOT NULL DEFAULT '{}',

    -- Source
    source_file             TEXT,
    source_hash             TEXT NOT NULL,
    doctrine_version        TEXT NOT NULL,
    tags                    TEXT[] NOT NULL DEFAULT '{}',

    -- Compliance
    doctrine_compliance     TEXT NOT NULL DEFAULT 'PENDING_AUDIT'
                            CHECK (doctrine_compliance IN (
                                'COMPLIANT', 'NON_COMPLIANT', 'PENDING_AUDIT'
                            )),
    last_audit_date         TIMESTAMPTZ,
    last_audit_result       TEXT,

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

    CONSTRAINT chk_skill_orbt_modes CHECK (
        orbt_modes <@ ARRAY['operate', 'repair', 'build', 'troubleshoot', 'train']::TEXT[]
    ),
    CONSTRAINT chk_skill_deprecated_reason CHECK (
        (status = 'DEPRECATED' AND deprecation_reason IS NOT NULL)
        OR status != 'DEPRECATED'
    )
);

COMMENT ON TABLE psb.skill_registry IS 'CONFIG — Master skill registry for the Prompt and Skills Bay. Versioned skills with input/output contracts.';
COMMENT ON COLUMN psb.skill_registry.skill_id IS 'Unique skill identifier (UUID)';
COMMENT ON COLUMN psb.skill_registry.slug IS 'URL-safe unique identifier for human reference';
COMMENT ON COLUMN psb.skill_registry.agent_type IS 'Which agent type this skill is designed for';
COMMENT ON COLUMN psb.skill_registry.input_contract_fields IS 'Declared input fields this skill expects';
COMMENT ON COLUMN psb.skill_registry.output_contract_fields IS 'Declared output fields this skill produces';
COMMENT ON COLUMN psb.skill_registry.input_description IS 'Human-readable description of what this skill expects as input';
COMMENT ON COLUMN psb.skill_registry.output_description IS 'Human-readable description of what this skill produces as output';
COMMENT ON COLUMN psb.skill_registry.depends_on_skills IS 'Array of skill_ids this skill depends on';
COMMENT ON COLUMN psb.skill_registry.source_file IS 'Source file path (e.g., ai/agents/worker/master_prompt.md or .claude/agents/garage-worker-parallel.md)';
COMMENT ON COLUMN psb.skill_registry.source_hash IS 'SHA-256 hash of the source file for integrity verification';
COMMENT ON COLUMN psb.skill_registry.doctrine_compliance IS 'COMPLIANT (passed audit), NON_COMPLIANT (failed audit), PENDING_AUDIT (not yet audited)';

CREATE INDEX IF NOT EXISTS idx_skill_registry_status
    ON psb.skill_registry (status);

CREATE INDEX IF NOT EXISTS idx_skill_registry_agent_type
    ON psb.skill_registry (agent_type);

CREATE INDEX IF NOT EXISTS idx_skill_registry_cc_layer
    ON psb.skill_registry (cc_layer);

CREATE INDEX IF NOT EXISTS idx_skill_registry_compliance
    ON psb.skill_registry (doctrine_compliance);

CREATE INDEX IF NOT EXISTS idx_skill_registry_tags
    ON psb.skill_registry USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_skill_registry_orbt
    ON psb.skill_registry USING GIN (orbt_modes);

CREATE INDEX IF NOT EXISTS idx_skill_registry_deps
    ON psb.skill_registry USING GIN (depends_on_skills);

-- ───────────────────────────────────────────────────────────────────
-- TABLE: psb.skill_versions (EVENT)
-- Immutable version history. INSERT-only.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS psb.skill_versions (
    version_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id                UUID NOT NULL REFERENCES psb.skill_registry (skill_id),
    version_number          TEXT NOT NULL,
    source_hash             TEXT NOT NULL,
    change_description      TEXT NOT NULL,
    adr_reference           TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by              TEXT NOT NULL DEFAULT current_user
);

COMMENT ON TABLE psb.skill_versions IS 'EVENT — Immutable version history for skills. INSERT-only. Never UPDATE or DELETE.';
COMMENT ON COLUMN psb.skill_versions.version_id IS 'Unique version record identifier';
COMMENT ON COLUMN psb.skill_versions.skill_id IS 'FK to psb.skill_registry';
COMMENT ON COLUMN psb.skill_versions.version_number IS 'Semantic version at this point in history';
COMMENT ON COLUMN psb.skill_versions.source_hash IS 'SHA-256 hash of skill source at this version';
COMMENT ON COLUMN psb.skill_versions.change_description IS 'What changed in this version';

CREATE INDEX IF NOT EXISTS idx_skill_versions_skill
    ON psb.skill_versions (skill_id);

CREATE INDEX IF NOT EXISTS idx_skill_versions_created
    ON psb.skill_versions (created_at);

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Skill version immutability
-- EVENT tables are INSERT-only.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.enforce_skill_version_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PSB_SKILL_VERSION_IMMUTABILITY: DELETE on psb.skill_versions is not allowed. '
                        'Version history is permanent. '
                        'Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part IV (EVENT classification)';
    END IF;

    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'PSB_SKILL_VERSION_IMMUTABILITY: UPDATE on psb.skill_versions is not allowed. '
                        'Version history is immutable after insertion. '
                        'Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part IV (EVENT classification)';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_skill_version_immutability ON psb.skill_versions;
CREATE TRIGGER trg_skill_version_immutability
    BEFORE UPDATE OR DELETE ON psb.skill_versions
    FOR EACH ROW EXECUTE FUNCTION psb.enforce_skill_version_immutability();

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Skill status transition enforcement
-- Same rules as prompt_registry: forward-only, no DELETE.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.enforce_skill_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PSB_SKILL_IMMUTABILITY: DELETE on psb.skill_registry is not allowed. '
                        'Use status = DEPRECATED instead. '
                        'Doctrine: ADR-023';
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'DEPRECATED' THEN
            RAISE EXCEPTION 'PSB_SKILL_STATUS: Skill % is DEPRECATED and cannot be modified. '
                            'Doctrine: ADR-023',
                            OLD.skill_id;
        END IF;

        IF OLD.status = 'ACTIVE' AND NEW.status = 'DRAFT' THEN
            RAISE EXCEPTION 'PSB_SKILL_STATUS: Cannot transition from ACTIVE back to DRAFT. '
                            'Status transitions are forward-only: DRAFT → ACTIVE → DEPRECATED. '
                            'Doctrine: ADR-023';
        END IF;

        NEW.updated_at := now();
        NEW.updated_by := current_user;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_skill_status ON psb.skill_registry;
CREATE TRIGGER trg_skill_status
    BEFORE UPDATE OR DELETE ON psb.skill_registry
    FOR EACH ROW EXECUTE FUNCTION psb.enforce_skill_status_transition();

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Auto-create version record on skill insert/update
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.auto_version_skill()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO psb.skill_versions (skill_id, version_number, source_hash, change_description)
        VALUES (NEW.skill_id, NEW.version, NEW.source_hash, 'Initial registration');
    ELSIF TG_OP = 'UPDATE' AND OLD.source_hash != NEW.source_hash THEN
        INSERT INTO psb.skill_versions (skill_id, version_number, source_hash, change_description)
        VALUES (NEW.skill_id, NEW.version, NEW.source_hash, 'Version update: source changed');
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO psb.skill_versions (skill_id, version_number, source_hash, change_description)
        VALUES (NEW.skill_id, NEW.version, NEW.source_hash, 'Status transition: ' || OLD.status || ' → ' || NEW.status);
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_version_skill ON psb.skill_registry;
CREATE TRIGGER trg_auto_version_skill
    AFTER INSERT OR UPDATE ON psb.skill_registry
    FOR EACH ROW EXECUTE FUNCTION psb.auto_version_skill();

-- ───────────────────────────────────────────────────────────────────
-- TABLE: psb.prompt_skill_binding (CONFIG)
-- Cross-reference table: which skills use which prompts.
-- Binding types define the relationship direction.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS psb.prompt_skill_binding (
    binding_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id               UUID NOT NULL REFERENCES psb.prompt_registry (prompt_id),
    skill_id                UUID NOT NULL REFERENCES psb.skill_registry (skill_id),
    binding_type            TEXT NOT NULL CHECK (binding_type IN (
                                'REQUIRES',   -- Skill requires this prompt to function
                                'PRODUCES',   -- Skill produces output that feeds this prompt
                                'CONSUMES'    -- Skill consumes output of this prompt
                            )),
    binding_description     TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by              TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT uq_prompt_skill_binding UNIQUE (prompt_id, skill_id, binding_type)
);

COMMENT ON TABLE psb.prompt_skill_binding IS 'CONFIG — Cross-reference: which skills use which prompts and how.';
COMMENT ON COLUMN psb.prompt_skill_binding.binding_type IS 'REQUIRES: skill needs this prompt. PRODUCES: skill output feeds this prompt. CONSUMES: skill uses this prompt output.';

CREATE INDEX IF NOT EXISTS idx_binding_prompt
    ON psb.prompt_skill_binding (prompt_id);

CREATE INDEX IF NOT EXISTS idx_binding_skill
    ON psb.prompt_skill_binding (skill_id);

CREATE INDEX IF NOT EXISTS idx_binding_type
    ON psb.prompt_skill_binding (binding_type);

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP TABLE IF EXISTS psb.prompt_skill_binding;
-- DROP TRIGGER IF EXISTS trg_auto_version_skill ON psb.skill_registry;
-- DROP FUNCTION IF EXISTS psb.auto_version_skill();
-- DROP TRIGGER IF EXISTS trg_skill_status ON psb.skill_registry;
-- DROP FUNCTION IF EXISTS psb.enforce_skill_status_transition();
-- DROP TRIGGER IF EXISTS trg_skill_version_immutability ON psb.skill_versions;
-- DROP FUNCTION IF EXISTS psb.enforce_skill_version_immutability();
-- DROP TABLE IF EXISTS psb.skill_versions;
-- DROP TABLE IF EXISTS psb.skill_registry;
