# CTB (Christmas Tree Backbone) Doctrine

**Status**: POINTER DOCUMENT
**Authority**: SUBORDINATE to `templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md`

---

## Quick Start

To update any repository with the latest CTB structure:

```
"update from imo-creator"
```

---

## Authoritative References

### Constitutional Authority

| Document | Location | Purpose |
|----------|----------|---------|
| **CONSTITUTION.md** | Root | Governing law |
| **IMO_CONTROL.json** | Root | Control plane binding |

### Canonical Doctrine (READ FIRST)

| Document | Location | Purpose |
|----------|----------|---------|
| **CANONICAL_ARCHITECTURE_DOCTRINE.md** | templates/doctrine/ | Master doctrine - CTB structure, CC layers, hub-spoke geometry |
| **HUB_SPOKE_ARCHITECTURE.md** | templates/doctrine/ | Hub-spoke geometry rules |
| **ALTITUDE_DESCENT_MODEL.md** | templates/doctrine/ | CC descent gates (PRD before code, ADR before code) |
| **REPO_REFACTOR_PROTOCOL.md** | templates/doctrine/ | Repo structure requirements |

### Operational Runbooks

| Document | Location | Purpose |
|----------|----------|---------|
| **SECURITY_LOCKDOWN.md** | docs/operations/ | MCP vault, secret handling, zero-tolerance policy |
| **CTB_ENFORCEMENT.md** | docs/operations/ | Enforcement checks, required integrations |
| **GIT_BRANCH_STRATEGY.md** | docs/operations/ | Git branch structure (40k/20k/10k/5k altitude model) |

---

## CTB Branch Structure (Summary)

**Canonical CTB branches** (under `src/` in implementation repos):

| Branch | Purpose |
|--------|---------|
| `sys/` | System infrastructure |
| `data/` | Data layer |
| `app/` | Application logic |
| `ai/` | AI components |
| `ui/` | User interface |

**Full definition**: See `templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md` Section 1.3

---

## CC Layer Hierarchy (Summary)

| Layer | Name | Artifacts |
|-------|------|-----------|
| CC-01 | Sovereign | Boundary declaration |
| CC-02 | Hub | PRD, hub identity, CTB placement |
| CC-03 | Context | ADR, process flows |
| CC-04 | Process | Code, tests, config |

**Full definition**: See `templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md` Section 2

---

## Forbidden Patterns

| Pattern | Violation Type |
|---------|---------------|
| `utils/`, `helpers/`, `common/`, `shared/`, `lib/`, `misc/` | CTB_VIOLATION |
| Logic in spokes | HUB_SPOKE_VIOLATION |
| Code before PRD | CC_VIOLATION |
| Code before ADR | CC_VIOLATION |

---

## Usage Guide

### For New Repositories

```bash
bash global-config/scripts/ctb_scaffold_new_repo.sh /path/to/new-repo
```

### For Existing Repositories

```bash
cd /path/to/existing-repo
cp -r /path/to/imo-creator/global-config .
bash global-config/scripts/ctb_init.sh
```

### Verification

```bash
bash global-config/scripts/ctb_verify.sh
```

---

## Document Control

| Field | Value |
|-------|-------|
| Type | Pointer Document |
| Authority | Subordinate to Canonical Doctrine |
| Version | 2.0.0 |
| Last Modified | 2026-01-11 |
| Change Protocol | ADR-triggered only |

---

> **RULE**: If any content in this document conflicts with `templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md`, the canonical doctrine wins. No exceptions.
