# CTB Reorganization Index

**Repository**: imo-creator
**CTB Version**: 1.0.0
**Reorganization Date**: 2025-10-23
**Status**: In Progress

---

## 📋 Overview

This document tracks the reorganization of the imo-creator repository into the Christmas Tree Backbone (CTB) structure. The CTB structure organizes all code, documentation, and resources into six main branches for improved maintainability and scalability.

---

## 🌲 CTB Structure

```
imo-creator/
├── ctb/
│   ├── sys/        # System integrations, infrastructure, services
│   ├── ai/         # AI models, prompts, blueprints, training
│   ├── data/       # Database schemas, migrations, data models
│   ├── docs/       # Documentation, guides, manuals
│   ├── ui/         # User interface components, pages, templates
│   └── meta/       # CTB metadata, registry, tags
├── logs/           # Application and audit logs
└── global-config.yaml   # Global repository configuration
```

---

## 📊 Migration Map

### System Integration Files (`sys`)

| Old Path | New Path | Status | Notes |
|----------|----------|--------|-------|
| `src/api/composio_tools.py` | `ctb/sys/api/composio_tools.py` | ✅ Planned | REST API for Composio tools |
| `src/utils/database.py` | `ctb/sys/database/client.py` | ✅ Planned | Direct PostgreSQL client |
| `src/utils/heir_orbt.py` | `ctb/sys/utils/heir_orbt.py` | ✅ Planned | HEIR/ORBT utilities |
| `firebase_mcp.js` | `ctb/sys/firebase/mcp_server.js` | ✅ Planned | Firebase MCP server |
| `mcp-servers/composio-mcp/` | `ctb/sys/composio-mcp/` | ✅ Planned | Composio MCP server |
| `scripts/run_migrations.cjs` | `ctb/sys/database/migrations/run.cjs` | ✅ Planned | Migration runner |

### AI Files (`ai`)

| Old Path | New Path | Status | Notes |
|----------|----------|--------|-------|
| `tools/gemini-cli/` | `ctb/ai/cli/gemini/` | ✅ Planned | Gemini CLI tool |
| `libs/imo_tools/` | `ctb/ai/tools/imo/` | ✅ Planned | IMO tool libraries |
| *Prompts to be added* | `ctb/ai/prompts/` | 📋 Pending | Prompt templates |
| *Models to be added* | `ctb/ai/models/` | 📋 Pending | AI model configs |

### Data Files (`data`)

| Old Path | New Path | Status | Notes |
|----------|----------|--------|-------|
| `migrations/` | `ctb/data/migrations/` | 📋 Pending | SQL migrations |
| *Firebase schemas* | `ctb/data/firebase/` | 📋 Pending | Firestore schemas |
| *Neon schemas* | `ctb/data/neon/` | 📋 Pending | PostgreSQL schemas |
| *Zod validators* | `ctb/data/zod/` | 📋 Pending | Validation schemas |

### Documentation Files (`docs`)

| Old Path | New Path | Status | Notes |
|----------|----------|--------|-------|
| `BARTON_OUTREACH_CORE_UPDATES.md` | `ctb/docs/doctrine/BARTON_OUTREACH_CORE_UPDATES.md` | ✅ Planned | Critical architecture patterns |
| `COMPOSIO_INTEGRATION.md` | `ctb/docs/integrations/COMPOSIO_INTEGRATION.md` | ✅ Planned | Composio integration guide |
| `IMPLEMENTATION_COMPLETE_2025-10-23.md` | `ctb/docs/implementations/2025-10-23.md` | ✅ Planned | Implementation summary |
| `docs/` | `ctb/docs/` | ✅ Planned | All existing documentation |
| `README.md` | `README.md` | ⚡ Keep | Repository root README |
| `CLAUDE.md` | `ctb/docs/ai/CLAUDE.md` | ✅ Planned | Claude bootstrap guide |

### UI Files (`ui`)

| Old Path | New Path | Status | Notes |
|----------|----------|--------|-------|
| *React components* | `ctb/ui/components/` | 📋 Pending | UI components (if any) |
| *Pages* | `ctb/ui/pages/` | 📋 Pending | Application pages |
| *Templates* | `ctb/ui/templates/` | 📋 Pending | UI templates |

### Configuration Files

| Old Path | New Path | Status | Notes |
|----------|----------|--------|-------|
| `.env.example` | `.env.example` | ⚡ Keep | Environment template |
| `config/` | `ctb/sys/config/` | ✅ Planned | System configurations |
| `global-config/` | `ctb/meta/global-config/` | ✅ Planned | Global configuration |
| `package.json` | `package.json` | ⚡ Keep | Node dependencies |
| `requirements.txt` | `requirements.txt` | ⚡ Keep | Python dependencies |

### CTB Infrastructure Files

| Path | Status | Notes |
|------|--------|-------|
| `ctb/sys/global-factory/scripts/ctb_metadata_tagger.py` | ✅ Created | File metadata tagger |
| `ctb/sys/global-factory/scripts/ctb_audit_generator.py` | ✅ Created | Compliance auditor |
| `ctb/sys/global-factory/scripts/ctb_remediator.py` | ✅ Created | Auto-remediation tool |
| `ctb/sys/global-factory/doctrine/` | ✅ Created | CTB doctrine docs |
| `ctb/meta/ctb_registry.json` | ✅ Created | CTB registry |
| `global-config.yaml` | ✅ Created | Global configuration |
| `setup_ctb.sh` | ✅ Created | Bootstrap script |

---

## 📈 Migration Progress

### Overall Progress

| Category | Total Files | Migrated | Remaining | Progress |
|----------|-------------|----------|-----------|----------|
| System (`sys`) | ~15 | 0 | 15 | 🔴 0% |
| AI (`ai`) | ~10 | 0 | 10 | 🔴 0% |
| Data (`data`) | ~5 | 0 | 5 | 🔴 0% |
| Docs (`docs`) | ~25 | 0 | 25 | 🔴 0% |
| UI (`ui`) | ~5 | 0 | 5 | 🔴 0% |
| Infrastructure | 7 | 7 | 0 | ✅ 100% |
| **Total** | **~67** | **7** | **~60** | **🟡 10%** |

### Status Legend

- ✅ **Created** - New CTB file created
- ✅ **Migrated** - File moved to CTB location
- ✅ **Planned** - Migration planned and documented
- 📋 **Pending** - To be migrated
- ⚡ **Keep** - Stays in root directory
- ❌ **Deprecated** - To be removed

---

## 🎯 Migration Phases

### Phase 1: Infrastructure (COMPLETE ✅)
- ✅ Create CTB directory structure
- ✅ Create global-factory scripts
- ✅ Create doctrine documentation
- ✅ Create CTB registry
- ✅ Create global-config.yaml
- ✅ Create bootstrap script

### Phase 2: System Files (IN PROGRESS 🔄)
- 📋 Move API endpoints to `ctb/sys/api/`
- 📋 Move database utilities to `ctb/sys/database/`
- 📋 Move MCP servers to `ctb/sys/composio-mcp/` and `ctb/sys/firebase/`
- 📋 Move configuration files to `ctb/sys/config/`
- 📋 Move utility scripts to `ctb/sys/utils/`

### Phase 3: AI Files (PENDING 📋)
- 📋 Move Gemini CLI to `ctb/ai/cli/gemini/`
- 📋 Move IMO tools to `ctb/ai/tools/imo/`
- 📋 Create prompts directory structure
- 📋 Organize AI model configurations

### Phase 4: Data Files (PENDING 📋)
- 📋 Create migrations directory
- 📋 Organize database schemas by provider
- 📋 Add validation schemas

### Phase 5: Documentation (PENDING 📋)
- 📋 Move all .md files to appropriate `ctb/docs/` subdirectories
- 📋 Reorganize documentation by category
- 📋 Update internal links

### Phase 6: UI Files (PENDING 📋)
- 📋 Identify and move UI components
- 📋 Organize pages and templates
- 📋 Structure styling files

### Phase 7: Validation (PENDING 📋)
- 📋 Run compliance audit
- 📋 Fix broken imports
- 📋 Verify all file access
- 📋 Update documentation
- 📋 Achieve 90+ compliance score

---

## 🔧 Automated Tools

### Run Metadata Tagger
```bash
python ctb/sys/global-factory/scripts/ctb_metadata_tagger.py
```

Generates `ctb/meta/ctb_tags.json` with file classifications.

### Run Compliance Audit
```bash
python ctb/sys/global-factory/scripts/ctb_audit_generator.py
```

Generates `logs/ctb_audit_report.json` with compliance score.

### Auto-Remediate Issues
```bash
# Preview changes
python ctb/sys/global-factory/scripts/ctb_remediator.py --dry-run

# Apply fixes
python ctb/sys/global-factory/scripts/ctb_remediator.py
```

---

## 📝 Notes

### Import Path Updates Required
After migration, update import statements in code:

**Before**:
```python
from src.api.composio_tools import router
from src.utils.database import get_db_client
from src.utils.heir_orbt import generate_heir_id
```

**After**:
```python
from ctb.sys.api.composio_tools import router
from ctb.sys.database.client import get_db_client
from ctb.sys.utils.heir_orbt import generate_heir_id
```

### Files to Keep in Root
- `package.json` - Node dependencies
- `requirements.txt` - Python dependencies
- `.env.example` - Environment template
- `.gitignore` - Git ignore rules
- `README.md` - Repository overview
- `global-config.yaml` - CTB configuration
- `setup_ctb.sh` - Bootstrap script
- `CTB_INDEX.md` - This file

---

## 🎯 Success Criteria

- [ ] All files classified and tagged
- [ ] 90+ compliance score achieved
- [ ] All imports updated and working
- [ ] Documentation complete and accurate
- [ ] No broken file references
- [ ] CI/CD pipelines updated
- [ ] Team trained on CTB structure

---

## 📊 Compliance Tracking

| Date | Score | Issues | Status |
|------|-------|--------|--------|
| 2025-10-23 | TBD | TBD | Infrastructure created |

Run `ctb_audit_generator.py` to populate this section.

---

**Last Updated**: 2025-10-23
**Next Audit**: Run tagger and auditor to assess current state
**Target Completion**: TBD
