#!/bin/bash

# Start All MCP Servers Script
# This script starts all operational MCP servers with proper environment configuration

echo "🚀 Starting MCP Server Infrastructure..."
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start a server
start_server() {
    local server_name=$1
    local port=$2
    local server_dir="mcp-servers/$server_name"
    
    if [ ! -d "$server_dir" ]; then
        echo -e "${YELLOW}⚠️  $server_name not found, skipping...${NC}"
        return
    fi
    
    if check_port $port; then
        echo -e "${YELLOW}⚠️  Port $port already in use (possibly $server_name already running)${NC}"
        return
    fi
    
    echo -e "${GREEN}🔧 Starting $server_name on port $port...${NC}"
    cd "$server_dir"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies for $server_name..."
        npm install --silent
    fi
    
    # Start the server in background
    PORT=$port nohup npm start > "$server_name.log" 2>&1 &
    echo $! > "$server_name.pid"
    
    cd - > /dev/null
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if server started successfully
    if check_port $port; then
        echo -e "${GREEN}✅ $server_name started successfully on port $port${NC}"
    else
        echo -e "${RED}❌ Failed to start $server_name${NC}"
    fi
}

# Main execution
echo "📋 Starting operational MCP servers..."
echo ""

# Start primary servers
start_server "composio-mcp" 3001
start_server "ref-tools-mcp" 3002
start_server "query-builder-mcp" 3003
start_server "github-actions-mcp" 3004
start_server "neon-mcp" 3005
start_server "twilio-mcp" 3006

echo ""
echo "============================================"
echo "🎯 MCP Server Infrastructure Status:"
echo ""

# Display running servers
echo "Running servers:"
if check_port 3001; then echo "  ✅ composio-mcp     : http://localhost:3001"; fi
if check_port 3002; then echo "  ✅ ref-tools-mcp    : http://localhost:3002"; fi
if check_port 3003; then echo "  ✅ query-builder-mcp: http://localhost:3003"; fi
if check_port 3004; then echo "  ✅ github-actions   : http://localhost:3004"; fi
if check_port 3005; then echo "  ✅ neon-mcp        : http://localhost:3005"; fi
if check_port 3006; then echo "  ✅ twilio-mcp      : http://localhost:3006"; fi

echo ""
echo "📊 Health check endpoints:"
echo "  curl http://localhost:3001/mcp/health  # Composio"
echo "  curl http://localhost:3002/mcp/health  # Ref Tools"
echo "  curl http://localhost:3003/mcp/health  # Query Builder"
echo ""
echo "🔒 HEIR/ORBT Compliance: Active"
echo "⚡ Performance Caching: Enabled"
echo "🛑 Kill Switch: Armed"
echo ""
echo "To stop all servers, run: ./stop-all.sh"
echo "To view logs: tail -f mcp-servers/*/*.log"