# HEIR/ORBT Utilities

Version: 1.0.0  
Date: 2025-10-23  
Status: Production Ready

## Overview

This package provides utilities for generating and validating HEIR (Hierarchical Enterprise Integration Resource) and ORBT (Operational Resource Behavior Tracking) identifiers compliant with the Barton Doctrine.

## Purpose

The HEIR/ORBT system provides:
- **Unique tracking** across all system operations
- **Standardized payload format** for external API integrations
- **Layer-based organization** of operational resources
- **Audit trail** for debugging and compliance

## HEIR ID Format

```
HEIR-YYYY-MM-SYSTEM-MODE-VN
```

- **YYYY**: 4-digit year
- **MM**: 2-digit month (zero-padded)
- **SYSTEM**: System identifier (uppercase, e.g., 'IMO', 'ACTION')
- **MODE**: Operation mode (uppercase, e.g., 'CREATOR', 'VALIDATE')
- **VN**: 2-digit version number (zero-padded)

**Example**: `HEIR-2025-10-IMO-CREATOR-01`

## Process ID Format

```
PRC-SYSTEM-EPOCHTIMESTAMP
```

- **SYSTEM**: System identifier (uppercase)
- **EPOCHTIMESTAMP**: Unix epoch timestamp in milliseconds

**Example**: `PRC-IMO-1729651200000`

## ORBT Layers

The ORBT system defines 4 operational layers:

| Layer | Name | Description |
|-------|------|-------------|
| 1 | Input/Intake | Data ingestion and validation |
| 2 | Processing/Middle | Data transformation and enrichment |
| 3 | Output/Generation | Result creation and formatting |
| 4 | Orchestration | System-level coordination |

## Payload Structure

All external API calls via Composio MCP must use this payload format:

```json
{
  "tool": "tool_name",
  "data": { "tool": "specific_data" },
  "unique_id": "HEIR-2025-10-IMO-ACTION-01",
  "process_id": "PRC-ACTION-1729651200000",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

## Usage

### JavaScript/Node.js

```javascript
const HeirGenerator = require('./heir-generator');

// Generate IDs
const heirId = HeirGenerator.generateHeirId('IMO', 'CREATOR', 1);
const processId = HeirGenerator.generateProcessId('IMO');

// Generate complete payload
const payload = HeirGenerator.generatePayload(
    'apify_run_actor',
    { actorId: 'apify~leads-finder' },
    'IMO',
    'ACTION',
    2,  // ORBT layer
    '1.0',  // Blueprint version
    1  // Version number
);

// Validate payload
try {
    HeirGenerator.validatePayload(payload);
    console.log('✅ Valid payload');
} catch (error) {
    console.error('❌ Invalid:', error.message);
}
```

### Python

```python
from heir_generator import HeirGenerator

# Generate IDs
heir_id = HeirGenerator.generate_heir_id('IMO', 'CREATOR', 1)
process_id = HeirGenerator.generate_process_id('IMO')

# Generate complete payload
payload = HeirGenerator.generate_payload(
    'apify_run_actor',
    {'actorId': 'apify~leads-finder'},
    'IMO',
    'ACTION',
    2,  # ORBT layer
    '1.0',  # Blueprint version
    1  # Version number
)

# Validate payload
try:
    HeirGenerator.validate_payload(payload)
    print('✅ Valid payload')
except ValueError as error:
    print(f'❌ Invalid: {error}')
```

## API Reference

### JavaScript

#### `generateHeirId(system, mode, version = 1)`
Generates a HEIR ID.

#### `generateProcessId(system)`
Generates a Process ID.

#### `generatePayload(tool, data, system, mode, orbtLayer, blueprintVersion = '1.0', version = 1)`
Generates a complete HEIR/ORBT payload.

#### `validatePayload(payload)`
Validates a payload structure. Throws error if invalid.

#### `parseHeirId(heirId)`
Parses a HEIR ID into components.

#### `parseProcessId(processId)`
Parses a Process ID into components.

#### `getOrbtLayerDescription(layer)`
Returns description of ORBT layer.

### Python

All methods have the same functionality as JavaScript, using Python naming conventions (snake_case instead of camelCase).

## Integration with Composio MCP

When calling Composio MCP tools, always use `generatePayload()`:

```javascript
const payload = HeirGenerator.generatePayload(
    'apify_run_actor',
    { actorId: 'apify~leads-finder', runInput: { query: 'test' } },
    'IMO',
    'ACTION',
    2
);

const response = await fetch('http://localhost:3001/tool', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
});
```

## Best Practices

1. **Always use layer 2 for external API calls** (Processing/Middle)
2. **Use descriptive system identifiers**: IMO, ACTION, INTAKE, VALIDATE
3. **Use descriptive modes**: CREATOR, ACTION, VALIDATE, ENRICH
4. **Increment version numbers** for retry attempts
5. **Log all HEIR IDs** for debugging and audit trails

## Common System Identifiers

| System | Description |
|--------|-------------|
| IMO | Interface creation operations |
| ACTION | Action execution operations |
| INTAKE | Data intake/ingestion operations |
| VALIDATE | Validation operations |
| ENRICH | Data enrichment operations |
| OUTPUT | Output generation operations |

## Common Operation Modes

| Mode | Description |
|------|-------------|
| CREATOR | Interface/resource creation |
| ACTION | Action execution |
| VALIDATE | Validation checks |
| ENRICH | Data enrichment |
| GENERATE | Content generation |
| QUERY | Data queries |

## Testing

Both implementations include example usage that can be run directly:

```bash
# JavaScript
node libs/orbt-utils/heir-generator.js

# Python
python libs/orbt-utils/heir_generator.py
```

## Compliance

These utilities ensure compliance with:
- Barton Doctrine HEIR/ORBT standards
- Global Configuration Manifest (global_manifest.yaml)
- CTB (Christmas Tree Backbone) structure
- MCP Integration Standards

## Support

For issues or questions:
1. Check `global-config/global_manifest.yaml` for current standards
2. Review `COMPOSIO_INTEGRATION.md` for integration patterns
3. Consult `BARTON_OUTREACH_CORE_UPDATES.md` for examples

---

**Last Updated**: 2025-10-23  
**Barton Doctrine Version**: 1.3.3  
**CTB Compliant**: ✅
