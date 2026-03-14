# IMO-Creator

**The Sovereign Garage — Repo of Repos**

This repository defines the authoritative doctrine, agent pipeline, and fleet management for all Hub & Spoke projects. All downstream repos conform to this repo. This repo conforms to nothing.

---

## Purpose

IMO-Creator is the **Garage** — the sovereign control plane that:

- **Defines law** — Doctrine, constitutional governance, registry enforcement
- **Runs the factory** — 5-agent pipeline (Orchestrator → Planner → Builder → DB Agent → Auditor)
- **Manages the fleet** — Car template (blueprint repos), scripts, migrations, snap-on modules

This repo does **not** contain implementation code. It produces and certifies child repos.

---

## Structure

```
imo-creator/
├── CLAUDE.md                      # AI operating contract (HUMAN AUTHORITY ONLY)
├── CONSTITUTION.md                # Human governance
├── OPERATOR_PROFILE.md            # Document of documents (HUMAN AUTHORITY ONLY)
├── README.md                      # This file
├── LICENSE                        # MIT
│
├── law/                           # SILO: CONSTANTS
│   ├── heir.yaml                  # Garage sovereign identity (HEIR)
│   ├── SNAP_ON_TOOLBOX.yaml       # Master tool registry
│   ├── IMO_CONTROL.json           # Control document
│   ├── doctrine/                  # Locked doctrine (ARCHITECTURE, CTB, EXECUTION_SURFACE, etc.)
│   ├── constitutional/            # Governance, backbone, charter, PSB constitution
│   ├── registry/                  # audit_rules, doctrine_registry, repo_registry, etc.
│   ├── integrations/              # TOOLS, COMPOSIO, DOPPLER, HEIR, OBSIDIAN, doppler configs
│   └── semantic/                  # OSAM semantic access map
│
├── factory/                       # SILO: ASSEMBLY LINE
│   ├── SKILLS_SYSTEM.md           # Skills governance (three tiers)
│   ├── agents/                    # Pipeline agent skills + Claude Code agent wrappers
│   │   ├── agent-orchestrator/    # Deterministic intake + ID minting
│   │   ├── agent-planner/         # WORK_PACKET generation + routing
│   │   ├── agent-builder/         # Implementation execution
│   │   ├── agent-auditor/         # Compliance verification + pressure test gate
│   │   ├── agent-db/              # Database change governance
│   │   ├── cloudflare/            # Cloudflare platform skill
│   │   ├── neon/                  # Neon platform skill
│   │   └── garage-*.md            # Claude Code agent wrappers (parallel, refit, auditor)
│   ├── contracts/                 # JSON schemas (work_packet, heir, orbt, certification, etc.)
│   ├── runtime/                   # Live pipeline inbox/outbox (per-agent subdirs)
│   │   ├── inbox/{orchestrator,planner,builder,db-agent,auditor}/
│   │   ├── outbox/{orchestrator,planner,builder,db-agent,auditor}/
│   │   ├── completed/
│   │   ├── fleet_refit/           # Fleet refit bundles
│   │   └── ...                    # repo_mount, sanitation, artifact_writer, etc.
│   ├── certification/             # Signature engine + validator
│   ├── examples/                  # Example work packets
│   ├── operations/                # Operational docs (infrastructure, Doppler, security)
│   └── rosetta-stone/             # Domain translation guides
│
├── fleet/                         # SILO: OUTPUT TO CHILDREN
│   ├── registry/                  # Fleet registry, HEIR/ORBT per child, REPO_REGISTRY
│   │   ├── FLEET_REGISTRY.yaml
│   │   ├── FLEET_SECRETS_MANIFEST.yaml
│   │   ├── heir/                  # Child HEIR records
│   │   └── orbt/                  # Child ORBT tracking
│   ├── car-template/              # THE MOLD — blueprint for every child repo
│   │   ├── law/                   # AI employee contracts, GUARDSPEC, IMO_SYSTEM_SPEC
│   │   ├── factory/agents/        # CAR_SKILL_TEMPLATE
│   │   ├── src/gatekeeper/        # Gatekeeper module
│   │   ├── docs/                  # PRD_HUB, ERD_METRICS
│   │   ├── log/                   # Empty — child creates
│   │   ├── scripts/               # Empty — child inherits from fleet/scripts/
│   │   └── archive/               # Empty — child creates
│   ├── scripts/                   # Scripts children inherit (CTB, codegen, hooks, etc.)
│   ├── migrations/                # SQL templates (001-017) for child DB bootstrapping
│   ├── snap-on/                   # Optional modules (field-monitor, ultimate-tool)
│   ├── prompts/                   # Claude/GPT prompts for child repos
│   ├── config/                    # Shared configuration patterns
│   ├── adr-templates/             # ADR format templates
│   ├── checklists/                # Compliance checklists
│   ├── pr-templates/              # PR format templates
│   ├── docs/                      # Fleet-level documentation
│   └── validators/                # Validation scripts
│
├── docs/                          # GARAGE-LEVEL DOCS
│   ├── adr/                       # Architecture Decision Records (ADR-022+)
│   ├── audit/                     # Audit reports and summaries
│   └── *.md                       # Authority map, doctrine index, enforcement model
│
├── scripts/                       # Garage-level ops scripts
├── dashboard/                     # Ops dashboard app (Vite + React)
└── archive/                       # Superseded agents, templates, legacy directories
```

---

## Getting Started

### For New Projects

1. Read [`law/doctrine/ARCHITECTURE.md`](law/doctrine/ARCHITECTURE.md)
2. Bootstrap from `fleet/car-template/`
3. Configure integrations per `law/integrations/`
4. Run compliance checks via `fleet/scripts/`

### Required Templates (from fleet/)

Every hub needs:

| Template | Path |
|----------|------|
| Hub PRD | `fleet/car-template/docs/PRD_HUB.md` |
| ADR format | `fleet/adr-templates/ADR.md` |
| Compliance checklist | `fleet/checklists/HUB_COMPLIANCE.md` |
| PR format | `fleet/pr-templates/PULL_REQUEST_TEMPLATE_HUB.md` |

### Required Integrations (from law/)

| Integration | Path |
|-------------|------|
| Tools | `law/integrations/TOOLS.md` |
| Doppler | `law/integrations/DOPPLER.md` |
| HEIR | `law/integrations/HEIR.md` |
| Composio | `law/integrations/COMPOSIO.md` |
| Obsidian | `law/integrations/OBSIDIAN.md` |

---

## Agent Pipeline (v3.5.0)

Five-agent pipeline under `factory/agents/`:

| Role | Skill | Purpose |
|------|-------|---------|
| Orchestrator | `factory/agents/agent-orchestrator/SKILL.md` | Deterministic intake + ID minting |
| Planner | `factory/agents/agent-planner/SKILL.md` | WORK_PACKET generation + routing |
| Builder | `factory/agents/agent-builder/SKILL.md` | Implementation execution |
| DB Agent | `factory/agents/agent-db/SKILL.md` | Database change governance |
| Auditor | `factory/agents/agent-auditor/SKILL.md` | Compliance + pressure test gate |

### Pressure Testing

Architectural and flow changes require deterministic proof artifacts:

- **ARCH_PRESSURE_REPORT** — 5 structural invariants
- **FLOW_PRESSURE_REPORT** — 5 flow invariants

All 10 gates are mechanical. No override without ADR + human approval.

---

## Doctrine Summary

- **Hub** = Application (owns logic, state, IMO, CTB placement)
- **Spoke** = Interface only (typed as I or O, no logic)
- **IMO** = Ingress → Middle → Egress (inside hubs only)
- **CTB** = Canonical Table Backbone
- **CONST → VAR** = Nothing exists unless it transforms declared constants into declared variables
- **Three silos** = law (constants) → factory (assembly) → fleet (output)

See full doctrine: [`law/doctrine/ARCHITECTURE.md`](law/doctrine/ARCHITECTURE.md)

---

## Usage Rules

- Law files are **locked** — read, don't modify
- Projects **copy and instantiate** from fleet/car-template/
- Projects declare which template version they conform to
- Changes to locked files require ADR + human approval
- Parent defines. Children conform. Never the reverse.

---

## License

MIT License - See [LICENSE](LICENSE)
