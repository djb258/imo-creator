#!/usr/bin/env node

/**
 * Middleware Extraction Script - Solo Developer Edition  
 * Extracts middleware components while preserving existing functionality
 */

const fs = require('fs');
const path = require('path');

const MCP_SERVERS_DIR = path.join(__dirname, '..', 'mcp-servers');

function generateValidatePayloadMiddleware() {
  return `/**
 * Payload validation middleware
 * Validates HEIR/ORBT required fields and tool-specific schema
 */

const fs = require('fs');
const path = require('path');

class PayloadValidator {
  constructor(toolManifestPath) {
    this.manifest = JSON.parse(fs.readFileSync(toolManifestPath, 'utf8'));
  }

  validate(req, res, next) {
    try {
      const payload = req.body;
      
      // Check required HEIR/ORBT fields
      const requiredFields = this.manifest.manifest.required_fields;
      
      for (const [field, schema] of Object.entries(requiredFields)) {
        if (!payload[field]) {
          return res.status(400).json({
            success: false,
            error: \`Missing required field: \${field}\`,
            compliance_violation: 'HEIR_ORBT_FIELD_MISSING'
          });
        }
        
        // Validate field format
        if (schema.pattern && !new RegExp(schema.pattern).test(payload[field])) {
          return res.status(400).json({
            success: false,
            error: \`Invalid format for field: \${field}\`,
            expected_pattern: schema.pattern,
            compliance_violation: 'HEIR_ORBT_FORMAT_INVALID'
          });
        }
        
        // Validate numeric ranges
        if (schema.type === 'integer') {
          const value = parseInt(payload[field]);
          if (schema.minimum && value < schema.minimum) {
            return res.status(400).json({
              success: false,
              error: \`Value too low for field: \${field}\`,
              compliance_violation: 'ORBT_LAYER_INSUFFICIENT'
            });
          }
          if (schema.maximum && value > schema.maximum) {
            return res.status(400).json({
              success: false,
              error: \`Value too high for field: \${field}\`,
              compliance_violation: 'ORBT_LAYER_EXCESSIVE'
            });
          }
        }
      }
      
      // Validate tool-specific fields
      const toolFields = this.manifest.manifest.tool_specific_fields;
      for (const [field, schema] of Object.entries(toolFields)) {
        if (schema.required && !payload[field]) {
          return res.status(400).json({
            success: false,
            error: \`Missing required tool field: \${field}\`,
            compliance_violation: 'TOOL_FIELD_MISSING'
          });
        }
        
        // Validate enum values
        if (schema.enum && payload[field] && !schema.enum.includes(payload[field])) {
          return res.status(400).json({
            success: false,
            error: \`Invalid value for field: \${field}\`,
            allowed_values: schema.enum,
            compliance_violation: 'TOOL_FIELD_INVALID'
          });
        }
      }
      
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Payload validation failed',
        details: error.message,
        compliance_violation: 'VALIDATION_SYSTEM_ERROR'
      });
    }
  }
}

module.exports = PayloadValidator;`;
}

function generateKillSwitchMiddleware() {
  return `/**
 * Kill Switch middleware
 * Checks for emergency kill switch activation
 */

const fs = require('fs');
const path = require('path');

const KILL_SWITCH_FILE = path.join(__dirname, '..', '..', 'mcp-doctrine-layer', 'emergency', '.kill-switch');

function checkKillSwitch(req, res, next) {
  // Check environment variable kill switch
  if (process.env.MCP_KILL_SWITCH === 'true') {
    return res.status(503).json({
      success: false,
      error: 'MCP Kill Switch Activated - All operations suspended',
      compliance_status: 'EMERGENCY_SHUTDOWN',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check file-based kill switch
  if (fs.existsSync(KILL_SWITCH_FILE)) {
    try {
      const killSwitchData = JSON.parse(fs.readFileSync(KILL_SWITCH_FILE, 'utf8'));
      if (killSwitchData.active === true) {
        return res.status(503).json({
          success: false,
          error: 'MCP Kill Switch Activated - All operations suspended',
          reason: killSwitchData.reason || 'Emergency shutdown',
          activated_at: killSwitchData.activated_at,
          compliance_status: 'EMERGENCY_SHUTDOWN'
        });
      }
    } catch (error) {
      // If kill switch file is corrupted, assume active for safety
      return res.status(503).json({
        success: false,
        error: 'Kill switch file corrupted - Safety shutdown activated',
        compliance_status: 'SAFETY_SHUTDOWN'
      });
    }
  }
  
  next();
}

module.exports = checkKillSwitch;`;
}

function generateLogToMantisMiddleware() {
  return `/**
 * Mantis Logging middleware
 * Automatic request/response logging with HEIR/ORBT compliance
 */

const { MantisLogger } = require('../../../mcp-doctrine-layer/logging/log_wrapper');

class MantisLoggingMiddleware {
  constructor(toolName, systemCode) {
    this.logger = new MantisLogger({
      service_name: \`\${toolName}-mcp-server\`,
      heir_system_code: systemCode
    });
  }

  logRequest(req, res, next) {
    const startTime = Date.now();
    
    // Extract HEIR/ORBT identifiers from request
    const uniqueId = req.body?.unique_id || 'SYSTEM-GENERATED';
    const processId = req.body?.process_id || 'SYSTEM-GENERATED';
    const orbtLayer = req.body?.orbt_layer || 5;
    
    // Log request start
    this.logger.info('MCP request received', {
      unique_id: uniqueId,
      process_id: processId,
      orbt_layer: orbtLayer,
      event_category: 'request_processing',
      event_type: 'request_start',
      structured_data: {
        endpoint: req.path,
        method: req.method,
        operation: req.body?.operation,
        user_agent: req.headers['user-agent'],
        source_ip: req.ip || req.connection.remoteAddress,
        content_length: req.headers['content-length']
      }
    });
    
    // Override res.json to log response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Log response
      this.logger.info('MCP request completed', {
        unique_id: uniqueId,
        process_id: processId,
        orbt_layer: orbtLayer,
        event_category: 'request_processing',
        event_type: 'request_complete',
        execution_time_ms: executionTime,
        structured_data: {
          status_code: res.statusCode,
          success: body.success !== false,
          operation: req.body?.operation,
          response_size: JSON.stringify(body).length,
          compliance_status: body.compliance_status || 'COMPLIANT'
        }
      });
      
      return originalJson(body);
    };
    
    // Override res.status().json() chain
    const originalStatus = res.status.bind(res);
    res.status = (code) => {
      const statusRes = originalStatus(code);
      const originalStatusJson = statusRes.json.bind(statusRes);
      
      statusRes.json = (body) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        
        // Log error response
        this.logger.error('MCP request failed', {
          unique_id: uniqueId,
          process_id: processId,
          orbt_layer: orbtLayer,
          event_category: 'request_processing',
          event_type: 'request_error',
          execution_time_ms: executionTime,
          structured_data: {
            status_code: code,
            error: body.error,
            operation: req.body?.operation,
            compliance_violation: body.compliance_violation
          }
        });
        
        return originalStatusJson(body);
      };
      
      return statusRes;
    };
    
    next();
  }
}

module.exports = MantisLoggingMiddleware;`;
}

async function extractMiddlewareForServer(serverName) {
  const serverDir = path.join(MCP_SERVERS_DIR, serverName);
  const middlewareDir = path.join(serverDir, 'middleware');
  
  if (!fs.existsSync(middlewareDir)) {
    console.log(`❌ Middleware directory not found for ${serverName}`);
    return;
  }
  
  console.log(`🔧 Extracting middleware for ${serverName}...`);
  
  // Create middleware files
  const validatePayloadPath = path.join(middlewareDir, 'validate_payload.js');
  const killSwitchPath = path.join(middlewareDir, 'kill_switch.js');
  const logToMantisPath = path.join(middlewareDir, 'log_to_mantis.js');
  
  fs.writeFileSync(validatePayloadPath, generateValidatePayloadMiddleware());
  fs.writeFileSync(killSwitchPath, generateKillSwitchMiddleware());
  fs.writeFileSync(logToMantisPath, generateLogToMantisMiddleware());
  
  console.log(`✅ Middleware extracted for ${serverName}`);
}

async function main() {
  console.log('🔧 MCP Middleware Extraction Starting...\n');
  
  // Get all servers that have middleware directories
  const servers = fs.readdirSync(MCP_SERVERS_DIR)
    .filter(dir => {
      const serverDir = path.join(MCP_SERVERS_DIR, dir);
      const middlewareDir = path.join(serverDir, 'middleware');
      return fs.statSync(serverDir).isDirectory() && 
             fs.existsSync(middlewareDir) &&
             dir !== 'shared';
    });
  
  console.log(`Found ${servers.length} servers with middleware directories:`);
  servers.forEach(s => console.log(`  - ${s}`));
  console.log('');
  
  // Process each server
  for (const server of servers) {
    await extractMiddlewareForServer(server);
  }
  
  console.log('\n✅ Middleware Extraction Complete!');
  console.log('\nGenerated:');
  console.log('  - validate_payload.js - HEIR/ORBT schema validation');
  console.log('  - kill_switch.js - Emergency shutdown checking');
  console.log('  - log_to_mantis.js - Structured logging middleware');
  console.log('\nNext step: Run node scripts/extract-tool-logic.js');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { extractMiddlewareForServer };