# Actions Workflows Branch

This branch defines reusable GitHub Actions workflows for the IMO-Creator ecosystem. These workflows are doctrine-controlled and automatically included in every new repository that uses the IMO-Creator framework.

## 🔄 Available Workflows

### `compliance.yml`
- **Purpose**: HEIR doctrine compliance validation
- **Triggers**: Push to main, PRs, manual dispatch
- **Validates**:
  - `heir.doctrine.yaml` structure and required fields
  - `config/mcp_registry.json` format and sections
  - Repository compliance with IMO standards

### `tests.yml`
- **Purpose**: Automated testing for Python and Node.js projects
- **Features**:
  - Multi-Python version matrix testing (3.11+)
  - Code linting (ruff, black)
  - Test coverage reporting
  - Node.js testing support
  - Placeholder test creation if none exist

### `docs.yml`
- **Purpose**: Documentation validation and maintenance
- **Features**:
  - Markdown linting and link checking
  - Auto-generation of documentation index
  - IMO architecture documentation validation
  - Required section checking

### `deploy.yml`
- **Purpose**: Deployment orchestration for Vercel and Render
- **Features**:
  - Frontend deployment (Vercel integration)
  - Backend deployment (Render integration)
  - Health checks and validation
  - Deployment summary reporting

## 🎯 Doctrine Integration

These workflows are automatically included in every IMO-Creator repository through the doctrine branch system:

```json
{
  "doctrine_branches": {
    "actions-workflows": {
      "compliance": ".github/workflows/compliance.yml",
      "tests": ".github/workflows/tests.yml",
      "docs": ".github/workflows/docs.yml",
      "deploy": ".github/workflows/deploy.yml"
    }
  }
}
```

## 🚀 Usage

When creating a new repository from IMO-Creator:

1. **Workflows are auto-copied** from this branch
2. **CI/CD pipeline activates** immediately on first push
3. **Compliance checks run** automatically
4. **Deployment workflows** activate when secrets are configured

## 🔧 Customization

While these workflows provide sensible defaults:

- **Environment-specific** modifications are allowed
- **Secret configuration** enables full deployment automation
- **Workflow dispatch** allows manual triggering
- **Status badges** can be added to README files

## 📋 Requirements

For full functionality, repositories should have:

- `heir.doctrine.yaml` - HEIR compliance metadata
- `config/mcp_registry.json` - MCP integration registry
- `requirements.txt` or `package.json` - Dependency specifications
- `tests/` directory - Test files (auto-created if missing)

## 🏷️ Branch Purpose

This is a **doctrine branch** - it provides foundational CI/CD capabilities that every IMO-Creator repository inherits automatically. Updates to these workflows propagate to all repositories using the IMO-Creator framework.