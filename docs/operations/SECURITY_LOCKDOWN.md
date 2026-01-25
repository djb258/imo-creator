# Security & Secret Handling Lockdown

**Authority**: Operational runbook (subordinate to CANONICAL_ARCHITECTURE_DOCTRINE.md)
**Status**: ACTIVE
**Last Updated**: 2026-01-11

---

## Zero-Tolerance Security Policy

**CRITICAL**: All Barton systems run under Composio MCP vault. Local `.env` files are **STRICTLY FORBIDDEN**.

| Policy | Status |
|--------|--------|
| Local .env files | FORBIDDEN |
| Hardcoded secrets | FORBIDDEN |
| MCP vault usage | REQUIRED |
| Runtime injection | REQUIRED |

---

## Security Enforcement Actions

The security lockdown system performs the following checks before any build or deploy:

### 1. File Scanning

- Scans for `.env`, `.env.local`, `.env.*` files
- Checks for `credentials.json`, `service-account.json`
- Detects `secrets.yaml`, `vault.json`, `.secrets`
- **Action**: Blocks build if any forbidden files found

### 2. Secret Pattern Detection

- Scans for hardcoded API keys
- Detects passwords in code
- Finds authentication tokens
- Identifies database connection strings with credentials
- **Action**: Fails if hardcoded secrets detected

### 3. MCP Vault Validation

- Verifies MCP configuration exists
- Validates MCP variable usage patterns
- Checks vault integration setup
- **Action**: Warns if MCP not properly configured

### 4. Security Audit Logging

- Logs all scans to `logs/security_audit.log`
- Records violations to Firebase `security_audit_log`
- Tags violating commits with `[SECURITY_LOCKDOWN_TRIGGERED]`
- **Action**: Permanent audit trail

---

## Running Security Scans

**Manual Security Scan:**
```bash
bash global-config/scripts/security_lockdown.sh
```

**Automated Security:**
- Runs automatically on every push via GitHub Actions
- Blocks PRs with security violations
- Zero tolerance - no builds proceed with violations

---

## Forbidden Files

The following files are **NEVER** allowed in any CTB repository:

```
.env
.env.local
.env.development
.env.production
.env.staging
.env.test
*.env
credentials.json
service-account.json
firebase-adminsdk*.json
*-credentials.json
secrets.yaml
secrets.yml
vault.json
.secrets
```

**Exception**: `.env.example` and `.env.template` are allowed (with NO real values)

---

## MCP Variable Usage

**FORBIDDEN:**
```typescript
// Direct environment variable access
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// Hardcoded secrets
const secret = "sk_live_abc123def456";
```

**REQUIRED:**
```typescript
import { mcp } from './mcp_vault_resolver';

// Single variable
const apiKey = await mcp.getVariable('API_KEY');

// Multiple variables
const vars = await mcp.getVariables(['API_KEY', 'DATABASE_URL']);
```

---

## MCP Vault Sources

Secrets are resolved from these sources (in priority order):

1. **MCP Environment Registry** (Priority 1)
   - Composio MCP server
   - Port: 3001
   - Endpoint: `http://localhost:3001/vault/get`

2. **Doppler Vault** (Priority 2)
   - If configured
   - For sensitive production secrets

3. **Firebase Secure Variables** (Priority 3)
   - Read-only access
   - Staging/development variables

---

## Failure Policy

**When security violations are detected:**

1. Builds are BLOCKED
2. Deploys are BLOCKED
3. PRs are REJECTED
4. CI/CD FAILS
5. Commit is TAGGED with `[SECURITY_LOCKDOWN_TRIGGERED]`
6. Violation is LOGGED to Firebase audit log

**No exceptions. No overrides. Zero tolerance.**

---

## Remediation Steps

**If security scan fails:**

1. **Remove Forbidden Files**
   ```bash
   find . -name "*.env" -not -name "*.example"
   git rm .env .env.local .env.production
   git commit -m "Security: Remove forbidden .env files"
   ```

2. **Move Secrets to MCP Vault**
   ```bash
   curl -X POST http://localhost:3001/vault/set \
     -H "Content-Type: application/json" \
     -d '{"key": "DATABASE_URL", "value": "postgres://..."}'
   ```

3. **Update Code**
   ```typescript
   import { mcp } from './mcp_vault_resolver';
   const db = await mcp.getVariable('DATABASE_URL');
   ```

4. **Re-scan**
   ```bash
   bash global-config/scripts/security_lockdown.sh
   ```

---

## Security Audit Log Format

```json
{
  "timestamp": "2026-01-11T00:00:00Z",
  "repo_id": "repository-name",
  "scan_type": "security_lockdown",
  "policy": "zero_tolerance",
  "violations": {
    "total": 0,
    "env_files": 0,
    "hardcoded_secrets": 0,
    "violations_list": []
  },
  "mcp_compliance": {
    "config_valid": true,
    "usage_correct": true
  },
  "status": "PASSED"
}
```

---

## Document Control

| Field | Value |
|-------|-------|
| Type | Operational Runbook |
| Authority | Subordinate to Canonical Doctrine |
| Extracted From | global-config/CTB_DOCTRINE.md |
