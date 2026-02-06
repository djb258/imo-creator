## Quick Orientation

This repository is "IMO Creator" — a meta-repository template factory that generates doctrine-compliant templates for Hub & Spoke architecture systems.

**Authoritative Doctrine**: All work MUST conform to `templates/doctrine/ARCHITECTURE.md`

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

## Directory Structure

```
templates/
├── doctrine/         # Authoritative doctrine documents
├── prd/              # Product Requirements templates
├── adr/              # Architecture Decision Record templates
├── pr/               # Pull Request templates
├── checklists/       # Compliance checklists
└── integrations/     # Integration templates (MCP, Secrets, etc.)
```

## Key Files

- `templates/doctrine/ARCHITECTURE.md` — Root doctrine (read first, consolidates all architecture doctrine)

## Conventions and Patterns

- **Doctrine Conformance**: All templates MUST declare doctrine version and CC layer
- **CC Layer Scope**: Every artifact must specify which CC layer(s) it affects
- **Hub Identity**: All hubs require Sovereign ID (CC-01), Hub ID (CC-02), and PID pattern (CC-04)
- **No Cross-Hub Logic**: Logic lives only inside hubs; spokes carry data only
- **Constants vs Variables**: Structure changes require ADRs; configuration is runtime-tunable

## Typical Tasks

### Adding a new template
1. Determine CC layer scope (CC-01/02/03/04)
2. Add Conformance section with Doctrine Version and CC Layer
3. Include Traceability section referencing Canonical Doctrine
4. Update `templates/README.md` if adding to structure

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

**Templates:**
- `templates/README.md` — Template directory overview
- `templates/prd/PRD_HUB.md` — Hub PRD template
- `templates/adr/ADR.md` — ADR template
- `templates/checklists/HUB_COMPLIANCE.md` — Compliance checklist

## Hard Violations (Stop Immediately)

- Logic exists in a spoke
- Cross-hub state sharing
- Missing Hub ID or Sovereign reference
- Architecture introduced in a PR (requires ADR)
- Upward writes in CC hierarchy

These are **doctrine violations**, not preferences. 
