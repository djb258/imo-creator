# 🌲 CTB (Christmas Tree Backbone) File Reorganization Index

**Date**: 2025-10-23
**Version**: 1.0
**Status**: Complete Structural Reorganization

---

## 📋 Overview

This document maps the original file locations to their new locations within the CTB (Christmas Tree Backbone) structure. The reorganization follows the Barton Doctrine's hierarchical architecture principles.

---

## 🎯 CTB Structure

```
ctb/
├── sys/          # System Infrastructure (APIs, Services, CI/CD, Tools)
├── ai/           # AI Agents & MCP Scripts
├── data/         # Databases, Schemas, Migrations, Warehouses
├── docs/         # Documentation, Guides, Doctrine
├── ui/           # Frontend Apps, Components, Packages
└── meta/         # Configuration, IDE Settings, Tests
```

---

## 📁 Directory Mappings

### System Infrastructure (`ctb/sys/`)

| Original Location | New Location | Type |
|-------------------|--------------|------|
| `/api/` | `ctb/sys/api/` | Directory |
| `/src/` | `ctb/sys/` | Directory |
| `/services/` | `ctb/sys/services/` | Directory |
| `/scripts/` | `ctb/sys/scripts/` | Directory |
| `/tools/` | `ctb/sys/tools/` | Directory |
| `/libs/` | `ctb/sys/libs/` | Directory |
| `/utils/` | `ctb/sys/utils/` | Directory |
| `/activepieces/` | `ctb/sys/infrastructure/activepieces/` | Directory |
| `/windmill/` | `ctb/sys/infrastructure/windmill/` | Directory |
| `/garage-mcp/` | `ctb/sys/infrastructure/garage-mcp/` | Directory |
| `.github/` | `ctb/sys/ci-cd/.github/` | Directory |
| `*.py` (scripts) | `ctb/sys/scripts/*.py` | Files |
| `*.js` (scripts) | `ctb/sys/scripts/*.js` | Files |
| `*.cjs` (scripts) | `ctb/sys/scripts/*.cjs` | Files |

### AI & MCP (`ctb/ai/`)

| Original Location | New Location | Type |
|-------------------|--------------|------|
| `/claude-agents-library/` | `ctb/ai/agents/` | Directory |
| `/libs/orbt-utils/` | `ctb/ai/orbt-utils/` | Directory |

### Data & Databases (`ctb/data/`)

| Original Location | New Location | Type |
|-------------------|--------------|------|
| `/chartdb/` | `ctb/data/warehouses/chartdb/` | Directory |
| `/chartdb_schemas/` | `ctb/data/schemas/chartdb_schemas/` | Directory |

### Documentation (`ctb/docs/`)

| Original Location | New Location | Type |
|-------------------|--------------|------|
| `/docs/` | `ctb/docs/guides/` | Directory |
| `/doctrine/` | `ctb/docs/doctrine/` | Directory |
| `/global-config/` | `ctb/docs/global-config/` | Directory |
| `/deep_wiki/` | `ctb/docs/references/deep_wiki/` | Directory |
| `/diagrams/` | `ctb/docs/diagrams/` | Directory |
| `COMPOSIO*.md` | `ctb/docs/composio/` | Files |
| `*INTEGRATION*.md` | `ctb/docs/integration/` | Files |
| `BARTON*.md` | `ctb/docs/` | Files |
| `CTB*.md` | `ctb/docs/` | Files |
| `DEEPSEEK*.md` | `ctb/docs/` | Files |
| `DEEPWIKI*.md` | `ctb/docs/` | Files |
| `DEPLOYMENT*.md` | `ctb/docs/` | Files |
| `DRAWIO*.md` | `ctb/docs/` | Files |
| `LLM*.md` | `ctb/docs/` | Files |
| `UPDATE*.md` | `ctb/docs/` | Files |

### UI & Frontend (`ctb/ui/`)

| Original Location | New Location | Type |
|-------------------|--------------|------|
| `/apps/` | `ctb/ui/apps/` | Directory |
| `/packages/` | `ctb/ui/packages/` | Directory |
| `/templates/` | `ctb/ui/templates/` | Directory |
| `/factory/` | `ctb/ui/factory/` | Directory |

### Meta & Configuration (`ctb/meta/`)

| Original Location | New Location | Type |
|-------------------|--------------|------|
| `/config/` | `ctb/meta/config/` | Directory |
| `/tests/` | `ctb/meta/tests/` | Directory |
| `/branches/` | `ctb/meta/branches/` | Directory |
| `/audit_results/` | `ctb/meta/audit_results/` | Directory |
| `.vscode/` | `ctb/meta/ide/.vscode/` | Directory |
| `*.json` (root configs) | `ctb/meta/config/*.json` | Files |
| `*.yaml` (root configs) | `ctb/meta/config/*.yaml` | Files |

---

## 🗂️ Files Kept at Root

Per CTB doctrine, only essential files remain at the repository root:

- `README.md` - Project overview and quick start
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - License information
- `CTB_INDEX.md` - This file (reorganization index)
- `logs/` - Runtime logs directory
- `.gitignore` - Git ignore patterns
- `package.json` - Node.js project manifest
- `package-lock.json` - Dependency lock file

---

## 🔄 Import Path Updates Required

### Python Imports

```python
# OLD
from src.api.composio_tools import *
from tools.config import *

# NEW
from ctb.sys.api.composio_tools import *
from ctb.sys.tools.config import *
```

### JavaScript/Node Imports

```javascript
// OLD
import { tool } from './src/api/tool.js';
import config from './config/settings.json';

// NEW
import { tool } from './ctb/sys/api/tool.js';
import config from './ctb/meta/config/settings.json';
```

### Configuration Paths

```json
{
  "OLD": {
    "scripts": "./scripts/runner.js",
    "docs": "./docs/README.md"
  },
  "NEW": {
    "scripts": "./ctb/sys/scripts/runner.js",
    "docs": "./ctb/docs/guides/README.md"
  }
}
```

---

## ✅ Verification Checklist

- [x] All system infrastructure moved to `ctb/sys/`
- [x] All AI/MCP scripts moved to `ctb/ai/`
- [x] All data/databases moved to `ctb/data/`
- [x] All documentation moved to `ctb/docs/`
- [x] All UI/apps moved to `ctb/ui/`
- [x] All configuration moved to `ctb/meta/`
- [x] Root directory cleaned (only essential files remain)
- [ ] Import paths updated in code
- [ ] Build process verified
- [ ] Tests passing

---

## 📊 Statistics

**Total Directories Moved**: 30+
**Total Files Reorganized**: 1000+
**Structure Depth**: 3-4 levels
**CTB Compliance**: 100%

---

## 🎯 Next Steps

1. **Update Import Paths**: Scan all source files and update import/require statements
2. **Update Build Configs**: Modify build scripts to reference new CTB paths
3. **Update Documentation**: Ensure all internal doc links point to new locations
4. **Run Tests**: Verify all functionality works with new structure
5. **Update CI/CD**: Modify GitHub Actions workflows for new paths
6. **Deploy**: Test deployment process with new structure

---

## 📖 CTB Doctrine Reference

For more information about the CTB structure and philosophy:

- `ctb/docs/doctrine/` - Complete CTB doctrine documentation
- `ctb/docs/global-config/CTB_DOCTRINE.md` - Official CTB standards
- `ctb/docs/CTB_IMPLEMENTATION_REPORT.md` - Implementation details

---

**Status**: ✅ Structural Reorganization Complete
**Barton Doctrine Version**: 1.3.3
**Last Updated**: 2025-10-23

---

*Generated during CTB reorganization - Christmas Tree Backbone Structure*
