---
title: "30,000ft - Category"
aliases: [category, 30k, architecture-role]
tags:
  - altitude/30k
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# 30,000ft - Category

> **Altitude**: Architectural / What role we play
> **Audience**: Architects, senior engineers, integration partners

---

## System Category

**Meta-Framework / Doctrine Template**

IMO-Creator is not an application - it's the source template from which applications are born.

---

## Role in Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                     IMO-CREATOR                              │
│                  (Master Doctrine Repo)                      │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Templates  │  │  Validators │  │  Generators │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  Child     │  │  Child     │  │  Child     │
    │  Repo A    │  │  Repo B    │  │  Repo C    │
    │            │  │            │  │            │
    │ (inherits  │  │ (inherits  │  │ (inherits  │
    │  doctrine) │  │  doctrine) │  │  doctrine) │
    └────────────┘  └────────────┘  └────────────┘
```

---

## Interfaces

### Provides To Child Repos

| Interface | Description |
|-----------|-------------|
| `/docs/10-imo.md` template | IMO definition template |
| `/src/{ctb-layers}` structure | CTB directory structure |
| `/config/mcp_registry.json` | Engine capabilities |
| `heir.doctrine.yaml` | HEIR compliance rules |
| GitHub workflows | Auto-generation workflows |
| Workbench module | B2 + DuckDB integration |

### Consumes From External

| Interface | Provider | Purpose |
|-----------|----------|---------|
| MCP Protocol | Composio | Tool routing |
| PostgreSQL | Neon | Persistent storage |
| Object Storage | Backblaze B2 | Artifact storage |
| Webhooks | n8n/Make | Fallback automation |

---

## Boundaries

### This Repo Owns

- Doctrine definition (IMO, CTB, HEIR)
- Scaffold templates
- Validation logic
- Auto-generation workflows
- MCP server implementation
- Workbench module

### This Repo Does NOT Own

- Child repo business logic
- Runtime application code
- User data
- Production databases
- Deployment pipelines (delegated to Vercel/Render)

---

## Integration Points

| System | Integration Type | Direction |
|--------|------------------|-----------|
| GitHub | Webhooks, Actions | Bidirectional |
| Composio | MCP Protocol | Outbound |
| Linear | Task API | Bidirectional |
| Obsidian | File sync | Outbound |
| Vercel | Deployment | Outbound |
| Render | Deployment | Outbound |

---

## Related Docs

- [40k-vision.md](./40k-vision.md) - Why we exist
- [imo_architecture.md](../imo_architecture.md) - Architecture details
- [composio_connection.md](../composio_connection.md) - Composio integration
