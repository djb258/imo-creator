# CTB (Christmas Tree Backbone) Doctrine

**Status**: POINTER DOCUMENT
**Authority**: SUBORDINATE to `templates/doctrine/ARCHITECTURE.md`

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
| **ARCHITECTURE.md** | templates/doctrine/ | CTB Constitutional Law (v2.0.0) - CTB structure, CC layers, hub-spoke geometry, descent gates |
| **REPO_REFACTOR_PROTOCOL.md** | templates/doctrine/ | Repo structure requirements |
| **CTB_GOVERNANCE.md** | templates/config/ | CTB governance template - leaf types, frozen tables, drift detection |

**Note**: ARCHITECTURE.md consolidates CANONICAL_ARCHITECTURE_DOCTRINE.md, HUB_SPOKE_ARCHITECTURE.md, and ALTITUDE_DESCENT_MODEL.md (which now exist as redirects).

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

**Full definition**: See `templates/doctrine/ARCHITECTURE.md` Part II

---

## CC Layer Hierarchy (Summary)

| Layer | Name | Artifacts |
|-------|------|-----------|
| CC-01 | Sovereign | Boundary declaration |
| CC-02 | Hub | PRD, hub identity, CTB placement |
| CC-03 | Context | ADR, process flows |
| CC-04 | Process | Code, tests, config |

**Full definition**: See `templates/doctrine/ARCHITECTURE.md` Part III

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

> **RULE**: If any content in this document conflicts with `templates/doctrine/ARCHITECTURE.md`, the canonical doctrine wins. No exceptions.
