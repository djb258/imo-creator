-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 001: CTB Table Registry
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Create ctb schema, table_registry, and audit log
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §4.1
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- SCHEMA
-- ───────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS ctb;

COMMENT ON SCHEMA ctb IS 'CTB governance schema — table registry, enforcement triggers, audit log';

-- ───────────────────────────────────────────────────────────────────
-- TABLE: ctb.table_registry
-- The canonical runtime registry of all allowed tables.
-- Every table that may exist in this database MUST have a row here.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ctb.table_registry (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_schema            TEXT NOT NULL DEFAULT 'public',
    table_name              TEXT NOT NULL,
    hub_id                  TEXT NOT NULL,
    subhub_id               TEXT NOT NULL,
    leaf_type               TEXT NOT NULL CHECK (leaf_type IN ('CANONICAL', 'ERROR', 'STAGING', 'MV', 'REGISTRY')),
    is_frozen               BOOLEAN NOT NULL DEFAULT false,
    blueprint_version_hash  TEXT,
    description             TEXT,
    registered_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    registered_by           TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT uq_table_registry_table UNIQUE (table_schema, table_name)
);

COMMENT ON TABLE ctb.table_registry IS 'Runtime mirror of column_registry.yml — every allowed table must be registered here';
COMMENT ON COLUMN ctb.table_registry.leaf_type IS 'CANONICAL, ERROR, or SUPPORTING types (STAGING, MV, REGISTRY)';
COMMENT ON COLUMN ctb.table_registry.is_frozen IS 'When true, table structure cannot be altered';
COMMENT ON COLUMN ctb.table_registry.blueprint_version_hash IS 'Hash of column_registry.yml version for drift detection';

-- ───────────────────────────────────────────────────────────────────
-- INDEXES
-- ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_table_registry_lookup
    ON ctb.table_registry (table_schema, table_name);

CREATE INDEX IF NOT EXISTS idx_table_registry_hub
    ON ctb.table_registry (hub_id, subhub_id);

CREATE INDEX IF NOT EXISTS idx_table_registry_leaf
    ON ctb.table_registry (leaf_type);

-- ───────────────────────────────────────────────────────────────────
-- TABLE: ctb.registry_audit_log
-- Tracks all changes to the table_registry itself.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ctb.registry_audit_log (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operation       TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    table_schema    TEXT NOT NULL,
    table_name      TEXT NOT NULL,
    hub_id          TEXT,
    subhub_id       TEXT,
    leaf_type       TEXT,
    changed_by      TEXT NOT NULL DEFAULT current_user,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    old_values      JSONB,
    new_values      JSONB
);

COMMENT ON TABLE ctb.registry_audit_log IS 'Audit trail for all ctb.table_registry changes';

CREATE INDEX IF NOT EXISTS idx_registry_audit_table
    ON ctb.registry_audit_log (table_schema, table_name);

CREATE INDEX IF NOT EXISTS idx_registry_audit_time
    ON ctb.registry_audit_log (changed_at);

-- ───────────────────────────────────────────────────────────────────
-- TRIGGER: Audit log on table_registry changes
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.audit_registry_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO ctb.registry_audit_log (operation, table_schema, table_name, hub_id, subhub_id, leaf_type, new_values)
        VALUES ('INSERT', NEW.table_schema, NEW.table_name, NEW.hub_id, NEW.subhub_id, NEW.leaf_type,
                to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO ctb.registry_audit_log (operation, table_schema, table_name, hub_id, subhub_id, leaf_type, old_values, new_values)
        VALUES ('UPDATE', NEW.table_schema, NEW.table_name, NEW.hub_id, NEW.subhub_id, NEW.leaf_type,
                to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO ctb.registry_audit_log (operation, table_schema, table_name, hub_id, subhub_id, leaf_type, old_values)
        VALUES ('DELETE', OLD.table_schema, OLD.table_name, OLD.hub_id, OLD.subhub_id, OLD.leaf_type,
                to_jsonb(OLD));
        RETURN OLD;
    END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_registry ON ctb.table_registry;
CREATE TRIGGER trg_audit_registry
    AFTER INSERT OR UPDATE OR DELETE ON ctb.table_registry
    FOR EACH ROW EXECUTE FUNCTION ctb.audit_registry_changes();

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP TRIGGER IF EXISTS trg_audit_registry ON ctb.table_registry;
-- DROP FUNCTION IF EXISTS ctb.audit_registry_changes();
-- DROP TABLE IF EXISTS ctb.registry_audit_log;
-- DROP TABLE IF EXISTS ctb.table_registry;
-- DROP SCHEMA IF EXISTS ctb;
