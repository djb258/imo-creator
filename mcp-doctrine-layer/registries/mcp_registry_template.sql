-- MCP Registry Database Schema
-- Classification: System-Critical Infrastructure
-- Compliance: HEIR Doctrine v2.1 + ORBT Policy Framework v3.2
-- Purpose: Centralized registry for all MCP tool invocations and compliance tracking

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MCP Tool Registry Table
CREATE TABLE mcp_tool_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_name VARCHAR(64) NOT NULL,
    tool_version VARCHAR(16) NOT NULL,
    manifest_hash VARCHAR(64) NOT NULL, -- SHA256 of tool manifest
    classification VARCHAR(32) NOT NULL, -- database_operation, external_api_operation, etc.
    heir_compliance_version VARCHAR(8) NOT NULL DEFAULT 'v2.1',
    orbt_policy_version VARCHAR(8) NOT NULL DEFAULT 'v3.2',
    minimum_orbt_layer INTEGER NOT NULL CHECK (minimum_orbt_layer >= 1 AND minimum_orbt_layer <= 7),
    maximum_orbt_layer INTEGER NOT NULL CHECK (maximum_orbt_layer >= minimum_orbt_layer AND maximum_orbt_layer <= 7),
    security_risk_level VARCHAR(16) NOT NULL CHECK (security_risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    registration_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    registered_by VARCHAR(128) NOT NULL,
    status VARCHAR(16) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DEPRECATED', 'SUSPENDED', 'RETIRED')),
    
    UNIQUE(tool_name, tool_version)
);

-- Process Lineage Tracking Table
CREATE TABLE process_lineage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_id VARCHAR(128) NOT NULL UNIQUE, -- HEIR-compliant unique identifier
    process_id VARCHAR(128) NOT NULL, -- Process tracking identifier
    parent_process_id VARCHAR(128), -- For nested processes
    blueprint_version VARCHAR(32) NOT NULL,
    orbt_layer INTEGER NOT NULL CHECK (orbt_layer >= 1 AND orbt_layer <= 7),
    tool_name VARCHAR(64) NOT NULL,
    tool_version VARCHAR(16) NOT NULL,
    user_context JSONB NOT NULL, -- User clearance, department, etc.
    payload_hash VARCHAR(64) NOT NULL, -- SHA256 of sanitized payload
    execution_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_timestamp TIMESTAMP WITH TIME ZONE,
    status VARCHAR(16) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'EXECUTING', 'COMPLETED', 'FAILED', 'ABORTED')),
    compliance_status VARCHAR(16) DEFAULT 'UNDER_REVIEW' CHECK (compliance_status IN ('COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW', 'VIOLATION')),
    
    FOREIGN KEY (tool_name, tool_version) REFERENCES mcp_tool_registry(tool_name, tool_version)
);

-- HEIR Unique ID Registry
CREATE TABLE heir_unique_id_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_id VARCHAR(128) NOT NULL UNIQUE,
    system_code VARCHAR(8) NOT NULL, -- IMOCRT, MCPBKND, etc.
    operation_mode VARCHAR(6) NOT NULL, -- DEPLOY, EXEC, BATCH, etc.
    version_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    first_usage_timestamp TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    status VARCHAR(16) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'USED', 'RETIRED', 'REVOKED')),
    
    CHECK (year >= 2024 AND year <= 2030),
    CHECK (month >= 1 AND month <= 12),
    CHECK (version_number >= 1 AND version_number <= 99)
);

-- ORBT Layer Authorization Matrix
CREATE TABLE orbt_authorization_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layer_number INTEGER NOT NULL CHECK (layer_number >= 1 AND layer_number <= 7),
    layer_name VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    required_clearance VARCHAR(32) NOT NULL,
    approval_process VARCHAR(64) NOT NULL,
    risk_level VARCHAR(16) NOT NULL CHECK (risk_level IN ('MINIMAL', 'LOW', 'MODERATE', 'HIGH', 'MAXIMUM')),
    escalation_required BOOLEAN DEFAULT FALSE,
    executive_approval_required BOOLEAN DEFAULT FALSE,
    audit_retention_days INTEGER NOT NULL DEFAULT 90,
    
    UNIQUE(layer_number)
);

-- Tool Execution Audit Log
CREATE TABLE tool_execution_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_id VARCHAR(128) NOT NULL,
    process_id VARCHAR(128) NOT NULL,
    tool_name VARCHAR(64) NOT NULL,
    execution_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_context JSONB NOT NULL,
    payload_sanitized JSONB NOT NULL, -- Sanitized payload (PII scrubbed)
    validation_results JSONB NOT NULL, -- All validation stage results
    execution_results JSONB, -- Tool execution results (when available)
    security_events JSONB[], -- Any security events triggered
    compliance_flags VARCHAR(16)[] DEFAULT '{}', -- Compliance violation flags
    performance_metrics JSONB, -- Execution time, memory usage, etc.
    mantis_log_reference VARCHAR(128), -- Reference to Mantis logging system
    
    FOREIGN KEY (unique_id) REFERENCES heir_unique_id_registry(unique_id),
    FOREIGN KEY (process_id) REFERENCES process_lineage(process_id)
);

-- Security Violation Log
CREATE TABLE security_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_id VARCHAR(128),
    violation_type VARCHAR(32) NOT NULL,
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EMERGENCY')),
    violation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_context JSONB NOT NULL,
    violation_details JSONB NOT NULL,
    tool_context JSONB,
    response_action VARCHAR(64) NOT NULL, -- kill_switch, account_suspension, etc.
    escalation_path VARCHAR(128),
    resolution_status VARCHAR(16) DEFAULT 'OPEN' CHECK (resolution_status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED')),
    resolution_timestamp TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(128)
);

-- System Code Registry
CREATE TABLE system_code_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_code VARCHAR(8) NOT NULL UNIQUE,
    system_name VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    owner_department VARCHAR(32) NOT NULL,
    technical_contact VARCHAR(128) NOT NULL,
    security_clearance_required VARCHAR(32) NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_review_date DATE,
    next_review_date DATE NOT NULL,
    status VARCHAR(16) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DEPRECATED', 'SUSPENDED', 'RETIRED')),
    approval_authority VARCHAR(64) NOT NULL,
    compliance_notes TEXT
);

-- Indices for Performance Optimization
CREATE INDEX idx_process_lineage_unique_id ON process_lineage(unique_id);
CREATE INDEX idx_process_lineage_timestamp ON process_lineage(execution_timestamp);
CREATE INDEX idx_process_lineage_status ON process_lineage(status);
CREATE INDEX idx_audit_unique_id ON tool_execution_audit(unique_id);
CREATE INDEX idx_audit_timestamp ON tool_execution_audit(execution_timestamp);
CREATE INDEX idx_audit_tool_name ON tool_execution_audit(tool_name);
CREATE INDEX idx_violations_severity ON security_violations(severity);
CREATE INDEX idx_violations_timestamp ON security_violations(violation_timestamp);
CREATE INDEX idx_violations_type ON security_violations(violation_type);

-- Insert Default ORBT Layer Configuration
INSERT INTO orbt_authorization_matrix (layer_number, layer_name, description, required_clearance, approval_process, risk_level, escalation_required, executive_approval_required, audit_retention_days) VALUES
(1, 'Executive Operations', 'C-Level strategic operations, system-wide policy changes', 'C_LEVEL', 'Manual Executive Sign-off', 'MAXIMUM', TRUE, TRUE, 2555), -- 7 years
(2, 'Senior Management', 'Cross-departmental operations, significant configuration changes', 'DEPT_HEAD', 'Department Head Approval', 'HIGH', TRUE, FALSE, 1825), -- 5 years
(3, 'Team Lead Operations', 'Team-scoped operations, standard integrations', 'TEAM_LEAD', 'Team Lead Approval', 'MODERATE', FALSE, FALSE, 1095), -- 3 years
(4, 'Senior Developer', 'Standard development operations, routine integrations', 'SENIOR_DEV', 'Peer Review', 'MODERATE', FALSE, FALSE, 730), -- 2 years
(5, 'Developer Operations', 'Basic development tasks, read operations', 'DEVELOPER', 'Automated with Logging', 'LOW', FALSE, FALSE, 365), -- 1 year
(6, 'Automated Operations', 'System processes, scheduled jobs, monitoring', 'SYSTEM', 'System Validation', 'LOW', FALSE, FALSE, 180), -- 6 months
(7, 'Public Operations', 'Public endpoints, documentation access', 'PUBLIC', 'Rate Limiting Only', 'MINIMAL', FALSE, FALSE, 90); -- 3 months

-- Insert Default System Codes
INSERT INTO system_code_registry (system_code, system_name, description, owner_department, technical_contact, security_clearance_required, next_review_date, approval_authority, compliance_notes) VALUES
('IMOCRT', 'IMO Creator Main System', 'Primary IMO Creator application and orchestration system', 'Engineering', 'tech-lead@company.com', 'DEVELOPER', CURRENT_DATE + INTERVAL '1 year', 'Engineering Director', 'Primary system - requires highest compliance'),
('MCPBKND', 'MCP Backend Operations', 'Mission Control Processor backend services and API operations', 'Engineering', 'backend-team@company.com', 'DEVELOPER', CURRENT_DATE + INTERVAL '1 year', 'Engineering Director', 'Critical infrastructure - executive oversight required'),
('NEONWRT', 'Neon Database Writer', 'Neon PostgreSQL database write operations and data management', 'Data Engineering', 'data-team@company.com', 'SENIOR_DEV', CURRENT_DATE + INTERVAL '1 year', 'Data Engineering Lead', 'Database operations - enhanced audit trail required'),
('APFYSC', 'Apify Scraper Operations', 'External data scraping via Apify platform integration', 'Data Engineering', 'scraping-team@company.com', 'SENIOR_DEV', CURRENT_DATE + INTERVAL '6 months', 'Data Engineering Lead', 'External API - PII scrubbing mandatory'),
('EMLVAL', 'Email Validation Utility', 'Email address validation and verification services', 'Engineering', 'utils-team@company.com', 'DEVELOPER', CURRENT_DATE + INTERVAL '1 year', 'Engineering Manager', 'Low risk utility - standard compliance');

-- Create Views for Common Queries
CREATE VIEW active_processes AS
SELECT 
    pl.unique_id,
    pl.process_id,
    pl.tool_name,
    pl.orbt_layer,
    pl.execution_timestamp,
    pl.status,
    pl.compliance_status,
    oam.layer_name,
    oam.risk_level
FROM process_lineage pl
JOIN orbt_authorization_matrix oam ON pl.orbt_layer = oam.layer_number
WHERE pl.status IN ('PENDING', 'EXECUTING');

CREATE VIEW compliance_violations AS
SELECT 
    pl.unique_id,
    pl.process_id,
    pl.tool_name,
    pl.execution_timestamp,
    pl.compliance_status,
    sv.violation_type,
    sv.severity,
    sv.response_action
FROM process_lineage pl
LEFT JOIN security_violations sv ON pl.unique_id = sv.unique_id
WHERE pl.compliance_status = 'VIOLATION' OR sv.severity IN ('CRITICAL', 'EMERGENCY');

-- Automated Cleanup Procedures
CREATE OR REPLACE FUNCTION cleanup_expired_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Clean up audit logs based on ORBT layer retention policies
    DELETE FROM tool_execution_audit
    WHERE execution_timestamp < CURRENT_TIMESTAMP - INTERVAL '90 days'
    AND (SELECT audit_retention_days FROM orbt_authorization_matrix oam 
         JOIN process_lineage pl ON oam.layer_number = pl.orbt_layer 
         WHERE pl.unique_id = tool_execution_audit.unique_id) = 90;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup action
    INSERT INTO tool_execution_audit (unique_id, process_id, tool_name, user_context, payload_sanitized, validation_results)
    VALUES ('SYSTEM-CLEANUP', 'SYS-CLEANUP', 'audit_cleanup', '{"system": "automated"}', '{}', jsonb_build_object('deleted_records', deleted_count));
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT cleanup_expired_audit_logs();');