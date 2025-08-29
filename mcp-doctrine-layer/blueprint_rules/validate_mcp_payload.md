# MCP Payload Validation Protocol

**Classification:** System-Critical  
**Compliance:** HEIR Doctrine v2.1 + ORBT Policy Framework v3.2  
**Enforcement Level:** Mandatory Pre-Execution  

## Overview

All MCP tool payloads undergo comprehensive validation before execution. This protocol ensures data integrity, security compliance, and system stability across all tool invocations.

## Validation Pipeline

### Stage 1: Schema Validation
```javascript
const validatePayloadSchema = (payload, toolManifest) => {
  const validator = new PayloadValidator(toolManifest);
  
  const result = validator.validate(payload);
  if (!result.valid) {
    throw new ValidationError('SCHEMA_VIOLATION', {
      errors: result.errors,
      tool: toolManifest.tool_name,
      timestamp: new Date().toISOString()
    });
  }
  
  return { stage: 'SCHEMA_VALID', payload };
};
```

### Stage 2: HEIR Compliance Check
```javascript
const validateHEIRCompliance = (payload) => {
  const { unique_id, process_id, blueprint_version } = payload;
  
  // Unique ID format validation
  if (!HEIR_ID_REGEX.test(unique_id)) {
    throw new HEIRViolation('INVALID_UNIQUE_ID', { provided: unique_id });
  }
  
  // Process ID lineage check
  if (!ProcessRegistry.isValidLineage(process_id, unique_id)) {
    throw new HEIRViolation('INVALID_PROCESS_LINEAGE', {
      process_id,
      unique_id,
      expected_parent: ProcessRegistry.getExpectedParent(unique_id)
    });
  }
  
  // Blueprint version consistency
  if (!BlueprintRegistry.isConsistentVersion(blueprint_version)) {
    throw new HEIRViolation('BLUEPRINT_VERSION_MISMATCH', {
      provided: blueprint_version,
      current: BlueprintRegistry.getCurrentVersion()
    });
  }
  
  return { stage: 'HEIR_COMPLIANT', payload };
};
```

### Stage 3: ORBT Layer Authorization
```javascript
const validateORBTAuthorization = (payload, userContext) => {
  const { orbt_layer } = payload;
  const { user_clearance } = userContext;
  
  if (user_clearance > orbt_layer) {
    throw new ORBTViolation('INSUFFICIENT_CLEARANCE', {
      required_layer: orbt_layer,
      user_clearance: user_clearance
    });
  }
  
  // Check for escalation requirements
  if (RequiresEscalation(payload, orbt_layer)) {
    return {
      stage: 'ORBT_ESCALATION_REQUIRED',
      escalation_path: getEscalationPath(orbt_layer),
      payload
    };
  }
  
  return { stage: 'ORBT_AUTHORIZED', payload };
};
```

### Stage 4: Security Sanitization
```javascript
const sanitizePayload = (payload, toolSecurity) => {
  const sanitized = { ...payload };
  
  // SQL injection protection
  if (toolSecurity.sql_injection_check) {
    sanitized.query = sanitizeSQL(sanitized.query);
  }
  
  // XSS protection
  if (toolSecurity.xss_protection) {
    sanitized = sanitizeXSS(sanitized);
  }
  
  // PII scrubbing
  if (toolSecurity.pii_scrubbing === 'mandatory') {
    sanitized = scrubPII(sanitized);
  }
  
  // URL validation
  if (toolSecurity.validate_urls) {
    sanitized = validateAndSanitizeURLs(sanitized);
  }
  
  return { stage: 'SECURITY_SANITIZED', payload: sanitized };
};
```

## Validation Rules Matrix

### Required Field Validation
| Field | Type | Validation | Error Response |
|-------|------|------------|----------------|
| `unique_id` | string | HEIR ID Regex | `INVALID_UNIQUE_ID` |
| `process_id` | string | Process Lineage | `INVALID_PROCESS_LINEAGE` |
| `orbt_layer` | integer | Layer Authorization | `INSUFFICIENT_CLEARANCE` |
| `blueprint_version` | string | Version Consistency | `BLUEPRINT_VERSION_MISMATCH` |

### Tool-Specific Field Validation
```json
{
  "validation_rules": {
    "database_operations": {
      "query": {
        "max_length": 4096,
        "forbidden_keywords": ["DROP", "DELETE", "TRUNCATE", "ALTER"],
        "injection_check": "mandatory"
      },
      "table_name": {
        "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$",
        "max_length": 64
      }
    },
    "external_api_operations": {
      "url": {
        "protocol": ["https"],
        "domain_allowlist": "enforced",
        "port_restrictions": [80, 443]
      },
      "headers": {
        "forbidden_headers": ["X-Forwarded-For", "X-Real-IP"],
        "max_header_count": 20
      }
    },
    "file_operations": {
      "file_path": {
        "forbidden_patterns": ["../", "~/", "/etc/", "/root/"],
        "max_depth": 5
      },
      "file_size": {
        "max_bytes": 10485760
      }
    }
  }
}
```

## Error Response Specifications

### Validation Error Format
```json
{
  "error_type": "VALIDATION_FAILED",
  "error_code": "SCHEMA_VIOLATION",
  "timestamp": "2024-12-29T10:30:00Z",
  "tool_name": "neon_writer",
  "unique_id": "HEIR-2024-12-NEONWRT-BATCH-01",
  "validation_stage": "SCHEMA_VALIDATION",
  "details": {
    "field": "query",
    "violation": "FORBIDDEN_KEYWORD",
    "value_hash": "sha256:a1b2c3d4...",
    "expected": "SELECT/INSERT/UPDATE operations only"
  },
  "mitigation": {
    "action": "SANITIZE_AND_RETRY",
    "suggested_fix": "Remove forbidden keywords from query"
  }
}
```

### HEIR Violation Response
```json
{
  "error_type": "HEIR_VIOLATION",
  "error_code": "INVALID_UNIQUE_ID", 
  "severity": "HIGH",
  "unique_id_provided": "INVALID-ID-FORMAT",
  "expected_format": "HEIR-YYYY-MM-SYSTEM-MODE-VN",
  "example": "HEIR-2024-12-NEONWRT-BATCH-01",
  "compliance_status": "NON_COMPLIANT",
  "escalation": "SECURITY_TEAM_ALERT"
}
```

### ORBT Violation Response
```json
{
  "error_type": "ORBT_VIOLATION",
  "error_code": "INSUFFICIENT_CLEARANCE",
  "severity": "CRITICAL",
  "requested_layer": 2,
  "user_clearance": 5,
  "required_approval": "SENIOR_MANAGEMENT",
  "escalation_path": "department_head_approval",
  "compliance_status": "AUTHORIZATION_REQUIRED"
}
```

## Performance Optimization

### Validation Caching
```javascript
const ValidationCache = {
  // Cache HEIR ID validations for 1 hour
  cacheHEIRValidation: (unique_id, validation_result) => {
    cache.set(`heir:${unique_id}`, validation_result, 3600);
  },
  
  // Cache blueprint version checks for 30 minutes
  cacheBlueprintVersion: (version, validation_result) => {
    cache.set(`blueprint:${version}`, validation_result, 1800);
  }
};
```

### Batch Validation
```javascript
const validatePayloadBatch = async (payloads, toolManifest) => {
  const validationPromises = payloads.map(payload => 
    validateSinglePayload(payload, toolManifest)
  );
  
  const results = await Promise.allSettled(validationPromises);
  
  return {
    successful: results.filter(r => r.status === 'fulfilled'),
    failed: results.filter(r => r.status === 'rejected'),
    total: payloads.length
  };
};
```

## Integration Points

### Mantis Logging Integration
```json
{
  "payload_validation": {
    "unique_id": "HEIR-2024-12-NEONWRT-BATCH-01",
    "validation_stages": [
      { "stage": "SCHEMA_VALIDATION", "status": "PASSED", "duration_ms": 12 },
      { "stage": "HEIR_COMPLIANCE", "status": "PASSED", "duration_ms": 8 },
      { "stage": "ORBT_AUTHORIZATION", "status": "PASSED", "duration_ms": 15 },
      { "stage": "SECURITY_SANITIZATION", "status": "PASSED", "duration_ms": 23 }
    ],
    "total_validation_time_ms": 58,
    "validation_result": "APPROVED_FOR_EXECUTION"
  }
}
```

### Kill Switch Integration
```javascript
const validateWithKillSwitch = async (payload, toolManifest) => {
  try {
    return await validatePayload(payload, toolManifest);
  } catch (error) {
    if (error.severity === 'CRITICAL' || error.type === 'SECURITY_VIOLATION') {
      await triggerKillSwitch(error, payload);
    }
    throw error;
  }
};
```

---

**Security Notice**: Payload validation is the first line of defense against malicious tool usage. All validation bypasses require executive authorization and full audit trail.