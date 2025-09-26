# VS Code + Builder.io MCP Integration Guide

## Overview

This integration connects VS Code with Builder.io through the IMO Creator composio MCP server, enabling seamless visual development workflows directly from your code editor.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VS Code IDE   │───▶│   MCP Server    │───▶│   Builder.io    │
│   • Extension   │    │   • Tools       │    │   • API         │
│   • Tasks       │    │   • Resources   │    │   • Content     │
│   • Commands    │    │   • Prompts     │    │   • Models      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### MCP Tools
- **builder_create_content**: Create Builder.io content from VS Code selections
- **builder_get_models**: Access Builder.io schemas and models
- **heir_validate**: Validate code against HEIR compliance

### MCP Resources
- **builder://models/\***: Direct access to Builder.io content models
- **builder://content/\***: Access to created content
- **heir://validation/\***: HEIR compliance resources

### MCP Prompts
- **generate_component**: AI-powered component generation
- **sync_figma_design**: Sync Figma designs with Builder.io
- **validate_heir_compliance**: Ensure code meets HEIR standards

## 📋 Setup Instructions

### 1. Install Required Extensions

Install the Builder.io extension from VS Code marketplace:
```bash
# Via command palette
Ctrl+Shift+P → Extensions: Install Extensions → Search "Builder"
```

### 2. Configure MCP Server

The MCP server is automatically configured in `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "imo-creator-composio": {
      "name": "IMO Creator Composio Bridge",
      "command": "python",
      "args": ["src/mcp_server.py"],
      "env": {
        "BUILDER_IO_API_KEY": "9502e3493ccf42339f36d16b4a482c70"
      }
    }
  }
}
```

### 3. Start MCP Server

Use VS Code tasks to start the server:
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "mcp: start server"

Or manually:
```bash
python src/mcp_server.py
```

## 🎯 Usage Examples

### Example 1: Create Builder.io Content from Code

1. Select code in VS Code editor
2. Press `Ctrl+Shift+P`
3. Run command: "mcp.imo-creator-composio.builder_create_content"
4. Content is created in Builder.io with VS Code context

### Example 2: Generate Component

1. Press `Ctrl+Shift+P`
2. Type: `/mcp.imo-creator-composio.generate_component`
3. Specify component requirements
4. Receive generated React/TypeScript component

### Example 3: Sync Current File

1. Open any React component file
2. Press `Ctrl+Shift+P`
3. Run task: "builder: sync current file"
4. File is synced to Builder.io as draft content

## 🔧 VS Code Commands

### Available Tasks

| Task | Description | Shortcut |
|------|-------------|----------|
| `mcp: start server` | Start the MCP server | Ctrl+Shift+P → Tasks |
| `mcp: test integration` | Test Builder.io connection | Ctrl+Shift+P → Tasks |
| `builder: sync current file` | Sync active file to Builder.io | Ctrl+Shift+P → Tasks |

### MCP Slash Commands

| Command | Description |
|---------|-------------|
| `/mcp.imo-creator-composio.generate_component` | Generate React component |
| `/mcp.imo-creator-composio.sync_figma_design` | Sync Figma design |
| `/mcp.imo-creator-composio.validate_heir_compliance` | Validate HEIR compliance |

## 📡 API Endpoints

### MCP-Specific Endpoints

- `POST /mcp/tools/builder_create_content` - MCP tool for content creation
- `GET /mcp/resources/builder/models` - MCP resource for models
- `POST /mcp/prompts/generate_component` - MCP prompt for generation

### VS Code Integration Endpoints

- `POST /vscode/sync-with-builder` - Sync VS Code files with Builder.io
- `GET /builder/models` - Get available Builder.io models
- `POST /builder/create-content` - Create Builder.io content

## 🔐 Configuration

### Environment Variables

Add to your `.env` file:
```bash
# Builder.io Integration
BUILDER_IO_API_KEY=9502e3493ccf42339f36d16b4a482c70
BUILDER_IO_SPACE_ID=your-space-id
BUILDER_IO_MODEL_ID=your-model-id

# MCP Server
MCP_SERVER_MODE=vscode
PORT=7001
```

### VS Code Settings

Configure in `.vscode/settings.json`:
```json
{
  "builder.io.mcpIntegration": true,
  "builder.io.autoSyncWithMCP": true,
  "mcp.enabledServers": ["imo-creator-composio"]
}
```

## 🧪 Testing

### Test MCP Connection

1. Start MCP server: `python src/mcp_server.py`
2. Run test: `python test_builder_integration.py`
3. Check VS Code MCP panel for server status

### Test Builder.io Integration

```bash
# Test endpoint
curl -X GET http://localhost:7001/builder/models

# Test VS Code sync
curl -X POST http://localhost:7001/vscode/sync-with-builder \\
  -H "Content-Type: application/json" \\
  -d '{"file_path": "src/Component.tsx", "component_name": "TestComponent"}'
```

## 🎨 Workflow Examples

### Design-to-Code Workflow

1. **Create in Figma** → Design your component
2. **Import to Builder.io** → Use Builder.io Figma plugin
3. **Generate Code** → Use MCP prompt in VS Code
4. **Refine in VS Code** → Edit generated component
5. **Sync Back** → Push changes to Builder.io

### Code-to-Visual Workflow

1. **Write Component** → Create React component in VS Code
2. **Sync to Builder.io** → Use VS Code task to sync
3. **Visual Editing** → Edit in Builder.io visual editor
4. **Export Updates** → Sync changes back to VS Code

## 🚨 Troubleshooting

### Common Issues

**MCP Server Won't Start**
- Check Python dependencies: `pip install fastapi uvicorn requests python-dotenv`
- Verify port 7001 is available
- Check environment variables are set

**Builder.io API Errors**
- Verify API key is correct
- Check space ID configuration
- Ensure network connectivity

**VS Code MCP Not Working**
- Reload VS Code window
- Check MCP server status in VS Code panel
- Verify .vscode/settings.json configuration

### Debug Commands

```bash
# Check MCP server health
curl http://localhost:7001/health

# Test Builder.io API
curl -H "Authorization: Bearer YOUR_API_KEY" https://builder.io/api/v1/spaces

# View MCP server logs
python src/mcp_server.py --debug
```

## 📚 Resources

- [Builder.io VS Code Extension](https://marketplace.visualstudio.com/items?itemName=builder.Builder)
- [MCP Specification](https://modelcontextprotocol.io/)
- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [Builder.io API Documentation](https://www.builder.io/c/docs/content-api)

## 🔄 Updates

This integration is part of the IMO Creator ecosystem and receives regular updates. Check the main repository for the latest features and improvements.

---

**Last Updated**: September 26, 2025
**Version**: 1.0.0
**Compatibility**: VS Code 1.102+, Builder.io API v1, MCP Specification 2024-11-05