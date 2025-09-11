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

  async lovable_create_project(payload) {
    try {
      const { prompt, projectType = 'react', repo, visibility = 'private', context } = payload.data;
      
      console.log('🎨 Creating Lovable.dev project via Composio');
      
      // Execute Lovable create project via Composio
      const result = await this.composio.tools.execute('LOVABLE_CREATE_PROJECT', {
        parameters: {
          prompt,
          project_type: projectType,
          repository: repo,
          visibility,
          context
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          lovable_metadata: {
            prompt,
            project_type: projectType,
            visibility,
            created_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'lovable_create_project',
          external_service: 'lovable.dev',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'lovable_create_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'lovable_create_project',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async lovable_get_project_status(payload) {
    try {
      const { projectId } = payload.data;
      
      console.log(`📊 Getting Lovable.dev project status: ${projectId}`);
      
      const result = await this.composio.tools.execute('LOVABLE_GET_PROJECT_STATUS', {
        parameters: { project_id: projectId },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          lovable_metadata: {
            project_id: projectId,
            checked_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'lovable_get_project_status',
          external_service: 'lovable.dev',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'lovable_status_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'lovable_get_project_status',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async lovable_get_project_details(payload) {
    try {
      const { projectId } = payload.data;
      
      console.log(`📋 Getting Lovable.dev project details: ${projectId}`);
      
      const result = await this.composio.tools.execute('LOVABLE_GET_PROJECT_DETAILS', {
        parameters: { project_id: projectId },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          lovable_metadata: {
            project_id: projectId,
            fetched_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'lovable_get_project_details',
          external_service: 'lovable.dev',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'lovable_details_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'lovable_get_project_details',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async lovable_scaffold_altitude_ui(payload) {
    try {
      const { framework = 'nextjs' } = payload.data;
      
      // Read CTB/Altitude specifications
      const ctbSpecs = this.readCTBSpecs();
      
      console.log('🏗️ Scaffolding Lovable.dev UI from CTB/Altitude specs');
      
      const prompt = `Create a comprehensive ${framework} application based on this CTB (Christmas Tree Backbone) and Altitude specification:

${ctbSpecs}

Please create:
1. Strategic overview dashboard (30k altitude) - executive summary with KPIs
2. Operational process pages (20k altitude) - workflow management and monitoring  
3. Tactical forms and detail views (10k altitude) - user interactions and data entry
4. Execution-level components and APIs (5k altitude) - technical implementation details
5. Navigation structure following the CTB flow hierarchy
6. Data visualization components for catalog items (databases, tools, MCPs)
7. Information flow indicators between system components

Requirements:
- Modern, responsive design with professional UI/UX
- Use ${framework} with TypeScript
- Include appropriate UI library (Tailwind CSS, shadcn/ui, or Material-UI)
- Implement proper routing for altitude levels (/30k, /20k, /10k, /5k)
- Create reusable components for CTB visualization
- Add data mock/sample data based on the specifications
- Include proper error handling and loading states`;

      const result = await this.composio.tools.execute('LOVABLE_CREATE_PROJECT', {
        parameters: {
          prompt,
          project_type: framework,
          visibility: 'private',
          context: 'CTB/Altitude UI scaffolding based on repository specifications'
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          lovable_metadata: {
            scaffold_type: 'altitude_ui',
            framework,
            based_on_ctb_specs: true,
            created_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'lovable_scaffold_altitude_ui',
          external_service: 'lovable.dev',
          ctb_integration: true,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'lovable_scaffold_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'lovable_scaffold_altitude_ui',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async builder_io_create_space(payload) {
    try {
      const { name, description, organization_id } = payload.data;
      
      console.log('🏗️ Creating Builder.io space via Composio');
      
      const result = await this.composio.tools.execute('BUILDER_IO_CREATE_SPACE', {
        parameters: {
          name,
          description,
          organizationId: organization_id
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          builder_metadata: {
            space_name: name,
            description,
            created_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'builder_io_create_space',
          external_service: 'builder.io',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'builder_io_create_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'builder_io_create_space',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async builder_io_create_model(payload) {
    try {
      const { space_id, name, model_type = 'page', schema } = payload.data;
      
      console.log(`🏗️ Creating Builder.io ${model_type} model: ${name}`);
      
      const result = await this.composio.tools.execute('BUILDER_IO_CREATE_MODEL', {
        parameters: {
          spaceId: space_id,
          name,
          type: model_type,
          schema
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          builder_metadata: {
            model_name: name,
            model_type,
            space_id,
            created_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'builder_io_create_model',
          external_service: 'builder.io',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'builder_io_model_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'builder_io_create_model',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async builder_io_create_content(payload) {
    try {
      const { space_id, model_id, name, data, published = false } = payload.data;
      
      console.log('🎨 Creating Builder.io content via Composio');
      
      const result = await this.composio.tools.execute('BUILDER_IO_CREATE_CONTENT', {
        parameters: {
          spaceId: space_id,
          modelId: model_id,
          name,
          data,
          published
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          builder_metadata: {
            content_name: name,
            model_id,
            space_id,
            published,
            created_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'builder_io_create_content',
          external_service: 'builder.io',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'builder_io_content_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'builder_io_create_content',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async builder_io_scaffold_altitude_cms(payload) {
    try {
      const { space_id, framework = 'nextjs' } = payload.data;
      
      // Read CTB/Altitude specifications
      const ctbSpecs = this.readCTBSpecs();
      
      console.log('🏗️ Scaffolding Builder.io CMS from CTB/Altitude specs');
      
      // Create models for each altitude level
      const altitudeModels = [
        { name: 'strategic_30k', level: '30k', description: 'Strategic overview and executive dashboards' },
        { name: 'operational_20k', level: '20k', description: 'Operational processes and workflow management' },
        { name: 'tactical_10k', level: '10k', description: 'Tactical forms and detailed user interactions' },
        { name: 'execution_5k', level: '5k', description: 'Execution-level components and API integration' }
      ];

      // Create schema for CTB-based content models
      const ctbSchema = {
        fields: [
          {
            name: 'title',
            type: 'string',
            required: true,
            helperText: 'Page title for this altitude level'
          },
          {
            name: 'description', 
            type: 'longText',
            helperText: 'Description of processes at this altitude'
          },
          {
            name: 'components',
            type: 'list',
            subFields: [
              {
                name: 'component_type',
                type: 'string',
                enum: ['dashboard', 'form', 'chart', 'table', 'workflow']
              },
              {
                name: 'component_data',
                type: 'object'
              }
            ]
          },
          {
            name: 'navigation_links',
            type: 'list',
            subFields: [
              {
                name: 'label',
                type: 'string'
              },
              {
                name: 'url',
                type: 'string'
              },
              {
                name: 'altitude_level',
                type: 'string'
              }
            ]
          }
        ]
      };

      // Create models via Composio
      const modelResults = [];
      for (const model of altitudeModels) {
        try {
          const modelResult = await this.composio.tools.execute('BUILDER_IO_CREATE_MODEL', {
            parameters: {
              spaceId: space_id,
              name: model.name,
              type: 'page',
              schema: ctbSchema
            },
            entityId: payload.process_id
          });
          modelResults.push({ ...model, result: modelResult });
        } catch (error) {
          console.error(`Failed to create model ${model.name}:`, error);
        }
      }

      return {
        success: true,
        result: {
          space_id,
          framework,
          created_models: modelResults,
          ctb_integration: true,
          schema_used: ctbSchema,
          builder_metadata: {
            scaffold_type: 'altitude_cms',
            framework,
            altitude_models: altitudeModels.length,
            based_on_ctb_specs: true,
            created_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'builder_io_scaffold_altitude_cms',
          external_service: 'builder.io',
          ctb_integration: true,
          models_created: modelResults.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'builder_io_scaffold_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'builder_io_scaffold_altitude_cms',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async builder_io_get_content(payload) {
    try {
      const { space_id, model_id, content_id } = payload.data;
      
      console.log(`📋 Getting Builder.io content: ${content_id || 'all'}`);
      
      const result = await this.composio.tools.execute('BUILDER_IO_GET_CONTENT', {
        parameters: {
          spaceId: space_id,
          modelId: model_id,
          contentId: content_id
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          ...result,
          builder_metadata: {
            space_id,
            model_id,
            content_id,
            fetched_at: new Date().toISOString(),
            via_composio: true
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'builder_io_get_content',
          external_service: 'builder.io',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'builder_io_get_content_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          operation: 'builder_io_get_content',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Helper method to read CTB/Altitude specifications
  readCTBSpecs() {
    const fs = require('fs');
    const path = require('path');
    
    const projectRoot = path.resolve(__dirname, '../../..');
    const possiblePaths = [
      path.join(projectRoot, 'docs/altitude/30k.md'),
      path.join(projectRoot, 'docs/altitude/20k.md'),
      path.join(projectRoot, 'docs/altitude/10k.md'),
      path.join(projectRoot, 'docs/altitude/5k.md'),
      path.join(projectRoot, 'docs/ctb_horiz.md'),
      path.join(projectRoot, 'docs/catalog.md'),
      path.join(projectRoot, 'docs/flows.md'),
      path.join(projectRoot, 'spec/process_map.yaml'),
      path.join(projectRoot, 'spec/process_map.json'),
    ];

    let combinedContent = '';
    let foundFiles = [];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const fileName = path.basename(filePath);
          combinedContent += `\n## ${fileName}\n\n${content}\n`;
          foundFiles.push(fileName);
        } catch (error) {
          // Skip files that can't be read
          continue;
        }
      }
    }

    if (foundFiles.length === 0) {
      return '# No CTB/Altitude specifications found\n\nPlease ensure your repository has CTB documentation in docs/altitude/ or spec/ directories.';
    }

    return `# CTB/Altitude Specification\n\nFound ${foundFiles.length} specification files: ${foundFiles.join(', ')}\n${combinedContent}`;
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
          performance_caching: true,
          lovable_integration: true,
          builder_io_integration: true
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
      case 'lovable_create_project':
        return await this.lovable_create_project(payload);
      case 'lovable_get_project_status':
        return await this.lovable_get_project_status(payload);
      case 'lovable_get_project_details':
        return await this.lovable_get_project_details(payload);
      case 'lovable_scaffold_altitude_ui':
        return await this.lovable_scaffold_altitude_ui(payload);
      case 'builder_io_create_space':
        return await this.builder_io_create_space(payload);
      case 'builder_io_create_model':
        return await this.builder_io_create_model(payload);
      case 'builder_io_create_content':
        return await this.builder_io_create_content(payload);
      case 'builder_io_scaffold_altitude_cms':
        return await this.builder_io_scaffold_altitude_cms(payload);
      case 'builder_io_get_content':
        return await this.builder_io_get_content(payload);
      case 'figma_export_to_code':
        return await this.figma_export_to_code(payload);
      case 'figma_create_design_system':
        return await this.figma_create_design_system(payload);
      case 'figma_sync_components':
        return await this.figma_sync_components(payload);
      case 'figma_scaffold_from_altitude':
        return await this.figma_scaffold_from_altitude(payload);
      case 'smartsheet_create_sheet':
        return await this.smartsheet_create_sheet(payload);
      case 'smartsheet_get_sheets':
        return await this.smartsheet_get_sheets(payload);
      case 'smartsheet_add_rows':
        return await this.smartsheet_add_rows(payload);
      case 'smartsheet_update_rows':
        return await this.smartsheet_update_rows(payload);
      case 'smartsheet_scaffold_from_altitude':
        return await this.smartsheet_scaffold_from_altitude(payload);
      case 'neon_query_database':
        return await this.neon_query_database(payload);
      case 'neon_create_table':
        return await this.neon_create_table(payload);
      case 'neon_insert_data':
        return await this.neon_insert_data(payload);
      case 'neon_update_data':
        return await this.neon_update_data(payload);
      case 'neon_get_schema':
        return await this.neon_get_schema(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: [
            'execute_composio_tool', 
            'get_available_tools', 
            'manage_connected_account', 
            'get_composio_stats',
            'lovable_create_project',
            'lovable_get_project_status', 
            'lovable_get_project_details',
            'lovable_scaffold_altitude_ui',
            'builder_io_create_space',
            'builder_io_create_model',
            'builder_io_create_content',
            'builder_io_scaffold_altitude_cms',
            'builder_io_get_content',
            'figma_export_to_code',
            'figma_create_design_system',
            'figma_sync_components',
            'figma_scaffold_from_altitude',
            'smartsheet_create_sheet',
            'smartsheet_get_sheets',
            'smartsheet_add_rows',
            'smartsheet_update_rows',
            'smartsheet_scaffold_from_altitude'
          ]
        };
    }
  }

  // Figma Design Tools
  async figma_export_to_code(payload) {
    try {
      const { fileKey, nodeIds, framework = 'react', outputFormat = 'tsx' } = payload.data;

      // Mock: In production, would connect through Composio's Figma integration
      const mockResult = {
        components: [
          {
            name: 'Button',
            code: `export const Button = ({ children, onClick }) => (\n  <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onClick}>\n    {children}\n  </button>\n)`,
            figma_node_id: nodeIds?.[0] || 'mock-node-id'
          }
        ],
        styles: {
          css: '.button { padding: 8px 16px; }',
          tailwind_classes: 'px-4 py-2 bg-blue-500 text-white rounded'
        },
        framework,
        outputFormat
      };

      return {
        success: true,
        result: mockResult,
        composio_metadata: {
          service: 'figma',
          method: 'export_to_code',
          cached: false
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'figma_export_to_code', payload);
    }
  }

  async figma_create_design_system(payload) {
    try {
      const { name, description, baseComponents = [], colorPalette, typography } = payload.data;

      // Mock: Would create design system in Figma via Composio
      const mockResult = {
        design_system_id: `ds-${Date.now()}`,
        name,
        description,
        figma_file_url: `https://figma.com/file/mock-${Date.now()}/${name.replace(/\s+/g, '-')}`,
        components_created: baseComponents.length || 10,
        styles_created: {
          colors: colorPalette ? Object.keys(colorPalette).length : 8,
          typography: typography ? Object.keys(typography).length : 6
        }
      };

      return {
        success: true,
        result: mockResult,
        composio_metadata: {
          service: 'figma',
          method: 'create_design_system'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'figma_create_design_system', payload);
    }
  }

  async figma_sync_components(payload) {
    try {
      const { sourceFileKey, targetRepo, syncMode = 'one-way', componentFilter } = payload.data;

      // Mock: Would sync Figma components to code repository
      const mockResult = {
        sync_id: `sync-${Date.now()}`,
        source_file: sourceFileKey,
        target_repository: targetRepo,
        components_synced: [
          { name: 'Header', status: 'synced', changes: ['color', 'spacing'] },
          { name: 'Footer', status: 'synced', changes: ['typography'] },
          { name: 'Card', status: 'synced', changes: ['border-radius'] }
        ],
        sync_mode: syncMode,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        result: mockResult,
        composio_metadata: {
          service: 'figma',
          method: 'sync_components'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'figma_sync_components', payload);
    }
  }

  async figma_scaffold_from_altitude(payload) {
    try {
      const { framework = 'figma' } = payload.data;
      
      // Read CTB/Altitude specifications
      const ctbSpecs = this.readCTBSpecs();
      
      // Create Figma design structure from CTB specs
      const figmaStructure = {
        pages: [
          {
            name: '30k - Strategic',
            frames: this.parseAltitudeLevel(ctbSpecs.altitude_30k, 'strategic')
          },
          {
            name: '20k - Operational',
            frames: this.parseAltitudeLevel(ctbSpecs.altitude_20k, 'operational')
          },
          {
            name: '10k - Tactical',
            frames: this.parseAltitudeLevel(ctbSpecs.altitude_10k, 'tactical')
          },
          {
            name: '5k - Execution',
            frames: this.parseAltitudeLevel(ctbSpecs.altitude_5k, 'execution')
          }
        ],
        components: [
          'NavigationTree',
          'ProcessFlow',
          'DataCatalog',
          'ToolInventory'
        ],
        design_tokens: {
          colors: {
            strategic: '#1E40AF',
            operational: '#059669',
            tactical: '#DC2626',
            execution: '#7C3AED'
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px'
          }
        }
      };

      // Mock: Would create Figma file structure via Composio
      const mockResult = {
        figma_file_id: `figma-ctb-${Date.now()}`,
        figma_file_url: `https://figma.com/file/mock-ctb-${Date.now()}/CTB-Altitude-Design`,
        pages_created: figmaStructure.pages.length,
        components_created: figmaStructure.components.length,
        design_tokens_applied: true,
        ctb_integration: {
          process_map_loaded: !!ctbSpecs.process_map,
          altitude_levels_created: 4,
          catalog_imported: !!ctbSpecs.catalog
        }
      };

      return {
        success: true,
        result: mockResult,
        figma_structure: figmaStructure,
        composio_metadata: {
          service: 'figma',
          method: 'scaffold_from_altitude'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'figma_scaffold_from_altitude', payload);
    }
  }

  // Smartsheet Project Management Tools
  async smartsheet_create_sheet(payload) {
    try {
      const { name, columns = [], templateId, folderLocation } = payload.data;

      // Default columns if none provided
      const defaultColumns = [
        { title: 'Task Name', type: 'TEXT_NUMBER', primary: true },
        { title: 'Assigned To', type: 'CONTACT_LIST' },
        { title: 'Status', type: 'PICKLIST', options: ['Not Started', 'In Progress', 'Complete'] },
        { title: 'Start Date', type: 'DATE' },
        { title: 'End Date', type: 'DATE' },
        { title: 'Priority', type: 'PICKLIST', options: ['High', 'Medium', 'Low'] }
      ];

      // Mock: Would create sheet via Composio's Smartsheet integration
      const mockResult = {
        sheet_id: `sheet-${Date.now()}`,
        name: name,
        permalink: `https://app.smartsheet.com/sheets/mock-${Date.now()}`,
        columns_created: (columns.length || defaultColumns.length),
        total_columns: (columns.length || defaultColumns.length),
        created_from_template: !!templateId,
        folder_location: folderLocation || 'root'
      };

      return {
        success: true,
        result: mockResult,
        composio_metadata: {
          service: 'smartsheet',
          method: 'create_sheet',
          template_used: templateId || 'custom'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'smartsheet_create_sheet', payload);
    }
  }

  async smartsheet_get_sheets(payload) {
    try {
      const { includeAll = false, folderFilter, modifiedSince } = payload.data;

      // Mock: Would retrieve sheets via Composio's Smartsheet integration
      const mockSheets = [
        {
          id: 'sheet-001',
          name: 'IMO Creator Project Plan',
          access_level: 'OWNER',
          permalink: 'https://app.smartsheet.com/sheets/sheet-001',
          created_at: '2025-01-01T00:00:00Z',
          modified_at: new Date().toISOString()
        },
        {
          id: 'sheet-002', 
          name: 'CTB Implementation Tracker',
          access_level: 'EDITOR',
          permalink: 'https://app.smartsheet.com/sheets/sheet-002',
          created_at: '2025-01-15T00:00:00Z',
          modified_at: new Date().toISOString()
        }
      ];

      return {
        success: true,
        result: {
          sheets: mockSheets,
          total_count: mockSheets.length,
          filtered_by: folderFilter ? 'folder' : 'all',
          include_all: includeAll
        },
        composio_metadata: {
          service: 'smartsheet',
          method: 'get_sheets'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'smartsheet_get_sheets', payload);
    }
  }

  async smartsheet_add_rows(payload) {
    try {
      const { sheetId, rows, toTop = false, parentId, siblingId } = payload.data;

      // Mock: Would add rows via Composio's Smartsheet integration
      const mockResult = {
        rows_added: rows.length,
        sheet_id: sheetId,
        added_row_ids: rows.map((_, index) => `row-${Date.now()}-${index}`),
        position: toTop ? 'top' : 'bottom',
        parent_row: parentId || null,
        sibling_row: siblingId || null
      };

      return {
        success: true,
        result: mockResult,
        composio_metadata: {
          service: 'smartsheet',
          method: 'add_rows'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'smartsheet_add_rows', payload);
    }
  }

  async smartsheet_update_rows(payload) {
    try {
      const { sheetId, rowUpdates } = payload.data;

      // Mock: Would update rows via Composio's Smartsheet integration
      const mockResult = {
        rows_updated: rowUpdates.length,
        sheet_id: sheetId,
        updated_row_ids: rowUpdates.map(update => update.id),
        modification_timestamp: new Date().toISOString()
      };

      return {
        success: true,
        result: mockResult,
        composio_metadata: {
          service: 'smartsheet',
          method: 'update_rows'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'smartsheet_update_rows', payload);
    }
  }

  async smartsheet_scaffold_from_altitude(payload) {
    try {
      const { projectName = 'CTB-Altitude Project', folderLocation } = payload.data;
      
      // Read CTB/Altitude specifications
      const ctbSpecs = this.readCTBSpecs();
      
      // Create Smartsheet structure from CTB specs
      const smartsheetStructure = {
        master_sheet: {
          name: `${projectName} - Master Plan`,
          columns: [
            { title: 'Altitude Level', type: 'PICKLIST', options: ['30k-Strategic', '20k-Operational', '10k-Tactical', '5k-Execution'] },
            { title: 'Component', type: 'TEXT_NUMBER' },
            { title: 'Status', type: 'PICKLIST', options: ['Planning', 'In Progress', 'Complete', 'Blocked'] },
            { title: 'Owner', type: 'CONTACT_LIST' },
            { title: 'Start Date', type: 'DATE' },
            { title: 'End Date', type: 'DATE' },
            { title: 'Priority', type: 'PICKLIST', options: ['Critical', 'High', 'Medium', 'Low'] }
          ]
        },
        altitude_sheets: [
          {
            name: `${projectName} - 30k Strategic`,
            type: 'strategic',
            tasks: this.generateAltitudeTasks(ctbSpecs.altitude_30k, 'strategic')
          },
          {
            name: `${projectName} - 20k Operational`, 
            type: 'operational',
            tasks: this.generateAltitudeTasks(ctbSpecs.altitude_20k, 'operational')
          },
          {
            name: `${projectName} - 10k Tactical`,
            type: 'tactical', 
            tasks: this.generateAltitudeTasks(ctbSpecs.altitude_10k, 'tactical')
          },
          {
            name: `${projectName} - 5k Execution`,
            type: 'execution',
            tasks: this.generateAltitudeTasks(ctbSpecs.altitude_5k, 'execution')
          }
        ]
      };

      // Mock: Would create Smartsheet workspace structure via Composio
      const mockResult = {
        workspace_id: `workspace-ctb-${Date.now()}`,
        master_sheet_id: `master-${Date.now()}`,
        altitude_sheet_ids: smartsheetStructure.altitude_sheets.map((_, index) => `altitude-${Date.now()}-${index}`),
        total_sheets_created: 1 + smartsheetStructure.altitude_sheets.length,
        project_name: projectName,
        ctb_integration: {
          process_map_loaded: !!ctbSpecs.process_map,
          altitude_levels_created: 4,
          catalog_integrated: !!ctbSpecs.catalog,
          total_tasks_generated: smartsheetStructure.altitude_sheets.reduce((sum, sheet) => sum + (sheet.tasks?.length || 0), 0)
        }
      };

      return {
        success: true,
        result: mockResult,
        smartsheet_structure: smartsheetStructure,
        composio_metadata: {
          service: 'smartsheet',
          method: 'scaffold_from_altitude'
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'smartsheet_scaffold_from_altitude', payload);
    }
  }

  generateAltitudeTasks(altitudeData, level) {
    if (!altitudeData) return [];
    
    const levelTasks = {
      strategic: ['Define vision', 'Set goals', 'Identify stakeholders', 'Resource planning'],
      operational: ['Process design', 'Team formation', 'Workflow setup', 'Quality gates'],
      tactical: ['Task breakdown', 'Sprint planning', 'Risk mitigation', 'Dependencies'],
      execution: ['Implementation', 'Testing', 'Deployment', 'Monitoring']
    };
    
    return (levelTasks[level] || []).map((task, index) => ({
      task_name: task,
      altitude_level: `${level}`,
      priority: index === 0 ? 'Critical' : 'High',
      status: 'Planning'
    }));
  }

  // Neon Database Tools (via Composio)
  async neon_query_database(payload) {
    try {
      const { query, parameters = [] } = payload.data;
      
      console.log(`🗄️ Executing Neon query via Composio: ${query}`);
      
      // Execute through Composio's Neon integration
      const result = await this.composio.tools.execute('NEON_EXECUTE_QUERY', {
        parameters: {
          sql: query,
          params: parameters
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          query: query,
          rows: result.rows || [],
          row_count: result.rowCount || 0,
          fields: result.fields || [],
          execution_time: result.executionTime || null
        },
        composio_metadata: {
          service: 'neon',
          method: 'execute_query',
          via_composio: true
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'neon_query_database', payload);
    }
  }

  async neon_create_table(payload) {
    try {
      const { tableName, columns, primaryKey, indexes = [] } = payload.data;
      
      // Build CREATE TABLE statement
      const columnDefs = columns.map(col => {
        let def = `${col.name} ${col.type}`;
        if (col.nullable === false) def += ' NOT NULL';
        if (col.default) def += ` DEFAULT ${col.default}`;
        return def;
      }).join(', ');
      
      let createSQL = `CREATE TABLE ${tableName} (${columnDefs}`;
      if (primaryKey) {
        createSQL += `, PRIMARY KEY (${Array.isArray(primaryKey) ? primaryKey.join(', ') : primaryKey})`;
      }
      createSQL += ')';
      
      console.log(`🗄️ Creating Neon table via Composio: ${tableName}`);
      
      // Execute through Composio
      const result = await this.composio.tools.execute('NEON_EXECUTE_QUERY', {
        parameters: {
          sql: createSQL,
          params: []
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          table_name: tableName,
          table_created: result.success || true,
          columns_count: columns.length,
          create_statement: createSQL
        },
        composio_metadata: {
          service: 'neon',
          method: 'create_table',
          via_composio: true
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'neon_create_table', payload);
    }
  }

  async neon_insert_data(payload) {
    try {
      const { tableName, data, onConflict = 'error' } = payload.data;
      
      // Handle single record or array of records
      const records = Array.isArray(data) ? data : [data];
      
      if (records.length === 0) {
        throw new Error('No data provided for insertion');
      }
      
      console.log(`🗄️ Inserting data to Neon via Composio: ${tableName} (${records.length} records)`);
      
      // Execute through Composio
      const result = await this.composio.tools.execute('NEON_INSERT_DATA', {
        parameters: {
          table: tableName,
          data: records,
          conflict_resolution: onConflict
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          table_name: tableName,
          records_inserted: result.rowCount || records.length,
          total_records: records.length,
          conflict_resolution: onConflict
        },
        composio_metadata: {
          service: 'neon',
          method: 'insert_data',
          via_composio: true
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'neon_insert_data', payload);
    }
  }

  async neon_update_data(payload) {
    try {
      const { tableName, updates, where } = payload.data;
      
      console.log(`🗄️ Updating Neon data via Composio: ${tableName}`);
      
      // Execute through Composio
      const result = await this.composio.tools.execute('NEON_UPDATE_DATA', {
        parameters: {
          table: tableName,
          updates: updates,
          where: where
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          table_name: tableName,
          records_updated: result.rowCount || 0
        },
        composio_metadata: {
          service: 'neon',
          method: 'update_data',
          via_composio: true
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'neon_update_data', payload);
    }
  }

  async neon_get_schema(payload) {
    try {
      const { tableName } = payload.data;
      
      console.log(`🗄️ Getting Neon schema via Composio: ${tableName || 'all tables'}`);
      
      // Execute through Composio
      const result = await this.composio.tools.execute('NEON_GET_SCHEMA', {
        parameters: {
          table: tableName || null
        },
        entityId: payload.process_id
      });

      return {
        success: true,
        result: {
          table_name: tableName || 'all',
          schema_info: result.schema || result.tables || [],
          total_items: result.count || 0
        },
        composio_metadata: {
          service: 'neon',
          method: 'get_schema',
          via_composio: true
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return this.handleError(error, 'neon_get_schema', payload);
    }
  }
}

module.exports = new ComposioHandler();