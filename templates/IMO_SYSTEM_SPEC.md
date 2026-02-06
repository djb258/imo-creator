# IMO System Specification

**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: CONSTITUTIONAL
**Version**: 1.4.0
**Purpose**: Compiled System Index — First Read for All Agents

---

## Machine-Readable Entry Point

**For programmatic access, parse `TEMPLATES_MANIFEST.yaml` first.**

This YAML file contains:
- Complete file inventory with purposes
- Reading order with prerequisites
- Category permissions (ai_can_modify flags)
- Bootstrap instructions for new repos
- Update manifest for sync scripts
- Changelog for version tracking

```yaml
# Parse this for structured data:
templates/TEMPLATES_MANIFEST.yaml
```

---

## Reading Order

```
1. TEMPLATES_MANIFEST.yaml — machine-readable index (parse first)
2. THIS FILE (IMO_SYSTEM_SPEC.md) — human-readable system index
3. AI_EMPLOYEE_OPERATING_CONTRACT.md — agent constraints + inheritance law
4. SNAP_ON_TOOLBOX.yaml — tool registry
5. semantic/OSAM.md — query-routing contract (REQUIRED for data/ERD work)
6. Doctrine files as needed
7. REPO_DOMAIN_SPEC.md — REQUIRED for CHILD repos only
```

This file is the **authoritative index** to the IMO-Creator system. It compiles existing doctrine into a single reference. It introduces NO new concepts.

---

## Inheritance Model

### Parent vs Child Repos

| Mode | Repository | Purpose |
|------|------------|---------|
| **PARENT** | `imo-creator` | Define GENERIC system mechanics |
| **CHILD** | Any repo copying templates | Bind DOMAIN-SPECIFIC meaning |

### Inheritance Direction

```
IMO-Creator (PARENT) — generic structure
       │
       ▼ copies templates
       │
Child Repos (CHILDREN) — domain specifics
       │
       ▼ binds meaning via
       │
doctrine/REPO_DOMAIN_SPEC.md
```

### Child Repo Requirement

**CHILD repos MUST have**: `doctrine/REPO_DOMAIN_SPEC.md`

This file binds generic roles (FACT, LANE, LIFECYCLE_STATE) to domain-specific tables and concepts.

**Source**: AI_EMPLOYEE_OPERATING_CONTRACT.md §3

---

## 1. Canonical Vocabulary

These terms have fixed meanings. They may not be redefined.

| Term | Definition | Source |
|------|------------|--------|
| **Sovereign (CC-01)** | Authority anchor. Root of all identity and permission. External to any single bounded context. | ARCHITECTURE.md Part III §1 |
| **Hub (CC-02)** | An application. Owns logic, state, decisions, CTB placement, full IMO flow. One hub per repository. | ARCHITECTURE.md Part IV §1, README.md |
| **Context (CC-03)** | Scoped operational slice. Bounded execution context within a hub. Sub-hubs operate here. | ARCHITECTURE.md Part III §1 |
| **Process (CC-04)** | Execution instance. Runtime operations within a context. PID minted here. | ARCHITECTURE.md Part III §1 |
| **Spoke** | An interface (I or O only). Owns no logic, no state, no tools. | ARCHITECTURE.md Part IV §2 |
| **CTB** | Christmas Tree Backbone. Static structural spine defining where components are placed. | ARCHITECTURE.md Part II |
| **IMO** | Ingress / Middle / Egress. Data flow model inside hubs only. | ARCHITECTURE.md Part V |
| **PID** | Process ID. Unique identifier for a single execution instance at CC-04. | ARCHITECTURE.md Part VIII |
| **ADR** | Architecture Decision Record. Documents WHY, not WHAT. Legal at CC-03. | ARCHITECTURE.md Part VI §1 |
| **PRD** | Product Requirements Document. Defines hub structure. Legal at CC-02. | ARCHITECTURE.md Part VI §1 |
| **Constant** | Defines meaning and structure. ADR-gated to change. Immutable at runtime. | ARCHITECTURE.md Part VII §1 |
| **Variable** | Tunes behavior. Changed via configuration. Mutable at runtime. | ARCHITECTURE.md Part VII §1 |
| **Doctrine** | Executable law. Apply as written. Do not interpret. | README.md |
| **Tool** | Scoped to hub M layer only. Registered with ADR. Determinism first. | TOOLS.md |
| **Lane** | Named boundary grouping related data tables. Exists at CC-03. Isolates data flows. | ARCHITECTURE.md Part X §3 |

---

## 2. Schema Roles

### 2.1 Canonical Chain (CC) — Authority Hierarchy

| Layer | Name | Role | Artifacts Legal |
|-------|------|------|-----------------|
| CC-01 | Sovereign | Authority anchor | Sovereign declaration, boundary definition |
| CC-02 | Hub | Domain ownership | Hub identity, PRD, CTB placement, IMO definition |
| CC-03 | Context | Bounded execution context | ADR, process flows, state diagrams, spoke definitions |
| CC-04 | Process | Runtime execution | PIDs, code, tests, configuration |

**Source**: ARCHITECTURE.md Part III, Part VI

### 2.2 CTB Branches — Physical Placement

| Branch | Purpose |
|--------|---------|
| `sys/` | System infrastructure: env loaders, bootstraps, config readers |
| `data/` | Data layer: schemas, queries, migrations, repositories |
| `app/` | Application logic: modules, services, workflows |
| `ai/` | AI components: agents, routers, prompts |
| `ui/` | User interface: pages, components, layouts |

**Location**: Under `src/` only (e.g., `src/sys/`, `src/data/`)

**Not CTB Branches**: `docs/`, `config/`, `scripts/`, `ops/` (support folders at repo root)

**Source**: ARCHITECTURE.md Part II §2

### 2.3 IMO Layers — Data Flow Inside Hubs

| Layer | Name | Role |
|-------|------|------|
| I | Ingress | Data entry point. May validate schema. MUST NOT make decisions. |
| M | Middle | All logic, all decisions, all transformations, all state, all tools. |
| O | Egress | Outputs and exports. Read-only views. MUST NOT contain logic. |

**Golden Rule**: Logic lives only in M. Spokes are external. Spokes only carry data.

**Source**: ARCHITECTURE.md Part V

### 2.4 Folder Authority

| Folder | Status | AI Can Modify |
|--------|--------|---------------|
| `doctrine/` | LOCKED | NO |
| `claude/` | LOCKED | NO |
| `prd/` | TEMPLATE | NO (copy only) |
| `adr/` | TEMPLATE | NO (copy only) |
| `pr/` | TEMPLATE | NO (copy only) |
| `checklists/` | TEMPLATE | NO (copy only) |
| `integrations/` | GUIDANCE | NO |

**Source**: README.md

---

## 3. Lane Isolation Rules

### 3.1 CC Layer Isolation

- No lateral movement between CC layers
- Authority flows downward only: CC-01 → CC-02 → CC-03 → CC-04
- Data may flow upward for reads; writes require explicit authorization
- Debugging traces upward through CC

**Source**: ARCHITECTURE.md Part III §2

### 3.2 Hub-Spoke Isolation

- Hubs own authority, logic, state, and decisions
- Spokes are interfaces only (typed I or O)
- No spoke-to-spoke interaction
- All spoke communication routes through owning hub
- No spoke contains logic, state, or tools

**Source**: ARCHITECTURE.md Part IV

### 3.3 Cross-Hub Isolation

- No sideways hub-to-hub calls
- No cross-hub logic
- No shared mutable state between hubs
- Tools do not span hubs

**Source**: HUB_COMPLIANCE.md, ARCHITECTURE.md Part IV §3

### 3.4 IMO Isolation

- I layer: no decisions, no state mutation
- M layer: all logic, all decisions, all tools
- O layer: no logic, no decisions

**Source**: ARCHITECTURE.md Part V

---

## 4. Fact vs Interpretation

### 4.1 Facts (Allowed)

| Action | Status |
|--------|--------|
| Read doctrine files | ALLOWED |
| Apply doctrine literally | REQUIRED |
| Reference existing definitions | REQUIRED |
| Report violations | REQUIRED |
| Copy templates | ALLOWED (to downstream repos) |
| Fill in template placeholders | ALLOWED |

### 4.2 Interpretations (Forbidden)

| Action | Status |
|--------|--------|
| Modify doctrine files | FORBIDDEN |
| Reorder rules | FORBIDDEN |
| Reinterpret meaning | FORBIDDEN |
| Add concepts not in canonical | FORBIDDEN |
| "Improve" templates | FORBIDDEN |
| Add "helpful" sections | FORBIDDEN |
| Guess schema | FORBIDDEN |
| Resolve conflicts silently | FORBIDDEN |

**Source**: CLAUDE.md, README.md, TEMPLATE_IMMUTABILITY.md

---

## 5. Semantic Precedence Rule (OSAM)

### 5.1 OSAM Authority

The **Operational Semantic Access Map (OSAM)** is the authoritative query-routing contract.

| Principle | Meaning |
|-----------|---------|
| **OSAM is authoritative** | All query routing derives from OSAM declarations |
| **ERDs are downstream proofs** | ERDs implement OSAM contracts; they do not extend or discover |
| **PRDs must declare OSAM dependency** | PRD Traceability must reference governing OSAM |
| **Agents must follow OSAM strictly** | No ad-hoc queries, no undeclared joins |

### 5.2 OSAM Hierarchy

```
PRD (WHAT transformation)
    │
    ▼
OSAM (WHERE to query, HOW to join) ← Authoritative Query Contract
    │
    ▼
ERD (WHAT tables implement OSAM)
```

**OSAM sits ABOVE ERDs and DRIVES them.**

### 5.3 OSAM Enforcement

| Rule | Enforcement |
|------|-------------|
| Query path not in OSAM | INVALID — Agent must HALT |
| ERD join not in OSAM | VIOLATION — ERD fails audit |
| PRD question not routable via OSAM | VIOLATION — PRD fails audit |
| SOURCE/ENRICHMENT table queried | VIOLATION — Not a query surface |

### 5.4 Table Classifications (OSAM)

| Classification | Query Surface | Use |
|----------------|---------------|-----|
| **QUERY** | YES | Tables that answer questions |
| **SOURCE** | NO | Raw ingested data — never query directly |
| **ENRICHMENT** | NO | Lookup/reference — joined for enrichment only |
| **AUDIT** | NO | Logging/tracking — not for business queries |

**Source**: templates/semantic/OSAM.md

---

## 6. Allowed and Forbidden Joins

### 6.1 Allowed Joins

| Source | Target | Condition |
|--------|--------|-----------|
| CC-01 → CC-02/03/04 | Write | Permitted |
| CC-02 → CC-02 | Write | Same boundary only |
| CC-02 → CC-03/04 | Write | Owned contexts only |
| CC-03 → CC-03/04 | Write | Same context only |
| CC-04 → CC-04 | Write | Same PID scope only |
| Any → Any | Read | Permitted |

### 6.2 Forbidden Joins

| Source | Target | Reason |
|--------|--------|--------|
| CC-02 → CC-01 | Write | Upward authority violation |
| CC-03 → CC-01/02 | Write | Upward authority violation |
| CC-04 → CC-01/02/03 | Write | Upward authority violation |
| Spoke → Spoke | Any | No spoke-to-spoke |
| Hub → Hub | Direct | No cross-hub logic |

**Source**: ARCHITECTURE.md Part III §3

---

## 7. Doctrine File References

### 7.1 Constitutional Law (Root Doctrine)

| File | Purpose | Status |
|------|---------|--------|
| `doctrine/ARCHITECTURE.md` | CTB Constitutional Law — CTB topology, CC hierarchy, Hub-Spoke, IMO, Descent, PID, ownership | LOCKED |
| `doctrine/TEMPLATE_IMMUTABILITY.md` | Immutability rules — AI prohibition clause | LOCKED |

**Redirected files (backward compatibility):**
- `doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md` → REDIRECT to ARCHITECTURE.md
- `doctrine/HUB_SPOKE_ARCHITECTURE.md` → REDIRECT to ARCHITECTURE.md Part IV
- `doctrine/ALTITUDE_DESCENT_MODEL.md` → REDIRECT to ARCHITECTURE.md Part VI

### 7.2 Tool Law

| File | Purpose | Status |
|------|---------|--------|
| `SNAP_ON_TOOLBOX.yaml` | Master tool registry — all approved tools, throttles, gates, banned list | LOCKED |
| `integrations/TOOLS.md` | Tool registration doctrine — determinism first, LLM as tail only | LOCKED |

### 7.3 Templates

| File | Purpose | Status |
|------|---------|--------|
| `prd/PRD_HUB.md` | Hub PRD format | TEMPLATE |
| `adr/ADR.md` | Architecture Decision Record format | TEMPLATE |
| `checklists/HUB_COMPLIANCE.md` | Hub compliance checklist | TEMPLATE |
| `pr/PULL_REQUEST_TEMPLATE_HUB.md` | Hub PR format | TEMPLATE |
| `pr/PULL_REQUEST_TEMPLATE_SPOKE.md` | Spoke PR format | TEMPLATE |

### 7.4 Execution Prompts

| File | Purpose | Status |
|------|---------|--------|
| `claude/APPLY_DOCTRINE.prompt.md` | Doctrine execution | LOCKED |
| `claude/DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md` | Structural instantiation | LOCKED |
| `claude/DECLARE_DATA_AND_RENDER_ERD.prompt.md` | Data declaration | LOCKED |
| `claude/DECLARE_EXECUTION_WIRING.prompt.md` | Execution binding | LOCKED |
| `claude/DBA_ENFORCEMENT.prompt.md` | DBA compliance | LOCKED |
| `claude/DOCUMENTATION_ERD_ENFORCEMENT.prompt.md` | Documentation compliance | LOCKED |
| `claude/HYGIENE_AUDITOR.prompt.md` | Scheduled hygiene audits | LOCKED |
| `claude/CLEANUP_EXECUTOR.prompt.md` | Post-audit cleanup (gated) | LOCKED |

---

## 8. Violation Categories

| Category | Definition | Source |
|----------|------------|--------|
| CC_VIOLATION | Unauthorized CC layer interaction | ARCHITECTURE.md Part IX §1 |
| CTB_VIOLATION | Invalid CTB placement or movement | ARCHITECTURE.md Part IX §1 |
| HUB_SPOKE_VIOLATION | Logic in spoke or spoke-to-spoke communication | ARCHITECTURE.md Part IX §1 |
| PID_VIOLATION | PID reuse or invalid PID operation | ARCHITECTURE.md Part IX §1 |
| AUTH_VIOLATION | Unauthorized write attempt | ARCHITECTURE.md Part IX §1 |
| STATE_VIOLATION | Invalid lifecycle state transition | ARCHITECTURE.md Part IX §1 |
| CONSTANT_VIOLATION | Variable attempted to redefine constant | ARCHITECTURE.md Part IX §1 |
| DATA_VIOLATION | Missing AI-ready metadata | ARCHITECTURE.md Part X §3 |
| DOCTRINE_MODIFICATION | Doctrine file changed without approval | TEMPLATE_IMMUTABILITY.md |
| DESCENT_VIOLATION | Artifact created out of CC sequence | ARCHITECTURE.md Part VI §3 |
| INHERITANCE_VIOLATION | Domain meaning leaked to parent OR parent altered by child | AI_EMPLOYEE_OPERATING_CONTRACT.md §3 |
| BINDING_MISSING | CHILD repo without REPO_DOMAIN_SPEC.md | AI_EMPLOYEE_OPERATING_CONTRACT.md §3 |
| OSAM_MISSING | CHILD repo without OSAM | GUARDSPEC.md §5 |
| OSAM_JOIN_VIOLATION | ERD contains joins not in OSAM | GUARDSPEC.md §5 |
| OSAM_ROUTING_VIOLATION | PRD question not routable via OSAM | GUARDSPEC.md §5 |
| OSAM_SURFACE_VIOLATION | Query targets SOURCE/ENRICHMENT table | semantic/OSAM.md |

---

## 9. Halt Conditions

Stop immediately and report if ANY of these conditions exist:

| Condition | Action |
|-----------|--------|
| IMO_CONTROL.json missing | HALT — cannot proceed |
| Doctrine files missing | HALT — report exact filename |
| Structure violates CTB branches | HALT — report violation |
| Forbidden folders exist | HALT — report path |
| Descent gates not satisfied | HALT — report gate |
| Asked to modify doctrine | REFUSE — escalate to human |
| Violation detected | HALT — log to Master Error Log |
| Ambiguity in requirements | ASK — do not guess |
| CHILD repo without REPO_DOMAIN_SPEC.md | HALT — provide stub, wait |
| Domain meaning in PARENT repo | HALT — remove domain specifics |
| Parent doctrine altered by child | HALT — inheritance violation |
| OSAM missing in CHILD repo | HALT — provide template, wait |
| Query path not declared in OSAM | HALT — routing unknown |
| ERD join not declared in OSAM | HALT — join violation |

**Source**: README.md, APPLY_DOCTRINE.prompt.md, AI_EMPLOYEE_OPERATING_CONTRACT.md

---

## 10. Tool Doctrine Summary

### 10.1 Evaluation Order

```
1. CHECK BANNED LIST FIRST → If banned, STOP, suggest alternative
2. CHECK TIER 0 (FREE) → Prefer free tools first
3. CHECK TIER 1 (CHEAP) → Use existing subscriptions
4. CHECK TIER 2 (SURGICAL) → Gated, require conditions
5. IF NOT LISTED → ASK, may need ADR
```

### 10.2 Core Rules

| Rule | Violation Type |
|------|----------------|
| Tools scoped to hub M layer only | Doctrine violation |
| Spokes do not own tools | Doctrine violation |
| Deterministic solution evaluated first | Doctrine violation |
| LLM as tail arbitration only | Doctrine violation |
| ADR required for every tool | PR rejected |
| Tool not in SNAP_ON_TOOLBOX.yaml | Doctrine violation |

### 10.3 LLM Containment

```
ALLOWED:
  Deterministic logic → exhausted → LLM arbitrates edge case → output validated → action

FORBIDDEN:
  User request → LLM decides → action
```

**LLM is tail, not spine. AI assists, it does not decide.**

**Source**: SNAP_ON_TOOLBOX.yaml, TOOLS.md, CLAUDE.md

---

## 11. Required Identifiers

Every hub MUST have:

| Identifier | CC Layer | Description |
|------------|----------|-------------|
| Sovereign ID | CC-01 | Reference to governing sovereign |
| Hub ID | CC-02 | Unique, immutable hub identifier |
| Process ID (PID) | CC-04 | Execution/trace ID (minted per run) |

**Source**: ARCHITECTURE.md Part IV §1, Part VIII

---

## 12. Lifecycle States

| State | Definition |
|-------|------------|
| DRAFT | Initial state. Not yet validated. |
| ACTIVE | Validated and operational. |
| SUSPENDED | Temporarily halted. May resume. |
| TERMINATED | Permanently ended. Immutable. |

**Allowed Transitions**:
- DRAFT → ACTIVE, TERMINATED
- ACTIVE → SUSPENDED, TERMINATED
- SUSPENDED → ACTIVE, TERMINATED
- TERMINATED → (none)

**Source**: ARCHITECTURE.md Part IX

---

## 13. Authority Pyramid

When rules conflict, higher levels win. No exceptions.

```
┌─────────────────────────────────────────┐
│  1. CONSTITUTION.md (repo root)         │  ← Governs what is governed
├─────────────────────────────────────────┤
│  2. IMO_CONTROL.json (repo root)        │  ← Structural governance contract
├─────────────────────────────────────────┤
│  3. IMO_SYSTEM_SPEC.md (this file)      │  ← Compiled system index
├─────────────────────────────────────────┤
│  4. ARCHITECTURE.md                     │  ← CTB Constitutional Law (root doctrine)
├─────────────────────────────────────────┤
│  5. Other doctrine/ files               │  ← Specialized rules
├─────────────────────────────────────────┤
│  6. Templates (prd/, adr/, pr/, etc.)   │  ← Artifacts to instantiate
├─────────────────────────────────────────┤
│  7. Claude prompts (claude/)            │  ← Execution instructions
└─────────────────────────────────────────┘
```

**Source**: README.md (adapted)

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Last Modified | 2026-01-28 |
| Version | 1.2.0 |
| Status | CONSTITUTIONAL |
| Authority | IMO-Creator (CC-01) |
| Change Protocol | ADR + Human Approval Required |
| Related | AI_EMPLOYEE_OPERATING_CONTRACT.md v2.1.0 (hardened) |
