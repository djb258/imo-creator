# CTB & Altitude Generator (Repo-Local)
Generates a **horizontal Christmas Tree Backbone** plus **altitude pages** (30k → 20k → 10k → 5k) from `spec/process_map.yaml` (or JSON mirror).

## Usage
```bash
python tools/generate_ctb.py spec/process_map.yaml
# or:
python tools/generate_ctb.py spec/process_map.json
```

## What it generates
- `docs/ctb_horiz.md` — Horizontal CTB ASCII diagram
- `docs/altitude/30k.md` — Strategic overview with swim lanes
- `docs/altitude/20k.md` — Operational design, stages & roles
- `docs/altitude/10k.md` — Tactical step-by-step flows
- `docs/altitude/5k.md` — Execution details (APIs, contracts, guardrails)
- `docs/catalog.md` — Database schemas, tools, MCP servers catalog
- `docs/flows.md` — Information flow arrows (from → to)

## Requirements
- Python 3.7+ (stdlib only)
- **Optional:** `pip install pyyaml` for YAML support
- **Fallback:** Use JSON spec if PyYAML not available

## Factory Integration
This generator is designed to be seeded into any new app repo via:
```bash
# From factory/
python seed_repo.py path/to/new-repo
```

The factory seeding mechanism copies:
- `spec/` directory with template
- `tools/generate_ctb.py` 
- Basic CI workflow
- This README

## Architecture
- **Input:** YAML/JSON spec defining CTB nodes, altitudes, databases, tools, MCPs
- **Output:** GitHub-friendly Markdown pages
- **Principle:** Zero external deps (pure stdlib), YAML optional
- **Format:** ASCII art + structured Markdown for maximum compatibility

## Altitude Philosophy
- **30k:** Strategic swim lanes (inputs → orchestration → enforcement → stores → outputs)
- **20k:** Operational stages and roles (who does what)
- **10k:** Tactical step-by-step with decision points
- **5k:** Execution APIs, contracts, guardrails

## Editing
1. Edit `spec/process_map.yaml` (or .json)
2. Run generator: `python tools/generate_ctb.py spec/process_map.yaml`
3. Review generated docs in `docs/` and `docs/altitude/`
4. Commit all changes (spec + generated docs)

The CI workflow will auto-regenerate docs on any spec changes.