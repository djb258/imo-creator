#!/bin/bash

# Test Composio MCP Server Integration
# This script tests the Composio server with your API key

echo "🧪 Testing Composio MCP Server Integration"
echo "=========================================="
echo ""

# Server URL
SERVER_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
HEALTH_RESPONSE=$(curl -s "$SERVER_URL/mcp/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "$HEALTH_RESPONSE" | python -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "$HEALTH_RESPONSE"
fi
echo ""

# Test 2: Get Available Tools
echo "2️⃣ Testing Get Available Tools..."
TOOLS_RESPONSE=$(curl -s -X POST "$SERVER_URL/tool" \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-TEST-001",
    "process_id": "PRC-TEST-001",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0",
    "tool": "get_available_tools",
    "data": {
      "toolkits": ["github"],
      "user_id": "test-user"
    }
  }')

if echo "$TOOLS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Get available tools succeeded${NC}"
    echo "Available GitHub tools found:"
    echo "$TOOLS_RESPONSE" | python -c "
import json, sys
data = json.load(sys.stdin)
if 'result' in data and 'tools' in data['result']:
    for tool in data['result']['tools'][:3]:
        print(f\"  - {tool.get('name', 'Unknown')}: {tool.get('description', '')[:50]}...\")
    print(f\"  Total tools: {data['result'].get('total_tools', 0)}\")
" 2>/dev/null || echo "$TOOLS_RESPONSE"
else
    echo -e "${RED}❌ Get available tools failed${NC}"
    echo "$TOOLS_RESPONSE"
fi
echo ""

# Test 3: Execute a Simple Tool (GitHub User Info)
echo "3️⃣ Testing Tool Execution (GitHub Get User)..."
EXECUTE_RESPONSE=$(curl -s -X POST "$SERVER_URL/tool" \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-TEST-002",
    "process_id": "PRC-TEST-002",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0",
    "tool": "execute_composio_tool",
    "data": {
      "toolkit": "github",
      "tool": "get_user",
      "arguments": {
        "username": "djb258"
      },
      "user_id": "test-user"
    }
  }')

if echo "$EXECUTE_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Tool execution succeeded${NC}"
    echo "GitHub user data retrieved successfully"
else
    echo -e "${YELLOW}⚠️  Tool execution may require connected account${NC}"
    echo "$EXECUTE_RESPONSE" | python -m json.tool 2>/dev/null || echo "$EXECUTE_RESPONSE"
fi
echo ""

# Test 4: Get Composio Stats
echo "4️⃣ Testing Get Composio Stats..."
STATS_RESPONSE=$(curl -s -X POST "$SERVER_URL/tool" \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-TEST-003",
    "process_id": "PRC-TEST-003",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0",
    "tool": "get_composio_stats",
    "data": {
      "include_usage": true
    }
  }')

if echo "$STATS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Stats retrieval succeeded${NC}"
    echo "$STATS_RESPONSE" | python -c "
import json, sys
data = json.load(sys.stdin)
if 'result' in data:
    result = data['result']
    print(f\"  SDK Version: {result.get('composio_integration', {}).get('sdk_version', 'Unknown')}\")
    print(f\"  API Configured: {result.get('composio_integration', {}).get('api_configured', False)}\")
    print(f\"  Total Toolkits: {result.get('supported_features', {}).get('total_toolkits', 0)}\")
" 2>/dev/null || echo "$STATS_RESPONSE"
else
    echo -e "${RED}❌ Stats retrieval failed${NC}"
    echo "$STATS_RESPONSE"
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Test Summary:"
echo ""
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Server is running and healthy${NC}"
else
    echo -e "${RED}❌ Server health check failed${NC}"
fi

if echo "$TOOLS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Composio API key is valid${NC}"
else
    echo -e "${RED}❌ Composio API key may be invalid${NC}"
fi

echo ""
echo "🔗 Next Steps:"
echo "  1. Connect accounts at https://app.composio.dev"
echo "  2. Use connected accounts for tool execution"
echo "  3. Explore 100+ available service integrations"
echo ""