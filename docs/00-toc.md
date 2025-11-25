---
title: Barton Doctrine - Table of Contents
aliases: [toc, index, navigation, home]
tags:
  - navigation
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
cssclass: wide-page
---

# Barton Doctrine - Table of Contents

> **Repo**: imo-creator (Master Doctrine)
> **Version**: 1.0.0
> **Last Sync**: 2025-11-25

---

## Quick Navigation

| Level | Document | Purpose |
|-------|----------|---------|
| **IMO** | [[10-imo]] | Data flow definition |
| **CTB** | [[20-ctb-system]] [[20-ctb-data]] [[20-ctb-app]] [[20-ctb-ai]] [[20-ctb-ui]] | Code structure |
| **Altitude** | [[40k-vision]] → [[5k-ops]] | Strategic context |
| **Config** | [[global_config]] | Executable doctrine |

---

## 1. Foundation

### IMO (Input-Middle-Output)
- [[10-imo|IMO Definition]] - **START HERE**
  - INPUT sources and validators
  - MIDDLE processing logic
  - OUTPUT destinations
  - Kill switches for each phase

### Workflow
```
Brainstorm → Linear → Replit(I/O) → Claude Code(Middle) → Eraser → Obsidian
```

---

## 2. CTB Layers (Code-Test-Boundary)

### Layer Documentation
| Layer | Doc | Owner | IMO Phases |
|-------|-----|-------|------------|
| **system** | [[20-ctb-system]] | Claude Code | INPUT, MIDDLE, OUTPUT |
| **data** | [[20-ctb-data]] | Claude Code | INPUT, MIDDLE, OUTPUT |
| **app** | [[20-ctb-app]] | Claude Code | MIDDLE |
| **ai** | [[20-ctb-ai]] | Claude Code | MIDDLE |
| **ui** | [[20-ctb-ui]] | Replit | INPUT, OUTPUT |

### Directory Structure
```
src/
├── system/     # Infrastructure, config, auth, telemetry
├── data/       # Persistence, schemas, clients
├── app/        # Business logic, workflows
├── ai/         # LLM, MCP, subagents
└── ui/         # Web, CLI, generated docs

tests/
├── system/
├── data/
├── app/
├── ai/
└── ui/
```

---

## 3. Altitude Levels

### Strategic Context (40k → 5k)

| Altitude | Doc | Question Answered |
|----------|-----|-------------------|
| **40,000ft** | [[altitude/40k-vision]] | Why does this exist? |
| **30,000ft** | [[altitude/30k-category]] | What role does it play? |
| **20,000ft** | [[altitude/20k-logic]] | How does it work? |
| **10,000ft** | [[altitude/10k-ui]] | What does user interact with? |
| **5,000ft** | [[altitude/5k-ops]] | How does it run in production? |

---

## 4. Configuration

### Doctrine Files
| File | Purpose | Auto-Sync |
|------|---------|-----------|
| [[global_config.yaml]] | Master doctrine config | Yes |
| [[agents.json]] | Agent-to-CTB mapping | If not customized |
| [[mcp_registry.json]] | MCP tool registry | If not customized |
| [[heir.doctrine.yaml]] | HEIR compliance rules | Yes |
| [[linear-task-template.json]] | Linear task template | No |

### Environment
- [[.env.template]] - Required environment variables
- [[BACKBLAZE_B2_SETUP]] - B2 storage setup

---

## 5. Enforcement

### Git Hooks
| Hook | Purpose | Blocking |
|------|---------|----------|
| `pre-commit` | Validate CTB placement, branch name | Yes |
| `commit-msg` | Suggest CTB layer prefix | No |
| `post-merge` | Auto-apply doctrine updates | No |

### Scripts
| Script | Purpose | Schedule |
|--------|---------|----------|
| `validate-structure.sh` | Check doctrine compliance | Pre-commit |
| `audit-drift.sh` | Detect doctrine drift | Weekly |
| `apply-doctrine.py` | Bootstrap/sync doctrine | On pull |

---

## 6. Integration Points

### Tools
| Tool | Purpose | Layers Owned |
|------|---------|--------------|
| **Replit** | UI development | ui, system (partial) |
| **Claude Code** | Backend logic | data, app, ai, system |
| **Eraser.io** | Diagrams | - |
| **Obsidian** | Documentation | - |
| **Linear** | Task management | - |

### External Services
| Service | Doctrine ID | Type |
|---------|-------------|------|
| Neon | 04.04.01 | MCP |
| Firebase | 04.04.02 | MCP |
| Apify | 04.04.03 | MCP |
| n8n | 04.04.F1 | Fallback |
| Make | 04.04.F2 | Fallback |

---

## 7. Workflow Gates

### Hard Rules
- ❌ No CTB until IMO exists
- ❌ No Altitude until CTB exists
- ❌ No code until structure exists
- ❌ Replit cannot touch MIDDLE layer
- ❌ Claude Code owns backend

### Branch Naming
```
ctb-{layer}/{task-id}

Examples:
  ctb-ui/IMO-001
  ctb-app/IMO-042
  ctb-ai/IMO-015
```

---

## 8. Quick Reference

### When Starting New Work
1. Create Linear task with IMO Phase + CTB Layer
2. Branch: `ctb-{layer}/{task-id}`
3. Write code in `src/{layer}/`
4. Write tests in `tests/{layer}/`
5. Commit with `[{layer}] description`

### When Syncing Doctrine
```bash
# Pull latest from master
git pull origin master

# If post-merge hook didn't run:
python scripts/apply-doctrine.py

# Validate compliance
./scripts/validate-structure.sh
```

### Key Commands
```bash
# Validate structure
./scripts/validate-structure.sh

# Audit for drift
./scripts/audit-drift.sh

# Apply doctrine updates
python scripts/apply-doctrine.py

# Dry run (preview only)
python scripts/apply-doctrine.py --dry-run
```

---

## Document Index

### All Documents (A-Z)

#### Config
- [[agents.json]]
- [[global_config.yaml]]
- [[linear-task-template.json]]
- [[mcp_registry.json]]

#### Docs
- [[00-toc]] ← You are here
- [[10-imo]]
- [[20-ctb-ai]]
- [[20-ctb-app]]
- [[20-ctb-data]]
- [[20-ctb-system]]
- [[20-ctb-ui]]

#### Altitude
- [[altitude/40k-vision]]
- [[altitude/30k-category]]
- [[altitude/20k-logic]]
- [[altitude/10k-ui]]
- [[altitude/5k-ops]]

#### Reference
- [[BACKBLAZE_B2_SETUP]]
- [[composio_connection]]
- [[imo_architecture]]
- [[QUICKSTART]]

---

## Obsidian Graph View

This TOC creates the following link structure:

```
                    ┌─────────────┐
                    │   00-toc    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐      ┌───────────┐      ┌───────────┐
   │ 10-imo  │      │  20-ctb-* │      │ altitude/ │
   └─────────┘      └───────────┘      └───────────┘
                           │
         ┌────────┬────────┼────────┬────────┐
         ▼        ▼        ▼        ▼        ▼
      system    data      app      ai       ui
```

---

*Last updated: 2025-11-25*
*Auto-generated links work in Obsidian with wiki-link format*
