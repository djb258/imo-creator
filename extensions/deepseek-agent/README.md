# DeepSeek AI Agent for VS Code

A powerful VS Code extension that integrates DeepSeek's AI capabilities directly into your development environment, providing intelligent code assistance, analysis, and generation.

## Features

- **Interactive Chat Interface**: Chat with DeepSeek AI directly in VS Code
- **Code Explanation**: Get detailed explanations of selected code
- **Code Refactoring**: Automatically refactor code for better readability and maintainability
- **Test Generation**: Generate comprehensive unit tests for your code
- **Bug Detection**: Identify and fix bugs in your code
- **Code Optimization**: Optimize code for better performance
- **Documentation Generation**: Automatically generate documentation
- **Custom Prompts**: Use custom prompts for specific tasks
- **MCP Integration**: Model Context Protocol support for advanced workflows
- **Context-Aware**: Understands your code context for better suggestions

## Installation

### Prerequisites

- VS Code 1.85.0 or higher
- Node.js 18.0.0 or higher
- DeepSeek API key (get one at [https://platform.deepseek.com](https://platform.deepseek.com))

### Install from Source

1. Clone or navigate to the extension directory:
   ```bash
   cd extensions/deepseek-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Package the extension:
   ```bash
   npm run package
   ```

4. Install the extension in VS Code:
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX"
   - Select the generated `.vsix` file

### Alternative: Development Mode

1. Open the extension folder in VS Code:
   ```bash
   code extensions/deepseek-agent
   ```

2. Press `F5` to launch the extension in a new Extension Development Host window

## Configuration

### Setting up your API Key

1. Get your DeepSeek API key from [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)

2. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)

3. Search for "DeepSeek"

4. Enter your API key in the `deepseek.apiKey` field

### Configuration Options

All settings can be configured in VS Code settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `deepseek.apiKey` | Your DeepSeek API key | `""` |
| `deepseek.apiEndpoint` | API endpoint URL | `https://api.deepseek.com/v1` |
| `deepseek.model` | Model to use | `deepseek-chat` |
| `deepseek.temperature` | Response temperature (0-2) | `0.7` |
| `deepseek.maxTokens` | Maximum tokens for response | `4096` |
| `deepseek.enableMCP` | Enable MCP server | `true` |
| `deepseek.mcpPort` | MCP server port | `7002` |
| `deepseek.autoSuggest` | Enable auto suggestions | `false` |
| `deepseek.contextWindow` | Context lines to include | `10` |

### Example settings.json

```json
{
  "deepseek.apiKey": "your_api_key_here",
  "deepseek.model": "deepseek-coder",
  "deepseek.temperature": 0.7,
  "deepseek.maxTokens": 4096,
  "deepseek.enableMCP": true,
  "deepseek.contextWindow": 15
}
```

## Usage

### Chat Interface

1. Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to open the chat panel
2. Type your question or request
3. Press Enter or click "Send"
4. View the AI's response in real-time

### Code Actions

#### Explain Code
1. Select code in the editor
2. Right-click and choose "DeepSeek: Explain Selected Code"
3. Or press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
4. View the explanation in a new tab

#### Refactor Code
1. Select code to refactor
2. Right-click and choose "DeepSeek: Refactor Code"
3. Review the suggested refactoring

#### Generate Tests
1. Select the function or class to test
2. Right-click and choose "DeepSeek: Generate Tests"
3. Review and integrate the generated tests

#### Fix Bugs
1. Select problematic code
2. Right-click and choose "DeepSeek: Fix Bugs"
3. Review the suggested fixes

#### Custom Prompt
1. Select code
2. Run command "DeepSeek: Custom Prompt"
3. Enter your custom instruction
4. View the results

### Command Palette

Access all commands via Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- `DeepSeek: Start Chat` - Open chat interface
- `DeepSeek: Explain Selected Code` - Explain selected code
- `DeepSeek: Refactor Code` - Refactor selected code
- `DeepSeek: Generate Tests` - Generate unit tests
- `DeepSeek: Fix Bugs` - Analyze and fix bugs
- `DeepSeek: Optimize Code` - Optimize for performance
- `DeepSeek: Generate Documentation` - Generate docs
- `DeepSeek: Custom Prompt` - Use custom prompt

### Keyboard Shortcuts

| Shortcut | Command |
|----------|---------|
| `Ctrl+Shift+D` / `Cmd+Shift+D` | Open Chat |
| `Ctrl+Shift+E` / `Cmd+Shift+E` | Explain Code |

## MCP Integration

The extension includes a Model Context Protocol (MCP) server that runs on port 7002 by default.

### MCP Capabilities

- **Chat**: Real-time chat with DeepSeek
- **Code Completion**: Intelligent code completion
- **Code Analysis**: Deep code analysis for bugs, performance, and security
- **Composio Integration**: Seamless integration with Composio MCP server

### MCP Endpoints

- Health Check: `http://localhost:7002/health`
- Server Info: `http://localhost:7002/info`
- WebSocket: `ws://localhost:7002`

### Composio MCP Integration

DeepSeek Agent integrates with the Composio MCP server for enhanced workflows:

- **Builder.io Integration**: Generate code and create visual components
- **HEIR Validation**: Automatic code validation
- **Figma Sync**: Design-to-code workflows
- **Cross-Server Communication**: Relay messages between DeepSeek and Composio

**Quick Start:**
```bash
# Terminal 1: Start Composio MCP
python src/mcp_server.py

# Terminal 2: Start DeepSeek MCP
cd extensions/deepseek-agent && npm run start:mcp

# Terminal 3: Test integration
npm run test:integration
```

**Documentation:**
- [Composio Integration Guide](./COMPOSIO_INTEGRATION.md) - Detailed integration documentation
- [Setup Instructions](./COMPOSIO_SETUP.md) - Quick setup guide
- [Architecture](./ARCHITECTURE.md) - System architecture and message flows
- [Quick Reference](./QUICK_REFERENCE.md) - Command reference card

### Using MCP with Other Tools

The MCP server can be integrated with other tools that support the Model Context Protocol:

```json
{
  "mcp.servers": {
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
  }
}
```

## Examples

### Example 1: Explain Complex Algorithm

```javascript
// Select this code and use "Explain Selected Code"
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
// Select this code and use "Refactor Code"
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

## Troubleshooting

### API Key Issues

**Problem**: "Invalid API key" error

**Solution**:
1. Verify your API key at [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
2. Check that the key is correctly entered in settings
3. Ensure there are no extra spaces or characters

### Connection Issues

**Problem**: "Network error" or timeout

**Solution**:
1. Check your internet connection
2. Verify the API endpoint URL
3. Check if your firewall is blocking the connection
4. Try increasing the timeout in the code

### MCP Server Issues

**Problem**: MCP server not starting

**Solution**:
1. Check if port 7002 is already in use
2. Change the port in settings: `deepseek.mcpPort`
3. Check the Output panel for error messages
4. Restart VS Code

### Extension Not Loading

**Problem**: Extension doesn't activate

**Solution**:
1. Check VS Code version (requires 1.85.0+)
2. Check Node.js version (requires 18.0.0+)
3. Reinstall dependencies: `npm install`
4. Check the Developer Tools console for errors

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run tests
npm test

# Package extension
npm run package

# Publish extension
npm run publish
```

### Project Structure

```
extensions/deepseek-agent/
├── src/
│   ├── extension.js          # Main extension entry point
│   ├── deepseekClient.js     # DeepSeek API client
│   ├── chatViewProvider.js   # Chat UI provider
│   └── mcpServer.js          # MCP server implementation
├── package.json              # Extension manifest
├── .env.example              # Example environment config
└── README.md                 # This file
```

## API Rate Limits

DeepSeek API has rate limits. If you encounter rate limit errors:

1. Wait a few moments before retrying
2. Consider upgrading your API plan
3. Reduce the `maxTokens` setting to use fewer tokens per request

## Privacy & Security

- Your API key is stored locally in VS Code settings
- Code sent to DeepSeek is processed according to their privacy policy
- No code is stored by this extension
- MCP server only runs locally on your machine

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/imo-creator/deepseek-agent/issues)
- DeepSeek Documentation: [https://platform.deepseek.com/docs](https://platform.deepseek.com/docs)
- VS Code Extension API: [https://code.visualstudio.com/api](https://code.visualstudio.com/api)

## Changelog

### Version 1.0.0
- Initial release
- Chat interface
- Code explanation, refactoring, and generation
- Test generation
- Bug detection and fixing
- Code optimization
- Documentation generation
- MCP server integration
- Context-aware suggestions

## Acknowledgments

- Built with [DeepSeek API](https://platform.deepseek.com)
- Inspired by the VS Code extension ecosystem
- Uses Model Context Protocol for advanced integrations

---

**Enjoy coding with DeepSeek AI! 🚀**
