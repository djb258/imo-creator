-- =====================================================================================
-- ID System Migration
-- Creates tables and functions for unique ID and process ID management
-- =====================================================================================

-- Create SHQ schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS shq;

-- =====================================================================================
-- ID Registry Table
-- Central vault for all generated unique IDs
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.id_registry (
    -- Primary identification
    unique_id VARCHAR(100) PRIMARY KEY,
    
    -- ID components (parsed from unique_id)
    db_code VARCHAR(3) NOT NULL,
    hive VARCHAR(2) NOT NULL,
    subhive VARCHAR(2) NOT NULL,
    entity_type VARCHAR(10) NOT NULL,
    date_component VARCHAR(8) NOT NULL,
    ulid_component VARCHAR(26) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    entity_metadata JSONB,
    
    -- Usage tracking
    last_accessed_at TIMESTAMPTZ,
    access_count INTEGER NOT NULL DEFAULT 0,
    
    -- Validation
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    invalidated_at TIMESTAMPTZ,
    invalidation_reason TEXT
);

-- =====================================================================================
-- Process Registry Table  
-- Audit trail for all process executions
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.process_registry (
    -- Primary identification
    process_id VARCHAR(50) PRIMARY KEY,
    
    -- Process context
    plan_id VARCHAR(50) NOT NULL,
    blueprint_id VARCHAR(100),
    plan_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    
    -- Timing information
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (
        status IN ('created', 'running', 'completed', 'failed', 'cancelled', 'timed_out')
    ),
    stage VARCHAR(20) CHECK (stage IN ('input', 'middle', 'output', 'complete')),
    
    -- Idempotency
    idempotency_key VARCHAR(60) UNIQUE,
    
    -- Results
    final_result JSONB,
    error_count INTEGER NOT NULL DEFAULT 0,
    retry_count INTEGER NOT NULL DEFAULT 0,
    
    -- Relationships
    parent_process_id VARCHAR(50) REFERENCES shq.process_registry(process_id),
    root_process_id VARCHAR(50),
    
    -- Metadata
    initiated_by VARCHAR(100),
    tags TEXT[],
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- Process Sequence Table
-- Manages atomic sequence generation per plan+date
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.process_seq (
    -- Composite key
    plan_id VARCHAR(50) NOT NULL,
    date_component VARCHAR(8) NOT NULL, -- YYYYMMDD format
    
    -- Sequence tracking
    last_seq INTEGER NOT NULL DEFAULT 0,
    total_processes INTEGER NOT NULL DEFAULT 0,
    
    -- Concurrency control
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_until TIMESTAMPTZ,
    locked_by VARCHAR(100),
    
    PRIMARY KEY (plan_id, date_component)
);

-- =====================================================================================
-- Entity Type Registry
-- Defines valid entity types for unique ID generation
-- =====================================================================================
CREATE TABLE IF NOT EXISTS shq.entity_types (
    entity_type VARCHAR(10) PRIMARY KEY,
    description TEXT NOT NULL,
    db_code VARCHAR(3) NOT NULL,
    hive_range VARCHAR(10), -- e.g., "01-05" for valid hive codes
    validation_rules JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- Indexes for Performance
-- =====================================================================================

-- ID Registry indexes
CREATE INDEX IF NOT EXISTS idx_id_registry_entity_type 
    ON shq.id_registry(entity_type);
CREATE INDEX IF NOT EXISTS idx_id_registry_created_at 
    ON shq.id_registry(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_id_registry_db_hive 
    ON shq.id_registry(db_code, hive, subhive);
CREATE INDEX IF NOT EXISTS idx_id_registry_date_component 
    ON shq.id_registry(date_component);

-- Process Registry indexes
CREATE INDEX IF NOT EXISTS idx_process_registry_plan_id 
    ON shq.process_registry(plan_id);
CREATE INDEX IF NOT EXISTS idx_process_registry_status 
    ON shq.process_registry(status);
CREATE INDEX IF NOT EXISTS idx_process_registry_created_at 
    ON shq.process_registry(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_process_registry_parent 
    ON shq.process_registry(parent_process_id) WHERE parent_process_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_process_registry_idempotency 
    ON shq.process_registry(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Process Sequence indexes  
CREATE INDEX IF NOT EXISTS idx_process_seq_date 
    ON shq.process_seq(date_component DESC);
CREATE INDEX IF NOT EXISTS idx_process_seq_locked 
    ON shq.process_seq(locked_until) WHERE locked_until IS NOT NULL;

-- =====================================================================================
-- Core Functions
-- =====================================================================================

-- Generate next process sequence atomically
CREATE OR REPLACE FUNCTION shq.next_process_seq(p_plan_id VARCHAR(50), p_date VARCHAR(8) DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
    v_date VARCHAR(8);
    v_next_seq INTEGER;
    v_lock_expires TIMESTAMPTZ;
BEGIN
    -- Default to today if no date provided
    v_date := COALESCE(p_date, TO_CHAR(NOW(), 'YYYYMMDD'));
    
    -- Set lock expiration (5 minutes from now)
    v_lock_expires := NOW() + INTERVAL '5 minutes';
    
    -- Acquire lock and get next sequence
    INSERT INTO shq.process_seq (plan_id, date_component, last_seq, total_processes, locked_until, locked_by)
    VALUES (p_plan_id, v_date, 1, 1, v_lock_expires, 'next_process_seq')
    ON CONFLICT (plan_id, date_component) DO UPDATE SET
        last_seq = shq.process_seq.last_seq + 1,
        total_processes = shq.process_seq.total_processes + 1,
        locked_until = v_lock_expires,
        locked_by = 'next_process_seq',
        updated_at = NOW()
    RETURNING last_seq INTO v_next_seq;
    
    -- Clear lock immediately
    UPDATE shq.process_seq 
    SET locked_until = NULL, locked_by = NULL 
    WHERE plan_id = p_plan_id AND date_component = v_date;
    
    RETURN v_next_seq;
END;
$$ LANGUAGE plpgsql;

-- Generate complete process ID
CREATE OR REPLACE FUNCTION shq.make_process_id(p_plan_id VARCHAR(50))
RETURNS VARCHAR(50) AS $$
DECLARE
    v_date VARCHAR(8);
    v_time VARCHAR(6);
    v_seq INTEGER;
    v_process_id VARCHAR(50);
BEGIN
    -- Get current date and time
    v_date := TO_CHAR(NOW(), 'YYYYMMDD');
    v_time := TO_CHAR(NOW(), 'HH24MISS');
    
    -- Get next sequence
    v_seq := shq.next_process_seq(p_plan_id, v_date);
    
    -- Format process ID
    v_process_id := 'PROC-' || p_plan_id || '-' || v_date || '-' || v_time || '-' || LPAD(v_seq::TEXT, 3, '0');
    
    -- Ensure it matches our regex pattern
    IF NOT (v_process_id ~ '^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$') THEN
        RAISE EXCEPTION 'Generated process_id does not match required pattern: %', v_process_id;
    END IF;
    
    RETURN v_process_id;
END;
$$ LANGUAGE plpgsql;

-- Generate idempotency key from process ID
CREATE OR REPLACE FUNCTION shq.make_idempotency_key(p_process_id VARCHAR(50))
RETURNS VARCHAR(60) AS $$
DECLARE
    v_idem_key VARCHAR(60);
BEGIN
    -- Validate process ID format
    IF NOT (p_process_id ~ '^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$') THEN
        RAISE EXCEPTION 'Invalid process_id format: %', p_process_id;
    END IF;
    
    -- Generate idempotency key
    v_idem_key := 'IDEM-' || p_process_id;
    
    -- Validate result format
    IF NOT (v_idem_key ~ '^IDEM-PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$') THEN
        RAISE EXCEPTION 'Generated idempotency key does not match required pattern: %', v_idem_key;
    END IF;
    
    RETURN v_idem_key;
END;
$$ LANGUAGE plpgsql;

-- Validate unique ID format
CREATE OR REPLACE FUNCTION shq.is_valid_unique_id(p_unique_id VARCHAR(100))
RETURNS BOOLEAN AS $$
BEGIN
    -- Check basic format: DB-HIVEHIVE-ENTITY-YYYYMMDD-ULID26
    RETURN p_unique_id ~ '^[A-Z]{2,3}-\d{4}-[A-Z]{3,10}-\d{8}-[0-9A-Z]{26}$';
END;
$$ LANGUAGE plpgsql;

-- Check if unique ID exists
CREATE OR REPLACE FUNCTION shq.unique_id_exists(p_unique_id VARCHAR(100))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM shq.id_registry WHERE unique_id = p_unique_id);
END;
$$ LANGUAGE plpgsql;

-- Register new unique ID
CREATE OR REPLACE FUNCTION shq.register_unique_id(
    p_unique_id VARCHAR(100),
    p_created_by VARCHAR(100) DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_parts TEXT[];
    v_db_code VARCHAR(3);
    v_hive VARCHAR(2);
    v_subhive VARCHAR(2);
    v_entity VARCHAR(10);
    v_date VARCHAR(8);
    v_ulid VARCHAR(26);
BEGIN
    -- Validate format
    IF NOT shq.is_valid_unique_id(p_unique_id) THEN
        RAISE EXCEPTION 'Invalid unique_id format: %', p_unique_id;
    END IF;
    
    -- Parse components
    v_parts := string_to_array(p_unique_id, '-');
    v_db_code := v_parts[1];
    v_hive := substring(v_parts[2], 1, 2);
    v_subhive := substring(v_parts[2], 3, 2);
    v_entity := v_parts[3];
    v_date := v_parts[4];
    v_ulid := v_parts[5];
    
    -- Insert into registry
    INSERT INTO shq.id_registry (
        unique_id, db_code, hive, subhive, entity_type,
        date_component, ulid_component, created_by, entity_metadata
    ) VALUES (
        p_unique_id, v_db_code, v_hive, v_subhive, v_entity,
        v_date, v_ulid, p_created_by, p_metadata
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN unique_violation THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Register new process
CREATE OR REPLACE FUNCTION shq.register_process(
    p_process_id VARCHAR(50),
    p_plan_id VARCHAR(50),
    p_blueprint_id VARCHAR(100) DEFAULT NULL,
    p_plan_version VARCHAR(20) DEFAULT '1.0.0',
    p_initiated_by VARCHAR(100) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_idempotency_key VARCHAR(60);
BEGIN
    -- Generate idempotency key
    v_idempotency_key := shq.make_idempotency_key(p_process_id);
    
    -- Insert process record
    INSERT INTO shq.process_registry (
        process_id, plan_id, blueprint_id, plan_version,
        idempotency_key, initiated_by, status
    ) VALUES (
        p_process_id, p_plan_id, p_blueprint_id, p_plan_version,
        v_idempotency_key, p_initiated_by, 'created'
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN unique_violation THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Update process status
CREATE OR REPLACE FUNCTION shq.update_process_status(
    p_process_id VARCHAR(50),
    p_status VARCHAR(20),
    p_stage VARCHAR(20) DEFAULT NULL,
    p_error_count INTEGER DEFAULT NULL,
    p_final_result JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_duration INTEGER;
BEGIN
    -- Calculate duration if completing
    IF p_status IN ('completed', 'failed', 'cancelled', 'timed_out') THEN
        SELECT EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
        INTO v_duration
        FROM shq.process_registry
        WHERE process_id = p_process_id;
    END IF;
    
    UPDATE shq.process_registry SET
        status = p_status,
        stage = COALESCE(p_stage, stage),
        error_count = COALESCE(p_error_count, error_count),
        final_result = COALESCE(p_final_result, final_result),
        completed_at = CASE 
            WHEN p_status IN ('completed', 'failed', 'cancelled', 'timed_out') THEN NOW()
            ELSE completed_at
        END,
        duration_ms = COALESCE(v_duration, duration_ms),
        updated_at = NOW()
    WHERE process_id = p_process_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- Seed Data
-- =====================================================================================

-- Insert common entity types
INSERT INTO shq.entity_types (entity_type, description, db_code) VALUES
    ('CLIENT', 'Client records', 'CLT'),
    ('USER', 'User accounts', 'SHQ'),
    ('ORDER', 'Order records', 'ORD'),
    ('PAYMENT', 'Payment transactions', 'PAY'),
    ('PROCESS', 'Process executions', 'SHQ'),
    ('ERROR', 'Error records', 'SHQ'),
    ('ARTIFACT', 'Generated artifacts', 'ART')
ON CONFLICT (entity_type) DO NOTHING;

-- =====================================================================================
-- Views for Common Queries
-- =====================================================================================

-- Active processes view
CREATE OR REPLACE VIEW shq.active_processes AS
SELECT 
    process_id,
    plan_id,
    blueprint_id,
    status,
    stage,
    created_at,
    started_at,
    NOW() - started_at as running_duration,
    error_count,
    retry_count
FROM shq.process_registry
WHERE status = 'running'
ORDER BY started_at DESC;

-- Process statistics view  
CREATE OR REPLACE VIEW shq.process_statistics AS
SELECT 
    plan_id,
    COUNT(*) as total_processes,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_processes,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_processes,
    AVG(duration_ms) as avg_duration_ms,
    AVG(error_count) as avg_error_count,
    MAX(created_at) as last_execution
FROM shq.process_registry
GROUP BY plan_id
ORDER BY total_processes DESC;

-- ID registry statistics view
CREATE OR REPLACE VIEW shq.id_statistics AS
SELECT 
    entity_type,
    db_code,
    COUNT(*) as total_ids,
    COUNT(CASE WHEN is_valid THEN 1 END) as valid_ids,
    MAX(created_at) as latest_created,
    SUM(access_count) as total_accesses
FROM shq.id_registry
GROUP BY entity_type, db_code
ORDER BY total_ids DESC;

-- =====================================================================================
-- Grants (adjust according to your security model)  
-- =====================================================================================
-- GRANT USAGE ON SCHEMA shq TO garage_mcp_user;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA shq TO garage_mcp_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shq TO garage_mcp_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA shq TO garage_mcp_user;

-- =====================================================================================
-- Migration Complete
-- =====================================================================================
COMMENT ON TABLE shq.id_registry IS 'Central registry for all unique IDs with HEIR compatibility';
COMMENT ON TABLE shq.process_registry IS 'Audit trail and status tracking for all process executions';
COMMENT ON TABLE shq.process_seq IS 'Atomic sequence generation for deterministic process IDs';
COMMENT ON TABLE shq.entity_types IS 'Registry of valid entity types for unique ID generation';