-- ORBT Error Log Table Migration
-- Purpose: Tracks all repo-layer errors using the ORBT model
-- Schema: shq
-- Table: orbt_error_log
-- Created: 2025-11-05

-- Create the ORBT error log table
CREATE TABLE IF NOT EXISTS shq.orbt_error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp_created TIMESTAMPTZ DEFAULT now(),
  repo_name TEXT NOT NULL,
  process_id TEXT NOT NULL,
  unique_id TEXT NOT NULL,
  agent_id TEXT,
  blueprint_id TEXT,
  error_layer TEXT CHECK (error_layer IN ('System', 'Operation', 'Repair', 'Build', 'Training')),
  altitude INT CHECK (altitude IN (60000, 40000, 30000, 20000, 10000, 5000)),
  file_path TEXT,
  error_summary TEXT,
  error_detail TEXT,
  resolution_status TEXT DEFAULT 'unresolved',
  resolution_notes TEXT,
  timestamp_resolved TIMESTAMPTZ,
  resolved_by TEXT
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_created ON shq.orbt_error_log (timestamp_created DESC);
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_repo ON shq.orbt_error_log (repo_name);
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_altitude ON shq.orbt_error_log (altitude);
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_process_id ON shq.orbt_error_log (process_id);
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_unique_id ON shq.orbt_error_log (unique_id);
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_resolution_status ON shq.orbt_error_log (resolution_status);
CREATE INDEX IF NOT EXISTS idx_orbt_error_log_error_layer ON shq.orbt_error_log (error_layer);

-- Add table comments for documentation
COMMENT ON TABLE shq.orbt_error_log IS 'ORBT error log - Tracks all repo-layer errors using the ORBT model (Operate, Repair, Build, Train)';
COMMENT ON COLUMN shq.orbt_error_log.repo_name IS 'Repository name where error occurred';
COMMENT ON COLUMN shq.orbt_error_log.process_id IS 'Process tracking ID (format: PRC-SYSTEM-EPOCHTIMESTAMP)';
COMMENT ON COLUMN shq.orbt_error_log.unique_id IS 'Unique identifier (format: HEIR-YYYY-MM-SYSTEM-MODE-VN)';
COMMENT ON COLUMN shq.orbt_error_log.error_layer IS 'ORBT layer: System, Operation, Repair, Build, or Training';
COMMENT ON COLUMN shq.orbt_error_log.altitude IS 'CTB altitude level: 60000, 40000, 30000, 20000, 10000, or 5000';
COMMENT ON COLUMN shq.orbt_error_log.resolution_status IS 'Error resolution status: unresolved, in_progress, resolved, or ignored';

