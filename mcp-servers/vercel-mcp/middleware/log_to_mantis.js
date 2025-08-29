/**
 * Mantis Logging middleware
 * Automatic request/response logging with HEIR/ORBT compliance
 */

const { MantisLogger } = require('../../../mcp-doctrine-layer/logging/log_wrapper');

class MantisLoggingMiddleware {
  constructor(toolName, systemCode) {
    this.logger = new MantisLogger({
      service_name: `${toolName}-mcp-server`,
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

module.exports = MantisLoggingMiddleware;