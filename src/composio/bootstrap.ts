import { registerInstantlyTools, getInstantlyToolNames, validateInstantlySetup } from './tools/instantly';
import { listAvailableTools } from './runTool';

/**
 * Bootstrap Composio custom tools and attach to MCP server
 */
export async function bootstrapComposioTools(): Promise<void> {
  console.log('[COMPOSIO] Starting bootstrap process...');

  // Validate setup first
  const validation = validateInstantlySetup();
  if (!validation.valid) {
    console.error('[COMPOSIO] Setup validation failed:', validation.errors);
    throw new Error(`Setup validation failed: ${validation.errors.join(', ')}`);
  }

  try {
    // Register Instantly custom tools
    await registerInstantlyTools();
    
    // Log registered tools
    const instantlyToolNames = getInstantlyToolNames();
    console.log('[COMPOSIO] Instantly tools registered:', instantlyToolNames);
    
    // List all available tools for verification
    const allTools = await listAvailableTools();
    const instantlyTools = allTools.filter(tool => tool.startsWith('instantly_'));
    
    console.log('[COMPOSIO] Available Instantly tools in registry:', instantlyTools);
    
    // Validate that our tools are actually available
    if (instantlyTools.length === 0) {
      throw new Error('No Instantly tools found in Composio registry after registration');
    }
    
    console.log(`[COMPOSIO] ✅ Bootstrap complete - ${instantlyTools.length} Instantly tools available`);
    
  } catch (error) {
    console.error('[COMPOSIO] Bootstrap failed:', error);
    throw error;
  }
}

/**
 * Get status of Composio integration
 */
export async function getComposioStatus(): Promise<{
  status: string;
  tools: string[];
  errors: string[];
}> {
  const validation = validateInstantlySetup();
  
  try {
    const allTools = await listAvailableTools();
    const instantlyTools = allTools.filter(tool => tool.startsWith('instantly_'));
    
    return {
      status: validation.valid && instantlyTools.length > 0 ? 'ready' : 'error',
      tools: instantlyTools,
      errors: validation.errors
    };
    
  } catch (error) {
    return {
      status: 'error',
      tools: [],
      errors: [...validation.errors, error instanceof Error ? error.message : 'Unknown error']
    };
  }
}