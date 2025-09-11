#!/usr/bin/env node

/**
 * Connect Builder.io API key to Composio
 */

const { Composio } = require('composio-core');
require('dotenv').config();

async function connectBuilderIO() {
  console.log('🏗️  Connecting Builder.io to Composio\n');
  console.log('=' .repeat(50));
  
  const apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
  const builderIOKey = process.env.BUILDER_IO_API_KEY;
  
  if (!builderIOKey) {
    console.error('❌ Builder.io API key not found in .env file');
    console.log('   Expected: BUILDER_IO_API_KEY=9502e3493ccf42339f36d16b4a482c70');
    return;
  }
  
  console.log(`✅ Builder.io API Key: ${builderIOKey.substring(0, 10)}...`);
  
  const client = new Composio(apiKey);
  
  try {
    console.log('\n🔄 Connecting Builder.io to Composio...');
    
    const account = await client.connectedAccounts.create({
      appName: 'builder_io',
      authMode: 'API_KEY',
      authConfig: {
        api_key: builderIOKey
      },
      userId: 'default'
    });
    
    console.log('✅ Builder.io connected successfully!');
    console.log(`   Account ID: ${account.id}`);
    console.log(`   App: ${account.appUniqueId || 'builder_io'}`);
    console.log(`   Status: ${account.status || 'ACTIVE'}`);
    
    console.log('\n🎯 Available Builder.io Tools:');
    console.log('   • builder_io_create_space - Create content spaces');
    console.log('   • builder_io_create_model - Create content models');
    console.log('   • builder_io_create_content - Create content entries');
    console.log('   • builder_io_get_content - Retrieve content');
    console.log('   • builder_io_scaffold_altitude_cms - Generate from CTB specs');
    
    console.log('\n💡 Try in Claude:');
    console.log('   "Create a new Builder.io space for my project"');
    console.log('   "Generate a CMS structure from my CTB specifications"');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('\n🔍 Builder.io may already be connected. Checking existing connections...');
      
      try {
        const accounts = await client.connectedAccounts.list({});
        const builderAccount = accounts.find(acc => 
          (acc.appUniqueId || acc.app_unique_id || '').toLowerCase().includes('builder')
        );
        
        if (builderAccount) {
          console.log('✅ Found existing Builder.io connection:');
          console.log(`   Account ID: ${builderAccount.id}`);
          console.log(`   Status: ${builderAccount.status || 'ACTIVE'}`);
        }
      } catch (listError) {
        console.log('Could not check existing connections:', listError.message);
      }
    } else {
      console.log('\n💡 Troubleshooting:');
      console.log('   • Verify API key is correct and active');
      console.log('   • Check Builder.io account permissions');
      console.log('   • Try again in a few minutes');
    }
  }
  
  console.log('\n' + '=' .repeat(50));
}

// Run the connection
connectBuilderIO().catch(console.error);