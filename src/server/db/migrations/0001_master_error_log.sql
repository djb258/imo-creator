CREATE SCHEMA IF NOT EXISTS shq;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE shq.error_severity_enum AS ENUM ('info','warning','error','critical');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS shq.master_error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_system TEXT NOT NULL,
  source_service TEXT,
  environment TEXT,
  severity shq.error_severity_enum NOT NULL,
  error_code TEXT,
  http_status INT,
  process_id TEXT,
  unique_id TEXT,
  blueprint_version_hash TEXT,
  schema_version TEXT,
  agent_execution_signature TEXT,
  mcp_bay TEXT,
  subagent_id TEXT,
  message TEXT NOT NULL,
  details_json JSONB,
  stack_trace TEXT,
  file_path TEXT,
  line_number INT,
  context_tags TEXT[] NOT NULL DEFAULT '{}',
  dedupe_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_notes TEXT,
  CONSTRAINT chk_http_status_range CHECK (http_status IS NULL OR http_status BETWEEN 100 AND 599),
  CONSTRAINT chk_line_number_nonneg CHECK (line_number IS NULL OR line_number >= 0),
  CONSTRAINT chk_blueprint_hash_hex64 CHECK (
    blueprint_version_hash IS NULL OR blueprint_version_hash ~ '^[0-9a-f]{64}$'
  )
);

CREATE OR REPLACE FUNCTION shq.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_master_error_log_set_updated_at ON shq.master_error_log;
CREATE TRIGGER trg_master_error_log_set_updated_at
BEFORE UPDATE ON shq.master_error_log
FOR EACH ROW EXECUTE FUNCTION shq.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_master_error_log_severity_time
  ON shq.master_error_log (severity, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_master_error_log_error_code
  ON shq.master_error_log (error_code);

CREATE INDEX IF NOT EXISTS idx_master_error_log_process_unique
  ON shq.master_error_log (process_id, unique_id);

CREATE INDEX IF NOT EXISTS idx_master_error_log_mcp_subagent
  ON shq.master_error_log (mcp_bay, subagent_id);

CREATE INDEX IF NOT EXISTS idx_master_error_log_details_gin
  ON shq.master_error_log USING GIN (details_json);

CREATE INDEX IF NOT EXISTS idx_master_error_log_context_tags_gin
  ON shq.master_error_log USING GIN (context_tags);

CREATE UNIQUE INDEX IF NOT EXISTS uq_master_error_log_dedupe
  ON shq.master_error_log (dedupe_hash)
  WHERE dedupe_hash IS NOT NULL;

COMMENT ON TABLE shq.master_error_log IS
'Master error/audit log for system-wide events (imo-creator, garage-mcp, sidecar, subagents).';