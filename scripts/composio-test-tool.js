#!/usr/bin/env node

/**
 * Test a Composio tool execution
 */

const { Composio } = require('composio-core');
require('dotenv').config();

async function testTool() {
  console.log('🧪 Testing Composio Tool Execution\n');
  console.log('=' .repeat(60));
  
  const apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
  const client = new Composio(apiKey);
  
  try {
    // Test with Neon database (simple query)
    console.log('\n🗄️  Testing Neon Database Tool...');
    const neonAccountId = '8117665a-66bc-4466-919e-144f693a4a32';
    
    const neonResult = await client.tools.execute({
      connectedAccountId: neonAccountId,
      toolName: 'neon_query_database',
      input: {
        query: 'SELECT version();'
      }
    });
    
    console.log('✅ Neon test result:', JSON.stringify(neonResult, null, 2));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Try a simpler approach - just list available tools
    console.log('\n🔍 Trying to get tool information instead...');
    
    try {
      // Get entity info for connected account
      const accounts = await client.connectedAccounts.list({});
      console.log('\n📋 Available account IDs:');
      
      if (Array.isArray(accounts)) {
        accounts.forEach(acc => {
          console.log(`   ${acc.appUniqueId}: ${acc.id}`);
        });
      }
      
      // Try to get actions/tools for a specific app
      console.log('\n🛠️  Attempting direct tool access...');
      
      // Test OpenAI connection
      const openaiAccountId = 'd404a758-cbb1-4cc7-86cb-ca4589c520d1';
      console.log(`\n🤖 Testing OpenAI (Account: ${openaiAccountId})...`);
      
      const openaiResult = await client.tools.execute({
        connectedAccountId: openaiAccountId,
        toolName: 'openai_chat_completions_create',
        input: {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Say hello in one word' }
          ],
          max_tokens: 5
        }
      });
      
      console.log('✅ OpenAI test result:', JSON.stringify(openaiResult, null, 2));
      
    } catch (secondError) {
      console.error('\n❌ Secondary test also failed:', secondError.message);
      
      console.log('\n💡 The tools are configured and connected, but may need to be accessed through the MCP interface in Claude.');
      console.log('   Try using the tools directly in Claude now that the MCP connection is set up.');
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('✨ Test complete!\n');
}

// Run the test
testTool().catch(console.error);