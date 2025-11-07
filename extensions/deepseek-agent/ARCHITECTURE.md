# DeepSeek + Composio Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              VS Code IDE                                 │
│                                                                          │
│  ┌────────────────────────┐         ┌────────────────────────┐         │
│  │  DeepSeek Extension    │         │  Composio Extension    │         │
│  │  - Chat Interface      │         │  - Builder.io UI       │         │
│  │  - Code Actions        │         │  - HEIR Validation     │         │
│  │  - Context Menu        │         │  - Figma Sync          │         │
│  └───────────┬────────────┘         └───────────┬────────────┘         │
│              │                                   │                       │
│              │  MCP Protocol                     │  MCP Protocol         │
│              │                                   │                       │
└──────────────┼───────────────────────────────────┼───────────────────────┘
               │                                   │
               │                                   │
               ▼                                   ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│  DeepSeek MCP Server     │◄───────►│  Composio MCP Server     │
│  Port: 7002              │  Relay  │  Port: 7001              │
│                          │         │                          │
│  Capabilities:           │         │  Capabilities:           │
│  • AI Chat               │         │  • Builder.io API        │
│  • Code Completion       │         │  • HEIR Validation       │
│  • Code Analysis         │         │  • Figma Integration     │
│  • Refactoring           │         │  • Content Management    │
│  • Test Generation       │         │  • Design Sync           │
│  • Documentation         │         │  • Component Registry    │
│                          │         │                          │
│  Integration:            │         │  Integration:            │
│  • Composio Relay        │         │  • DeepSeek Aware        │
│  • Cross-Server Msgs     │         │  • AI Enhancement        │
│  • Context Sharing       │         │  • Validation Pipeline   │
└──────────┬───────────────┘         └──────────┬───────────────┘
           │                                     │
           │                                     │
           ▼                                     ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│  DeepSeek API            │         │  External Services       │
│  https://api.deepseek.com│         │                          │
│                          │         │  • Builder.io API        │
│  Models:                 │         │  • Figma API             │
│  • deepseek-chat         │         │  • HEIR Validator        │
│  • deepseek-coder        │         │  • Component Registry    │
└──────────────────────────┘         └──────────────────────────┘
```

## Message Flow

### Scenario 1: AI Code Generation with Validation

```
User Action: "Generate a login form component"
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. VS Code DeepSeek Extension                               │
│    - User types request in chat                             │
│    - Extension captures context (file, language, etc.)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. DeepSeek MCP Server (Port 7002)                          │
│    - Receives chat request via WebSocket                    │
│    - Prepares prompt with context                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DeepSeek API                                             │
│    - Processes request with deepseek-chat model             │
│    - Generates React login form component code              │
│    - Returns structured response                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DeepSeek MCP Server                                      │
│    - Receives generated code                                │
│    - Detects validation opportunity                         │
│    - Prepares relay message to Composio                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Composio MCP Server (Port 7001)                          │
│    - Receives relay message from DeepSeek                   │
│    - Extracts code for HEIR validation                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. HEIR Validator                                           │
│    - Validates component structure                          │
│    - Checks SSOT compliance                                 │
│    - Returns validation result                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Composio MCP Server                                      │
│    - Receives validation result                             │
│    - Optionally creates in Builder.io                       │
│    - Sends response back to DeepSeek                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. DeepSeek MCP Server                                      │
│    - Receives validation result                             │
│    - Combines with generated code                           │
│    - Sends complete response to VS Code                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. VS Code DeepSeek Extension                               │
│    - Displays generated code                                │
│    - Shows validation status                                │
│    - Provides Builder.io link (if created)                  │
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: Design-to-Code Pipeline

```
Figma Design Created
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Composio MCP Server                                      │
│    - Syncs Figma design via API                             │
│    - Extracts design tokens and structure                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Composio → DeepSeek Relay                                │
│    - Sends design data to DeepSeek                          │
│    - Includes component specifications                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DeepSeek MCP Server                                      │
│    - Receives design data                                   │
│    - Generates code from design                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DeepSeek API                                             │
│    - Processes design-to-code request                       │
│    - Generates React/Vue/etc. component                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. DeepSeek → Composio Relay                                │
│    - Sends generated code back to Composio                  │
│    - Includes metadata and context                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Composio MCP Server                                      │
│    - Validates with HEIR                                    │
│    - Creates in Builder.io                                  │
│    - Returns complete result                                │
└─────────────────────────────────────────────────────────────┘
```

## Data Structures

### DeepSeek Message Format

```javascript
// Chat Request
{
  "type": "chat",
  "message": "Generate a login form",
  "stream": false,
  "context": {
    "file": "components/Auth.tsx",
    "language": "typescript",
    "framework": "react"
  }
}

// Code Analysis Request
{
  "type": "analyze",
  "code": "function example() { ... }",
  "language": "javascript",
  "analysisType": "security"
}

// Relay to Composio
{
  "type": "relay",
  "forward_to_composio": true,
  "target": "heir_validate",
  "payload": {
    "ssot": { ... }
  }
}
```

### Composio Message Format

```javascript
// HEIR Validation
{
  "ssot": {
    "meta": {
      "app_name": "MyApp",
      "version": "1.0.0"
    },
    "doctrine": {
      "components": [ ... ]
    }
  }
}

// Builder.io Content Creation
{
  "name": "Login Form",
  "data": {
    "component": "...",
    "props": { ... }
  },
  "published": "draft"
}
```

## Integration Points

### 1. WebSocket Communication (DeepSeek)

```javascript
// Client connects to DeepSeek MCP
const ws = new WebSocket('ws://localhost:7002');

ws.on('open', () => {
  // Send chat request
  ws.send(JSON.stringify({
    type: 'chat',
    message: 'Generate code'
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  // Handle response
});
```

### 2. HTTP API (Composio)

```javascript
// HEIR validation
const response = await fetch('http://localhost:7001/heir/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ssot: { ... } })
});

// Builder.io content creation
const result = await fetch('http://localhost:7001/builder/create-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Component', data: { ... } })
});
```

### 3. Cross-Server Relay

```javascript
// DeepSeek relays to Composio
axios.post('http://localhost:7001/mcp/relay', {
  source: 'deepseek',
  action: 'validate',
  data: generatedCode
});

// Composio relays to DeepSeek
axios.post('http://localhost:7002/mcp/relay', {
  source: 'composio',
  action: 'enhance',
  data: validatedCode
});
```

## Configuration Files

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "mcp.servers": {
    "imo-creator-composio": {
      "name": "IMO Creator Composio Bridge",
      "command": "python",
      "args": ["src/mcp_server.py"],
      "env": {
        "BUILDER_IO_API_KEY": "${MCP:BUILDER_IO_API_KEY}",
        "PORT": "7001"
      }
    },
    "deepseek-agent": {
      "name": "DeepSeek AI Agent",
      "command": "node",
      "args": ["${workspaceFolder}/extensions/deepseek-agent/src/mcpServer.js"],
      "env": {
        "DEEPSEEK_API_KEY": "${MCP:DEEPSEEK_API_KEY}",
        "PORT": "7002",
        "COMPOSIO_MCP_URL": "http://localhost:7001",
        "ENABLE_COMPOSIO_INTEGRATION": "true"
      }
    }
  },
  "mcp.enabledServers": ["imo-creator-composio", "deepseek-agent"]
}
```

### Environment Variables (`.env`)

```bash
# DeepSeek Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_ENDPOINT=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=4096

# Composio Configuration
BUILDER_IO_API_KEY=your_builder_api_key
BUILDER_IO_SPACE_ID=your_space_id

# Integration Configuration
COMPOSIO_MCP_URL=http://localhost:7001
ENABLE_COMPOSIO_INTEGRATION=true

# Server Ports
DEEPSEEK_MCP_PORT=7002
COMPOSIO_MCP_PORT=7001
```

## Security Considerations

### 1. API Key Management

```
✅ Store in environment variables
✅ Use VS Code secret storage
✅ Never commit to version control
❌ Don't hardcode in source files
```

### 2. Cross-Server Communication

```
✅ Use localhost for development
✅ Implement authentication for production
✅ Validate all relay messages
❌ Don't expose servers publicly without auth
```

### 3. Data Privacy

```
✅ Sanitize code before sending to APIs
✅ Log only non-sensitive information
✅ Implement rate limiting
❌ Don't log API keys or tokens
```

## Performance Optimization

### 1. Caching Strategy

```javascript
// Cache DeepSeek responses
const cache = new Map();

async function getCachedResponse(prompt) {
  const key = hashPrompt(prompt);
  if (cache.has(key)) {
    return cache.get(key);
  }
  const response = await deepseekAPI.chat(prompt);
  cache.set(key, response);
  return response;
}
```

### 2. Connection Pooling

```javascript
// Reuse HTTP connections
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 10
});

axios.defaults.httpAgent = agent;
```

### 3. Streaming Responses

```javascript
// Stream large responses
ws.send(JSON.stringify({
  type: 'chat',
  message: 'Generate large component',
  stream: true  // Enable streaming
}));
```

## Monitoring and Debugging

### 1. Health Checks

```bash
# Check DeepSeek
curl http://localhost:7002/health

# Check Composio
curl http://localhost:7001/health

# Check integration
curl http://localhost:7002/info | jq '.integrations'
```

### 2. Logging

```javascript
// DeepSeek logs
console.log('[DeepSeek] Message received:', message.type);
console.log('[DeepSeek] Relaying to Composio:', payload);

// Composio logs
console.log('[Composio] Validation request:', ssot);
console.log('[Composio] Builder.io response:', result);
```

### 3. Error Tracking

```javascript
// Centralized error handling
function handleIntegrationError(error, context) {
  console.error('[Integration Error]', {
    message: error.message,
    context: context,
    timestamp: new Date().toISOString()
  });
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoring(error, context);
  }
}
```

## Deployment

### Development

```bash
# Terminal 1: Start Composio
python src/mcp_server.py

# Terminal 2: Start DeepSeek
cd extensions/deepseek-agent
npm run start:mcp

# Terminal 3: Run tests
npm run test:integration
```

### Production

```bash
# Use process manager (PM2)
pm2 start src/mcp_server.py --name composio-mcp
pm2 start extensions/deepseek-agent/src/mcpServer.js --name deepseek-mcp

# Monitor
pm2 status
pm2 logs
```

## Troubleshooting Guide

### Issue: Servers can't communicate

**Symptoms:**
- DeepSeek can't reach Composio
- Relay messages fail
- Integration tests fail

**Solutions:**
```bash
# 1. Check if both servers are running
ps aux | grep mcp

# 2. Verify ports are open
lsof -i :7001
lsof -i :7002

# 3. Check firewall rules
sudo ufw status

# 4. Test connectivity
curl http://localhost:7001/health
curl http://localhost:7002/health
```

### Issue: API authentication fails

**Symptoms:**
- 401 Unauthorized errors
- API key not found errors

**Solutions:**
```bash
# 1. Check environment variables
echo $DEEPSEEK_API_KEY
echo $BUILDER_IO_API_KEY

# 2. Verify VS Code settings
# Settings → Search "deepseek" or "builder"

# 3. Restart VS Code
# File → Reload Window
```

### Issue: Messages not relaying

**Symptoms:**
- DeepSeek generates code but doesn't validate
- Composio doesn't receive relay messages

**Solutions:**
```javascript
// 1. Check relay configuration
console.log(process.env.COMPOSIO_MCP_URL);
console.log(process.env.ENABLE_COMPOSIO_INTEGRATION);

// 2. Verify message format
const message = {
  type: 'relay',
  forward_to_composio: true,  // Must be true
  target: 'heir_validate',
  payload: { ... }
};

// 3. Check Composio relay endpoint
curl -X POST http://localhost:7001/mcp/relay \
  -H "Content-Type: application/json" \
  -d '{"source":"deepseek","action":"test"}'
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
