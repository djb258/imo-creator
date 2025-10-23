# CTB System Manual Guide

**Version**: 1.3.0
**Last Updated**: 2025-10-23
**Status**: Production

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Role-Based Abstraction](#role-based-abstraction)
4. [Directory Structure](#directory-structure)
5. [ORBT Manuals](#orbt-manuals)
6. [Troubleshooting Layer](#troubleshooting-layer)
7. [Viewer API](#viewer-api)
8. [Operational Workflows](#operational-workflows)
9. [Driver Management](#driver-management)
10. [Quick Reference](#quick-reference)

---

## Overview

The **CTB System Manual** is a comprehensive documentation system for the Christmas Tree Backbone (CTB) architecture. It provides:

- **Vendor-agnostic role definitions**: AI_ENGINE, WORKBENCH_DB, VAULT_DB, INTEGRATION_BRIDGE
- **Operational runbooks** (ORBT format): Operate, Repair, Build, Train
- **Live system diagnostics**: Health monitoring and troubleshooting
- **Viewer-ready APIs**: JSON schemas for external visualization apps
- **Driver abstraction**: Switchable vendor implementations (Gemini↔Claude, Firebase↔MongoDB, etc.)

### Key Principles

1. **Vendor Agnostic**: Functional roles, not vendor lock-in
2. **Barton Doctrine Compliant**: Composio MCP required, gatekeeper enforced, no direct vault access
3. **Visualization-Ready**: Prepared for future CTB Viewer App integration
4. **Operational Excellence**: Complete ORBT documentation for every role

---

## System Architecture

### 4 Core Roles

```
┌─────────────────────────────────────────────────────────────┐
│                    20k ALTITUDE - ORCHESTRATION             │
├─────────────────────┬───────────────────────────────────────┤
│   AI_ENGINE         │      INTEGRATION_BRIDGE               │
│   (Gemini/Claude)   │      (Composio MCP)                   │
│   Reasoning/Orchestration │  External Tools & APIs         │
└─────────────────────┴───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     5k ALTITUDE - DATA LAYER                │
├─────────────────────┬───────────────────────────────────────┤
│   WORKBENCH_DB      │      VAULT_DB                         │
│   (Firebase/MongoDB)│      (Neon/Postgres)                  │
│   Staging/Validation│      Production Storage               │
└─────────────────────┴───────────────────────────────────────┘
```

### Data Flow

```
Input → AI_ENGINE → WORKBENCH_DB → Gatekeeper Validation → VAULT_DB
         ↑              ↓
         │    INTEGRATION_BRIDGE
         └──────────────┘
```

1. **AI_ENGINE** orchestrates operations, makes decisions
2. **WORKBENCH_DB** stages data for validation
3. **Gatekeeper** validates and approves promotion
4. **VAULT_DB** stores production-ready data (immutable)
5. **INTEGRATION_BRIDGE** provides external service access via MCP

---

## Role-Based Abstraction

### Why Role-Based?

Instead of:
```json
// ❌ Vendor lock-in
{
  "gemini": {...},
  "firebase": {...},
  "neon": {...}
}
```

We use:
```json
// ✅ Vendor-agnostic roles
{
  "ai_engine": {
    "current_driver": "gemini",
    "supported_drivers": ["gemini", "claude", "gpt"]
  }
}
```

### Benefits

1. **Flexibility**: Switch vendors without architectural changes
2. **Future-Proofing**: Add new drivers without breaking changes
3. **Testing**: Mock implementations for development
4. **Documentation**: Roles stay stable even as vendors change

---

## Directory Structure

```
ctb-template/
│
├── manual/                                     # System documentation
│   ├── system-map/
│   │   ├── ctb_system_map.json                # System topology (JSON)
│   │   └── ctb_system_map.mmd                 # System topology (Mermaid)
│   │
│   ├── ort-manuals/                           # Operational runbooks
│   │   ├── ai_engine.ort.md                   # AI Engine ORBT manual
│   │   ├── workbench_db.ort.md                # Workbench DB ORBT manual
│   │   ├── vault_db.ort.md                    # Vault DB ORBT manual
│   │   └── integration_bridge.ort.md          # Integration Bridge ORBT manual
│   │
│   ├── troubleshooting/
│   │   └── system_diagnostics.json            # Live health status
│   │
│   └── scripts/
│       └── status_check.ts                    # Health monitoring script
│
├── drivers/                                    # Vendor implementations
│   ├── ai_engine/
│   │   └── driver_manifest.json               # AI Engine driver config
│   ├── workbench_db/
│   │   └── driver_manifest.json               # Workbench DB driver config
│   ├── vault_db/
│   │   └── driver_manifest.json               # Vault DB driver config
│   └── integration_bridge/
│       └── driver_manifest.json               # Integration Bridge driver config
│
└── viewer-api/                                 # External API for visualization
    ├── schemas/
    │   ├── system_health_response.schema.json # System health JSON schema
    │   └── role_details_response.schema.json  # Role details JSON schema
    └── mocks/
        ├── sample_system_health.json          # Mock system health data
        └── sample_role_details.json           # Mock role details data
```

---

## ORBT Manuals

### What is ORBT?

**ORBT** = Operate, Repair, Build, Train

A standardized documentation format for operational excellence.

### Structure

```yaml
---
role: ai_engine
version: 1.0.0
altitude: 20k
driver: gemini
status: active
---

# {Role} ORT Manual

## Operate
- Normal operations
- Health checks
- Daily procedures
- Monitoring

## Repair
- Failure modes (symptoms, diagnosis, repair steps, resolution time)
- Common issues
- Recovery procedures

## Build
- Initial setup
- Configuration
- Driver switching
- Integration

## Train
- Key concepts
- Practice scenarios
- Operator training
- Developer onboarding
```

### Example Usage

```bash
# Read AI Engine operational procedures
cat ctb-template/manual/ort-manuals/ai_engine.ort.md

# Check failure modes for Vault DB
grep -A 10 "Failure Mode" ctb-template/manual/ort-manuals/vault_db.ort.md
```

### Available Manuals

1. **ai_engine.ort.md** (~250 lines)
   - AI reasoning and orchestration operations
   - 3 failure modes: API connection, high latency, model deprecation
   - Driver switching guide (Gemini → Claude → GPT)

2. **workbench_db.ort.md**
   - Staging database operations
   - 2 failure modes: connection timeout, validation queue backlog
   - Promotion flow to vault_db

3. **vault_db.ort.md**
   - Production vault operations
   - **Critical**: NO direct access (Barton Doctrine)
   - 3 failure modes: connection, schema violation, audit overflow

4. **integration_bridge.ort.md**
   - MCP tool orchestration
   - 3 failure modes: server down, rate limits, tool registration
   - 100+ registered tools via Composio

---

## Troubleshooting Layer

### System Diagnostics

**File**: `ctb-template/manual/troubleshooting/system_diagnostics.json`

**Updated By**: `ctb-template/manual/scripts/status_check.ts`

**Format**:
```json
{
  "version": "1.3.0",
  "last_updated": "2025-10-23T14:32:18Z",
  "system_health": {
    "overall_status": "healthy",
    "roles_healthy": 4,
    "roles_degraded": 0,
    "roles_down": 0
  },
  "roles": {
    "ai_engine": {
      "status": "connected",
      "latency_ms": 187,
      "driver": "gemini",
      "issues": []
    },
    ...
  },
  "alerts": []
}
```

### Health Check Script

**Run Manually**:
```bash
cd ctb-template
ts-node manual/scripts/status_check.ts
```

**Output**:
```
🔍 CTB System Status Check - Starting...

Checking ai_engine...
  ✅ Status: connected
  ⏱️  Latency: 187ms
  🔌 Driver: gemini

Checking workbench_db...
  ✅ Status: healthy
  ⏱️  Latency: 43ms
  🔌 Driver: firebase

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SYSTEM HEALTH SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Status:   HEALTHY
Roles Healthy:    4
Roles Degraded:   0
Roles Down:       0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Automated Monitoring

**Cron Example**:
```bash
# Run status check every minute
* * * * * cd /path/to/ctb-template && ts-node manual/scripts/status_check.ts >> logs/health_checks.log 2>&1
```

**GitHub Actions Example**:
```yaml
# .github/workflows/health_check.yml
name: CTB Health Check

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run health check
        run: ts-node ctb-template/manual/scripts/status_check.ts
```

---

## Viewer API

### Purpose

Provide JSON schemas and endpoints for external CTB Viewer applications (React, Next.js, etc.).

### Integration Flow

```
CTB System → system_diagnostics.json → CTB Viewer App
            → driver manifests        → Visualization
            → system map              → Interactive Dashboard
```

### Schemas

#### 1. System Health Response

**Schema**: `viewer-api/schemas/system_health_response.schema.json`

**Endpoint**: `/manual/troubleshooting/system_diagnostics.json`

**Validation**:
```typescript
import Ajv from 'ajv';
import schema from './viewer-api/schemas/system_health_response.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const data = await fetch('/manual/troubleshooting/system_diagnostics.json');
const isValid = validate(await data.json());
```

#### 2. Role Details Response

**Schema**: `viewer-api/schemas/role_details_response.schema.json`

**Endpoint**: `/drivers/{role}/driver_manifest.json`

**Usage**:
```typescript
const roles = ['ai_engine', 'workbench_db', 'vault_db', 'integration_bridge'];

for (const role of roles) {
  const manifest = await fetch(`/drivers/${role}/driver_manifest.json`);
  renderRoleCard(manifest);
}
```

### Mock Data

**Development**: Use mock data for frontend development without backend.

```typescript
// Use mock data during development
const mockData = await fetch('/viewer-api/mocks/sample_system_health.json');

// Switch to live data in production
const liveData = await fetch('/manual/troubleshooting/system_diagnostics.json');
```

---

## Operational Workflows

### Daily Operations

**Morning Checklist**:
```bash
# 1. Check system health
ts-node ctb-template/manual/scripts/status_check.ts

# 2. Review ORBT manuals for any changes
ls -la ctb-template/manual/ort-manuals/

# 3. Verify MCP server status
curl http://localhost:3001/mcp/health

# 4. Check validation queue
# (workbench_db diagnostics)
```

### Incident Response

**When alert triggers**:

1. Check system diagnostics:
   ```bash
   cat ctb-template/manual/troubleshooting/system_diagnostics.json
   ```

2. Identify affected role(s)

3. Open relevant ORBT manual:
   ```bash
   # Example: AI Engine down
   cat ctb-template/manual/ort-manuals/ai_engine.ort.md
   ```

4. Follow **Repair** section for diagnosed failure mode

5. Document resolution

### Driver Switching

**Example: Switch AI Engine from Gemini to Claude**

1. Update driver manifest:
   ```json
   // ctb-template/drivers/ai_engine/driver_manifest.json
   {
     "current_driver": "claude",  // Changed from "gemini"
     ...
   }
   ```

2. Update environment variables:
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-xxx
   # Remove or comment out GOOGLE_API_KEY
   ```

3. Restart services

4. Run health check:
   ```bash
   ts-node ctb-template/manual/scripts/status_check.ts
   ```

5. Verify in diagnostics:
   ```bash
   jq '.roles.ai_engine.driver' ctb-template/manual/troubleshooting/system_diagnostics.json
   # Expected output: "claude"
   ```

---

## Driver Management

### Driver Manifest Structure

```json
{
  "role": "AI_ENGINE",
  "current_driver": "gemini",
  "description": "Handles reasoning, orchestration, and LLM execution",
  "altitude": "20k",
  "interface_contract": {
    "input": "structured_prompt (string | object)",
    "output": "json_result (object with text, metadata, usage)"
  },
  "supported_drivers": [
    {
      "name": "gemini",
      "version": "2.5-flash",
      "provider": "Google AI",
      "status": "active"
    },
    {
      "name": "claude",
      "version": "sonnet-4.5",
      "provider": "Anthropic",
      "status": "configured"
    }
  ],
  "status_endpoint": "/manual/troubleshooting/system_diagnostics.json#ai_engine",
  "ort_manual": "/manual/ort-manuals/ai_engine.ort.md"
}
```

### Adding a New Driver

1. Add to `supported_drivers` in driver manifest

2. Create driver implementation following interface contract

3. Update ORBT manual with new driver instructions

4. Test driver switching procedure

5. Document in `CTB_VERSION_HISTORY.md`

---

## Quick Reference

### Files & Locations

| File | Purpose | Used By |
|------|---------|---------|
| `manual/system-map/ctb_system_map.json` | System topology | Viewer apps, docs |
| `manual/troubleshooting/system_diagnostics.json` | Live health status | Monitoring, alerts |
| `manual/scripts/status_check.ts` | Health check script | Cron, CI/CD |
| `manual/ort-manuals/*.ort.md` | Operational runbooks | Operators, on-call |
| `drivers/*/driver_manifest.json` | Driver configuration | System, viewer apps |
| `viewer-api/schemas/*.schema.json` | API contracts | External apps |

### Common Commands

```bash
# Check system health
ts-node ctb-template/manual/scripts/status_check.ts

# View system map (Mermaid)
cat ctb-template/manual/system-map/ctb_system_map.mmd

# Check AI Engine health
jq '.roles.ai_engine' ctb-template/manual/troubleshooting/system_diagnostics.json

# List all ORBT manuals
ls -1 ctb-template/manual/ort-manuals/

# Validate JSON against schema
ajv validate -s viewer-api/schemas/system_health_response.schema.json \
             -d manual/troubleshooting/system_diagnostics.json
```

### Health Status Codes

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| `healthy` | All systems nominal | None |
| `connected` | System operational (20k roles) | None |
| `degraded` | High latency or partial failure | Investigate |
| `disconnected` | System down | **URGENT** - Follow ORBT manual |

### Altitude Reference

| Altitude | Purpose | Roles |
|----------|---------|-------|
| 40k | System Infrastructure | composio-mcp, gatekeeper, validator |
| 20k | Orchestration Layer | AI_ENGINE, INTEGRATION_BRIDGE |
| 10k | Feature Layer | (Future: apps, workflows) |
| 5k | Data Layer | WORKBENCH_DB, VAULT_DB |

---

## Support & Resources

**Documentation**:
- This guide: `/docs/ctb/CTB_SYSTEM_MANUAL_GUIDE.md`
- Version history: `/docs/ctb/CTB_VERSION_HISTORY.md`
- Tier guide: `/docs/ctb/CTB_TIER_GUIDE.md`

**Troubleshooting**:
- System diagnostics: `/manual/troubleshooting/system_diagnostics.json`
- ORBT manuals: `/manual/ort-manuals/*.ort.md`
- System map: `/manual/system-map/ctb_system_map.json`

**External Integration**:
- Viewer API: `/viewer-api/README.md`
- JSON Schemas: `/viewer-api/schemas/`
- Mock Data: `/viewer-api/mocks/`

**GitHub**:
- Repository: https://github.com/djb258/imo-creator
- Issues: https://github.com/djb258/imo-creator/issues

---

**CTB System Manual** - Operational excellence through vendor-agnostic role-based architecture ✨

**Version**: 1.3.0
**Last Updated**: 2025-10-23
**Status**: Production Ready
