# Neon MCP Server

Database operations MCP server with built-in HEIR/ORBT compliance.

## Quick Start

```bash
# Install dependencies
cd mcp-servers/neon-mcp
npm install

# Set environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Start server
npm start
```

## Usage

### Basic Database Operations

```javascript
// Select data
POST /select
{
  "table": "users",
  "conditions": { "active": true }
}

// Insert data  
POST /insert
{
  "table": "users",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  }
}

// Update data
POST /update
{
  "table": "users",
  "data": { "last_login": "2024-12-29T10:30:00Z" },
  "conditions": { "id": 123 }
}

// Delete data (requires conditions for safety)
POST /delete
{
  "table": "users",
  "conditions": { "id": 123, "active": false }
}
```

### MCP Protocol

```javascript
// Full MCP execution
POST /execute
{
  "operation": "select",
  "table": "users", 
  "conditions": { "department": "engineering" }
}
```

## Health & Monitoring

- `GET /mcp/health` - JSON health status
- `GET /mcp/status` - Visual dashboard  
- `GET /mcp/kill-switch/status` - Emergency controls

## Security Features

- ✅ HEIR unique ID tracking
- ✅ ORBT Layer 4 authorization (Senior Developer)
- ✅ Automatic Mantis logging
- ✅ SQL injection prevention
- ✅ Dangerous operation blocking (DROP, TRUNCATE)
- ✅ Emergency kill switch support

## Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname  # Required
PORT=3001                                             # Optional
MCP_KILL_SWITCH=true                                  # Emergency disable
NODE_ENV=production                                   # Optional
```

## Deploy to Render

1. Connect this repo to Render
2. Set service root directory: `mcp-servers/neon-mcp`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add DATABASE_URL environment variable

## Emergency Commands

```bash
# Check kill switch status
npm run kill-switch status

# Emergency disable all MCP tools
npm run kill-switch activate "Database emergency"

# Re-enable after resolution
npm run kill-switch deactivate "Emergency resolved"
```

Built with [MCP Doctrine Layer](../../mcp-doctrine-layer/README.md) compliance.