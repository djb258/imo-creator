# Composio Tool Setup Guide

## ✅ Connection Status
Your Composio connection is **WORKING**! 
- API Key: `ak_t-F0AbvfZHUZ...` (configured in .env)
- Base URL: https://backend.composio.dev
- 628 apps available

## 🚀 Quick Start

### 1. Connect Your First App (GitHub Example)

```bash
# Interactive setup
node scripts/composio-connect.js

# Choose option 2, then enter "github"
```

### 2. Direct API Usage

```javascript
const { Composio } = require('composio-core');
const client = new Composio(process.env.COMPOSIO_API_KEY);

// Example: List GitHub Issues
async function listGitHubIssues() {
  const result = await client.tools.execute({
    connectedAccountId: 'your-github-account-id',
    toolName: 'github_issues_list',
    input: { 
      repo: 'owner/repo',
      state: 'open'
    }
  });
  console.log(result);
}
```

## 📱 Available Tool Categories

Based on your manifest, you have these tools integrated:

### **Lovable.dev** (UI Generation)
- `lovable_create_project` - Create UI from prompts
- `lovable_get_project_status` - Check build status
- `lovable_scaffold_altitude_ui` - Generate from CTB specs

### **Builder.io** (Visual CMS)
- `builder_io_create_space` - Create content spaces
- `builder_io_create_model` - Define content models
- `builder_io_scaffold_altitude_cms` - Generate from CTB

### **Figma** (Design Tools)
- `figma_export_to_code` - Export designs to React/Vue
- `figma_create_design_system` - Create design systems
- `figma_sync_components` - Sync with repositories

### **Smartsheet** (Project Management)
- `smartsheet_create_sheet` - Create new sheets
- `smartsheet_add_rows` - Add data rows
- `smartsheet_scaffold_from_altitude` - Generate from CTB

### **Neon** (Database)
- `neon_query_database` - Execute SQL queries
- `neon_create_table` - Create tables
- `neon_insert_data` - Insert records

## 🔐 Authentication Methods

Different apps use different auth methods:

### OAuth2 Apps (Browser Auth)
- GitHub, Gmail, Slack, Discord
- Run `composio-connect.js` and follow browser flow

### API Key Apps (Direct Setup)
```javascript
// For API key apps like Twilio, OpenAI
const account = await client.connectedAccounts.create({
  appName: 'twilio',
  authMode: 'API_KEY',
  authConfig: {
    api_key: 'your-twilio-api-key',
    account_sid: 'your-account-sid'
  }
});
```

## 🧪 Test Your Tools

### Step 1: Check Connected Accounts
```javascript
const accounts = await client.connectedAccounts.list({});
console.log('Connected:', accounts);
```

### Step 2: Execute a Tool
```javascript
// Example: Send a test SMS via Twilio
const result = await client.tools.execute({
  connectedAccountId: 'your-twilio-account-id',
  toolName: 'twilio_send_sms',
  input: {
    to: '+1234567890',
    body: 'Test message from Composio!'
  }
});
```

## 📝 Next Steps

1. **Connect your first app**: Start with GitHub or Gmail
2. **Test a simple tool**: Try listing issues or sending an email
3. **Integrate with your MCP servers**: Use the Composio MCP server at port 3001
4. **Build workflows**: Combine multiple tools for automation

## 🆘 Troubleshooting

### API Key Issues
- Verify key in `.env` file
- Check key starts with `ak_`
- Ensure no extra spaces

### Connection Issues
- Some apps require browser authentication
- Check app-specific requirements in Composio docs
- Verify network connectivity

### Tool Execution Errors
- Ensure account is connected first
- Check required input parameters
- Verify permissions for the operation

## 📚 Resources

- [Composio Docs](https://docs.composio.dev)
- [Supported Apps List](https://app.composio.dev/apps)
- MCP Server: `http://localhost:3001`
- Your API Key: Available in `.env`

---

Ready to connect your tools! Start with `node scripts/composio-connect.js`