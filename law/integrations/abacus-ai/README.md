# Abacus.AI Custom Integration for Composio

**Doctrine ID**: 04.04.14
**Status**: Active
**Created**: 2025-12-01

## Overview

This custom integration connects Abacus.AI's enterprise AI platform to Composio, enabling:
- Custom AI agent creation and management
- ML model deployment and predictions
- AI workflow automation
- Predictive analytics

## Setup Instructions

### 1. Add API Key to Doppler

```bash
doppler secrets set ABACUS_AI_API_KEY="your_api_key_here" --config dev
doppler secrets set ABACUS_AI_API_KEY="your_api_key_here" --config stg
doppler secrets set ABACUS_AI_API_KEY="your_api_key_here" --config prd
```

### 2. Import to Composio

#### Option A: Via Composio Dashboard
1. Go to [Composio Dashboard](https://app.composio.dev)
2. Navigate to **Tools** → **Custom Tools**
3. Click **Import from YAML**
4. Upload `integrations.yaml` from this directory

#### Option B: Via Composio CLI
```bash
composio add-custom-tool --file integrations.yaml
```

#### Option C: Via API
```bash
curl -X POST https://backend.composio.dev/api/v3/tools/custom \
  -H "x-api-key: YOUR_COMPOSIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d @integrations.yaml
```

## Available Tools

| Tool | Description |
|------|-------------|
| `ABACUS_LIST_AGENTS` | List all AI agents |
| `ABACUS_CREATE_AGENT` | Create new AI agent |
| `ABACUS_RUN_AGENT` | Execute an agent |
| `ABACUS_LIST_MODELS` | List deployed models |
| `ABACUS_DEPLOY_MODEL` | Deploy a model |
| `ABACUS_PREDICT` | Get predictions |
| `ABACUS_GET_PREDICTIONS` | Get batch predictions |
| `ABACUS_LIST_WORKFLOWS` | List workflows |
| `ABACUS_CREATE_WORKFLOW` | Create workflow |
| `ABACUS_RUN_WORKFLOW` | Execute workflow |
| `ABACUS_GET_WORKFLOW_STATUS` | Check workflow status |

## Usage Examples

### List Agents
```javascript
const response = await fetch('http://localhost:3001/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'ABACUS_LIST_AGENTS',
    data: {},
    unique_id: 'HEIR-2025-12-ABACUS-LIST-01',
    process_id: 'PRC-ABACUS-001',
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

### Run an Agent
```javascript
const response = await fetch('http://localhost:3001/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'ABACUS_RUN_AGENT',
    data: {
      agent_id: 'your_agent_id',
      input: {
        query: 'What is the revenue forecast for Q1 2026?'
      }
    },
    unique_id: 'HEIR-2025-12-ABACUS-RUN-01',
    process_id: 'PRC-ABACUS-002',
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

### Get Predictions
```javascript
const response = await fetch('http://localhost:3001/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'ABACUS_PREDICT',
    data: {
      deployment_id: 'your_deployment_id',
      data: {
        feature1: 100,
        feature2: 'category_a'
      }
    },
    unique_id: 'HEIR-2025-12-ABACUS-PREDICT-01',
    process_id: 'PRC-ABACUS-003',
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

## Integration with N8N (Hostinger)

You can also use Abacus.AI directly in your N8N workflows on Hostinger:

1. Add an **HTTP Request** node
2. Set method to `POST` or `GET` based on the action
3. URL: `https://api.abacus.ai/v0/{endpoint}`
4. Headers: `X-API-Key: {{$env.ABACUS_AI_API_KEY}}`

## Resources

- [Abacus.AI Documentation](https://abacus.ai/help)
- [Abacus.AI API Reference](https://abacus.ai/help/api)
- [Composio Custom Tools Guide](https://docs.composio.dev/introduction/foundations/components/integrations/custom-integration)
