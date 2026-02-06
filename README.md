# IMO-Creator

**The Master Template Repository**

This repository defines the authoritative templates, doctrine, and configuration patterns for all Hub & Spoke projects.

---

## Purpose

IMO-Creator is a **template repository only**. It contains:

- **Doctrine** — Canonical definitions for Hub/Spoke/IMO architecture
- **Templates** — PRD, ADR, PR, and compliance templates
- **Integrations** — Standard tool configurations (Doppler, Composio, HEIR, Obsidian)
- **Global Config** — Shared configuration patterns for all projects

This repo does **not** contain implementation code.

---

## Structure

```
imo-creator/
├── templates/                    # All authoritative templates
│   ├── doctrine/                 # Master doctrine (READ FIRST)
│   ├── integrations/             # Tool integration templates
│   ├── prd/                      # Product requirements templates
│   ├── adr/                      # Architecture decision templates
│   ├── pr/                       # Pull request templates
│   └── checklists/               # Compliance checklists
├── global-config/                # Shared configuration patterns
│   ├── scripts/                  # Automation scripts
│   └── integrations/             # Integration configs
├── .github/                      # GitHub templates and workflows
├── doppler.yaml                  # Doppler config reference
└── LICENSE
```

---

## Getting Started

### For New Projects

1. Read [`templates/doctrine/ARCHITECTURE.md`](templates/doctrine/ARCHITECTURE.md)
2. Copy required templates to your project
3. Configure integrations per templates
4. Run HEIR compliance checks

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

## Doctrine Summary

- **Hub** = Application (owns logic, state, IMO, CTB placement)
- **Spoke** = Interface only (typed as I or O, no logic)
- **IMO** = Ingress → Middle → Egress (inside hubs only)
- **CTB** = sys/, ui/, ai/, data/, ops/, docs/
- **Altitude** = 30k (system) → 5k (execution)

See full doctrine: [`templates/doctrine/ARCHITECTURE.md`](templates/doctrine/ARCHITECTURE.md)

---

## Usage Rules

- Templates in this repository are **never edited directly**
- Projects **copy and instantiate** templates
- Projects declare which template version they conform to
- The doctrine document is the **single source of truth**

---

## License

MIT License - See [LICENSE](LICENSE)
