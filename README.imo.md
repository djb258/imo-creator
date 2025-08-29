# IMO/CTB/MCP Kit Integration

This repository is wired with the IMO Creator Kit, providing standardized tooling for IMO validation, CTB linting, and Plasmic synchronization with MCP orchestration.

## MCP Backend Integration

This project includes a dedicated **MCP Backend Server** deployed at **https://imo-creator.onrender.com** that provides orchestration between GitHub repositories, Whimsical diagrams, Plasmic UIs, and LLMs.

## Submodule Management

The IMO Creator Kit is referenced as a Git submodule at `.imo-kit`. 

### Initial Setup (when submodule is available)
```bash
# Add the submodule (replace <ORG> with your GitHub organization)
git submodule add -b v1 https://github.com/<ORG>/imo-creator-kit .imo-kit
git submodule update --init --recursive
```

### Update the Kit
```bash
# Pull latest changes from the kit repository
git submodule update --remote --merge .imo-kit

# Commit the updated reference
git add .imo-kit
git commit -m "kit bump: update IMO creator kit to latest"
```

## Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `PLASMIC_PROJECT_ID`: Your Plasmic project identifier
- `PLASMIC_AUTH_TOKEN`: Plasmic authentication token
- `MCP_URL`: MCP endpoint URL (https://imo-creator.onrender.com)
- `MCP_TOKEN`: MCP authentication token

### MCP Backend Environment Variables
The MCP backend server requires these additional environment variables:
```bash
# GitHub Integration
MCP_GITHUB_WEBHOOK_SECRET=your_webhook_secret
MCP_GITHUB_TOKEN=your_github_token

# Whimsical Integration  
MCP_WHIMSICAL_API_KEY=your_whimsical_key

# LLM Integration
MCP_LLM_API_KEY=your_openai_or_anthropic_key
MCP_LLM_MODEL=gpt-4  # or claude-3-5-sonnet

# Plasmic Integration
MCP_PLASMIC_PROJECT_ID=your_project_id
MCP_PLASMIC_AUTH_TOKEN=your_auth_token
```

### GitHub Secrets
Configure these repository secrets:
- `CTB_DISABLE`: Set to `1` to disable CTB linting
- `MCP_DISABLE`: Set to `1` to disable MCP calls
- `PLASMIC_PROJECT_ID`: Your Plasmic project ID
- `PLASMIC_AUTH_TOKEN`: Plasmic auth token
- `MCP_URL`: MCP endpoint
- `MCP_TOKEN`: MCP auth token

## Workflow Features

### Standards Check Workflow
The `.github/workflows/standards.yml` workflow runs on:
- Pull requests to `main` branch
- Manual workflow dispatch

It performs:
1. **IMO Validation**: Validates IMO compliance via `.imo-kit/scripts/validate-imo.sh`
2. **CTB Linting**: Lints the Whimsical blueprint at `ctb/ctb_blueprint.yaml` (unless `CTB_DISABLE=1`)
3. **Plasmic Sync**: Syncs with Plasmic when PR has `ui-sync` label
4. **MCP Operations**: Calls MCP for Plasmic/PR operations when `ui-sync` label is present (unless `MCP_DISABLE=1`)

### PR Labels
- `ui-sync`: Triggers Plasmic synchronization and MCP operations

## Local Development

Use the Makefile targets for local validation:
```bash
# Validate IMO compliance
make imo

# Lint CTB blueprint
make ctb

# Sync with Plasmic (requires env vars)
make plasmic
```

## Kill Switches

To disable specific checks:
- **CTB**: Set GitHub secret `CTB_DISABLE=1`
- **MCP**: Set GitHub secret `MCP_DISABLE=1`

## Project Structure

```
.
├── .imo-kit/              # IMO Creator Kit submodule (when added)
├── .github/
│   └── workflows/
│       └── standards.yml  # CI/CD workflow for standards checks
├── imo/
│   └── trace.json        # IMO trace configuration
├── ctb/
│   └── ctb_blueprint.yaml # CTB Whimsical blueprint
├── .env.example          # Environment variables template
├── .gitsubmodules.info   # Submodule documentation
├── Makefile              # Local dev helpers
└── README.imo.md         # This file
```

## Post-Setup Steps

1. **Enable Plasmic Push-to-GitHub**: Configure Plasmic to push to this repository in PR mode
2. **Configure GitHub Secrets**: Add all required secrets to your repository settings
3. **Update Organization**: Replace `<ORG>` in `.gitsubmodules.info` with your actual GitHub organization
4. **Add Submodule**: When the kit repository is available, add it as documented above

## CTB (Component-Tree-Blueprint) Integration

### CTB Blueprint Management
- **Edit CTB**: Modify `/ctb/ctb_blueprint.yaml` with your Whimsical board structure
- **Schema Validation**: CTB blueprint is validated against JSON schema during CI/CD
- **Local Validation**: Run `make ctb` or `npm run ctb:lint` for immediate feedback

### CTB Configuration
The CTB blueprint includes:
- `star.name`: Blueprint identifier
- `branches[].name`: Branch names with nested `nodes[].label` structure  
- `IMO`: IMO compliance settings and trace ID
- `ORBT`: ORBT policy configuration and tracking

### CTB Workflow
- **Automatic Linting**: CTB validation runs on all PRs that modify CTB files
- **Kill Switch**: Set GitHub secret `CTB_DISABLE=1` to disable CTB validation
- **Artifacts**: Validation results and CTB files uploaded as `ctb-check` artifacts
- **Schema Sources**: Prefers `.imo-kit/schemas/ctb_blueprint.schema.json`, falls back to local schema

### CTB Commands
```bash
# Validate CTB blueprint locally
make ctb
npm run ctb:lint

# Install dependencies for validation
npm install
```

## Maintenance

- **Update Kit**: Run `git submodule update --remote --merge .imo-kit` periodically
- **Monitor Workflows**: Check GitHub Actions for workflow runs and failures
- **Label PRs**: Add `ui-sync` label to PRs that need Plasmic synchronization
- **CTB Kill Switch**: Use `CTB_DISABLE=1` repository secret to bypass CTB validation