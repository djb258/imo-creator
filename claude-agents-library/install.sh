#!/bin/bash
# Claude Code Agents Library Installation Script
# This script installs portable Claude Code agents for use across projects

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="$SCRIPT_DIR/agents"
MANIFEST_FILE="$SCRIPT_DIR/manifest.json"
DEFAULT_INSTALL_PATH="$HOME/.claude-code/agents"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    cat << EOF
Claude Code Agents Library Installer

USAGE:
    $0 [OPTIONS] [COMMAND]

COMMANDS:
    install [PATH]    Install agents to specified path (default: $DEFAULT_INSTALL_PATH)
    list             List available agents
    validate         Validate agent manifests and formats
    uninstall        Remove installed agents
    update           Update existing agent installation

OPTIONS:
    -h, --help       Show this help message
    -v, --verbose    Enable verbose output
    -f, --force      Force installation (overwrite existing)
    --dry-run        Show what would be installed without making changes

EXAMPLES:
    $0 install                                    # Install to default location
    $0 install /custom/path                       # Install to custom path
    $0 list                                       # List available agents
    $0 validate                                   # Validate all agents

EOF
}

# Function to validate manifest file
validate_manifest() {
    if [[ ! -f "$MANIFEST_FILE" ]]; then
        log_error "Manifest file not found: $MANIFEST_FILE"
        return 1
    fi

    if ! jq empty "$MANIFEST_FILE" 2>/dev/null; then
        log_error "Invalid JSON in manifest file"
        return 1
    fi

    log_success "Manifest file is valid"
    return 0
}

# Function to validate individual agent
validate_agent() {
    local agent_file="$1"
    local agent_name=$(basename "$agent_file" .md)
    
    log_info "Validating agent: $agent_name"
    
    # Check if file exists
    if [[ ! -f "$agent_file" ]]; then
        log_error "Agent file not found: $agent_file"
        return 1
    fi
    
    # Check YAML frontmatter
    if ! head -n 1 "$agent_file" | grep -q "^---$"; then
        log_error "Agent $agent_name missing YAML frontmatter"
        return 1
    fi
    
    # Extract and validate YAML frontmatter
    local yaml_content=$(awk '/^---$/{f=1;next} /^---$/{f=0} f' "$agent_file")
    
    # Check required fields
    local required_fields=("name" "version" "description" "category" "capabilities")
    for field in "${required_fields[@]}"; do
        if ! echo "$yaml_content" | grep -q "^$field:"; then
            log_error "Agent $agent_name missing required field: $field"
            return 1
        fi
    done
    
    log_success "Agent $agent_name is valid"
    return 0
}

# Function to validate all agents
validate_all_agents() {
    log_info "Validating all agents..."
    
    if [[ ! -d "$AGENTS_DIR" ]]; then
        log_error "Agents directory not found: $AGENTS_DIR"
        return 1
    fi
    
    local valid_count=0
    local total_count=0
    
    for agent_file in "$AGENTS_DIR"/*.md; do
        if [[ -f "$agent_file" ]]; then
            ((total_count++))
            if validate_agent "$agent_file"; then
                ((valid_count++))
            fi
        fi
    done
    
    log_info "Validation complete: $valid_count/$total_count agents are valid"
    
    if [[ $valid_count -eq $total_count ]]; then
        log_success "All agents passed validation"
        return 0
    else
        log_error "Some agents failed validation"
        return 1
    fi
}

# Function to list available agents
list_agents() {
    log_info "Available Claude Code agents:"
    echo
    
    if [[ ! -d "$AGENTS_DIR" ]]; then
        log_error "Agents directory not found: $AGENTS_DIR"
        return 1
    fi
    
    for agent_file in "$AGENTS_DIR"/*.md; do
        if [[ -f "$agent_file" ]]; then
            local name=$(awk '/^name:/ {print $2}' "$agent_file" | tr -d '"')
            local version=$(awk '/^version:/ {print $2}' "$agent_file" | tr -d '"')
            local description=$(awk '/^description:/ {print substr($0, index($0,$2))}' "$agent_file" | tr -d '"')
            local category=$(awk '/^category:/ {print $2}' "$agent_file" | tr -d '"')
            
            echo -e "  ${GREEN}$name${NC} (v$version) - ${BLUE}[$category]${NC}"
            echo -e "    $description"
            echo
        fi
    done
}

# Function to install agents
install_agents() {
    local install_path="${1:-$DEFAULT_INSTALL_PATH}"
    
    log_info "Installing Claude Code agents to: $install_path"
    
    # Create installation directory
    if [[ ! -d "$install_path" ]]; then
        mkdir -p "$install_path"
        log_info "Created installation directory: $install_path"
    fi
    
    # Copy agents
    if [[ -d "$AGENTS_DIR" ]]; then
        cp -r "$AGENTS_DIR"/* "$install_path/"
        log_success "Agents copied to installation directory"
    else
        log_error "Agents directory not found: $AGENTS_DIR"
        return 1
    fi
    
    # Copy manifest
    if [[ -f "$MANIFEST_FILE" ]]; then
        cp "$MANIFEST_FILE" "$install_path/"
        log_success "Manifest copied to installation directory"
    fi
    
    # Create Claude Code configuration if it doesn't exist
    local claude_config_dir="$HOME/.claude-code"
    if [[ ! -d "$claude_config_dir" ]]; then
        mkdir -p "$claude_config_dir"
        log_info "Created Claude Code configuration directory"
    fi
    
    # Update Claude Code agent registry (if applicable)
    log_info "Installation complete!"
    echo
    echo -e "${GREEN}Installed agents:${NC}"
    for agent_file in "$install_path"/*.md; do
        if [[ -f "$agent_file" ]]; then
            local agent_name=$(basename "$agent_file" .md)
            echo "  - $agent_name"
        fi
    done
    
    echo
    echo -e "${BLUE}Usage:${NC}"
    echo "  Use '@agent-name' in your Claude Code sessions to invoke specific agents"
    echo "  Example: '@database-specialist help me optimize this query'"
}

# Function to uninstall agents
uninstall_agents() {
    local install_path="${1:-$DEFAULT_INSTALL_PATH}"
    
    if [[ ! -d "$install_path" ]]; then
        log_warning "Installation directory not found: $install_path"
        return 0
    fi
    
    log_info "Removing agents from: $install_path"
    rm -rf "$install_path"
    log_success "Agents uninstalled successfully"
}

# Function to update agents
update_agents() {
    local install_path="${1:-$DEFAULT_INSTALL_PATH}"
    
    log_info "Updating Claude Code agents..."
    
    # Backup existing installation
    if [[ -d "$install_path" ]]; then
        local backup_path="${install_path}.backup.$(date +%s)"
        cp -r "$install_path" "$backup_path"
        log_info "Created backup at: $backup_path"
    fi
    
    # Install new version
    install_agents "$install_path"
    log_success "Agents updated successfully"
}

# Parse command line arguments
COMMAND=""
INSTALL_PATH=""
VERBOSE=false
FORCE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        install)
            COMMAND="install"
            shift
            if [[ $# -gt 0 && ! $1 =~ ^- ]]; then
                INSTALL_PATH="$1"
                shift
            fi
            ;;
        list)
            COMMAND="list"
            shift
            ;;
        validate)
            COMMAND="validate"
            shift
            ;;
        uninstall)
            COMMAND="uninstall"
            shift
            if [[ $# -gt 0 && ! $1 =~ ^- ]]; then
                INSTALL_PATH="$1"
                shift
            fi
            ;;
        update)
            COMMAND="update"
            shift
            if [[ $# -gt 0 && ! $1 =~ ^- ]]; then
                INSTALL_PATH="$1"
                shift
            fi
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Set default command if none provided
if [[ -z "$COMMAND" ]]; then
    COMMAND="install"
fi

# Check dependencies
if ! command -v jq &> /dev/null; then
    log_warning "jq not found. Install it for better JSON validation"
fi

# Execute command
case "$COMMAND" in
    install)
        validate_manifest
        validate_all_agents
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "DRY RUN: Would install agents to ${INSTALL_PATH:-$DEFAULT_INSTALL_PATH}"
            list_agents
        else
            install_agents "$INSTALL_PATH"
        fi
        ;;
    list)
        list_agents
        ;;
    validate)
        validate_manifest
        validate_all_agents
        ;;
    uninstall)
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "DRY RUN: Would remove agents from ${INSTALL_PATH:-$DEFAULT_INSTALL_PATH}"
        else
            uninstall_agents "$INSTALL_PATH"
        fi
        ;;
    update)
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "DRY RUN: Would update agents in ${INSTALL_PATH:-$DEFAULT_INSTALL_PATH}"
        else
            update_agents "$INSTALL_PATH"
        fi
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac