# PROMPT 1: CTB Repository Reorganizer

## 🎯 Objective
Reorganize any repository into the official Christmas Tree Backbone (CTB) structure.

## 📋 Task Description

You are reorganizing a code repository to follow the **Christmas Tree Backbone (CTB)** standard structure. The CTB structure organizes all code, documentation, and resources into six main branches under a `ctb/` root directory.

## 🌲 CTB Structure

```
repository/
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

## 📝 Instructions

### Step 1: Analyze Current Structure
1. List all top-level directories and files
2. Identify the purpose of each directory/file
3. Classify each item into a CTB branch:
   - **sys**: APIs, integrations, MCP servers, database clients, auth systems
   - **ai**: AI models, prompt templates, agent configs, training data
   - **data**: SQL schemas, Prisma files, migrations, Zod validators
   - **docs**: README files, guides, API docs, manuals
   - **ui**: React components, pages, CSS, templates
   - **meta**: Configuration, registry, metadata

### Step 2: Create CTB Structure
```bash
mkdir -p ctb/{sys,ai,data,docs,ui,meta}
mkdir -p logs
```

### Step 3: Move Files into CTB Branches

For each directory/file, move it to the appropriate CTB branch:

```bash
# Example: Move MCP server to sys
mv mcp-servers ctb/sys/composio-mcp

# Example: Move React components to ui
mv src/components ctb/ui/components

# Example: Move database schemas to data
mv prisma ctb/data/prisma

# Example: Move documentation to docs
mv docs ctb/docs/api
```

### Step 4: Create CTB Registry

Create `ctb/meta/ctb_registry.json`:

```json
{
  "version": "1.0.0",
  "created_at": "2025-10-23T00:00:00Z",
  "repository": "repository-name",
  "ctb_structure": {
    "sys": "System integrations and infrastructure",
    "ai": "AI models, prompts, and training",
    "data": "Database schemas and migrations",
    "docs": "Documentation and guides",
    "ui": "UI components and templates",
    "meta": "CTB metadata and registry"
  },
  "branches": {
    "sys": {
      "description": "System integrations",
      "subdirs": ["composio-mcp", "firebase", "neon", "github-factory"]
    },
    "ai": {
      "description": "AI systems",
      "subdirs": ["models", "prompts", "blueprints", "training"]
    },
    "data": {
      "description": "Data layer",
      "subdirs": ["firebase", "neon", "bigquery", "zod"]
    },
    "docs": {
      "description": "Documentation",
      "subdirs": ["ctb", "doctrine", "api", "guides"]
    },
    "ui": {
      "description": "User interfaces",
      "subdirs": ["components", "pages", "templates"]
    }
  }
}
```

### Step 5: Create Global Configuration

Create `global-config.yaml`:

```yaml
version: "1.0.0"
repository: repository-name

ctb:
  enabled: true
  version: "1.0.0"
  branches:
    - sys
    - ai
    - data
    - docs
    - ui
    - meta

doctrine_enforcement:
  ctb_factory: ctb/sys/global-factory/
  auto_sync: true
  min_score: 90
  composio_scenario: CTB_Compliance_Cycle

logging:
  directory: logs/
  audit_enabled: true
  retention_days: 90
```

### Step 6: Generate Migration Map

Create `CTB_INDEX.md` documenting the reorganization:

```markdown
# CTB Reorganization Index

## Migration Map

| Old Path | New Path | CTB Branch | Notes |
|----------|----------|------------|-------|
| src/api/ | ctb/sys/api/ | sys | API endpoints |
| src/components/ | ctb/ui/components/ | ui | React components |
| prisma/ | ctb/data/prisma/ | data | Database schema |
| docs/ | ctb/docs/api/ | docs | API documentation |
```

## ✅ Completion Checklist

- [ ] Created `ctb/{sys,ai,data,docs,ui,meta}` directories
- [ ] Created `logs/` directory
- [ ] Moved all files into appropriate CTB branches
- [ ] Created `ctb/meta/ctb_registry.json`
- [ ] Created `global-config.yaml`
- [ ] Generated `CTB_INDEX.md` with migration map
- [ ] Updated import paths in code to reflect new structure
- [ ] Verified all files are accessible at new paths
- [ ] Committed changes to git

## 🎯 Expected Output

```
repository/
├── ctb/
│   ├── sys/
│   │   ├── composio-mcp/
│   │   ├── firebase/
│   │   └── api/
│   ├── ai/
│   │   ├── models/
│   │   └── prompts/
│   ├── data/
│   │   ├── prisma/
│   │   └── migrations/
│   ├── docs/
│   │   ├── api/
│   │   └── guides/
│   ├── ui/
│   │   ├── components/
│   │   └── pages/
│   └── meta/
│       └── ctb_registry.json
├── logs/
├── global-config.yaml
└── CTB_INDEX.md
```

## 📊 Success Metrics

- All files organized into CTB branches
- No files remain in non-CTB directories (except config files)
- CTB registry created and valid
- Import paths updated
- Repository structure follows CTB standard

---

**Run this prompt on any repository to reorganize it into CTB structure.**
