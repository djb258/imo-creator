#!/usr/bin/env node

/**
 * Get Composio Account Information including UUID
 */

const { Composio } = require('composio-core');
require('dotenv').config();

async function getComposioInfo() {
  console.log('🔍 Fetching Composio Account Information\n');
  console.log('=' .repeat(60));
  
  const apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
  const client = new Composio(apiKey);
  
  try {
    // 1. Get API Key info
    console.log('\n📋 API Key Info:');
    console.log(`   Key: ${apiKey.substring(0, 20)}...`);
    console.log(`   Base URL: https://backend.composio.dev`);
    
    // 2. Try to get user/account info
    console.log('\n👤 Account Information:');
    
    // Try different methods to get user info
    try {
      // Method 1: Get whoami or user info if available
      const userInfo = await client.getUser?.() || await client.whoami?.();
      if (userInfo) {
        console.log('   User ID:', userInfo.id || userInfo.uuid || userInfo.user_id);
        console.log('   Email:', userInfo.email || 'N/A');
        console.log('   Name:', userInfo.name || 'N/A');
      }
    } catch (e) {
      // Try alternative method
    }
    
    // 3. Get connected accounts to infer user ID
    console.log('\n🔗 Connected Accounts:');
    try {
      const response = await client.connectedAccounts.list({});
      
      // The response might be an object with items or directly an array
      const accounts = response.items || response.accounts || response || [];
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        accounts.forEach(acc => {
          console.log(`\n   App: ${acc.appUniqueId || acc.app_unique_id}`);
          console.log(`   Account ID: ${acc.id}`);
          console.log(`   User ID: ${acc.userId || acc.user_id || 'default'}`);
          console.log(`   Status: ${acc.status || 'active'}`);
        });
        
        // Extract user ID from first account
        const userId = accounts[0].userId || accounts[0].user_id;
        if (userId) {
          console.log(`\n✅ Your Composio User ID: ${userId}`);
        }
      } else {
        console.log('   No connected accounts yet');
        console.log('\n💡 Default User ID: "default" or "user-1"');
        console.log('   (Composio often uses "default" as the user ID)');
      }
    } catch (e) {
      console.log('   Could not fetch accounts:', e.message);
      console.log('\n💡 Try using "default" as your user ID');
    }
    
    // 4. Show example usage
    console.log('\n📝 Example Usage:');
    console.log(`
// When connecting accounts:
const account = await client.connectedAccounts.create({
  userId: 'default',  // or your specific user ID
  appName: 'github',
  authMode: 'OAUTH2'
});

// When executing tools:
const result = await client.tools.execute({
  connectedAccountId: account.id,
  toolName: 'github_issues_list',
  input: { repo: 'owner/repo' }
});
`);
    
    // 5. Test with default user
    console.log('\n🧪 Testing with "default" user ID...');
    try {
      const testAccounts = await client.connectedAccounts.list({ userId: 'default' });
      if (testAccounts) {
        console.log('✅ "default" user ID is valid for your account');
      }
    } catch (e) {
      // Try without user ID
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Tip: For most operations, you can use "default" as the user ID');
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('✨ Info retrieval complete!\n');
}

// Run the script
getComposioInfo().catch(console.error);