# GitHub Projects Setup Guide

This guide will help you set up GitHub Projects for doctrine-compliant repositories.

**Doctrine Reference**: `templates/doctrine/ARCHITECTURE.md`

## Quick Setup

### Option 1: Web Interface (Recommended)

1. **Navigate to Projects**
   - Go to: https://github.com/[OWNER]/[REPO]
   - Click the **"Projects"** tab at the top

2. **Create New Project**
   - Click **"New project"** button
   - Choose **"Board"** template (Kanban-style)
   - Name it: **"IMO-Creator Development"**

3. **Configure Project Board**

   **Default Columns:**
   - 📋 Backlog
   - 📝 To Do
   - 🚧 In Progress
   - 👀 In Review
   - ✅ Done

   **CTB-Optimized Columns (Alternative):**
   - 📋 Backlog (Unplanned work)
   - 🎯 Planned (Scheduled for implementation)
   - 🚧 In Progress (Active development)
   - 🔬 Testing (CTB health checks, validation)
   - 📦 Ready for Release (Awaiting version bump)
   - ✅ Released (Deployed to master)

4. **Add Custom Fields**

   Click "⚙️ Settings" → "Custom fields":

   | Field Name | Type | Options |
   |------------|------|---------|
   | Priority | Single select | P0-Critical, P1-High, P2-Medium, P3-Low, P4-Nice |
   | CC Layer | Single select | CC-01 (Sovereign), CC-02 (Hub), CC-03 (Context), CC-04 (Process) |
   | Component | Single select | Doctrine, Templates, Integrations, CI/CD, Docs |
   | Doctrine Version | Text | e.g., "1.1.0" |

5. **Link Issues Automatically**

   - All new issues with `projects: ["[OWNER]/1"]` in the template will auto-add to the project
   - Our issue templates (Bug Report, Feature Request, CTB Update) are pre-configured

### Option 2: GitHub CLI (Advanced)

If you have GitHub CLI authenticated:

```bash
# Create a new project
gh project create "IMO-Creator Development" --owner [OWNER]

# List projects
gh project list --owner [OWNER]

# Add an issue to the project
gh project item-add <PROJECT_ID> --owner [OWNER] --url <ISSUE_URL>
```

## Project Workflows

### For CTB Updates

1. Create issue using **"CTB Update Task"** template
2. Assign to project → **"Planned"** column
3. Move to **"In Progress"** when starting work
4. Move to **"Testing"** after implementation
5. Move to **"Ready for Release"** after successful tests
6. Move to **"Released"** after pushing to master and version bump

### For Bug Reports

1. Create issue using **"Bug Report"** template
2. Triage: Assign severity (S0-S4) and priority (P0-P4)
3. Add to **"Backlog"** or **"To Do"** based on severity
4. Move through workflow as you fix
5. Close issue when fixed and deployed

### For Feature Requests

1. Create issue using **"Feature Request"** template
2. Discussion: Comment on feasibility and priority
3. Add to **"Backlog"** if approved
4. Schedule to **"Planned"** when ready to implement
5. Follow standard workflow to completion

## Automation Rules (Optional)

Set up GitHub Actions automation for project management:

### Auto-move cards:
- When PR is created → Move to "In Review"
- When PR is merged → Move to "Done"
- When issue is closed → Move to "Done"
- When issue is reopened → Move to "In Progress"

### Example Workflow:

```yaml
# .github/workflows/project_automation.yml
name: Project Board Automation

on:
  issues:
    types: [opened, closed, reopened]
  pull_request:
    types: [opened, closed]

jobs:
  automate:
    runs-on: ubuntu-latest
    steps:
      - name: Move cards based on events
        uses: alex-page/github-project-automation-plus@v0.8.3
        with:
          project: IMO-Creator Development
          column: In Progress
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Project Views

Create multiple views for different perspectives:

### 1. **By Component** (Group by Component field)
- See all CTB Template tasks together
- See all Composio MCP tasks together
- etc.

### 2. **By Priority** (Group by Priority field)
- Focus on P0-Critical first
- Plan P1-High items
- Track P2-P4 backlog

### 3. **By CC Layer** (Group by CC Layer field)
- Sovereign view (CC-01)
- Hub view (CC-02)
- Context view (CC-03)
- Process view (CC-04)

### 4. **By Doctrine Version** (Filter by Doctrine Version field)
- Track work for current version
- Plan for next version
- View historical releases

## Integration with CI/CD

Issues and PRs automatically link to GitHub Actions workflows:

- ✅ CTB Enforcement checks
- ✅ CI/CD workflow status
- ✅ Security scans
- ✅ Test coverage
- ✅ Deployment status

View workflow status directly on issue/PR cards in the project board.

## Best Practices

1. **Always use issue templates** - They auto-populate project fields
2. **Update card status regularly** - Move cards as you work
3. **Link PRs to issues** - Use "Fixes #123" in PR description
4. **Use labels** - `bug`, `enhancement`, `ctb-update`, `documentation`
5. **Set milestones** - Group issues by CTB version (v1.3.1, v1.3.2, v1.4.0)
6. **Comment on progress** - Keep stakeholders informed
7. **Close with context** - Explain resolution when closing issues

## CTB-Specific Workflows

### Doctrine Updates
```
1. Create CTB Update issue
2. Document changes in CTB_VERSION_HISTORY.md
3. Update version.json
4. Test auto-propagation
5. Deploy to master
6. Verify child repo sync
7. Close issue with version tag
```

### Integration Changes
```
1. Create Feature Request or Bug Report
2. Test locally with Composio MCP server
3. Update COMPOSIO_INTEGRATION.md if needed
4. Run CI/CD workflows
5. Deploy and verify
6. Update documentation
7. Close and tag with affected integration
```

## Resources

- [GitHub Projects Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Project Automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
- [Custom Fields Guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields)

## Next Steps

1. ✅ Issue templates created (feature_request.yml, bug_report.yml, ctb_update.yml)
2. ⏭️ Create your first GitHub Project board
3. ⏭️ Add custom fields (Priority, CTB Altitude, Component, etc.)
4. ⏭️ Create project views (By Component, By Priority, By Altitude)
5. ⏭️ Set up automation rules (optional)
6. ⏭️ Start creating issues using the templates!

---

**Created**: 2025-10-23
**Status**: Ready for project setup
**CTB Version**: v1.3.1+
