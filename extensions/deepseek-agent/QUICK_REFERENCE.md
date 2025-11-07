# DeepSeek + Composio Quick Reference

## 🚀 Quick Start

```bash
# 1. Start Composio MCP Server
python src/mcp_server.py

# 2. Start DeepSeek MCP Server
cd extensions/deepseek-agent && npm run start:mcp

# 3. Test Integration
npm run test:integration
```

## 📡 Server Endpoints

### DeepSeek (Port 7002)
| Endpoint | Type | Description |
|----------|------|-------------|
| `ws://localhost:7002` | WebSocket | Main communication |
| `GET /health` | HTTP | Health check |
| `GET /info` | HTTP | Server info + integration status |

### Composio (Port 7001)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /health` | HTTP | Health check |
| `GET /` | HTTP | Server info |
| `POST /heir/check` | HTTP | HEIR validation |
| `POST /builder/create-content` | HTTP | Create Builder.io content |
| `GET /builder/models` | HTTP | Get Builder.io models |

## 💬 Message Types

### DeepSeek Messages

```javascript
// Chat
{ type: "chat", message: "Your question", stream: false }

// Code Completion
{ type: "completion", code: "function hello", language: "javascript", cursor: 14 }

// Code Analysis
{ type: "analyze", code: "...", language: "javascript", analysisType: "bugs" }

// Relay to Composio
{ type: "relay", forward_to_composio: true, target: "heir_validate", payload: {...} }

// Ping
{ type: "ping" }
```

### Composio Messages

```javascript
// HEIR Validation
{ ssot: { meta: {...}, doctrine: {...} } }

// Builder.io Content
{ name: "Component", data: {...}, published: "draft" }
```

## 🎯 VS Code Commands

### DeepSeek
- `Ctrl+Shift+D` (Mac: `Cmd+Shift+D`) - Open chat
- `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`) - Explain code
- Right-click → DeepSeek menu

### Composio
- `/mcp.imo-creator-composio.generate_component`
- `/mcp.imo-creator-composio.sync_figma_design`
- `/mcp.imo-creator-composio.validate_heir_compliance`

## 🔧 Environment Variables

```bash
# DeepSeek
DEEPSEEK_API_KEY=your_key
DEEPSEEK_API_ENDPOINT=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
COMPOSIO_MCP_URL=http://localhost:7001
ENABLE_COMPOSIO_INTEGRATION=true

# Composio
BUILDER_IO_API_KEY=your_key
BUILDER_IO_SPACE_ID=your_space_id
PORT=7001
```

## 🧪 Testing

```bash
# Integration test
npm run test:integration

# Health checks
curl http://localhost:7001/health
curl http://localhost:7002/health

# Check integration status
curl http://localhost:7002/info | jq '.integrations'
```

## 🔄 Common Workflows

### 1. Generate + Validate Component
```javascript
// 1. Generate with DeepSeek
ws.send(JSON.stringify({
  type: 'chat',
  message: 'Generate a button component'
}));

// 2. Auto-validates via Composio relay
// 3. Optionally creates in Builder.io
```

### 2. Design to Code
```javascript
// 1. Sync Figma design (Composio)
POST /mcp/tools/builder_sync_designs

// 2. Generate code (DeepSeek via relay)
// 3. Validate (HEIR via Composio)
// 4. Publish (Builder.io via Composio)
```

### 3. Code Review
```javascript
// 1. Analyze code (DeepSeek)
ws.send(JSON.stringify({
  type: 'analyze',
  code: myCode,
  analysisType: 'security'
}));

// 2. Generate docs (DeepSeek)
// 3. Publish docs (Composio)
```

## 🐛 Troubleshooting

### Servers not communicating?
```bash
# Check both are running
ps aux | grep mcp

# Check ports
lsof -i :7001 && lsof -i :7002

# Test connectivity
curl http://localhost:7001/health
curl http://localhost:7002/health
```

### API keys not working?
```bash
# Check environment
echo $DEEPSEEK_API_KEY
echo $BUILDER_IO_API_KEY

# Verify in VS Code
# Settings → Search "deepseek" or "builder"
```

### Port conflicts?
```bash
# Find what's using ports
lsof -i :7001
lsof -i :7002

# Change in .vscode/settings.json
```

## 📚 Documentation

- **COMPOSIO_INTEGRATION.md** - Full integration guide
- **COMPOSIO_SETUP.md** - Setup instructions
- **ARCHITECTURE.md** - System architecture
- **README.md** - Extension documentation

## 🔗 Resources

- DeepSeek API: https://platform.deepseek.com/docs
- Builder.io API: https://www.builder.io/c/docs/api
- MCP Spec: https://modelcontextprotocol.io

## ⚡ Quick Examples

### WebSocket Chat
```javascript
const ws = new WebSocket('ws://localhost:7002');
ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'chat',
    message: 'Hello DeepSeek!'
  }));
});
```

### HEIR Validation
```javascript
const response = await fetch('http://localhost:7001/heir/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ssot: {
      meta: { app_name: 'MyApp' },
      doctrine: { test: true }
    }
  })
});
```

### Cross-Server Relay
```javascript
ws.send(JSON.stringify({
  type: 'relay',
  forward_to_composio: true,
  target: 'builder_create_content',
  payload: {
    name: 'Generated Component',
    data: { component: code }
  }
}));
```

---

**Quick Ref Version**: 1.0.0
**Servers**: DeepSeek (7002) + Composio (7001)
**Status**: ✅ Active
