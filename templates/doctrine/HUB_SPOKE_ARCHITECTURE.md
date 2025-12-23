# Hub & Spoke Architecture Doctrine
**(CTB + IMO + Altitude Enforcement Guide)**

This document is the **authoritative doctrine** for constructing or refactoring repositories
using the **Hub & Spoke architecture**.

This file MUST be read and followed by:
- Humans creating new repositories
- LLMs refactoring existing repositories
- LLMs generating new code, structure, or documentation

If any instruction in this file conflicts with other guidance, **this file wins**.

---

## 1. Core Mental Model (Non-Negotiable)

### Hub
- A **Hub is an application**
- A hub owns:
  - Logic
  - Decisions
  - State
  - CTB placement
  - Altitude scope
  - Full IMO flow
- A repository MUST contain **exactly one hub**
- If a repository contains more than one hub, it MUST be split

### Spoke
- A **Spoke is an interface**
- A spoke is **ONLY**:
  - **I (Ingress)** — data entering a hub
  - **O (Egress)** — data leaving a hub
- A spoke:
  - Owns NO logic
  - Owns NO state
  - Owns NO tools
- There is **no such thing as a Middle spoke**

### Golden Rule
> **Logic lives only inside hubs.
> Spokes only carry data.**

---

## 2. IMO Model (Applies ONLY Inside a Hub)

### I — Ingress
- UI, API, file, event, webhook
- May validate schema and shape
- MUST NOT make decisions
- MUST NOT mutate business state

### M — Middle
- All logic
- All decisions
- All transformations
- All state ownership
- All orchestration

### O — Egress
- Outputs, exports, notifications, APIs
- Read-only views
- Downstream signals

---

## 3. CTB — Christmas Tree Backbone

CTB defines **where things live**, not how they execute.

Every hub MUST declare:
- **Trunk** (system category)
- **Branch** (domain)
- **Leaf** (capability)

CTB is **structural**, not logical.

### Standard CTB Branches

| Branch | Purpose |
|--------|---------|
| `sys/` | System infrastructure, backends, databases |
| `ui/` | User interfaces, frontends |
| `ai/` | AI/ML agents, models, prompts |
| `data/` | Data pipelines, schemas, migrations |
| `ops/` | Operations, scripts, automation |
| `docs/` | Documentation, guides |

---

## 4. Altitude Model (Zoom Discipline)

Altitude defines **how detailed the work is**.

| Level | Scope | Focus |
|-------|-------|-------|
| **30k** | System architecture | Multiple hubs, topology |
| **20k** | Domain / capability | Hub boundaries, interfaces |
| **10k** | Process / logic | Internal flows, decisions |
| **5k** | Execution / implementation | Code, configs, tests |

### Rules
- You may only add detail by going **down** in altitude
- You may not introduce new structure sideways
- Higher altitude = broader scope, less detail
- Lower altitude = narrower scope, more detail

---

## 5. Required Artifacts (The Only Ones That Matter)

### PRD (Product Requirements Document)
- Defines structure
- Defines hubs
- Defines spokes
- Defines IMO flow
- Defines CTB + Altitude
- Lives as:
  - **System PRD** (topology)
  - **Hub Sub-PRD** (internal hub design)

### ADR (Architecture Decision Record)
- Explains **why** a decision was made
- One decision per ADR
- Never defines structure
- Never defines tasks

### PR (Pull Request)
- Implements approved structure
- References PRD / ADR
- Contains actual change

### Checklist
- Binary ship gate
- Proves work is complete
- No discussion, no vibes

> Linear Issues are **execution control**, not documentation doctrine.

---

## 6. Required Identifiers

Every hub MUST have:
- **Hub ID** — unique, immutable identifier
- **Process ID** — execution / trace ID

These identifiers:
- Are assigned at hub creation
- Never change
- Are referenced in all PRDs, ADRs, PRs
- Enable traceability across the system

---

## 7. How to CREATE a New Repository

1. Define the hub (one per repo)
2. Assign Hub ID + Process ID
3. Write System PRD (if needed)
4. Write Hub Sub-PRD
5. Define CTB placement
6. Define Altitude scope
7. Define full IMO internally
8. Define I/O spokes
9. Apply CTB folder structure
10. Add PR / ADR / Checklist templates
11. Implement code
12. Validate with checklist

---

## 8. How to REFACTOR an Existing Repository (LLM Instructions)

When refactoring an existing repo:

1. Identify how many hubs exist
2. If more than one → split
3. Move all logic into M
4. Convert integrations to I/O spokes
5. Remove sideways hub calls
6. Assign Hub ID + Process ID
7. Generate PRD and ADRs
8. Enforce CTB folders
9. Validate against checklist

---

## 9. Hard Violations (Stop Immediately)

If ANY of the following occur, STOP and flag the issue:

- Logic exists in a spoke
- Cross-hub state sharing
- UI making decisions
- Tools spanning hubs
- Missing Hub ID or Process ID
- Repo acting as multiple hubs
- Architecture introduced in a PR

These are **schema violations**, not preferences.

---

## 10. Design Twins (Reference Only)

- **Miro** = design twin (visual PRD)
- **Linear** = execution twin (task control)

Neither replaces doctrine.

---

## Final Rule

> **The system is correct only if the structure enforces the behavior.**
> If discipline relies on memory, the design has failed.
