const express = require('express');
const cors = require('cors');
const toolHandler = require('./tools/tool_handler');
const { cacheMiddleware, connectionPoolMiddleware, setupAll } = require('../shared/performance-boost');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Larger limit for query results

// Performance boost middleware
app.use(connectionPoolMiddleware());
app.use(cacheMiddleware(300)); // 5 minute cache for query results
setupAll(app);

// Enhanced health check with database connectivity
app.get('/mcp/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    server: 'query-builder-mcp',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      neon_configured: !!process.env.NEON_DATABASE_URL,
      marketing_configured: !!process.env.MARKETING_DATABASE_URL,
      real_estate_configured: !!process.env.REAL_ESTATE_DATABASE_URL,
      command_ops_configured: !!process.env.COMMAND_OPS_DATABASE_URL,
      bigquery_configured: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      firebase_configured: !!process.env.FIREBASE_PROJECT_ID
    }
  };
  
  // Count active connections
  const activeDBs = Object.values(healthStatus.environment).filter(Boolean).length;
  healthStatus.active_databases = activeDBs;
  healthStatus.multi_db_ready = activeDBs >= 2;
  
  res.json(healthStatus);
});

// Kill switch status
app.get('/mcp/kill-switch', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const killFile = path.join(__dirname, '.kill_switch');
  
  res.json({
    active: fs.existsSync(killFile) || process.env.KILL_SWITCH_ACTIVE === 'true',
    server: 'query-builder-mcp'
  });
});

// Database schema explorer endpoint
app.get('/mcp/schemas', async (req, res) => {
  try {
    const databases = ['neon', 'marketing', 'real_estate', 'command_ops', 'bigquery', 'firebase'];
    const schemas = {};
    
    for (const db of databases) {
      try {
        const result = await toolHandler.get_schema({
          data: { database: db },
          unique_id: `HEALTH-${Date.now()}`,
          process_id: `PRC-HEALTH-${Date.now()}`
        });
        
        if (result.success) {
          schemas[db] = {
            available: true,
            tables: Object.keys(result.result.schema).length,
            last_checked: result.result.generated_at
          };
        }
      } catch (error) {
        schemas[db] = { available: false, error: error.message };
      }
    }
    
    res.json({
      server: 'query-builder-mcp',
      schemas: schemas,
      total_available: Object.values(schemas).filter(s => s.available).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Query builder capabilities
app.get('/mcp/capabilities', (req, res) => {
  res.json({
    server: 'query-builder-mcp',
    features: [
      {
        name: 'Multi-Database Queries',
        description: 'Execute queries across PostgreSQL, BigQuery, and Firebase',
        databases: ['neon', 'marketing', 'real_estate', 'command_ops', 'bigquery', 'firebase']
      },
      {
        name: 'Cross-Database Joins',
        description: 'Join data from different database systems',
        join_types: ['inner', 'left']
      },
      {
        name: 'Schema Introspection',
        description: 'Discover table structures across all databases',
        supported: true
      },
      {
        name: 'Query Caching',
        description: '5-minute intelligent caching for read operations',
        cache_ttl: 300
      },
      {
        name: 'Safety Features',
        description: 'Destructive operation protection and dry-run support',
        protections: ['allowDestructive flag required', 'BigQuery dry-run support']
      }
    ],
    performance: {
      query_caching: true,
      connection_pooling: true,
      cross_db_optimization: true
    }
  });
});

// Middleware for payload validation
const validatePayload = (req, res, next) => {
  const required = ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required HEIR/ORBT fields',
      missing_fields: missing,
      server: 'query-builder-mcp'
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'query-builder-mcp'
    });
  }
  
  next();
};

// Kill switch middleware
const killSwitch = (req, res, next) => {
  const fs = require('fs');
  const path = require('path');
  const killFile = path.join(__dirname, '.kill_switch');
  
  if (fs.existsSync(killFile) || process.env.KILL_SWITCH_ACTIVE === 'true') {
    return res.status(503).json({
      error: 'Service temporarily unavailable - kill switch active',
      code: 'KILL_SWITCH_ACTIVE',
      server: 'query-builder-mcp'
    });
  }
  next();
};

// Logging middleware
const logToMantis = (req, res, next) => {
  const startTime = Date.now();
  
  console.log(JSON.stringify({
    type: 'MCP_REQUEST',
    timestamp: new Date().toISOString(),
    unique_id: req.body.unique_id,
    process_id: req.body.process_id,
    tool: req.body.tool,
    orbt_layer: req.body.orbt_layer,
    server: 'query-builder-mcp',
    database_target: req.body.data?.database || 'multiple'
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
      server: 'query-builder-mcp',
      row_count: body.result?.rowCount || 0
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
      server: 'query-builder-mcp',
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
  console.log(`🚀 query-builder-mcp server running on port ${PORT}`);
  console.log(`🗄️ Multi-database query builder ready`);
  console.log(`🔗 Cross-database joins supported`);
  console.log(`🔒 HEIR/ORBT compliance: Active`);
  console.log(`⚡ Performance caching: Enabled`);
  
  // Database connectivity check
  setTimeout(async () => {
    try {
      const stats = await toolHandler.get_stats({
        unique_id: `STARTUP-${Date.now()}`,
        process_id: `PRC-STARTUP-${Date.now()}`
      });
      
      if (stats.success) {
        const dbCount = stats.result.connections?.length || 0;
        console.log(`📊 Connected to ${dbCount} databases`);
        
        if (dbCount >= 2) {
          console.log(`✅ Multi-database operations ready`);
        } else {
          console.log(`⚠️  Only ${dbCount} database(s) configured - add more for cross-DB joins`);
        }
      }
    } catch (error) {
      console.warn('⚠️  Database connectivity check failed:', error.message);
    }
  }, 2000);
});