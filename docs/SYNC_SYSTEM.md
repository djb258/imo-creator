# IMO-Creator Sync System

The IMO-Creator Sync System enables automatic synchronization of workflows, configurations, and documentation to doctrine-aligned repositories (sales-hive, client-hive, outreach-hive).

## Quick Start

### From Other Repositories

To trigger a sync from another repository, use one of these methods:

#### 1. Using the Trigger Script

```bash
# Linux/macOS
export GITHUB_TOKEN=your_github_token
./scripts/trigger-sync.sh sales-hive workflows-only

# Windows
set GITHUB_TOKEN=your_github_token
scripts\trigger-sync.bat sales-hive workflows-only
```

#### 2. Manual GitHub Actions Trigger

Go to: https://github.com/djb258/imo-creator/actions/workflows/sync-updates.yml
Click "Run workflow" and select your options.

#### 3. API Request

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "event_type": "sync-imo-creator",
    "client_payload": {
      "target_repo": "sales-hive",
      "sync_type": "workflows-only"
    }
  }' \
  https://api.github.com/repos/djb258/imo-creator/dispatches
```

## Configuration

The sync system is configured via `imo-sync.config.json`:

### Target Repositories
```json
{
  "sync": {
    "target_repositories": [
      {
        "name": "sales-hive",
        "owner": "djb258",
        "branch": "main",
        "enabled": true,
        "sync_types": ["workflows-only", "configs-only", "full-sync"]
      }
    ]
  }
}
```

### Sync Types

#### `workflows-only`
Syncs GitHub Actions workflows:
- `.github/workflows/composio-orchestration.yml`
- `.github/workflows/doctrine-validate.yml`
- `.github/workflows/firebase-promote.yml`
- `.github/workflows/sync-updates.yml`

#### `configs-only`
Syncs configuration files:
- `config/mcp_endpoints.json`
- `composio-tools-summary.json`
- `imo-sync.config.json`

#### `full-sync`
Syncs workflows, configs, and documentation:
- All workflow files
- All config files
- Documentation in `docs/`

## How It Works

1. **Trigger**: Sync can be triggered manually, via API, or automatically on push
2. **Configuration Loading**: System loads `imo-sync.config.json` for settings
3. **File Collection**: Collects files based on sync type presets
4. **Composio MCP**: Sends sync request to `https://composio-imo-creator-url.onrender.com/imo-creator/sync`
5. **Target Update**: Composio MCP handles updating target repositories
6. **Reporting**: Generates sync reports and artifacts

## Security

- No GitHub tokens stored in workflows
- All authentication handled by Composio MCP
- File scanning to prevent secret leaks
- Configurable file size and type restrictions

## Monitoring

Monitor sync operations at:
- **GitHub Actions**: https://github.com/djb258/imo-creator/actions
- **Workflow Runs**: https://github.com/djb258/imo-creator/actions/workflows/sync-updates.yml
- **Artifacts**: Download sync reports from completed runs

## Troubleshooting

### Common Issues

1. **Authentication Error**: Ensure GITHUB_TOKEN is set
2. **Invalid Repository**: Check repository exists in config
3. **Sync Failed**: Check Composio MCP endpoint status
4. **File Not Found**: Verify files exist in source repository

### Debug Steps

1. Check workflow logs in GitHub Actions
2. Verify sync configuration is valid JSON
3. Ensure target repository exists and is accessible
4. Check Composio MCP endpoint health

## Examples

### Sync All Workflows to All Repos
```bash
./scripts/trigger-sync.sh all-repos workflows-only
```

### Sync Configs to Specific Repo
```bash
./scripts/trigger-sync.sh client-hive configs-only
```

### Full Sync to Single Repo
```bash
./scripts/trigger-sync.sh outreach-hive full-sync
```

---

For more details, see:
- [Composio MCP Integration Guide](./COMPOSIO_MCP_INTEGRATION.md)
- [Sync Configuration](../imo-sync.config.json)
- [GitHub Actions Workflows](../.github/workflows/)