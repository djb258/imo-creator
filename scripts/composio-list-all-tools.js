#!/usr/bin/env node

/**
 * List all available Composio tools and connected accounts
 */

const { Composio } = require('composio-core');
require('dotenv').config();

async function listAllTools() {
  console.log('🔍 Fetching All Composio Tools\n');
  console.log('=' .repeat(80));
  
  const apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
  const client = new Composio(apiKey);
  
  try {
    // 1. Get connected accounts
    console.log('\n📱 CONNECTED ACCOUNTS:');
    console.log('-' .repeat(40));
    
    const accountsResponse = await client.connectedAccounts.list({});
    const accounts = accountsResponse.items || accountsResponse.accounts || accountsResponse || [];
    
    const connectedApps = [];
    if (Array.isArray(accounts)) {
      accounts.forEach(acc => {
        const appName = acc.appUniqueId || acc.app_unique_id || acc.appName;
        connectedApps.push(appName);
        console.log(`✅ ${appName.toUpperCase()}`);
        console.log(`   Account ID: ${acc.id}`);
        console.log(`   Status: ${acc.status || 'ACTIVE'}`);
      });
    } else if (accounts && typeof accounts === 'object') {
      // Single account returned as object
      const appName = accounts.appUniqueId || accounts.app_unique_id || accounts.appName;
      if (appName) {
        connectedApps.push(appName);
        console.log(`✅ ${appName.toUpperCase()}`);
        console.log(`   Account ID: ${accounts.id}`);
        console.log(`   Status: ${accounts.status || 'ACTIVE'}`);
      }
    }
    
    // 2. Get available tools for connected apps
    console.log('\n\n🛠️  AVAILABLE TOOLS FOR CONNECTED APPS:');
    console.log('-' .repeat(40));
    
    for (const appName of connectedApps) {
      try {
        console.log(`\n📦 ${appName.toUpperCase()} Tools:`);
        const tools = await client.tools.list({ apps: [appName] });
        
        if (tools && tools.length > 0) {
          // Group tools by category if possible
          const categories = {};
          
          tools.forEach(tool => {
            const category = tool.category || 'General';
            if (!categories[category]) {
              categories[category] = [];
            }
            categories[category].push(tool);
          });
          
          // Display tools by category
          Object.keys(categories).forEach(category => {
            console.log(`\n   [${category}]`);
            categories[category].forEach(tool => {
              const name = tool.name || tool.tool_name;
              const desc = tool.description || tool.desc || '';
              console.log(`   • ${name}`);
              if (desc) {
                console.log(`     ${desc.substring(0, 70)}${desc.length > 70 ? '...' : ''}`);
              }
            });
          });
          
          console.log(`\n   Total: ${tools.length} tools available`);
        } else {
          console.log('   No tools found for this app');
        }
      } catch (e) {
        console.log(`   Error fetching tools: ${e.message}`);
      }
    }
    
    // 3. Show all available apps (not just connected)
    console.log('\n\n🌐 ALL AVAILABLE APPS IN COMPOSIO:');
    console.log('-' .repeat(40));
    
    try {
      const allApps = await client.apps.list();
      
      if (allApps && allApps.length > 0) {
        console.log(`\nTotal Apps Available: ${allApps.length}`);
        
        // Show first 20 apps as examples
        console.log('\nPopular Apps:');
        const popularApps = [
          'github', 'gmail', 'slack', 'notion', 'linear', 'jira',
          'asana', 'trello', 'discord', 'twilio', 'stripe', 'shopify',
          'hubspot', 'salesforce', 'zendesk', 'intercom', 'sendgrid',
          'mailchimp', 'airtable', 'dropbox'
        ];
        
        popularApps.forEach(app => {
          const isConnected = connectedApps.includes(app);
          console.log(`  ${isConnected ? '✅' : '⭕'} ${app}${isConnected ? ' (connected)' : ''}`);
        });
        
        console.log('\n...and many more!');
      }
    } catch (e) {
      console.log('Could not fetch app list');
    }
    
    // 4. Show quick stats
    console.log('\n\n📊 QUICK STATS:');
    console.log('-' .repeat(40));
    console.log(`Connected Apps: ${connectedApps.length}`);
    console.log(`User ID: default`);
    console.log(`API Key: ${apiKey.substring(0, 20)}...`);
    
    // 5. Show next steps
    console.log('\n\n🚀 NEXT STEPS:');
    console.log('-' .repeat(40));
    console.log('1. Connect more apps: node scripts/composio-connect.js');
    console.log('2. Test a tool: node scripts/composio-test-tool.js');
    console.log('3. Use in Claude: Tools are now available via MCP!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n' + '=' .repeat(80));
}

// Run the script
listAllTools().catch(console.error);