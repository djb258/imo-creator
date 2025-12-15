# Product Requirements Document: Hub Definition

> **Template Version:** 1.0
> **Use this template when:** Creating a new hub in any domain

---

## 1. Hub Overview

### 1.1 Basic Information

| Field | Value |
|-------|-------|
| **Hub Name** | `{DOMAIN}_HUB` |
| **Doctrine ID** | `XX.XX.XX` |
| **Domain** | (e.g., Outreach, Storage, Insurance) |
| **Owner** | (Team or individual responsible) |
| **Created** | YYYY-MM-DD |

### 1.2 Purpose Statement

_One paragraph describing what this hub does and why it exists._

```
[REPLACE: This hub manages {domain} operations by owning {tools} and
coordinating {number} spokes for {business function}.]
```

### 1.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Availability | 99.9% | Uptime monitoring |
| Response Time | < 500ms | P95 latency |
| Error Rate | < 1% | Failure count / total |
| [Custom] | | |

---

## 2. Hub Architecture

### 2.1 Position in Hierarchy

```
CORE_SYSTEM
    └── {THIS_HUB}
            ├── SPOKE_1
            ├── SPOKE_2
            └── SPOKE_N
```

### 2.2 Weight & Priority

| Setting | Value | Justification |
|---------|-------|---------------|
| Weight | 0.0 - 1.0 | [Why this weight?] |
| Failure Priority | 1-4 | [Critical path?] |

---

## 3. Tool Ownership

### 3.1 Tools Owned by This Hub

| Tool Name | Doctrine ID | Purpose | Source |
|-----------|-------------|---------|--------|
| `tool_1` | XX.XX.XX.01 | [What it does] | [Composio/Custom/Direct] |
| `tool_2` | XX.XX.XX.02 | [What it does] | [Composio/Custom/Direct] |

### 3.2 Tool Registration

```json
{
  "name": "{HUB_NAME}",
  "doctrine_id": "XX.XX.XX",
  "tools": [
    "tool_action_1",
    "tool_action_2"
  ]
}
```

### 3.3 Tools NOT Owned (Inherited or External)

| Tool | Owned By | Access Method |
|------|----------|---------------|
| [tool] | [Other Hub] | [Via MCP / Direct] |

---

## 4. Spokes

### 4.1 Planned Spokes

| Spoke Name | Doctrine ID | Inherits Tools | Purpose |
|------------|-------------|----------------|---------|
| `SPOKE_1` | XX.XX.XX.S1 | tool_1, tool_2 | [Function] |
| `SPOKE_2` | XX.XX.XX.S2 | tool_1 | [Function] |

### 4.2 Spoke Inheritance Rules

- Spokes inherit tools from this hub only
- Spokes cannot register new tools
- Spokes report failures to this hub
- This hub controls spoke promotion

---

## 5. Failure Modes

### 5.1 Hub-Level Failures

| Code | Severity | Trigger | Remediation | Auto-Repair |
|------|----------|---------|-------------|-------------|
| `HUB_DOWN` | critical | Hub unresponsive | Restart service | No |
| `RATE_LIMITED` | warning | API limits hit | Backoff | Yes |
| [Add more] | | | | |

### 5.2 Tool-Level Failures

| Tool | Code | Severity | Trigger | Remediation | Auto-Repair |
|------|------|----------|---------|-------------|-------------|
| tool_1 | `TOOL1_FAIL` | error | [Condition] | [Action] | Yes/No |
| tool_2 | `TOOL2_TIMEOUT` | warning | [Condition] | [Action] | Yes/No |

### 5.3 Escalation Rules

| From | To | After | Condition |
|------|----|-------|-----------|
| warning | error | 30 min | Unresolved |
| error | critical | 60 min | Unresolved |

---

## 6. Guard Rails

### 6.1 Rate Limiting

| Limit Type | Value | Scope |
|------------|-------|-------|
| Requests/minute | [number] | Per spoke |
| Requests/minute | [number] | Hub total |
| Burst limit | [number] | |

### 6.2 Timeouts

| Operation | Timeout | Action on Timeout |
|-----------|---------|-------------------|
| Single request | [ms] | Retry with backoff |
| Total operation | [ms] | Fail and report |

### 6.3 Circuit Breaker

| Setting | Value |
|---------|-------|
| Failure threshold | [count] |
| Recovery timeout | [seconds] |
| Half-open requests | [count] |

---

## 7. Kill Switch

### 7.1 Configuration

```yaml
kill_switch:
  enabled: false
  reason: ""
  disabled_by: ""
  disabled_at: ""
  emergency_contact: "[email/phone]"
```

### 7.2 Activation Criteria

The kill switch MUST be activated when:

- [ ] Data corruption detected
- [ ] Security breach suspected
- [ ] Downstream system failure cascading
- [ ] [Domain-specific criteria]

### 7.3 Activation Procedure

1. Set `enabled: true` in configuration
2. Document `reason`, `disabled_by`, `disabled_at`
3. Notify `emergency_contact`
4. Monitor for cascade effects
5. Begin incident response

### 7.4 Deactivation Procedure

1. Confirm root cause resolved
2. Verify downstream systems stable
3. Set `enabled: false`
4. Clear `reason` field
5. Document in incident log

---

## 8. Promotion Gates

### 8.1 Required Gates

| Gate | Requirement | Verification |
|------|-------------|--------------|
| G1 | All tests pass | CI pipeline |
| G2 | Compliance checklist complete | Manual review |
| G3 | ADR approved (new tools) | PR approval |
| G4 | Kill switch documented | Config check |
| G5 | Rollback plan tested | Staging deploy |

### 8.2 Rollback Plan

**Trigger conditions:**
- Error rate > [threshold]
- Response time > [threshold]
- Kill switch activated

**Rollback steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Rollback verification:**
- [ ] Previous version deployed
- [ ] Health checks pass
- [ ] Error rate normalized

---

## 9. Dependencies

### 9.1 Upstream Dependencies

| System | Type | Impact if Down |
|--------|------|----------------|
| [System] | Required/Optional | [Impact] |

### 9.2 Downstream Dependents

| System | Type | Notification Required |
|--------|------|----------------------|
| [Spoke/System] | [Type] | Yes/No |

---

## 10. Compliance

### 10.1 HEIR/ORBT Tracking

- [ ] All operations generate `unique_id`
- [ ] All operations generate `process_id`
- [ ] `orbt_layer` assigned
- [ ] `blueprint_version` tracked

### 10.2 Master Failure Hub Integration

- [ ] Failures report to `MASTER_FAILURE_LOG`
- [ ] Severity levels mapped correctly
- [ ] Auto-repair hooks configured

---

## 11. Implementation Timeline

| Phase | Description | Duration | Dependencies |
|-------|-------------|----------|--------------|
| Design | ADR + PRD approval | | None |
| Build | Core hub implementation | | Design approved |
| Test | Integration + compliance | | Build complete |
| Deploy | Staged rollout | | Tests pass |

---

## 12. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Hub Owner | | | |
| Architect | | | |
| Security | | | |

---

## Appendix A: JSON Schema

```json
{
  "name": "{HUB_NAME}",
  "type": "hub",
  "doctrine_id": "XX.XX.XX",
  "weight": 1.0,
  "subHubs": [],
  "tools": [],
  "failures": [],
  "kill_switch": {
    "enabled": false,
    "emergency_contact": ""
  }
}
```

## Appendix B: Related Documents

- [ ] ADR for new tools: `adr/ADR-XXX.md`
- [ ] Compliance checklist: `checklists/HUB_COMPLIANCE.md`
- [ ] Architecture diagram: `[link]`
