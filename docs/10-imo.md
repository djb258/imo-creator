---
title: IMO Definition - imo-creator
aliases: [imo, data-flow, input-middle-output]
tags:
  - imo
  - doctrine/master
  - status/approved
created: 2025-11-25
updated: 2025-11-25
status: approved
---

# IMO Definition: imo-creator (Master Doctrine Repo)

> **Version**: 1.0.0
> **Last Updated**: 2025-11-25
> **Status**: APPROVED

---

## Overview

IMO-Creator is the **repo of repos** - the master doctrine source that defines the Input-Middle-Output architecture pattern. All child repos inherit structure, tooling, and compliance rules from this source.

**One-sentence purpose**: IMO-Creator scaffolds, validates, and maintains doctrine-compliant repositories across the ecosystem.

---

## INPUT PHASE

### Sources

| Source | Type | Schema/Format | Constraint |
|--------|------|---------------|------------|
| **Vercel Edge Functions** | API | JSON REST | 30s timeout, CORS-restricted |
| **Render Backend** | API/Webhook | JSON REST | Persistent connection |
| **CLI Scaffold Commands** | Shell | YAML/JSON config | Local execution only |
| **GitIngest Triggers** | GitHub Action | Repository tree | Weekly schedule + manual |
| **Blueprint Manifests** | File Upload | YAML (`manifest.yaml`) | Must match schema |
| **MCP Tool Calls** | Protocol | MCP JSON-RPC | Via Composio Hub |

### Input Validators

```
┌─────────────────────────────────────────────────────┐
│                   INPUT GATE                        │
├─────────────────────────────────────────────────────┤
│ 1. Schema validation (JSON Schema / Pydantic)       │
│ 2. HEIR ID format check (imo-${TIMESTAMP}-${HEX})   │
│ 3. Auth token verification (Bearer / API Key)       │
│ 4. Rate limiting (per-endpoint)                     │
│ 5. Blueprint version hash validation                │
└─────────────────────────────────────────────────────┘
```

### Input Kill Switch

**On Input Failure → ERROR RESPONSE + LOG**

| Failure Type | Action | Destination |
|--------------|--------|-------------|
| Schema invalid | 400 response | Client |
| Auth failed | 401 response | Client |
| Rate exceeded | 429 response + backoff header | Client |
| Timeout | 504 response | Client |
| Malformed request | 400 + error detail | Client + Sidecar log |

**No DLQ for inputs** - requests are stateless and must be retried by caller.

---

## MIDDLE PHASE

### Processing Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                      COMPOSIO HUB (Primary Router)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ heir.check   │    │ sidecar.event│    │ intake.map   │      │
│  │ (Validate)   │    │ (Telemetry)  │    │ (Transform)  │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         └───────────────────┼───────────────────┘               │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   SUBAGENT ORCHESTRATION                  │   │
│  │  • LLM routing (OpenAI / Anthropic)                      │   │
│  │  • Blueprint execution                                    │   │
│  │  • Tool invocation                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │   n8n    │   │  Make    │   │  Zapier  │
        │ (Fallback)│   │(Fallback)│   │(Fallback)│
        └──────────┘   └──────────┘   └──────────┘
```

### Core Workflows

| Workflow | CTB Layer | Description |
|----------|-----------|-------------|
| **Repo Scaffold** | system | Create new doctrine-compliant repo from template |
| **Blueprint Validate** | data | Validate manifest against schema, emit pass/fail |
| **Diagram Generate** | app | Create Mermaid/SVG/PlantUML from repo structure |
| **GitIngest Index** | data | Build semantic search index from repo contents |
| **Subagent Dispatch** | ai | Route LLM calls to appropriate provider |
| **Sidecar Emit** | system | Log telemetry events to observability stack |

### Transformation Rules

1. **Normalize IDs**: All doctrine IDs converted to `imo-${TIMESTAMP}-${RANDOM_HEX}` format
2. **Version Stamp**: Blueprint hash computed and attached to all artifacts
3. **Correlation**: Process ID (`imo-process-${SESSION_ID}`) links all related events
4. **Fallback Selection**: If Composio MCP fails, select spoke by priority order (n8n → Make → Zapier)

### Middle Kill Switch

**On Processing Failure → FALLBACK + ROLLBACK**

| Failure Type | Action | Fallback |
|--------------|--------|----------|
| Composio unreachable | Route to fallback spoke | n8n webhook |
| LLM timeout | Retry with exponential backoff (3x) | Error response |
| Blueprint invalid | Reject with validation errors | No fallback |
| Subagent crash | Log + alert | Sidecar capture |
| Transformation error | Rollback partial state | Return to input |

**Rollback Strategy**: Middle phase is designed to be idempotent. Failed operations leave no partial state.

---

## OUTPUT PHASE

### Destinations

| Destination | Type | Purpose | Write Pattern |
|-------------|------|---------|---------------|
| **Neon (PostgreSQL)** | Database | Persistent structured data | Transactional |
| **Firebase** | NoSQL/RT | Real-time state, auth | Eventual consistency |
| **Backblaze B2** | Object Store | DuckDB files, artifacts | Immutable upload |
| **Apify** | Scraping API | External data ingestion | Async job |
| **BigQuery** | Analytics | Aggregated metrics | Batch insert |
| **GitHub (Generated)** | Files | Diagrams, indexes, summaries | Git commit |
| **Scaffolded Repos** | Git | New child repos | Git init + push |
| **API Response** | HTTP | Client result | Sync response |
| **Sidecar Logs** | Telemetry | Observability | Stream |

### Output Confirmation

```
┌─────────────────────────────────────────────────────┐
│                  OUTPUT GATE                        │
├─────────────────────────────────────────────────────┤
│ 1. Write acknowledgment (DB commit, API 2xx)        │
│ 2. Artifact hash verification                       │
│ 3. Sidecar event: output.confirmed                  │
│ 4. Correlation ID attached to response              │
└─────────────────────────────────────────────────────┘
```

### Output Kill Switch

**On Output Failure → RETRY + ALERT**

| Failure Type | Retry Strategy | Final Fallback |
|--------------|----------------|----------------|
| DB write failed | 3x exponential backoff | DLQ + manual review |
| B2 upload failed | 3x retry | Local cache + alert |
| GitHub push failed | 1x retry | Log + manual push |
| API timeout | No retry (client handles) | Error response |
| Firebase write failed | 3x retry | Neon fallback |

### Dead Letter Queue (DLQ)

Failed outputs that exhaust retries are written to:
- **Location**: `workbench/dlq/` (local) or B2 bucket `dlq/` prefix
- **Format**: JSON with original payload + error details + timestamp
- **Retention**: 30 days
- **Alert**: Sidecar emits `output.dlq.write` event

---

## DATA FLOW SUMMARY

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌─────────┐     ┌─────────────────────┐     ┌─────────────────┐  │
│   │  INPUT  │────▶│       MIDDLE        │────▶│     OUTPUT      │  │
│   └────┬────┘     └──────────┬──────────┘     └────────┬────────┘  │
│        │                     │                         │            │
│        ▼                     ▼                         ▼            │
│   ┌─────────┐          ┌──────────┐             ┌───────────┐      │
│   │  400/   │          │ Fallback │             │  Retry/   │      │
│   │  401/   │          │  Spokes  │             │   DLQ     │      │
│   │  429    │          └──────────┘             └───────────┘      │
│   └─────────┘                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## HEIR Compliance

All operations MUST emit:

| Event | When | Contains |
|-------|------|----------|
| `app.start` | Service boot | Version, config hash |
| `blueprint.validated` | After validation | Pass/fail, errors |
| `action.invoked` | Tool call | Tool name, params hash |
| `output.confirmed` | Successful write | Destination, artifact ID |
| `output.dlq.write` | Failed output | Error, payload hash |

---

## Registry Reference

Engine capabilities defined in `/config/mcp_registry.json`:
- **Neon** (MCP, doctrine_id: 04.04.01)
- **Firebase** (MCP, doctrine_id: 04.04.02)
- **Apify** (MCP, doctrine_id: 04.04.03)
- **n8n** (Fallback, doctrine_id: 04.04.F1)
- **Make** (Fallback, doctrine_id: 04.04.F2)

---

## Approval

- [x] Dev confirms INPUT sources are complete
- [x] Dev confirms MIDDLE processing logic is accurate
- [x] Dev confirms OUTPUT destinations are correct
- [x] Dev confirms KILL SWITCHES are acceptable
- [x] **IMO APPROVED** - Ready for CTB structure (2025-11-25)

---

*This document is the source of truth for data flow in imo-creator. All code must align with this specification.*
