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
| **Hostname** | srv1153077.hstgr.cloud |
| **IP Address** | 72.61.65.44 |
| **OS** | Ubuntu 24.04 with n8n |
| **Plan** | KVM 2 |
| **CPU** | 2 cores |
| **Memory** | 8 GB |
| **Disk** | 100 GB |
| **Location** | United States - Boston |
| **N8N URL** | https://srv1153077.hstgr.cloud:5678 |

## Setup Instructions

### 1. Credentials Already in Doppler

The following secrets are already configured in Doppler:
- `HOSTINGER_API_TOKEN`
- `N8N_HOSTINGER_URL`
- `N8N_HOSTINGER_HOST`
- `N8N_HOSTINGER_IP`

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

If you want to use via Composio's custom tools:

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
    data: {
      vps_id: 'your_vps_id'
    },
    unique_id: 'HEIR-2025-12-HOST-STATUS-01',
    process_id: 'PRC-HOST-001',
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

### Restart VPS
```javascript
const response = await fetch('http://localhost:3001/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'HOSTINGER_VPS_RESTART',
    data: {
      vps_id: 'your_vps_id'
    },
    unique_id: 'HEIR-2025-12-HOST-RESTART-01',
    process_id: 'PRC-HOST-002',
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

## N8N Integration

Your N8N instance is hosted on this VPS. To access:

- **URL**: https://srv1153077.hstgr.cloud:5678
- **Webhook Base**: https://srv1153077.hstgr.cloud:5678/webhook/

### Triggering N8N Workflows

```bash
# Example: Trigger a webhook workflow
curl -X POST "https://srv1153077.hstgr.cloud:5678/webhook/your-webhook-id" \
  -H "Content-Type: application/json" \
  -d '{"data": "your_payload"}'
```

## Files

- `integrations.yaml` - Composio integration configuration
- `README.md` - This documentation

## Troubleshooting

### N8N Not Accessible
1. Check if VPS is running: Use `HOSTINGER_VPS_STATUS`
2. Restart if needed: Use `HOSTINGER_VPS_RESTART`
3. Check firewall: Ensure port 5678 is open
4. SSH into server: `ssh root@72.61.65.44`

### SSL Issues
1. Check SSL status: Use `HOSTINGER_SSL_STATUS`
2. Reinstall if needed: Use `HOSTINGER_SSL_INSTALL`

## Resources

- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps)
- [N8N Self-Hosting Guide](https://docs.n8n.io/hosting/)
- [Hostinger API MCP](https://www.npmjs.com/package/hostinger-api-mcp)
