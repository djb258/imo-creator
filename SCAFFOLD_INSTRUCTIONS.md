# Auto-Integration Instructions for IMO-Creator Scaffolding

When this repository is used as a template or scaffolding source, the following components are **automatically copied** to ensure every new repository has:

## 🎯 Automatic GitIngest + Draw.io Integration

### What Gets Auto-Copied:
1. **GitIngest Workflow** (`.github/workflows/drawio-ingest.yml`)
   - Triggers on every repository update
   - Automatically regenerates analysis when code changes
   - Scheduled daily updates to keep diagrams current

2. **Draw.io Configuration** (`diagrams/config.json`)
   - Production URLs embedded
   - Composio endpoints configured
   - Diagram templates ready to use

3. **GitIngest Filter** (`.gitingestignore`)
   - Optimized patterns for analysis
   - Excludes large binaries, includes diagrams
   - Focuses on meaningful code content

4. **Integration Documentation** (`DRAWIO_INTEGRATION.md`)
   - Complete setup and usage instructions
   - VS Code integration guide
   - Troubleshooting and customization

### Auto-Triggers Configured:
- ✅ **On Code Push**: GitIngest + diagrams update automatically
- ✅ **Daily Schedule**: Ensures diagrams stay current even with external changes
- ✅ **Manual Dispatch**: Force updates when needed
- ✅ **PR Creation**: Preview diagrams for code reviews

## 🔄 Repository Update Behavior

**Every time you update any scaffolded repository:**

1. **GitIngest Analysis Runs**
   - Scans entire codebase for changes
   - Updates repository structure understanding
   - Generates fresh token estimates for LLM processing

2. **Diagrams Auto-Update**
   - Repository architecture reflects new structure
   - MCP routing updates with configuration changes
   - CI/CD workflows show current branch relationships

3. **VS Code Integration**
   - Diagrams open directly in editor
   - Live preview of architectural changes
   - Export options for documentation

## 🏗️ Scaffolding Configuration

### In `imo.config.json`:
```json
{
  "doctrine_branches": {
    "drawio-ingest": {
      "auto_include": true,
      "required": true,
      "when_copy": "repo_creation",
      "auto_triggers": [
        "on_repo_update",
        "on_gitingest_change",
        "on_workflow_change"
      ]
    }
  }
}
```

### Branch Copy Rules:
- **Source**: `drawio-ingest` branch from IMO-Creator
- **Strategy**: `merge_files` (intelligent merging)
- **Triggers**: Automatic on repository creation
- **Required**: Yes (cannot be disabled)

## 🚀 Zero-Configuration Setup

When you create a new repository from IMO-Creator:

1. **Instant GitIngest**: Analysis runs on first commit
2. **Immediate Diagrams**: Visual documentation generated automatically
3. **Production URLs**: All Composio endpoints embedded and working
4. **VS Code Ready**: Draw.io extension integration pre-configured

## 📋 What Developers Get Automatically

### In Every New Repository:
- **Always-Current Architecture Diagrams**
- **Automatic Repository Analysis**
- **Visual MCP Tool Mapping**
- **CI/CD Workflow Documentation**
- **Production Composio Integration**

### GitHub Actions Workflows:
- `drawio-ingest.yml` - Main integration workflow
- Daily scheduled runs for freshness
- Manual trigger capability
- Artifact uploads for review

### VS Code Integration:
- Draw.io extension configuration
- Diagram templates ready to edit
- Export options configured
- Live preview enabled

## 🔧 Customization Options

### Adjust GitIngest Patterns:
Edit `.gitingestignore` to include/exclude specific files:
```
# Include more file types
!*.tsx
!*.vue

# Exclude specific directories
large-dataset/
temp-files/
```

### Modify Diagram Types:
Update `diagrams/config.json` to add custom diagrams:
```json
{
  "diagram_types": [
    {
      "name": "custom-flow",
      "description": "Custom business process flow",
      "auto_update": true
    }
  ]
}
```

### Change Update Frequency:
Modify the cron schedule in workflow:
```yaml
schedule:
  # Update every 6 hours instead of daily
  - cron: '0 */6 * * *'
```

## 🎯 Benefits for Development Teams

### Automatic Documentation:
- Visual architecture always matches current code
- Repository understanding accessible to new team members
- Integration points clearly mapped and documented

### Reduced Maintenance:
- No manual diagram updates required
- GitIngest analysis stays current with codebase
- Production configurations embedded and working

### Enhanced Collaboration:
- Visual documentation in every PR
- Architectural changes visible in diagram diffs
- Easy onboarding with always-current visuals

---

**This auto-integration ensures that every repository created from IMO-Creator immediately has world-class visual documentation that stays synchronized with the codebase forever.**