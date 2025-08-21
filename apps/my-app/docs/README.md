# Deep Wiki System

## Core Navigation
- [[wiki/00-overview/index.md|📊 System Overview]]
- [[wiki/branches/README.md|🌲 Branch Architecture]]
- [[wiki/10-input/index.md|📥 Input Layer]]
- [[wiki/20-middle/index.md|⚙️ Middle Layer]]
- [[wiki/30-output/index.md|📤 Output Layer]]
- [[wiki/40-agents/index.md|🤖 Agent System]]
- [[wiki/50-environment/index.md|🔐 Environment]]
- [[wiki/60-operations/index.md|🚀 Operations]]
- [[wiki/70-troubleshooting/index.md|🔧 Troubleshooting]]

## Branch Specifications
This repository uses YAML-driven branch specifications for systematic documentation:
- Branch definitions in `docs/branches/*.yml`
- Schema validation via `docs/branches/schema.json` 
- Auto-generated wiki pages via `npm run docs`

## Quick Commands
```bash
npm run docs         # Generate wiki from branch specs
npm run docs:watch   # Auto-regenerate on changes
npm run env:check    # Validate environment
```

## Architecture Patterns
Each branch follows the Input → Middle → Output pattern with:
- **Altitude assignment** (30k/20k/10k/5k)
- **Tool profiles** (db, deploy, messaging, etc.)
- **Contract definitions** (API endpoints)
- **SLA specifications**
- **Risk assessments**

---
*Deep Wiki System - Generated with IMO Creator v2.0*
