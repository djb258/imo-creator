# CTB Generator Hook Registry

This directory contains hooks for automatic CTB generator integration.

## Garage-MCP Hooks

### `garage-mcp/pre-process.sh`
- **When**: Before Garage-MCP processes a repository
- **What**: Seeds CTB generator if not present
- **Usage**: `./hooks/garage-mcp/pre-process.sh /path/to/repo`

### `garage-mcp/post-process.sh`  
- **When**: After Garage-MCP finishes processing
- **What**: Regenerates CTB docs and ui-build folder
- **Usage**: `./hooks/garage-mcp/post-process.sh /path/to/repo`

## IMO-Factory Hooks

### `imo-factory/new-project.sh`
- **When**: Creating new project via IMO-Factory
- **What**: Seeds CTB with project-specific customization
- **Usage**: `./hooks/imo-factory/new-project.sh /path/to/project "Project Name" "project-type"`

## Git Hooks

### `git/pre-commit-ctb`
- **When**: Before committing changes
- **What**: Regenerates CTB docs if spec changed
- **Install**: `ln -s ../../hooks/git/pre-commit-ctb .git/hooks/pre-commit`

## Usage in Scripts

```bash
# For Garage-MCP integration
source hooks/garage-mcp/pre-process.sh "/path/to/repo"
source hooks/garage-mcp/post-process.sh "/path/to/repo"

# For IMO-Factory integration  
source hooks/imo-factory/new-project.sh "/path/to/project" "My App" "nodejs"

# For Git integration (install once)
ln -s ../../hooks/git/pre-commit-ctb .git/hooks/pre-commit
```

## Integration Points

- **Garage-MCP**: Call hooks during repo processing
- **IMO-Factory**: Call hooks during project creation
- **Git**: Optional auto-regeneration on commits
- **CI/CD**: GitHub Actions already handles this
