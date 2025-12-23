# Hub & Spoke Templates — Doctrine & Definitions

This directory contains the **authoritative templates** used to design, build,
and enforce Hub & Spoke systems across all projects and domains.

These templates define **structure and control**, not implementation.
Projects must conform to them.

---

## Authoritative Doctrine

**Read these first:**

> [`doctrine/HUB_SPOKE_ARCHITECTURE.md`](doctrine/HUB_SPOKE_ARCHITECTURE.md)

Master reference for Hub/Spoke definitions, IMO model, CTB structure, and required identifiers.

> [`doctrine/ALTITUDE_DESCENT_MODEL.md`](doctrine/ALTITUDE_DESCENT_MODEL.md)

Governs WHEN and HOW templates become legal. Defines mandatory descent sequence (50k → 5k) and gate conditions.

**Key topics covered:**
- Hub vs Spoke definitions
- IMO (Ingress / Middle / Egress) model
- CTB (Christmas Tree Backbone) structure
- Altitude levels (50k → 5k)
- Required identifiers (Hub ID, Process ID)
- How to create and refactor repositories

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

### Altitude Levels
| Level | Scope |
|-------|-------|
| 50k | Shell (Hub identity + attachments) |
| 40k | Hub-as-application decomposition |
| 30k | CTB placement |
| 20k | IMO definition |
| 10k | Process / logic |
| 5k | Execution / implementation |

---

## Directory Structure

```
templates/
├── README.md                           # This file
├── doctrine/
│   ├── HUB_SPOKE_ARCHITECTURE.md       # Master doctrine (READ FIRST)
│   └── ALTITUDE_DESCENT_MODEL.md       # Descent sequence & gate conditions
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

| Artifact | Template | Purpose |
|----------|----------|---------|
| **PRD** | `prd/PRD_HUB.md` | Defines structure, IMO, CTB, spokes |
| **Checklist** | `checklists/HUB_COMPLIANCE.md` | Binary ship gate |
| **PR** | `pr/PULL_REQUEST_TEMPLATE_HUB.md` | Implements approved structure |
| **ADR(s)** | `adr/ADR.md` | Documents decisions (why, not what) |

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

| Gate | Artifact | Requirement |
|------|----------|-------------|
| G1 | PRD | Hub definition approved |
| G2 | ADR | Architecture decision recorded |
| G3 | Linear Issue | Work item created and assigned |
| G4 | PR | Code reviewed and merged |
| G5 | Checklist | Deployment verification complete |

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

## Final Rule

> **The system is correct only if the structure enforces the behavior.**
> If discipline relies on memory, the design has failed.
