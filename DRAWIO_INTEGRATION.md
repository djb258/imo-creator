# Draw.io + GitIngest Integration

This branch combines the power of GitIngest repository analysis with automated draw.io diagram generation, creating visual documentation that stays synchronized with your codebase.

## Features

### 🎨 Altitude-Based Christmas Tree Architecture Diagrams
- **40,000 ft Strategic Overview**: Christmas tree backbone with trunk and domain branches
- **30,000 ft Orchestrator Tree**: Central trunk (Overall Orchestrator) with domain orchestrators and subagents
- **20,000 ft Input Domain**: Input branch with Mapper and Validator subagents
- **10,000 ft Middle Domain**: Middle branch with Database and Enforcer subagents
- **5,000 ft Output Domain**: Output branch with Notifier and Reporter subagents
- **Ground Level Infrastructure**: MCP tool routing via Composio hub

### 📊 GitIngest Integration
- Repository analysis with smart filtering
- Token estimation for LLM processing
- Structured output optimized for diagram generation
- Automatic updates on code changes

### 🔄 Workflow Automation
- Triggered on push, PR, or manual dispatch
- Commits generated diagrams back to repository
- Artifact uploads for review and download
- VS Code integration for local editing

## Quick Start

### 1. Enable Draw.io in VS Code
```bash
# Install the Draw.io Integration extension
code --install-extension hediet.vscode-drawio
```

### 2. Trigger Diagram Generation
```bash
# Manual trigger via GitHub Actions
gh workflow run "Draw.io + GitIngest Integration"

# Or push changes to trigger automatically
git push origin main
```

### 3. View Generated Diagrams
- **In VS Code**: Open `.drawio` files directly
- **Online**: Upload to https://app.diagrams.net
- **Export**: Generate PNG/SVG for documentation

## Configuration

### Diagram Types
Configure in `diagrams/config.json`:

```json
{
  "diagram_types": [
    {
      "name": "repository-architecture",
      "description": "High-level repository structure",
      "auto_update": true,
      "triggers": ["push", "gitingest_update"]
    }
  ]
}
```

### GitIngest Settings
Customize analysis patterns in `.gitingestignore`:

```
# Include diagram files
!*.drawio
!diagrams/

# Exclude large binaries
*.png
*.log
node_modules/
```

## Generated Files

### `/diagrams/generated/`
- `altitude-overview.drawio` - 40k ft strategic Christmas tree backbone
- `orchestrator-tree.drawio` - 30k ft trunk with domain orchestrators and subagents
- `mcp-routing.drawio` - Ground level tool routing and Composio hub
- `diagram-metadata.json` - Generation metadata and altitude specifications

### Altitude Hierarchy:
- **40,000 ft**: Strategic oversight and business alignment
- **30,000 ft**: Overall orchestration and routing (Christmas tree trunk)
- **20,000 ft**: Input domain processing (tree branch)
- **10,000 ft**: Middle domain processing (tree branch)
- **5,000 ft**: Output domain processing (tree branch)
- **Ground Level**: Infrastructure and MCP tool routing

### Integration with IMO-Creator
- **Composio Endpoints**: Diagrams include live production URLs
- **MCP Registry**: Visual representation of tool configurations
- **Doctrine Branches**: Shows auto-scaffolding relationships
- **Production Config**: All URLs and API keys embedded

## Advanced Usage

### Custom Diagram Templates
Create new diagram types by extending the generation script:

```python
def create_custom_diagram():
    template = '''<?xml version="1.0" encoding="UTF-8"?>
    <mxfile host="app.diagrams.net">
      <!-- Your custom draw.io XML -->
    </mxfile>'''

    with open('diagrams/generated/custom.drawio', 'w') as f:
        f.write(template)
```

### Manual GitIngest Analysis
```bash
# Generate repository analysis
gitingest . -o analysis.txt --include-pattern "*.py" --include-pattern "*.drawio"

# Run diagram generation
python .github/workflows/generate_diagrams.py
```

### VS Code Tasks
The workflow creates VS Code tasks for local development:

```json
{
  "label": "Generate Draw.io Diagrams",
  "type": "shell",
  "command": "python",
  "args": ["generate_diagrams.py"],
  "group": "build"
}
```

## Doctrine Branch Integration

This `drawio-ingest` branch is designed to be auto-included via the IMO-Creator doctrine system:

1. **Branch Purpose**: Visual documentation and diagram generation
2. **Auto-Include**: Configured in `imo.config.json` for new repositories
3. **Dependencies**: GitIngest + Draw.io workflow automation
4. **Output**: Always-current architectural diagrams

When repositories are scaffolded from IMO-Creator, they automatically inherit:
- Draw.io diagram generation workflows
- GitIngest analysis automation
- Visual documentation templates
- VS Code integration setup

## Troubleshooting

### Common Issues
- **Large Files**: Adjust GitIngest max file size in workflow
- **Token Limits**: Use include/exclude patterns to filter content
- **Diagram Corruption**: Validate XML structure in generated files
- **VS Code Display**: Ensure Draw.io extension is installed and enabled

### Debug Commands
```bash
# Test GitIngest locally
gitingest . -o test-analysis.txt

# Validate draw.io XML
python -c "import xml.etree.ElementTree as ET; ET.parse('diagram.drawio')"

# Check workflow permissions
gh api repos/:owner/:repo/actions/permissions
```

## Contributing

### Adding New Diagram Types
1. Update `diagrams/config.json` with new diagram definition
2. Add generation function to workflow script
3. Create template XML in generation script
4. Test with sample repository

### Improving Analysis
1. Adjust `.gitingestignore` patterns
2. Modify include/exclude patterns in workflow
3. Update metadata extraction logic
4. Test with various repository structures

## Integration with Other Systems

### MCP Compatibility
- Diagrams reflect live MCP registry configurations
- Tool routing updates automatically when registry changes
- Composio API endpoints embedded in visual documentation

### CI/CD Integration
- Workflow artifacts available for download
- Generated diagrams can be used in documentation builds
- Integration with GitHub Pages for automatic publishing

---

**This draw.io + GitIngest integration ensures your architectural documentation stays synchronized with your codebase, providing always-current visual representations of your repository structure and tool integrations.**