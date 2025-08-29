/**
 * Apify MCP Server - Web Scraping Operations
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { ApifyMCPTool } = require('./tools/tool_handler');

/**
 * Apify Web Scraper MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '10mb' })); // Larger limit for scraping data

// Initialize MCP tool
const tool = new ApifyMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'apify-scraper': apifyTool
});

// Main MCP endpoint
app.post('/execute', async (req, res) => {
    try {
        const result = await tool.execute(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Specific operation endpoints
app.post('/run-actor', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'run_actor',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/scrape-url', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'scrape_url',
            ...req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/actors', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'list_actors'
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/dataset/:datasetId', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_dataset',
            datasetId: req.params.datasetId,
            limit: parseInt(req.query.limit) || 1000
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Apify MCP Server',
        version: '1.3.2',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /run-actor - Execute Apify actor',
            'POST /scrape-url - Simple URL scraping',
            'GET /actors - List available actors',
            'GET /dataset/:id - Get dataset by ID',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/apify-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`
    🕷️  Apify MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 5 (Developer)
    Mantis Logging: ✅
    
    Apify API: ${process.env.APIFY_API_KEY ? 'Connected' : '⚠️  No APIFY_API_KEY set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Apify MCP Server...');
    process.exit(0);
});

module.exports = { ApifyMCPTool };