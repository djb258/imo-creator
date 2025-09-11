#!/usr/bin/env node

/**
 * Quick Composio Tool Tester
 * Run this to quickly list and test your Composio tools
 */

const { Composio } = require('composio-core');
require('dotenv').config();

async function quickTest() {
  console.log('🚀 Composio Quick Test\n');
  console.log('=' .repeat(60));
  
  const apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
  const client = new Composio(apiKey);
  
  try {
    // 1. Test connection
    console.log('\n✅ Connected with API Key:', apiKey.substring(0, 15) + '...');
    
    // 2. List connected accounts
    console.log('\n📱 Connected Accounts:');
    try {
      const accounts = await client.connectedAccounts.list({});
      
      if (!accounts || accounts.length === 0) {
        console.log('   No accounts connected yet');
      } else {
        accounts.forEach(acc => {
          console.log(`   - ${acc.appUniqueId}: ${acc.id}`);
        });
      }
    } catch (e) {
      console.log('   Could not fetch accounts:', e.message);
    }
    
    // 3. List available apps and their tools
    console.log('\n🔧 Popular Apps & Tools:');
    const targetApps = ['github', 'gmail', 'slack', 'twilio', 'notion', 'figma'];
    
    for (const app of targetApps) {
      try {
        const tools = await client.tools.list({ apps: [app] });
        if (tools && tools.length > 0) {
          console.log(`\n   ${app.toUpperCase()}: ${tools.length} tools`);
          // Show first 5 tools
          tools.slice(0, 5).forEach(tool => {
            console.log(`      • ${tool.name}`);
          });
        }
      } catch (e) {
        // Skip if app not available
      }
    }
    
    // 4. Show how to connect a new app
    console.log('\n\n📝 To connect a new app:');
    console.log('   1. Run: node scripts/composio-connect.js');
    console.log('   2. Choose option 2 (Setup authentication)');
    console.log('   3. Enter the app name (github, gmail, etc.)');
    console.log('   4. Follow the authentication URL');
    
    // 5. Show quick execute example
    console.log('\n\n💡 Quick Tool Execution Example:');
    console.log(`
const { Composio } = require('composio-core');
const client = new Composio('${apiKey.substring(0, 15)}...');

// Execute a tool
const result = await client.tools.execute({
  connectedAccountId: 'your-account-id',
  toolName: 'github_issues_list',
  input: { repo: 'owner/repo' }
});
`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('✨ Test complete!\n');
}

// Run the test
quickTest().catch(console.error);