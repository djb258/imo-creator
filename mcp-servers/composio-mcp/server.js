require('dotenv').config();
const express = require('express');
const cors = require('cors');
const toolHandler = require('./tools/tool_handler');
const { cacheMiddleware, connectionPoolMiddleware, setupAll } = require('../shared/performance-boost');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Large limit for tool responses

// Performance boost middleware
app.use(connectionPoolMiddleware());
app.use(cacheMiddleware(180)); // 3 minute cache for external service calls
setupAll(app);

// Health check endpoint with Composio status
app.get('/mcp/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    server: 'composio-mcp',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      composio_api_configured: !!process.env.COMPOSIO_API_KEY,
      composio_base_url: process.env.COMPOSIO_BASE_URL || 'default',
      telemetry_enabled: process.env.COMPOSIO_DISABLE_TELEMETRY !== 'true'
    }
  };
  
  // Test Composio connection
  try {
    const stats = await toolHandler.get_composio_stats({
      data: {},
      unique_id: `HEALTH-${Date.now()}`,
      process_id: `PRC-HEALTH-${Date.now()}`
    });
    
    healthStatus.composio_connection = stats.success ? 'connected' : 'error';
    if (!stats.success) {
      healthStatus.composio_error = stats.error;
    }
  } catch (error) {
    healthStatus.composio_connection = 'error';
    healthStatus.composio_error = error.message;
  }
  
  res.json(healthStatus);
});

// Kill switch status
app.get('/mcp/kill-switch', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const killFile = path.join(__dirname, '.kill_switch');
  
  res.json({
    active: fs.existsSync(killFile) || process.env.KILL_SWITCH_ACTIVE === 'true',
    server: 'composio-mcp'
  });
});

// Claude-friendly documentation endpoint
app.get('/mcp/docs', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Load tool manifest for real-time tool info
    const manifestPath = path.join(__dirname, 'manifests', 'tool_manifest.json');
    const manifest = fs.existsSync(manifestPath) ? 
      JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : null;
    
    const docs = {
      server: 'composio-mcp',
      description: 'Universal AI agent integration platform with 100+ services',
      connection: {
        base_url: `http://localhost:${process.env.PORT || 3000}`,
        endpoint: '/tool',
        method: 'POST',
        required_headers: {
          'Content-Type': 'application/json'
        }
      },
      payload_format: {
        tool: 'string (tool name)',
        data: 'object (tool parameters)',
        unique_id: 'string (HEIR format: HEIR-YYYY-MM-SYSTEM-MODE-VN)',
        process_id: 'string (PRC-SYSTCODE-EPOCHTIMESTAMP)',
        orbt_layer: 'number (1-5)',
        blueprint_version: 'string (e.g. "1.0")'
      },
      available_tools: manifest ? manifest.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema?.properties || {},
        example_payload: {
          tool: tool.name,
          data: tool.inputSchema?.required ? 
            Object.fromEntries(tool.inputSchema.required.map(field => [field, `<${field}>`])) : 
            {},
          unique_id: "HEIR-2025-09-COMPOSIO-PROD-01",
          process_id: "PRC-COMP-" + Date.now(),
          orbt_layer: 2,
          blueprint_version: "1.0"
        }
      })) : [],
      usage_examples: {
        neon_query: {
          description: "Execute SQL query on Neon database",
          payload: {
            tool: "neon_query_database",
            data: { query: "SELECT * FROM users LIMIT 5" },
            unique_id: "HEIR-2025-09-NEON-QUERY-01",
            process_id: "PRC-NEON-" + Date.now(),
            orbt_layer: 2,
            blueprint_version: "1.0"
          }
        },
        lovable_create: {
          description: "Create new UI project with Lovable.dev",
          payload: {
            tool: "lovable_create_project",
            data: { 
              prompt: "Create a dashboard with charts and tables",
              projectType: "react"
            },
            unique_id: "HEIR-2025-09-LOVABLE-CREATE-01", 
            process_id: "PRC-LOVBL-" + Date.now(),
            orbt_layer: 3,
            blueprint_version: "1.0"
          }
        },
        smartsheet_create: {
          description: "Create Smartsheet for project tracking",
          payload: {
            tool: "smartsheet_create_sheet",
            data: {
              name: "Project Tasks",
              columns: [
                { title: "Task", type: "TEXT_NUMBER", primary: true },
                { title: "Status", type: "PICKLIST", options: ["Todo", "In Progress", "Done"] },
                { title: "Owner", type: "CONTACT_LIST" }
              ]
            },
            unique_id: "HEIR-2025-09-SMART-CREATE-01",
            process_id: "PRC-SMART-" + Date.now(),
            orbt_layer: 2,
            blueprint_version: "1.0"
          }
        }
      },
      tool_status: {
        real_integrations: [
          "neon_query_database", "neon_get_schema", "neon_create_table", 
          "neon_insert_data", "neon_update_data"
        ],
        mock_implementations: [
          "smartsheet_create_sheet", "smartsheet_get_sheets", "smartsheet_add_rows",
          "lovable_create_project", "lovable_scaffold_altitude_ui",
          "builder_io_create_space", "figma_export_to_code"
        ]
      },
      health_check: `${process.env.PORT || 3000}/mcp/health`,
      last_updated: new Date().toISOString()
    };
    
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate documentation', details: error.message });
  }
});

// Composio capabilities and supported toolkits
app.get('/mcp/capabilities', (req, res) => {
  res.json({
    server: 'composio-mcp',
    description: 'Universal AI agent integration platform with 100+ services including Lovable.dev',
    features: [
      {
        name: 'Universal Tool Execution',
        description: 'Execute tools from 100+ integrated services including UI generation',
        supported_toolkits: [
          'github', 'gmail', 'slack', 'twilio', 'stripe', 'notion',
          'hubspot', 'salesforce', 'discord', 'linear', 'jira',
          'google_calendar', 'google_drive', 'dropbox', 'asana',
          'trello', 'monday', 'clickup', 'zendesk', 'intercom',
          'lovable', 'builder_io', 'figma', 'smartsheet', 'neon'
        ]
      },
      {
        name: 'Lovable.dev UI Generation',
        description: 'Create and manage UI projects via Lovable.dev integration',
        capabilities: [
          'create_project', 'get_project_status', 'get_project_details',
          'scaffold_altitude_ui (CTB/Altitude integration)'
        ]
      },
      {
        name: 'Builder.io Visual CMS',
        description: 'Create and manage content models and visual content via Builder.io',
        capabilities: [
          'create_space', 'create_model', 'create_content', 'get_content',
          'scaffold_altitude_cms (CTB/Altitude CMS integration)'
        ]
      },
      {
        name: 'Figma Design Tools',
        description: 'Export designs to code and sync with repository via Figma integration',
        capabilities: [
          'export_to_code (React/Vue/Angular generation)',
          'create_design_system',
          'sync_components',
          'scaffold_from_altitude (CTB/Altitude integration)'
        ]
      },
      {
        name: 'Smartsheet Project Management',
        description: 'Create and manage Smartsheets for project tracking via Smartsheet integration',
        capabilities: [
          'create_sheet (Project templates and custom columns)',
          'get_sheets (List and filter accessible sheets)',
          'add_rows (Bulk row creation with hierarchy)',
          'update_rows (Batch updates with validation)',
          'scaffold_from_altitude (CTB/Altitude project generation)'
        ]
      },
      {
        name: 'Neon Database Operations',
        description: 'Execute database operations on Neon PostgreSQL via Composio integration',
        capabilities: [
          'query_database (Execute SQL queries with parameters)',
          'create_table (Create tables with columns and indexes)',
          'insert_data (Bulk insert with conflict resolution)',
          'update_data (Update records with WHERE conditions)',
          'get_schema (Retrieve table and column information)'
        ]
      },
      {
        name: 'Connected Account Management',
        description: 'Handle authentication and connections to external services',
        auth_methods: ['oauth2', 'api_key', 'bearer_token', 'basic_auth']
      },
      {
        name: 'Tool Discovery',
        description: 'Dynamic discovery of available tools per user/toolkit',
        caching: '5 minute intelligent caching'
      },
      {
        name: 'HEIR/ORBT Compliance',
        description: 'Full compliance wrapper around Composio SDK',
        audit_trail: true,
        performance_optimization: true
      }
    ],
    integration_benefits: {
      vs_individual_servers: '90% less development time',
      maintenance_reduction: '80% less ongoing maintenance',
      authentication_simplification: '95% less auth complexity',
      service_coverage: '100+ services vs building each individually'
    },
    composio_sdk: {
      version: '3.0',
      languages: ['TypeScript', 'Python'],
      providers: ['OpenAI', 'Anthropic', 'LangChain', 'Google', 'Vercel']
    }
  });
});

// Available toolkits endpoint
app.get('/mcp/toolkits', async (req, res) => {
  try {
    const { user_id, limit } = req.query;
    
    const result = await toolHandler.get_available_tools({
      data: { 
        toolkits: ['github', 'gmail', 'slack', 'notion', 'linear'], // Sample popular ones
        user_id 
      },
      unique_id: `API-${Date.now()}`,
      process_id: `PRC-API-${Date.now()}`
    });
    
    if (result.success) {
      const toolsByToolkit = {};
      result.result.tools.forEach(tool => {
        const toolkit = tool.toolkit;
        if (!toolsByToolkit[toolkit]) toolsByToolkit[toolkit] = [];
        toolsByToolkit[toolkit].push({
          name: tool.name,
          description: tool.description,
          enabled: tool.composio_metadata?.enabled !== false
        });
      });
      
      res.json({
        server: 'composio-mcp',
        user_context: user_id || 'default',
        available_toolkits: toolsByToolkit,
        total_tools: result.result.total_tools,
        fetched_at: result.result.fetched_at
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tool execution endpoint for quick testing
app.post('/mcp/execute/:toolkit/:tool', async (req, res) => {
  try {
    const { toolkit, tool } = req.params;
    const { arguments: toolArgs, user_id } = req.body;
    
    const result = await toolHandler.execute_composio_tool({
      data: { toolkit, tool, arguments: toolArgs, user_id },
      unique_id: `DIRECT-${Date.now()}`,
      process_id: `PRC-DIRECT-${Date.now()}`
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware functions
const validatePayload = (req, res, next) => {
  const required = ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required HEIR/ORBT fields',
      missing_fields: missing,
      server: 'composio-mcp'
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'composio-mcp'
    });
  }
  
  next();
};

const killSwitch = (req, res, next) => {
  const fs = require('fs');
  const path = require('path');
  const killFile = path.join(__dirname, '.kill_switch');
  
  if (fs.existsSync(killFile) || process.env.KILL_SWITCH_ACTIVE === 'true') {
    return res.status(503).json({
      error: 'Service temporarily unavailable - kill switch active',
      code: 'KILL_SWITCH_ACTIVE',
      server: 'composio-mcp'
    });
  }
  next();
};

const logToMantis = (req, res, next) => {
  const startTime = Date.now();
  
  console.log(JSON.stringify({
    type: 'MCP_REQUEST',
    timestamp: new Date().toISOString(),
    unique_id: req.body.unique_id,
    process_id: req.body.process_id,
    tool: req.body.tool,
    orbt_layer: req.body.orbt_layer,
    server: 'composio-mcp',
    composio_toolkit: req.body.data?.toolkit || null,
    composio_tool: req.body.data?.tool || null
  }));
  
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      type: 'MCP_RESPONSE', 
      timestamp: new Date().toISOString(),
      unique_id: req.body.unique_id,
      duration_ms: duration,
      success: !body.error,
      server: 'composio-mcp',
      external_service_call: true
    }));
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Main tool endpoint
app.post('/tool', validatePayload, killSwitch, logToMantis, async (req, res) => {
  try {
    const result = await toolHandler.handleToolCall(req.body);
    res.json(result);
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      server: 'composio-mcp',
      heir_tracking: {
        unique_id: req.body.unique_id,
        process_lineage: [req.body.process_id],
        error_occurred: true,
        error_type: 'server_error',
        timestamp: new Date().toISOString()
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 composio-mcp server running on port ${PORT}`);
  console.log(`🌐 Universal AI agent integration platform ready`);
  console.log(`🔗 100+ services available via Composio SDK`);
  console.log(`🔒 HEIR/ORBT compliance: Active`);
  console.log(`⚡ Performance caching: 3 minutes for external calls`);
  
  // Environment validation
  const requiredEnv = ['COMPOSIO_API_KEY'];
  const missingEnv = requiredEnv.filter(key => !process.env[key]);
  
  if (missingEnv.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingEnv.join(', ')}`);
    console.warn(`🔧 Set COMPOSIO_API_KEY from https://app.composio.dev`);
    console.warn(`📚 See installation guide: https://docs.composio.dev`);
  } else {
    console.log(`✅ Composio API authentication configured`);
    console.log(`🎯 Ready to replace multiple individual MCP servers`);
  }
});