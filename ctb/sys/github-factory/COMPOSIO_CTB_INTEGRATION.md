# Composio CTB Integration

## 🎯 Overview

This document describes how the CTB compliance system integrates with Composio MCP for automated compliance cycles.

---

## 🔧 Composio Tasks

### Task 1: ctb_tagger

**Purpose**: Tag files with CTB metadata

**Endpoint**: `/api/composio/ctb/tag`

**Payload**:
```json
{
  "tool": "ctb_tagger",
  "data": {
    "directory": "ctb/",
    "output_file": "ctb/meta/ctb_tags.json"
  },
  "unique_id": "HEIR-2025-10-CTB-TAGGER-01",
  "process_id": "PRC-CTB-1729800000",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Response**:
```json
{
  "success": true,
  "files_tagged": 150,
  "distribution": {
    "sys": 45,
    "ai": 12,
    "data": 23,
    "docs": 30,
    "ui": 40
  },
  "output_file": "ctb/meta/ctb_tags.json",
  "report_file": "logs/CTB_TAGGING_REPORT.md"
}
```

---

### Task 2: ctb_auditor

**Purpose**: Audit CTB compliance and calculate score

**Endpoint**: `/api/composio/ctb/audit`

**Payload**:
```json
{
  "tool": "ctb_auditor",
  "data": {
    "directory": ".",
    "min_score": 90
  },
  "unique_id": "HEIR-2025-10-CTB-AUDITOR-01",
  "process_id": "PRC-CTB-1729800000",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Response**:
```json
{
  "success": true,
  "compliance_score": 85,
  "status": "GOOD",
  "issues": [
    {
      "severity": "MEDIUM",
      "category": "organization",
      "message": "Found 50 files outside CTB structure"
    }
  ],
  "recommendations": [
    {
      "priority": "MEDIUM",
      "action": "Run ctb_reorganizer.py"
    }
  ],
  "output_file": "logs/ctb_audit_report.json",
  "report_file": "logs/CTB_AUDIT_REPORT.md"
}
```

---

### Task 3: ctb_remediator

**Purpose**: Auto-fix CTB compliance issues

**Endpoint**: `/api/composio/ctb/remediate`

**Payload**:
```json
{
  "tool": "ctb_remediator",
  "data": {
    "directory": ".",
    "dry_run": false,
    "auto_commit": false
  },
  "unique_id": "HEIR-2025-10-CTB-REMEDIATOR-01",
  "process_id": "PRC-CTB-1729800000",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Response**:
```json
{
  "success": true,
  "actions_taken": 15,
  "actions": [
    {
      "action": "create_directory",
      "path": "ctb/meta",
      "timestamp": "2025-10-23T12:00:00Z"
    }
  ],
  "output_file": "logs/ctb_remediation_log.json",
  "report_file": "logs/CTB_REMEDIATION_SUMMARY.md"
}
```

---

## 🔄 Composio Scenario: CTB_Compliance_Cycle

**Scenario Name**: `CTB_Compliance_Cycle`

**Purpose**: Weekly automated CTB compliance check and remediation

**Schedule**: Every Sunday at 2:00 AM UTC

**Steps**:

### 1. Tag Files
```javascript
await composio.executeAction({
  action: 'ctb_tagger',
  params: {
    directory: 'ctb/',
    output_file: 'ctb/meta/ctb_tags.json'
  }
});
```

### 2. Audit Compliance
```javascript
const auditResult = await composio.executeAction({
  action: 'ctb_auditor',
  params: {
    directory: '.',
    min_score: 90
  }
});
```

### 3. Check Score
```javascript
if (auditResult.compliance_score < 90) {
  // Run remediator
  await composio.executeAction({
    action: 'ctb_remediator',
    params: {
      directory: '.',
      dry_run: false
    }
  });

  // Send notification
  await composio.executeAction({
    action: 'gmail_send',
    params: {
      to: 'team@example.com',
      subject: 'CTB Compliance Alert',
      body: `Compliance score: ${auditResult.compliance_score}/100. Auto-remediation applied.`
    }
  });
}
```

### 4. Update Documentation
```javascript
await composio.executeAction({
  action: 'github_update_file',
  params: {
    path: 'CTB_COMPLIANCE_STATUS.md',
    content: `Last Check: ${new Date().toISOString()}\nScore: ${auditResult.compliance_score}/100`
  }
});
```

---

## 📦 Implementation

### Create Composio Actions

Add to your Composio action definitions:

```javascript
// composio_actions.js
export const ctbActions = {
  ctb_tagger: {
    name: 'ctb_tagger',
    description: 'Tag files with CTB metadata',
    parameters: {
      directory: { type: 'string', required: true },
      output_file: { type: 'string', default: 'ctb/meta/ctb_tags.json' }
    },
    handler: async (params) => {
      // Run Python script
      const result = await exec(`python ctb/sys/github-factory/scripts/ctb_metadata_tagger.py ${params.directory}`);
      return parseTaggingResults();
    }
  },

  ctb_auditor: {
    name: 'ctb_auditor',
    description: 'Audit CTB compliance',
    parameters: {
      directory: { type: 'string', default: '.' },
      min_score: { type: 'number', default: 90 }
    },
    handler: async (params) => {
      const result = await exec(`python ctb/sys/github-factory/scripts/ctb_audit_generator.py`);
      return parseAuditResults();
    }
  },

  ctb_remediator: {
    name: 'ctb_remediator',
    description: 'Auto-fix CTB issues',
    parameters: {
      directory: { type: 'string', default: '.' },
      dry_run: { type: 'boolean', default: false }
    },
    handler: async (params) => {
      const flag = params.dry_run ? '--dry-run' : '';
      const result = await exec(`python ctb/sys/github-factory/scripts/ctb_remediator.py ${flag}`);
      return parseRemediationResults();
    }
  }
};
```

### Register Scenario

```javascript
// composio_scenarios.js
export const scenarios = {
  CTB_Compliance_Cycle: {
    name: 'CTB_Compliance_Cycle',
    description: 'Weekly CTB compliance check and auto-remediation',
    schedule: '0 2 * * 0', // Every Sunday at 2 AM
    steps: [
      { action: 'ctb_tagger', params: { directory: 'ctb/' } },
      { action: 'ctb_auditor', params: { min_score: 90 } },
      {
        action: 'ctb_remediator',
        condition: (prev) => prev.ctb_auditor.compliance_score < 90,
        params: { dry_run: false }
      },
      {
        action: 'gmail_send',
        condition: (prev) => prev.ctb_auditor.compliance_score < 90,
        params: {
          to: 'team@example.com',
          subject: 'CTB Compliance Alert',
          body: 'Compliance score below minimum. Auto-remediation applied.'
        }
      }
    ]
  }
};
```

---

## 🔌 REST API Endpoints

Add these endpoints to your Composio API integration:

```javascript
// In src/api/composio_tools.py or equivalent

@router.post("/ctb/tag")
async def ctb_tag_files(request: ToolExecutionRequest):
    """Run CTB metadata tagger"""
    directory = request.arguments.get('directory', 'ctb/')

    result = await execute_python_script(
        'ctb/sys/github-factory/scripts/ctb_metadata_tagger.py',
        [directory]
    )

    return {
        'success': True,
        'files_tagged': result['summary']['total_files'],
        'distribution': result['summary']['by_branch'],
        'output_file': 'ctb/meta/ctb_tags.json',
        'report_file': 'logs/CTB_TAGGING_REPORT.md'
    }

@router.post("/ctb/audit")
async def ctb_audit_compliance(request: ToolExecutionRequest):
    """Run CTB compliance audit"""
    min_score = request.arguments.get('min_score', 90)

    result = await execute_python_script(
        'ctb/sys/github-factory/scripts/ctb_audit_generator.py'
    )

    return {
        'success': True,
        'compliance_score': result['compliance_score'],
        'status': get_status(result['compliance_score']),
        'issues': result['issues'],
        'recommendations': result['recommendations'],
        'output_file': 'logs/ctb_audit_report.json',
        'report_file': 'logs/CTB_AUDIT_REPORT.md'
    }

@router.post("/ctb/remediate")
async def ctb_remediate_issues(request: ToolExecutionRequest):
    """Run CTB remediator"""
    dry_run = request.arguments.get('dry_run', False)

    flag = '--dry-run' if dry_run else ''
    result = await execute_python_script(
        'ctb/sys/github-factory/scripts/ctb_remediator.py',
        [flag] if flag else []
    )

    return {
        'success': True,
        'actions_taken': len(result['actions']),
        'dry_run': dry_run,
        'actions': result['actions'],
        'output_file': 'logs/ctb_remediation_log.json',
        'report_file': 'logs/CTB_REMEDIATION_SUMMARY.md'
    }
```

---

## 🎯 Usage Examples

### Manual Execution via Composio

```bash
# Tag files
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "ctb_tagger",
    "data": {"directory": "ctb/"},
    "unique_id": "HEIR-2025-10-CTB-TAG-01",
    "process_id": "PRC-CTB-TAG",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'

# Audit compliance
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "ctb_auditor",
    "data": {"min_score": 90},
    "unique_id": "HEIR-2025-10-CTB-AUDIT-01",
    "process_id": "PRC-CTB-AUDIT",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'

# Remediate issues
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "ctb_remediator",
    "data": {"dry_run": false},
    "unique_id": "HEIR-2025-10-CTB-FIX-01",
    "process_id": "PRC-CTB-FIX",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

### Automated via Scenario

```javascript
// Trigger the compliance cycle
const result = await composio.runScenario('CTB_Compliance_Cycle');

console.log(`Compliance Score: ${result.audit.compliance_score}/100`);
console.log(`Actions Taken: ${result.remediate?.actions_taken || 0}`);
```

---

## 📊 Monitoring

### Track Compliance Over Time

```javascript
// Store compliance scores
const complianceHistory = {
  date: new Date().toISOString(),
  score: auditResult.compliance_score,
  issues: auditResult.issues.length,
  actions_taken: remediateResult.actions_taken
};

// Save to database or Firebase
await firestore.collection('compliance_history').add(complianceHistory);
```

### Set Up Alerts

```javascript
if (auditResult.compliance_score < 70) {
  // Send Slack notification
  await composio.executeAction({
    action: 'slack_send_message',
    params: {
      channel: '#alerts',
      text: `🚨 CTB Compliance CRITICAL: Score ${auditResult.compliance_score}/100`
    }
  });
}
```

---

## 🎉 Summary

The CTB compliance system is fully integrated with Composio:

- ✅ **3 Composio Actions**: tagger, auditor, remediator
- ✅ **1 Composio Scenario**: CTB_Compliance_Cycle (weekly)
- ✅ **REST API Endpoints**: /ctb/tag, /ctb/audit, /ctb/remediate
- ✅ **HEIR/ORBT Compliant**: All payloads follow standard format
- ✅ **Automated**: Weekly compliance checks with auto-remediation

**Use the scenario for hands-off CTB maintenance!**
