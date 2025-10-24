<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:39.688256
# CTB Version: 1.3.3
# Division: Documentation
# Category: integration
# Compliance: 100%
# HEIR ID: HEIR-2025-10-DOC-INTEGR-01

-->

# DeepSeek Agent Integration for VS Code

This document provides an overview of the DeepSeek AI Agent integration into VS Code for the IMO Creator project.

## Overview

The DeepSeek Agent has been successfully integrated into VS Code as a fully-featured extension that provides intelligent code assistance, analysis, and generation capabilities powered by DeepSeek's AI models.

## What's Been Integrated

### 1. VS Code Extension (`extensions/deepseek-agent/`)

A complete VS Code extension with the following features:

#### Core Features
- **Interactive Chat Interface**: Real-time chat with DeepSeek AI
- **Code Explanation**: Understand complex code with detailed explanations
- **Code Refactoring**: Automated code improvement suggestions
- **Test Generation**: Automatic unit test creation
- **Bug Detection**: Identify and fix code issues
- **Code Optimization**: Performance improvement recommendations
- **Documentation Generation**: Auto-generate code documentation
- **Custom Prompts**: Flexible AI interactions for any task

#### Technical Components
- **Extension Entry Point** (`src/extension.js`): Main extension logic and command registration
- **DeepSeek Client** (`src/deepseekClient.js`): API communication layer
- **Chat View Provider** (`src/chatViewProvider.js`): Interactive chat UI
- **MCP Server** (`src/mcpServer.js`): Model Context Protocol server

### 2. VS Code Configuration

Updated `.vscode/settings.json` with:
- DeepSeek API configuration
- MCP server settings
- Extension preferences
- Keyboard shortcuts

### 3. Documentation

Comprehensive documentation including:
- **README.md**: Complete user guide
- **QUICKSTART.md**: Quick start guide with examples
- **INTEGRATION.md**: Developer integration guide
- **CHANGELOG.md**: Version history and updates

## Installation & Setup

### Quick Start

1. **Navigate to the extension directory**:
   ```bash
   cd extensions/deepseek-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Get your DeepSeek API key**:
   - Visit [https://platform.deepseek.com](https://platform.deepseek.com)
   - Sign up and create an API key

4. **Configure the extension**:
   - Open VS Code Settings (`Ctrl+,`)
   - Search for "deepseek"
   - Enter your API key in `deepseek.apiKey`

5. **Install the extension**:

   **Option A - Development Mode**:
   ```bash
   # Open the extension folder
   code extensions/deepseek-agent

   # Press F5 to launch in development mode
   ```

   **Option B - Package and Install**:
   ```bash
   # Package the extension
   npm run package

   # Install the .vsix file
   code --install-extension deepseek-agent-1.0.0.vsix
   ```

6. **Start using DeepSeek**:
   - Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to open chat
   - Select code and right-click for code actions
   - Use Command Palette for all commands

## Key Features

### 1. Interactive Chat
Press `Ctrl+Shift+D` to open the chat panel and ask DeepSeek anything:
- "How do I implement a binary search tree?"
- "Explain the difference between async/await and promises"
- "What are the SOLID principles?"

### 2. Code Actions (Right-Click Menu)
Select code and right-click to access:
- **Explain Code**: Get detailed explanations
- **Refactor Code**: Improve code structure
- **Generate Tests**: Create unit tests
- **Fix Bugs**: Identify and fix issues

### 3. Command Palette
Access via `Ctrl+Shift+P`:
- DeepSeek: Start Chat
- DeepSeek: Explain Selected Code
- DeepSeek: Refactor Code
- DeepSeek: Generate Tests
- DeepSeek: Fix Bugs
- DeepSeek: Optimize Code
- DeepSeek: Generate Documentation
- DeepSeek: Custom Prompt

### 4. MCP Integration
The extension includes a Model Context Protocol server that:
- Runs on port 7002 (configurable)
- Provides WebSocket-based communication
- Supports chat, completion, and analysis operations
- Can be integrated with other MCP-compatible tools

## Configuration Options

All settings are configurable in VS Code settings:

```json
{
  "deepseek.apiKey": "your_api_key_here",
  "deepseek.apiEndpoint": "https://api.deepseek.com/v1",
  "deepseek.model": "deepseek-chat",
  "deepseek.temperature": 0.7,
  "deepseek.maxTokens": 4096,
  "deepseek.enableMCP": true,
  "deepseek.mcpPort": 7002,
  "deepseek.contextWindow": 10
}
```

### Available Models
- **deepseek-chat**: General purpose conversational AI
- **deepseek-coder**: Optimized for code generation and analysis

## Project Structure

```
extensions/deepseek-agent/
├── src/
│   ├── extension.js          # Main extension entry point
│   ├── deepseekClient.js     # DeepSeek API client
│   ├── chatViewProvider.js   # Chat UI webview
│   └── mcpServer.js          # MCP server implementation
├── package.json              # Extension manifest & dependencies
├── README.md                 # User documentation
├── QUICKSTART.md            # Quick start guide
├── INTEGRATION.md           # Developer guide
├── CHANGELOG.md             # Version history
├── LICENSE                  # MIT License
├── .env.example             # Configuration template
├── .gitignore              # Git ignore rules
├── .eslintrc.json          # ESLint configuration
└── .prettierrc             # Prettier configuration
```

## Usage Examples

### Example 1: Explain Complex Code
```javascript
// Select this code and press Ctrl+Shift+E
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### Example 2: Generate Tests
```python
# Select this function and use "Generate Tests"
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)
```

### Example 3: Refactor Code
```javascript
// Select and use "Refactor Code"
function processData(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i] != null) {
      if (data[i].active == true) {
        result.push(data[i]);
      }
    }
  }
  return result;
}
```

## MCP Server

The MCP server provides advanced integration capabilities:

### Endpoints
- **Health Check**: `http://localhost:7002/health`
- **Server Info**: `http://localhost:7002/info`
- **WebSocket**: `ws://localhost:7002`

### Capabilities
- Real-time chat with streaming
- Code completion
- Code analysis (bugs, performance, security)
- Integration with other MCP-compatible tools

### Example Usage
```javascript
const ws = new WebSocket('ws://localhost:7002');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'chat',
    message: 'Explain async/await',
    stream: true
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log(response);
});
```

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Open Chat | `Ctrl+Shift+D` | `Cmd+Shift+D` |
| Explain Code | `Ctrl+Shift+E` | `Cmd+Shift+E` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Verify your API key at https://platform.deepseek.com/api_keys
   - Check for extra spaces in settings
   - Ensure the key is correctly entered

2. **Extension Not Loading**
   - Check VS Code version (requires 1.85.0+)
   - Check Node.js version (requires 18.0.0+)
   - Reinstall dependencies: `npm install`

3. **MCP Server Not Starting**
   - Check if port 7002 is in use
   - Change port in settings: `deepseek.mcpPort`
   - Check Output panel for errors

4. **Slow Responses**
   - Reduce `maxTokens` setting
   - Reduce `contextWindow` setting
   - Check your internet connection

## Development

### Building from Source
```bash
cd extensions/deepseek-agent
npm install
npm run lint
npm test
npm run package
```

### Contributing
Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- **DeepSeek Platform**: https://platform.deepseek.com
- **DeepSeek API Docs**: https://platform.deepseek.com/docs
- **VS Code Extension API**: https://code.visualstudio.com/api
- **Model Context Protocol**: https://modelcontextprotocol.io

## Support

For issues and questions:
- **GitHub Issues**: Report bugs or request features
- **Documentation**: See README.md and QUICKSTART.md
- **Email**: support@imo-creator.com

## What's Next

The DeepSeek Agent integration is ready to use! Here are some next steps:

1. **Install the extension** following the setup instructions above
2. **Configure your API key** in VS Code settings
3. **Try the chat interface** with `Ctrl+Shift+D`
4. **Explore code actions** by selecting code and right-clicking
5. **Read the documentation** for advanced features
6. **Customize settings** to match your workflow

## License

MIT License - see LICENSE file for details

---

**Integration Status**: ✅ Complete

**Version**: 1.0.0

**Last Updated**: 2024

**Enjoy coding with DeepSeek AI! 🚀**
