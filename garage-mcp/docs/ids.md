# Garage-MCP ID System
## Unified Identification Standards with HEIR Integration

---

## Overview
The Garage-MCP ID system provides deterministic, hierarchical identification for all system entities. This system is fully compatible with HEIR doctrine numbering while adding operational identifiers for process tracking.

---

## Core ID Formats

### 1. Unique ID Format
**Pattern:** `<db_code>-<hive><subhive>-<entity>-<YYYYMMDD>-<ULID26>`

**Components:**
- `db_code`: 2-3 character database identifier (e.g., SHQ, CLT, PAY)
- `hive`: 2-digit hive code (01-99)
- `subhive`: 2-digit subhive code (00-99)
- `entity`: Entity type code (3-6 characters)
- `YYYYMMDD`: Date stamp
- `ULID26`: 26-character ULID for uniqueness

**Examples:**
- `SHQ-0101-USER-20250819-01J5X4K8Z9ABCDEFGHJKMNPQRST`
- `CLT-0203-ORDER-20250819-01J5X4K8Z9ABCDEFGHJKMNPQRST`

### 2. Process ID Format
**Pattern:** `PROC-<plan_id>-<YYYYMMDD>-<HHMMSS>-<seq>`

**Regex:** `^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$`

**Components:**
- `PROC`: Fixed prefix
- `plan_id`: Lowercase alphanumeric plan identifier
- `YYYYMMDD`: Date component
- `HHMMSS`: Time component
- `seq`: Sequential number (3-6 digits, zero-padded)

**Examples:**
- `PROC-clients_intake-20250819-143052-001`
- `PROC-payment_flow-20250819-090000-000342`

### 3. Idempotency Key Format
**Pattern:** `IDEM-<process_id>`

**Regex:** `^IDEM-PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$`

**Examples:**
- `IDEM-PROC-clients_intake-20250819-143052-001`
- `IDEM-PROC-payment_flow-20250819-090000-000342`

---

## HEIR Doctrine Section Numbers
The system respects HEIR's existing doctrine numbering:

**Format:** `[database].[subhive].[subsubhive].[section].[sequence]`

**Examples from HEIR doctrine:**
- `1.05.00.10.009` - Section Number Format doctrine
- `1.2.1.33.001` - ORBT Diagnostic Mode
- `1.2.1.32.004` - Universal Rule 4 (centralized error routing)
- `2.1.2.0.231` - Conditional Autonomy doctrine

### Section Range Categories
- **10–19:** Structure/Format rules
- **20–29:** Process operations
- **30–39:** Compliance requirements
- **40–49:** Monitoring protocols
- **50–59:** Security standards

---

## Generation Rules

### Process ID Generation
1. Obtain exclusive lock on `shq.process_seq` table
2. Get next sequence for plan_id + date combination
3. Format as `PROC-{plan_id}-{date}-{time}-{seq}`
4. Store in `shq.process_registry` for audit

### Unique ID Generation
1. Generate ULID using standard algorithm
2. Combine with entity metadata
3. Format as `{db}-{hive}{subhive}-{entity}-{date}-{ulid}`
4. Store in `shq.id_registry` for uniqueness check

### Idempotency Key Generation
1. Take complete process_id
2. Prepend with `IDEM-`
3. Use for duplicate request detection

---

## Storage Tables

### ID Registry (`shq.id_registry`)
Stores all generated unique IDs for deduplication:
- `unique_id`: Primary key
- `entity_type`: Type of entity
- `created_at`: Generation timestamp
- `metadata`: Additional context

### Process Registry (`shq.process_registry`)
Tracks all process executions:
- `process_id`: Primary key
- `plan_id`: Associated plan
- `started_at`: Process start time
- `completed_at`: Process end time
- `status`: Current status
- `idempotency_key`: For duplicate detection

### Process Sequence (`shq.process_seq`)
Manages atomic sequence generation:
- `plan_id`: Plan identifier
- `date`: Date component
- `last_seq`: Last issued sequence
- `updated_at`: Last update time

---

## Compatible Extensions

### Error IDs
For HEIR error logging compatibility:
`ERR-<process_id>-<uuid8>`

### Agent IDs
For agent identification:
`AGT-<role>-<altitude>-<version>`

### Blueprint IDs
For plan identification:
`BLP-<domain>-<name>-<version>`

---

## Usage Examples

### Python ID Generation
```python
from scripts.id_tools import (
    make_unique_id,
    make_process_id,
    make_idempotency_key
)

# Generate unique ID
unique_id = make_unique_id(
    db_code='SHQ',
    hive='01',
    subhive='01',
    entity='USER'
)

# Generate process ID
process_id = make_process_id(
    plan_id='clients_intake'
)

# Generate idempotency key
idem_key = make_idempotency_key(process_id)
```

### SQL ID Generation
```sql
-- Generate process ID
SELECT shq.next_process_id('clients_intake');

-- Check uniqueness
SELECT shq.is_unique_id('SHQ-0101-USER-20250819-...');

-- Get idempotency key
SELECT 'IDEM-' || process_id FROM shq.process_registry;
```

---

## Validation

### Process ID Validation
```javascript
const processIdRegex = /^PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$/;
const isValid = processIdRegex.test(processId);
```

### Idempotency Key Validation
```javascript
const idemKeyRegex = /^IDEM-PROC-[a-z0-9_]+-\d{8}-\d{6}-\d{3,6}$/;
const isValid = idemKeyRegex.test(idempotencyKey);
```

### Unique ID Validation
```python
import re

pattern = r'^[A-Z]{2,3}-\d{4}-[A-Z]{3,6}-\d{8}-[0-9A-Z]{26}$'
is_valid = bool(re.match(pattern, unique_id))
```

---

## Best Practices

1. **Always validate IDs** before storage or use
2. **Use idempotency keys** for all state-changing operations
3. **Store process context** with all generated IDs
4. **Maintain audit trail** in registry tables
5. **Check uniqueness** before ID assignment
6. **Use atomic sequences** for process IDs
7. **Include metadata** for troubleshooting

---

*This ID system ensures deterministic, traceable identification across all Garage-MCP operations while maintaining full compatibility with HEIR doctrine numbering standards.*