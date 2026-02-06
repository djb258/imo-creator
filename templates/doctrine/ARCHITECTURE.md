# ARCHITECTURE — CTB Constitutional Law

**Doctrine Version**: 2.0.0
**Status**: LOCKED (CONSTITUTIONAL)
**Authority**: IMO-Creator Sovereign
**Change Protocol**: ADR + Human Approval ONLY

---

> **This document is law. It is not guidance. It is not recommendation.**
> **All derived systems MUST comply. There are no exceptions.**

---

## PART I — AXIOMS

These axioms are self-evident truths. They require no justification. They may not be questioned.

### AXIOM-1: Single Placement

Every component exists at exactly one location. No component may exist at multiple locations. No component may exist at no location.

### AXIOM-2: Static Structure

Structure is determined at design time. Structure does not change at runtime. Runtime may only execute within declared structure.

### AXIOM-3: Downward Authority

Authority flows downward only. Lower layers may not modify higher layers. Lower layers may not grant permissions to higher layers.

### AXIOM-4: Explicit Declaration

All boundaries, permissions, and constraints must be explicitly declared. Implicit behavior is forbidden. Undeclared defaults to denied.

### AXIOM-5: Immutable Identity

Once assigned, identity is permanent. Sovereign IDs, Hub IDs, and structural assignments never change. Renaming is creation of new identity.

---

## PART II — CTB TOPOLOGY LAW

CTB (Christmas Tree Backbone) defines physical placement. It is topology, not logic.

### §1 Branch Constraints

| ID | Constraint | Violation |
|----|------------|-----------|
| CTB-B01 | Branches exist only under `src/` | CTB_VIOLATION |
| CTB-B02 | Exactly 5 branches: `sys/`, `data/`, `app/`, `ai/`, `ui/` | CTB_VIOLATION |
| CTB-B03 | Every source file maps to exactly one branch | CTB_VIOLATION |
| CTB-B04 | Files outside branches must be DELETED or MOVED | CTB_VIOLATION |

### §2 Branch Definitions

| Branch | Contains | Never Contains |
|--------|----------|----------------|
| `sys/` | Env loaders, bootstraps, config readers | Business logic |
| `data/` | Schemas, queries, migrations, repositories | UI components |
| `app/` | Modules, services, workflows, business logic | Infrastructure |
| `ai/` | Agents, routers, prompts, LLM integrations | Raw data access |
| `ui/` | Pages, components, layouts, styles | Backend logic |

### §3 Forbidden Patterns

| ID | Forbidden Folder | Reason |
|----|------------------|--------|
| CTB-F01 | `utils/` | Junk drawer anti-pattern |
| CTB-F02 | `helpers/` | Junk drawer anti-pattern |
| CTB-F03 | `common/` | Junk drawer anti-pattern |
| CTB-F04 | `shared/` | Ownership violation |
| CTB-F05 | `lib/` | Vendoring anti-pattern |
| CTB-F06 | `misc/` | Junk drawer anti-pattern |

**Detection of any forbidden folder is an automatic CTB_VIOLATION.**

### §4 Support Folders

These exist at repository root. They are NOT CTB branches:

| Folder | Purpose | Location |
|--------|---------|----------|
| `docs/` | Documentation | repo root |
| `config/` | Configuration | repo root |
| `scripts/` | Automation | repo root |
| `ops/` | Operations | repo root |

---

## PART III — CC HIERARCHY LAW

CC (Canonical Chain) defines authority. It is hierarchy, not cardinality.

### §1 Layer Definitions (IMMUTABLE)

| Layer | Name | Authority | Scope |
|-------|------|-----------|-------|
| CC-01 | Sovereign | Root authority | External to bounded context |
| CC-02 | Hub | Domain ownership | Within declared boundary |
| CC-03 | Context | Scoped operations | Within hub boundary |
| CC-04 | Process | Execution instance | Runtime only |

### §2 Movement Laws

| ID | Law | Violation |
|----|-----|-----------|
| CC-M01 | No lateral movement between layers | CC_VIOLATION |
| CC-M02 | Authority flows downward only (01→02→03→04) | CC_VIOLATION |
| CC-M03 | Data may read upward; writes require authorization | AUTH_VIOLATION |
| CC-M04 | Debugging traverses upward only | (advisory) |

### §3 Authorization Matrix

| Source | Target | Permission |
|--------|--------|------------|
| CC-01 | CC-01, 02, 03, 04 | PERMITTED |
| CC-02 | CC-01 | DENIED |
| CC-02 | CC-02, 03, 04 (within boundary) | PERMITTED |
| CC-03 | CC-01, 02 | DENIED |
| CC-03 | CC-03, 04 (within context) | PERMITTED |
| CC-04 | CC-01, 02, 03 | DENIED |
| CC-04 | CC-04 (within PID scope) | PERMITTED |

**Unauthorized writes are rejected at boundary. Rejected writes logged to Master Error Log.**

---

## PART IV — HUB-SPOKE GEOMETRY LAW

Hub-spoke defines authority boundaries. Hubs contain logic. Spokes contain nothing.

### §1 Hub Laws

| ID | Law | Violation |
|----|-----|-----------|
| HS-H01 | Hubs own all logic, state, and decisions | HUB_SPOKE_VIOLATION |
| HS-H02 | Identity mints only at hubs | HUB_SPOKE_VIOLATION |
| HS-H03 | One hub per declared bounded context | HUB_SPOKE_VIOLATION |
| HS-H04 | Hub ID is immutable once assigned | HUB_SPOKE_VIOLATION |

### §2 Spoke Laws

| ID | Law | Violation |
|----|-----|-----------|
| HS-S01 | Spokes are interfaces ONLY | HUB_SPOKE_VIOLATION |
| HS-S02 | Spokes typed as Ingress OR Egress (not both) | HUB_SPOKE_VIOLATION |
| HS-S03 | Spokes carry data only; NO logic | HUB_SPOKE_VIOLATION |
| HS-S04 | Spokes do NOT own state | HUB_SPOKE_VIOLATION |

### §3 Interaction Laws

| ID | Law | Violation |
|----|-----|-----------|
| HS-I01 | No spoke-to-spoke interaction | HUB_SPOKE_VIOLATION |
| HS-I02 | All spoke communication routes through hub | HUB_SPOKE_VIOLATION |
| HS-I03 | Nested hubs operate at CC-03 (contexts, not peers) | CC_VIOLATION |

**GOLDEN RULE: Logic lives only inside hubs. Spokes only carry data.**

---

## PART V — IMO FLOW LAW

IMO (Ingress-Middle-Egress) exists ONLY inside hubs. It defines data flow through logic.

### §1 Layer Definitions

| Layer | Name | Owns | Must NOT |
|-------|------|------|----------|
| I | Ingress | Schema validation | Make decisions, mutate business state |
| M | Middle | All logic, all decisions, all state, all tools | Exist outside hub |
| O | Egress | Read-only views, exports | Contain logic |

### §2 Flow Laws

| ID | Law | Violation |
|----|-----|-----------|
| IMO-01 | Ingress MUST NOT make decisions | IMO_VIOLATION |
| IMO-02 | Ingress MUST NOT mutate business state | IMO_VIOLATION |
| IMO-03 | Middle owns ALL logic | IMO_VIOLATION |
| IMO-04 | Middle owns ALL tool invocations | TOOL_VIOLATION |
| IMO-05 | Egress MUST NOT contain logic | IMO_VIOLATION |
| IMO-06 | Egress is read-only | IMO_VIOLATION |

---

## PART VI — DESCENT GATE LAW

Descent defines mandatory sequence. No layer may be skipped. No artifact may be created out of sequence.

### §1 Artifact Legality by Layer

| Artifact | CC-01 | CC-02 | CC-03 | CC-04 |
|----------|-------|-------|-------|-------|
| Sovereign Declaration | LEGAL | — | — | — |
| Hub Identity | — | LEGAL | — | — |
| CTB Placement | — | LEGAL | — | — |
| PRD | — | LEGAL | — | — |
| IMO Definition | — | LEGAL | — | — |
| Spoke Manifest | — | LEGAL | — | — |
| ADR | — | — | LEGAL | — |
| Process Flow | — | — | LEGAL | — |
| PID | — | — | — | LEGAL |
| Code | — | — | — | LEGAL |
| Tests | — | — | — | LEGAL |
| Config | — | — | — | LEGAL |

### §2 Gate Conditions

| Gate | Required Before Descent |
|------|-------------------------|
| CC-01 → CC-02 | Sovereign ID assigned, boundary declared, doctrine version declared |
| CC-02 → CC-03 | Hub ID assigned, CTB placed, IMO defined, PRD written and approved |
| CC-03 → CC-04 | ADRs recorded, process flows documented, constants/variables declared |
| CC-04 Execute | PRD exists, ADRs complete, compliance checklist passed |

### §3 Descent Violations

| Violation | Consequence |
|-----------|-------------|
| Hub defined before sovereign | STOP — return to CC-01 |
| ADR created before PRD | STOP — return to CC-02 |
| Code written before ADR | STOP — return to CC-03 |
| PID minted before code review | REJECT — return to CC-03 |
| Structural change at CC-04 | INVALID — escalate to CC-02 |

### §4 Restart Protocol

If descent violation detected:
1. Identify lowest correctly completed CC layer
2. DELETE all artifacts at or below violated layer
3. Resume from last valid gate
4. NO partial credit — structure is correct or it is not

---

## PART VII — CONSTANTS VS VARIABLES LAW

Constants define. Variables tune. Variables may never redefine constants.

### §1 Definitions

| Category | Characteristic | Mutability |
|----------|----------------|------------|
| Constant | Defines meaning and structure | ADR-gated only |
| Variable | Tunes behavior | Runtime-mutable within bounds |

### §2 Layer Assignment

| CC Layer | Default Category |
|----------|------------------|
| CC-01 | CONSTANT |
| CC-02 | CONSTANT |
| CC-03 | Declared per artifact |
| CC-04 | VARIABLE |

### §3 Inversion Law

| ID | Law | Violation |
|----|-----|-----------|
| CV-01 | Variables may NEVER redefine constants | CONSTANT_VIOLATION |
| CV-02 | Variable cannot alter meaning defined by constant | CONSTANT_VIOLATION |
| CV-03 | Attempted inversion is doctrine violation | DOCTRINE_VIOLATION |

---

## PART VIII — PID DOCTRINE

PID (Process ID) represents execution instance. It exists at CC-04 only.

### §1 Laws

| ID | Law | Violation |
|----|-----|-----------|
| PID-01 | PIDs are unique per execution | PID_VIOLATION |
| PID-02 | PIDs operate exclusively at CC-04 | PID_VIOLATION |
| PID-03 | PIDs are NEVER reused | PID_VIOLATION |
| PID-04 | PIDs are NEVER promoted to higher layers | PID_VIOLATION |
| PID-05 | Retries require NEW PID | PID_VIOLATION |
| PID-06 | Recovery requires NEW PID | PID_VIOLATION |

### §2 Required Contents

Every PID must carry:
- Executor identity (abstract reference)
- Version identifier
- Timestamp of mint

### §3 Permissions

- PID may READ any CC layer
- PID may WRITE only where explicitly authorized by Authorization Matrix

---

## PART IX — VIOLATION ENFORCEMENT

### §1 Violation Categories

| Category | Definition |
|----------|------------|
| CC_VIOLATION | Unauthorized CC layer interaction |
| CTB_VIOLATION | Invalid placement or forbidden folder |
| HUB_SPOKE_VIOLATION | Logic in spoke or spoke-to-spoke |
| IMO_VIOLATION | Logic in I or O layer |
| PID_VIOLATION | PID reuse or invalid promotion |
| AUTH_VIOLATION | Unauthorized write attempt |
| CONSTANT_VIOLATION | Variable redefining constant |
| DESCENT_VIOLATION | Out-of-sequence artifact creation |

### §2 Enforcement Laws

| ID | Law |
|----|-----|
| ENF-01 | All violations halt promotion |
| ENF-02 | All violations logged to Master Error Log |
| ENF-03 | All violations must be resolved before proceeding |
| ENF-04 | Zero tolerance — any violation = FAIL |
| ENF-05 | No exceptions, no interpretations |

### §3 Master Error Log

- One log per sovereign (CC-01)
- Entries are append-only (immutable)
- Entries may NOT be modified or deleted
- Log integrity must be verifiable

---

## PART X — OWNERSHIP CONSTRAINTS

### §1 Sovereign Ownership

| ID | Constraint |
|----|------------|
| OWN-01 | Sovereign creation requires external authorization |
| OWN-02 | Each sovereign has unique, immutable identity |
| OWN-03 | Sovereign governs one or more hubs |
| OWN-04 | Hub belongs to exactly one sovereign |

### §2 Hub Ownership

| ID | Constraint |
|----|------------|
| OWN-05 | Hub owns all logic within boundary |
| OWN-06 | Hub owns all state within boundary |
| OWN-07 | Hub owns all tool invocations (M layer) |
| OWN-08 | Spokes do NOT own tools |

### §3 Data Ownership

| ID | Constraint |
|----|------------|
| OWN-09 | Tables owned by exactly one hub |
| OWN-10 | Tables owned by exactly one sub-hub (CC-03) |
| OWN-11 | Cross-lane joins forbidden unless declared |
| OWN-12 | Metadata lives in data/schema/ |

---

## PART XI — GLOBAL INVARIANTS

These invariants apply to ALL derived systems. They may NOT be overridden.

| Invariant | Authority |
|-----------|-----------|
| CTB branch structure (sys, data, app, ai, ui) | This doctrine |
| CC layer hierarchy (01→02→03→04) | This doctrine |
| CC descent gates (PRD before code, ADR before code) | This doctrine |
| IMO flow (I→M→O) | This doctrine |
| Hub-spoke geometry (logic in hub, data in spoke) | This doctrine |
| Forbidden folders (utils, helpers, common, shared, lib, misc) | This doctrine |
| Single placement rule | This doctrine |
| Immutable identity rule | This doctrine |

**Child repos may NOT override, redefine, or interpret these invariants.**

---

## PART XII — DOCUMENT CONTROL

| Field | Value |
|-------|-------|
| Created | 2026-02-06 |
| Last Modified | 2026-02-06 |
| Doctrine Version | 2.0.0 |
| CTB Version | 2.0.0 |
| Status | LOCKED (CONSTITUTIONAL) |
| Change Protocol | ADR + Human Approval ONLY |

---

## CONSOLIDATION NOTICE

This document consolidates and supersedes:

| Archived File | Original Path | Status |
|---------------|---------------|--------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | templates/doctrine/ | ARCHIVED |
| HUB_SPOKE_ARCHITECTURE.md | templates/doctrine/ | ARCHIVED |
| ALTITUDE_DESCENT_MODEL.md | templates/doctrine/ | ARCHIVED |

Archived files are preserved at: `archive/templates/doctrine/`

**This document is now the sole authoritative source for architectural law.**
