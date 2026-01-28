# Hub & Spoke Templates — Doctrine & Definitions

**Canonical Chain (CC) Level**: CC-01 (Sovereign)
**Status**: CONSTITUTIONAL
**Authority**: IMO-Creator

This directory contains the **authoritative templates** used to design, build,
and enforce Hub & Spoke systems across all derived projects.

These templates define **structure and control**, not implementation.
Projects must conform to them.

---

## AI Employee: Start Here

If you are an AI agent operating in any repository governed by IMO-Creator:

### Reading Order (Mandatory)

```
1. IMO_SYSTEM_SPEC.md — compiled system index (FIRST READ)
2. AI_EMPLOYEE_OPERATING_CONTRACT.md — agent constraints and permissions
3. SNAP_ON_TOOLBOX.yaml — tool registry
4. doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md — root law
5. doctrine/TEMPLATE_IMMUTABILITY.md — what you cannot do
6. The specific prompt for your current task (in claude/)
```

> **WARNING**: No prompt in `claude/` is valid unless IMO_SYSTEM_SPEC.md has been loaded first.

### Authority Pyramid

When rules conflict, higher levels win. No exceptions.

```
┌─────────────────────────────────────────┐
│  1. CONSTITUTION.md (repo root)         │  ← Governs what is governed
├─────────────────────────────────────────┤
│  2. IMO_CONTROL.json (repo root)        │  ← Structural governance contract
├─────────────────────────────────────────┤
│  3. IMO_SYSTEM_SPEC.md                  │  ← Compiled system index (FIRST READ)
├─────────────────────────────────────────┤
│  4. AI_EMPLOYEE_OPERATING_CONTRACT.md   │  ← Agent constraints
├─────────────────────────────────────────┤
│  5. CANONICAL_ARCHITECTURE_DOCTRINE.md  │  ← Root doctrine (all others derive)
├─────────────────────────────────────────┤
│  6. Other doctrine/ files               │  ← Specialized rules
├─────────────────────────────────────────┤
│  7. Templates (prd/, adr/, pr/, etc.)   │  ← Artifacts to instantiate
├─────────────────────────────────────────┤
│  8. Claude prompts (claude/)            │  ← Execution instructions
└─────────────────────────────────────────┘
```

### What You MUST Do

1. **Read IMO_CONTROL.json first** in any repo you operate in
2. **Check for violations** before any work
3. **Halt and report** if violations exist
4. **Reference doctrine** — do not interpret it

### What You MUST NOT Do

1. **Modify doctrine files** — PROHIBITED
2. **Reorder rules** — PROHIBITED
3. **Reinterpret meaning** — PROHIBITED
4. **Proceed despite violations** — PROHIBITED
5. **Invent structure** beyond doctrine — PROHIBITED

### Halt Conditions

Stop immediately and report if:

- IMO_CONTROL.json is missing
- Doctrine files are missing
- Structure violates CTB branches
- Forbidden folders exist
- Descent gates not satisfied
- You are asked to modify doctrine

---

## Folder Authority Model

| Folder | Purpose | Status | AI Can Modify |
|--------|---------|--------|---------------|
| `doctrine/` | Constitutional law — the rules | LOCKED | NO |
| `claude/` | System prompts — how to execute | LOCKED | NO |
| `prd/` | PRD template — copy and fill in | TEMPLATE | NO (copy only) |
| `adr/` | ADR template — copy and fill in | TEMPLATE | NO (copy only) |
| `pr/` | PR templates — copy and fill in | TEMPLATE | NO (copy only) |
| `checklists/` | Compliance checklists — run per project | TEMPLATE | NO (copy only) |
| `integrations/` | Setup guides — reference docs | GUIDANCE | NO |
| `validators/` | Validation pattern docs | GUIDANCE | NO |

**LOCKED** = AI cannot modify under any circumstances
**TEMPLATE** = AI copies to derived repos, fills in values
**GUIDANCE** = AI reads for reference, does not copy

---

## LOCKED Status Definition

| Status | AI Can Read | AI Can Modify | Human Can Modify |
|--------|-------------|---------------|------------------|
| LOCKED | Yes | NO | Yes (ADR + approval required) |
| TEMPLATE | Yes | NO (copy only) | Yes (ADR + approval required) |
| GUIDANCE | Yes | NO | Yes |

**Enforcement**: Human review + ADR check. Violations block merge.

---

## Authoritative Doctrine

**Root doctrine (read first):**

> [`doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md`](doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md)

Defines CTB (Christmas Tree Backbone) and CC (Canonical Chain). All other documents derive from this. Covers authorization matrix, PID doctrine, lifecycle states, and master error log.

**Derived doctrine (read after root):**

| Doctrine | Purpose |
|----------|---------|
| [`HUB_SPOKE_ARCHITECTURE.md`](doctrine/HUB_SPOKE_ARCHITECTURE.md) | Hub/Spoke geometry, IMO model, required identifiers |
| [`ALTITUDE_DESCENT_MODEL.md`](doctrine/ALTITUDE_DESCENT_MODEL.md) | CC descent sequence, gate conditions |
| [`REPO_REFACTOR_PROTOCOL.md`](doctrine/REPO_REFACTOR_PROTOCOL.md) | Repo structure requirements, file placement |
| [`DBA_ENFORCEMENT_DOCTRINE.md`](doctrine/DBA_ENFORCEMENT_DOCTRINE.md) | Database change rules, Type A/B classification |
| [`TEMPLATE_IMMUTABILITY.md`](doctrine/TEMPLATE_IMMUTABILITY.md) | Immutability rules, AI prohibition clause |
| [`DOCUMENTATION_ERD_DOCTRINE.md`](doctrine/DOCUMENTATION_ERD_DOCTRINE.md) | ERD standard, column dictionary requirements |

**Key topics covered:**
- Canonical Chain (CC) layers: CC-01 (Sovereign), CC-02 (Hub), CC-03 (Context), CC-04 (Process)
- CTB (Christmas Tree Backbone) structure
- Hub vs Spoke definitions
- IMO (Ingress / Middle / Egress) model
- CC Descent Protocol (gates between layers)
- Authorization matrix (who may write where)
- Process ID (PID) doctrine
- Lifecycle states and transitions
- Constants vs Variables
- Required identifiers (Sovereign ID, Hub ID, Process ID)

If any instruction conflicts with other guidance, **CANONICAL_ARCHITECTURE_DOCTRINE.md wins**.

---

## Canonical Definitions (Single Source of Truth)

### Hub
A **Hub is an application**.
- Owns logic, decisions, state, CTB placement, full IMO flow
- A repository MUST contain **exactly one hub**
- If a repository contains more than one hub, it MUST be split

### Spoke
A **Spoke is an interface**.
- Typed as **I (Ingress)** or **O (Egress)** only
- Owns NO logic, NO state, NO tools
- There is **no such thing as a Middle spoke**

### IMO (Inside Hubs Only)
| Layer | Role |
|-------|------|
| **I — Ingress** | Dumb input only (UI, API, webhook) |
| **M — Middle** | All logic, decisions, state, tools |
| **O — Egress** | Output only (exports, notifications) |

### CTB Branches (Source Code Only)

**These are the ONLY valid branches under `src/`:**

| Branch | Purpose |
|--------|---------|
| `sys/` | System infrastructure (env loaders, bootstraps, config) |
| `data/` | Data layer (schemas, queries, migrations, repositories) |
| `app/` | Application logic (modules, services, workflows) |
| `ai/` | AI components (agents, routers, prompts) |
| `ui/` | User interface (pages, components, layouts) |

**NOT CTB branches (support folders at repo root):**
- `docs/` — Documentation
- `config/` — Configuration
- `scripts/` — Automation

### Canonical Chain (CC) Layers
| CC Layer | Name | Scope |
|----------|------|-------|
| CC-01 | Sovereign | Authority anchor, boundary declaration |
| CC-02 | Hub | Application ownership, PRD, CTB placement |
| CC-03 | Context | ADRs, spokes, guard rails |
| CC-04 | Process | PIDs, code execution, tests |

---

## Directory Structure

```
templates/
├── IMO_SYSTEM_SPEC.md                  # FIRST READ — Compiled system index
├── AI_EMPLOYEE_OPERATING_CONTRACT.md   # Agent constraints and permissions
├── README.md                           # This file — Directory guide
├── SNAP_ON_TOOLBOX.yaml                # Tool registry (approved tools only)
│
├── doctrine/                           # LOCKED — AI CANNOT MODIFY
│   ├── CANONICAL_ARCHITECTURE_DOCTRINE.md  # Root doctrine — READ FIRST
│   ├── HUB_SPOKE_ARCHITECTURE.md       # Hub/Spoke geometry
│   ├── ALTITUDE_DESCENT_MODEL.md       # Descent gates
│   ├── REPO_REFACTOR_PROTOCOL.md       # Structure requirements
│   ├── DBA_ENFORCEMENT_DOCTRINE.md     # DBA rules
│   ├── TEMPLATE_IMMUTABILITY.md        # Immutability rules
│   └── DOCUMENTATION_ERD_DOCTRINE.md   # ERD standard
│
├── claude/                             # LOCKED — AI CANNOT MODIFY
│   ├── APPLY_DOCTRINE.prompt.md        # Doctrine execution
│   ├── DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md
│   ├── DECLARE_DATA_AND_RENDER_ERD.prompt.md
│   ├── DECLARE_EXECUTION_WIRING.prompt.md
│   ├── DBA_ENFORCEMENT.prompt.md       # DBA enforcement
│   └── DOCUMENTATION_ERD_ENFORCEMENT.prompt.md
│
├── prd/                                # TEMPLATE — Copy to derived repos
│   └── PRD_HUB.md
│
├── adr/                                # TEMPLATE — Copy to derived repos
│   └── ADR.md
│
├── pr/                                 # TEMPLATE — Copy to derived repos
│   ├── PULL_REQUEST_TEMPLATE_HUB.md
│   └── PULL_REQUEST_TEMPLATE_SPOKE.md
│
├── checklists/                         # TEMPLATE — Copy to derived repos
│   └── HUB_COMPLIANCE.md
│
├── integrations/                       # GUIDANCE — Reference only
│   ├── COMPOSIO.md
│   ├── DOPPLER.md
│   ├── HEIR.md
│   ├── OBSIDIAN.md
│   ├── TOOLS.md
│   ├── doppler.yaml.template
│   └── heir.doctrine.yaml.template
│
└── validators/                         # GUIDANCE — Per-repo implementation
    └── README.md
```

---

## Required Artifacts for Any Hub

Before a hub can ship, it must have:

| Artifact | Template | CC Layer | Purpose |
|----------|----------|----------|---------|
| **PRD** | `prd/PRD_HUB.md` | CC-02 | Defines structure, IMO, CTB, spokes |
| **ADR(s)** | `adr/ADR.md` | CC-03 | Documents decisions (why, not what) |
| **Checklist** | `checklists/HUB_COMPLIANCE.md` | CC-02 | Binary ship gate |
| **PR** | `pr/PULL_REQUEST_TEMPLATE_HUB.md` | CC-04 | Implements approved structure |

If any artifact is missing, incomplete, or bypassed,
the hub is considered **non-viable**.

---

## Required Integrations

All hubs MUST use these integrations:

| Integration | Template | Purpose |
|-------------|----------|---------|
| **Doppler** | `integrations/DOPPLER.md` | Secrets management (no exceptions) |
| **HEIR** | `integrations/HEIR.md` | Compliance validation (programmatic) |
| **Obsidian** | `integrations/OBSIDIAN.md` | Knowledge management vault |
| **Composio** | `integrations/COMPOSIO.md` | MCP server for external services |
| **Tools** | `integrations/TOOLS.md` | Tool selection and registration |

### Setup Checklist

- [ ] Copy `integrations/doppler.yaml.template` to hub root as `doppler.yaml`
- [ ] Copy `integrations/heir.doctrine.yaml.template` to hub root as `heir.doctrine.yaml`
- [ ] Create Doppler project matching hub name
- [ ] Create Obsidian vault with required structure
- [ ] Register all tools in tool ledger with ADRs
- [ ] Configure Composio connections for external services
- [ ] Run HEIR checks: `python -m packages.heir.checks`

---

## Promotion Gates

| Gate | Artifact | CC Layer | Requirement |
|------|----------|----------|-------------|
| G1 | PRD | CC-02 | Hub definition approved |
| G2 | ADR | CC-03 | Architecture decision recorded |
| G3 | Work Item | CC-04 | Work item created and assigned |
| G4 | PR | CC-04 | Code reviewed and merged |
| G5 | Checklist | CC-02 | Deployment verification complete |

---

## Template Usage Rules

- Templates in this directory are **never edited directly**
- Projects **copy and instantiate** templates
- Instantiated files live in project repos under:
  - `/docs/prd/`
  - `/docs/adr/`
  - `.github/PULL_REQUEST_TEMPLATE/`
- Projects declare which template version they conform to

---

## Hard Violations (Stop Immediately)

| Violation | Type | Action |
|-----------|------|--------|
| Logic exists in a spoke | HUB_SPOKE_VIOLATION | HALT |
| Cross-hub state sharing | CC_VIOLATION | HALT |
| UI making decisions | HUB_SPOKE_VIOLATION | HALT |
| Tools spanning hubs | CC_VIOLATION | HALT |
| Missing Hub ID or Process ID | CTB_VIOLATION | HALT |
| Repo acting as multiple hubs | CC_VIOLATION | HALT |
| Architecture introduced in a PR | CC_VIOLATION | HALT |
| Forbidden folder exists (utils, helpers, common, shared, lib, misc) | CTB_VIOLATION | HALT |
| File in `src/` root (not in CTB branch) | CTB_VIOLATION | HALT |

These are **schema violations**, not preferences. **HALT means HALT.**

---

## Template Immutability (CRITICAL)

All files in `doctrine/` and `claude/` are **LOCKED**.

| Prohibition | Applies To |
|-------------|-----------|
| AI modification | ALL doctrine files |
| AI reordering | ALL doctrine rules |
| AI reinterpretation | ALL doctrine meaning |
| Changes without ADR | ALL templates |
| Changes without human approval | ALL constitutional files |

**If AI is asked to modify doctrine:**
1. REFUSE
2. Report: "Template Immutability Doctrine prohibits AI modification"
3. Escalate to human via ADR + block merge

See `doctrine/TEMPLATE_IMMUTABILITY.md` for full rules and escalation mechanism.

---

## Final Rule

> **The system is correct only if the structure enforces the behavior.**
> If discipline relies on memory, the design has failed.
>
> **Doctrine is LAW. Templates are LAW. Structure is LAW.**
> **If you cannot comply, you do not proceed.**
