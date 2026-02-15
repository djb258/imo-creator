## Quick Orientation

This repository is "IMO Creator" — a meta-repository template factory that generates doctrine-compliant templates for Hub & Spoke architecture systems.

**Authoritative Doctrine**: All work MUST conform to `templates/doctrine/ARCHITECTURE.md` (v2.1.0)

## Canonical Chain (CC) Architecture

This repository operates at **CC-01 (Sovereign)** level, generating templates for downstream hubs.

| CC Layer | Role | Examples |
|----------|------|----------|
| **CC-01** | Sovereign | This repository (authority anchor) |
| **CC-02** | Hub | Downstream applications using these templates |
| **CC-03** | Context | Spokes, ADRs, guard rails |
| **CC-04** | Process | PIDs, code execution, tests |

## Key Concepts

- **Hub**: An application that owns logic, decisions, state, and CTB placement
- **Spoke**: An interface (I/O only) that carries data, not logic
- **IMO**: Ingress / Middle / Egress layers inside hubs
- **CTB**: Christmas Tree Backbone — structural spine (Trunk / Branch / Leaf)
- **PID**: Process ID, minted at CC-04, never reused
- **OSAM**: Operational Semantic Access Map — query routing contract
- **CONST -> VAR**: Transformation Law — supreme governing principle

## Directory Structure

```
templates/
├── doctrine/         # Authoritative doctrine documents (LOCKED)
├── semantic/         # OSAM query routing contract (LOCKED)
├── prd/              # Product Requirements templates
├── adr/              # Architecture Decision Record templates
├── pr/               # Pull Request templates
├── checklists/       # Compliance checklists
├── child/            # Child repo bootstrap templates
├── claude/           # Claude Code execution prompts (LOCKED)
├── scripts/          # Automation scripts for child repos
├── config/           # Configuration files
├── integrations/     # Integration templates (Composio, Doppler, HEIR, etc.)
├── validators/       # Validator pattern documentation
├── ai-employee/      # AI employee governance
├── gpt/              # Custom GPT instructions
├── audit/            # Audit attestation templates
├── erd/              # ERD metrics templates
└── docs/             # Architecture reference documentation
```

## Key Files

- `CONSTITUTION.md` — What this constitution governs (repo root)
- `CLAUDE.md` — AI agent permissions and locked file registry (repo root)
- `templates/doctrine/ARCHITECTURE.md` — Root doctrine (v2.1.0, consolidates all architecture doctrine)
- `templates/semantic/OSAM.md` — Query routing contract (v1.1.0)
- `templates/SNAP_ON_TOOLBOX.yaml` — Master tool registry (check BEFORE suggesting any tool)
- `templates/TEMPLATES_MANIFEST.yaml` — Machine-readable file index

## Tool Doctrine

Before suggesting ANY tool, library, or vendor:

1. **Check BANNED list** in `templates/SNAP_ON_TOOLBOX.yaml` — if banned, STOP
2. **Check TIER 0** (free) — prefer free tools first
3. **Check TIER 1** (cheap) — existing subscriptions
4. **Check TIER 2** (surgical) — gated by conditions
5. **If NOT LISTED** — ASK, may need ADR

**LLM is tail, not spine. Deterministic solutions first.**

## Conventions and Patterns

- **Doctrine Conformance**: All templates MUST declare doctrine version and CC layer
- **CC Layer Scope**: Every artifact must specify which CC layer(s) it affects
- **Hub Identity**: All hubs require Sovereign ID (CC-01), Hub ID (CC-02), and PID pattern (CC-04)
- **No Cross-Hub Logic**: Logic lives only inside hubs; spokes carry data only
- **Constants vs Variables**: Structure changes require ADRs; configuration is runtime-tunable
- **Sub-hub Cardinality**: Exactly 1 CANONICAL + 1 ERROR table per sub-hub (ADR-001)

## Typical Tasks

### Adding a new template
1. Determine CC layer scope (CC-01/02/03/04)
2. Add Conformance section with Doctrine Version and CC Layer
3. Include Traceability section referencing Canonical Doctrine
4. Update `templates/TEMPLATES_MANIFEST.yaml` with new file entry
5. Run `scripts/verify_templates_manifest.sh` to confirm sync

### Modifying existing template
1. Verify doctrine version compatibility
2. Ensure CC layer boundaries are respected
3. If changing structure (constant), create ADR first
4. Update traceability references

## Commit Style and PR Expectations
- Use conventional commits: `feat(doctrine): ...`, `fix(template): ...`, `chore(deps): ...`
- Keep changes small and focused
- Always declare CC layer scope in PR template

## Files to Inspect First

**Doctrine (read first):**
- `templates/doctrine/ARCHITECTURE.md`
- `templates/semantic/OSAM.md`

**Governance:**
- `CONSTITUTION.md` — Constitutional scope and invariants
- `CLAUDE.md` — AI permissions, locked files, enforcement

**Templates:**
- `templates/TEMPLATES_MANIFEST.yaml` — Complete file index
- `templates/prd/PRD_HUB.md` — Hub PRD template
- `templates/adr/ADR.md` — ADR template
- `templates/checklists/HUB_COMPLIANCE.md` — Compliance checklist
- `templates/SNAP_ON_TOOLBOX.yaml` — Tool registry

## Hard Violations (Stop Immediately)

- Logic exists in a spoke
- Cross-hub state sharing
- Missing Hub ID or Sovereign reference
- Architecture introduced in a PR (requires ADR)
- Upward writes in CC hierarchy
- Tool not in SNAP_ON_TOOLBOX.yaml
- LLM used as spine (not tail)
- Generated files hand-edited without registry update

These are **doctrine violations**, not preferences.
