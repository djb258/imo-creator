# Hub & Spoke Templates — Doctrine & Definitions

**Canonical Chain (CC) Level**: CC-01 (Sovereign)

This directory contains the **authoritative templates** used to design, build,
and enforce Hub & Spoke systems across all derived projects.

These templates define **structure and control**, not implementation.
Projects must conform to them.

---

## Authoritative Doctrine

**Read these first:**

> [`doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md`](doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md)

**Root doctrine.** Defines CTB (Christmas Tree Backbone) and CC (Canonical Chain). All other documents derive from this. Covers authorization matrix, PID doctrine, lifecycle states, and master error log.

> [`doctrine/HUB_SPOKE_ARCHITECTURE.md`](doctrine/HUB_SPOKE_ARCHITECTURE.md)

Master reference for Hub/Spoke definitions, IMO model, CTB structure, and required identifiers.

> [`doctrine/ALTITUDE_DESCENT_MODEL.md`](doctrine/ALTITUDE_DESCENT_MODEL.md)

Governs WHEN and HOW templates become legal. Defines mandatory descent sequence (50k → 5k) and gate conditions.

> [`doctrine/DBA_ENFORCEMENT_DOCTRINE.md`](doctrine/DBA_ENFORCEMENT_DOCTRINE.md)

**DBA enforcement rules.** Governs all database and structural changes. Type A/B classification, Gate A/B verification, metadata requirements.

> [`doctrine/TEMPLATE_IMMUTABILITY.md`](doctrine/TEMPLATE_IMMUTABILITY.md)

**Immutability rules.** Defines what is LOCKED, AI non-modification clause, human approval protocol. **ALL doctrine files are LOCKED.**

> [`doctrine/DOCUMENTATION_ERD_DOCTRINE.md`](doctrine/DOCUMENTATION_ERD_DOCTRINE.md)

**Documentation & ERD rules.** Mermaid ERD standard, column dictionary requirements, AI readability test. **Enforces documentation compliance.**

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

If any instruction conflicts with other guidance, **the doctrine wins**.

---

## Canonical Definitions (Single Source of Truth)

### Hub
A **Hub is an application**.
- Owns logic, decisions, state, CTB placement, altitude, full IMO flow
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

### CTB Branches
| Branch | Purpose |
|--------|---------|
| `sys/` | System infrastructure |
| `ui/` | User interfaces |
| `ai/` | AI/ML agents |
| `data/` | Data pipelines |
| `ops/` | Operations |
| `docs/` | Documentation |

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
├── README.md                           # This file
├── SNAP_ON_TOOLBOX.yaml                # Tool registry
├── doctrine/                           # LOCKED — DO NOT MODIFY
│   ├── CANONICAL_ARCHITECTURE_DOCTRINE.md  # Root doctrine (CTB + CC) — READ FIRST
│   ├── HUB_SPOKE_ARCHITECTURE.md       # Hub/Spoke definitions & IMO model
│   ├── ALTITUDE_DESCENT_MODEL.md       # Descent sequence & gate conditions
│   ├── REPO_REFACTOR_PROTOCOL.md       # Repo structure requirements
│   ├── DBA_ENFORCEMENT_DOCTRINE.md     # DBA enforcement rules
│   ├── TEMPLATE_IMMUTABILITY.md        # Immutability rules — AI CANNOT MODIFY
│   └── DOCUMENTATION_ERD_DOCTRINE.md   # Documentation & ERD standard
├── claude/                             # LOCKED — DO NOT MODIFY
│   ├── APPLY_DOCTRINE.prompt.md        # Doctrine execution prompt
│   ├── DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md
│   ├── DECLARE_DATA_AND_RENDER_ERD.prompt.md
│   ├── DECLARE_EXECUTION_WIRING.prompt.md
│   ├── DBA_ENFORCEMENT.prompt.md       # DBA enforcement prompt
│   └── DOCUMENTATION_ERD_ENFORCEMENT.prompt.md  # Documentation enforcement
├── integrations/
│   ├── COMPOSIO.md                     # Composio MCP integration template
│   ├── DOPPLER.md                      # Doppler secrets management template
│   ├── HEIR.md                         # HEIR compliance validation template
│   ├── OBSIDIAN.md                     # Obsidian knowledge base template
│   ├── TOOLS.md                        # Tool doctrine + 19-step pipeline ledger
│   ├── doppler.yaml.template           # Doppler config template
│   └── heir.doctrine.yaml.template     # HEIR doctrine config template
├── checklists/
│   └── HUB_COMPLIANCE.md               # Pre-ship compliance checklist
├── prd/
│   └── PRD_HUB.md                      # Product requirements template
├── pr/
│   ├── PULL_REQUEST_TEMPLATE_HUB.md    # PR template for hub changes
│   └── PULL_REQUEST_TEMPLATE_SPOKE.md  # PR template for spoke changes
└── adr/
    └── ADR.md                          # Architecture Decision Record template
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

- Logic exists in a spoke
- Cross-hub state sharing
- UI making decisions
- Tools spanning hubs
- Missing Hub ID or Process ID
- Repo acting as multiple hubs
- Architecture introduced in a PR

These are **schema violations**, not preferences.

---

## Template Immutability (CRITICAL)

All files in this directory are **LOCKED**.

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
3. Escalate to human

See `doctrine/TEMPLATE_IMMUTABILITY.md` for full rules.

---

## Final Rule

> **The system is correct only if the structure enforces the behavior.**
> If discipline relies on memory, the design has failed.
>
> **Doctrine is LAW. Templates are LAW. Structure is LAW.**
> **If you cannot comply, you do not proceed.**
