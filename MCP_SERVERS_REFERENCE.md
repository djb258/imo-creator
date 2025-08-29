# MCP Servers Reference Guide for ChatGPT

**Use this file when designing processes with ChatGPT to understand available MCP server capabilities**

## Overview

This project contains **11 operational MCP servers** built on a unified HEIR/ORBT compliance framework. Each server provides specific functionality while maintaining security, logging, and governance standards.

---

## 🟢 OPERATIONAL MCP SERVERS

### 1. **Apify MCP Server** (Port: 3002)
**Purpose**: Web scraping and data extraction  
**ORBT Layer**: 5 (External API)  
**System Code**: APFYSC

**Key Operations**:
- `run_actor` - Execute Apify actors for scraping
- `scrape_url` - Simple URL scraping with Playwright
- `get_dataset` - Retrieve scraped data
- `list_actors` - Browse available Apify actors

**Environment Variables Needed**:
- `APIFY_API_KEY` - Apify API authentication

**Example Usage**:
```json
{
  "operation": "scrape_url",
  "url": "https://example.com",
  "options": {
    "waitForFinish": true,
    "timeout": 300
  }
}
```

---

### 2. **CTB Parser MCP Server** (Port: 3003) 
**Purpose**: CTB (Component Tree Blueprint) structure parsing and validation  
**ORBT Layer**: 4 (UI/Component)  
**System Code**: CTBPSR

**Key Operations**:
- `parse_ctb` - Parse CTB YAML structures
- `validate_ctb` - Validate CTB compliance
- `convert_ctb` - Convert between CTB formats
- `generate_blueprint` - Create new CTB blueprints

**Example Usage**:
```json
{
  "operation": "parse_ctb",
  "ctb_content": "yaml_content_here",
  "options": {
    "validate": true,
    "includeMetadata": true
  }
}
```

---

### 3. **Email Validator MCP Server** (Port: 3004)
**Purpose**: Email validation and verification services  
**ORBT Layer**: 6 (Utility)  
**System Code**: EMLVLD

**Key Operations**:
- `validate_email` - Validate email format and deliverability
- `validate_domain` - Check domain validity
- `bulk_validate` - Batch email validation
- `get_mx_records` - Retrieve MX records

**Example Usage**:
```json
{
  "operation": "validate_email",
  "email": "user@example.com",
  "options": {
    "checkDeliverability": true,
    "checkMX": true
  }
}
```

---

### 4. **GitHub MCP Server** (Port: 3005)
**Purpose**: GitHub repository management and operations  
**ORBT Layer**: 3 (Infrastructure)  
**System Code**: GHUBMC

**Key Operations**:
- `get_repository` - Fetch repository information
- `list_commits` - Retrieve commit history
- `create_issue` - Create GitHub issues
- `get_pull_requests` - List pull requests
- `get_file_content` - Read repository files

**Environment Variables Needed**:
- `GITHUB_TOKEN` - GitHub API authentication

**Example Usage**:
```json
{
  "operation": "get_repository",
  "owner": "username",
  "repo": "repository-name",
  "options": {
    "includeReadme": true
  }
}
```

---

### 5. **Neon MCP Server** (Port: 3001)
**Purpose**: Neon PostgreSQL database operations  
**ORBT Layer**: 2 (Database)  
**System Code**: NEONDB

**Key Operations**:
- `execute_query` - Run SQL queries
- `create_table` - Create database tables
- `insert_data` - Insert records
- `get_schema` - Retrieve database schema
- `backup_data` - Create data backups

**Environment Variables Needed**:
- `NEON_DATABASE_URL` - Neon connection string

**Example Usage**:
```json
{
  "operation": "execute_query",
  "query": "SELECT * FROM users LIMIT 10",
  "options": {
    "returnMetadata": true
  }
}
```

---

### 6. **Whimsical MCP Server** (Port: 3000)
**Purpose**: Whimsical diagram and flowchart management  
**ORBT Layer**: 4 (Visual/Design)  
**System Code**: WHMSCL

**Key Operations**:
- `create_flowchart` - Generate flowcharts
- `update_diagram` - Modify existing diagrams
- `export_diagram` - Export in various formats
- `list_workspaces` - Browse Whimsical workspaces

**Environment Variables Needed**:
- `WHIMSICAL_API_KEY` - Whimsical API authentication

**Example Usage**:
```json
{
  "operation": "create_flowchart",
  "title": "Process Flow",
  "nodes": [...],
  "connections": [...],
  "options": {
    "workspace_id": "workspace_123"
  }
}
```

---

### 7. **Plasmic MCP Server** (Port: 3006)
**Purpose**: Plasmic UI component management and code generation  
**ORBT Layer**: 4 (UI/Frontend)  
**System Code**: PLSMIC

**Key Operations**:
- `sync_components` - Sync components from Plasmic
- `get_component` - Retrieve specific components
- `generate_code` - Generate component code
- `list_components` - Browse available components

**Environment Variables Needed**:
- `PLASMIC_API_KEY` - Plasmic API authentication
- `PLASMIC_PROJECT_ID` - Target project ID

**Example Usage**:
```json
{
  "operation": "generate_code",
  "componentId": "comp_123",
  "options": {
    "platform": "nextjs",
    "typescript": true
  }
}
```

---

### 8. **Vercel MCP Server** (Port: 3007)
**Purpose**: Vercel deployment and infrastructure management  
**ORBT Layer**: 3 (Infrastructure)  
**System Code**: VRCLMC

**Key Operations**:
- `deploy_project` - Deploy applications to Vercel
- `list_deployments` - View deployment history
- `set_env_vars` - Configure environment variables
- `add_domain` - Manage custom domains

**Environment Variables Needed**:
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_TEAM_ID` - Team ID (optional)

**Example Usage**:
```json
{
  "operation": "deploy_project",
  "projectName": "my-app",
  "options": {
    "target": "production",
    "files": [...]
  }
}
```

---

### 9. **Render MCP Server** (Port: 3008)
**Purpose**: Render cloud infrastructure management  
**ORBT Layer**: 3 (Infrastructure)  
**System Code**: RDRMC

**Key Operations**:
- `list_services` - Browse Render services
- `create_service` - Deploy new services
- `deploy_service` - Trigger deployments
- `get_logs` - Retrieve service logs
- `scale_service` - Adjust service resources

**Environment Variables Needed**:
- `RENDER_API_KEY` - Render API authentication

**Example Usage**:
```json
{
  "operation": "create_service",
  "options": {
    "name": "my-service",
    "type": "web_service",
    "repo": "https://github.com/user/repo",
    "plan": "free"
  }
}
```

---

### 10. **N8N MCP Server** (Port: 3009)
**Purpose**: N8N workflow automation management  
**ORBT Layer**: 4 (Workflow/Automation)  
**System Code**: N8NWFL

**Key Operations**:
- `list_workflows` - Browse N8N workflows
- `execute_workflow` - Trigger workflow execution
- `activate_workflow` - Enable workflow automation
- `trigger_webhook` - Fire webhook endpoints

**Environment Variables Needed**:
- `N8N_API_KEY` - N8N API authentication
- `N8N_BASE_URL` - N8N instance URL
- `N8N_WEBHOOK_URL` - Webhook base URL

**Example Usage**:
```json
{
  "operation": "execute_workflow",
  "workflowId": "workflow_123",
  "options": {
    "runData": {...}
  }
}
```

---

### 11. **Fire Crawl MCP Server** (Port: 3010)
**Purpose**: Advanced web scraping and data extraction  
**ORBT Layer**: 5 (External API)  
**System Code**: FRCWL

**Key Operations**:
- `scrape_single` - Scrape individual URLs with LLM extraction
- `crawl_website` - Crawl entire websites
- `batch_scrape` - Process multiple URLs
- `extract_data` - Structured data extraction
- `get_credits` - Check API usage

**Environment Variables Needed**:
- `FIRECRAWL_API_KEY` - FireCrawl API authentication

**Example Usage**:
```json
{
  "operation": "scrape_single",
  "url": "https://example.com",
  "options": {
    "extractionMode": "llm-extraction",
    "extractionPrompt": "Extract contact information",
    "screenshot": true
  }
}
```

---

## 🔧 UNIVERSAL FEATURES

All MCP servers include:

### Kill Switch System
- **GET** `/mcp/kill-switch/status` - Check kill switch status  
- **POST** `/mcp/kill-switch/activate` - Emergency shutdown  
- **CLI**: `node mcp-doctrine-layer/emergency/kill_switch.js status`

### Health Monitoring  
- **GET** `/mcp/health` - JSON health status  
- **GET** `/mcp/status` - Visual status page

### HEIR/ORBT Compliance
- **Unique ID Format**: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
- **Process ID Format**: `PRC-SYSTCODE-EPOCHTIMESTAMP`
- **ORBT Layer Authorization**: Layers 1-7 with access control

### Mantis Logging
- Structured PostgreSQL logging
- Automatic trace correlation
- Security violation tracking
- Performance monitoring

---

## 🚀 QUICK START FOR CHATGPT

When designing a process, consider these common combinations:

### **Web Scraping Pipeline**:
1. **Fire Crawl MCP** → Extract data from websites
2. **Neon MCP** → Store extracted data  
3. **N8N MCP** → Automate the pipeline

### **Development Workflow**:
1. **GitHub MCP** → Manage code repositories
2. **Plasmic MCP** → Generate UI components
3. **Vercel MCP** → Deploy applications

### **Data Processing**:
1. **Apify MCP** → Scrape data sources
2. **Email Validator MCP** → Clean email lists
3. **Neon MCP** → Store processed data

### **Infrastructure Management**:
1. **Render MCP** → Manage cloud services
2. **Vercel MCP** → Handle frontend deployments  
3. **N8N MCP** → Orchestrate operations

---

## ⚡ EMERGENCY PROTOCOLS

**Kill Switch Activation**:
```bash
# Activate emergency kill switch for all servers
curl -X POST http://localhost:PORT/mcp/kill-switch/activate

# Or via CLI
node mcp-doctrine-layer/emergency/kill_switch.js activate
```

**Health Check All Servers**:
```bash
# Check health of all servers (ports 3000-3010)
for port in {3000..3010}; do
  curl -s "http://localhost:$port/mcp/health" | jq '.status'
done
```

---

## 📋 PROCESS DESIGN CHECKLIST

When designing processes with ChatGPT, consider:

✅ **Security**: Which ORBT layer is appropriate?  
✅ **Data Flow**: How will data move between servers?  
✅ **Error Handling**: What happens if a server fails?  
✅ **Authentication**: Which API keys are required?  
✅ **Scaling**: Can the process handle increased load?  
✅ **Monitoring**: How will you track process health?  
✅ **Compliance**: Are HEIR/ORBT requirements met?

---

**Last Updated**: ${new Date().toISOString()}  
**Total Servers**: 11 Operational  
**Framework**: MCP Doctrine Layer v1.0.0  
**Compliance**: HEIR v2.1 + ORBT v3.2