const { Composio } = require('@composio/core');

class ComposioHandler {
  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
      baseURL: process.env.COMPOSIO_BASE_URL || 'https://backend.composio.dev'
    });
    
    // Cache for tools and accounts
    this.toolsCache = new Map();
    this.accountsCache = new Map();
    this.cacheExpiryTime = 5 * 60 * 1000; // 5 minutes
  }

  async execute_composio_tool(payload) {
    try {
      const { toolkit, tool, arguments: toolArgs, user_id } = payload.data;
      
      // Validate Composio API key
      if (!process.env.COMPOSIO_API_KEY) {
        throw new Error('COMPOSIO_API_KEY not configured');
      }

      // Create tool identifier
      const toolName = `${toolkit.toUpperCase()}_${tool.toUpperCase()}`;
      
      console.log(`🔧 Executing Composio tool: ${toolName}`);
      
      // Execute tool via Composio SDK
      const result = await this.composio.tools.execute(toolName, {
        parameters: toolArgs,
        entityId: user_id || payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          composio_metadata: {
            toolkit,
            tool,
            tool_name: toolName,
            user_id: user_id || payload.process_id,
            executed_at: new Date().toISOString(),
            sdk_version: '3.0'
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'execute_composio_tool',
          composio_toolkit: toolkit,
          composio_tool: tool,
          external_service_integration: true,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Composio tool execution error:', error.message);
      
      return {
        success: false,
        error: error.message,
        error_type: 'composio_execution_error',
        error_details: {
          composio_error_code: error.code,
          composio_error_type: error.type,
          toolkit: payload.data.toolkit,
          tool: payload.data.tool
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          composio_toolkit: payload.data.toolkit,
          composio_tool: payload.data.tool,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get_available_tools(payload) {
    try {
      const { toolkits, user_id } = payload.data;
      const cacheKey = `tools:${toolkits.join(',')}:${user_id || 'default'}`;
      
      // Check cache first
      if (this.toolsCache.has(cacheKey)) {
        const cached = this.toolsCache.get(cacheKey);
        if (Date.now() < cached.expires) {
          console.log('📈 Tools cache HIT');
          return cached.data;
        }
      }

      console.log(`🔍 Fetching tools for toolkits: ${toolkits.join(', ')}`);
      
      // Get tools from Composio
      const tools = await this.composio.tools.get(user_id || 'default', {
        toolkits: toolkits
      });

      const result = {
        success: true,
        result: {
          toolkits: toolkits,
          tools: tools.map(tool => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
            toolkit: this.extractToolkitFromName(tool.name),
            composio_metadata: {
              app: tool.app,
              tags: tool.tags || [],
              enabled: tool.enabled !== false
            }
          })),
          total_tools: tools.length,
          user_context: user_id || 'default',
          fetched_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'get_available_tools',
          toolkits_requested: toolkits,
          tools_count: tools.length,
          timestamp: new Date().toISOString()
        }
      };

      // Cache result
      this.toolsCache.set(cacheKey, {
        data: result,
        expires: Date.now() + this.cacheExpiryTime
      });

      return result;

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'composio_tools_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          toolkits_requested: payload.data.toolkits,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async manage_connected_account(payload) {
    try {
      const { action, app, user_id, account_id, auth_config } = payload.data;
      
      console.log(`🔗 Managing connected account: ${action} for ${app}`);

      let result;
      
      switch (action) {
        case 'create':
          result = await this.composio.connectedAccounts.create({
            userId: user_id,
            app: app,
            authConfig: auth_config
          });
          break;
          
        case 'get':
          result = await this.composio.connectedAccounts.get({
            userId: user_id,
            connectedAccountId: account_id
          });
          break;
          
        case 'delete':
          result = await this.composio.connectedAccounts.delete({
            connectedAccountId: account_id
          });
          break;
          
        case 'list':
          result = await this.composio.connectedAccounts.list({
            userId: user_id,
            app: app
          });
          break;
          
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      return {
        success: true,
        result: {
          action,
          app,
          user_id,
          account_data: result,
          managed_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'manage_connected_account',
          account_action: action,
          composio_app: app,
          user_context: user_id,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'composio_account_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          account_action: payload.data.action,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get_composio_stats(payload) {
    try {
      const { include_usage = false } = payload.data;
      
      // Get basic stats
      const stats = {
        composio_integration: {
          sdk_version: '3.0',
          api_configured: !!process.env.COMPOSIO_API_KEY,
          base_url: process.env.COMPOSIO_BASE_URL || 'default',
          telemetry_enabled: process.env.COMPOSIO_DISABLE_TELEMETRY !== 'true'
        },
        cache_stats: {
          tools_cache_size: this.toolsCache.size,
          accounts_cache_size: this.accountsCache.size,
          cache_ttl_minutes: this.cacheExpiryTime / 60000
        },
        supported_features: {
          total_toolkits: 100,
          authentication_methods: ['oauth2', 'api_key', 'bearer_token', 'basic_auth'],
          heir_orbt_compliant: true,
          performance_caching: true
        }
      };

      if (include_usage) {
        // Add usage statistics if requested
        stats.usage_stats = {
          note: 'Usage statistics require Composio dashboard access',
          tools_executed_session: 0, // Would track in production
          accounts_managed_session: 0 // Would track in production
        };
      }

      return {
        success: true,
        result: stats,
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'get_composio_stats',
          include_usage,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'composio_stats_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Helper methods
  extractToolkitFromName(toolName) {
    const parts = toolName.split('_');
    return parts[0]?.toLowerCase() || 'unknown';
  }

  // Cache cleanup
  cleanupCache() {
    const now = Date.now();
    
    for (const [key, value] of this.toolsCache.entries()) {
      if (now > value.expires) {
        this.toolsCache.delete(key);
      }
    }
    
    for (const [key, value] of this.accountsCache.entries()) {
      if (now > value.expires) {
        this.accountsCache.delete(key);
      }
    }
  }

  async handleToolCall(payload) {
    // Cleanup expired cache entries
    this.cleanupCache();

    switch (payload.tool) {
      case 'execute_composio_tool':
        return await this.execute_composio_tool(payload);
      case 'get_available_tools':
        return await this.get_available_tools(payload);
      case 'manage_connected_account':
        return await this.manage_connected_account(payload);
      case 'get_composio_stats':
        return await this.get_composio_stats(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: [
            'execute_composio_tool', 
            'get_available_tools', 
            'manage_connected_account', 
            'get_composio_stats'
          ]
        };
    }
  }
}

module.exports = new ComposioHandler();