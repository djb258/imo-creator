# CTB Tool Integration Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-06

---

## Overview

The CTB Planner system integrates with five essential tools to create a complete workflow for repository organization, documentation, task management, and visualization.

### Integration Flow

```
Claude Code → apply_ctb_plan.py → specs/ctb_manifest.yaml
                    ↓
    ┌───────────────┼───────────────────┬─────────────┐
    ↓               ↓                   ↓             ↓
Obsidian       Git Projects        GitKraken    Lovable.dev
(docs)         (tasks)             (visual)     (render)
```

---

## 1. Obsidian Integration

**Purpose**: Doctrine documentation and knowledge management

### Setup

1. **Install Obsidian** (if not already installed):
   ```bash
   # See ctb/docs/TOOLS_SETUP_GUIDE.md
   bash ctb/docs/global-config/scripts/install_required_tools.sh
   ```

2. **Create Obsidian Vault**:
   ```bash
   mkdir -p docs/obsidian-vault
   ```

3. **Open Vault in Obsidian**:
   - Launch Obsidian
   - "Open folder as vault"
   - Select `docs/obsidian-vault`

4. **Install Recommended Plugins**:
   - Git (auto-sync with repository)
   - Dataview (query and display data)
   - Templater (template automation)

### How It Works

After running `apply_ctb_plan.py`:

1. **30000_vision/** markdown files are created
2. Obsidian detects new files automatically
3. Developers edit documentation in Obsidian
4. Git plugin commits changes back to repo

### Configuration

Create `.obsidian/workspace.json` in your vault:

```json
{
  "main": {
    "id": "ctb-workspace",
    "type": "split",
    "children": [
      {
        "type": "tabs",
        "children": [
          {
            "type": "leaf",
            "state": {
              "type": "markdown",
              "file": "30000_vision/vision.md"
            }
          }
        ]
      }
    ]
  }
}
```

---

## 2. GitHub Projects Integration

**Purpose**: Task tracking and project management

### Setup

1. **Create GitHub Project**:
   - Navigate to your repository on GitHub
   - Click "Projects" tab
   - Create new project (Board or Table view)
   - Name: `[Repo Name] - CTB Workflow`

2. **Configure Project Automation**:
   - Add columns: "Backlog", "In Progress", "Review", "Done"
   - Enable automation for issue labeling

3. **Install GitHub CLI** (if not already):
   ```bash
   bash ctb/docs/global-config/scripts/install_required_tools.sh
   ```

### How It Works

The validator script generates `specs/ctb_manifest.yaml`:

```yaml
branches:
  - altitude: 30000
    name: vision
    files: [...]
  - altitude: 20000
    name: category
    files: [...]
```

GitHub Actions workflow (`.github/workflows/project_automation.yml`) reads this manifest and:

1. Creates issues for each altitude branch
2. Labels issues by altitude
3. Assigns to project board
4. Tracks file migration progress

### Automation Workflow

Create `.github/workflows/project_automation.yml`:

```yaml
name: CTB Project Automation

on:
  push:
    paths:
      - 'specs/ctb_manifest.yaml'

jobs:
  sync-projects:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Parse CTB Manifest
        run: |
          python .github/scripts/parse_manifest.py

      - name: Create Project Issues
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh project item-create --owner ${{ github.repository_owner }} \
            --project "CTB Workflow" \
            --title "Organize 30k Vision Files" \
            --body "Files to organize: $(cat manifest_30k.txt)"
```

---

## 3. GitKraken Integration

**Purpose**: Visual git client and CTB tree visualization

### Setup

1. **Install GitKraken**:
   ```bash
   bash ctb/docs/global-config/scripts/install_required_tools.sh
   ```

2. **Open Repository in GitKraken**:
   - Launch GitKraken
   - File → Open Repo
   - Select your CTB-organized repository

3. **Configure CTB View**:
   - Preferences → UI Preferences
   - Enable "Show all branches"
   - Set up custom colors for altitude levels

### Altitude Color Coding

Configure custom branch colors in GitKraken:

| Altitude | Color | Branch Pattern |
|----------|-------|----------------|
| 30000 | Purple | `30000_vision/*` |
| 20000 | Blue | `20000_category/*` |
| 10000 | Green | `10000_execution/*` |
| 5000 | Orange | `5000_visibility/*` |

### Visualization Features

**Before CTB**:
```
src/
  app.py
  models.py
  routes.py
docs/
  architecture.md
```

**After CTB** (visualized in GitKraken):
```
30000_vision/
  ├── vision.md
  └── architecture.md
20000_category/
  └── models.py
10000_execution/
  ├── app.py
  └── routes.py
```

GitKraken shows:
- File moves as rename operations
- New file creations
- Altitude-based folder structure
- Commit history with CTB signature

---

## 4. Lovable.dev (LOM) Integration

**Purpose**: Interactive CTB tree rendering and exploration

### Setup

1. **Create Lovable Project**:
   - Go to https://lovable.dev
   - Create new project
   - Connect to your GitHub repository

2. **Add CTB Renderer Component**:

Create `src/components/CTBExplorer.tsx`:

```typescript
import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

interface CTBBranch {
  altitude: number;
  name: string;
  description: string;
  files: string[];
  file_count: number;
}

export function CTBExplorer() {
  const [manifest, setManifest] = useState<{ branches: CTBBranch[] } | null>(null);

  useEffect(() => {
    // Load ctb_manifest.yaml
    fetch('/specs/ctb_manifest.yaml')
      .then(res => res.text())
      .then(text => yaml.load(text))
      .then(data => setManifest(data));
  }, []);

  if (!manifest) return <div>Loading CTB structure...</div>;

  return (
    <div className="ctb-explorer">
      <h1>CTB Altitude Map</h1>
      {manifest.branches.map(branch => (
        <div key={branch.altitude} className={`altitude-${branch.altitude}`}>
          <h2>{branch.altitude}ft - {branch.name}</h2>
          <p>{branch.description}</p>
          <ul>
            {branch.files.map(file => (
              <li key={file}>
                <a href={`/browse/${file}`}>{file}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

3. **Deploy to Lovable**:
   ```bash
   git add src/components/CTBExplorer.tsx
   git commit -m "Add CTB explorer component"
   git push
   ```

### Features

- **Interactive Tree**: Click to expand/collapse altitude levels
- **File Preview**: Hover to see file purpose and confidence
- **Search**: Find files by name or altitude
- **Stats Dashboard**: View distribution across altitudes

---

## 5. Grafana Integration

**Purpose**: Monitor CTB compliance and metrics over time

### Setup

1. **Install Grafana**:
   ```bash
   bash ctb/docs/global-config/scripts/install_required_tools.sh
   ```

2. **Start Grafana**:
   ```bash
   # Windows
   net start grafana

   # macOS
   brew services start grafana

   # Linux
   sudo systemctl start grafana-server
   ```

3. **Access Grafana**: http://localhost:3000

4. **Import CTB Dashboard**:
   - Import dashboard JSON from `ctb/grafana-dashboards/ctb_compliance.json`

### Metrics Tracked

- **Files by Altitude**: Bar chart showing distribution
- **Confidence Trends**: Line graph of average confidence over time
- **Low Confidence Files**: Table of files needing review
- **CTB Compliance Score**: Overall health metric

### Dashboard Configuration

Create `ctb/grafana-dashboards/ctb_compliance.json`:

```json
{
  "dashboard": {
    "title": "CTB Compliance Dashboard",
    "panels": [
      {
        "title": "Files by Altitude",
        "type": "barchart",
        "targets": [
          {
            "expr": "sum by (altitude) (ctb_files)"
          }
        ]
      },
      {
        "title": "Average Confidence",
        "type": "graph",
        "targets": [
          {
            "expr": "avg(ctb_confidence)"
          }
        ]
      }
    ]
  }
}
```

---

## Complete Integration Workflow

### Step-by-Step

1. **Generate Plan** (Claude Code):
   ```
   User: "Analyze this repo and create a CTB plan"
   Claude: Outputs ctb_plan.json
   ```

2. **Apply Plan** (Validator Script):
   ```bash
   python ctb/docs/global-config/scripts/apply_ctb_plan.py
   ```

3. **Review in Obsidian**:
   - Open `30000_vision/vision.md`
   - Edit architecture documentation
   - Git plugin auto-commits

4. **Track in GitHub Projects**:
   - GitHub Actions creates issues
   - Tasks appear in project board
   - Track migration progress

5. **Visualize in GitKraken**:
   - Open repository
   - See file moves and new structure
   - Review commit diff

6. **Explore in Lovable**:
   - Navigate to deployed app
   - Browse interactive CTB tree
   - Click through altitude levels

7. **Monitor in Grafana**:
   - View compliance dashboard
   - Track confidence trends
   - Identify low-confidence files

---

## Troubleshooting

### Obsidian Not Syncing

**Problem**: New .md files not appearing in Obsidian

**Solution**:
1. Refresh vault: Ctrl+R (Windows/Linux) or Cmd+R (Mac)
2. Check vault location matches `docs/obsidian-vault`
3. Verify Git plugin is installed and enabled

### GitHub Projects Not Updating

**Problem**: Issues not created from manifest

**Solution**:
1. Check `.github/workflows/project_automation.yml` exists
2. Verify GitHub Actions is enabled for repo
3. Check workflow run logs in GitHub → Actions tab
4. Ensure `specs/ctb_manifest.yaml` was committed

### GitKraken Not Showing Colors

**Problem**: Altitude folders not color-coded

**Solution**:
1. Preferences → UI Preferences
2. Enable "Syntax highlighting for branches"
3. Manually set colors for branch patterns
4. Restart GitKraken

### Lovable Not Loading Manifest

**Problem**: CTB Explorer shows "Loading..."

**Solution**:
1. Verify `specs/ctb_manifest.yaml` is in public folder
2. Check browser console for fetch errors
3. Ensure yaml parser is installed: `npm install js-yaml`
4. Check file permissions

---

## Best Practices

### For Teams

1. **Standardize Tools**: Ensure all team members have required tools installed
2. **Document Conventions**: Add CTB guidelines to team wiki
3. **Regular Reviews**: Weekly check of low-confidence files in Grafana
4. **Pair Programming**: Review CTB plans together before applying

### For Solo Developers

1. **Start Small**: Apply CTB to one project first
2. **Iterate**: Re-run planner as project grows
3. **Keep Docs Updated**: Use Obsidian daily
4. **Monitor Trends**: Check Grafana weekly

### For Organizations

1. **Central Monitoring**: Single Grafana instance for all repos
2. **Shared Templates**: Standard `ctb_plan.json` templates
3. **Training**: Onboarding includes CTB tool setup
4. **Compliance Checks**: Monthly audit of CTB adherence

---

## Additional Resources

- **Tool Setup Guide**: `ctb/docs/TOOLS_SETUP_GUIDE.md`
- **CTB Planner Docs**: `ctb/docs/CTB_PLANNER.md`
- **Example Plans**: `ctb/examples/ctb_plan_examples/`
- **Validator Script**: `ctb/docs/global-config/scripts/apply_ctb_plan.py`

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: 2025-11-06

**🔧 CTB Tool Integration: Seamless automation from planning to visualization.**
