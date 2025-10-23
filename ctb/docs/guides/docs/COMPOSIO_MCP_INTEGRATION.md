# Composio MCP Integration Guide

Complete guide for interacting with Composio endpoints through the MCP (Model Context Protocol) server. This documentation ensures consistent integration across all repositories and deployments.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Endpoint Reference](#endpoint-reference)
- [Usage Examples](#usage-examples)
- [Integration Patterns](#integration-patterns)
- [Troubleshooting](#troubleshooting)
- [Auto-Deployment](#auto-deployment)

## Overview

The Composio MCP integration provides access to 100+ service integrations through a unified API interface. This system uses Composio's native backend endpoints for maximum reliability and performance.

### Key Features
- **Native Composio API Access**: Direct connection to `backend.composio.dev`
- **100+ Service Integrations**: GitHub, Gmail, Slack, Linear, Notion, and more
- **Bearer Token Authentication**: Using Composio API keys with X-API-Key headers
- **Auto-Discovery**: LLMs can automatically discover and use available tools
- **Cross-Repository Compatibility**: Global configuration shared across projects

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   LLM Client    │────▶│   MCP Bridge     │────▶│  Composio Backend   │
│  (Claude, etc)  │     │  (REST Wrapper)  │     │ (backend.composio.  │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │   IDE Client     │
                        │ (Claude Code)    │
                        └──────────────────┘
```

### Dual Environment Strategy
1. **LLM Environment**: REST API wrapper (mcpo) for OpenAI-compatible LLMs
2. **IDE Environment**: Direct MCP protocol for Claude Code and development tools

## Configuration

### Global Configuration File
Located at: `config/mcp_endpoints.json`

```json
{
  "metadata": {
    "version": "2.1",
    "last_updated": "2025-10-05T13:17:00Z",
    "base_url": "https://backend.composio.dev",
    "description": "Direct Composio API Integration - Native access to Composio's MCP tools and integrations",
    "proxy_type": "composio-native",
    "deployment_platform": "Composio Cloud",
    "global_config": true
  },
  "mcp_servers": [
    {
      "name": "composio-universal",
      "description": "Universal Composio integration hub providing 100+ tools and services",
      "url": "https://backend.composio.dev/api/v1",
      "openapi_spec": "https://backend.composio.dev/openapi.json",
      "docs_url": "https://docs.composio.dev",
      "health_check": "https://backend.composio.dev/health",
      "auth": {
        "type": "bearer",
        "token": "<your-composio-api-key>",
        "header_name": "X-API-Key",
        "format": "{token}"
      },
      "endpoints": {
        "tools": "https://backend.composio.dev/api/v1/tools",
        "actions": "https://backend.composio.dev/api/v1/actions",
        "execute": "https://backend.composio.dev/api/v1/actions/execute",
        "apps": "https://backend.composio.dev/api/v1/apps",
        "connections": "https://backend.composio.dev/api/v1/connections"
      },
      "capabilities": [
        "github_integration",
        "gmail_integration",
        "slack_integration",
        "linear_integration",
        "notion_integration",
        "calendar_integration",
        "database_operations",
        "web_scraping",
        "email_validation",
        "100+ other integrations"
      ]
    }
  ]
}
```

### Environment Variables
```bash
# Required for all Composio operations
COMPOSIO_API_KEY=<your-composio-api-key>

# Optional: Override default endpoints
COMPOSIO_BASE_URL=https://backend.composio.dev
COMPOSIO_API_VERSION=v1
```

## Authentication

### Bearer Token Format
```http
X-API-Key: <your-composio-api-key>
Content-Type: application/json
```

### Token Validation
The API key `<your-composio-api-key>` provides access to:
- All Composio tools and integrations
- Tool execution capabilities
- Connection management
- App discovery and configuration

### Security Best Practices
- Never commit API keys to repositories
- Use environment variables for token storage
- Validate token freshness before deployment
- Monitor API usage and quotas

## Endpoint Reference

### Base URL
```
https://backend.composio.dev/api/v1
```

### Core Endpoints

#### 1. Health Check
```http
GET https://backend.composio.dev/health
```
**Response**: Server status and availability

#### 2. List Available Tools
```http
GET https://backend.composio.dev/api/v1/tools
Headers:
  X-API-Key: <your-composio-api-key>
```
**Response**: Array of all available Composio tools

#### 3. List Available Apps
```http
GET https://backend.composio.dev/api/v1/apps
Headers:
  X-API-Key: <your-composio-api-key>
```
**Response**: Array of supported applications and services

#### 4. Execute Action
```http
POST https://backend.composio.dev/api/v1/actions/execute
Headers:
  X-API-Key: <your-composio-api-key>
  Content-Type: application/json

Body:
{
  "actionId": "github_create_issue",
  "params": {
    "owner": "username",
    "repo": "repository",
    "title": "Issue title",
    "body": "Issue description"
  }
}
```

#### 5. Manage Connections
```http
GET https://backend.composio.dev/api/v1/connections
Headers:
  X-API-Key: <your-composio-api-key>
```

## Usage Examples

### Python Integration
```python
import requests
import json

class ComposioMCPClient:
    def __init__(self, api_key="<your-composio-api-key>"):
        self.base_url = "https://backend.composio.dev/api/v1"
        self.headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json"
        }

    def list_tools(self):
        """Get all available Composio tools"""
        response = requests.get(f"{self.base_url}/tools", headers=self.headers)
        return response.json()

    def execute_action(self, action_id, params):
        """Execute a specific Composio action"""
        payload = {
            "actionId": action_id,
            "params": params
        }
        response = requests.post(
            f"{self.base_url}/actions/execute",
            headers=self.headers,
            json=payload
        )
        return response.json()

    def get_apps(self):
        """List all supported applications"""
        response = requests.get(f"{self.base_url}/apps", headers=self.headers)
        return response.json()

# Usage
client = ComposioMCPClient()

# List available tools
tools = client.list_tools()
print(f"Available tools: {len(tools)}")

# Create GitHub issue
result = client.execute_action("github_create_issue", {
    "owner": "myusername",
    "repo": "myrepo",
    "title": "New feature request",
    "body": "Description of the feature"
})
```

### JavaScript/Node.js Integration
```javascript
const axios = require('axios');

class ComposioMCPClient {
    constructor(apiKey = '<your-composio-api-key>') {
        this.baseURL = 'https://backend.composio.dev/api/v1';
        this.headers = {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json'
        };
    }

    async listTools() {
        const response = await axios.get(`${this.baseURL}/tools`, {
            headers: this.headers
        });
        return response.data;
    }

    async executeAction(actionId, params) {
        const response = await axios.post(
            `${this.baseURL}/actions/execute`,
            { actionId, params },
            { headers: this.headers }
        );
        return response.data;
    }

    async getApps() {
        const response = await axios.get(`${this.baseURL}/apps`, {
            headers: this.headers
        });
        return response.data;
    }
}

// Usage
const client = new ComposioMCPClient();

async function example() {
    try {
        // List available tools
        const tools = await client.listTools();
        console.log(`Available tools: ${tools.length}`);

        // Send email via Gmail
        const result = await client.executeAction('gmail_send_email', {
            to: 'recipient@example.com',
            subject: 'Test email',
            body: 'This is a test email sent via Composio MCP'
        });

        console.log('Email sent:', result);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}
```

### cURL Examples
```bash
# List available tools
curl -X GET "https://backend.composio.dev/api/v1/tools" \
  -H "X-API-Key: <your-composio-api-key>"

# Execute GitHub action
curl -X POST "https://backend.composio.dev/api/v1/actions/execute" \
  -H "X-API-Key: <your-composio-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "actionId": "github_create_issue",
    "params": {
      "owner": "myusername",
      "repo": "myrepo",
      "title": "API Integration Issue",
      "body": "Testing Composio API integration"
    }
  }'

# List supported apps
curl -X GET "https://backend.composio.dev/api/v1/apps" \
  -H "X-API-Key: <your-composio-api-key>"
```

## Integration Patterns

### 1. Auto-Discovery Pattern
```python
def setup_composio_integration():
    """Auto-discover and configure Composio tools"""
    config_url = "https://raw.githubusercontent.com/djb258/imo-creator/main/config/mcp_endpoints.json"

    # Fetch latest configuration
    config = requests.get(config_url).json()

    # Extract Composio servers
    composio_servers = [
        server for server in config['mcp_servers']
        if 'composio' in server['name'].lower()
    ]

    return composio_servers
```

### 2. Health Monitoring Pattern
```python
def validate_composio_health():
    """Check Composio endpoint health before operations"""
    health_url = "https://backend.composio.dev/health"

    try:
        response = requests.get(health_url, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False
```

### 3. Retry Pattern with Exponential Backoff
```python
import time
import random

def execute_with_retry(action_id, params, max_retries=3):
    """Execute Composio action with retry logic"""
    client = ComposioMCPClient()

    for attempt in range(max_retries):
        try:
            return client.execute_action(action_id, params)
        except requests.RequestException as e:
            if attempt == max_retries - 1:
                raise e

            # Exponential backoff with jitter
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait_time)
```

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
**Error**: `401 Unauthorized` or `403 Forbidden`
**Solution**:
- Verify API key is correct: `<your-composio-api-key>`
- Check header format: `X-API-Key: {token}`
- Ensure no extra spaces or characters in token

#### 2. Connection Timeouts
**Error**: `Connection timeout` or `503 Service Unavailable`
**Solution**:
- Check endpoint URL: `https://backend.composio.dev`
- Verify network connectivity
- Implement retry logic with exponential backoff

#### 3. Invalid Action IDs
**Error**: `400 Bad Request - Unknown action`
**Solution**:
- List available tools: `GET /api/v1/tools`
- Verify action ID format and spelling
- Check action parameters against documentation

#### 4. Rate Limiting
**Error**: `429 Too Many Requests`
**Solution**:
- Implement request throttling
- Add delays between API calls
- Monitor usage quotas

### Validation Script
Use the provided validation script to test configuration:
```bash
cd imo-creator
python scripts/validate_mcp_config.py
python scripts/test_mcp_endpoints.py
```

### Debugging Checklist
1. ✅ API key format: `<your-composio-api-key>`
2. ✅ Base URL: `https://backend.composio.dev`
3. ✅ Header format: `X-API-Key: {token}`
4. ✅ Content-Type: `application/json`
5. ✅ Network connectivity to backend.composio.dev
6. ✅ Valid action IDs and parameters
7. ✅ Proper error handling and retries

## Auto-Deployment

### Doctrine Branch Integration
The `composio-mcp-config` doctrine branch ensures every new repository automatically receives:
- Latest Composio MCP configuration
- Updated API endpoints and tokens
- Validation and testing scripts
- Comprehensive documentation

### Configuration in imo.config.json
```json
{
  "doctrine_branches": {
    "composio-mcp-config": {
      "description": "Latest Composio MCP configuration with native API endpoints",
      "source_branch": "master",
      "copy_strategy": "overwrite_always",
      "auto_include": true,
      "required": true,
      "when_copy": ["repo_creation", "deployment", "update"],
      "auto_triggers": [
        "on_composio_token_update",
        "on_endpoint_change",
        "on_config_validation_failure"
      ]
    }
  }
}
```

### Files Auto-Copied to New Repositories
1. `config/mcp_endpoints.json` - Main configuration
2. `config/mcp_registry.json` - Tool registry
3. `utils/mcp_config_loader.py` - Python utility
4. `scripts/validate_mcp_config.py` - Validation script
5. `scripts/test_mcp_endpoints.py` - Testing script
6. `docs/COMPOSIO_MCP_INTEGRATION.md` - This documentation

### Benefits
- **Zero Configuration**: New repos work immediately
- **Always Updated**: Latest tokens and endpoints
- **Consistent Integration**: Same patterns across projects
- **Automatic Validation**: Pre-deployment checks
- **Cross-Repository Compatibility**: Shared global config

## Advanced Usage

### Custom Tool Creation
```python
def create_custom_tool(name, description, parameters):
    """Register custom tool with Composio"""
    client = ComposioMCPClient()

    tool_config = {
        "name": name,
        "description": description,
        "parameters": parameters,
        "type": "custom"
    }

    return client.execute_action("create_custom_tool", tool_config)
```

### Batch Operations
```python
def batch_execute_actions(actions):
    """Execute multiple Composio actions in sequence"""
    client = ComposioMCPClient()
    results = []

    for action in actions:
        try:
            result = client.execute_action(action['id'], action['params'])
            results.append({"success": True, "data": result})
        except Exception as e:
            results.append({"success": False, "error": str(e)})

    return results
```

### Connection Management
```python
def manage_app_connections():
    """List and manage application connections"""
    client = ComposioMCPClient()

    # List existing connections
    connections = client.get('/connections')

    # Check connection status
    for conn in connections:
        status = client.execute_action("check_connection_status", {
            "connectionId": conn['id']
        })
        print(f"Connection {conn['app']}: {status}")
```

---

## Summary

This documentation provides everything needed for consistent Composio MCP integration across all repositories. The auto-deployment system ensures that new projects automatically receive the latest configuration, eliminating the need to "reinvent the wheel" for each implementation.

**Key Points**:
- Use `backend.composio.dev` for all endpoints
- Always include `X-API-Key: <your-composio-api-key>` header
- Implement proper error handling and retries
- Validate configuration before deployment
- Test endpoints after deployment

For questions or issues, refer to the troubleshooting section or run the provided validation scripts.