import { ComposioToolSet } from 'composio-core';
import * as fs from 'fs';
import * as path from 'path';

interface InstantlyRecipe {
  rateLimitPerMin: number;
  timeoutMs: number;
  retries: number;
  backoffMs: number;
  idempotency: boolean;
}

interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  implementation: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers: Record<string, string>;
    body?: any;
  };
}

// Load configuration
function loadInstantlyRecipe(): InstantlyRecipe {
  const recipePath = path.join(__dirname, '../recipes/instantly.json');
  const recipeContent = fs.readFileSync(recipePath, 'utf8');
  return JSON.parse(recipeContent);
}

// Get environment variables with validation
function getEnvVars() {
  const vars = {
    INSTANTLY_BASE_URL: process.env.INSTANTLY_BASE_URL,
    INSTANTLY_BASIC_B64: process.env.INSTANTLY_BASIC_B64,
    MCP_DISABLE_INSTANTLY: process.env.MCP_DISABLE_INSTANTLY === 'true',
  };

  if (!vars.INSTANTLY_BASE_URL || !vars.INSTANTLY_BASIC_B64) {
    throw new Error('Missing required Instantly environment variables');
  }

  return vars;
}

// Define all Instantly custom tools
const instantlyTools: ToolDefinition[] = [
  {
    name: 'instantly_whoami',
    description: 'Get current workspace information from Instantly.ai',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    implementation: {
      method: 'GET',
      url: '/api/v2/workspaces/current',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  },
  {
    name: 'instantly_create_campaign',
    description: 'Create a new email campaign in Instantly.ai',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Campaign name'
        },
        sending_account_id: {
          type: 'string',
          description: 'ID of the sending email account (optional)'
        },
        subject_line: {
          type: 'string',
          description: 'Email subject line'
        },
        body: {
          type: 'string',
          description: 'Email body content'
        },
        track_opens: {
          type: 'boolean',
          description: 'Enable open tracking',
          default: true
        },
        track_clicks: {
          type: 'boolean',
          description: 'Enable click tracking', 
          default: true
        }
      },
      required: ['name']
    },
    implementation: {
      method: 'POST',
      url: '/api/v2/campaigns',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'REQUEST_BODY'
    }
  },
  {
    name: 'instantly_add_leads_batch',
    description: 'Add multiple leads to Instantly.ai campaigns',
    parameters: {
      type: 'object',
      properties: {
        leads: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'Lead email address'
              },
              first_name: {
                type: 'string',
                description: 'Lead first name'
              },
              last_name: {
                type: 'string', 
                description: 'Lead last name'
              },
              company: {
                type: 'string',
                description: 'Lead company'
              },
              campaign_id: {
                type: 'string',
                description: 'Campaign ID to add lead to'
              }
            },
            required: ['email']
          },
          description: 'Array of lead objects to add'
        }
      },
      required: ['leads']
    },
    implementation: {
      method: 'POST',
      url: '/api/v2/leads/list',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'REQUEST_BODY'
    }
  },
  {
    name: 'instantly_campaign_activate',
    description: 'Activate an Instantly.ai campaign',
    parameters: {
      type: 'object',
      properties: {
        campaign_id: {
          type: 'string',
          description: 'ID of the campaign to activate'
        }
      },
      required: ['campaign_id']
    },
    implementation: {
      method: 'POST',
      url: '/api/v2/campaigns/{campaign_id}/activate',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  },
  {
    name: 'instantly_campaign_pause',
    description: 'Pause an Instantly.ai campaign',
    parameters: {
      type: 'object',
      properties: {
        campaign_id: {
          type: 'string',
          description: 'ID of the campaign to pause'
        }
      },
      required: ['campaign_id']
    },
    implementation: {
      method: 'POST',
      url: '/api/v2/campaigns/{campaign_id}/pause',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  }
];

/**
 * Register all Instantly custom tools with Composio
 */
export async function registerInstantlyTools(): Promise<void> {
  const env = getEnvVars();
  
  if (env.MCP_DISABLE_INSTANTLY) {
    console.log('[INSTANTLY] Tools disabled by MCP_DISABLE_INSTANTLY flag');
    return;
  }

  const recipe = loadInstantlyRecipe();
  const composio = new ComposioToolSet({ 
    apiKey: process.env.COMPOSIO_API_KEY 
  });

  console.log('[INSTANTLY] Registering custom tools with Composio...');

  for (const tool of instantlyTools) {
    try {
      // Prepare the tool configuration for Composio
      const toolConfig = {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        implementation: {
          // Create a custom implementation that uses our HTTP spec
          type: 'http',
          config: {
            method: tool.implementation.method,
            url: `${env.INSTANTLY_BASE_URL}${tool.implementation.url}`,
            headers: {
              ...tool.implementation.headers,
              'Authorization': `Basic ${env.INSTANTLY_BASIC_B64}`
            },
            timeout: recipe.timeoutMs,
            retries: recipe.retries,
            backoff: recipe.backoffMs
          }
        }
      };

      // Register the custom tool
      await composio.createCustomTool(toolConfig);
      
      console.log(`[INSTANTLY] ✅ Registered tool: ${tool.name}`);
      
    } catch (error) {
      console.error(`[INSTANTLY] ❌ Failed to register tool ${tool.name}:`, error);
      throw error;
    }
  }

  console.log(`[INSTANTLY] Successfully registered ${instantlyTools.length} custom tools`);
}

/**
 * Get list of registered Instantly tool names
 */
export function getInstantlyToolNames(): string[] {
  return instantlyTools.map(tool => tool.name);
}

/**
 * Check if Instantly tools are enabled
 */
export function areInstantlyToolsEnabled(): boolean {
  return process.env.MCP_DISABLE_INSTANTLY !== 'true';
}

/**
 * Validate environment setup for Instantly tools
 */
export function validateInstantlySetup(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    getEnvVars();
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Environment validation failed');
  }

  try {
    loadInstantlyRecipe();
  } catch (error) {
    errors.push('Failed to load instantly.json recipe');
  }

  if (!process.env.COMPOSIO_API_KEY) {
    errors.push('COMPOSIO_API_KEY not found');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}