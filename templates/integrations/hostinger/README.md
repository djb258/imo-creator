# Hostinger Custom Integration for Composio

**Doctrine ID**: 04.04.13
**Status**: Active
**Created**: 2025-12-01

## Overview

This integration connects Hostinger VPS management to Composio, enabling:
- VPS instance management (start/stop/restart)
- N8N workflow hosting on Hostinger VPS
- Domain and DNS management
- SSL certificate management

## Current VPS Configuration

| Property | Value |
|----------|-------|
| **Hostname** | [VPS_HOSTNAME] |
| **IP Address** | [VPS_IP_ADDRESS] |
| **OS** | Ubuntu 24.04 with n8n |
| **Plan** | KVM 2 |
| **CPU** | 2 cores |
| **Memory** | 8 GB |
| **Disk** | 100 GB |
| **Location** | United States - Boston |
| **N8N URL** | https://[VPS_HOSTNAME]:5678 |

## Setup Instructions

### 1. Add Secrets to Doppler

```bash
doppler secrets set HOSTINGER_API_TOKEN="your_api_token" --config dev
doppler secrets set HOSTINGER_API_TOKEN="your_api_token" --config stg
doppler secrets set HOSTINGER_API_TOKEN="your_api_token" --config prd

doppler secrets set N8N_HOSTINGER_URL="https://[VPS_HOSTNAME]:5678" --config dev
doppler secrets set N8N_HOSTINGER_URL="https://[VPS_HOSTNAME]:5678" --config stg
doppler secrets set N8N_HOSTINGER_URL="https://[VPS_HOSTNAME]:5678" --config prd
```

### 2. Using the MCP Server (Recommended)

Add to your Claude Desktop or MCP client configuration:

```json
{
  "mcpServers": {
    "hostinger": {
      "command": "npx",
      "args": ["hostinger-api-mcp@latest"],
      "env": {
        "API_TOKEN": "${HOSTINGER_API_TOKEN}"
      }
    }
  }
}
```

### 3. Import to Composio (Optional)

```bash
# Via Composio CLI
composio add-custom-tool --file integrations.yaml

# Or via API
curl -X POST https://backend.composio.dev/api/v3/tools/custom \
  -H "x-api-key: YOUR_COMPOSIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d @integrations.yaml
```

## Available Tools

| Tool | Description |
|------|-------------|
| `HOSTINGER_VPS_LIST` | List all VPS instances |
| `HOSTINGER_VPS_STATUS` | Get VPS status |
| `HOSTINGER_VPS_START` | Start VPS instance |
| `HOSTINGER_VPS_STOP` | Stop VPS instance |
| `HOSTINGER_VPS_RESTART` | Restart VPS instance |
| `HOSTINGER_DOMAIN_LIST` | List all domains |
| `HOSTINGER_DOMAIN_DNS` | Get DNS records |
| `HOSTINGER_DNS_MANAGE` | Update DNS records |
| `HOSTINGER_SSL_STATUS` | Get SSL status |
| `HOSTINGER_SSL_INSTALL` | Install SSL certificate |

## Usage Examples

### Check VPS Status
```javascript
const response = await fetch('http://localhost:3001/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'HOSTINGER_VPS_STATUS',
    data: { vps_id: 'your_vps_id' },
    unique_id: 'HEIR-2025-12-HOST-STATUS-01',
    process_id: 'PRC-HOST-001',
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

## N8N Integration

Your N8N instance is hosted on this VPS:
- **URL**: https://[VPS_HOSTNAME]:5678
- **Webhook Base**: https://[VPS_HOSTNAME]:5678/webhook/

## Resources

- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps)
- [N8N Self-Hosting Guide](https://docs.n8n.io/hosting/)
- [Hostinger API MCP](https://www.npmjs.com/package/hostinger-api-mcp)
