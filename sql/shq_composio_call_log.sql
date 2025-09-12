-- Abacus.AI × Composio MCP Audit Log
-- Schema: shq (Smart Headquarters)
-- Table: composio_call_log
-- Purpose: Track all Composio tool executions via MCP

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS shq;

-- Drop table if exists (for clean installs)
-- Comment out in production
-- DROP TABLE IF EXISTS shq.composio_call_log;

-- Create audit log table
CREATE TABLE IF NOT EXISTS shq.composio_call_log (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_uuid UUID NOT NULL,
  tool TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'timeout', 'blocked')),
  request_id TEXT NOT NULL UNIQUE,
  latency_ms INTEGER,
  payload_hash TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_composio_call_log_user_uuid 
  ON shq.composio_call_log(user_uuid);

CREATE INDEX IF NOT EXISTS idx_composio_call_log_tool 
  ON shq.composio_call_log(tool);

CREATE INDEX IF NOT EXISTS idx_composio_call_log_ts 
  ON shq.composio_call_log(ts DESC);

CREATE INDEX IF NOT EXISTS idx_composio_call_log_status 
  ON shq.composio_call_log(status);

CREATE INDEX IF NOT EXISTS idx_composio_call_log_request_id 
  ON shq.composio_call_log(request_id);

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT ON shq.composio_call_log TO your_app_user;

-- Add comment to table
COMMENT ON TABLE shq.composio_call_log IS 'Audit log for Abacus.AI × Composio MCP tool executions';
COMMENT ON COLUMN shq.composio_call_log.user_uuid IS 'External user identifier (HIVE_USER_UUID)';
COMMENT ON COLUMN shq.composio_call_log.tool IS 'Composio tool slug (e.g., NEON_EXECUTE_SQL)';
COMMENT ON COLUMN shq.composio_call_log.status IS 'Execution status: success, error, timeout, or blocked';
COMMENT ON COLUMN shq.composio_call_log.request_id IS 'Unique request identifier for tracking';
COMMENT ON COLUMN shq.composio_call_log.latency_ms IS 'Total execution time in milliseconds';
COMMENT ON COLUMN shq.composio_call_log.payload_hash IS 'SHA256 hash of request payload (first 16 chars)';
COMMENT ON COLUMN shq.composio_call_log.error_message IS 'Error details if status != success';

-- Sample queries for monitoring
/*
-- Today's activity for our user
SELECT * FROM shq.composio_call_log 
WHERE user_uuid = '6b9518ed-5771-4153-95bd-c72ce46e84ef'
  AND ts >= CURRENT_DATE
ORDER BY ts DESC;

-- Tool usage statistics
SELECT tool, 
       COUNT(*) as total_calls,
       COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
       AVG(latency_ms) as avg_latency_ms,
       MAX(latency_ms) as max_latency_ms
FROM shq.composio_call_log
WHERE ts >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY tool
ORDER BY total_calls DESC;

-- Recent errors
SELECT tool, error_message, ts, request_id
FROM shq.composio_call_log
WHERE status = 'error'
  AND ts >= NOW() - INTERVAL '1 hour'
ORDER BY ts DESC
LIMIT 10;
*/