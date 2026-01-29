# Constitution

**IMO-Creator is a governing constitution, not a framework.**

It defines invariants, gates, and authority boundaries for all derived systems.

---

## What This Constitution Governs

- **Repo structure** — CTB branches define physical placement
- **Descent order** — CC layers define authority hierarchy
- **Flow ownership** — IMO defines ingress/middle/egress within hubs
- **Hub/Spoke geometry** — Hubs own logic, spokes carry data
- **Enforcement mechanisms** — Pre-commit, CI, Claude Code, Lovable.dev

---

## What This Constitution Does NOT Govern

- Programming languages
- Frameworks or libraries
- Test strategies or coverage targets
- Logging implementations
- Deployment mechanics
- Internal folder structure within CTB branches
- Naming conventions

These are **local policy**, delegated to individual repositories.

---

## Scope Boundary

IMO-Creator governs structure and declaration only. Runtime behavior, execution history, retries, and state mutation are explicitly out of scope and must live in downstream systems.

---

## The Transformation Law (CONST → VAR)

**This is the supreme governing principle. All other invariants derive from it.**

> Nothing may exist unless it transforms declared constants into declared variables.

| Proof Type | Purpose | Authority |
|------------|---------|-----------|
| **PRD** | Explains WHY and HOW the transformation occurs | Behavioral proof |
| **ERD** | Proves WHAT structural artifacts are allowed to exist | Structural proof |

**Constitutional rule**: No hub, table, schema, or identifier may be instantiated without both proofs.

A system that cannot be summarized as *"This transforms X constants into Y variables"* is not a valid system under this constitution.

See: `templates/doctrine/PRD_CONSTITUTION.md` and `templates/doctrine/ERD_CONSTITUTION.md`

**Note**: The Constitution does not adjudicate transformation uniqueness. It governs validity, not redundancy.

---

## Canonical Invariants

- **Transformation law**: Constants → Variables (requires PRD + ERD proof)
- **CTB branches**: `sys` / `data` / `app` / `ai` / `ui`
- **CC descent gates**: PRD before code, ADR before code
- **Hub owns logic**: Spokes carry data only, no logic
- **Forbidden folders**: `utils`, `helpers`, `common`, `shared`, `lib`, `misc`
- **Doctrine-first**: Structure before code, gates before artifacts

---

## Global vs Local Authority

IMO-Creator defines global invariants that all repositories must obey. Individual repositories define local policy for how they operate within those boundaries. Global invariants constrain structure; local policy determines usage.

See **CANONICAL_ARCHITECTURE_DOCTRINE.md** for the full authority definition.

---

## Structural Instantiation & Visualization

After constitutional admission, repositories may perform **structural instantiation** to declare hubs, sub-hubs, mint unique identifiers, normalize physical layout, and render a Christmas Tree diagram derived from registry data.

This phase may reorganize files but must not alter logic.

See **DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md** for the execution protocol.

---

## How Enforcement Works

| Layer | Mechanism |
|-------|-----------|
| Claude Code | `APPLY_DOCTRINE.prompt.md` — reads doctrine, audits structure, blocks violations |
| Pre-commit | `scripts/hooks/pre-commit` — validates on every commit |
| CI | `.github/workflows/doctrine-enforcement.yml` — fails PR on violations |
| Lovable.dev | `LOVABLE_CONTROL.json` — gates UI builds on structure compliance |
| Audit | `scripts/apply_doctrine_audit.sh` — generates compliance reports |

---

## How Downstream Repos Inherit This Constitution

1. Copy `IMO_CONTROL.json` to repository root
2. Copy `LOVABLE_CONTROL.json` if UI exists
3. Run `scripts/install-hooks.sh` to install pre-commit
4. Create `DOCTRINE.md` pointing to imo-creator
5. Follow CTB structure exactly
6. Define local policy within invariant boundaries

---

## Document Control

| Field | Value |
|-------|-------|
| Authority | IMO-Creator (Sovereign) |
| Status | CONSTITUTIONAL |
| First Read | Required for Claude Code |
| Full Doctrine | `templates/doctrine/` |
