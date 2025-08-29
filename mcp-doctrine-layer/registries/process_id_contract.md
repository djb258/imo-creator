# Process ID Contract Specification

**Classification:** System-Critical  
**Compliance:** HEIR Doctrine v2.1 + ORBT Policy Framework v3.2  
**Contract Version:** 1.0.0  

## Overview

The Process ID Contract defines the authoritative specification for process tracking across all MCP tool invocations. This contract ensures process lineage integrity, execution traceability, and compliance with HEIR/ORBT governance frameworks.

## Process ID Format Specification

### Standard Format
```regex
^PRC-[A-Z0-9]{8}-[0-9]{13}$
```

### Structure Breakdown
```
PRC-SYSTCODE-EPOCHTIMESTAMP
```

**Components:**
- `PRC`: Static process identifier prefix
- `SYSTCODE`: 8-character alphanumeric system code (A-Z, 0-9)
- `EPOCHTIMESTAMP`: 13-digit Unix epoch timestamp (milliseconds)

### Example Valid Process IDs
```
PRC-IMOCRT01-1703851800000
PRC-MCPBK002-1703851801250
PRC-NEONWR01-1703851802500
```

## Contract Obligations

### 1. Process ID Generation Contract
```typescript
interface ProcessIDGenerator {
  generateProcessID(systemCode: string, parentProcessID?: string): Promise<ProcessID>;
  validateProcessID(processID: string): ValidationResult;
  linkProcessLineage(processID: string, parentProcessID: string): Promise<void>;
}

type ProcessID = string & { __brand: 'ProcessID' };
type SystemCode = string & { __brand: 'SystemCode' };

const ProcessIDContract = {
  // MANDATORY: All systems MUST implement this interface
  generate: async (systemCode: SystemCode): Promise<ProcessID> => {
    const timestamp = Date.now().toString();
    const paddedSystemCode = systemCode.padEnd(8, '0').substring(0, 8);
    return `PRC-${paddedSystemCode}-${timestamp}` as ProcessID;
  },
  
  // MANDATORY: All process IDs MUST be validated before use
  validate: (processID: string): boolean => {
    const regex = /^PRC-[A-Z0-9]{8}-[0-9]{13}$/;
    return regex.test(processID);
  },
  
  // MANDATORY: All process relationships MUST be tracked
  trackLineage: async (processID: ProcessID, parentProcessID?: ProcessID): Promise<void> => {
    await ProcessLineageRegistry.register(processID, parentProcessID);
  }
};
```

### 2. Process Lifecycle Contract
```typescript
interface ProcessLifecycle {
  // MANDATORY: Process creation with HEIR compliance
  createProcess(params: {
    uniqueID: HEIR_UniqueID;
    systemCode: SystemCode;
    orbtLayer: ORBTLayer;
    blueprintVersion: BlueprintVersion;
    parentProcessID?: ProcessID;
  }): Promise<ProcessID>;
  
  // MANDATORY: Process execution tracking
  startExecution(processID: ProcessID, toolName: string): Promise<void>;
  updateProgress(processID: ProcessID, progress: ProcessProgress): Promise<void>;
  completeExecution(processID: ProcessID, result: ExecutionResult): Promise<void>;
  
  // MANDATORY: Process termination with audit trail
  terminateProcess(processID: ProcessID, reason: TerminationReason): Promise<void>;
}
```

### 3. Process State Contract
```typescript
enum ProcessState {
  CREATED = 'CREATED',
  PENDING = 'PENDING', 
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ABORTED = 'ABORTED',
  SUSPENDED = 'SUSPENDED'
}

interface ProcessContext {
  processID: ProcessID;
  uniqueID: HEIR_UniqueID;
  state: ProcessState;
  orbtLayer: ORBTLayer;
  blueprintVersion: BlueprintVersion;
  parentProcessID?: ProcessID;
  childProcessIDs: ProcessID[];
  metadata: {
    createdAt: ISO8601Timestamp;
    startedAt?: ISO8601Timestamp;
    completedAt?: ISO8601Timestamp;
    lastUpdated: ISO8601Timestamp;
  };
  compliance: {
    heirCompliant: boolean;
    orbtAuthorized: boolean;
    auditTrailComplete: boolean;
  };
}
```

## Implementation Requirements

### System Code Registration
```sql
-- All system codes MUST be pre-registered
INSERT INTO system_code_registry (system_code, system_name, owner_department) VALUES
('IMOCRT01', 'IMO Creator Main Process', 'Engineering'),
('MCPBK001', 'MCP Backend Primary', 'Engineering'), 
('MCPBK002', 'MCP Backend Secondary', 'Engineering'),
('NEONWR01', 'Neon Writer Primary', 'Data Engineering'),
('APFYSC01', 'Apify Scraper Primary', 'Data Engineering'),
('EMLVAL01', 'Email Validator', 'Engineering');
```

### Process Lineage Tracking
```javascript
class ProcessLineageTracker {
  async registerProcess(processID, parentProcessID = null) {
    // MANDATORY: All processes MUST be registered
    await db.query(`
      INSERT INTO process_lineage (process_id, parent_process_id, created_at, status)
      VALUES ($1, $2, NOW(), 'CREATED')
    `, [processID, parentProcessID]);
    
    // MANDATORY: Lineage depth validation (max 10 levels)
    const depth = await this.calculateLineageDepth(processID);
    if (depth > 10) {
      throw new LineageViolation('EXCESSIVE_NESTING', { processID, depth });
    }
  }
  
  async validateLineageIntegrity(processID) {
    // MANDATORY: Orphaned process detection
    const hasValidParent = await this.hasValidParentage(processID);
    if (!hasValidParent) {
      throw new LineageViolation('ORPHANED_PROCESS', { processID });
    }
    
    return { valid: true, processID };
  }
}
```

## Compliance Validation

### Pre-Execution Validation
```javascript
const validateProcessIDCompliance = async (processID, context) => {
  const validations = [
    // Format validation
    () => ProcessIDContract.validate(processID),
    
    // System code authorization 
    () => SystemCodeRegistry.isAuthorized(extractSystemCode(processID)),
    
    // Lineage integrity
    () => ProcessLineageTracker.validateLineageIntegrity(processID),
    
    // Timestamp validation (not future, not too old)
    () => validateTimestamp(extractTimestamp(processID)),
    
    // ORBT layer consistency
    () => validateORBTLayerConsistency(processID, context.orbtLayer)
  ];
  
  for (const validation of validations) {
    const result = await validation();
    if (!result.valid) {
      throw new ProcessIDViolation(result.error, { processID, context });
    }
  }
  
  return { status: 'PROCESS_ID_COMPLIANT', processID };
};
```

## Error Handling Contract

### Violation Response Matrix
```typescript
enum ProcessIDViolation {
  INVALID_FORMAT = 'INVALID_FORMAT',
  UNAUTHORIZED_SYSTEM_CODE = 'UNAUTHORIZED_SYSTEM_CODE',
  TIMESTAMP_OUT_OF_RANGE = 'TIMESTAMP_OUT_OF_RANGE',
  LINEAGE_INTEGRITY_FAILURE = 'LINEAGE_INTEGRITY_FAILURE',
  DUPLICATE_PROCESS_ID = 'DUPLICATE_PROCESS_ID',
  ORPHANED_PROCESS = 'ORPHANED_PROCESS',
  EXCESSIVE_NESTING = 'EXCESSIVE_NESTING'
}

const ViolationResponseMap = {
  [ProcessIDViolation.INVALID_FORMAT]: {
    action: 'REJECT_WITH_FORMAT_GUIDANCE',
    severity: 'HIGH',
    escalation: 'NONE'
  },
  [ProcessIDViolation.UNAUTHORIZED_SYSTEM_CODE]: {
    action: 'IMMEDIATE_KILL_SWITCH',
    severity: 'CRITICAL', 
    escalation: 'SECURITY_TEAM_ALERT'
  },
  [ProcessIDViolation.LINEAGE_INTEGRITY_FAILURE]: {
    action: 'PROCESS_REPAIR_ATTEMPT',
    severity: 'HIGH',
    escalation: 'ORBT_REPAIR_PROTOCOL'
  }
};
```

## Integration Specifications

### Mantis Logging Integration
```json
{
  "process_id_contract_compliance": {
    "process_id": "PRC-IMOCRT01-1703851800000",
    "validation_results": {
      "format_valid": true,
      "system_code_authorized": true,
      "lineage_integrity": true,
      "timestamp_valid": true,
      "orbt_consistency": true
    },
    "lineage_context": {
      "parent_process_id": "PRC-IMOCRT01-1703851799000",
      "lineage_depth": 3,
      "child_processes": []
    },
    "compliance_status": "FULLY_COMPLIANT"
  }
}
```

### Kill Switch Integration
```javascript
const ProcessIDKillSwitch = {
  triggers: [
    'UNAUTHORIZED_SYSTEM_CODE',
    'LINEAGE_INTEGRITY_FAILURE',
    'EXCESSIVE_NESTING'
  ],
  
  async execute(violation, processID, context) {
    // Immediate process termination
    await ProcessRegistry.terminateProcess(processID, violation);
    
    // Cascade termination to child processes
    const childProcesses = await ProcessLineageTracker.getChildProcesses(processID);
    await Promise.all(childProcesses.map(child => 
      ProcessRegistry.terminateProcess(child, 'PARENT_PROCESS_VIOLATION')
    ));
    
    // Trigger ORBT repair protocol
    await ORBTRepairProtocol.trigger(violation, { processID, context });
    
    // Alert security team
    await SecurityAlert.send('PROCESS_ID_VIOLATION', { violation, processID });
  }
};
```

## Performance Requirements

### Response Time SLAs
- **Process ID Generation**: < 10ms
- **Process ID Validation**: < 5ms
- **Lineage Tracking**: < 50ms
- **Compliance Validation**: < 100ms

### Scalability Requirements
- **Concurrent Processes**: Support up to 10,000 active processes
- **Process ID Generation Rate**: 1,000 IDs per second
- **Lineage Query Performance**: < 100ms for depth ≤ 10

### Reliability Requirements
- **Process ID Uniqueness**: 100% guaranteed (no duplicates)
- **Lineage Integrity**: 99.99% consistency
- **System Availability**: 99.95% uptime

---

**Contract Authority**: This contract is enforced by executive mandate and system-wide compliance monitoring. Violations may result in immediate system isolation and disciplinary action.