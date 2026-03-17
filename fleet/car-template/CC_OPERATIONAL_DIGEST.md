# CC Operational Digest

**Purpose**: Single-file extraction of ALL operational rules that affect code-level decisions.
**Authority**: Derived from imo-creator doctrine (READ-ONLY)
**Audience**: AI agents and developers in child repos — read BEFORE writing any code.

| Field | Value |
|-------|-------|
| Derived From | ARCHITECTURE.md v2.1.0, TOOLS.md v1.1.0, OSAM.md v1.1.0, CONSTITUTION.md |
| Digest Version | 1.0.0 |
| Status | GENERATED — do not hand-edit. Regenerate from parent. |

---

> **This file is a projection of parent doctrine. If this file conflicts with parent, parent wins.**

---

## §1 — Transformation Law (Supreme Principle)

> Nothing may exist unless it transforms declared constants into declared variables.

| Proof | Purpose | Required Before |
|-------|---------|-----------------|
| **PRD** | Behavioral proof — WHY transformation occurs | ERD, Process, Code |
| **ERD** | Structural proof — WHAT artifacts exist | Process, Code |
| **Process** | Execution declaration — HOW transformation runs | Code |

**Code-level rule**: If you cannot state *"This transforms X constants into Y variables"*, the artifact is invalid.

---

## §2 — Axioms

| # | Axiom | Code Impact |
|---|-------|-------------|
| 1 | **Single Placement** — every component at exactly one location | No file may be duplicated across branches |
| 2 | **Static Structure** — determined at design time | No runtime folder creation, no dynamic module loading that alters structure |
| 3 | **Downward Authority** — authority flows down only | Lower layers cannot modify config of higher layers |
| 4 | **Explicit Declaration** — all boundaries declared | No implicit defaults; undeclared = denied |
| 5 | **Immutable Identity** — IDs never change | Renaming is creation of new identity; old ID is dead |

---

## §3 — CTB Placement (Where Files Go)

### Branch Rules

| ID | Rule | Violation |
|----|------|-----------|
| CTB-B01 | Branches exist only under `src/` | CTB_VIOLATION |
| CTB-B02 | Exactly 5 branches: `sys/`, `data/`, `app/`, `ai/`, `ui/` | CTB_VIOLATION |
| CTB-B03 | Every source file maps to exactly one branch | CTB_VIOLATION |
| CTB-B04 | Files outside branches must be DELETED or MOVED | CTB_VIOLATION |

### Branch Definitions

| Branch | Contains | Never Contains |
|--------|----------|----------------|
| `sys/` | Env loaders, bootstraps, config readers | Business logic |
| `data/` | Schemas, queries, migrations, repositories | UI components |
| `app/` | Modules, services, workflows, business logic | Infrastructure |
| `ai/` | Agents, routers, prompts, LLM integrations | Raw data access |
| `ui/` | Pages, components, layouts, styles | Backend logic |

### Forbidden Folders (Automatic Violation)

| Folder | Reason |
|--------|--------|
| `utils/` | Junk drawer anti-pattern |
| `helpers/` | Junk drawer anti-pattern |
| `common/` | Junk drawer anti-pattern |
| `shared/` | Ownership violation |
| `lib/` | Vendoring anti-pattern |
| `misc/` | Junk drawer anti-pattern |

### Support Folders (Repo Root, NOT CTB Branches)

`docs/` `config/` `scripts/` `ops/`

---

## §4 — CC Authority (Who Governs What)

### Layer Definitions

| Layer | Name | Authority | Scope |
|-------|------|-----------|-------|
| CC-01 | Sovereign | Root authority | External to bounded context |
| CC-02 | Hub | Domain ownership | Within declared boundary |
| CC-03 | Context | Scoped operations | Within hub boundary |
| CC-04 | Process | Execution instance | Runtime only |

### Movement Laws

| ID | Law | Violation |
|----|-----|-----------|
| CC-M01 | No lateral movement between layers | CC_VIOLATION |
| CC-M02 | Authority flows downward only (01→02→03→04) | CC_VIOLATION |
| CC-M03 | Data may read upward; writes require authorization | AUTH_VIOLATION |

### Authorization Matrix

| Source → Target | Permission |
|-----------------|------------|
| CC-01 → any | PERMITTED |
| CC-02 → CC-01 | **DENIED** |
| CC-02 → CC-02/03/04 (within boundary) | PERMITTED |
| CC-03 → CC-01/02 | **DENIED** |
| CC-03 → CC-03/04 (within context) | PERMITTED |
| CC-04 → CC-01/02/03 | **DENIED** |
| CC-04 → CC-04 (within PID scope) | PERMITTED |

---

## §5 — Hub-Spoke Geometry (Who Owns Logic)

### Hub Laws

| ID | Law |
|----|-----|
| HS-H01 | Hubs own ALL logic, state, and decisions |
| HS-H02 | Identity mints only at hubs |
| HS-H03 | One hub per declared bounded context |
| HS-H04 | Hub ID is immutable once assigned |

### Spoke Laws

| ID | Law |
|----|-----|
| HS-S01 | Spokes are interfaces ONLY |
| HS-S02 | Spokes typed as Ingress OR Egress (not both) |
| HS-S03 | Spokes carry data only — NO logic |
| HS-S04 | Spokes do NOT own state |

### Interaction Laws

| ID | Law |
|----|-----|
| HS-I01 | No spoke-to-spoke interaction |
| HS-I02 | All spoke communication routes through hub |
| HS-I03 | Nested hubs operate at CC-03 (contexts, not peers) |

**GOLDEN RULE: Logic lives only inside hubs. Spokes only carry data.**

---

## §6 — IMO Flow (How Data Moves Through Hubs)

IMO exists ONLY inside hubs. It defines data flow through logic.

| Layer | Name | Owns | Must NOT |
|-------|------|------|----------|
| I | Ingress | Schema validation | Make decisions, mutate business state |
| M | Middle | All logic, decisions, state, tools | Exist outside hub |
| O | Egress | Read-only views, exports | Contain logic |

### Flow Laws

| ID | Law | Violation |
|----|-----|-----------|
| IMO-01 | Ingress MUST NOT make decisions | IMO_VIOLATION |
| IMO-02 | Ingress MUST NOT mutate business state | IMO_VIOLATION |
| IMO-03 | Middle owns ALL logic | IMO_VIOLATION |
| IMO-04 | Middle owns ALL tool invocations | TOOL_VIOLATION |
| IMO-05 | Egress MUST NOT contain logic | IMO_VIOLATION |
| IMO-06 | Egress is read-only | IMO_VIOLATION |

---

## §7 — Descent Gates (What Order to Create Artifacts)

### Artifact Legality by Layer

| Artifact | CC-01 | CC-02 | CC-03 | CC-04 |
|----------|:-----:|:-----:|:-----:|:-----:|
| Sovereign Declaration | LEGAL | — | — | — |
| Hub Identity, CTB Placement, PRD, IMO, Spoke Manifest | — | LEGAL | — | — |
| ADR, Process Flow | — | — | LEGAL | — |
| PID, Code, Tests, Config | — | — | — | LEGAL |

### Gate Conditions

| Gate | Required Before Descent |
|------|-------------------------|
| CC-01 → CC-02 | Sovereign ID assigned, boundary declared, doctrine version declared |
| CC-02 → CC-03 | Hub ID assigned, CTB placed, IMO defined, PRD written and approved |
| CC-03 → CC-04 | ADRs recorded, process flows documented, constants/variables declared |
| CC-04 Execute | PRD exists, ADRs complete, compliance checklist passed |

### Descent Violations

| Violation | Consequence |
|-----------|-------------|
| Hub defined before sovereign | STOP — return to CC-01 |
| ADR created before PRD | STOP — return to CC-02 |
| Code written before ADR | STOP — return to CC-03 |
| PID minted before code review | REJECT — return to CC-03 |
| Structural change at CC-04 | INVALID — escalate to CC-02 |

---

## §8 — Constants vs Variables

| Category | Characteristic | Mutability |
|----------|----------------|------------|
| Constant | Defines meaning and structure | ADR-gated only |
| Variable | Tunes behavior | Runtime-mutable within bounds |

### Layer Assignment

| CC Layer | Default Category |
|----------|------------------|
| CC-01 | CONSTANT |
| CC-02 | CONSTANT |
| CC-03 | Declared per artifact |
| CC-04 | VARIABLE |

### Inversion Law

| ID | Law |
|----|-----|
| CV-01 | Variables may NEVER redefine constants |
| CV-02 | Variable cannot alter meaning defined by constant |
| CV-03 | Attempted inversion is doctrine violation |

---

## §9 — PID Doctrine (Execution Instances)

PIDs exist at CC-04 only.

| ID | Law |
|----|-----|
| PID-01 | PIDs are unique per execution |
| PID-02 | PIDs operate exclusively at CC-04 |
| PID-03 | PIDs are NEVER reused |
| PID-04 | PIDs are NEVER promoted to higher layers |
| PID-05 | Retries require NEW PID |
| PID-06 | Recovery requires NEW PID |

Every PID must carry: executor identity, version identifier, timestamp of mint.

---

## §10 — Ownership & Table Cardinality

### Sovereign Ownership

| ID | Constraint |
|----|------------|
| OWN-01 | Sovereign creation requires external authorization |
| OWN-02 | Each sovereign has unique, immutable identity |
| OWN-03 | Sovereign governs one or more hubs |
| OWN-04 | Hub belongs to exactly one sovereign |

### Hub Ownership

| ID | Constraint |
|----|------------|
| OWN-05 | Hub owns all logic within boundary |
| OWN-06 | Hub owns all state within boundary |
| OWN-07 | Hub owns all tool invocations (M layer) |
| OWN-08 | Spokes do NOT own tools |

### Data Ownership & Sub-Hub Table Cardinality (ADR-001)

| ID | Constraint |
|----|------------|
| OWN-09 | Tables owned by exactly one hub |
| OWN-10 | Tables owned by exactly one sub-hub (CC-03) |
| **OWN-10a** | Each sub-hub has exactly **one CANONICAL table** |
| **OWN-10b** | Each sub-hub has exactly **one ERROR table** |
| **OWN-10c** | Additional table types (STAGING, MV, REGISTRY) require ADR justification |
| OWN-11 | Cross-lane joins forbidden unless declared |
| OWN-12 | Metadata lives in `data/schema/` |

---

## §11 — Tool Doctrine

### Core Principles

1. **Hub-Scoped Ownership** — All tools owned by exactly one hub, M layer only. Spokes do not own tools. Cross-hub sharing prohibited.
2. **Determinism First** — Deterministic solutions evaluated before ANY alternative. If deterministic solution exists, it MUST be used.
3. **LLM as Tail** — LLM invoked only after deterministic logic exhausted. LLM output MUST be validated. Audit trail required.

### Tool Categories

| Category | Description | Permitted |
|----------|-------------|-----------|
| Pure Deterministic | 100% predictable output | Preferred |
| Rules-Based | Rules first, deterministic fallback | Permitted |
| LLM Tail | Deterministic first, LLM for edge cases only | Gated |
| Forbidden | No ADR, cross-hub, in spoke, LLM as spine | **NEVER** |

### IMO Layer Constraints for Tools

| Layer | Tools Permitted |
|-------|-----------------|
| I (Ingress) | Data ingestors only — no transformation logic |
| M (Middle) | All processing, decision, and transformation tools |
| O (Egress) | Output formatters only — no decision logic |
| Spokes | **None** |

### Tool Admission Checklist

Every tool requires: (1) registered in hub tool ledger, (2) ADR documented, (3) scoped to M layer, (4) deterministic alternative evaluated, (5) CC layer declared.

### LLM Containment

```
ALLOWED:  Deterministic logic → exhausted → LLM arbitrates edge case → output validated → action
FORBIDDEN: User request → LLM decides → action
```

### Snap-On Toolbox Evaluation Order

| Step | Action |
|------|--------|
| 1 | Check BANNED list → If banned, STOP |
| 2 | Check TIER 0 (FREE) → Prefer free tools |
| 3 | Check TIER 1 (CHEAP) → Existing subscriptions |
| 4 | Check TIER 2 (SURGICAL) → Gated by conditions |
| 5 | If NOT LISTED → ASK, may need ADR |

---

## §12 — Query Routing (OSAM)

### Hierarchy

```
CONSTITUTION.md (Transformation Law)
    → PRD (WHAT transformation)
        → OSAM (WHERE to query, HOW to join)
            → ERD (WHAT tables implement OSAM)
                → Process (HOW transformation executes)
```

**OSAM sits ABOVE ERDs and DRIVES them.** ERDs may only implement relationships OSAM declares.

### Authority Rules

| Rule | Description |
|------|-------------|
| Single Spine | Every hub has exactly ONE spine table |
| Universal Key | All sub-hub tables join to spine via universal join key |
| No Cross-Sub-Hub Joins | Sub-hubs may not join directly to each other |
| Spine Owns Identity | Spine table is authoritative source of entity identity |

### Query Routing Rules

| Rule | Description |
|------|-------------|
| One Table Per Question | Each question type has exactly ONE authoritative table |
| Explicit Paths Only | Only declared join paths may be used |
| No Discovery | Agents may not discover new query paths at runtime |
| HALT on Unknown | If question cannot be routed, agent MUST HALT |

### Table Classifications

| Classification | Query Surface | Can Be "FROM" Table |
|----------------|:------------:|:-------------------:|
| QUERY | YES | YES |
| SOURCE | **NO** | **NO** |
| ENRICHMENT | **NO** | **NO** (join-only) |
| AUDIT | **NO** | **NO** |

### Join Rules

| Rule | Enforcement |
|------|-------------|
| Declared Only | If join not in OSAM, it is INVALID |
| No Ad-Hoc Joins | Agents may not invent joins at runtime |
| ERD Must Implement | ERDs may only contain OSAM-declared joins |
| ADR for New Joins | Adding a join requires ADR approval |

### HALT Conditions

Agent MUST stop and escalate when:

| Condition | Action |
|-----------|--------|
| Question cannot route to declared table | HALT — ask human |
| Question requires undeclared join | HALT — request ADR |
| Question targets SOURCE/ENRICHMENT table | HALT — query surfaces only |
| Cross-sub-hub direct join needed | HALT — isolation violation |
| Concept not declared in OSAM | HALT — semantic gap |
| Multiple tables claim same concept | HALT — ambiguity |

---

## §13 — Registry-First Enforcement

### Canonical Entry Point

`column_registry.yml` is the canonical spine for all data schema in a hub.

| Principle | Rule |
|-----------|------|
| Registry is spine | All table definitions originate in `column_registry.yml` |
| Generated files are projections | TypeScript types / Zod schemas are OUTPUT, never hand-edited |
| Registry drives OSAM | Query surfaces must correspond to registry-declared tables |
| Registry drives ERDs | ERD must reflect registry-declared tables |

### Reading Order for Data Schema

```
OSAM → column_registry.yml → Generated files → Application code
```

**Never the reverse.**

### Pre-Commit Enforcement

| Gate | Trigger | Rule |
|------|---------|------|
| CHECK 8 | Generated folder modified without registry change | VIOLATION |
| CHECK 9 | Registry changed but generated files out of sync | VIOLATION — run `codegen-generate.sh` |
| CHECK 12 | Registry changed but schema metadata incomplete | VIOLATION — run `validate-schema-completeness.sh` |

### Schema Completeness Rule

**DBA_ENFORCEMENT_DOCTRINE.md Gate B** and **DOCUMENTATION_ERD_DOCTRINE.md** require complete metadata for every table and column. The `validate-schema-completeness.sh` script mechanically enforces this.

| Level | Required Fields | Rule |
|-------|----------------|------|
| Table | name, description (min 10 chars), leaf_type, source_of_truth, row_identity_strategy | All must be filled — no placeholders, no nulls |
| Column | name, description (min 10 chars), type, nullable (explicit bool), semantic_role, format | All must be filled — no placeholders, no nulls |

**Semantic roles**: `identifier`, `foreign_key`, `attribute`, `metric`
**Formats**: `UUID`, `ISO-8601`, `USD_CENTS`, `EMAIL`, `ENUM`, `JSON`, `BOOLEAN`, `STRING`, `INTEGER`

The `generate-data-dictionary.sh` script produces `docs/data/COLUMN_DATA_DICTIONARY.md` from the registry. This is a PROJECTION — never hand-edit.

---

## §14 — Violation Categories

| Category | Definition | Severity |
|----------|------------|----------|
| CC_VIOLATION | Unauthorized CC layer interaction | STOP |
| CTB_VIOLATION | Invalid placement or forbidden folder | STOP |
| HUB_SPOKE_VIOLATION | Logic in spoke or spoke-to-spoke | STOP |
| IMO_VIOLATION | Logic in I or O layer | STOP |
| PID_VIOLATION | PID reuse or invalid promotion | STOP |
| AUTH_VIOLATION | Unauthorized write attempt | STOP |
| CONSTANT_VIOLATION | Variable redefining constant | STOP |
| DESCENT_VIOLATION | Out-of-sequence artifact creation | STOP |
| TOOL_VIOLATION | Unapproved tool or tool in wrong layer | STOP |

### Enforcement Laws

- All violations halt promotion (ENF-01)
- All violations logged to Master Error Log (ENF-02)
- All violations must be resolved before proceeding (ENF-03)
- Zero tolerance — any violation = FAIL (ENF-04)
- No exceptions, no interpretations (ENF-05)

---

## §15 — Design Declaration Gate

**All PRDs are INVALID unless they begin with a completed Design Declaration.**

### Required Fields

| Field | Purpose |
|-------|---------|
| Idea/Need | Problem or need that caused this hub to exist |
| Hub Justification | CONST → VAR transformation statement |
| Hub-Spoke Decision | IMPLEMENTED or DECLINED (explicit choice) |
| Candidate Constants | Draft list of invariant inputs |
| Candidate Variables | Draft list of governed outputs |
| Candidate Tools | SNAP-ON TOOLBOX references only |

### Validity Chain

```
Design Declaration (completed) → PRD Body (§§1-15) → ERD → Process/Execution
```

No step may proceed without the prior step being valid.

---

## §16 — Governance Direction

**Doctrine flows DOWN. Never UP.**

| Action | Permitted |
|--------|-----------|
| Child pulls doctrine from parent | YES |
| Child applies doctrine locally | YES |
| Child creates local PRD/ERD/Process | YES |
| Child pushes changes to parent | **FORBIDDEN** |
| Child modifies parent doctrine | **FORBIDDEN** |
| Child submits ADR to parent for human review | YES (change request only) |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [YYYY-MM-DD] |
| Last Modified | [YYYY-MM-DD] |
| Digest Version | 1.0.0 |
| Source Versions | ARCHITECTURE.md v2.1.0, TOOLS.md v1.1.0, OSAM.md v1.1.0 |
| Status | GENERATED |
| Regenerate From | imo-creator parent doctrine |
