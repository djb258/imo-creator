---
title: "20,000ft - Logic"
aliases: [logic, 20k, how-it-works]
tags:
  - altitude/20k
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# 20,000ft - Logic

> **Altitude**: Functional / How it works conceptually
> **Audience**: Developers, contributors, maintainers

---

## Core Concepts

### 1. IMO (Input-Middle-Output)

Every data flow follows three phases:

```
INPUT           →        MIDDLE          →        OUTPUT
(receive)                (process)                (deliver)
                              │
                              ▼
                         KILL SWITCH
                         (on failure)
```

### 2. CTB (Code-Test-Boundary)

Code is organized by concern, not feature:

| Layer | Purpose | Example |
|-------|---------|---------|
| system | Infrastructure | Auth, config, logging |
| data | Persistence | DB clients, schemas |
| app | Business logic | Services, workflows |
| ai | Intelligence | LLM, prompts, MCP |
| ui | Presentation | Web, CLI, docs |

### 3. HEIR (Hierarchical Error-handling, ID management, Reporting)

Every operation has:
- **Unique ID**: `imo-${TIMESTAMP}-${HEX}`
- **Process ID**: `imo-process-${SESSION_ID}`
- **Error hierarchy**: Structured fallback paths
- **Audit trail**: Sidecar event emission

---

## Data Flow

### Scaffold Flow

```
1. User requests scaffold (CLI/API)
2. INPUT: Validate request, auth check
3. MIDDLE:
   - Load template
   - Apply customizations
   - Generate files
   - Run HEIR check
4. OUTPUT:
   - Create Git repo
   - Push to GitHub
   - Emit sidecar event
5. KILL SWITCH:
   - Template missing → 404
   - Validation fails → 400
   - Git push fails → Retry 3x → Manual
```

### Validation Flow

```
1. Blueprint manifest submitted
2. INPUT: Parse YAML, schema check
3. MIDDLE:
   - HEIR compliance check
   - CTB structure validation
   - Dependency analysis
4. OUTPUT:
   - Return pass/fail
   - Generate report
5. KILL SWITCH:
   - Parse error → 400 with details
   - HEIR fail → 422 with violations
```

### Diagram Generation Flow

```
1. GitHub Action trigger (push/schedule)
2. INPUT: Clone repo, scan structure
3. MIDDLE:
   - Analyze architecture
   - Generate Mermaid source
   - Render to SVG
4. OUTPUT:
   - Commit to .github/generated/
   - Update search index
5. KILL SWITCH:
   - Scan timeout → Partial result
   - Render fail → Mermaid only
```

---

## State Management

| State Type | Storage | Lifetime |
|------------|---------|----------|
| Request state | Memory | Request duration |
| Session state | Process ID | Session duration |
| Config state | Environment | Service lifetime |
| Persistent state | Neon/Firebase | Permanent |
| Artifact state | B2 | 30 days (DLQ) |

---

## Concurrency Model

- **Requests**: Stateless, parallel by default
- **Workflows**: Single-threaded per session
- **Background jobs**: Queue-based (Render)
- **Sidecar**: Async fire-and-forget

---

## Extension Points

| Extension | Mechanism | Example |
|-----------|-----------|---------|
| New CTB layer | Add to `/src/{layer}` | Custom layer |
| New MCP tool | Add to registry | `custom.tool` |
| New subagent | Add to registry | `custom-agent` |
| New template | Add to `/templates` | `my-template` |
| Custom workflow | Add to `/src/app/workflows` | `my_workflow.py` |

---

## Related Docs

- [10-imo.md](../10-imo.md) - Complete IMO definition
- [20-ctb-*.md](../) - CTB layer docs
- [heir.doctrine.yaml](../../heir.doctrine.yaml) - HEIR rules
