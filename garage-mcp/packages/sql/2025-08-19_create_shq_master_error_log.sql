-- =====================================================================================
-- SHQ Master Error Log Migration
-- Creates centralized error logging tables with HEIR integration
-- =====================================================================================

-- Create SHQ schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS shq;

-- =====================================================================================
-- Master Error Log Table
-- Central repository for all system errors across agents and domains
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.master_error_log (
    -- Primary identification
    id SERIAL PRIMARY KEY,
    error_id VARCHAR(50) UNIQUE NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Process context
    process_id VARCHAR(50) NOT NULL,
    blueprint_id VARCHAR(100) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    plan_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    
    -- Agent context
    agent_id VARCHAR(100) NOT NULL,
    stage VARCHAR(20) NOT NULL CHECK (stage IN ('input', 'middle', 'output', 'overall', 'agent_delegation')),
    
    -- Error details
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    error_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    stacktrace TEXT,
    
    -- Context and debugging
    hdo_snapshot JSONB,
    context JSONB,
    
    -- Escalation tracking
    escalation_level INTEGER NOT NULL DEFAULT 0,
    escalated_at TIMESTAMPTZ,
    escalation_reason TEXT,
    
    -- Resolution tracking  
    resolved_at TIMESTAMPTZ,
    resolution_method VARCHAR(50),
    resolution_notes TEXT,
    resolved_by VARCHAR(100),
    
    -- Occurrence tracking (for pattern recognition)
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    first_occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pattern_id VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- Error Patterns Table
-- Track recurring error patterns for automated resolution
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.error_patterns (
    id SERIAL PRIMARY KEY,
    pattern_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Pattern identification
    error_signature TEXT NOT NULL,
    agent_id_pattern VARCHAR(100),
    stage_pattern VARCHAR(20),
    
    -- Pattern metrics
    occurrence_count INTEGER NOT NULL DEFAULT 0,
    confidence_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    success_rate DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    
    -- Resolution information
    known_solution TEXT,
    auto_resolution_available BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_script TEXT,
    
    -- Pattern metadata
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- Error Resolution Attempts Table
-- Track all resolution attempts for learning
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.error_resolution_attempts (
    id SERIAL PRIMARY KEY,
    attempt_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Link to error
    error_id VARCHAR(50) NOT NULL REFERENCES shq.master_error_log(error_id),
    pattern_id VARCHAR(50) REFERENCES shq.error_patterns(pattern_id),
    
    -- Attempt details
    resolution_method VARCHAR(50) NOT NULL,
    attempted_by VARCHAR(100) NOT NULL, -- agent_id or user_id
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Results
    success BOOLEAN NOT NULL DEFAULT FALSE,
    duration_seconds INTEGER,
    outcome_message TEXT,
    
    -- Learning data
    steps_taken JSONB,
    lessons_learned TEXT,
    would_retry BOOLEAN,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- System Status Dashboard Table
-- Real-time system health overview
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.system_status (
    id SERIAL PRIMARY KEY,
    status_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Time window
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    
    -- Overall status
    overall_status VARCHAR(10) NOT NULL CHECK (overall_status IN ('GREEN', 'YELLOW', 'RED')),
    
    -- Error counts by severity
    critical_count INTEGER NOT NULL DEFAULT 0,
    high_count INTEGER NOT NULL DEFAULT 0,
    medium_count INTEGER NOT NULL DEFAULT 0,
    low_count INTEGER NOT NULL DEFAULT 0,
    
    -- Agent statistics
    active_agents INTEGER NOT NULL DEFAULT 0,
    failing_agents INTEGER NOT NULL DEFAULT 0,
    
    -- Process statistics
    processes_started INTEGER NOT NULL DEFAULT 0,
    processes_completed INTEGER NOT NULL DEFAULT 0,
    processes_failed INTEGER NOT NULL DEFAULT 0,
    
    -- Escalation queue
    escalations_pending INTEGER NOT NULL DEFAULT 0,
    escalations_overdue INTEGER NOT NULL DEFAULT 0,
    
    -- Performance metrics
    avg_process_duration_ms INTEGER,
    error_rate_percent DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- Indexes for Performance
-- =====================================================================================

-- Master error log indexes
CREATE INDEX IF NOT EXISTS idx_master_error_log_occurred_at 
    ON shq.master_error_log(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_master_error_log_process_id 
    ON shq.master_error_log(process_id);
CREATE INDEX IF NOT EXISTS idx_master_error_log_agent_id 
    ON shq.master_error_log(agent_id);
CREATE INDEX IF NOT EXISTS idx_master_error_log_severity 
    ON shq.master_error_log(severity);
CREATE INDEX IF NOT EXISTS idx_master_error_log_stage 
    ON shq.master_error_log(stage);
CREATE INDEX IF NOT EXISTS idx_master_error_log_resolved 
    ON shq.master_error_log(resolved_at) WHERE resolved_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_master_error_log_pattern 
    ON shq.master_error_log(pattern_id) WHERE pattern_id IS NOT NULL;

-- Error patterns indexes
CREATE INDEX IF NOT EXISTS idx_error_patterns_confidence 
    ON shq.error_patterns(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_error_patterns_auto_resolution 
    ON shq.error_patterns(auto_resolution_available) WHERE auto_resolution_available = TRUE;

-- Resolution attempts indexes
CREATE INDEX IF NOT EXISTS idx_resolution_attempts_error_id 
    ON shq.error_resolution_attempts(error_id);
CREATE INDEX IF NOT EXISTS idx_resolution_attempts_attempted_at 
    ON shq.error_resolution_attempts(attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_resolution_attempts_success 
    ON shq.error_resolution_attempts(success);

-- System status indexes
CREATE INDEX IF NOT EXISTS idx_system_status_window 
    ON shq.system_status(window_start DESC, window_end DESC);

-- =====================================================================================
-- Helper Functions
-- =====================================================================================

-- Function to update error occurrence count
CREATE OR REPLACE FUNCTION shq.update_error_occurrence(p_error_signature TEXT, p_agent_id VARCHAR(100))
RETURNS VARCHAR(50) AS $$
DECLARE
    v_pattern_id VARCHAR(50);
    v_occurrence_count INTEGER;
BEGIN
    -- Find or create pattern
    SELECT pattern_id, occurrence_count 
    INTO v_pattern_id, v_occurrence_count
    FROM shq.error_patterns 
    WHERE error_signature = p_error_signature 
    AND (agent_id_pattern = p_agent_id OR agent_id_pattern IS NULL);
    
    IF v_pattern_id IS NULL THEN
        -- Create new pattern
        v_pattern_id := 'PAT-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' || 
                        LPAD(nextval('shq.pattern_seq')::TEXT, 3, '0');
        
        INSERT INTO shq.error_patterns (
            pattern_id, error_signature, agent_id_pattern, 
            occurrence_count, first_seen, last_seen
        ) VALUES (
            v_pattern_id, p_error_signature, p_agent_id,
            1, NOW(), NOW()
        );
        
        v_occurrence_count := 1;
    ELSE
        -- Update existing pattern
        UPDATE shq.error_patterns 
        SET occurrence_count = occurrence_count + 1,
            last_seen = NOW(),
            updated_at = NOW()
        WHERE pattern_id = v_pattern_id;
        
        v_occurrence_count := v_occurrence_count + 1;
    END IF;
    
    RETURN v_pattern_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate system status
CREATE OR REPLACE FUNCTION shq.calculate_system_status(p_window_hours INTEGER DEFAULT 1)
RETURNS TABLE(
    overall_status VARCHAR(10),
    error_counts JSONB,
    agent_stats JSONB,
    process_stats JSONB
) AS $$
DECLARE
    v_window_start TIMESTAMPTZ;
    v_critical_count INTEGER;
    v_high_count INTEGER;
    v_status VARCHAR(10);
BEGIN
    v_window_start := NOW() - (p_window_hours || ' hours')::INTERVAL;
    
    -- Count errors by severity
    SELECT 
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END),
        COUNT(CASE WHEN severity = 'HIGH' THEN 1 END)
    INTO v_critical_count, v_high_count
    FROM shq.master_error_log
    WHERE occurred_at >= v_window_start;
    
    -- Determine overall status
    IF v_critical_count > 0 THEN
        v_status := 'RED';
    ELSIF v_high_count > 5 THEN
        v_status := 'RED';
    ELSIF v_high_count > 0 THEN
        v_status := 'YELLOW';
    ELSE
        v_status := 'GREEN';
    END IF;
    
    RETURN QUERY
    SELECT 
        v_status,
        jsonb_build_object(
            'critical', v_critical_count,
            'high', v_high_count,
            'total', v_critical_count + v_high_count
        ),
        jsonb_build_object(
            'active', (SELECT COUNT(DISTINCT agent_id) FROM shq.master_error_log WHERE occurred_at >= v_window_start),
            'failing', (SELECT COUNT(DISTINCT agent_id) FROM shq.master_error_log WHERE occurred_at >= v_window_start AND severity IN ('CRITICAL', 'HIGH'))
        ),
        jsonb_build_object(
            'total_errors', v_critical_count + v_high_count,
            'error_rate', ROUND((v_critical_count + v_high_count)::DECIMAL / GREATEST(p_window_hours, 1) * 100, 2)
        );
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- Sequences
-- =====================================================================================
CREATE SEQUENCE IF NOT EXISTS shq.pattern_seq START 1;

-- =====================================================================================
-- Grants (adjust according to your security model)
-- =====================================================================================
-- GRANT USAGE ON SCHEMA shq TO garage_mcp_user;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA shq TO garage_mcp_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shq TO garage_mcp_user;

-- =====================================================================================
-- Migration Complete
-- =====================================================================================
COMMENT ON SCHEMA shq IS 'System Headquarters - centralized error logging and system monitoring';
COMMENT ON TABLE shq.master_error_log IS 'Central repository for all system errors with HEIR integration';
COMMENT ON TABLE shq.error_patterns IS 'Pattern recognition for recurring errors and automated resolution';
COMMENT ON TABLE shq.error_resolution_attempts IS 'Learning database for error resolution attempts';
COMMENT ON TABLE shq.system_status IS 'Real-time system health dashboard data';