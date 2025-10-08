# MCP Global Configuration System

This directory contains the global MCP (Model Context Protocol) configuration that can be used across multiple repositories and projects.

## Files

- **`mcp_endpoints.json`**: Global configuration defining all available MCP servers and their endpoints
- **`../utils/mcp_config_loader.py`**: Python utility for loading and using the global config

## Purpose

This system enables:
- **Cross-repository MCP access**: Any project can reference the same MCP server configurations
- **Centralized endpoint management**: Update endpoints in one place, used everywhere
- **Automatic LLM integration**: LLMs can fetch this config and auto-configure MCP access
- **Environment-based authentication**: Secure token management via environment variables

## Available MCP Servers

### neon-db
- **Description**: Neon database operations (queries, schema, inserts)
- **Endpoint**: `http://localhost:3001/tool`
- **Auth**: `NEON_API_KEY` environment variable

### apify-scraper
- **Description**: Web scraping via Apify actors for data enrichment
- **Endpoint**: `http://localhost:3001/tool`
- **Auth**: `APIFY_API_TOKEN` environment variable

### email-verifier
- **Description**: Email validation via MillionVerify
- **Endpoint**: `http://localhost:3001/tool`
- **Auth**: `MILLIONVERIFY_API_KEY` environment variable

### github-agent
- **Description**: GitHub operations (repos, commits, issues)
- **Endpoint**: `http://localhost:3001/tool`
- **Auth**: `GITHUB_TOKEN` environment variable

## Usage Examples

### Python Integration

```python
from utils.mcp_config_loader import mcp_config, call_mcp_tool

# Load configuration
config = mcp_config.load_config()

# Get specific server URL
neon_url = mcp_config.get_server_url('neon-db')

# Build headers for authenticated requests
headers = mcp_config.build_headers('neon-db')

# Call an MCP tool directly
result = call_mcp_tool('neon-db', 'execute_query', {
    'query': 'SELECT * FROM users LIMIT 10'
})
```

### Direct HTTP Calls

```bash
# List available tools for a server
curl -H "Authorization: Bearer $NEON_API_KEY" \
     http://localhost:3001/mcp/tools

# Execute a specific tool
curl -X POST \
     -H "Authorization: Bearer $NEON_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"query": "SELECT * FROM users"}' \
     http://localhost:3001/tool
```

### LLM Auto-Configuration

LLMs can fetch the config directly:

```javascript
// Fetch global config
const response = await fetch('https://raw.githubusercontent.com/your-username/imo-creator/main/config/mcp_endpoints.json');
const config = await response.json();

// Auto-configure MCP access
config.mcp_servers.forEach(server => {
    console.log(`Available: ${server.name} at ${server.url}`);
});
```

## Environment Variables Required

Set these environment variables for full functionality:

```bash
export NEON_API_KEY="your_neon_key"
export APIFY_API_TOKEN="your_apify_token"
export MILLIONVERIFY_API_KEY="your_million_verify_key"
export GITHUB_TOKEN="your_github_token"
```

## Configuration Updates

To add a new MCP server:

1. Add entry to `mcp_endpoints.json`
2. Deploy the new MCP server to the mcpo proxy
3. Update documentation
4. Push changes to GitHub

Other repositories will automatically pick up the new configuration within the cache duration (1 hour by default).

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Repository A  │    │  Global Config   │    │   Repository B  │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │  mcp_endpoints   │    │ ┌─────────────┐ │
│ │config_loader├─┼────┤     .json        ├────┼─┤config_loader│ │
│ └─────────────┘ │    │                  │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌──────────────────┐
                    │  MCPO Proxy      │
                    │  (Render)        │
                    │                  │
                    │  ┌─────────────┐ │
                    │  │ MCP Servers │ │
                    │  └─────────────┘ │
                    └──────────────────┘
```

## Benefits

- **DRY Principle**: Define MCP endpoints once, use everywhere
- **Automatic Updates**: Changes propagate to all consuming projects
- **Environment Flexibility**: Easy switching between dev/staging/prod
- **LLM Integration**: Enables automatic tool discovery and usage
- **Caching**: Reduces network calls with intelligent caching
- **Fallback Handling**: Graceful degradation when remote config unavailable