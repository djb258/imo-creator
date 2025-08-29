-- Mantis Logging Schema for MCP Doctrine Layer
-- Classification: System-Critical Infrastructure
-- Compliance: HEIR Doctrine v2.1 + ORBT Policy Framework v3.2
-- Purpose: Centralized structured logging for all MCP tool invocations and compliance events

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search optimization

-- Main Mantis Log Table
CREATE TABLE mantis_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- HEIR Compliance Fields (MANDATORY)
    unique_id VARCHAR(128) NOT NULL,
    process_id VARCHAR(128) NOT NULL,
    blueprint_version VARCHAR(32) NOT NULL,
    
    -- ORBT Layer Information  
    orbt_layer INTEGER NOT NULL CHECK (orbt_layer >= 1 AND orbt_layer <= 7),
    user_clearance INTEGER NOT NULL CHECK (user_clearance >= 1 AND user_clearance <= 7),
    
    -- Log Classification
    log_level VARCHAR(16) NOT NULL CHECK (log_level IN ('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'AUDIT')),
    event_category VARCHAR(32) NOT NULL,  -- tool_execution, validation_failure, security_violation, etc.
    event_type VARCHAR(64) NOT NULL,     -- specific event within category
    
    -- Core Log Data
    message TEXT NOT NULL,
    structured_data JSONB NOT NULL DEFAULT '{}',
    
    -- Tool Context
    tool_name VARCHAR(64),
    tool_version VARCHAR(16),
    mcp_server_instance VARCHAR(128),
    
    -- User Context
    user_context JSONB NOT NULL,  -- user_id, department, session_id, etc.
    
    -- Security Context
    security_flags VARCHAR(32)[] DEFAULT '{}',  -- PII_SCRUBBED, ENCRYPTED, CLASSIFIED, etc.
    compliance_status VARCHAR(32) DEFAULT 'COMPLIANT' CHECK (compliance_status IN ('COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW', 'VIOLATION')),
    
    -- Performance Metrics
    execution_time_ms INTEGER,
    memory_usage_mb INTEGER,
    network_calls INTEGER DEFAULT 0,
    
    -- Tracing and Correlation
    trace_id VARCHAR(128),  -- For distributed tracing
    span_id VARCHAR(64),    -- For OpenTelemetry compatibility  
    parent_span_id VARCHAR(64),
    correlation_id VARCHAR(128),  -- For request correlation
    
    -- Audit Trail
    source_system VARCHAR(64) NOT NULL,  -- Which system generated this log
    source_host VARCHAR(128),
    source_service VARCHAR(64),
    
    -- Data Classification
    data_classification VARCHAR(32) DEFAULT 'INTERNAL' CHECK (data_classification IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'TOP_SECRET')),
    retention_days INTEGER NOT NULL DEFAULT 90,
    
    -- Indexing optimization
    CONSTRAINT valid_heir_id CHECK (unique_id ~ '^HEIR-[0-9]{4}-[0-9]{2}-[A-Z]{3,8}-[A-Z]{2,6}-[0-9]{2}$'),
    CONSTRAINT valid_process_id CHECK (process_id ~ '^PRC-[A-Z0-9]{8}-[0-9]{13}$')
);

-- Security Violation Logs (High Priority Subset)
CREATE TABLE mantis_security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Reference to main log entry
    mantis_log_id UUID REFERENCES mantis_logs(id),
    
    -- HEIR/ORBT Context
    unique_id VARCHAR(128) NOT NULL,
    process_id VARCHAR(128),
    orbt_layer INTEGER,
    
    -- Security Event Details
    violation_type VARCHAR(64) NOT NULL,  -- UNAUTHORIZED_ACCESS, PRIVILEGE_ESCALATION, etc.
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EMERGENCY')),
    threat_level VARCHAR(16) NOT NULL CHECK (threat_level IN ('BENIGN', 'SUSPICIOUS', 'MALICIOUS', 'APT')),
    
    -- Attack Details
    attack_vector VARCHAR(64),  -- injection, privilege_escalation, data_exfiltration, etc.
    source_ip INET,
    user_agent TEXT,
    affected_resources TEXT[],
    
    -- Response Actions Taken
    automated_response JSONB NOT NULL DEFAULT '{}',
    response_actions VARCHAR(64)[] DEFAULT '{}',  -- KILL_SWITCH, ACCOUNT_SUSPENSION, etc.
    escalation_status VARCHAR(32) DEFAULT 'NONE' CHECK (escalation_status IN ('NONE', 'TEAM_LEAD', 'SECURITY_TEAM', 'EXECUTIVE', 'EMERGENCY')),
    
    -- Investigation Status
    investigation_status VARCHAR(32) DEFAULT 'OPEN' CHECK (investigation_status IN ('OPEN', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED')),
    assigned_to VARCHAR(128),
    resolution_timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Forensic Data
    forensic_snapshot JSONB,  -- System state at time of violation
    network_trace JSONB,      -- Network activity logs
    process_lineage_snapshot JSONB  -- Process relationships at violation time
);

-- Performance Metrics Logs (for BMAD integration)
CREATE TABLE mantis_performance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Reference to main log
    mantis_log_id UUID REFERENCES mantis_logs(id),
    
    -- HEIR/ORBT Context
    unique_id VARCHAR(128) NOT NULL,
    process_id VARCHAR(128) NOT NULL,
    
    -- Performance Metrics
    operation_name VARCHAR(128) NOT NULL,
    duration_ms INTEGER NOT NULL,
    cpu_usage_percent DECIMAL(5,2),
    memory_peak_mb INTEGER,
    memory_average_mb INTEGER,
    disk_io_kb INTEGER,
    network_bytes_in INTEGER,
    network_bytes_out INTEGER,
    
    -- Database Performance
    db_query_count INTEGER DEFAULT 0,
    db_query_time_ms INTEGER DEFAULT 0,
    db_connection_time_ms INTEGER DEFAULT 0,
    
    -- External API Performance
    external_api_calls INTEGER DEFAULT 0,
    external_api_time_ms INTEGER DEFAULT 0,
    external_api_failures INTEGER DEFAULT 0,
    
    -- BMAD Benchmarking
    baseline_duration_ms INTEGER,  -- Expected performance baseline
    performance_delta_percent DECIMAL(6,2),  -- % difference from baseline
    regression_detected BOOLEAN DEFAULT FALSE,
    
    -- Environment Context
    deployment_environment VARCHAR(32) NOT NULL DEFAULT 'production',  -- dev, staging, production
    resource_constraints JSONB,  -- CPU/memory limits, etc.
    concurrent_operations INTEGER DEFAULT 1
);

-- Compliance Audit Logs
CREATE TABLE mantis_compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Reference to main log
    mantis_log_id UUID REFERENCES mantis_logs(id),
    
    -- HEIR/ORBT Context
    unique_id VARCHAR(128) NOT NULL,
    process_id VARCHAR(128),
    orbt_layer INTEGER,
    
    -- Compliance Framework
    compliance_framework VARCHAR(32) NOT NULL,  -- HEIR, ORBT, SOC2, GDPR, etc.
    compliance_rule VARCHAR(128) NOT NULL,
    rule_version VARCHAR(16) NOT NULL,
    
    -- Compliance Check Results
    compliance_status VARCHAR(32) NOT NULL CHECK (compliance_status IN ('PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE')),
    violation_details JSONB,
    remediation_required BOOLEAN DEFAULT FALSE,
    remediation_actions TEXT[],
    
    -- Audit Context
    auditor_type VARCHAR(32) NOT NULL,  -- AUTOMATED, HUMAN, EXTERNAL_AUDITOR
    audit_scope VARCHAR(64),
    audit_trigger VARCHAR(64),  -- SCHEDULED, INCIDENT_RESPONSE, COMPLIANCE_REVIEW
    
    -- Regulatory Context
    regulatory_requirements TEXT[],  -- Which regulations this relates to
    data_subject_rights_impacted BOOLEAN DEFAULT FALSE,
    cross_border_transfer BOOLEAN DEFAULT FALSE,
    
    -- Evidence and Documentation
    evidence_collected JSONB,
    supporting_documentation TEXT[],  -- References to external documents
    audit_trail_complete BOOLEAN DEFAULT TRUE
);

-- Optimized Indexes for Performance
CREATE INDEX idx_mantis_logs_timestamp ON mantis_logs(timestamp DESC);
CREATE INDEX idx_mantis_logs_unique_id ON mantis_logs(unique_id);
CREATE INDEX idx_mantis_logs_process_id ON mantis_logs(process_id);
CREATE INDEX idx_mantis_logs_tool_execution ON mantis_logs(tool_name, timestamp DESC) WHERE event_category = 'tool_execution';
CREATE INDEX idx_mantis_logs_security ON mantis_logs(timestamp DESC) WHERE log_level IN ('ERROR', 'FATAL', 'AUDIT');
CREATE INDEX idx_mantis_logs_orbt_layer ON mantis_logs(orbt_layer, timestamp DESC);

-- Full-text search index for log messages
CREATE INDEX idx_mantis_logs_message_search ON mantis_logs USING GIN (to_tsvector('english', message));
CREATE INDEX idx_mantis_logs_structured_data ON mantis_logs USING GIN (structured_data);

-- Security logs indexes
CREATE INDEX idx_security_logs_severity ON mantis_security_logs(severity, timestamp DESC);
CREATE INDEX idx_security_logs_violation_type ON mantis_security_logs(violation_type, timestamp DESC);
CREATE INDEX idx_security_logs_investigation ON mantis_security_logs(investigation_status, assigned_to);

-- Performance logs indexes
CREATE INDEX idx_performance_logs_regression ON mantis_performance_logs(regression_detected, timestamp DESC) WHERE regression_detected = TRUE;
CREATE INDEX idx_performance_logs_operation ON mantis_performance_logs(operation_name, timestamp DESC);

-- Compliance logs indexes  
CREATE INDEX idx_compliance_logs_status ON mantis_compliance_logs(compliance_status, timestamp DESC) WHERE compliance_status IN ('FAIL', 'WARNING');
CREATE INDEX idx_compliance_logs_framework ON mantis_compliance_logs(compliance_framework, timestamp DESC);

-- Partitioning for Large-Scale Deployments
-- Partition main table by month for performance
CREATE TABLE mantis_logs_template (LIKE mantis_logs INCLUDING ALL);

-- Views for Common Queries
CREATE VIEW security_violations_active AS
SELECT 
    ml.timestamp,
    ml.unique_id,
    ml.process_id,
    ml.tool_name,
    msl.violation_type,
    msl.severity,
    msl.investigation_status,
    msl.assigned_to
FROM mantis_logs ml
JOIN mantis_security_logs msl ON ml.id = msl.mantis_log_id  
WHERE msl.investigation_status IN ('OPEN', 'INVESTIGATING')
AND ml.timestamp >= CURRENT_TIMESTAMP - INTERVAL '30 days';

CREATE VIEW performance_regressions AS
SELECT 
    ml.timestamp,
    ml.unique_id,
    ml.tool_name,
    mpl.operation_name,
    mpl.duration_ms,
    mpl.baseline_duration_ms,
    mpl.performance_delta_percent
FROM mantis_logs ml
JOIN mantis_performance_logs mpl ON ml.id = mpl.mantis_log_id
WHERE mpl.regression_detected = TRUE
AND ml.timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY mpl.performance_delta_percent DESC;

CREATE VIEW compliance_failures AS
SELECT 
    ml.timestamp,
    ml.unique_id,
    ml.process_id,
    ml.tool_name,
    mcl.compliance_framework,
    mcl.compliance_rule,
    mcl.violation_details,
    mcl.remediation_required
FROM mantis_logs ml
JOIN mantis_compliance_logs mcl ON ml.id = mcl.mantis_log_id
WHERE mcl.compliance_status IN ('FAIL', 'WARNING')
AND ml.timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days';

-- Automated Cleanup Functions
CREATE OR REPLACE FUNCTION cleanup_old_mantis_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    retention_cutoff TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Clean up logs based on their individual retention periods
    FOR retention_cutoff IN 
        SELECT DISTINCT CURRENT_TIMESTAMP - (retention_days || ' days')::INTERVAL 
        FROM mantis_logs 
        WHERE retention_days IS NOT NULL
    LOOP
        DELETE FROM mantis_logs 
        WHERE timestamp < retention_cutoff 
        AND retention_days = EXTRACT(days FROM CURRENT_TIMESTAMP - retention_cutoff);
        
        GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    END LOOP;
    
    -- Log cleanup action
    INSERT INTO mantis_logs (unique_id, process_id, blueprint_version, orbt_layer, user_clearance, log_level, event_category, event_type, message, user_context, source_system)
    VALUES ('SYSTEM-CLEANUP', 'SYS-CLEANUP', 'v1.0.0', 6, 6, 'INFO', 'system_maintenance', 'log_cleanup', 
            'Automated log cleanup completed', '{"system": "mantis_cleanup"}', 'mantis_log_system');
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Performance optimization function
CREATE OR REPLACE FUNCTION optimize_mantis_performance()
RETURNS TEXT AS $$
BEGIN
    -- Update table statistics
    ANALYZE mantis_logs;
    ANALYZE mantis_security_logs;
    ANALYZE mantis_performance_logs;
    ANALYZE mantis_compliance_logs;
    
    -- Reindex if fragmentation detected
    REINDEX INDEX CONCURRENTLY idx_mantis_logs_timestamp;
    REINDEX INDEX CONCURRENTLY idx_mantis_logs_unique_id;
    
    RETURN 'Mantis logging system optimization completed successfully';
END;
$$ LANGUAGE plpgsql;

-- Trigger Functions for Automatic Log Enhancement
CREATE OR REPLACE FUNCTION enrich_mantis_log()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically set retention based on log level and data classification
    IF NEW.retention_days IS NULL THEN
        NEW.retention_days := CASE 
            WHEN NEW.log_level IN ('FATAL', 'AUDIT') THEN 2555  -- 7 years
            WHEN NEW.log_level = 'ERROR' THEN 1095              -- 3 years  
            WHEN NEW.log_level = 'WARN' THEN 365                -- 1 year
            WHEN NEW.data_classification = 'TOP_SECRET' THEN 2555
            WHEN NEW.data_classification = 'RESTRICTED' THEN 1825  -- 5 years
            ELSE 90  -- Default 3 months
        END;
    END IF;
    
    -- Auto-generate correlation ID if not provided
    IF NEW.correlation_id IS NULL THEN
        NEW.correlation_id := 'MANTIS-' || EXTRACT(epoch FROM NEW.timestamp)::TEXT || '-' || substring(NEW.id::TEXT, 1, 8);
    END IF;
    
    -- Enhance structured data with system metadata
    NEW.structured_data := NEW.structured_data || jsonb_build_object(
        'mantis_version', '1.0.0',
        'schema_version', 'v3.2',
        'ingestion_timestamp', CURRENT_TIMESTAMP,
        'host_system', coalesce(NEW.source_host, 'unknown')
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
CREATE TRIGGER mantis_log_enrichment 
    BEFORE INSERT ON mantis_logs 
    FOR EACH ROW EXECUTE FUNCTION enrich_mantis_log();

-- Schedule automated maintenance (commented out - enable as needed)
-- SELECT cron.schedule('mantis-cleanup', '0 2 * * *', 'SELECT cleanup_old_mantis_logs();');
-- SELECT cron.schedule('mantis-optimization', '0 3 * * 0', 'SELECT optimize_mantis_performance();');