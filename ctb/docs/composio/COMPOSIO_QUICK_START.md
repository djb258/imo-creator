<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:39.577374
# CTB Version: 1.3.3
# Division: Documentation
# Category: composio
# Compliance: 75%
# HEIR ID: HEIR-2025-10-DOC-COMPOS-01

-->

# Composio MCP Server - Quick Start Guide

## 🚀 Getting Started

### 1. Start the MCP Server

```bash
# Activate virtual environment
.venv\Scripts\activate

# Start the server
python -m uvicorn src.mcp_server:app --host 0.0.0.0 --port 8000
```

The server will be available at `http://localhost:8000`

---

## 🔧 Configure Claude Desktop

Add this to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "composio": {
      "command": "python",
      "args": [
        "-m",
        "uvicorn",
        "src.mcp_server:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "cwd": "C:/Users/CUSTOM PC/Desktop/Cursor Builds/imo-creator/imo-creator",
      "env": {
        "COMPOSIO_API_KEY": "ak_t-F0AbvfZHUZSUrqAGNn"
      }
    }
  }
}
```

---

## 📋 Common Use Cases

### Figma Integration

**Export Design Tokens:**
```
Use the FIGMA_DESIGN_TOKENS_TO_TAILWIND tool to convert Figma design tokens to Tailwind CSS
```

**Add Comments:**
```
Use FIGMA_ADD_A_COMMENT_TO_A_FILE to add feedback to designs
```

**Manage Variables:**
```
Use FIGMA_CREATE_MODIFY_OR_DELETE_VARIABLES to manage design variables
```

---

### GitHub Integration

**Create Repository:**
```
Use GITHUB_CREATE_REPOSITORY to create a new repo
```

**Manage Issues:**
```
Use GITHUB_CREATE_ISSUE to create issues
Use GITHUB_LIST_ISSUES to list issues
Use GITHUB_UPDATE_ISSUE to update issues
```

**Pull Requests:**
```
Use GITHUB_CREATE_PULL_REQUEST to create PRs
Use GITHUB_MERGE_PULL_REQUEST to merge PRs
```

---

### Gmail Integration

**Send Email:**
```
Use GMAIL_SEND_EMAIL to send emails
```

**Fetch Emails:**
```
Use GMAIL_FETCH_EMAILS to retrieve emails
Use GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID for specific messages
```

**Manage Labels:**
```
Use GMAIL_CREATE_LABEL to create labels
Use GMAIL_MODIFY_EMAIL_LABELS to organize emails
```

---

### Google Drive Integration

**Create Files:**
```
Use GOOGLEDRIVE_CREATE_FILE_OR_FOLDER to create files/folders
Use GOOGLEDRIVE_CREATE_A_FILE_FROM_TEXT to create text files
```

**Share Files:**
```
Use GOOGLEDRIVE_ADD_FILE_SHARING_PREFERENCE to set sharing permissions
```

**Search Files:**
```
Use GOOGLEDRIVE_SEARCH_FILES to find files
```

---

### Google Sheets Integration

**Create Spreadsheet:**
```
Use GOOGLESHEETS_CREATE_A_GOOGLE_SHEET to create new sheets
```

**Update Data:**
```
Use GOOGLESHEETS_BATCH_UPDATE_SPREADSHEET to update multiple cells
Use GOOGLESHEETS_UPDATE_SPREADSHEET_VALUES to update specific ranges
```

**Read Data:**
```
Use GOOGLESHEETS_GET_SPREADSHEET_VALUES to read data
Use GOOGLESHEETS_BATCH_GET_SPREADSHEET to read multiple ranges
```

---

### Notion Integration

**Create Pages:**
```
Use NOTION_CREATE_NOTION_PAGE to create pages
Use NOTION_CREATE_NOTION_DATABASE to create databases
```

**Add Content:**
```
Use NOTION_ADD_CONTENT_TO_NOTION_PAGE to add content
Use NOTION_ADD_MULTIPLE_CONTENT_BLOCKS for bulk content
```

**Search:**
```
Use NOTION_SEARCH_NOTION to search across workspace
```

---

### Vercel Integration

**Deploy:**
```
Use VERCEL_CREATE_NEW_DEPLOYMENT to deploy projects
```

**Manage Environment:**
```
Use VERCEL_ADD_ENVIRONMENT_VARIABLE to add env vars
Use VERCEL_GET_ENVIRONMENT_VARIABLES to list env vars
```

**Domains:**
```
Use VERCEL_CHECK_DOMAIN_AVAILABILITY to check domains
Use VERCEL_ADD_DOMAIN to add domains
```

---

### OpenAI Integration

**Create Assistant:**
```
Use OPENAI_CREATE_ASSISTANT to create AI assistants
```

**Manage Threads:**
```
Use OPENAI_CREATE_THREAD to create conversation threads
Use OPENAI_CREATE_MESSAGE to add messages
```

---

## 🧪 Testing Tools

Use the test script to verify tool availability:

```bash
python test-composio-tools.py
```

This will:
1. List all available tools
2. Show tool counts by app
3. Display sample tool details

---

## 📚 Tool Discovery

### List All Tools
```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://backend.composio.dev/api/v2/actions?apps=FIGMA,GITHUB,GMAIL"
```

### Get Tool Details
```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://backend.composio.dev/api/v2/actions/FIGMA_ADD_A_COMMENT_TO_A_FILE"
```

---

## 🔍 Troubleshooting

### Server Won't Start
- Check if port 8000 is available
- Verify virtual environment is activated
- Ensure all dependencies are installed: `pip install -r requirements.txt`

### Tools Not Showing
- Verify API key is correct in `.env`
- Check that integrations have active connections
- Restart Claude Desktop after config changes

### Authentication Errors
- Ensure integrations are properly connected in Composio dashboard
- Check that OAuth tokens haven't expired
- Re-authenticate integrations if needed

---

## 📖 Additional Resources

- **Composio Dashboard**: https://app.composio.dev/
- **API Documentation**: https://docs.composio.dev/
- **Full Tool List**: See `COMPOSIO_INTEGRATION_SUMMARY.md`
- **Tool Definitions**: See `my-composio-tools-full.json`

---

## 💡 Pro Tips

1. **Use Specific Tools**: Instead of generic actions, use specific tools for better results
2. **Batch Operations**: Use batch tools when working with multiple items
3. **Error Handling**: Always check tool responses for errors
4. **Rate Limits**: Be aware of API rate limits for each service
5. **Webhooks**: Set up webhooks for real-time updates

---

*Last Updated: 2025*
*Total Tools: 1,059*
