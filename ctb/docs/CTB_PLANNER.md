# Barton Doctrine – CTB Planner (JSON-Only Mode)

**Version**: 1.0.0
**Last Updated**: 2025-11-06
**Status**: Production Ready

---

## Overview

The **CTB Planner** is an AI-driven system for automatically restructuring repositories according to the Barton CTB (Christmas Tree Backbone) Doctrine. Unlike traditional refactoring tools, the CTB Planner operates in a **JSON-only mode** — it analyzes repositories and outputs structured instructions without directly modifying files.

### Key Principles

1. **JSON-Only Output**: Never edits files directly
2. **Auditable**: Every action is explicitly declared
3. **Reversible**: All changes go through git and can be rolled back
4. **Tool-Integrated**: Works with Obsidian, Git Projects, GitKraken, and Lovable.dev
5. **Confidence-Scored**: Each classification includes a confidence metric

---

## Role Definition

When acting as the **CTB Planner**, you:

✅ **DO**:
- Analyze repository structure and file contents
- Classify files by altitude (30k/20k/10k/5k)
- Generate JSON instruction sets
- Assign confidence scores to classifications
- Create paired markdown documentation stubs
- Build comprehensive manifests

❌ **DO NOT**:
- Directly edit or rename files
- Delete files
- Make assumptions without flagging low confidence
- Output prose or explanations (JSON only)

---

## Altitude Mapping

The CTB Doctrine organizes code by altitude, representing layers of abstraction and responsibility:

| Altitude | Name | Branch Prefix | Description | Examples |
|----------|------|---------------|-------------|----------|
| **30000** | Vision | `30000_vision/` | Doctrine, design, architecture, high-level planning | Architecture docs, design principles, vision statements |
| **20000** | Category | `20000_category/` | Data models, schemas, APIs, domain definitions | Database schemas, API contracts, data models |
| **10000** | Execution | `10000_execution/` | Functional code, business logic, agents, workflows | Core application code, services, utilities |
| **5000** | Visibility | `5000_visibility/` | UI, dashboards, CLI, user-facing components | React components, CLI tools, dashboards |

### Altitude Selection Guidelines

```python
# Decision tree for altitude classification

if file_is_documentation_or_architecture:
    altitude = 30000
elif file_defines_data_schema_or_api_contract:
    altitude = 20000
elif file_contains_business_logic_or_services:
    altitude = 10000
elif file_is_ui_or_user_facing:
    altitude = 5000
else:
    altitude = 10000  # Default to execution layer
    confidence = 0.6  # Flag as uncertain
```

---

## Input Format

The planner expects:

1. **File List**: Repository files with relative paths
2. **File Snippets**: First 50-100 lines or key sections
3. **Optional Metadata**: Previous manifests, doctrine notes, repo README

### Example Input

```json
{
  "repository": "my-app",
  "files": [
    {
      "path": "src/app.py",
      "type": "python",
      "lines": 245,
      "snippet": "from flask import Flask\napp = Flask(__name__)\n..."
    },
    {
      "path": "docs/architecture.md",
      "type": "markdown",
      "lines": 89,
      "snippet": "# Architecture\n## Vision\n..."
    }
  ],
  "metadata": {
    "framework": "Flask",
    "purpose": "Web API service"
  }
}
```

---

## Output Format: `ctb_plan.json`

The planner outputs a comprehensive JSON document with three main sections:

### 1. Actions Array

Each action describes a specific operation to perform:

#### Action Types

**`move`** - Relocate a file to its correct altitude folder
```json
{
  "type": "move",
  "from": "src/app.py",
  "to": "10000_execution/src/app.py",
  "reason": "Main application logic - execution layer",
  "confidence": 0.95
}
```

**`create_md`** - Generate markdown documentation stub
```json
{
  "type": "create_md",
  "path": "30000_vision/vision.md",
  "content": "---\naltitude: 30000\npurpose: Repository vision and architecture\nctb_classification: auto-generated\n---\n\n# Vision\n\nTODO: Document high-level architecture and vision\n",
  "confidence": 1.0
}
```

**`annotate`** - Add doctrinal header to source file
```json
{
  "type": "annotate",
  "file": "10000_execution/src/app.py",
  "altitude": 10000,
  "purpose": "Main application logic and routing",
  "confidence": 0.92
}
```

### 2. Manifest Object

Structured representation of the CTB hierarchy:

```json
{
  "branches": [
    {
      "altitude": 30000,
      "name": "vision",
      "description": "Architecture and design documentation",
      "files": [
        "30000_vision/vision.md",
        "30000_vision/architecture.md"
      ]
    },
    {
      "altitude": 20000,
      "name": "category",
      "description": "Data models and schemas",
      "files": [
        "20000_category/schema.sql",
        "20000_category/models.py"
      ]
    },
    {
      "altitude": 10000,
      "name": "execution",
      "description": "Core application logic",
      "files": [
        "10000_execution/src/app.py",
        "10000_execution/src/services/"
      ]
    },
    {
      "altitude": 5000,
      "name": "visibility",
      "description": "User interface components",
      "files": [
        "5000_visibility/ui/dashboard.tsx",
        "5000_visibility/cli/main.py"
      ]
    }
  ],
  "stats": {
    "total_files": 42,
    "by_altitude": {
      "30000": 5,
      "20000": 8,
      "10000": 24,
      "5000": 5
    }
  }
}
```

### 3. Metadata

Summary information about the plan:

```json
{
  "summary": "CTB plan generated for 42 files across 4 altitude levels",
  "confidence_avg": 0.89,
  "confidence_distribution": {
    "high": 35,      // >= 0.8
    "medium": 5,     // 0.6-0.8
    "low": 2         // < 0.6
  },
  "generated": "2025-11-06T10:30:00Z",
  "ctb_version": "1.3.2",
  "low_confidence_files": [
    {
      "file": "utils/helper.py",
      "altitude": 10000,
      "confidence": 0.65,
      "reason": "Could be execution (10k) or category (20k) - unclear from context"
    }
  ]
}
```

---

## Complete Example: `ctb_plan.json`

```json
{
  "actions": [
    {
      "type": "move",
      "from": "docs/architecture.md",
      "to": "30000_vision/architecture.md",
      "reason": "High-level architecture documentation",
      "confidence": 1.0
    },
    {
      "type": "move",
      "from": "models/user.py",
      "to": "20000_category/models/user.py",
      "reason": "Data model definition",
      "confidence": 0.95
    },
    {
      "type": "move",
      "from": "src/app.py",
      "to": "10000_execution/src/app.py",
      "reason": "Main application logic",
      "confidence": 0.98
    },
    {
      "type": "move",
      "from": "ui/dashboard.tsx",
      "to": "5000_visibility/ui/dashboard.tsx",
      "reason": "User interface component",
      "confidence": 1.0
    },
    {
      "type": "create_md",
      "path": "30000_vision/vision.md",
      "content": "---\naltitude: 30000\npurpose: Repository vision\nctb_classification: auto-generated\n---\n\n# Vision\n\nTODO: Define project vision and goals\n",
      "confidence": 1.0
    },
    {
      "type": "annotate",
      "file": "10000_execution/src/app.py",
      "altitude": 10000,
      "purpose": "Main Flask application",
      "confidence": 0.98
    }
  ],
  "manifest": {
    "branches": [
      {
        "altitude": 30000,
        "name": "vision",
        "files": ["30000_vision/vision.md", "30000_vision/architecture.md"]
      },
      {
        "altitude": 20000,
        "name": "category",
        "files": ["20000_category/models/user.py"]
      },
      {
        "altitude": 10000,
        "name": "execution",
        "files": ["10000_execution/src/app.py"]
      },
      {
        "altitude": 5000,
        "name": "visibility",
        "files": ["5000_visibility/ui/dashboard.tsx"]
      }
    ],
    "stats": {
      "total_files": 4,
      "by_altitude": {"30000": 2, "20000": 1, "10000": 1, "5000": 1}
    }
  },
  "summary": "CTB plan for 4 files - Flask web app with React UI",
  "confidence_avg": 0.98,
  "confidence_distribution": {"high": 4, "medium": 0, "low": 0},
  "generated": "2025-11-06T10:30:00Z",
  "ctb_version": "1.3.2",
  "low_confidence_files": []
}
```

---

## Workflow

### 1. Analysis Phase

```mermaid
graph LR
    A[Scan Repository] --> B[Classify Files]
    B --> C[Assign Altitudes]
    C --> D[Calculate Confidence]
    D --> E[Generate JSON Plan]
```

**AI Agent (Claude)**:
1. Receives file list with snippets
2. Analyzes each file's purpose and content
3. Assigns altitude based on role
4. Calculates confidence score (0.0-1.0)
5. Outputs `ctb_plan.json`

### 2. Validation Phase

```bash
python ctb/docs/global-config/scripts/apply_ctb_plan.py ctb_plan.json
```

**Validator Script**:
1. Loads and validates JSON
2. Executes move/create_md/annotate actions
3. Generates `specs/ctb_manifest.yaml`
4. Updates `global-config/imo_global_config.yaml`
5. Commits changes with CTB signature

### 3. Integration Phase

**Tool Integration Loop**:
```
ctb_plan.json → apply_ctb_plan.py → specs/ctb_manifest.yaml
                     ↓
    ┌────────────────┴───────────────┐
    ↓                ↓                ↓                ↓
Obsidian       Git Projects     GitKraken       Lovable.dev
(docs)         (tasks)          (visual)        (render)
```

---

## Tool Integration

### Obsidian
**Auto-syncs doctrine .md files**

- Watches `30000_vision/` for new markdown files
- Provides editing interface for vision documentation
- Links between architectural concepts
- Configuration: `.obsidian/workspace.json`

### Git Projects
**Generates tasks from manifest**

- Reads `specs/ctb_manifest.yaml`
- Creates issue cards per altitude branch
- Tracks file migration progress
- Integration: `.github/workflows/project_automation.yml`

### GitKraken
**Visualizes CTB tree structure**

- Shows before/after commit diffs
- Branch visualization colored by altitude
- Interactive file tree navigation
- Manual setup required (open repo in GitKraken)

### Lovable.dev (LOM)
**Renders interactive CTB explorer**

- Parses `specs/ctb_manifest.yaml`
- Displays altitude hierarchy
- Click-to-navigate file structure
- Deployment: Lovable.dev project integration

---

## Confidence Scoring

### Guidelines

| Confidence | Range | Meaning | Action |
|------------|-------|---------|--------|
| **High** | 0.8 - 1.0 | Clear classification | Proceed with action |
| **Medium** | 0.6 - 0.8 | Reasonable guess | Flag for review |
| **Low** | 0.0 - 0.6 | Uncertain | Require human confirmation |

### Confidence Factors

**Increase confidence** when:
- ✅ File name clearly indicates purpose (`schema.sql`, `dashboard.tsx`)
- ✅ Code imports/dependencies align with altitude
- ✅ File location matches content
- ✅ Strong docstring/comments

**Decrease confidence** when:
- ❌ Mixed responsibilities in one file
- ❌ Unclear naming (`utils.py`, `helpers.js`)
- ❌ No clear domain indicators
- ❌ Could fit multiple altitudes

### Example Confidence Calculations

```python
# High confidence (0.95)
"models/user_schema.sql"
# → 20000_category (data schema)
# Clear naming, SQL extension, "schema" keyword

# Medium confidence (0.70)
"utils/formatter.py"
# → 10000_execution (utilities)
# Generic name, could be category or execution

# Low confidence (0.55)
"helper.py"
# → 10000_execution (default)
# Very generic, insufficient context
```

---

## Best Practices

### For AI Agents (Claude)

1. **Always include confidence scores** - Never guess without flagging uncertainty
2. **Be deterministic** - Same input should produce same output
3. **JSON-only** - No prose, explanations, or apologies
4. **Flag ambiguities** - Use `low_confidence_files` array
5. **Preserve structure** - Don't break import paths or dependencies

### For Validators

1. **Review low-confidence classifications** before applying
2. **Test in a branch** first
3. **Backup before running** - `git stash` or create branch
4. **Check dependencies** - Ensure imports still work after moves
5. **Run tests** after restructuring

### For Repositories

1. **Start with small repos** - Learn the system on simple projects
2. **Use git branches** - Apply plans in feature branches
3. **Review diffs** - Check what changed before merging
4. **Update docs** - Keep vision.md files current
5. **Iterate** - Re-run planner as project evolves

---

## Troubleshooting

### Common Issues

#### "Low confidence average"

**Problem**: Average confidence < 0.7

**Solution**:
1. Review `low_confidence_files` array in plan
2. Manually classify uncertain files
3. Re-run planner with clarified inputs
4. Add docstrings/comments to ambiguous files

#### "Action failed: File not found"

**Problem**: Source file doesn't exist

**Solution**:
1. Verify file paths in plan
2. Check if file was already moved
3. Update plan with correct paths
4. Re-run validator

#### "Import errors after restructuring"

**Problem**: Python imports broken after moving files

**Solution**:
1. Update `__init__.py` files
2. Add altitude folders to PYTHONPATH
3. Use relative imports: `from ..category import model`
4. Run tests to identify broken imports

#### "Git conflicts during commit"

**Problem**: Uncommitted changes conflict with plan

**Solution**:
1. Stash current changes: `git stash`
2. Apply plan
3. Re-apply stashed changes: `git stash pop`
4. Resolve conflicts manually

---

## Advanced Usage

### Custom Altitude Levels

You can extend beyond 4 standard altitudes:

```json
{
  "custom_altitudes": {
    "40000": {
      "name": "doctrine",
      "description": "Global doctrine and standards",
      "prefix": "40000_doctrine/"
    },
    "15000": {
      "name": "integration",
      "description": "External integrations and adapters",
      "prefix": "15000_integration/"
    }
  }
}
```

### Selective Planning

Plan only specific subdirectories:

```bash
# Generate plan for only src/ folder
python ctb_planner.py --target src/ --output src_plan.json

# Apply selective plan
python apply_ctb_plan.py src_plan.json
```

### Dry-Run Mode

Preview changes without applying:

```bash
python apply_ctb_plan.py --dry-run ctb_plan.json
```

---

## Future Enhancements

- [ ] AI-powered confidence calibration
- [ ] Dependency graph analysis for smarter classification
- [ ] Automatic import path fixing
- [ ] Visual diff previewer
- [ ] Integration with IDEs (VS Code extension)
- [ ] Rollback mechanism
- [ ] Multi-repo planning (monorepo support)

---

## References

- **CTB Doctrine**: `ctb/docs/global-config/CTB_DOCTRINE.md`
- **Validator Script**: `ctb/docs/global-config/scripts/apply_ctb_plan.py`
- **Tool Integration**: `ctb/docs/CTB_TOOL_INTEGRATION.md`
- **Examples**: `ctb/examples/ctb_plan_examples/`

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: 2025-11-06

**🌲 The CTB Planner: AI-driven organization, human-approved execution.**
