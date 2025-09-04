# Lovable MCP Server

A minimal, production-ready MCP server that wraps Lovable.dev to enable Claude to build UI pages from prompts and CTB/Altitude specifications.

## Features

- 🚀 **Direct Lovable.dev Integration**: Create projects, check status, get details
- 📋 **CTB/Altitude UI Scaffolding**: Automatically generate UI from your repository's CTB specs
- 🔄 **Composio Fallback**: Optional fallback through Composio actions
- 🛡️ **Type Safety**: Full TypeScript implementation with Zod validation
- ⚡ **Lightweight**: Minimal dependencies, fast startup

## Tools Available

### `create_project(prompt, projectType?, repo?, visibility?, context?)`
Create a new Lovable.dev project from a text prompt.

**Parameters:**
- `prompt` (required): Description of what to build
- `projectType` (optional): Project type (default: "react")
- `repo` (optional): Repository URL to connect
- `visibility` (optional): "public" or "private" (default: "private")
- `context` (optional): Additional context or requirements

### `check_project_status(projectId)`
Check the current status of a Lovable project.

### `get_project_details(projectId)`
Get comprehensive details about a Lovable project.

### `scaffold_altitude_ui(specPath?)`
**🎯 Special Feature**: Generate UI scaffolding based on your repository's CTB/Altitude specifications.

This tool automatically reads your CTB documentation files:
- `docs/altitude/30k.md` (Strategic overview)
- `docs/altitude/20k.md` (Operational processes)  
- `docs/altitude/10k.md` (Tactical details)
- `docs/altitude/5k.md` (Execution level)
- `docs/ctb_horiz.md` (Navigation structure)
- `docs/catalog.md` (Data structures)
- `docs/flows.md` (Information flows)
- `spec/process_map.yaml|json` (Process specifications)

And creates a comprehensive UI application with dashboards, forms, and navigation following your architecture.

## Setup

### 1. Install Dependencies

```bash
cd mcp-servers/lovable-mcp
npm install
```

### 2. Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your API keys
# Get Lovable API key from: https://lovable.dev/dashboard/settings/api
# Get Composio API key from: https://app.composio.dev/settings (optional fallback)
```

### 3. Build and Start

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

## MCP Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lovable": {
      "command": "node",
      "args": ["C:/path/to/imo-creator/mcp-servers/lovable-mcp/dist/server.js"],
      "env": {
        "LOVABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Claude Code CLI

Add to your `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "lovable": {
      "command": "node",
      "args": ["./mcp-servers/lovable-mcp/dist/server.js"],
      "env": {
        "LOVABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Cursor IDE

Add to your MCP configuration:

```json
{
  "lovable": {
    "command": "node",
    "args": ["mcp-servers/lovable-mcp/dist/server.js"]
  }
}
```

## Usage Examples

### Basic Project Creation

```
Claude, use the create_project tool to build a dashboard for user analytics with charts and tables.
```

### CTB/Altitude UI Scaffolding

```
Claude, use scaffold_altitude_ui to create a complete UI application based on our CTB specifications in this repository.
```

This will automatically read your `docs/altitude/` files and `spec/process_map.*` to create:
- Strategic dashboard (30k level)
- Operational process pages (20k level)  
- Tactical forms and details (10k level)
- Execution components and APIs (5k level)
- Navigation following your CTB structure
- Data visualizations from your catalog

### Check Project Status

```
Claude, check the status of project ID "proj_abc123".
```

## API Keys

### Lovable.dev API Key (Primary)
1. Visit https://lovable.dev/dashboard/settings/api
2. Generate an API key
3. Add to your `.env` file as `LOVABLE_API_KEY`

### Composio API Key (Fallback)
1. Visit https://app.composio.dev/settings  
2. Generate an API key
3. Add to your `.env` file as `COMPOSIO_API_KEY`

If both keys are configured, Lovable.dev will be used first, with Composio as fallback.

## Development

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## File Structure

```
lovable-mcp/
├── src/
│   └── server.ts          # Main MCP server implementation
├── dist/                  # Built JavaScript files
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Error Handling

The server includes comprehensive error handling for:
- Missing API keys (graceful fallback messages)
- Invalid API responses
- Missing CTB/Altitude specification files
- Network connectivity issues
- Malformed requests

## Contributing

This MCP server follows the repository's CTB/Altitude architecture and factory integration patterns. All changes should maintain compatibility with the existing MCP server ecosystem in this repository.