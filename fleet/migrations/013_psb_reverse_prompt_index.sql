-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 013: PSB Reverse Prompt Index
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Inverse lookup table for the Prompt Library. Given a desired output
--          or behavior (the variable), find the prompt (the constant) that
--          produces it. The Transformation Law running backward.
-- Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part XV, ADR-023
-- Depends: 012_psb_prompt_registry.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- TABLE: psb.reverse_prompt_index (CONFIG)
-- Output-first lookup: "I want to produce X" → "Use prompt Y"
-- Each row maps a desired output pattern to a matching prompt.
-- Multiple rows may reference the same prompt (one prompt can
-- produce different outputs). Multiple rows may describe the
-- same output (different phrasings of the same need).
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS psb.reverse_prompt_index (
    reverse_id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What you want to produce (the desired variable)
    desired_output_description  TEXT NOT NULL,
    transformation_target       TEXT NOT NULL,
    output_category             TEXT NOT NULL CHECK (output_category IN (
                                    'heir_record', 'prd', 'osam', 'erd',
                                    'execution_wiring', 'constants_block',
                                    'variables_block', 'column_registry',
                                    'audit_certification', 'work_packet',
                                    'changeset', 'hub_definition', 'other'
                                )),

    -- Filter criteria
    cc_layer_filter             TEXT CHECK (cc_layer_filter IS NULL OR cc_layer_filter IN (
                                    'CC-01', 'CC-02', 'CC-03', 'CC-04'
                                )),
    orbt_mode_filter            TEXT CHECK (orbt_mode_filter IS NULL OR orbt_mode_filter IN (
                                    'operate', 'repair', 'build', 'troubleshoot', 'train'
                                )),

    -- The matching prompt (the constant)
    matching_prompt_id          UUID NOT NULL REFERENCES psb.prompt_registry (prompt_id),
    matching_prompt_version     TEXT NOT NULL,

    -- Usage guidance
    usage_notes                 TEXT,
    prerequisites               TEXT[] NOT NULL DEFAULT '{}',
    produces_artifacts          TEXT[] NOT NULL DEFAULT '{}',

    -- Search metadata
    tags                        TEXT[] NOT NULL DEFAULT '{}',
    search_keywords             TEXT[] NOT NULL DEFAULT '{}',

    -- Lifecycle
    status                      TEXT NOT NULL DEFAULT 'ACTIVE'
                                CHECK (status IN ('ACTIVE', 'DEPRECATED')),

    -- Audit
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by                  TEXT NOT NULL DEFAULT current_user,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by                  TEXT NOT NULL DEFAULT current_user
);

COMMENT ON TABLE psb.reverse_prompt_index IS 'CONFIG — Reverse prompt lookup. Given a desired output (variable), find the prompt (constant) that produces it.';
COMMENT ON COLUMN psb.reverse_prompt_index.desired_output_description IS 'Human-readable description of the desired output';
COMMENT ON COLUMN psb.reverse_prompt_index.transformation_target IS 'The specific variable type this entry helps produce';
COMMENT ON COLUMN psb.reverse_prompt_index.output_category IS 'Category of the desired output: heir_record, prd, osam, erd, etc.';
COMMENT ON COLUMN psb.reverse_prompt_index.cc_layer_filter IS 'Optional CC layer filter — if set, this entry only applies at this layer';
COMMENT ON COLUMN psb.reverse_prompt_index.orbt_mode_filter IS 'Optional ORBT mode filter — if set, this entry only applies in this mode';
COMMENT ON COLUMN psb.reverse_prompt_index.matching_prompt_id IS 'FK to the prompt that produces this output';
COMMENT ON COLUMN psb.reverse_prompt_index.matching_prompt_version IS 'Version of the matching prompt this entry was validated against';
COMMENT ON COLUMN psb.reverse_prompt_index.usage_notes IS 'Guidance on how to use the matching prompt for this specific output';
COMMENT ON COLUMN psb.reverse_prompt_index.prerequisites IS 'What must exist before this prompt can be used (e.g., HEIR record, CTB placement)';
COMMENT ON COLUMN psb.reverse_prompt_index.produces_artifacts IS 'What artifacts this prompt produces when used for this output';
COMMENT ON COLUMN psb.reverse_prompt_index.search_keywords IS 'Additional keywords for full-text search matching';

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_output_category
    ON psb.reverse_prompt_index (output_category);

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_cc_layer
    ON psb.reverse_prompt_index (cc_layer_filter)
    WHERE cc_layer_filter IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_orbt
    ON psb.reverse_prompt_index (orbt_mode_filter)
    WHERE orbt_mode_filter IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_matching
    ON psb.reverse_prompt_index (matching_prompt_id);

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_status
    ON psb.reverse_prompt_index (status);

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_tags
    ON psb.reverse_prompt_index USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_keywords
    ON psb.reverse_prompt_index USING GIN (search_keywords);

CREATE INDEX IF NOT EXISTS idx_reverse_prompt_artifacts
    ON psb.reverse_prompt_index USING GIN (produces_artifacts);

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Prevent DELETE on reverse_prompt_index
-- Use status = DEPRECATED instead.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.enforce_reverse_prompt_no_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = psb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PSB_REVERSE_IMMUTABILITY: DELETE on psb.reverse_prompt_index is not allowed. '
                        'Use status = DEPRECATED instead. '
                        'Doctrine: ADR-023';
    END IF;

    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at := now();
        NEW.updated_by := current_user;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION psb.enforce_reverse_prompt_no_delete() IS 'Prevents physical DELETE on reverse_prompt_index — use DEPRECATED status';

DROP TRIGGER IF EXISTS trg_reverse_prompt_no_delete ON psb.reverse_prompt_index;
CREATE TRIGGER trg_reverse_prompt_no_delete
    BEFORE UPDATE OR DELETE ON psb.reverse_prompt_index
    FOR EACH ROW EXECUTE FUNCTION psb.enforce_reverse_prompt_no_delete();

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP TRIGGER IF EXISTS trg_reverse_prompt_no_delete ON psb.reverse_prompt_index;
-- DROP FUNCTION IF EXISTS psb.enforce_reverse_prompt_no_delete();
-- DROP TABLE IF EXISTS psb.reverse_prompt_index;
