/**
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
            error: `Missing required field: ${field}`,
            compliance_violation: 'HEIR_ORBT_FIELD_MISSING'
          });
        }
        
        // Validate field format
        if (schema.pattern && !new RegExp(schema.pattern).test(payload[field])) {
          return res.status(400).json({
            success: false,
            error: `Invalid format for field: ${field}`,
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
              error: `Value too low for field: ${field}`,
              compliance_violation: 'ORBT_LAYER_INSUFFICIENT'
            });
          }
          if (schema.maximum && value > schema.maximum) {
            return res.status(400).json({
              success: false,
              error: `Value too high for field: ${field}`,
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
            error: `Missing required tool field: ${field}`,
            compliance_violation: 'TOOL_FIELD_MISSING'
          });
        }
        
        // Validate enum values
        if (schema.enum && payload[field] && !schema.enum.includes(payload[field])) {
          return res.status(400).json({
            success: false,
            error: `Invalid value for field: ${field}`,
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

module.exports = PayloadValidator;