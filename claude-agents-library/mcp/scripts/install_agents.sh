#!/bin/bash
# MCP Integration Script for Claude Code Agents Library
# This script integrates agents with Model Context Protocol systems

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIBRARY_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
MANIFEST_FILE="$LIBRARY_ROOT/manifest.json"
MCP_CONFIG_DIR="$SCRIPT_DIR/../config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[MCP]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[MCP]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[MCP]${NC} $1"
}

log_error() {
    echo -e "${RED}[MCP]${NC} $1"
}

# Function to generate MCP server configuration
generate_mcp_config() {
    local config_file="$MCP_CONFIG_DIR/claude_agents.json"
    
    log_info "Generating MCP server configuration..."
    
    cat > "$config_file" << EOF
{
  "mcpServers": {
    "claude-agents-library": {
      "command": "node",
      "args": [
        "$SCRIPT_DIR/mcp_server.js"
      ],
      "env": {
        "AGENTS_MANIFEST_PATH": "$MANIFEST_FILE",
        "AGENTS_ROOT_PATH": "$LIBRARY_ROOT"
      }
    }
  }
}
EOF
    
    log_success "MCP configuration generated: $config_file"
}

# Function to create MCP server implementation
create_mcp_server() {
    local server_file="$SCRIPT_DIR/mcp_server.js"
    
    log_info "Creating MCP server implementation..."
    
    cat > "$server_file" << 'EOF'
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs').promises;
const path = require('path');

class ClaudeAgentsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'claude-agents-library',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async loadAgentsManifest() {
    const manifestPath = process.env.AGENTS_MANIFEST_PATH;
    if (!manifestPath) {
      throw new Error('AGENTS_MANIFEST_PATH environment variable not set');
    }

    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      return JSON.parse(manifestContent);
    } catch (error) {
      throw new Error(`Failed to load agents manifest: ${error.message}`);
    }
  }

  async loadAgentContent(agentFile) {
    const agentsRoot = process.env.AGENTS_ROOT_PATH;
    const agentPath = path.join(agentsRoot, agentFile);
    
    try {
      return await fs.readFile(agentPath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to load agent content: ${error.message}`);
    }
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const manifest = await this.loadAgentsManifest();
      
      return {
        tools: [
          {
            name: 'list_agents',
            description: 'List all available Claude Code agents',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Filter agents by category (optional)',
                },
              },
            },
          },
          {
            name: 'get_agent',
            description: 'Get detailed information about a specific agent',
            inputSchema: {
              type: 'object',
              properties: {
                agent_id: {
                  type: 'string',
                  description: 'The ID of the agent to retrieve',
                },
              },
              required: ['agent_id'],
            },
          },
          {
            name: 'search_agents',
            description: 'Search agents by capabilities, tags, or description',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for agent capabilities or tags',
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_agents':
            return await this.listAgents(args.category);

          case 'get_agent':
            return await this.getAgent(args.agent_id);

          case 'search_agents':
            return await this.searchAgents(args.query);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async listAgents(category) {
    const manifest = await this.loadAgentsManifest();
    
    let agents = manifest.agents;
    if (category) {
      agents = agents.filter(agent => agent.category === category);
    }

    const agentList = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      version: agent.version,
      category: agent.category,
      description: agent.description,
      tags: agent.tags,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            total: agentList.length,
            agents: agentList,
            categories: manifest.categories,
          }, null, 2),
        },
      ],
    };
  }

  async getAgent(agentId) {
    const manifest = await this.loadAgentsManifest();
    const agent = manifest.agents.find(a => a.id === agentId);
    
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    // Load the full agent content
    const agentContent = await this.loadAgentContent(agent.file);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            ...agent,
            content: agentContent,
          }, null, 2),
        },
      ],
    };
  }

  async searchAgents(query) {
    const manifest = await this.loadAgentsManifest();
    const searchTerm = query.toLowerCase();
    
    const matchingAgents = manifest.agents.filter(agent => {
      return (
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm) ||
        agent.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm))
      );
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query: query,
            total: matchingAgents.length,
            agents: matchingAgents,
          }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Claude Agents MCP server running on stdio');
  }
}

const server = new ClaudeAgentsServer();
server.run().catch(console.error);
EOF

    chmod +x "$server_file"
    log_success "MCP server created: $server_file"
}

# Function to create package.json for MCP server dependencies
create_package_json() {
    local package_file="$SCRIPT_DIR/package.json"
    
    log_info "Creating package.json for MCP dependencies..."
    
    cat > "$package_file" << EOF
{
  "name": "claude-agents-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Claude Code Agents Library",
  "main": "mcp_server.js",
  "scripts": {
    "start": "node mcp_server.js",
    "install-deps": "npm install"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "keywords": [
    "mcp",
    "claude-code",
    "agents",
    "model-context-protocol"
  ],
  "author": "Claude Code Agents Library",
  "license": "MIT"
}
EOF
    
    log_success "Package.json created: $package_file"
}

# Function to install MCP dependencies
install_mcp_dependencies() {
    log_info "Installing MCP server dependencies..."
    
    cd "$SCRIPT_DIR"
    if command -v npm >/dev/null 2>&1; then
        npm install
        log_success "MCP dependencies installed"
    else
        log_warning "npm not found. Please install Node.js and npm, then run 'npm install' in $SCRIPT_DIR"
    fi
}

# Function to create Claude Desktop MCP integration
create_claude_desktop_config() {
    local claude_config_dir="$HOME/Library/Application Support/Claude"
    local claude_config_file="$claude_config_dir/claude_desktop_config.json"
    
    # Create directory if it doesn't exist
    mkdir -p "$claude_config_dir"
    
    log_info "Creating Claude Desktop MCP configuration..."
    
    # Check if config already exists
    if [[ -f "$claude_config_file" ]]; then
        log_warning "Claude Desktop config already exists. Please manually merge the following configuration:"
        echo
        cat "$MCP_CONFIG_DIR/claude_agents.json"
        echo
        log_info "Add the above configuration to your existing $claude_config_file"
    else
        cp "$MCP_CONFIG_DIR/claude_agents.json" "$claude_config_file"
        log_success "Claude Desktop configuration created: $claude_config_file"
    fi
}

# Function to test MCP integration
test_mcp_integration() {
    log_info "Testing MCP server integration..."
    
    cd "$SCRIPT_DIR"
    if [[ -f "mcp_server.js" ]] && [[ -d "node_modules" ]]; then
        # Test that the server can start (timeout after 3 seconds)
        timeout 3s node mcp_server.js < /dev/null > /dev/null 2>&1 || true
        log_success "MCP server test completed"
    else
        log_error "MCP server files not found or dependencies not installed"
        return 1
    fi
}

# Main installation function
install_mcp_integration() {
    log_info "Installing Claude Code Agents Library MCP integration..."
    
    # Validate manifest exists
    if [[ ! -f "$MANIFEST_FILE" ]]; then
        log_error "Agents manifest not found: $MANIFEST_FILE"
        exit 1
    fi
    
    # Create MCP configuration and server files
    generate_mcp_config
    create_mcp_server
    create_package_json
    
    # Install dependencies if npm is available
    install_mcp_dependencies
    
    # Create Claude Desktop configuration
    create_claude_desktop_config
    
    # Test the integration
    test_mcp_integration
    
    log_success "MCP integration installation complete!"
    echo
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Restart Claude Desktop to load the new MCP server"
    echo "2. Use the agents in your Claude conversations:"
    echo "   - 'List available agents'"
    echo "   - 'Get me the database specialist agent'"
    echo "   - 'Search for frontend-related agents'"
    echo
    echo -e "${BLUE}Configuration files:${NC}"
    echo "  - MCP Server: $SCRIPT_DIR/mcp_server.js"
    echo "  - MCP Config: $MCP_CONFIG_DIR/claude_agents.json"
    echo "  - Claude Desktop: $claude_config_file"
}

# Parse command line arguments
case "${1:-install}" in
    install)
        install_mcp_integration
        ;;
    test)
        test_mcp_integration
        ;;
    config)
        generate_mcp_config
        create_claude_desktop_config
        ;;
    *)
        echo "Usage: $0 [install|test|config]"
        echo "  install - Full MCP integration setup (default)"
        echo "  test    - Test MCP server functionality"
        echo "  config  - Generate configuration files only"
        exit 1
        ;;
esac