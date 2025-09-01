const express = require('express');
const cors = require('cors');
const toolHandler = require('./tools/tool_handler');
const { cacheMiddleware, connectionPoolMiddleware, setupAll } = require('../shared/performance-boost');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Performance boost middleware - shorter cache for documentation
app.use(connectionPoolMiddleware());
app.use(cacheMiddleware(300)); // 5 minute cache for documentation searches
setupAll(app);

// Health check endpoint with Ref tools status
app.get('/mcp/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    server: 'ref-tools-mcp',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      ref_api_key_configured: !!process.env.REF_API_KEY,
      ref_api_endpoint: 'https://api.ref.tools',
      documentation_access: true
    }
  };
  
  res.json(healthStatus);
});

// Kill switch status
app.get('/mcp/kill-switch', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const killFile = path.join(__dirname, '.kill_switch');
  
  res.json({
    active: fs.existsSync(killFile) || process.env.KILL_SWITCH_ACTIVE === 'true',
    server: 'ref-tools-mcp'
  });
});

// Ref tools capabilities
app.get('/mcp/capabilities', (req, res) => {
  res.json({
    server: 'ref-tools-mcp',
    description: 'Token-efficient documentation and reference lookup via Ref.tools',
    features: [
      {
        name: 'Documentation Search',
        description: 'Search 1000+ technical documentation sites',
        coverage: ['APIs', 'frameworks', 'libraries', 'services', 'databases'],
        token_optimization: true
      },
      {
        name: 'URL Content Reading',
        description: 'Read and extract content from documentation URLs',
        features: ['Code block preservation', 'Content optimization', 'Session deduplication']
      },
      {
        name: 'API Reference Lookup',
        description: 'Specialized API endpoint and method documentation',
        targeted_search: true,
        code_examples: true
      },
      {
        name: 'GitHub Repository Search',
        description: 'Search public GitHub repos for code examples',
        language_filtering: true,
        relevance_scoring: true
      }
    ],
    optimization_features: {
      session_deduplication: 'Never returns repeated results in same session',
      content_dropout: 'Uses search history to return most relevant 5k tokens',
      token_efficiency: 'Designed to minimize context rot',
      code_preservation: 'Maintains code block formatting and API signatures'
    },
    integration_benefits: {
      vs_generic_search: 'Specialized for technical documentation',
      token_efficiency: '5k token optimal responses vs generic tools',
      code_accuracy: 'Preserves formatting that generic tools corrupt',
      session_awareness: 'Avoids redundant information in conversations'
    },
    ref_tools: {
      api_endpoint: 'https://api.ref.tools',
      documentation_sites: '1000+',
      github_repos: 'Public repositories included',
      update_frequency: 'Regular crawling and indexing'
    }
  });
});

// Documentation search endpoint for quick testing
app.get('/mcp/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { max_results = 5, include_code = true } = req.query;
    
    const result = await toolHandler.search_documentation({
      data: { 
        query, 
        max_results: parseInt(max_results),
        include_code_examples: include_code === 'true'
      },
      unique_id: `SEARCH-${Date.now()}`,
      process_id: `PRC-SEARCH-${Date.now()}`
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API reference lookup endpoint
app.get('/mcp/api/:api_name/:endpoint', async (req, res) => {
  try {
    const { api_name, endpoint } = req.params;
    const { include_examples = true } = req.query;
    
    const result = await toolHandler.get_api_reference({
      data: { 
        api_name: decodeURIComponent(api_name),
        endpoint_or_method: decodeURIComponent(endpoint),
        include_examples: include_examples === 'true'
      },
      unique_id: `API-REF-${Date.now()}`,
      process_id: `PRC-API-REF-${Date.now()}`
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Documentation statistics and session info
app.get('/mcp/stats', (req, res) => {
  res.json({
    server: 'ref-tools-mcp',
    session_stats: {
      cache_size: toolHandler.sessionCache?.size || 0,
      rate_limiter_entries: toolHandler.rateLimiter?.size || 0,
      active_sessions: 'varies by usage'
    },
    performance_features: {
      caching_strategy: '5 minute TTL with session deduplication',
      rate_limiting: '30 requests per minute per process',
      token_optimization: 'Maximum 5k tokens per response',
      content_dropout: 'Session-aware relevance filtering'
    },
    documentation_coverage: {
      technical_sites: '1000+',
      github_repositories: 'Public repos included',
      api_documentation: 'Major APIs covered',
      framework_docs: 'Popular frameworks indexed'
    }
  });
});

// Middleware functions
const validatePayload = (req, res, next) => {
  const required = ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required HEIR/ORBT fields',
      missing_fields: missing,
      server: 'ref-tools-mcp'
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'ref-tools-mcp'
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
      server: 'ref-tools-mcp'
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
    server: 'ref-tools-mcp',
    documentation_access: true,
    ref_tools_integration: true,
    search_query: req.body.data?.query || null
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
      server: 'ref-tools-mcp',
      documentation_access: true,
      results_count: body.result?.results?.length || body.result?.total_results || 0,
      token_optimized: body.result?.token_optimized || false
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
      server: 'ref-tools-mcp',
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
  console.log(`🚀 ref-tools-mcp server running on port ${PORT}`);
  console.log(`📚 Token-efficient documentation and reference lookup ready`);
  console.log(`🔍 1000+ technical documentation sites available`);
  console.log(`🔒 HEIR/ORBT compliance: Active`);
  console.log(`⚡ Session deduplication: Enabled`);
  console.log(`🎯 Token optimization: 5k max per response`);
  
  // API key validation
  if (!process.env.REF_API_KEY) {
    console.warn(`⚠️  REF_API_KEY not configured - using default key`);
    console.warn(`🔧 Set REF_API_KEY environment variable for production use`);
    console.warn(`📖 Get API key from: https://ref.tools`);
  } else {
    console.log(`✅ Ref.tools API authentication configured`);
  }
  
  console.log(`🏗️  Integration ready with existing MCP architecture`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /mcp/search/:query - Quick documentation search`);
  console.log(`   GET /mcp/api/:api_name/:endpoint - API reference lookup`);
  console.log(`   GET /mcp/stats - Performance and coverage statistics`);
});