# Hub-and-Spoke Compliance Checklist

Use this checklist before deploying any hub or spoke. All items must be checked for production readiness.

---

## Hub Compliance Checklist

### 1. Identity & Registration

- [ ] Hub has unique `doctrine_id` assigned (format: `XX.XX.XX`)
- [ ] Hub name follows convention: `{DOMAIN}_HUB`
- [ ] Hub registered in `imo-architecture.json`
- [ ] Hub weight defined (0.0 - 1.0)

### 2. Tool Ownership

- [ ] All tools explicitly listed in hub definition
- [ ] Each tool has doctrine_id (format: `XX.XX.XX.XX`)
- [ ] No duplicate tool registrations across hubs
- [ ] Tool dependencies documented

**Tool Registration Format:**
```json
{
  "name": "TOOL_NAME",
  "doctrine_id": "XX.XX.XX.XX",
  "tools": ["tool_action_1", "tool_action_2"],
  "failures": [...]
}
```

### 3. Failure Definitions

- [ ] Every tool has at least one failure mode defined
- [ ] Each failure has:
  - [ ] Unique `code`
  - [ ] `severity` (info | warning | error | critical)
  - [ ] `description` (what triggers it)
  - [ ] `remediation` (how to fix it)
  - [ ] `autoRepairEnabled` (true | false)

**Failure Format:**
```json
{
  "code": "FAILURE_CODE",
  "severity": "error",
  "description": "What triggers this failure",
  "remediation": "How to fix it",
  "autoRepairEnabled": false
}
```

### 4. Kill Switch

- [ ] Kill switch configuration present
- [ ] Emergency contact defined
- [ ] Kill switch tested in staging
- [ ] Documentation for activation/deactivation

**Kill Switch Format:**
```yaml
kill_switch:
  enabled: false
  reason: ""
  disabled_by: ""
  disabled_at: ""
  emergency_contact: "team@example.com"
```

### 5. Guard Rails

- [ ] Rate limiting configured
  - [ ] Requests per minute: ____
  - [ ] Burst limit: ____
- [ ] Timeout thresholds set
  - [ ] Request timeout: ____ ms
  - [ ] Total operation timeout: ____ ms
- [ ] Retry policy defined
  - [ ] Max retries: ____
  - [ ] Backoff multiplier: ____
  - [ ] Initial delay: ____ ms

### 6. Health & Monitoring

- [ ] Health check endpoint exists: `/api/health/{hub_name}`
- [ ] Metrics exported to observability platform
- [ ] Alerts configured for:
  - [ ] Failure rate > threshold
  - [ ] Response time > threshold
  - [ ] Kill switch activation

### 7. Promotion Gates

- [ ] **G1**: All unit tests pass
- [ ] **G2**: Integration tests pass
- [ ] **G3**: This compliance checklist complete
- [ ] **G4**: ADR approved (if new tools added)
- [ ] **G5**: Rollback plan documented and tested

---

## Spoke Compliance Checklist

### 1. Identity & Inheritance

- [ ] Spoke has unique `doctrine_id` assigned
- [ ] Spoke name follows convention: `{FUNCTION}_SPOKE`
- [ ] Parent hub explicitly identified
- [ ] Spoke registered under parent hub's `subHubs`

### 2. Tool Inheritance

- [ ] Spoke does NOT define its own tools
- [ ] Spoke only uses tools from parent hub
- [ ] Tool access documented: which hub tools does spoke use?

**Valid:**
```json
{
  "name": "EMAIL_SPOKE",
  "parent_hub": "OUTREACH_HUB",
  "inherits_tools": ["gmail_send", "gmail_draft"]
}
```

**Invalid (DO NOT DO):**
```json
{
  "name": "EMAIL_SPOKE",
  "tools": ["gmail_send"]  // WRONG: Spokes don't own tools
}
```

### 3. No Direct External Integrations

- [ ] Spoke does NOT call external APIs directly
- [ ] All external calls route through parent hub
- [ ] No API keys stored at spoke level
- [ ] No OAuth tokens at spoke level

### 4. Failure Reporting

- [ ] Failures bubble to parent hub
- [ ] Spoke failure codes prefixed with spoke name
- [ ] No failure suppression (all errors reported)

### 5. Health Check

- [ ] Health endpoint exists
- [ ] Health reports to parent hub
- [ ] Spoke status visible in hub health

### 6. Promotion Gates

- [ ] **G1**: All tests pass
- [ ] **G2**: Parent hub approved changes
- [ ] **G3**: No new tool registrations
- [ ] **G4**: Failure propagation tested
- [ ] **G5**: Rollback tested

---

## Pre-Deployment Final Check

### For Hubs

| Check | Status | Notes |
|-------|--------|-------|
| Doctrine ID assigned | [ ] | |
| All tools registered | [ ] | |
| All failures defined | [ ] | |
| Kill switch configured | [ ] | |
| Rate limits set | [ ] | |
| Health endpoint live | [ ] | |
| Metrics flowing | [ ] | |
| Alerts configured | [ ] | |
| Rollback tested | [ ] | |

### For Spokes

| Check | Status | Notes |
|-------|--------|-------|
| Doctrine ID assigned | [ ] | |
| Parent hub identified | [ ] | |
| No direct tool ownership | [ ] | |
| Failures bubble up | [ ] | |
| Health endpoint live | [ ] | |
| Hub approved | [ ] | |

---

## Sign-Off

**Hub/Spoke Name:** _________________________

**Doctrine ID:** _________________________

**Reviewer:** _________________________

**Date:** _________________________

**Compliance Status:** [ ] PASS / [ ] FAIL

**Notes:**
```
[Add any notes, exceptions, or follow-up items here]
```

---

## Compliance Failure Protocol

If any item fails:

1. **STOP** - Do not deploy
2. **DOCUMENT** - Record what failed and why
3. **FIX** - Address the compliance gap
4. **RE-CHECK** - Run through checklist again
5. **ESCALATE** - If unable to fix, escalate to hub owner

**Exceptions require:**
- Written justification
- Hub owner approval
- Time-boxed remediation plan
- Tracking ticket created
