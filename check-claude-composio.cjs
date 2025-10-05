const { Composio } = require('@composio/core');

async function checkClaude() {
  const composio = new Composio({ apiKey: 'ak_t-F0AbvfZHUZSUrqAGNn' });

  try {
    console.log('🔍 Extracting Claude SDK from Composio integration...\n');

    // Try to get tools for specific app: ANTHROPIC
    console.log('=== Searching for ANTHROPIC app tools ===');
    try {
      const anthropicTools = await composio.tools.list({ app: 'ANTHROPIC' });
      console.log(`Found ${anthropicTools.length} Anthropic tools:`);
      anthropicTools.forEach(tool => {
        console.log(`  🤖 ${tool.name}: ${tool.description}`);
      });
    } catch (e) {
      console.log('ANTHROPIC app not found, trying alternatives...');
    }

    // Try alternative naming
    const possibleNames = ['CLAUDE', 'ANTHROPIC_CLAUDE', 'ANTHROPIC', 'AI'];
    for (const appName of possibleNames) {
      try {
        console.log(`\n=== Trying app: ${appName} ===`);
        const tools = await composio.tools.list({ app: appName });
        if (tools.length > 0) {
          console.log(`✅ Found ${tools.length} tools for ${appName}:`);
          tools.forEach(tool => {
            console.log(`  🛠️ ${tool.name}: ${tool.description}`);
          });
        }
      } catch (e) {
        console.log(`❌ ${appName} not found`);
      }
    }

    // Get all tools and search broadly
    console.log('\n=== Scanning all available tools ===');
    const allTools = await composio.tools.list();
    console.log(`Total tools available: ${allTools.length}`);

    // Search for AI/LLM tools that might include Claude functionality
    const aiTools = allTools.filter(tool => {
      const name = tool.name.toLowerCase();
      const app = tool.app ? tool.app.toLowerCase() : '';
      const desc = tool.description ? tool.description.toLowerCase() : '';

      return (
        name.includes('ai') || name.includes('llm') || name.includes('chat') ||
        name.includes('text') || name.includes('generate') || name.includes('complete') ||
        app.includes('ai') || app.includes('anthropic') || app.includes('claude') ||
        desc.includes('ai') || desc.includes('llm') || desc.includes('claude')
      );
    });

    console.log(`\n🧠 Found ${aiTools.length} AI/LLM related tools:`);
    aiTools.slice(0, 20).forEach(tool => {
      console.log(`  🔧 ${tool.name} (${tool.app}): ${tool.description}`);
    });

    // Get all apps for reference
    console.log('\n=== Available Apps ===');
    const allApps = await composio.apps.list();
    console.log(`Total apps: ${allApps.length}`);

    const aiApps = allApps.filter(app =>
      app.name.toLowerCase().includes('ai') ||
      app.name.toLowerCase().includes('anthropic') ||
      app.name.toLowerCase().includes('claude') ||
      app.name.toLowerCase().includes('llm')
    );

    console.log(`AI-related apps (${aiApps.length}):`);
    aiApps.forEach(app => {
      console.log(`  📱 ${app.name}: ${app.description}`);
    });

    // Show example of how to use Claude if available
    if (aiTools.length > 0) {
      console.log('\n💡 Example usage for Claude integration:');
      console.log('```javascript');
      console.log('const result = await composio.tools.execute({');
      console.log('  tool: "TOOL_NAME",');
      console.log('  parameters: { prompt: "Hello Claude!" },');
      console.log('  entityId: "user-id"');
      console.log('});');
      console.log('```');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

checkClaude();