# DeepSeek + Composio MCP Integration Guide

## Overview

This guide explains how the DeepSeek Agent integrates with the Composio MCP server in the IMO Creator project, enabling seamless AI-powered development workflows across multiple services.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VS Code                                  │
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  DeepSeek Agent  │              │  Composio MCP    │        │
│  │  Extension       │◄────────────►│  Integration     │        │
│  └──────────────────┘              └──────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
           │                                    │
           │                                    │
           ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│  DeepSeek MCP Server │◄────────►│  Composio MCP Server │
│  Port: 7002          │  Relay   │  Port: 7001          │
└──────────────────────┘          └──────────────────────┘
           │                                    │
           │                                    │
           ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│  DeepSeek API        │          │  Builder.io API      │
│  (AI/Code)           │          │  HEIR Validation     │
└──────────────────────┘          └──────────────────────┘
```

## Configuration

### VS Code Settings (`.vscode/settings.json`)

Both MCP servers are configured in your VS Code settings:

```json
{
  "mcp.servers": {
    "imo-creator-composio": {
      "name": "IMO Creator Composio Bridge",
      "description": "Integrates Builder.io with composio MCP server",
      "command": "python",
      "args": ["src/mcp_server.py"],
      "cwd": "${workspaceFolder}",
      "env": {
        "BUILDER_IO_API_KEY": "${MCP:BUILDER_IO_API_KEY}",
        "MCP_SERVER_MODE": "vscode",
        "PORT": "7001"
      },
      "tools": [
        "builder_create_content",
        "builder_get_models",
        "builder_sync_designs",
        "heir_validate"
      ]
    },
    "deepseek-agent": {
      "name": "DeepSeek AI Agent",
      "description": "DeepSeek AI agent for intelligent code assistance",
      "command": "node",
      "args": ["${workspaceFolder}/extensions/deepseek-agent/src/mcpServer.js"],
      "cwd": "${workspaceFolder}",
      "env": {
        "DEEPSEEK_API_KEY": "${MCP:DEEPSEEK_API_KEY}",
        "MCP_SERVER_MODE": "vscode",
        "PORT": "7002",
        "COMPOSIO_MCP_URL": "http://localhost:7001",
        "ENABLE_COMPOSIO_INTEGRATION": "true"
      },
      "tools": [
        "deepseek_chat",
        "deepseek_code_completion",
        "deepseek_code_analysis",
        "deepseek_refactor",
        "deepseek_generate_tests"
      ]
    }
  },
  "mcp.enabledServers": ["imo-creator-composio", "deepseek-agent"]
}
```

## Integration Features

### 1. Cross-Server Communication

The DeepSeek MCP server can communicate with the Composio MCP server:

```javascript
// DeepSeek can relay messages to Composio
{
  "type": "relay",
  "forward_to_composio": true,
  "target": "builder_create_content",
  "payload": {
    "name": "Generated Component",
    "data": {...}
  }
}
```

### 2. Unified Workflow

Combine DeepSeek AI with Builder.io and HEIR validation:

```
User Request
    │
    ▼
DeepSeek generates code
    │
    ▼
Validate with HEIR (via Composio)
    │
    ▼
Create Builder.io content (via Composio)
    │
    ▼
Return result to user
```

### 3. Available Tools

#### DeepSeek Tools (Port 7002)
- `deepseek_chat` - AI chat conversations
- `deepseek_code_completion` - Code completion
- `deepseek_code_analysis` - Code analysis
- `deepseek_refactor` - Code refactoring
- `deepseek_generate_tests` - Test generation

#### Composio Tools (Port 7001)
- `builder_create_content` - Create Builder.io content
- `builder_get_models` - Get Builder.io models
- `builder_sync_designs` - Sync Figma designs
- `heir_validate` - HEIR validation

## Usage Examples

### Example 1: Generate Component with AI + Builder.io

```javascript
// Step 1: Use DeepSeek to generate component code
const ws = new WebSocket('ws://localhost:7002');

ws.send(JSON.stringify({
  type: 'chat',
  message: 'Generate a React button component with TypeScript',
  stream: false
}));

// Step 2: Forward to Composio to create in Builder.io
ws.send(JSON.stringify({
  type: 'relay',
  forward_to_composio: true,
  target: 'builder_create_content',
  payload: {
    name: 'AI Generated Button',
    data: {
      component: generatedCode
    }
  }
}));
```

### Example 2: Code Analysis + HEIR Validation

```javascript
// Analyze code with DeepSeek
ws.send(JSON.stringify({
  type: 'analyze',
  code: myCode,
  language: 'javascript',
  analysisType: 'security'
}));

// Validate with HEIR via Composio
fetch('http://localhost:7001/heir/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ssot: {
      meta: { app_name: 'MyApp' },
      doctrine: { ... }
    }
  })
});
```

### Example 3: VS Code Command Integration

Use both services from VS Code commands:

```javascript
// In VS Code
// 1. Select code
// 2. Right-click → "DeepSeek: Explain Code"
// 3. DeepSeek analyzes the code
// 4. Optionally sync to Builder.io via Composio
```

## Environment Variables

### DeepSeek Agent
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_ENDPOINT=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
COMPOSIO_MCP_URL=http://localhost:7001
ENABLE_COMPOSIO_INTEGRATION=true
```

### Composio MCP Server
```bash
BUILDER_IO_API_KEY=your_builder_api_key
BUILDER_IO_SPACE_ID=your_space_id
MCP_SERVER_MODE=vscode
PORT=7001
```

## API Endpoints

### DeepSeek MCP Server (Port 7002)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/info` | GET | Server information |
| `ws://localhost:7002` | WebSocket | Main communication |

### Composio MCP Server (Port 7001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/heir/check` | POST | HEIR validation |
| `/builder/create-content` | POST | Create Builder.io content |
| `/builder/models` | GET | Get Builder.io models |
| `/mcp/tools/builder_create_content` | POST | MCP tool endpoint |

## Message Protocol

### DeepSeek Messages

```javascript
// Chat
{
  "type": "chat",
  "message": "Your question",
  "stream": true
}

// Code Completion
{
  "type": "completion",
  "code": "function hello",
  "language": "javascript",
  "cursor": 14
}

// Code Analysis
{
  "type": "analyze",
  "code": "your code",
  "language": "javascript",
  "analysisType": "bugs" // or "performance", "security"
}

// Relay to Composio
{
  "type": "relay",
  "forward_to_composio": true,
  "target": "builder_create_content",
  "payload": { ... }
}
```

### Composio Messages

```javascript
// HEIR Validation
{
  "ssot": {
    "meta": { "app_name": "MyApp" },
    "doctrine": { ... }
  }
}

// Builder.io Content Creation
{
  "name": "Content Name",
  "data": { ... },
  "published": "draft"
}
```

## Integration Workflows

### Workflow 1: AI-Powered Component Generation

```
1. User: "Create a login form component"
   ↓
2. DeepSeek: Generates React component code
   ↓
3. HEIR: Validates component structure (via Composio)
   ↓
4. Builder.io: Creates visual component (via Composio)
   ↓
5. User: Receives complete component with validation
```

### Workflow 2: Code Review + Documentation

```
1. User: Selects code in VS Code
   ↓
2. DeepSeek: Analyzes code for issues
   ↓
3. DeepSeek: Generates documentation
   ↓
4. Builder.io: Creates documentation page (via Composio)
   ↓
5. User: Gets analysis + published docs
```

### Workflow 3: Design-to-Code Pipeline

```
1. Figma: Design created
   ↓
2. Composio: Syncs Figma design
   ↓
3. DeepSeek: Generates code from design
   ↓
4. HEIR: Validates generated code (via Composio)
   ↓
5. Builder.io: Publishes component (via Composio)
```

## Advanced Features

### 1. Bidirectional Communication

DeepSeek can send messages to Composio and receive responses:

```javascript
// DeepSeek → Composio
axios.post('http://localhost:7001/mcp/relay', {
  source: 'deepseek',
  action: 'validate',
  data: generatedCode
});

// Composio → DeepSeek
axios.post('http://localhost:7002/mcp/relay', {
  source: 'composio',
  action: 'enhance',
  data: validatedCode
});
```

### 2. Event Broadcasting

Both servers can broadcast events to all connected clients:

```javascript
// DeepSeek broadcasts code generation complete
deepseekServer.broadcast({
  type: 'event',
  event: 'code_generated',
  data: { code, language }
});

// Composio broadcasts validation complete
composioServer.broadcast({
  type: 'event',
  event: 'validation_complete',
  data: { valid, errors }
});
```

### 3. Shared Context

Both servers can share context for better integration:

```javascript
// DeepSeek stores context
const context = {
  currentFile: 'component.tsx',
  language: 'typescript',
  framework: 'react'
};

// Composio accesses context for validation
const heirCheck = await validateWithContext(code, context);
```

## Troubleshooting

### Issue 1: Servers Not Communicating

**Problem:** DeepSeek can't reach Composio

**Solution:**
```bash
# Check if Composio is running
curl http://localhost:7001/health

# Check DeepSeek configuration
echo $COMPOSIO_MCP_URL

# Verify both servers are running
ps aux | grep mcp_server
ps aux | grep mcpServer
```

### Issue 2: Port Conflicts

**Problem:** Port 7001 or 7002 already in use

**Solution:**
```bash
# Find process using port
lsof -i :7001
lsof -i :7002

# Kill process or change port in settings
# Update .vscode/settings.json with new ports
```

### Issue 3: API Keys Not Working

**Problem:** Authentication failures

**Solution:**
```bash
# Check environment variables
echo $DEEPSEEK_API_KEY
echo $BUILDER_IO_API_KEY

# Verify in VS Code settings
# Settings → Search "deepseek" or "builder"
```

## Best Practices

### 1. Error Handling

Always handle errors from both servers:

```javascript
try {
  const deepseekResponse = await deepseekChat(message);
  const composioValidation = await composioValidate(deepseekResponse);
  return { code: deepseekResponse, valid: composioValidation };
} catch (error) {
  console.error('Integration error:', error);
  // Fallback logic
}
```

### 2. Timeout Management

Set appropriate timeouts for cross-server calls:

```javascript
const response = await axios.post(composioUrl, data, {
  timeout: 5000 // 5 seconds
});
```

### 3. Message Validation

Validate messages before forwarding:

```javascript
if (payload && payload.forward_to_composio) {
  if (!payload.target || !payload.payload) {
    throw new Error('Invalid relay message format');
  }
  await forwardToComposio(payload);
}
```

## Testing Integration

### Test Script

```javascript
// test-integration.js
const WebSocket = require('ws');
const axios = require('axios');

async function testIntegration() {
  // Test DeepSeek
  console.log('Testing DeepSeek...');
  const deepseekHealth = await axios.get('http://localhost:7002/health');
  console.log('DeepSeek:', deepseekHealth.data);

  // Test Composio
  console.log('Testing Composio...');
  const composioHealth = await axios.get('http://localhost:7001/health');
  console.log('Composio:', composioHealth.data);

  // Test WebSocket
  console.log('Testing WebSocket...');
  const ws = new WebSocket('ws://localhost:7002');

  ws.on('open', () => {
    console.log('Connected to DeepSeek MCP');
    ws.send(JSON.stringify({
      type: 'chat',
      message: 'Hello from integration test'
    }));
  });

  ws.on('message', (data) => {
    console.log('Received:', JSON.parse(data));
    ws.close();
  });
}

testIntegration().catch(console.error);
```

Run the test:
```bash
node test-integration.js
```

## Monitoring

### Health Checks

```bash
# Check both servers
curl http://localhost:7001/health
curl http://localhost:7002/health

# Get server info
curl http://localhost:7001/info
curl http://localhost:7002/info
```

### Logs

```bash
# DeepSeek logs (VS Code Output panel)
# View → Output → Select "DeepSeek Agent"

# Composio logs
tail -f logs/composio-mcp.log
```

## Resources

- **DeepSeek API**: https://platform.deepseek.com/docs
- **Builder.io API**: https://www.builder.io/c/docs/api
- **MCP Specification**: https://modelcontextprotocol.io
- **HEIR Documentation**: See `sys/heir/` directory

## Summary

The DeepSeek + Composio integration provides:

✅ **Unified AI Development** - Combine AI code generation with visual development
✅ **Cross-Server Communication** - Seamless message relay between services
✅ **HEIR Validation** - Automatic code validation
✅ **Builder.io Integration** - Visual component creation
✅ **VS Code Native** - Works directly in your editor
✅ **Extensible** - Easy to add new integrations

This integration enables powerful workflows that combine the best of AI-powered code generation, visual development, and automated validation.

---

**Integration Status**: ✅ Active
**DeepSeek Port**: 7002
**Composio Port**: 7001
**Last Updated**: 2024
