# CTB Viewer API

**Version**: 1.3.0
**Purpose**: External API schemas and mock data for CTB Viewer App integration

## Overview

This directory contains JSON schemas and mock data designed for consumption by external CTB Viewer applications (React, Next.js, or similar). The Viewer API provides:

- **JSON Schema definitions** for system health and role details
- **Mock data samples** for development and testing
- **Vendor-agnostic data structures** for visualization

## Directory Structure

```
viewer-api/
├── schemas/                                    # JSON Schema definitions
│   ├── system_health_response.schema.json     # System-wide health API schema
│   └── role_details_response.schema.json      # Individual role details schema
├── mocks/                                      # Sample mock data
│   ├── sample_system_health.json              # Mock system health response
│   └── sample_role_details.json               # Mock role details response
└── README.md                                   # This file
```

## Schemas

### 1. System Health Response Schema

**File**: `schemas/system_health_response.schema.json`

**Purpose**: Defines the structure of system-wide health status responses.

**Endpoint**: `/manual/troubleshooting/system_diagnostics.json`

**Key Fields**:
- `version`: CTB version (semantic versioning)
- `system_health`: Aggregate health status (healthy/degraded/critical)
- `roles`: Health diagnostics for each role (AI_ENGINE, WORKBENCH_DB, VAULT_DB, INTEGRATION_BRIDGE)
- `alerts`: Active system alerts and warnings
- `viewer_schema`: Integration metadata for Viewer apps

**Example Usage**:
```typescript
import schema from './schemas/system_health_response.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const data = await fetch('/manual/troubleshooting/system_diagnostics.json');
const valid = validate(data);
```

### 2. Role Details Response Schema

**File**: `schemas/role_details_response.schema.json`

**Purpose**: Defines the structure of individual role detail responses.

**Key Fields**:
- `role`: Functional role identifier (AI_ENGINE, WORKBENCH_DB, etc.)
- `current_driver`: Active driver implementation (vendor-specific)
- `altitude`: CTB altitude classification (40k, 20k, 10k, 5k)
- `health`: Current health status and diagnostics
- `interface_contract`: Vendor-agnostic interface definition
- `supported_drivers`: List of available driver implementations

**Example Usage**:
```typescript
import schema from './schemas/role_details_response.schema.json';

// Fetch role details from driver manifest
const roleDetails = await fetch('/drivers/ai_engine/driver_manifest.json');
```

## Mock Data

### 1. Sample System Health

**File**: `mocks/sample_system_health.json`

**Use Case**: Development and testing of CTB Viewer apps without live backend.

**Key Features**:
- All 4 roles in `healthy`/`connected` status
- Realistic latency values (40-200ms)
- No active alerts
- Complete diagnostics for each role

### 2. Sample Role Details

**File**: `mocks/sample_role_details.json`

**Use Case**: Testing role detail views and driver switching UI.

**Key Features**:
- AI_ENGINE role with Gemini as active driver
- Multiple supported drivers (Gemini, Claude, GPT)
- Interface contract definition
- Barton Doctrine compliance metadata

## Integration Guide

### For CTB Viewer App Developers

**Step 1: Validate JSON Responses**

Use the provided JSON schemas to validate API responses:

```typescript
import { systemHealthSchema, roleDetailsSchema } from '@ctb/viewer-api';

// Validate system health response
const isValid = validateSystemHealth(response);

// Validate role details
const isValid = validateRoleDetails(response);
```

**Step 2: Poll for Updates**

The system diagnostics file is updated by `/manual/scripts/status_check.ts`:

```typescript
// Recommended polling interval: 30 seconds
const POLL_INTERVAL = 30000;

setInterval(async () => {
  const health = await fetch('/manual/troubleshooting/system_diagnostics.json');
  updateUI(health);
}, POLL_INTERVAL);
```

**Step 3: Visualize System Map**

Use the system map for visualization:

```typescript
// Fetch system topology
const systemMap = await fetch('/manual/system-map/ctb_system_map.json');

// Render with D3.js, React Flow, or similar
renderSystemMap(systemMap.nodes, systemMap.links);
```

**Step 4: Display Role Details**

Load driver manifests for detailed role information:

```typescript
const roles = ['ai_engine', 'workbench_db', 'vault_db', 'integration_bridge'];

for (const role of roles) {
  const manifest = await fetch(`/drivers/${role}/driver_manifest.json`);
  renderRoleCard(manifest);
}
```

## API Endpoints Reference

| Endpoint | Description | Schema |
|----------|-------------|--------|
| `/manual/troubleshooting/system_diagnostics.json` | System-wide health status | `system_health_response.schema.json` |
| `/drivers/{role}/driver_manifest.json` | Individual role details | `role_details_response.schema.json` |
| `/manual/system-map/ctb_system_map.json` | System topology map | N/A (custom format) |
| `/manual/system-map/ctb_system_map.mmd` | Mermaid diagram source | N/A (Mermaid format) |

## Data Update Mechanism

**Live Updates**: Run `/manual/scripts/status_check.ts` to update diagnostics.

```bash
# Manual update
ts-node /manual/scripts/status_check.ts

# Scheduled updates (cron example)
*/1 * * * * cd /path/to/ctb && ts-node manual/scripts/status_check.ts
```

**Automated CI/CD**: Integrate status checks in GitHub Actions or similar.

## Example CTB Viewer App (React)

```tsx
import React, { useEffect, useState } from 'react';

interface SystemHealth {
  version: string;
  system_health: {
    overall_status: 'healthy' | 'degraded' | 'critical';
    roles_healthy: number;
    roles_degraded: number;
    roles_down: number;
  };
  roles: Record<string, any>;
}

export function CTBViewer() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const res = await fetch('/manual/troubleshooting/system_diagnostics.json');
      const data = await res.json();
      setHealth(data);
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!health) return <div>Loading...</div>;

  return (
    <div className="ctb-viewer">
      <h1>CTB System Status v{health.version}</h1>
      <div className={`status-badge ${health.system_health.overall_status}`}>
        {health.system_health.overall_status.toUpperCase()}
      </div>
      <div className="roles-grid">
        {Object.entries(health.roles).map(([name, role]) => (
          <RoleCard key={name} name={name} role={role} />
        ))}
      </div>
    </div>
  );
}
```

## Barton Doctrine Compliance

All API responses follow Barton Doctrine principles:

- ✅ **Vendor-agnostic**: Roles are functional (AI_ENGINE), not vendor-specific (Gemini)
- ✅ **Driver abstraction**: Current driver is separate from interface contract
- ✅ **HEIR/ORBT tracking**: All roles include tracking metadata
- ✅ **Composio MCP integration**: Integration Bridge uses MCP protocol

## Version History

- **v1.3.0** (2025-10-23): Initial Viewer API release
  - Added JSON schemas for system health and role details
  - Created mock data samples
  - Documented integration guide

## Support

For issues or questions about CTB Viewer API:

- **GitHub Issues**: https://github.com/djb258/imo-creator/issues
- **Documentation**: `/docs/ctb/CTB_SYSTEM_MANUAL_GUIDE.md`
- **System Map**: `/manual/system-map/ctb_system_map.json`

---

**CTB Viewer API** - Preparing for visualization-ready system monitoring ✨
