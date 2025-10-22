# DeepWiki Documentation Directory

This directory contains automatically generated documentation from the DeepWiki automation system.

## Structure

```
deep_wiki/
├── deepwiki_index.json          # Master index of all documented repositories
├── README.md                     # This file
├── last_analysis.json           # Most recent analysis results
├── last_error.json              # Last error (if any)
└── repositories/                # Per-repository documentation
    ├── imo-creator/
    │   ├── wiki.json
    │   ├── wiki.md
    │   └── diagrams/
    ├── outreach-core/
    ├── client-intake/
    └── blueprint-engine/
```

## Index File Format

The `deepwiki_index.json` file contains:

```json
{
  "version": "1.0",
  "last_updated": "ISO8601 timestamp",
  "repositories": {
    "repo-name": {
      "branch": "branch name",
      "last_commit": "commit hash",
      "last_updated": "ISO8601 timestamp",
      "repository_id": "deepwiki repo ID",
      "author": "commit author",
      "email": "commit email",
      "commit_message": "commit message",
      "status": "success|failed",
      "changed_files": 0
    }
  }
}
```

## Automation

Documentation is automatically updated when:
- Code is pushed to any monitored branch
- Pull requests are merged
- Scheduled daily refresh (2 AM UTC)
- Manual trigger via GitHub Actions

## Configuration

See `global-config/global_manifest.yaml` for:
- Enabled/disabled status
- Target repositories
- AI provider settings
- Logging configuration
- Kill switch

## Logs

- **Audit Log**: `logs/deepwiki_audit.log` - All runs and their outcomes
- **Error Log**: `logs/deepwiki_error.log` - Failed runs and errors

## Kill Switch

To disable all automation globally:

```yaml
# In global-config/global_manifest.yaml
deep_wiki:
  kill_switch:
    enabled: true
    reason: "Emergency maintenance"
```

## Manual Execution

To manually run DeepWiki analysis:

```bash
# Via hook script
./scripts/hooks/post_update_deepwiki.sh

# Via GitHub Actions
gh workflow run deepwiki_automation.yml
```

## Troubleshooting

### DeepWiki API Not Running

```bash
cd deepwiki
python -m api.main
```

### Check Configuration

```bash
cat global-config/global_manifest.yaml | grep -A 20 "deep_wiki:"
```

### View Logs

```bash
tail -f logs/deepwiki_audit.log
tail -f logs/deepwiki_error.log
```

## Support

For issues or questions:
- Check logs first
- Review global configuration
- Ensure API keys are configured
- Contact: admin@bartonenterprises.com

---

**Last Updated**: 2025-10-22
**Version**: 1.0
