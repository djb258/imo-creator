const express = require('express');
const cors = require('cors');
const toolHandler = require('./tools/tool_handler');
const { cacheMiddleware, connectionPoolMiddleware, setupAll } = require('../shared/performance-boost');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Performance boost middleware 
app.use(connectionPoolMiddleware());
app.use(cacheMiddleware(60)); // 1 minute cache for GitHub API calls
setupAll(app);

// Health check endpoint
app.get('/mcp/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    server: 'github-actions-mcp',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: {
      github_token_configured: !!process.env.GITHUB_TOKEN
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
    server: 'github-actions-mcp'
  });
});

// GitHub Actions capabilities
app.get('/mcp/capabilities', (req, res) => {
  res.json({
    server: 'github-actions-mcp',
    features: [
      {
        name: 'Workflow Triggering',
        description: 'Trigger GitHub Actions workflows remotely',
        supported_events: ['workflow_dispatch']
      },
      {
        name: 'Workflow Monitoring',
        description: 'Monitor workflow run status and results',
        filters: ['status', 'workflow_id', 'limit']
      },
      {
        name: 'Run Management',
        description: 'Cancel running workflows',
        operations: ['cancel_workflow_run']
      },
      {
        name: 'Deployment Tracking',
        description: 'Track deployments across environments',
        supported: true
      }
    ],
    rate_limits: {
      github_api: '5000/hour per token',
      caching: '1 minute for API responses'
    },
    requirements: {
      github_token: !!process.env.GITHUB_TOKEN,
      repository_access: 'actions:write permission required for triggering'
    }
  });
});

// Repository workflows endpoint
app.get('/mcp/workflows/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repoPath = `${owner}/${repo}`;
    
    const result = await toolHandler.get_workflow_status({
      data: { repo: repoPath, limit: 20 },
      unique_id: `API-${Date.now()}`,
      process_id: `PRC-API-${Date.now()}`
    });
    
    if (result.success) {
      res.json({
        repository: repoPath,
        workflows: result.result.runs,
        total: result.result.total_runs
      });
    } else {
      res.status(400).json(result);
    }
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
      server: 'github-actions-mcp'
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'github-actions-mcp'
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
      server: 'github-actions-mcp'
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
    server: 'github-actions-mcp',
    github_repo: req.body.data?.repo || null
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
      server: 'github-actions-mcp'
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
      server: 'github-actions-mcp',
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
  console.log(`🚀 github-actions-mcp server running on port ${PORT}`);
  console.log(`🔄 GitHub Actions CI/CD management ready`);
  console.log(`🔒 HEIR/ORBT compliance: Active`);
  
  // GitHub token validation
  if (!process.env.GITHUB_TOKEN) {
    console.warn(`⚠️  GITHUB_TOKEN not configured - API calls will fail`);
    console.warn(`🔧 Set GITHUB_TOKEN environment variable with repo access`);
  } else {
    console.log(`✅ GitHub API authentication configured`);
  }
});