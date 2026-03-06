-- Migration 001: Field Monitor Initial Schema
-- Work Packet: wp-20260305-field-monitor-phase1-bootstrap
-- Direction: FORWARD
--
-- Creates field_monitor schema with 5 tables:
--   url_registry, field_state, check_log, error_log, rate_state
-- Applies CTB promotion enforcement trigger on field_state.
-- Enforces: check_log append-only, error_log no-delete.

BEGIN;

-- ═══ SCHEMA ═══════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS field_monitor;

-- ═══ TABLE: url_registry ═══════════════════════════════════════
CREATE TABLE field_monitor.url_registry (
    url_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain              TEXT NOT NULL,
    path                TEXT NOT NULL,
    check_interval_minutes INTEGER NOT NULL DEFAULT 60,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (domain, path)
);

CREATE INDEX idx_url_registry_domain ON field_monitor.url_registry (domain);
CREATE INDEX idx_url_registry_active ON field_monitor.url_registry (is_active) WHERE is_active = true;

-- ═══ TABLE: field_state ═══════════════════════════════════════
CREATE TABLE field_monitor.field_state (
    field_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id              UUID NOT NULL REFERENCES field_monitor.url_registry(url_id),
    field_name          TEXT NOT NULL,
    current_value       TEXT,
    previous_value      TEXT,
    last_checked_at     TIMESTAMPTZ,
    last_changed_at     TIMESTAMPTZ,
    status              TEXT NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'STALE', 'ERROR', 'DISABLED')),
    promotion_status    TEXT NOT NULL DEFAULT 'DRAFT'
                        CHECK (promotion_status IN ('DRAFT', 'PROMOTED')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (url_id, field_name)
);

CREATE INDEX idx_field_state_url ON field_monitor.field_state (url_id);
CREATE INDEX idx_field_state_status ON field_monitor.field_state (status);
CREATE INDEX idx_field_state_promotion ON field_monitor.field_state (promotion_status);

-- ═══ CTB PROMOTION ENFORCEMENT TRIGGER ════════════════════════
-- Constitutional law: once promotion_status = 'PROMOTED', it cannot
-- be reverted to 'DRAFT'. Only forward promotion is allowed.
CREATE OR REPLACE FUNCTION field_monitor.enforce_ctb_promotion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.promotion_status = 'PROMOTED' AND NEW.promotion_status = 'DRAFT' THEN
        RAISE EXCEPTION 'CTB violation: cannot demote from PROMOTED to DRAFT (field_id=%)', OLD.field_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ctb_promotion_enforcement
    BEFORE UPDATE ON field_monitor.field_state
    FOR EACH ROW
    EXECUTE FUNCTION field_monitor.enforce_ctb_promotion();

-- ═══ TABLE: check_log (APPEND-ONLY) ══════════════════════════
CREATE TABLE field_monitor.check_log (
    log_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id              UUID NOT NULL REFERENCES field_monitor.url_registry(url_id),
    field_name          TEXT NOT NULL,
    checked_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    old_value           TEXT,
    new_value           TEXT,
    changed             BOOLEAN NOT NULL DEFAULT false,
    fetch_duration_ms   INTEGER NOT NULL DEFAULT 0,
    parse_duration_ms   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_check_log_url_field ON field_monitor.check_log (url_id, field_name);
CREATE INDEX idx_check_log_checked_at ON field_monitor.check_log (checked_at);
CREATE INDEX idx_check_log_changed ON field_monitor.check_log (changed) WHERE changed = true;

-- Append-only enforcement: no UPDATE or DELETE on check_log
CREATE OR REPLACE FUNCTION field_monitor.deny_check_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'check_log is append-only: % operations are prohibited', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_log_no_update
    BEFORE UPDATE ON field_monitor.check_log
    FOR EACH ROW
    EXECUTE FUNCTION field_monitor.deny_check_log_mutation();

CREATE TRIGGER trg_check_log_no_delete
    BEFORE DELETE ON field_monitor.check_log
    FOR EACH ROW
    EXECUTE FUNCTION field_monitor.deny_check_log_mutation();

-- ═══ TABLE: error_log (INSERT + UPDATE only, no DELETE) ═══════
CREATE TABLE field_monitor.error_log (
    error_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id              UUID NOT NULL REFERENCES field_monitor.url_registry(url_id),
    field_name          TEXT,
    error_type          TEXT NOT NULL,
    error_message       TEXT NOT NULL,
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at         TIMESTAMPTZ
);

CREATE INDEX idx_error_log_url ON field_monitor.error_log (url_id);
CREATE INDEX idx_error_log_unresolved ON field_monitor.error_log (resolved_at) WHERE resolved_at IS NULL;

-- No-delete enforcement on error_log
CREATE OR REPLACE FUNCTION field_monitor.deny_error_log_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'error_log does not allow DELETE operations';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_error_log_no_delete
    BEFORE DELETE ON field_monitor.error_log
    FOR EACH ROW
    EXECUTE FUNCTION field_monitor.deny_error_log_delete();

-- ═══ TABLE: rate_state ════════════════════════════════════════
CREATE TABLE field_monitor.rate_state (
    rate_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain              TEXT NOT NULL,
    window_start        TIMESTAMPTZ NOT NULL,
    window_end          TIMESTAMPTZ NOT NULL,
    request_count       INTEGER NOT NULL DEFAULT 0,
    max_requests        INTEGER NOT NULL DEFAULT 60,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (domain, window_start)
);

CREATE INDEX idx_rate_state_domain ON field_monitor.rate_state (domain);
CREATE INDEX idx_rate_state_window ON field_monitor.rate_state (window_start, window_end);

COMMIT;
