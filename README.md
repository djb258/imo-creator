# IMO-Creator Hub

**Hub ID:** IMO-001
**Altitude:** 30k (System Architecture)
**Schema:** HEIR/1.0

---

## Overview

This repository is the master orchestration hub containing:

1. **imo-creator/** — Template submodule (authoritative doctrine and templates)
2. **garage-mcp/** — MCP Server sub-hub (implementation)

---

## Structure

```
.
├── imo-creator/              # Submodule: Pure templates & doctrine
│   ├── templates/            # All authoritative templates
│   │   ├── doctrine/         # Master doctrine
│   │   ├── integrations/     # Tool integration templates
│   │   ├── prd/              # PRD templates
│   │   ├── adr/              # ADR templates
│   │   ├── pr/               # PR templates
│   │   └── checklists/       # Compliance checklists
│   └── global-config/        # Shared configuration patterns
├── garage-mcp/               # Sub-hub: MCP Server implementation
│   ├── services/mcp/         # MCP server code
│   ├── packages/heir/        # HEIR compliance checking
│   ├── bays/                 # Bay configurations
│   └── blueprints/           # Blueprint schemas
├── .github/                  # GitHub workflows & templates
├── heir.doctrine.yaml        # HEIR compliance config
└── LICENSE
```

---

## Getting Started

### Pull with Submodules

```bash
git clone --recurse-submodules https://github.com/djb258/imo-creator.git
```

Or if already cloned:

```bash
git submodule update --init --recursive
```

### Update Submodule

```bash
cd imo-creator
git pull origin master
cd ..
git add imo-creator
git commit -m "Update imo-creator submodule"
```

---

## Doctrine Reference

All doctrine and templates are in the `imo-creator/` submodule:

| Document | Path |
|----------|------|
| **Master Doctrine** | `imo-creator/templates/doctrine/HUB_SPOKE_ARCHITECTURE.md` |
| **PRD Template** | `imo-creator/templates/prd/PRD_HUB.md` |
| **ADR Template** | `imo-creator/templates/adr/ADR.md` |
| **Compliance Checklist** | `imo-creator/templates/checklists/HUB_COMPLIANCE.md` |

---

## Sub-Hubs

### garage-mcp (MCP Server)

The MCP server sub-hub provides:
- MCP tools for infrastructure operations
- HEIR compliance checking (`packages/heir/`)
- Bay configurations for frontend/backend/database
- Blueprint validation

```bash
cd garage-mcp
python -m packages.heir.checks  # Run HEIR validation
```

---

## HEIR Compliance

This hub follows HEIR/1.0 schema. Run compliance checks:

```bash
cd garage-mcp
python -m packages.heir.checks
```

Configuration: `heir.doctrine.yaml`

---

## Integrations

All hubs must use these integrations (templates in submodule):

| Integration | Purpose |
|-------------|---------|
| Doppler | Secrets management |
| Composio | MCP server connections |
| HEIR | Compliance validation |
| Obsidian | Knowledge management |

---

## License

MIT License - See [LICENSE](LICENSE)
