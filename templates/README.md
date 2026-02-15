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

### Reading Order (3-Tier CC Loading System)

Loading is governed by `TEMPLATES_MANIFEST.yaml` § `reading_order`.

| Tier | Files | When |
|------|-------|------|
| **TIER 1** (Mandatory) | `CC_OPERATIONAL_DIGEST.md` → `STARTUP_PROTOCOL.md` → `DOCTRINE.md` | Every session start |
| **TIER 2** (On-Demand) | Domain-specific doctrine, prompts, integrations | When task requires |
| **TIER 3** (Audit/Archive) | Hygiene, attestation, ERD metrics | Audit cycles only |

> **NOTE**: Full loading order with file paths is defined in `TEMPLATES_MANIFEST.yaml`. Consult the manifest, not this summary.

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
│  5. ARCHITECTURE.md                     │  ← CTB Constitutional Law (root doctrine)
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
| `semantic/` | Semantic access contracts (OSAM) | LOCKED | NO |
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

> [`doctrine/ARCHITECTURE.md`](doctrine/ARCHITECTURE.md)

CTB Constitutional Law (v2.1.0). Consolidates all architectural doctrine:
- CTB topology, CC hierarchy, Hub-Spoke geometry, IMO flow
- Descent gates, Constants vs Variables, PID doctrine
- Authorization matrix, violation enforcement, ownership constraints

**Derived doctrine (read after root):**

| Doctrine | Purpose |
|----------|---------|
| [`REPO_REFACTOR_PROTOCOL.md`](doctrine/REPO_REFACTOR_PROTOCOL.md) | Repo structure requirements, file placement |
| [`DBA_ENFORCEMENT_DOCTRINE.md`](doctrine/DBA_ENFORCEMENT_DOCTRINE.md) | Database change rules, Type A/B classification |
| [`TEMPLATE_IMMUTABILITY.md`](doctrine/TEMPLATE_IMMUTABILITY.md) | Immutability rules, AI prohibition clause |
| [`PRD_CONSTITUTION.md`](doctrine/PRD_CONSTITUTION.md) | PRD governance rules |
| [`ERD_CONSTITUTION.md`](doctrine/ERD_CONSTITUTION.md) | ERD governance rules |
| [`DOCUMENTATION_ERD_DOCTRINE.md`](doctrine/DOCUMENTATION_ERD_DOCTRINE.md) | ERD standard, column dictionary requirements |

**Redirected files (point to ARCHITECTURE.md):**
- `CANONICAL_ARCHITECTURE_DOCTRINE.md` → See ARCHITECTURE.md
- `HUB_SPOKE_ARCHITECTURE.md` → See ARCHITECTURE.md Part IV
- `ALTITUDE_DESCENT_MODEL.md` → See ARCHITECTURE.md Part VI

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

If any instruction conflicts with other guidance, **doctrine/ARCHITECTURE.md wins**.

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
templates/                                         # 114 files total
├── AI_EMPLOYEE_OPERATING_CONTRACT.md              # Agent constraints and permissions
├── GUARDSPEC.md                                   # Guard specification
├── IMO_SYSTEM_SPEC.md                             # Compiled system index
├── README.md                                      # This file
├── SNAP_ON_TOOLBOX.yaml                           # Tool registry (approved tools only)
├── TEMPLATE_STAMP_PROTOCOL.md                     # Template stamp protocol
├── TEMPLATES_MANIFEST.yaml                        # Machine-readable manifest (CONSTITUTIONAL)
│
├── adr/                                           # TEMPLATE — Copy to derived repos
│   ├── ADR.md                                     # ADR template
│   └── ADR-001-subhub-table-cardinality.md        # Reference ADR (OWN-10a/b/c)
│
├── ai-employee/                                   # AI employee protocol
│   ├── AI_EMPLOYEE_PROTOCOL.md
│   └── AI_EMPLOYEE_TASK.yaml
│
├── audit/                                         # TEMPLATE — Copy to derived repos
│   └── CONSTITUTIONAL_AUDIT_ATTESTATION.md
│
├── checklists/                                    # TEMPLATE — Copy to derived repos
│   ├── HUB_COMPLIANCE.md
│   └── QUARTERLY_HYGIENE_AUDIT.md
│
├── child/                                         # Child repo bootstrap templates
│   ├── CC_OPERATIONAL_DIGEST.md                   # Tier 1 mandatory (operational rules)
│   ├── column_registry.yml.template               # Registry-first spine
│   ├── DOCTRINE.md.template                       # Doctrine version lock
│   ├── DOCTRINE_CHECKPOINT.yaml.template          # Checkpoint state
│   ├── HUB_DESIGN_DECLARATION.yaml.template       # Hub design intake
│   ├── IMO_CONTROL.json.template                  # Governance contract
│   ├── REGISTRY.yaml.template                     # Hub identity
│   ├── REPO_DOMAIN_SPEC.md.template               # Domain bindings
│   └── STARTUP_PROTOCOL.md                        # Session startup procedure
│
├── claude/                                        # LOCKED — AI CANNOT MODIFY
│   ├── APPLY_DOCTRINE.prompt.md
│   ├── CLEANUP_EXECUTOR.prompt.md
│   ├── DBA_ENFORCEMENT.prompt.md
│   ├── DECLARE_DATA_AND_RENDER_ERD.prompt.md
│   ├── DECLARE_EXECUTION_WIRING.prompt.md
│   ├── DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md
│   ├── DOCUMENTATION_ERD_ENFORCEMENT.prompt.md
│   ├── HUB_DESIGN_DECLARATION_INTAKE.prompt.md
│   ├── HYGIENE_AUDITOR.prompt.md
│   ├── PRD_MIGRATION.prompt.md
│   ├── PRD_TO_ERD_WORKFLOW.prompt.md
│   ├── SYSTEM_FLOW_PROJECTION.prompt.md
│   ├── SYSTEM_MODEL_REGENERATOR.prompt.md
│   ├── UI_DOCTRINE_GENERATOR.prompt.md
│   └── UI_DOCTRINE_REGENERATOR.prompt.md
│
├── config/                                        # Configuration templates
│   ├── branch_protection_config.json
│   ├── ctb.branchmap.yaml
│   ├── CTB_DOCTRINE.md
│   ├── CTB_GOVERNANCE.md
│   ├── ctb_version.json
│   ├── global_manifest.yaml
│   ├── imo_global_config.yaml
│   ├── imo-ra-schema.json
│   ├── QUICK_REFERENCE.md
│   ├── repo_organization_standard.yaml
│   ├── repo_taxonomy.yaml
│   └── required_tools.yaml
│
├── docs/                                          # Documentation templates
│   └── architecture/
│       ├── HUBS_AND_SPOKES.md
│       └── SYSTEM_FUNNEL_OVERVIEW.md
│
├── doctrine/                                      # LOCKED — AI CANNOT MODIFY
│   ├── ALTITUDE_DESCENT_MODEL.md                  # REDIRECT → ARCHITECTURE.md Part VI
│   ├── ARCHITECTURE.md                            # CTB Constitutional Law (v2.1.0)
│   ├── CANONICAL_ARCHITECTURE_DOCTRINE.md         # REDIRECT → ARCHITECTURE.md
│   ├── DBA_ENFORCEMENT_DOCTRINE.md
│   ├── DOCUMENTATION_ERD_DOCTRINE.md
│   ├── ERD_CONSTITUTION.md
│   ├── ERD_DOCTRINE.md
│   ├── HUB_SPOKE_ARCHITECTURE.md                  # REDIRECT → ARCHITECTURE.md Part IV
│   ├── PRD_CONSTITUTION.md
│   ├── PROCESS_DOCTRINE.md
│   ├── REPO_REFACTOR_PROTOCOL.md
│   ├── ROLLBACK_PROTOCOL.md                       # Doctrine sync rollback (locked)
│   └── TEMPLATE_IMMUTABILITY.md
│
├── erd/                                           # ERD templates
│   └── ERD_METRICS.yaml.template
│
├── gpt/                                           # GPT intake guides
│   └── PRD_INTAKE_GUIDE.md
│
├── integrations/                                  # GUIDANCE — Reference only
│   ├── abacus-ai/
│   │   ├── integrations.yaml
│   │   └── README.md
│   ├── COMPOSIO.md
│   ├── DOPPLER.md
│   ├── doppler.yaml.template
│   ├── doppler/
│   │   ├── doppler.bash
│   │   ├── doppler.fish
│   │   └── doppler.zsh
│   ├── heir.doctrine.yaml.template
│   ├── HEIR.md
│   ├── hostinger/
│   │   ├── integrations.yaml
│   │   └── README.md
│   ├── OBSIDIAN.md
│   └── TOOLS.md
│
├── pr/                                            # TEMPLATE — Copy to derived repos
│   ├── PULL_REQUEST_TEMPLATE_HUB.md
│   └── PULL_REQUEST_TEMPLATE_SPOKE.md
│
├── prd/                                           # TEMPLATE — Copy to derived repos
│   └── PRD_HUB.md
│
├── scripts/                                       # Child repo operational scripts
│   ├── apply_ctb_plan.py
│   ├── apply_doctrine_audit.sh
│   ├── codegen-generate.sh
│   ├── codegen-verify.sh
│   ├── ctb_check_version.sh
│   ├── ctb_enforce.sh
│   ├── ctb_init.sh
│   ├── ctb_scaffold_new_repo.sh
│   ├── ctb_verify.sh
│   ├── detect-staleness.ps1
│   ├── detect-staleness.sh
│   ├── dev_setup.sh
│   ├── generate-data-dictionary.sh
│   ├── hooks/
│   │   └── pre-commit
│   ├── install_required_tools.sh
│   ├── install-hooks.ps1
│   ├── install-hooks.sh
│   ├── push-doctrine-update.ps1
│   ├── push-doctrine-update.sh
│   ├── README.md
│   ├── security_lockdown.sh
│   ├── update_from_imo_creator.ps1
│   ├── update_from_imo_creator.sh
│   ├── validate-schema-completeness.ps1
│   ├── validate-schema-completeness.sh
│   ├── verify_manifest.ps1
│   ├── verify_manifest.sh
│   └── verify_required_tools.sh
│
├── semantic/                                      # LOCKED — AI CANNOT MODIFY
│   └── OSAM.md                                    # Operational Semantic Access Map
│
└── validators/                                    # GUIDANCE — Per-repo implementation
    └── README.md
```

---

## Required Artifacts for Any Hub

Before a hub can ship, it must have:

| Artifact | Template | CC Layer | Purpose |
|----------|----------|----------|---------|
| **PRD** | `prd/PRD_HUB.md` | CC-02 | Defines structure, IMO, CTB, spokes |
| **OSAM** | `semantic/OSAM.md` | CC-02 | Query-routing contract (REQUIRED before ERD) |
| **ADR(s)** | `adr/ADR.md` | CC-03 | Documents decisions (why, not what) |
| **Checklist** | `checklists/HUB_COMPLIANCE.md` | CC-02 | Binary ship gate |
| **PR** | `pr/PULL_REQUEST_TEMPLATE_HUB.md` | CC-04 | Implements approved structure |

If any artifact is missing, incomplete, or bypassed,
the hub is considered **non-viable**.

---

## Required Audit Artifacts

Every audit MUST produce these artifacts:

| Artifact | Template | Purpose |
|----------|----------|---------|
| **Quarterly Hygiene Audit** | `checklists/QUARTERLY_HYGIENE_AUDIT.md` | Quarterly audit checklist |
| **Hub Compliance** | `checklists/HUB_COMPLIANCE.md` | Hub-specific compliance verification |
| **Constitutional Attestation** | `audit/CONSTITUTIONAL_AUDIT_ATTESTATION.md` | Final sign-off document |

**Audits without attestation are NON-AUTHORITATIVE.**

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
| **Marking COMPLIANT with HIGH violations** | COMPLIANCE_GATE_VIOLATION | HALT |
| **Marking COMPLIANT with CRITICAL violations** | COMPLIANCE_GATE_VIOLATION | HALT |

These are **schema violations**, not preferences. **HALT means HALT.**

---

## COMPLIANCE GATE (ZERO TOLERANCE)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                      ZERO-TOLERANCE ENFORCEMENT RULE                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  You CANNOT mark an audit as COMPLIANT if:                                    ║
║                                                                               ║
║    1. ANY CRITICAL violations exist                                           ║
║    2. ANY HIGH violations exist                                               ║
║                                                                               ║
║  HIGH violations are NOT "fix later" items.                                   ║
║  HIGH violations BLOCK compliance.                                            ║
║                                                                               ║
║  The ONLY path forward is:                                                    ║
║    → FIX the violation, OR                                                    ║
║    → DOWNGRADE to MEDIUM with documented justification + ADR                  ║
║                                                                               ║
║  NEVER mark COMPLIANT with open HIGH/CRITICAL violations.                     ║
║  This is a HARD RULE. No exceptions.                                          ║
║                                                                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**This rule applies to ALL audits:**
- Quarterly Hygiene Audits
- Hub Compliance Checks
- Constitutional Attestations
- Post-Change Audits
- Post-Cleanup Audits

**If AI marks an audit as COMPLIANT with HIGH/CRITICAL violations:**
1. REJECT the audit
2. The audit is NON-AUTHORITATIVE
3. Violations must be fixed
4. Re-audit required

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
