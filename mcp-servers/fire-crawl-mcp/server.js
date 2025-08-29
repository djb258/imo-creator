/**
 * Fire Crawl MCP Server - Advanced Web Scraping & Data Extraction
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');
const { FireCrawlMCPTool } = require('./tools/tool_handler');

/**
 * Fire Crawl Advanced Scraping MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize MCP tool
const tool = new FireCrawlMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'fire-crawl-scraper': fireCrawlTool
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
app.post('/scrape', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'scrape_single',
            url: req.body.url,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/crawl', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'crawl_website',
            url: req.body.url,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/batch', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'batch_scrape',
            urls: req.body.urls,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/extract', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'extract_data',
            url: req.body.url,
            options: req.body
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/status/:jobId', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'check_status',
            options: { jobId: req.params.jobId }
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/credits', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'get_credits'
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Fire Crawl MCP Server',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /scrape - Scrape single URL',
            'POST /crawl - Crawl entire website',
            'POST /batch - Batch scrape multiple URLs',
            'POST /extract - Extract structured data',
            'GET /status/:jobId - Check crawl job status',
            'GET /credits - Check API credits',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/fire-crawl-mcp/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`
    🔥 Fire Crawl MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Status: http://localhost:${PORT}/mcp/status
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 5 (External API)
    Mantis Logging: ✅
    
    FireCrawl API: ${process.env.FIRECRAWL_API_KEY ? 'Connected' : '⚠️  No FIRECRAWL_API_KEY set'}
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Fire Crawl MCP Server...');
    process.exit(0);
});

module.exports = { FireCrawlMCPTool };