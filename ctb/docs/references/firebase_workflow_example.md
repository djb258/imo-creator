# Firebase MCP Integration - Barton Doctrine Workflow Example

## Overview
This example demonstrates how Firebase serves as **staging memory** in the Barton Doctrine architecture, with Composio acting as the orchestrator between Firebase and all agents.

## Architecture Flow
```
Studio App → Firebase (staging) → Composio (validator) → Neon (vault) → BigQuery (silo)
```

## Example Workflow: Lead Intake System

### 1. Studio App Writes Lead Data
A Firebase Studio app captures lead intake data and writes it to Firebase staging:

```javascript
// Studio app writes lead to Firebase staging
const leadData = {
  unique_id: "lead_2025_001_abc123",
  process_id: "lead_intake.studio.20250928.validation",
  timestamp_last_touched: Date.now(),
  validated: false, // Initially unvalidated

  // Lead-specific data
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1-555-0123",
  company: "Tech Corp",
  source: "website_form",
  campaign_id: "summer_2025",

  // Metadata
  _created_by: "studio_lead_intake_app",
  _created_at: new Date().toISOString()
};

// POST to Firebase MCP
await fetch('http://localhost:3001/mcp/firebase_write', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collection: 'leads_staging',
    payload: leadData
  })
});
```

### 2. Composio Validates Lead Data
Composio queries Firebase staging and runs validation:

```javascript
// Composio reads unvalidated leads
const response = await fetch('http://localhost:3001/mcp/firebase_read', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collection: 'leads_staging',
    query: {
      where: [['validated', '==', false]],
      limit: 10
    }
  })
});

const { data } = await response.json();

// Validate each lead
for (const lead of data.docs) {
  let validationResult = {
    email_valid: validateEmail(lead.email),
    phone_valid: validatePhone(lead.phone),
    duplicate_check: await checkDuplicates(lead.email),
    enrichment_complete: await enrichLead(lead)
  };

  const isValid = Object.values(validationResult).every(v => v === true);

  // Update lead with validation results
  await fetch('http://localhost:3001/mcp/firebase_update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      collection: 'leads_staging',
      docId: lead.id,
      fields: {
        unique_id: lead.unique_id,
        process_id: `lead_validation.composio.${Date.now()}.complete`,
        timestamp_last_touched: Date.now(),
        validated: isValid,
        validation_results: validationResult,
        validation_completed_at: new Date().toISOString()
      }
    })
  });
}
```

### 3. Composio Promotes Validated Data to Neon
Once validated, Composio moves data from Firebase staging to Neon vault:

```javascript
// Query validated leads
const validatedLeads = await fetch('http://localhost:3001/mcp/firebase_read', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collection: 'leads_staging',
    query: {
      where: [['validated', '==', true], ['promoted_to_vault', '!=', true]],
      limit: 50
    }
  })
});

// Promote to Neon vault
for (const lead of validatedLeads.data.docs) {
  // Write to Neon via Composio
  await neonMCP.writeRecord('leads', {
    unique_id: lead.unique_id,
    process_id: `vault_promotion.${Date.now()}`,
    timestamp_last_touched: Date.now(),
    validated: true,

    // Clean lead data for vault
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    source: lead.source,
    campaign_id: lead.campaign_id,
    validation_results: lead.validation_results,

    // Vault metadata
    promoted_from_firebase_at: new Date().toISOString(),
    vault_status: 'active'
  });

  // Mark as promoted in Firebase staging
  await fetch('http://localhost:3001/mcp/firebase_update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      collection: 'leads_staging',
      docId: lead.id,
      fields: {
        unique_id: lead.unique_id,
        process_id: `staging_promotion.${Date.now()}`,
        timestamp_last_touched: Date.now(),
        validated: true,
        promoted_to_vault: true,
        promoted_at: new Date().toISOString()
      }
    })
  });
}
```

### 4. Analytics Data to BigQuery
Aggregated data flows to BigQuery for analytics:

```javascript
// Composio sends analytics data to BigQuery
await bigQueryMCP.writeAnalytics('lead_metrics', {
  date: new Date().toISOString().split('T')[0],
  total_leads: totalCount,
  validated_leads: validatedCount,
  promotion_rate: validatedCount / totalCount,
  sources: sourceBreakdown,
  campaigns: campaignBreakdown
});
```

## Firebase Studio App Example

### Studio App Registration
```javascript
// Register Studio app in Firebase
const studioApp = {
  unique_id: "studio_app_lead_intake_v2",
  process_id: "studio_registration.2025.lead_intake",
  timestamp_last_touched: Date.now(),
  validated: true,

  name: "Lead Intake Form",
  description: "Customer lead capture with real-time validation",
  github_repo: "company/lead-intake-studio",
  deployment_url: "https://leads.company.com",
  status: "active",

  _created_at: new Date().toISOString(),
  _created_by: "firebase_studio_deploy"
};

await fetch('http://localhost:3001/mcp/firebase_write', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collection: 'studio_apps',
    payload: studioApp
  })
});
```

### Studio App Deployment
```javascript
// Trigger deployment from GitHub
await fetch('http://localhost:3001/mcp/firebase_studio_deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appId: "studio_app_lead_intake_v2",
    githubRepo: "company/lead-intake-studio",
    branch: "production"
  })
});
```

## Barton Doctrine Compliance

### Required Schema Fields
Every Firebase document must include:
- `unique_id`: Globally unique identifier
- `process_id`: Process tracking identifier
- `timestamp_last_touched`: Unix timestamp
- `validated`: Boolean validation status

### Data Flow Principles
1. **Firebase = Staging Memory**: Temporary storage for validation
2. **Neon = Vault**: Permanent storage for validated data
3. **BigQuery = Silo**: Analytics and reporting data
4. **Composio = Orchestrator**: All agents go through Composio, no direct DB access

### Audit Trail
All operations are logged to `firebase_audit_log` collection:
```json
{
  "unique_id": "audit_abc123",
  "process_id": "firebase_mcp.write.1695123456789",
  "timestamp_last_touched": 1695123456789,
  "validated": true,
  "operation": "write",
  "collection": "leads_staging",
  "doc_id": "lead_doc_xyz",
  "result_status": "success",
  "timestamp": "2025-09-28T10:30:45.123Z",
  "source": "firebase_mcp_server"
}
```

## Environment Setup

### Required Environment Variables
```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Server Configuration
PORT=3001
```

### Installation
```bash
# Install dependencies
npm install firebase-admin express cors uuid dotenv

# Run Firebase MCP Server
npm start
```

### Testing
```bash
# Health check
curl http://localhost:3001/health

# List available tools
curl http://localhost:3001/

# Test write operation
curl -X POST http://localhost:3001/mcp/firebase_write \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "test_collection",
    "payload": {
      "unique_id": "test_001",
      "process_id": "test.workflow.001",
      "timestamp_last_touched": 1695123456789,
      "validated": false,
      "test_data": "Hello Firebase MCP"
    }
  }'
```

This example demonstrates the complete Barton Doctrine workflow with Firebase as staging memory, Composio as orchestrator, and proper data validation and promotion flows.