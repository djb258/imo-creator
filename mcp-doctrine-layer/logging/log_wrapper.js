/**
 * Mantis Log Wrapper - Universal Logging System for MCP Doctrine Layer
 * Classification: System-Critical Infrastructure
 * Compliance: HEIR Doctrine v2.1 + ORBT Policy Framework v3.2
 * Purpose: Standardized logging interface for all MCP tool invocations
 */

const crypto = require('crypto');
const { Pool } = require('pg');

class MantisLogger {
    constructor(config = {}) {
        this.config = {
            database_url: config.database_url || process.env.DATABASE_URL,
            service_name: config.service_name || 'unknown-service',
            host_name: config.host_name || require('os').hostname(),
            environment: config.environment || process.env.NODE_ENV || 'production',
            heir_system_code: config.heir_system_code || 'UNKNOWN',
            default_orbt_layer: config.default_orbt_layer || 6,
            enable_console_output: config.enable_console_output !== false,
            enable_database_logging: config.enable_database_logging !== false,
            performance_tracking: config.performance_tracking !== false,
            ...config
        };

        // Initialize database connection pool
        if (this.config.enable_database_logging && this.config.database_url) {
            this.dbPool = new Pool({
                connectionString: this.config.database_url,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });
        }

        // Performance tracking
        this.performanceTrackers = new Map();
    }

    /**
     * Core logging method - all other methods route through here
     */
    async log({
        level,
        message,
        unique_id,
        process_id,
        blueprint_version = 'v1.0.0',
        orbt_layer = this.config.default_orbt_layer,
        user_clearance = 7,
        event_category,
        event_type,
        tool_name,
        tool_version,
        structured_data = {},
        user_context = {},
        security_flags = [],
        compliance_status = 'COMPLIANT',
        execution_time_ms,
        memory_usage_mb,
        network_calls = 0,
        trace_id,
        span_id,
        parent_span_id,
        correlation_id,
        data_classification = 'INTERNAL',
        retention_days
    }) {
        try {
            // Validate required HEIR/ORBT fields
            this.validateHEIRCompliance({ unique_id, process_id, orbt_layer, user_clearance });

            // Generate correlation ID if not provided
            if (!correlation_id) {
                correlation_id = this.generateCorrelationId();
            }

            // Prepare log entry
            const logEntry = {
                timestamp: new Date().toISOString(),
                unique_id: unique_id || this.generateSystemUniqueId(),
                process_id: process_id || this.generateProcessId(),
                blueprint_version,
                orbt_layer,
                user_clearance,
                log_level: level.toUpperCase(),
                event_category: event_category || 'general',
                event_type: event_type || 'log_entry',
                message,
                structured_data: {
                    ...structured_data,
                    mantis_version: '1.0.0',
                    ingestion_timestamp: new Date().toISOString(),
                    service_context: {
                        service_name: this.config.service_name,
                        environment: this.config.environment,
                        host_name: this.config.host_name
                    }
                },
                tool_name,
                tool_version,
                user_context,
                security_flags,
                compliance_status,
                execution_time_ms,
                memory_usage_mb,
                network_calls,
                trace_id,
                span_id,
                parent_span_id,
                correlation_id,
                source_system: this.config.service_name,
                source_host: this.config.host_name,
                source_service: this.config.service_name,
                data_classification,
                retention_days
            };

            // Console output (if enabled)
            if (this.config.enable_console_output) {
                this.outputToConsole(logEntry);
            }

            // Database logging (if enabled)
            if (this.config.enable_database_logging && this.dbPool) {
                await this.logToDatabase(logEntry);
            }

            return { status: 'logged', correlation_id, timestamp: logEntry.timestamp };

        } catch (error) {
            console.error('Mantis Logger Error:', error);
            // Fallback to console even if database fails
            console.log(`[${level.toUpperCase()}] ${message}`, { unique_id, process_id });
            throw error;
        }
    }

    /**
     * Convenience Methods for Different Log Levels
     */
    async trace(message, context = {}) {
        return this.log({ level: 'TRACE', message, ...context });
    }

    async debug(message, context = {}) {
        return this.log({ level: 'DEBUG', message, ...context });
    }

    async info(message, context = {}) {
        return this.log({ level: 'INFO', message, ...context });
    }

    async warn(message, context = {}) {
        return this.log({ level: 'WARN', message, ...context });
    }

    async error(message, context = {}) {
        return this.log({ level: 'ERROR', message, ...context });
    }

    async fatal(message, context = {}) {
        return this.log({ level: 'FATAL', message, ...context });
    }

    async audit(message, context = {}) {
        return this.log({ 
            level: 'AUDIT', 
            message, 
            data_classification: 'RESTRICTED',
            retention_days: 2555, // 7 years for audit logs
            ...context 
        });
    }

    /**
     * Specialized Logging Methods
     */
    async logToolExecution({
        tool_name,
        tool_version,
        unique_id,
        process_id,
        execution_start,
        execution_end,
        success,
        result_data = {},
        error_details = null,
        user_context = {},
        orbt_layer = 5
    }) {
        const execution_time_ms = execution_end - execution_start;
        const level = success ? 'INFO' : 'ERROR';
        const message = `Tool ${tool_name} execution ${success ? 'completed' : 'failed'}`;

        return this.log({
            level,
            message,
            unique_id,
            process_id,
            orbt_layer,
            event_category: 'tool_execution',
            event_type: success ? 'tool_success' : 'tool_failure',
            tool_name,
            tool_version,
            execution_time_ms,
            user_context,
            structured_data: {
                success,
                result_data: success ? result_data : null,
                error_details: error_details,
                performance_metrics: {
                    execution_time_ms,
                    memory_usage_mb: this.getCurrentMemoryUsage()
                }
            }
        });
    }

    async logSecurityViolation({
        violation_type,
        severity,
        unique_id,
        process_id,
        user_context,
        violation_details = {},
        automated_response = {},
        source_ip,
        user_agent
    }) {
        // Log to main table
        const mainLogResult = await this.log({
            level: 'FATAL',
            message: `Security violation detected: ${violation_type}`,
            unique_id,
            process_id,
            event_category: 'security_violation',
            event_type: violation_type,
            user_context,
            security_flags: ['SECURITY_VIOLATION', 'IMMEDIATE_ATTENTION'],
            compliance_status: 'VIOLATION',
            data_classification: 'RESTRICTED',
            retention_days: 2555, // 7 years
            structured_data: {
                violation_type,
                severity,
                violation_details,
                automated_response,
                source_ip,
                user_agent,
                threat_assessment: this.assessThreatLevel(violation_type, severity)
            }
        });

        // Log to security-specific table
        if (this.dbPool) {
            await this.logSecurityViolationToTable({
                mantis_log_id: mainLogResult.id,
                unique_id,
                process_id,
                violation_type,
                severity,
                source_ip,
                user_agent,
                automated_response,
                violation_details
            });
        }

        return mainLogResult;
    }

    async logPerformanceMetrics({
        operation_name,
        unique_id,
        process_id,
        duration_ms,
        baseline_duration_ms,
        cpu_usage_percent,
        memory_peak_mb,
        db_query_count = 0,
        external_api_calls = 0,
        regression_detected = false
    }) {
        const performance_delta_percent = baseline_duration_ms 
            ? ((duration_ms - baseline_duration_ms) / baseline_duration_ms * 100).toFixed(2)
            : 0;

        const level = regression_detected ? 'WARN' : 'INFO';
        const message = `Performance ${regression_detected ? 'regression' : 'metrics'} for ${operation_name}`;

        return this.log({
            level,
            message,
            unique_id,
            process_id,
            event_category: 'performance_tracking',
            event_type: regression_detected ? 'performance_regression' : 'performance_metrics',
            execution_time_ms: duration_ms,
            structured_data: {
                operation_name,
                performance_metrics: {
                    duration_ms,
                    baseline_duration_ms,
                    performance_delta_percent: parseFloat(performance_delta_percent),
                    cpu_usage_percent,
                    memory_peak_mb,
                    db_query_count,
                    external_api_calls,
                    regression_detected
                }
            }
        });
    }

    /**
     * Performance Tracking Utilities
     */
    startPerformanceTracking(operation_name, unique_id) {
        const tracking_id = `${operation_name}-${unique_id}-${Date.now()}`;
        this.performanceTrackers.set(tracking_id, {
            operation_name,
            unique_id,
            start_time: Date.now(),
            start_memory: this.getCurrentMemoryUsage()
        });
        return tracking_id;
    }

    async endPerformanceTracking(tracking_id, additional_metrics = {}) {
        const tracker = this.performanceTrackers.get(tracking_id);
        if (!tracker) {
            throw new Error(`Performance tracker not found: ${tracking_id}`);
        }

        const end_time = Date.now();
        const end_memory = this.getCurrentMemoryUsage();
        const duration_ms = end_time - tracker.start_time;
        const memory_delta_mb = end_memory - tracker.start_memory;

        this.performanceTrackers.delete(tracking_id);

        return this.logPerformanceMetrics({
            operation_name: tracker.operation_name,
            unique_id: tracker.unique_id,
            duration_ms,
            memory_peak_mb: Math.max(tracker.start_memory, end_memory),
            ...additional_metrics
        });
    }

    /**
     * Validation Methods
     */
    validateHEIRCompliance({ unique_id, process_id, orbt_layer, user_clearance }) {
        // HEIR Unique ID validation
        const heirRegex = /^HEIR-[0-9]{4}-[0-9]{2}-[A-Z]{3,8}-[A-Z]{2,6}-[0-9]{2}$/;
        if (unique_id && !heirRegex.test(unique_id)) {
            throw new Error(`Invalid HEIR unique ID format: ${unique_id}`);
        }

        // Process ID validation
        const processRegex = /^PRC-[A-Z0-9]{8}-[0-9]{13}$/;
        if (process_id && !processRegex.test(process_id)) {
            throw new Error(`Invalid Process ID format: ${process_id}`);
        }

        // ORBT Layer validation
        if (orbt_layer < 1 || orbt_layer > 7) {
            throw new Error(`Invalid ORBT layer: ${orbt_layer}. Must be 1-7.`);
        }

        // User clearance validation
        if (user_clearance < 1 || user_clearance > 7) {
            throw new Error(`Invalid user clearance: ${user_clearance}. Must be 1-7.`);
        }

        // Authorization check
        if (user_clearance > orbt_layer) {
            throw new Error(`Insufficient clearance. User level ${user_clearance} cannot access ORBT layer ${orbt_layer}`);
        }
    }

    /**
     * Utility Methods
     */
    generateCorrelationId() {
        return `MANTIS-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    }

    generateSystemUniqueId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const version = '01';
        return `HEIR-${year}-${month}-${this.config.heir_system_code}-SYSTEM-${version}`;
    }

    generateProcessId() {
        const systemCode = this.config.heir_system_code.padEnd(8, '0').substring(0, 8);
        const timestamp = Date.now().toString();
        return `PRC-${systemCode}-${timestamp}`;
    }

    getCurrentMemoryUsage() {
        return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    }

    assessThreatLevel(violation_type, severity) {
        const highRiskViolations = [
            'PRIVILEGE_ESCALATION', 
            'DATA_EXFILTRATION', 
            'SYSTEM_COMPROMISE',
            'ORBT_LAYER_SPOOFING'
        ];
        
        if (highRiskViolations.includes(violation_type) || severity === 'EMERGENCY') {
            return 'APT'; // Advanced Persistent Threat
        } else if (severity === 'CRITICAL') {
            return 'MALICIOUS';
        } else if (severity === 'HIGH') {
            return 'SUSPICIOUS';
        }
        return 'BENIGN';
    }

    /**
     * Console Output Formatting
     */
    outputToConsole(logEntry) {
        const timestamp = new Date(logEntry.timestamp).toISOString();
        const level = logEntry.log_level.padEnd(5);
        const color = this.getLevelColor(logEntry.log_level);
        
        console.log(`${timestamp} ${color}[${level}]${this.colors.reset} ${logEntry.message}`, {
            unique_id: logEntry.unique_id,
            process_id: logEntry.process_id,
            orbt_layer: logEntry.orbt_layer,
            correlation_id: logEntry.correlation_id,
            ...(logEntry.execution_time_ms && { execution_time_ms: logEntry.execution_time_ms }),
            ...(Object.keys(logEntry.structured_data).length > 0 && { data: logEntry.structured_data })
        });
    }

    getLevelColor(level) {
        const colors = {
            TRACE: '\x1b[90m',   // Gray
            DEBUG: '\x1b[36m',   // Cyan  
            INFO: '\x1b[32m',    // Green
            WARN: '\x1b[33m',    // Yellow
            ERROR: '\x1b[31m',   // Red
            FATAL: '\x1b[35m',   // Magenta
            AUDIT: '\x1b[45m'    // Purple background
        };
        return colors[level] || '\x1b[0m';
    }

    get colors() {
        return { reset: '\x1b[0m' };
    }

    /**
     * Database Operations
     */
    async logToDatabase(logEntry) {
        const client = await this.dbPool.connect();
        try {
            const query = `
                INSERT INTO mantis_logs (
                    timestamp, unique_id, process_id, blueprint_version, orbt_layer, user_clearance,
                    log_level, event_category, event_type, message, structured_data, tool_name, tool_version,
                    user_context, security_flags, compliance_status, execution_time_ms, memory_usage_mb,
                    network_calls, trace_id, span_id, parent_span_id, correlation_id, source_system,
                    source_host, source_service, data_classification, retention_days
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
                RETURNING id
            `;

            const values = [
                logEntry.timestamp, logEntry.unique_id, logEntry.process_id, logEntry.blueprint_version,
                logEntry.orbt_layer, logEntry.user_clearance, logEntry.log_level, logEntry.event_category,
                logEntry.event_type, logEntry.message, JSON.stringify(logEntry.structured_data),
                logEntry.tool_name, logEntry.tool_version, JSON.stringify(logEntry.user_context),
                logEntry.security_flags, logEntry.compliance_status, logEntry.execution_time_ms,
                logEntry.memory_usage_mb, logEntry.network_calls, logEntry.trace_id, logEntry.span_id,
                logEntry.parent_span_id, logEntry.correlation_id, logEntry.source_system,
                logEntry.source_host, logEntry.source_service, logEntry.data_classification,
                logEntry.retention_days
            ];

            const result = await client.query(query, values);
            return result.rows[0];

        } finally {
            client.release();
        }
    }

    async logSecurityViolationToTable(violationData) {
        const client = await this.dbPool.connect();
        try {
            const query = `
                INSERT INTO mantis_security_logs (
                    mantis_log_id, unique_id, process_id, violation_type, severity,
                    threat_level, source_ip, user_agent, automated_response, 
                    investigation_status, forensic_snapshot
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `;

            const values = [
                violationData.mantis_log_id, violationData.unique_id, violationData.process_id,
                violationData.violation_type, violationData.severity,
                this.assessThreatLevel(violationData.violation_type, violationData.severity),
                violationData.source_ip, violationData.user_agent,
                JSON.stringify(violationData.automated_response),
                'OPEN', JSON.stringify(violationData.violation_details)
            ];

            return await client.query(query, values);

        } finally {
            client.release();
        }
    }

    /**
     * Cleanup and Shutdown
     */
    async shutdown() {
        if (this.dbPool) {
            await this.dbPool.end();
        }
    }
}

// Export both the class and a default instance
module.exports = { MantisLogger };

// Create a default singleton instance for easy importing
const defaultLogger = new MantisLogger();
module.exports.logger = defaultLogger;

// Convenience exports for direct use
module.exports.log = (...args) => defaultLogger.log(...args);
module.exports.info = (...args) => defaultLogger.info(...args);
module.exports.warn = (...args) => defaultLogger.warn(...args);
module.exports.error = (...args) => defaultLogger.error(...args);
module.exports.fatal = (...args) => defaultLogger.fatal(...args);
module.exports.audit = (...args) => defaultLogger.audit(...args);