#!/bin/bash
# =====================================================================================
# List Global Agents Script
# Lists all available agents in the global ~/.claude/agents directory
# =====================================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Determine the global agents directory
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    GLOBAL_AGENTS_DIR="$USERPROFILE/.claude/agents"
else
    # macOS/Linux
    GLOBAL_AGENTS_DIR="$HOME/.claude/agents"
fi

echo -e "${BLUE}=============================================================================${NC}"
echo -e "${BLUE}Claude Code Global Agents Directory${NC}"
echo -e "${BLUE}=============================================================================${NC}"
echo -e "Location: ${GREEN}$GLOBAL_AGENTS_DIR${NC}"
echo ""

# Check if directory exists
if [[ ! -d "$GLOBAL_AGENTS_DIR" ]]; then
    echo -e "${RED}❌ Global agents directory does not exist${NC}"
    echo -e "${YELLOW}📝 Create it with: mkdir -p \"$GLOBAL_AGENTS_DIR\"{NC}"
    exit 1
fi

# Count agents
TOTAL_AGENTS=$(find "$GLOBAL_AGENTS_DIR" -name "*.md" -type f | wc -l | tr -d ' ')

if [[ $TOTAL_AGENTS -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  No agents found in global directory${NC}"
    echo -e "${YELLOW}📝 Copy agents from project: cp -r .claude/agents/* \"$GLOBAL_AGENTS_DIR/\"${NC}"
    exit 0
fi

echo -e "${GREEN}📊 Found $TOTAL_AGENTS agents${NC}"
echo ""

# Function to list agents in a directory
list_agents() {
    local dir="$1"
    local prefix="$2"
    
    if [[ -d "$dir" ]]; then
        local count=0
        for agent_file in "$dir"/*.md; do
            if [[ -f "$agent_file" ]]; then
                local agent_name=$(basename "$agent_file" .md)
                local file_size=$(stat -f%z "$agent_file" 2>/dev/null || stat -c%s "$agent_file" 2>/dev/null || echo "0")
                local file_size_kb=$((file_size / 1024))
                echo -e "$prefix  📄 ${GREEN}$agent_name${NC} (${file_size_kb}KB)"
                ((count++))
            fi
        done
        return $count
    fi
    return 0
}

# List orchestrators at root level
echo -e "${BLUE}🎯 Orchestrators${NC}"
orchestrator_count=0
for agent_file in "$GLOBAL_AGENTS_DIR"/*.md; do
    if [[ -f "$agent_file" ]]; then
        agent_name=$(basename "$agent_file" .md)
        file_size=$(stat -f%z "$agent_file" 2>/dev/null || stat -c%s "$agent_file" 2>/dev/null || echo "0")
        file_size_kb=$((file_size / 1024))
        echo -e "  📄 ${GREEN}$agent_name${NC} (${file_size_kb}KB)"
        ((orchestrator_count++))
    fi
done

if [[ $orchestrator_count -eq 0 ]]; then
    echo -e "  ${YELLOW}⚠️  No orchestrators found${NC}"
fi
echo ""

# List domain agents
for domain in input middle output; do
    domain_dir="$GLOBAL_AGENTS_DIR/$domain"
    if [[ -d "$domain_dir" ]]; then
        echo -e "${BLUE}🔧 ${domain^} Domain Agents${NC}"
        domain_count=$(find "$domain_dir" -name "*.md" -type f | wc -l | tr -d ' ')
        
        if [[ $domain_count -gt 0 ]]; then
            list_agents "$domain_dir" ""
        else
            echo -e "  ${YELLOW}⚠️  No $domain agents found${NC}"
        fi
        echo ""
    else
        echo -e "${BLUE}🔧 ${domain^} Domain Agents${NC}"
        echo -e "  ${YELLOW}⚠️  No $domain directory found${NC}"
        echo ""
    fi
done

# Show agent bindings info
echo -e "${BLUE}⚙️  Agent Bindings${NC}"
BINDINGS_FILE="docs/agent.bindings.json"
if [[ -f "$BINDINGS_FILE" ]]; then
    echo -e "  📝 Configuration: ${GREEN}$BINDINGS_FILE${NC}"
    
    # Extract bound agents using basic parsing (works without jq)
    bound_count=$(grep -o '"implementation":' "$BINDINGS_FILE" | wc -l | tr -d ' ')
    echo -e "  🔗 Bound agents: ${GREEN}$bound_count${NC}"
else
    echo -e "  ${YELLOW}⚠️  No agent bindings file found${NC}"
fi
echo ""

# Show registry info
echo -e "${BLUE}📋 Agent Registry${NC}"
REGISTRY_FILE="docs/subagents.registry.json"
if [[ -f "$REGISTRY_FILE" ]]; then
    echo -e "  📝 Registry: ${GREEN}$REGISTRY_FILE${NC}"
    
    # Extract agent count from registry
    registry_count=$(grep -o '"role_id":' "$REGISTRY_FILE" | wc -l | tr -d ' ')
    echo -e "  📊 Registered agents: ${GREEN}$registry_count${NC}"
else
    echo -e "  ${YELLOW}⚠️  No agent registry file found${NC}"
fi
echo ""

# Show summary
echo -e "${BLUE}=============================================================================${NC}"
echo -e "${GREEN}✅ Global agents directory scan complete${NC}"
echo -e "   Total agents: ${GREEN}$TOTAL_AGENTS${NC}"
echo -e "   Location: ${GREEN}$GLOBAL_AGENTS_DIR${NC}"
echo -e "${BLUE}=============================================================================${NC}"

# Helpful commands
echo ""
echo -e "${YELLOW}💡 Helpful commands:${NC}"
echo -e "   📁 Open directory: ${GREEN}open \"$GLOBAL_AGENTS_DIR\"${NC} (macOS) or ${GREEN}explorer \"$GLOBAL_AGENTS_DIR\"${NC} (Windows)"
echo -e "   🔄 Sync from project: ${GREEN}make agents-sync${NC}"
echo -e "   ✅ Validate agents: ${GREEN}make agents-validate${NC}"