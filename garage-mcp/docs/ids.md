# HEIR-Aligned ID System for Garage-MCP

## Overview
This document defines the ID numbering system that aligns with HEIR (Hierarchical Error-handling, ID management, and Reporting) doctrine while integrating with Garage-MCP's orchestration capabilities.

## ID Format Specifications

### unique_id Format
```
<db_code>-<hive><subhive>-<entity>-<YYYYMMDD>-<ULID26>
```

**Components:**
- `db_code`: Database identifier (e.g., "shq", "prod", "test")
- `hive`: Primary domain (2 digits, e.g., "03")  
- `subhive`: Subdomain (2 digits, e.g., "01")
- `entity`: Entity type (e.g., "blueprint", "process", "agent")
- `YYYYMMDD`: Creation date
- `ULID26`: 26-character ULID for uniqueness

**Examples:**
```
shq-0301-blueprint-20250819-01HXMZK9QJRW8P3N2VXKDT7YSZ
prod-0302-process-20250819-01HXMZKA1MFGX9T8QWER2BASDT  
test-0303-agent-20250819-01HXMZKB2NGHT4R9LQWE3CDSFR
```

### process_id Format
```
PROC-<plan_id>-<YYYYMMDD>-<HHMMSS>-<seq3..6>
```

**Components:**
- `PROC`: Fixed prefix
- `plan_id`: Plan identifier (alphanumeric + underscore)
- `YYYYMMDD`: Execution date
- `HHMMSS`: Execution time  
- `seq3..6`: Sequential number (3-6 digits)

**Examples:**
```
PROC-altitude_orchestration-20250819-143022-001
PROC-client_intake-20250819-143025-002
PROC-data_migration_v2-20250819-143030-1001
```

### idempotency_key Format
```
IDEM-<process_id>
```

**Components:**
- `IDEM`: Fixed prefix
- `process_id`: Full process ID (see above)

**Examples:**
```
IDEM-PROC-altitude_orchestration-20250819-143022-001
IDEM-PROC-client_intake-20250819-143025-002
```

## Authoritative Regex Patterns

### process_id Validation
```regex
^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$
```

### idempotency_key Validation  
```regex
^IDEM-PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$
```

### unique_id Validation
```regex
^[a-z0-9]+-\d{4}-[a-z0-9_]+-\d{8}-[0-9A-HJKMNP-TV-Z]{26}$
```

## Generation Rules

### Deterministic Generation
1. **Process Sequence**: Use atomic database sequence per plan_id and date
2. **ULID Generation**: Use standard ULID library with current timestamp
3. **Date Formatting**: Always use UTC timezone for consistency
4. **Plan ID Normalization**: Lowercase, replace spaces with underscores

### Storage Requirements
- `shq.id_registry`: Vault for unique_id tracking
- `shq.process_seq`: Atomic sequence generation  
- `shq.process_registry`: Process audit trail
- `shq.master_error_log`: Error tracking with ID correlation

## Integration with Orchestration

### HDO (Hierarchical Data Object)
```json
{
  "process_id": "PROC-altitude_orchestration-20250819-143022-001",
  "meta": {
    "idempotency_key": "IDEM-PROC-altitude_orchestration-20250819-143022-001",
    "plan_id": "altitude_orchestration",
    "plan_version": "1.0.0",
    "plan_hash": "sha256:abc123..."
  }
}
```

### Error Correlation
Every error in `shq.master_error_log` includes:
- `process_id`: Links to orchestration execution
- `error_id`: Unique identifier for error instance  
- `blueprint_id`: Associated blueprint/plan
- `agent_id`: Responsible agent/orchestrator

### Altitude Mapping
- **30k**: `overall-orchestrator` (process routing)
- **20k**: `input-orchestrator` (intake processing)
- **10k**: `middle-orchestrator` (business logic)
- **5k**: `output-orchestrator` (result delivery)

## Compatible Extensions

### HEIR Semantic Extensions
- **Strike Escalation**: Track success rates (85%/95%/100%)
- **Agent Hierarchies**: Map agents to altitude levels
- **Domain Boundaries**: Enforce tool namespace restrictions
- **Compliance Metrics**: Automated HEIR doctrine validation

### Garage-MCP Specific
- **Bay Integration**: Map bays to hive/subhive structure
- **Tool Namespace**: Align with existing core/intake/domains
- **Driver Abstraction**: Support multiple database backends
- **Event Correlation**: Link MCP events to process IDs

## Implementation Notes

### Database Tables
```sql
-- ID Registry (unique_id vault)
CREATE TABLE shq.id_registry (
    unique_id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Process Sequence (atomic generation)  
CREATE TABLE shq.process_seq (
    plan_id TEXT NOT NULL,
    date_key TEXT NOT NULL,
    last_seq INTEGER DEFAULT 0,
    PRIMARY KEY (plan_id, date_key)
);

-- Process Registry (audit trail)
CREATE TABLE shq.process_registry (
    process_id TEXT PRIMARY KEY, 
    plan_id TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'running',
    hdo_snapshot JSONB
);
```

### Generation Functions
```python
def generate_process_id(plan_id: str) -> str:
    """Generate HEIR-compliant process ID with atomic sequence"""
    
def generate_idempotency_key(process_id: str) -> str:
    """Generate idempotency key from process ID"""
    
def generate_unique_id(db_code: str, hive: str, subhive: str, entity: str) -> str:
    """Generate unique ID with ULID component"""
```

This ID system ensures full compatibility with HEIR doctrine while supporting Garage-MCP's orchestration and error handling requirements.