require('dotenv').config();
const { Composio } = require('@composio/core');

async function testNeonConnection() {
  console.log('🔍 Testing Neon Database connection through Composio...\n');
  
  try {
    // Initialize Composio client
    const composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      baseURL: process.env.COMPOSIO_BASE_URL || 'https://backend.composio.dev'
    });
    
    console.log('✅ Composio client initialized');
    console.log(`   API Key: ${process.env.COMPOSIO_API_KEY ? '***' + process.env.COMPOSIO_API_KEY.slice(-4) : 'NOT SET'}`);
    
    // Check available integrations
    console.log('\n📋 Checking available integrations...');
    
    try {
      // Try to get available tools
      const apps = await composio.apps.list();
      console.log(`   Found ${apps.length} available apps`);
      
      // Check if Neon or PostgreSQL is available
      const dbApps = apps.filter(app => 
        app.name?.toLowerCase().includes('neon') || 
        app.name?.toLowerCase().includes('postgres') ||
        app.name?.toLowerCase().includes('database')
      );
      
      if (dbApps.length > 0) {
        console.log('\n🗄️ Database-related apps found:');
        dbApps.forEach(app => {
          console.log(`   - ${app.name}: ${app.description || 'No description'}`);
        });
      } else {
        console.log('\n⚠️ No direct Neon/PostgreSQL integration found in Composio');
        console.log('   You may need to use a generic database connector or HTTP API');
      }
    } catch (appError) {
      console.log('\n⚠️ Could not fetch app list:', appError.message);
      console.log('   This might be due to API limitations or permissions');
    }
    
    // Test direct Neon connection (without Composio)
    console.log('\n🔌 Testing direct Neon connection...');
    console.log(`   URL: ${process.env.NEON_DATABASE_URL || 'NOT SET'}`);
    
    if (process.env.NEON_DATABASE_URL) {
      // For now, just check if the URL is reachable
      const fetch = require('node-fetch');
      try {
        const response = await fetch(process.env.NEON_DATABASE_URL + '/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(`   Response status: ${response.status}`);
        if (response.ok) {
          console.log('   ✅ Neon endpoint is reachable');
        } else {
          console.log('   ⚠️ Neon endpoint returned non-OK status');
        }
      } catch (fetchError) {
        console.log('   ℹ️ Could not reach Neon endpoint directly');
        console.log('   This is expected if it requires database protocol, not HTTP');
      }
    }
    
    // Suggest alternative approaches
    console.log('\n💡 Recommended approaches for Neon integration:');
    console.log('   1. Use @neondatabase/serverless package directly');
    console.log('   2. Create custom MCP tools that wrap Neon operations');
    console.log('   3. Use Composio\'s HTTP/REST capabilities if Neon has an API');
    console.log('   4. Check if Composio has a generic PostgreSQL connector');
    
    // Check our custom credentials
    console.log('\n🔑 Credentials status:');
    console.log(`   Instantly API: ${process.env.INSTANTLY_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`   HeyReach API: ${process.env.HEYREACH_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`   Smartsheet API: ${process.env.SMARTSHEET_API_TOKEN ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`   Neon Database URL: ${process.env.NEON_DATABASE_URL ? '✅ SET' : '❌ NOT SET'}`);
    
  } catch (error) {
    console.error('\n❌ Error testing connection:', error.message);
    console.error('   Full error:', error);
  }
}

// Run the test
testNeonConnection().then(() => {
  console.log('\n✅ Test complete');
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});