# IMO-Creator

**The Master Template Repository**

This repository defines the authoritative templates, doctrine, and configuration patterns for all Hub & Spoke projects.

---

## Purpose

IMO-Creator is a **template repository only**. It contains:

- **Doctrine** — Canonical definitions for Hub/Spoke/IMO architecture
- **Templates** — PRD, ADR, PR, and compliance templates
- **Agent Contracts** — V2 Agent Team (Planner, Worker, Auditor, Orchestrator, DB Agent)
- **Integrations** — Standard tool configurations (Doppler, Composio, HEIR, Obsidian)
- **Configuration** — Shared configuration patterns for all projects
- **Pressure Testing** — 10 mechanical gates for structural + flow enforcement

This repo does **not** contain implementation code.

---

## Structure

```
imo-creator/
├── templates/                    # All authoritative templates
│   ├── doctrine/                 # Master doctrine (READ FIRST)
│   ├── integrations/             # Tool integration templates
│   ├── migrations/               # SQL migration templates (CTB registry, RAW lockdown, vendor JSON)
│   ├── scripts/                  # Enforcement scripts for child repos
│   ├── config/                   # Shared configuration patterns
│   ├── prd/                      # Product requirements templates
│   ├── adr/                      # Architecture decision templates
│   ├── pr/                       # Pull request templates
│   ├── checklists/               # Compliance checklists
│   ├── semantic/                 # OSAM semantic access map
│   └── claude/                   # Claude Code lifecycle prompts
├── ai/                           # V2 Agent Team
│   └── agents/                   # Agent role prompts
│       ├── planner/              # Planner — WORK_PACKET generation
│       ├── worker/               # Worker — implementation (was Builder)
│       ├── auditor/              # Auditor — compliance verification
│       ├── orchestrator/         # Orchestrator — governance inspector (was Control Panel)
│       └── db_agent/             # DB Agent — database change governance
├── sys/                          # System contracts and runtime
│   ├── contracts/                # Active JSON schemas (WORK_PACKET, etc.)
│   ├── certification/            # Certification artifacts
│   ├── registry/                 # Registry definitions
│   └── runtime/                  # Runtime support
├── app/                          # Application layer
├── docs/                         # Governance documentation
│   ├── constitutional/           # Backbone, governance, protected assets
│   ├── audit/                    # Audit reports and findings
│   └── operations/               # Operational guides
├── scripts/                      # Fleet management scripts
├── work_packets/                 # Message bus — WORK_PACKET artifacts
├── changesets/                   # Message bus — CHANGESET artifacts
├── audit_reports/                # Message bus — AUDIT_REPORT artifacts
├── archive/                      # Superseded agents (agents_v0) and templates
├── .github/                      # GitHub templates and workflows
└── LICENSE
```

---

## Getting Started

### For New Projects

1. Read [`templates/doctrine/ARCHITECTURE.md`](templates/doctrine/ARCHITECTURE.md)
2. Copy required templates to your project
3. Configure integrations per templates
4. Run compliance checks

### Required Templates

Every hub needs:

| Template | Purpose |
|----------|---------|
| `templates/prd/PRD_HUB.md` | Hub definition |
| `templates/adr/ADR.md` | Architecture decisions |
| `templates/checklists/HUB_COMPLIANCE.md` | Ship gate |
| `templates/pr/PULL_REQUEST_TEMPLATE_HUB.md` | PR format |

### Required Integrations

Every hub needs:

| Integration | Template |
|-------------|----------|
| Doppler | `templates/integrations/DOPPLER.md` |
| HEIR | `templates/integrations/HEIR.md` |
| Obsidian | `templates/integrations/OBSIDIAN.md` |
| Composio | `templates/integrations/COMPOSIO.md` |
| Tools | `templates/integrations/TOOLS.md` |

---

## Agent Team (v3.4.0)

IMO-Creator includes a V2 Agent Team with five agent roles:

| Role | Prompt | Purpose |
|------|--------|---------|
| Planner | `ai/agents/planner/master_prompt.md` | Generates WORK_PACKET artifacts |
| Worker | `ai/agents/worker/master_prompt.md` | Executes approved WORK_PACKETs |
| Auditor | `ai/agents/auditor/master_prompt.md` | Verifies compliance, pressure test gate |
| Orchestrator | `ai/agents/orchestrator/master_prompt.md` | Read-only governance inspector |
| DB Agent | `ai/agents/db_agent/master_prompt.md` | Database change governance |

### Pressure Testing

Architectural and flow changes require deterministic proof artifacts:

- **ARCH_PRESSURE_REPORT** — 5 structural invariants (cantonal cardinality, registry-first, ID authority, no sideways calls, contracts declared)
- **FLOW_PRESSURE_REPORT** — 5 flow invariants (ingress/egress contracts, no orphan tables, no unconsumed events, ID propagation)

All 10 gates are mechanical. No advisory classification. No override without ADR + human approval.

---

## Doctrine Summary

- **Hub** = Application (owns logic, state, IMO, CTB placement)
- **Spoke** = Interface only (typed as I or O, no logic)
- **IMO** = Ingress → Middle → Egress (inside hubs only)
- **CTB** = sys/, data/, app/, ai/, ui/
- **Altitude** = 50k (identity) → 5k (execution)
- **CONST → VAR** = Nothing exists unless it transforms declared constants into declared variables

See full doctrine: [`templates/doctrine/ARCHITECTURE.md`](templates/doctrine/ARCHITECTURE.md)

---

## Usage Rules

- Templates in this repository are **never edited directly**
- Projects **copy and instantiate** templates
- Projects declare which template version they conform to
- The doctrine document is the **single source of truth**
- Changes to locked files require ADR + human approval

---

## License

MIT License - See [LICENSE](LICENSE)
