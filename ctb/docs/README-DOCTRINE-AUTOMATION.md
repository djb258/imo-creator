# Doctrine Automation Setup

## 🎯 Overview

The IMO-Creator Doctrine Automation System provides fully automated deployment, validation, and cross-repository synchronization through Composio MCP integration. **No tokens stored, no manual input required.**

## 🏗️ Architecture

### 1️⃣ GPT Ecosystem
- **Personal Assistant GPT:** Personal productivity (Gmail, Calendar, Drive, Notion)
- **Composio MCP GPT:** Doctrine validation and build automation

Both connect to: `http://localhost:3001`

### 2️⃣ Claude Coordination
Claude Code reads `/config/claude_orchestration.config.json` to know:
- Which GPTs exist
- Which repos to watch
- When to trigger doctrine validation or deploys

Claude communicates only via Composio relay endpoints — **no tokens, no direct API keys.**

### 3️⃣ GitHub Workflows
Workflows live in `.github/workflows/`:
- `composio-orchestration.yml` - Main event routing
- `doctrine-validate.yml` - Doctrine branch validation
- `firebase-promote.yml` - Production deployment promotion
- `figma-sync.yml` - Design token and asset synchronization
- `sync-updates.yml` - Cross-repository synchronization

Each uses Composio safe curl calls to `http://localhost:3001/`

### 4️⃣ Kill Switch & Audit
- Deploy blocked unless doctrine returns `validated:true`
- Non-200 response → fail job + log to `human_firebreak_queue`
- Logs stored in `firebase.firestore:repo_activity`

## ⚙️ Configuration Files

### Core Configuration
```
config/
├── personal_assistant.config.json     # Personal productivity GPT
├── composio_mcp_gpt.config.json      # Doctrine validation GPT
└── claude_orchestration.config.json   # Claude coordination setup
```

### Key Configuration Values
- **Composio Base URL:** `http://localhost:3001`
- **GitHub Event Endpoint:** `/github/event`
- **Doctrine Validation:** `/doctrine/validate`
- **Firebase Promotion:** `/firebase/promote`
- **Figma Sync:** `/figma/sync`
- **Human Firebreak:** `/human-firebreak`

## 🚀 Workflow Triggers

### Doctrine Validation (`doctrine-validate.yml`)
**Triggers:**
- Push to `doctrine/*` branches
- Pull requests targeting `doctrine/*` branches
- Manual workflow dispatch

**Process:**
1. Load Claude orchestration config
2. Extract validation parameters
3. Send validation request to Composio MCP
4. Parse validation results
5. Block deployment if validation fails
6. Escalate to human firebreak on errors

### Firebase Promotion (`firebase-promote.yml`)
**Triggers:**
- Successful completion of `doctrine-validate.yml`
- Manual promotion workflow dispatch
- Repository dispatch events

**Process:**
1. Load promotion configuration
2. Validate promotion readiness
3. Send promotion request to Composio MCP
4. Monitor deployment progress
5. Update deployment status
6. Handle rollback on failure

### Figma Sync (`figma-sync.yml`)
**Triggers:**
- Figma webhook events (design updates)
- Manual sync workflow dispatch
- Repository dispatch events

**Process:**
1. Load Figma sync configuration
2. Extract sync parameters (design-tokens, components, assets, prototypes)
3. Send sync request to Composio MCP
4. Validate synced assets
5. Generate sync report
6. Update target repositories

### Cross-Repository Sync (`sync-updates.yml`)
**Triggers:**
- Push to `main` branch
- Workflow completion events
- Manual sync dispatch

**Process:**
1. Load sync configuration from `imo-sync.config.json`
2. Determine target repositories and sync types
3. Send sync request to Composio MCP
4. Monitor cross-repo updates
5. Generate sync reports

## 🔐 Security Features

### No Token Storage
- All authentication handled by Composio MCP
- GitHub workflows use safe curl calls only
- No API keys stored in repository secrets

### Human Firebreak System
```json
{
  "escalation_rules": {
    "validation_failure": "immediate",
    "deployment_failure": "immediate",
    "security_violation": "immediate",
    "performance_degradation": "within_1_hour"
  }
}
```

### Kill Switch
- Enabled for all deployment workflows
- Triggered on validation failures or security violations
- Halts all deployments across target repositories

### Audit Logging
- All operations logged to `firebase.firestore:repo_activity`
- 365-day retention for compliance
- Real-time monitoring and alerting

## 🧪 Test Sequences

### 5️⃣ Doctrine Workflow Test
1. Push a commit to `doctrine/test-feature`
2. Verify `doctrine-validate.yml` triggers automatically
3. Monitor validation progress in Actions tab
4. Confirm validation passes via Composio endpoint
5. Check `firebase-promote.yml` triggers on success
6. Verify deployment completion and health checks
7. Validate cross-repo sync propagates changes

### Figma Integration Test
1. Update design tokens in Figma
2. Trigger `figma-sync.yml` workflow (manual or webhook)
3. Verify tokens sync to `design-system/` directory
4. Check cross-repo propagation to target repositories
5. Validate build integration and token usage

### Cross-Repository Sync Test
1. Update configuration in `imo-sync.config.json`
2. Push changes to trigger `sync-updates.yml`
3. Monitor sync progress to `sales-hive`, `client-hive`, `outreach-hive`
4. Verify selective sync based on sync types
5. Validate workflow synchronization across repositories

## 📊 Monitoring & Troubleshooting

### Health Checks
- **Composio Endpoint:** `http://localhost:3001/health`
- **Check Interval:** 5 minutes
- **Timeout:** 30 seconds

### Key Metrics
- **Success Rate:** >95% (alert threshold)
- **Deployment Time:** <10 minutes (alert threshold)
- **Rollback Frequency:** <10 per month (alert threshold)

### Common Issues

#### 1. Validation Failures
**Symptoms:** Doctrine validation returns non-200 status
**Resolution:**
- Check Composio MCP endpoint health
- Review validation logs in workflow
- Escalate to human firebreak queue

#### 2. Cross-Repo Sync Failures
**Symptoms:** Target repositories not updating
**Resolution:**
- Verify `imo-sync.config.json` configuration
- Check target repository permissions
- Monitor Composio MCP sync endpoint

#### 3. Figma Sync Issues
**Symptoms:** Design tokens not updating
**Resolution:**
- Verify Figma connection in Composio
- Check webhook configuration
- Validate design token export settings

### Debug Commands
```bash
# Check workflow status
gh run list --workflow=doctrine-validate.yml

# View specific run logs
gh run view [RUN_ID] --log

# Test Composio endpoint
curl -X GET http://localhost:3001/health

# Trigger manual sync
gh workflow run sync-updates.yml -f target_repo=sales-hive -f sync_type=workflows-only
```

## 🎛️ Manual Controls

### Trigger Doctrine Validation
```bash
gh workflow run doctrine-validate.yml \
  -f branch_name=doctrine/feature-name \
  -f validation_level=full
```

### Trigger Firebase Promotion
```bash
gh workflow run firebase-promote.yml \
  -f environment=staging \
  -f promotion_type=standard
```

### Trigger Figma Sync
```bash
gh workflow run figma-sync.yml \
  -f sync_type=design-tokens \
  -f target_repos=all-repos
```

### Trigger Cross-Repo Sync
```bash
gh workflow run sync-updates.yml \
  -f target_repo=all-repos \
  -f sync_type=full-sync
```

## 🚨 Emergency Procedures

### Kill Switch Activation
1. Navigate to Actions tab in GitHub
2. Cancel all running workflows
3. Disable doctrine automation workflows temporarily
4. Investigate root cause via Composio MCP logs

### Human Firebreak Queue
- **Access:** `http://localhost:3001/human-firebreak`
- **Purpose:** Manual intervention for failed automations
- **SLA:** Immediate response for critical failures

### Rollback Procedures
1. Identify last known good deployment
2. Trigger manual rollback via Firebase promotion workflow
3. Update configuration to prevent re-deployment
4. Investigate and fix root cause

## 📚 Related Documentation

- [Composio MCP Integration Guide](./docs/COMPOSIO_MCP_INTEGRATION.md)
- [Sync System Documentation](./docs/SYNC_SYSTEM.md)
- [Sync Configuration](./imo-sync.config.json)
- [GitHub Actions Workflows](./github/workflows/)

## 🛠️ Maintenance

### Regular Tasks
- [ ] Weekly health check of Composio endpoints
- [ ] Monthly review of audit logs and metrics
- [ ] Quarterly update of configuration files
- [ ] Annual security review of authentication flows

### Configuration Updates
1. Modify relevant config file in `/config/`
2. Test changes in `doctrine/test-*` branch
3. Validate via doctrine workflow
4. Merge to `main` after successful validation

---

**🤖 Automated Documentation**
*This system operates with zero manual intervention. All operations route through Composio MCP for security and auditability.*