# HEIR Unique ID Enforcement Protocol

**Classification:** System-Critical  
**Compliance:** HEIR Doctrine v2.1  
**Enforcement Level:** Mandatory  

## Overview

All MCP tool invocations within the IMO-Creator ecosystem MUST include a valid HEIR-compliant unique identifier. This ensures process traceability, prevents duplicate operations, and maintains audit trail integrity.

## Unique ID Format Specification

### Pattern
```regex
^HEIR-[0-9]{4}-[0-9]{2}-[A-Z]{3,8}-[A-Z]{2,6}-[0-9]{2}$
```

### Structure Breakdown
```
HEIR-YYYY-MM-SYSTEM-MODE-VN
```

**Components:**
- `HEIR`: Static prefix identifier
- `YYYY`: 4-digit year (e.g., 2024)
- `MM`: 2-digit month (01-12)
- `SYSTEM`: 3-8 character system code (A-Z)
- `MODE`: 2-6 character operation mode (A-Z)
- `VN`: 2-digit version number (01-99)

### Example Valid IDs
```
HEIR-2024-12-IMOCRT-DEPLOY-01
HEIR-2024-12-MCPBKND-EXEC-02
HEIR-2024-12-NEONWRT-BATCH-01
```

## Enforcement Mechanisms

### Pre-Execution Validation
1. **Format Check**: Regex pattern validation
2. **Date Validation**: Year/month within acceptable range
3. **System Code Lookup**: Verify against registered systems
4. **Uniqueness Check**: Ensure ID not previously used
5. **Version Consistency**: Validate version increments

### Generation Requirements
```javascript
// Valid generation pattern
const generateHEIRId = (systemCode, mode, version = 1) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const versionStr = String(version).padStart(2, '0');
  
  return `HEIR-${year}-${month}-${systemCode}-${mode}-${versionStr}`;
};
```

## Violation Response Protocol

### Level 1: Format Violation
- **Action**: Immediate tool call rejection
- **Response**: Return format error with specification
- **Logging**: Log violation attempt with client details
- **Escalation**: None required

### Level 2: Duplicate ID Detection
- **Action**: Tool call rejection with warning
- **Response**: Return duplicate error with original usage timestamp
- **Logging**: Log duplicate attempt with both occurrences
- **Escalation**: Alert ORBT monitoring system

### Level 3: System Code Unauthorized
- **Action**: Immediate kill switch activation
- **Response**: Return security violation error
- **Logging**: Full audit trail with client identification
- **Escalation**: Trigger ORBT repair protocol

## Integration Points

### Tool Manifest Validation
```json
{
  "required_fields": {
    "unique_id": {
      "type": "string",
      "pattern": "^HEIR-[0-9]{4}-[0-9]{2}-[A-Z]{3,8}-[A-Z]{2,6}-[0-9]{2}$",
      "validation": "heir_unique_id_enforcer"
    }
  }
}
```

### Mantis Logging Integration
```json
{
  "heir_id_validation": {
    "unique_id": "HEIR-2024-12-SYSTEM-MODE-01",
    "validation_status": "passed",
    "timestamp": "2024-12-29T10:30:00Z",
    "validator_version": "v2.1.0"
  }
}
```

## Compliance Monitoring

### Metrics Tracked
- Total unique IDs generated per system
- Format violation attempts per hour
- Duplicate ID detection rate
- System code authorization failures

### Alert Thresholds
- **Warning**: >5 format violations per minute
- **Critical**: >1 duplicate ID per hour
- **Emergency**: >0 unauthorized system codes

## System Code Registry

### Approved System Codes
- `IMOCRT`: IMO Creator main system
- `MCPBKND`: MCP Backend operations
- `NEONWRT`: Neon database writer
- `APFYSC`: Apify scraper operations
- `EMLVAL`: Email validation utility

### Registration Process
1. Submit system code request via HEIR compliance board
2. Provide technical justification and usage patterns
3. Complete security review and approval
4. Add to authorized system registry
5. Deploy with version tracking

---

**Critical Notice**: Violations of this protocol may result in immediate system isolation and executive review. This enforcement is non-negotiable and system-wide.