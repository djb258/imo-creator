# DeepSeek Agent Integration Guide

Complete guide for integrating DeepSeek AI Agent into VS Code and your development workflow.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Integration](#api-integration)
6. [MCP Protocol](#mcp-protocol)
7. [Extension Development](#extension-development)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Best Practices](#best-practices)

## Overview

The DeepSeek Agent integration provides:

- **VS Code Extension**: Native integration with VS Code UI
- **MCP Server**: Model Context Protocol server for advanced workflows
- **API Client**: Robust client for DeepSeek API communication
- **Chat Interface**: Interactive webview-based chat
- **Code Actions**: Context menu integration for code operations

### Key Components

```
extensions/deepseek-agent/
├── src/
│   ├── extension.js          # Extension activation & commands
│   ├── deepseekClient.js     # API client implementation
│   ├── chatViewProvider.js   # Chat UI webview provider
│   └── mcpServer.js          # MCP server implementation
├── package.json              # Extension manifest
├── README.md                 # User documentation
├── QUICKSTART.md            # Quick start guide
└── .env.example             # Configuration template
```

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      VS Code                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         DeepSeek Extension                       │  │
│  │  ┌────────────┐  ┌──────────────┐              │  │
│  │  │  Commands  │  │  Chat View   │              │  │
│  │  └─────┬──────┘  └──────┬───────┘              │  │
│  │        │                 │                       │  │
│  │        └────────┬────────┘                       │  │
│  │                 │                                │  │
│  │         ┌───────▼────────┐                      │  │
│  │         │ DeepSeek Client│                      │  │
│  │         └───────┬────────┘                      │  │
│  └─────────────────┼─────────────────────────────┘  │
└────────────────────┼──────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
    │ DeepSeek│ │  MCP   │ │ Other  │
    │   API   │ │ Server │ │ Tools  │
    └─────────┘ └────────┘ └────────┘
```

### Data Flow

1. **User Action** → Command triggered in VS Code
2. **Command Handler** → Processes user input and context
3. **DeepSeek Client** → Sends request to DeepSeek API
4. **API Response** → Receives and processes response
5. **UI Update** → Displays result to user

## Installation

### Prerequisites

```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version
npm --version

# Check VS Code version (requires 1.85.0+)
code --version
```

### Install Dependencies

```bash
cd extensions/deepseek-agent
npm install
```

### Development Installation

```bash
# Open in VS Code
code extensions/deepseek-agent

# Press F5 to launch Extension Development Host
```

### Production Installation

```bash
# Package the extension
npm run package

# Install the VSIX file
code --install-extension deepseek-agent-1.0.0.vsix
```

## Configuration

### Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_API_ENDPOINT=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=4096
DEEPSEEK_ENABLE_MCP=true
DEEPSEEK_MCP_PORT=7002
```

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "deepseek.apiKey": "${env:DEEPSEEK_API_KEY}",
  "deepseek.apiEndpoint": "https://api.deepseek.com/v1",
  "deepseek.model": "deepseek-coder",
  "deepseek.temperature": 0.7,
  "deepseek.maxTokens": 4096,
  "deepseek.enableMCP": true,
  "deepseek.mcpPort": 7002,
  "deepseek.contextWindow": 10
}
```

### MCP Server Configuration

Add to `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "deepseek-agent": {
      "name": "DeepSeek AI Agent",
      "description": "DeepSeek AI agent for intelligent code assistance",
      "command": "node",
      "args": ["${workspaceFolder}/extensions/deepseek-agent/src/mcpServer.js"],
      "cwd": "${workspaceFolder}",
      "env": {
        "DEEPSEEK_API_KEY": "${MCP:DEEPSEEK_API_KEY}",
        "PORT": "7002"
      },
      "tools": [
        "deepseek_chat",
        "deepseek_code_completion",
        "deepseek_code_analysis"
      ]
    }
  },
  "mcp.enabledServers": ["deepseek-agent"]
}
```

## API Integration

### DeepSeek Client Usage

```javascript
const DeepSeekClient = require('./deepseekClient');

// Initialize client
const client = new DeepSeekClient(outputChannel);

// Simple chat
const response = await client.chat('Explain async/await in JavaScript');

// Streaming chat
await client.chatStream(
  'Explain promises',
  (chunk) => {
    console.log(chunk); // Handle each chunk
  }
);

// Code completion
const completion = await client.getCompletion(
  code,
  'javascript',
  cursorPosition
);
```

### API Request Format

```javascript
// Chat completion request
{
  model: 'deepseek-chat',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful coding assistant.'
    },
    {
      role: 'user',
      content: 'Explain this code...'
    }
  ],
  temperature: 0.7,
  max_tokens: 4096,
  stream: false
}
```

### Error Handling

```javascript
try {
  const response = await client.chat(message);
} catch (error) {
  if (error.message.includes('Invalid API key')) {
    // Handle authentication error
  } else if (error.message.includes('Rate limit')) {
    // Handle rate limiting
  } else if (error.message.includes('Network error')) {
    // Handle network issues
  } else {
    // Handle other errors
  }
}
```

## MCP Protocol

### Server Implementation

The MCP server provides WebSocket-based communication:

```javascript
// Start server
const mcpServer = new MCPServer(deepseekClient, 7002);
await mcpServer.start();

// Handle messages
mcpServer.on('message', async (ws, data) => {
  switch (data.type) {
    case 'chat':
      await handleChat(ws, data);
      break;
    case 'completion':
      await handleCompletion(ws, data);
      break;
  }
});
```

### Client Connection

```javascript
// Connect to MCP server
const ws = new WebSocket('ws://localhost:7002');

// Send chat request
ws.send(JSON.stringify({
  type: 'chat',
  message: 'Your question here',
  stream: true
}));

// Handle response
ws.on('message', (data) => {
  const response = JSON.parse(data);
  if (response.type === 'chat-chunk') {
    console.log(response.chunk);
  }
});
```

### MCP Protocol Messages

#### Chat Request
```json
{
  "type": "chat",
  "message": "Your question",
  "stream": true
}
```

#### Completion Request
```json
{
  "type": "completion",
  "code": "function example() {",
  "language": "javascript",
  "cursor": 20
}
```

#### Analysis Request
```json
{
  "type": "analyze",
  "code": "your code here",
  "language": "python",
  "analysisType": "bugs"
}
```

## Extension Development

### Adding New Commands

1. **Register in package.json**:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "deepseek.myNewCommand",
        "title": "DeepSeek: My New Command"
      }
    ]
  }
}
```

2. **Implement in extension.js**:

```javascript
context.subscriptions.push(
  vscode.commands.registerCommand('deepseek.myNewCommand', async () => {
    // Your implementation
  })
);
```

### Creating Custom Views

```javascript
class MyViewProvider {
  resolveWebviewView(webviewView) {
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      // Handle messages from webview
    });
  }

  getHtml() {
    return `<!DOCTYPE html>
      <html>
        <body>
          <!-- Your UI -->
        </body>
      </html>`;
  }
}
```

### Adding Configuration Options

1. **Define in package.json**:

```json
{
  "configuration": {
    "properties": {
      "deepseek.myOption": {
        "type": "string",
        "default": "value",
        "description": "My option description"
      }
    }
  }
}
```

2. **Access in code**:

```javascript
const config = vscode.workspace.getConfiguration('deepseek');
const myOption = config.get('myOption');
```

## Testing

### Unit Tests

```javascript
// test/deepseekClient.test.js
const assert = require('assert');
const DeepSeekClient = require('../src/deepseekClient');

describe('DeepSeekClient', () => {
  it('should validate config', () => {
    const client = new DeepSeekClient();
    assert.throws(() => client.validateConfig());
  });

  it('should send chat request', async () => {
    const client = new DeepSeekClient();
    // Mock API call
    const response = await client.chat('test');
    assert.ok(response);
  });
});
```

### Integration Tests

```javascript
// test/extension.test.js
const vscode = require('vscode');
const assert = require('assert');

describe('Extension Tests', () => {
  it('should activate extension', async () => {
    const ext = vscode.extensions.getExtension('imo-creator.deepseek-agent');
    await ext.activate();
    assert.ok(ext.isActive);
  });

  it('should register commands', () => {
    const commands = vscode.commands.getCommands();
    assert.ok(commands.includes('deepseek.chat'));
  });
});
```

### Run Tests

```bash
npm test
```

## Deployment

### Package Extension

```bash
# Install vsce
npm install -g @vscode/vsce

# Package
vsce package

# Output: deepseek-agent-1.0.0.vsix
```

### Publish to Marketplace

```bash
# Create publisher account at https://marketplace.visualstudio.com

# Login
vsce login your-publisher-name

# Publish
vsce publish
```

### Local Distribution

```bash
# Share the .vsix file
# Users install with:
code --install-extension deepseek-agent-1.0.0.vsix
```

## Best Practices

### 1. API Key Security

```javascript
// ✅ Good: Use VS Code secrets
const apiKey = await context.secrets.get('deepseek.apiKey');

// ❌ Bad: Hardcode API key
const apiKey = 'sk-1234567890';
```

### 2. Error Handling

```javascript
// ✅ Good: Comprehensive error handling
try {
  const response = await client.chat(message);
  return response;
} catch (error) {
  outputChannel.appendLine(`Error: ${error.message}`);
  vscode.window.showErrorMessage(`DeepSeek: ${error.message}`);
  throw error;
}

// ❌ Bad: Silent failures
try {
  await client.chat(message);
} catch (error) {
  // Nothing
}
```

### 3. User Feedback

```javascript
// ✅ Good: Show progress
await vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: 'DeepSeek is processing...',
  cancellable: true
}, async (progress, token) => {
  return await client.chat(message, token);
});

// ❌ Bad: No feedback
await client.chat(message);
```

### 4. Resource Cleanup

```javascript
// ✅ Good: Proper cleanup
async function deactivate() {
  if (mcpServer) {
    await mcpServer.stop();
  }
  if (outputChannel) {
    outputChannel.dispose();
  }
}

// ❌ Bad: No cleanup
function deactivate() {
  // Nothing
}
```

### 5. Configuration Validation

```javascript
// ✅ Good: Validate before use
function validateConfig() {
  const config = vscode.workspace.getConfiguration('deepseek');
  const apiKey = config.get('apiKey');

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  return config;
}

// ❌ Bad: Assume config is valid
const config = vscode.workspace.getConfiguration('deepseek');
const apiKey = config.get('apiKey'); // Might be undefined
```

## Troubleshooting

### Debug Mode

Enable debug logging:

```json
{
  "deepseek.debug": true
}
```

View logs:
- Output Panel → "DeepSeek Agent"
- Developer Tools → Console

### Common Issues

#### Extension Not Loading
```bash
# Check extension host logs
# Help → Toggle Developer Tools → Console
```

#### API Errors
```bash
# Test API connection
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}]}'
```

#### MCP Server Issues
```bash
# Check if port is in use
netstat -an | grep 7002

# Test MCP server
curl http://localhost:7002/health
```

## Resources

- **DeepSeek API Docs**: https://platform.deepseek.com/docs
- **VS Code Extension API**: https://code.visualstudio.com/api
- **MCP Protocol**: https://modelcontextprotocol.io
- **GitHub Repository**: https://github.com/imo-creator/deepseek-agent

## Support

For issues and questions:
- GitHub Issues: https://github.com/imo-creator/deepseek-agent/issues
- Email: support@imo-creator.com
- Discord: https://discord.gg/imo-creator

---

**Last Updated**: 2024
**Version**: 1.0.0
