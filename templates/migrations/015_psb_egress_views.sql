-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 015: PSB Egress Views
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Read-only egress views for the PSB libraries. These are the ONLY
--          query surfaces for downstream consumers. No logic in egress — views
--          filter and join, nothing more.
-- Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part III (IMO — Egress: read-only)
-- Depends: 012_psb_prompt_registry.sql, 013_psb_reverse_prompt_index.sql,
--          014_psb_skill_registry.sql
-- Idempotent: YES (CREATE OR REPLACE)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- VIEW: psb.prompts_active
-- Active prompts only. The primary query surface for prompt lookup.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW psb.prompts_active AS
SELECT
    prompt_id,
    slug,
    title,
    description,
    version,
    transformation_statement,
    constants_declared,
    variables_produced,
    cc_layer,
    orbt_modes,
    category,
    template_text,
    template_text_hash,
    source_file,
    doctrine_version,
    tags,
    created_at,
    updated_at
FROM psb.prompt_registry
WHERE status = 'ACTIVE';

COMMENT ON VIEW psb.prompts_active IS 'EGRESS — Active prompts only. Primary query surface for the Prompt Library.';

-- ───────────────────────────────────────────────────────────────────
-- VIEW: psb.reverse_lookup
-- Joined reverse index with prompt details. The primary query
-- surface for "I want output X, what prompt produces it?"
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW psb.reverse_lookup AS
SELECT
    ri.reverse_id,
    ri.desired_output_description,
    ri.transformation_target,
    ri.output_category,
    ri.cc_layer_filter,
    ri.orbt_mode_filter,
    ri.usage_notes,
    ri.prerequisites,
    ri.produces_artifacts,
    ri.tags AS reverse_tags,
    ri.search_keywords,
    -- Prompt details
    p.prompt_id,
    p.slug AS prompt_slug,
    p.title AS prompt_title,
    p.version AS prompt_version,
    p.transformation_statement AS prompt_transformation,
    p.cc_layer AS prompt_cc_layer,
    p.category AS prompt_category,
    p.template_text,
    p.tags AS prompt_tags
FROM psb.reverse_prompt_index ri
    JOIN psb.prompt_registry p ON ri.matching_prompt_id = p.prompt_id
WHERE ri.status = 'ACTIVE'
  AND p.status = 'ACTIVE';

COMMENT ON VIEW psb.reverse_lookup IS 'EGRESS — Reverse prompt lookup with full prompt details. Query: "I want to produce X" → matching prompt.';

-- ───────────────────────────────────────────────────────────────────
-- VIEW: psb.skills_active
-- Active skills only with binding counts.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW psb.skills_active AS
SELECT
    s.skill_id,
    s.slug,
    s.name,
    s.description,
    s.version,
    s.transformation_statement,
    s.constants_declared,
    s.variables_produced,
    s.agent_type,
    s.cc_layer,
    s.orbt_modes,
    s.input_contract_fields,
    s.output_contract_fields,
    s.input_description,
    s.output_description,
    s.depends_on_skills,
    s.source_file,
    s.doctrine_version,
    s.tags,
    s.doctrine_compliance,
    s.last_audit_date,
    s.created_at,
    s.updated_at,
    -- Binding summary
    (SELECT count(*) FROM psb.prompt_skill_binding b WHERE b.skill_id = s.skill_id) AS prompt_binding_count
FROM psb.skill_registry s
WHERE s.status = 'ACTIVE';

COMMENT ON VIEW psb.skills_active IS 'EGRESS — Active skills only with prompt binding counts. Primary query surface for the Skills Library.';

-- ───────────────────────────────────────────────────────────────────
-- VIEW: psb.skill_dependency_tree
-- Resolves skill dependencies one level deep. For full recursive
-- resolution, use the CTE function below.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW psb.skill_dependency_tree AS
SELECT
    s.skill_id,
    s.slug,
    s.name,
    s.version,
    s.agent_type,
    s.cc_layer,
    s.depends_on_skills,
    dep.skill_id AS dependency_skill_id,
    dep.slug AS dependency_slug,
    dep.name AS dependency_name,
    dep.version AS dependency_version,
    dep.status AS dependency_status
FROM psb.skill_registry s
    LEFT JOIN LATERAL unnest(s.depends_on_skills) AS dep_id ON true
    LEFT JOIN psb.skill_registry dep ON dep.skill_id = dep_id
WHERE s.status = 'ACTIVE';

COMMENT ON VIEW psb.skill_dependency_tree IS 'EGRESS — Skill dependency resolution (one level). Shows each skill with its direct dependencies.';

-- ───────────────────────────────────────────────────────────────────
-- VIEW: psb.prompt_skill_map
-- Full cross-reference: prompts ↔ skills with binding types.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW psb.prompt_skill_map AS
SELECT
    b.binding_id,
    b.binding_type,
    b.binding_description,
    -- Prompt side
    p.prompt_id,
    p.slug AS prompt_slug,
    p.title AS prompt_title,
    p.category AS prompt_category,
    p.cc_layer AS prompt_cc_layer,
    -- Skill side
    s.skill_id,
    s.slug AS skill_slug,
    s.name AS skill_name,
    s.agent_type AS skill_agent_type,
    s.cc_layer AS skill_cc_layer
FROM psb.prompt_skill_binding b
    JOIN psb.prompt_registry p ON b.prompt_id = p.prompt_id
    JOIN psb.skill_registry s ON b.skill_id = s.skill_id
WHERE p.status = 'ACTIVE'
  AND s.status = 'ACTIVE';

COMMENT ON VIEW psb.prompt_skill_map IS 'EGRESS — Full prompt-to-skill cross-reference with binding types.';

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Recursive skill dependency resolution
-- Returns the full dependency tree for a given skill.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION psb.resolve_skill_dependencies(p_skill_id UUID)
RETURNS TABLE (
    depth           INTEGER,
    skill_id        UUID,
    slug            TEXT,
    name            TEXT,
    version         TEXT,
    status          TEXT,
    agent_type      TEXT
)
LANGUAGE SQL
STABLE
SET search_path = psb, pg_catalog
AS $$
    WITH RECURSIVE dep_tree AS (
        -- Base: the skill itself
        SELECT
            0 AS depth,
            s.skill_id,
            s.slug,
            s.name,
            s.version,
            s.status,
            s.agent_type,
            s.depends_on_skills
        FROM psb.skill_registry s
        WHERE s.skill_id = p_skill_id

        UNION ALL

        -- Recursive: dependencies of dependencies
        SELECT
            dt.depth + 1,
            s.skill_id,
            s.slug,
            s.name,
            s.version,
            s.status,
            s.agent_type,
            s.depends_on_skills
        FROM dep_tree dt
            CROSS JOIN LATERAL unnest(dt.depends_on_skills) AS dep_id
            JOIN psb.skill_registry s ON s.skill_id = dep_id
        WHERE dt.depth < 10  -- Safety: max 10 levels deep
    )
    SELECT
        dep_tree.depth,
        dep_tree.skill_id,
        dep_tree.slug,
        dep_tree.name,
        dep_tree.version,
        dep_tree.status,
        dep_tree.agent_type
    FROM dep_tree
    ORDER BY dep_tree.depth, dep_tree.name;
$$;

COMMENT ON FUNCTION psb.resolve_skill_dependencies(UUID) IS 'Recursive CTE function: resolves full dependency tree for a skill (max 10 levels)';

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP FUNCTION IF EXISTS psb.resolve_skill_dependencies(UUID);
-- DROP VIEW IF EXISTS psb.prompt_skill_map;
-- DROP VIEW IF EXISTS psb.skill_dependency_tree;
-- DROP VIEW IF EXISTS psb.skills_active;
-- DROP VIEW IF EXISTS psb.reverse_lookup;
-- DROP VIEW IF EXISTS psb.prompts_active;
