# Knowledge Base Template

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-03 (Documentation Interface) |

---

## Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | |
| **Hub Name** | |
| **Hub ID** | |
| **Vault Name** | |

---

## Overview

Every hub SHOULD have a knowledge base for documentation and knowledge management.

> **Code lives in Git. Knowledge lives in the vault.**

This template defines the structure for documentation as a CC-03 interface.

---

## Required Vault Structure

```
.obsidian/                    # Obsidian config (gitignored)
vault/
├── 00-INBOX/                 # Unsorted notes, quick captures
├── 10-PRD/                   # Product Requirements Documents
├── 20-ADR/                   # Architecture Decision Records
├── 30-DOCS/                  # Documentation
│   ├── architecture/
│   ├── guides/
│   └── runbooks/
├── 40-MEETINGS/              # Meeting notes
├── 50-RESEARCH/              # Research, spikes, explorations
├── 60-REFERENCES/            # External references, links
├── 70-TEMPLATES/             # Note templates
├── 80-ARCHIVE/               # Completed/deprecated content
└── README.md                 # Vault overview
```

---

## Required Templates

### `70-TEMPLATES/PRD.md`
Copy from `templates/prd/PRD_HUB.md`

### `70-TEMPLATES/ADR.md`
Copy from `templates/adr/ADR.md`

### `70-TEMPLATES/Meeting.md`
```markdown
# Meeting: {{title}}

**Date:** {{date}}
**Attendees:**
**Hub:** {{hub_name}}

---

## Agenda

-

## Notes

-

## Action Items

- [ ]

## Decisions Made

-

---

**Next Meeting:**
```

### `70-TEMPLATES/Daily.md`
```markdown
# {{date}}

## Hub Focus
- **Hub:**
- **CC Layer:**

## Today's Tasks
- [ ]

## Notes

## Blockers

## Tomorrow
```

---

## Obsidian Plugins (Recommended)

| Plugin | Purpose |
|--------|---------|
| **Dataview** | Query and display notes |
| **Templater** | Advanced templates |
| **Git** | Sync vault to GitHub |
| **Kanban** | Task boards |
| **Excalidraw** | Diagrams |
| **Calendar** | Daily notes |

---

## Linking Convention

### Internal Links
```markdown
[[10-PRD/PRD-hub-name]]
[[20-ADR/ADR-001-decision]]
```

### Hub References
```markdown
Hub ID: `<hub-id>`
Process ID: `<hub-id>-<timestamp>-<random>`
Sovereign ID: `<sovereign-id>`
```

### Tags
```markdown
#hub/<hub-name>
#cc/cc-02
#status/active
#type/prd
#type/adr
```

---

## Git Integration

### `.gitignore` additions
```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/plugins/
.obsidian/themes/
.trash/
```

### What to commit
- All markdown files in `vault/`
- `.obsidian/app.json` (core settings)
- `.obsidian/appearance.json` (theme settings)
- `.obsidian/snippets/` (CSS customizations)

---

## Sync Strategy

| Method | Use Case |
|--------|----------|
| **Git** | Primary sync, versioned history |
| **Obsidian Sync** | Real-time multi-device (optional) |
| **iCloud/Dropbox** | Not recommended (conflicts) |

---

## Vault Naming Convention

```
<hub-name>-vault/
```

Follow your organization's naming conventions.

---

## Required Files

Every vault MUST have:

| File | Purpose |
|------|---------|
| `README.md` | Vault overview, quick links |
| `10-PRD/PRD-{hub-name}.md` | Hub PRD |
| `20-ADR/ADR-INDEX.md` | ADR index |
| `70-TEMPLATES/*.md` | All required templates |

---

## Search & Discovery

### Dataview Queries

**All PRDs:**
```dataview
TABLE status, altitude
FROM "10-PRD"
SORT file.mtime DESC
```

**All ADRs:**
```dataview
TABLE status, date
FROM "20-ADR"
WHERE status != "deprecated"
SORT date DESC
```

**Active Tasks:**
```dataview
TASK
FROM "40-MEETINGS" OR "00-INBOX"
WHERE !completed
```

---

## Compliance Checklist

- [ ] Vault created with required structure
- [ ] Templates copied from doctrine
- [ ] Git integration configured
- [ ] .gitignore updated
- [ ] README.md created
- [ ] Hub PRD added to 10-PRD/ (CC-02)
- [ ] ADRs added to 20-ADR/ (CC-03)
- [ ] Naming convention followed

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| PRD | |
| ADR | |
| Work Item | |
