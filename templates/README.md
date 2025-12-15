# Hub-and-Spoke (HS) Template System

## Overview

This directory contains reusable templates for implementing the Hub-and-Spoke architecture pattern across any domain. These templates are domain-agnostic and can be applied to outreach systems, storage platforms, insurance workflows, or any other service architecture.

## Architecture Principles

### Hub Responsibilities
- **Owns all tools** - Tools are registered and managed at the hub level
- **Enforces doctrine** - All spokes inherit rules from the hub
- **Manages failures** - Aggregates errors to Master Failure Hub
- **Controls promotion** - Gates what flows to spokes

### Spoke Responsibilities
- **Inherits from hub** - No independent tool registration
- **Reports upstream** - All failures bubble to parent hub
- **Executes locally** - Performs domain-specific operations
- **Requests via hub** - External integrations route through hub

## Directory Structure

```
templates/
├── README.md                           # This file
├── checklists/
│   └── HUB_COMPLIANCE.md              # Pre-flight checklist for hub/spoke compliance
├── prd/
│   └── PRD_HUB.md                     # Product requirements template for new hubs
├── pr/
│   ├── PULL_REQUEST_TEMPLATE_HUB.md   # PR template for hub changes
│   └── PULL_REQUEST_TEMPLATE_SPOKE.md # PR template for spoke changes
└── adr/
    └── ADR.md                         # Architecture Decision Record template
```

## Quick Start

### Creating a New Hub

1. Copy `prd/PRD_HUB.md` to your repo and fill it out
2. Run through `checklists/HUB_COMPLIANCE.md` before implementation
3. Use `pr/PULL_REQUEST_TEMPLATE_HUB.md` for all hub PRs
4. Document tool additions with `adr/ADR.md`

### Creating a New Spoke

1. Identify parent hub (spokes cannot exist without a hub)
2. Verify hub has required tools registered
3. Run through spoke sections of `checklists/HUB_COMPLIANCE.md`
4. Use `pr/PULL_REQUEST_TEMPLATE_SPOKE.md` for all spoke PRs

## Core Rules

### Tool Ownership

```
HUB owns tools → SPOKE inherits tools
     ↓
New tool? → ADR required → Hub approval → Registration
```

**Spokes NEVER:**
- Register their own tools
- Bypass hub for external calls
- Modify hub configurations

### Failure Propagation

```
SPOKE failure → Parent HUB → MASTER_FAILURE_LOG
                    ↓
              Auto-repair (if enabled)
                    ↓
              CORE_METRIC update
```

### Promotion Gates

All changes must pass these gates before production:

| Gate | Requirement |
|------|-------------|
| **G1** | All tests pass |
| **G2** | Compliance checklist complete |
| **G3** | ADR approved (if new tool) |
| **G4** | Kill switch documented |
| **G5** | Rollback plan exists |

## Guard Rails

### Mandatory for All Hubs

- [ ] Kill switch endpoint defined
- [ ] Rate limiting configured
- [ ] Timeout thresholds set
- [ ] Failure escalation rules documented
- [ ] Rollback procedure tested

### Mandatory for All Spokes

- [ ] Parent hub identified
- [ ] Inheritance chain documented
- [ ] No direct external integrations
- [ ] Failure reporting configured
- [ ] Health check endpoint exists

## Kill Switch Protocol

Every hub and spoke MUST implement:

```yaml
kill_switch:
  enabled: false          # Set true to disable
  reason: ""              # Required when enabled
  disabled_by: ""         # Who disabled it
  disabled_at: ""         # Timestamp
  emergency_contact: ""   # Who to call
```

**Activation:**
1. Set `enabled: true`
2. Fill in reason, disabled_by, disabled_at
3. System immediately stops processing
4. Alert sent to emergency_contact

**Reactivation:**
1. Resolve underlying issue
2. Document resolution
3. Set `enabled: false`
4. Clear reason field

## Usage Examples

### Example: Outreach Domain

```
OUTREACH_HUB (owns: gmail, linkedin, apify)
├── EMAIL_SPOKE (inherits: gmail)
├── SOCIAL_SPOKE (inherits: linkedin)
└── SCRAPING_SPOKE (inherits: apify)
```

### Example: Storage Domain

```
STORAGE_HUB (owns: s3, gcs, b2)
├── ARCHIVE_SPOKE (inherits: s3, gcs)
├── BACKUP_SPOKE (inherits: b2)
└── CDN_SPOKE (inherits: s3)
```

### Example: Insurance Domain

```
INSURANCE_HUB (owns: policy_api, claims_api, underwriting)
├── QUOTES_SPOKE (inherits: policy_api, underwriting)
├── CLAIMS_SPOKE (inherits: claims_api)
└── RENEWALS_SPOKE (inherits: policy_api)
```

## Compliance Enforcement

These templates integrate with:

- **HEIR/ORBT** - All operations tracked with unique_id and process_id
- **Master Failure Hub** - Centralized error aggregation
- **CTB Doctrine** - Branch and structure compliance
- **Composio MCP** - External integration gateway

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-12 | Initial template system |

## Maintainer

IMO-Core Engineering
