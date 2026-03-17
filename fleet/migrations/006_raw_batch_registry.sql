-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 006: RAW Batch Registry
-- ═══════════════════════════════════════════════════════════════════════════════
-- Authority: imo-creator (Constitutional)
-- Purpose: Track every ingestion batch with status lifecycle and supersede chain.
--          Enforces INSERT-only on the registry itself (except status transitions).
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.3
-- Depends: 001_ctb_table_registry.sql, 005_raw_immutability.sql
-- Idempotent: YES (safe to re-run)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- TABLE: ctb.raw_batch_registry
-- Every ingestion batch is tracked here. INSERT-only except for
-- status transitions (ACTIVE → SUPERSEDED).
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ctb.raw_batch_registry (
    batch_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bridge_id           TEXT NOT NULL,
    vendor_source       TEXT NOT NULL,
    bridge_version      TEXT NOT NULL,
    target_schema       TEXT NOT NULL DEFAULT 'public',
    target_table        TEXT NOT NULL,
    row_count           INTEGER NOT NULL DEFAULT 0,
    supersedes_batch_id UUID,
    status              TEXT NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'SUPERSEDED', 'FAILED')),
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    ingested_by         TEXT NOT NULL DEFAULT current_user,

    CONSTRAINT fk_batch_bridge FOREIGN KEY (bridge_id)
        REFERENCES ctb.vendor_bridges (bridge_id)
);

COMMENT ON TABLE ctb.raw_batch_registry IS 'Tracks every ingestion batch — status lifecycle (ACTIVE → SUPERSEDED), supersede chain';
COMMENT ON COLUMN ctb.raw_batch_registry.batch_id IS 'Matches ingestion_batch_id on RAW table rows';
COMMENT ON COLUMN ctb.raw_batch_registry.supersedes_batch_id IS 'Previous batch this one replaces (corrections flow through supersede)';
COMMENT ON COLUMN ctb.raw_batch_registry.status IS 'ACTIVE (current), SUPERSEDED (replaced by newer batch), FAILED (ingestion error)';

CREATE INDEX IF NOT EXISTS idx_raw_batch_registry_bridge
    ON ctb.raw_batch_registry (bridge_id);

CREATE INDEX IF NOT EXISTS idx_raw_batch_registry_target
    ON ctb.raw_batch_registry (target_schema, target_table);

CREATE INDEX IF NOT EXISTS idx_raw_batch_registry_status
    ON ctb.raw_batch_registry (status);

CREATE INDEX IF NOT EXISTS idx_raw_batch_registry_supersedes
    ON ctb.raw_batch_registry (supersedes_batch_id)
    WHERE supersedes_batch_id IS NOT NULL;

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Batch registry immutability
--
-- The batch registry is INSERT-only for new batches.
-- The only UPDATE allowed is status changing from ACTIVE to SUPERSEDED
-- or ACTIVE to FAILED.
-- DELETE is never allowed.
--
-- Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.3
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.enforce_batch_registry_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
BEGIN
    -- DELETE is never allowed
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'CTB_BATCH_IMMUTABILITY: DELETE on ctb.raw_batch_registry is not allowed. '
                        'Batch records are permanent. '
                        'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.3';
    END IF;

    -- UPDATE: only status transitions are allowed
    IF TG_OP = 'UPDATE' THEN
        -- Only the status column may change
        IF OLD.batch_id != NEW.batch_id
           OR OLD.bridge_id != NEW.bridge_id
           OR OLD.vendor_source != NEW.vendor_source
           OR OLD.bridge_version != NEW.bridge_version
           OR OLD.target_schema != NEW.target_schema
           OR OLD.target_table != NEW.target_table
           OR OLD.row_count != NEW.row_count
           OR OLD.ingested_at != NEW.ingested_at
           OR OLD.ingested_by != NEW.ingested_by
           OR (OLD.supersedes_batch_id IS DISTINCT FROM NEW.supersedes_batch_id)
        THEN
            RAISE EXCEPTION 'CTB_BATCH_IMMUTABILITY: Only the status column may be updated on ctb.raw_batch_registry. '
                            'All other columns are immutable after insertion. '
                            'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.3';
        END IF;

        -- Status can only transition ACTIVE → SUPERSEDED or ACTIVE → FAILED
        IF OLD.status != 'ACTIVE' THEN
            RAISE EXCEPTION 'CTB_BATCH_IMMUTABILITY: Batch % status is %, only ACTIVE batches may transition. '
                            'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.3',
                            OLD.batch_id, OLD.status;
        END IF;

        IF NEW.status NOT IN ('SUPERSEDED', 'FAILED') THEN
            RAISE EXCEPTION 'CTB_BATCH_IMMUTABILITY: Invalid status transition ACTIVE → %. '
                            'Allowed: ACTIVE → SUPERSEDED, ACTIVE → FAILED. '
                            'Doctrine: CTB_REGISTRY_ENFORCEMENT.md §8.3',
                            NEW.status;
        END IF;

        RETURN NEW;
    END IF;

    -- INSERT is allowed
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION ctb.enforce_batch_registry_immutability() IS 'Enforces INSERT-only on batch registry (except status transitions)';

DROP TRIGGER IF EXISTS trg_batch_registry_immutability ON ctb.raw_batch_registry;
CREATE TRIGGER trg_batch_registry_immutability
    BEFORE UPDATE OR DELETE ON ctb.raw_batch_registry
    FOR EACH ROW EXECUTE FUNCTION ctb.enforce_batch_registry_immutability();

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION: Auto-supersede previous batch
--
-- When a new batch is inserted with supersedes_batch_id set,
-- automatically mark the old batch as SUPERSEDED.
-- ───────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ctb.auto_supersede_batch()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
BEGIN
    IF NEW.supersedes_batch_id IS NOT NULL THEN
        UPDATE ctb.raw_batch_registry
        SET status = 'SUPERSEDED'
        WHERE batch_id = NEW.supersedes_batch_id
          AND status = 'ACTIVE';

        IF NOT FOUND THEN
            RAISE WARNING 'CTB_BATCH_SUPERSEDE: Batch % not found or not ACTIVE — cannot supersede',
                          NEW.supersedes_batch_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION ctb.auto_supersede_batch() IS 'Auto-marks the previous batch as SUPERSEDED when a new batch references it';

DROP TRIGGER IF EXISTS trg_auto_supersede ON ctb.raw_batch_registry;
CREATE TRIGGER trg_auto_supersede
    AFTER INSERT ON ctb.raw_batch_registry
    FOR EACH ROW EXECUTE FUNCTION ctb.auto_supersede_batch();

-- ───────────────────────────────────────────────────────────────────
-- AUDIT: Batch registry changes
-- Tracks all status transitions for audit trail.
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ctb.batch_audit_log (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    batch_id        UUID NOT NULL,
    old_status      TEXT,
    new_status      TEXT NOT NULL,
    changed_by      TEXT NOT NULL DEFAULT current_user,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ctb.batch_audit_log IS 'Audit trail for batch status transitions';

CREATE INDEX IF NOT EXISTS idx_batch_audit_batch
    ON ctb.batch_audit_log (batch_id);

CREATE OR REPLACE FUNCTION ctb.audit_batch_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ctb, pg_catalog
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO ctb.batch_audit_log (batch_id, new_status)
        VALUES (NEW.batch_id, NEW.status);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO ctb.batch_audit_log (batch_id, old_status, new_status)
        VALUES (NEW.batch_id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION ctb.audit_batch_changes() IS 'Logs batch registry inserts and status transitions to audit log';

DROP TRIGGER IF EXISTS trg_audit_batch ON ctb.raw_batch_registry;
CREATE TRIGGER trg_audit_batch
    AFTER INSERT OR UPDATE ON ctb.raw_batch_registry
    FOR EACH ROW EXECUTE FUNCTION ctb.audit_batch_changes();

-- ═══════════════════════════════════════════════════════════════════
-- ROLLBACK (uncomment to reverse this migration)
-- ═══════════════════════════════════════════════════════════════════
-- DROP TRIGGER IF EXISTS trg_audit_batch ON ctb.raw_batch_registry;
-- DROP FUNCTION IF EXISTS ctb.audit_batch_changes();
-- DROP TABLE IF EXISTS ctb.batch_audit_log;
-- DROP TRIGGER IF EXISTS trg_auto_supersede ON ctb.raw_batch_registry;
-- DROP FUNCTION IF EXISTS ctb.auto_supersede_batch();
-- DROP TRIGGER IF EXISTS trg_batch_registry_immutability ON ctb.raw_batch_registry;
-- DROP FUNCTION IF EXISTS ctb.enforce_batch_registry_immutability();
-- DROP TABLE IF EXISTS ctb.raw_batch_registry;
