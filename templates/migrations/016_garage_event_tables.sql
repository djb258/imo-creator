-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 016: Garage Event Tables
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (CC-01 Sovereign)
-- Schema: garage
-- Classification: All tables are EVENT (INSERT-only, immutable)
-- Taxonomy: taxonomy_registry.json — NOT CTB leaf_types (child-repo only)
-- Column Registry: templates/child/garage_column_registry.yml v1.0.0
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- TABLES:
--   1. garage.error_log           — Pipeline fault record
--   2. garage.execution_log       — Pipeline execution record
--   3. garage.certification_log   — Certification issuance record
--
-- IMMUTABILITY:
--   All 3 tables are INSERT-only. UPDATE and DELETE are blocked by trigger.
--   Per taxonomy_registry.json: EVENT = "INSERT-only. Never UPDATE or DELETE."
--
-- VIEWS:
--   1. garage.errors_recent       — Last 30 days of errors
--   2. garage.executions_summary  — Executions with duration and outcome
--   3. garage.certifications_valid — PASS certifications only
--   4. garage.pipeline_health     — Aggregated pass/fail rates per repo
--
-- ═══════════════════════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- SCHEMA
-- ---------------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS garage;

-- ---------------------------------------------------------------------------
-- ENUM-LIKE CONSTRAINTS (using CHECK, not CREATE TYPE — avoids migration pain)
-- ---------------------------------------------------------------------------
-- pipeline_stage: intent, plan, mount, db_validation, execute, collect, audit, sanitation, certify, validate, merge
-- failure_type: planner_halt, mount_failure, db_validation_failure, scope_violation, audit_fail_execution, audit_fail_scope, sanitation_fail, certification_fail
-- severity: BLOCKING, HIGH, MEDIUM, LOW
-- execution_type: audit, refactor, build, migrate
-- change_type: feature, architectural, refactor, fix
-- orbt_mode: operate, repair, build, troubleshoot, train
-- audit_classification: PASS, FAIL_EXECUTION, FAIL_SCOPE
-- certification_status / audit_status: PASS, FAIL

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 1: garage.error_log (EVENT)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE garage.error_log (
    error_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_packet_id      TEXT,
    target_repo         TEXT,
    pipeline_stage      TEXT NOT NULL
        CHECK (pipeline_stage IN (
            'intent','plan','mount','db_validation','execute',
            'collect','audit','sanitation','certify','validate'
        )),
    failure_type        TEXT NOT NULL
        CHECK (failure_type IN (
            'planner_halt','mount_failure','db_validation_failure',
            'scope_violation','audit_fail_execution','audit_fail_scope',
            'sanitation_fail','certification_fail'
        )),
    error_message       TEXT NOT NULL,
    error_details       TEXT,
    rule_id             TEXT,
    severity            TEXT NOT NULL
        CHECK (severity IN ('BLOCKING','HIGH','MEDIUM','LOW')),
    doctrine_version    TEXT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE garage.error_log IS 'EVENT (INSERT-only) — Pipeline fault record. One row per error occurrence.';

-- Indexes
CREATE INDEX idx_error_log_created_at ON garage.error_log (created_at DESC);
CREATE INDEX idx_error_log_target_repo ON garage.error_log (target_repo) WHERE target_repo IS NOT NULL;
CREATE INDEX idx_error_log_work_packet ON garage.error_log (work_packet_id) WHERE work_packet_id IS NOT NULL;
CREATE INDEX idx_error_log_severity ON garage.error_log (severity);
CREATE INDEX idx_error_log_failure_type ON garage.error_log (failure_type);
CREATE INDEX idx_error_log_pipeline_stage ON garage.error_log (pipeline_stage);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 2: garage.execution_log (EVENT)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE garage.execution_log (
    execution_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_packet_id          TEXT NOT NULL,
    target_repo             TEXT NOT NULL,
    execution_type          TEXT NOT NULL
        CHECK (execution_type IN ('audit','refactor','build','migrate')),
    change_type             TEXT NOT NULL
        CHECK (change_type IN ('feature','architectural','refactor','fix')),
    orbt_mode               TEXT NOT NULL
        CHECK (orbt_mode IN ('operate','repair','build','troubleshoot','train')),
    summary                 TEXT NOT NULL,
    pipeline_stage_reached  TEXT NOT NULL
        CHECK (pipeline_stage_reached IN (
            'intent','plan','mount','db_validation','execute',
            'collect','audit','sanitation','certify','validate','merge'
        )),
    audit_classification    TEXT
        CHECK (audit_classification IS NULL OR audit_classification IN ('PASS','FAIL_EXECUTION','FAIL_SCOPE')),
    certification_status    TEXT
        CHECK (certification_status IS NULL OR certification_status IN ('PASS','FAIL')),
    architectural_flag      BOOLEAN NOT NULL,
    db_required             BOOLEAN NOT NULL,
    ui_required             BOOLEAN NOT NULL,
    doctrine_version        TEXT NOT NULL,
    started_at              TIMESTAMPTZ NOT NULL,
    completed_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE garage.execution_log IS 'EVENT (INSERT-only) — Pipeline execution record. One row per completed pipeline run.';

-- Indexes
CREATE INDEX idx_execution_log_completed_at ON garage.execution_log (completed_at DESC);
CREATE INDEX idx_execution_log_target_repo ON garage.execution_log (target_repo);
CREATE INDEX idx_execution_log_work_packet ON garage.execution_log (work_packet_id);
CREATE INDEX idx_execution_log_execution_type ON garage.execution_log (execution_type);
CREATE INDEX idx_execution_log_audit_class ON garage.execution_log (audit_classification) WHERE audit_classification IS NOT NULL;
CREATE INDEX idx_execution_log_cert_status ON garage.execution_log (certification_status) WHERE certification_status IS NOT NULL;
CREATE INDEX idx_execution_log_stage_reached ON garage.execution_log (pipeline_stage_reached);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE 3: garage.certification_log (EVENT)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE garage.certification_log (
    certification_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_packet_id      TEXT NOT NULL,
    target_repo         TEXT NOT NULL,
    doctrine_version    TEXT NOT NULL,
    audit_status        TEXT NOT NULL
        CHECK (audit_status IN ('PASS','FAIL')),
    sanitation_passed   BOOLEAN NOT NULL,
    heir_valid          BOOLEAN NOT NULL,
    auditor_signature   TEXT NOT NULL,
    artifact_hash       TEXT NOT NULL,
    failure_reasons     TEXT[] NOT NULL DEFAULT '{}',
    capa_required       BOOLEAN,
    certified_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE garage.certification_log IS 'EVENT (INSERT-only) — Certification issuance record. One row per certification.';

-- Indexes
CREATE INDEX idx_certification_log_certified_at ON garage.certification_log (certified_at DESC);
CREATE INDEX idx_certification_log_target_repo ON garage.certification_log (target_repo);
CREATE INDEX idx_certification_log_work_packet ON garage.certification_log (work_packet_id);
CREATE INDEX idx_certification_log_audit_status ON garage.certification_log (audit_status);
CREATE INDEX idx_certification_log_capa ON garage.certification_log (capa_required) WHERE capa_required = true;

-- ═══════════════════════════════════════════════════════════════════════════════
-- IMMUTABILITY TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════
-- EVENT tables are INSERT-only. No UPDATE, no DELETE. Period.
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION garage.reject_event_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION
        'EVENT table %.% is INSERT-only. % operations are forbidden. '
        'Per taxonomy_registry.json: EVENT = "INSERT-only. Never UPDATE or DELETE."',
        TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- error_log: block UPDATE and DELETE
CREATE TRIGGER trg_error_log_no_update
    BEFORE UPDATE ON garage.error_log
    FOR EACH ROW EXECUTE FUNCTION garage.reject_event_mutation();

CREATE TRIGGER trg_error_log_no_delete
    BEFORE DELETE ON garage.error_log
    FOR EACH ROW EXECUTE FUNCTION garage.reject_event_mutation();

-- execution_log: block UPDATE and DELETE
CREATE TRIGGER trg_execution_log_no_update
    BEFORE UPDATE ON garage.execution_log
    FOR EACH ROW EXECUTE FUNCTION garage.reject_event_mutation();

CREATE TRIGGER trg_execution_log_no_delete
    BEFORE DELETE ON garage.execution_log
    FOR EACH ROW EXECUTE FUNCTION garage.reject_event_mutation();

-- certification_log: block UPDATE and DELETE
CREATE TRIGGER trg_certification_log_no_update
    BEFORE UPDATE ON garage.certification_log
    FOR EACH ROW EXECUTE FUNCTION garage.reject_event_mutation();

CREATE TRIGGER trg_certification_log_no_delete
    BEFORE DELETE ON garage.certification_log
    FOR EACH ROW EXECUTE FUNCTION garage.reject_event_mutation();

-- ═══════════════════════════════════════════════════════════════════════════════
-- EGRESS VIEWS (read-only, no logic — IMO O-layer)
-- ═══════════════════════════════════════════════════════════════════════════════

-- View 1: Recent errors (last 30 days)
CREATE OR REPLACE VIEW garage.errors_recent AS
SELECT
    error_id,
    work_packet_id,
    target_repo,
    pipeline_stage,
    failure_type,
    error_message,
    rule_id,
    severity,
    doctrine_version,
    created_at
FROM garage.error_log
WHERE created_at >= now() - INTERVAL '30 days'
ORDER BY created_at DESC;

COMMENT ON VIEW garage.errors_recent IS 'Egress view — errors from the last 30 days, most recent first.';

-- View 2: Execution summary with duration
CREATE OR REPLACE VIEW garage.executions_summary AS
SELECT
    execution_id,
    work_packet_id,
    target_repo,
    execution_type,
    change_type,
    orbt_mode,
    summary,
    pipeline_stage_reached,
    audit_classification,
    certification_status,
    architectural_flag,
    db_required,
    ui_required,
    doctrine_version,
    started_at,
    completed_at,
    EXTRACT(EPOCH FROM (completed_at - started_at)) AS duration_seconds
FROM garage.execution_log
ORDER BY completed_at DESC;

COMMENT ON VIEW garage.executions_summary IS 'Egress view — all executions with computed duration in seconds.';

-- View 3: Valid certifications (PASS only)
CREATE OR REPLACE VIEW garage.certifications_valid AS
SELECT
    certification_id,
    work_packet_id,
    target_repo,
    doctrine_version,
    sanitation_passed,
    heir_valid,
    auditor_signature,
    artifact_hash,
    capa_required,
    certified_at
FROM garage.certification_log
WHERE audit_status = 'PASS'
ORDER BY certified_at DESC;

COMMENT ON VIEW garage.certifications_valid IS 'Egress view — only PASS certifications. The merge-eligible set.';

-- View 4: Pipeline health aggregation per repo
CREATE OR REPLACE VIEW garage.pipeline_health AS
SELECT
    target_repo,
    COUNT(*) AS total_executions,
    COUNT(*) FILTER (WHERE certification_status = 'PASS') AS certified_pass,
    COUNT(*) FILTER (WHERE certification_status = 'FAIL') AS certified_fail,
    COUNT(*) FILTER (WHERE certification_status IS NULL) AS did_not_reach_certification,
    COUNT(*) FILTER (WHERE audit_classification = 'PASS') AS audit_pass,
    COUNT(*) FILTER (WHERE audit_classification = 'FAIL_EXECUTION') AS audit_fail_execution,
    COUNT(*) FILTER (WHERE audit_classification = 'FAIL_SCOPE') AS audit_fail_scope,
    COUNT(*) FILTER (WHERE audit_classification IS NULL) AS did_not_reach_audit,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE certification_status = 'PASS') / NULLIF(COUNT(*), 0),
        1
    ) AS certification_pass_rate_pct,
    MIN(completed_at) AS first_execution,
    MAX(completed_at) AS last_execution
FROM garage.execution_log
GROUP BY target_repo
ORDER BY target_repo;

COMMENT ON VIEW garage.pipeline_health IS 'Egress view — aggregated pass/fail rates per repo. The fleet health dashboard.';

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES (for post-deployment)
-- ═══════════════════════════════════════════════════════════════════════════════
-- SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'garage';
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'garage' AND table_type = 'BASE TABLE';
-- SELECT table_name FROM information_schema.views WHERE table_schema = 'garage';
-- SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'garage';
-- ═══════════════════════════════════════════════════════════════════════════════
