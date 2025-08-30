/**
 * Email Validator MCP Server - Email Validation & Verification
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const dns = require('dns').promises;
const net = require('net');
const toolHandler = require('./tools/tool_handler');

/**
 * Email Validator MCP Tool
 */


/**
 * Express Server Setup
 */
const app = express();
app.use(express.json());

// Initialize MCP tool
const tool = new EmailValidatorMCPTool();

// Setup kill switch
setupKillSwitch(app);

// Setup health checking
setupHealthChecking(app, {
    'email-validator': emailTool
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
app.post('/validate', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'validate_single',
            email: req.body.email,
            options: req.body.options
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/validate-batch', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'validate_batch',
            emails: req.body.emails,
            options: req.body.options
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/check-deliverability', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'check_deliverability',
            email: req.body.email
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/verify-domain/:domain', async (req, res) => {
    try {
        const result = await tool.execute({
            operation: 'verify_domain',
            domain: req.params.domain
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Email Validator MCP Server',
        version: '1.0.5',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'POST /validate - Validate single email',
            'POST /validate-batch - Validate multiple emails',
            'POST /check-deliverability - Check if email is deliverable',
            'GET /verify-domain/:domain - Verify domain configuration',
            'GET /mcp/health - Health check'
        ],
        features: [
            'Syntax validation',
            'Domain verification',
            'MX record checking',
            'Disposable email detection',
            'SMTP deliverability testing',
            'Typo correction suggestions'
        ],
        documentation: 'https://github.com/djb258/imo-creator/blob/main/mcp-servers/email-validator/README.md'
    });
});

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`
    📧 Email Validator MCP Server Running
    ================================
    Port: ${PORT}
    Health: http://localhost:${PORT}/mcp/health
    Kill Switch: ${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 6 (Automated/Utility)
    Mantis Logging: ✅
    
    Validation Features: ✅
    DNS Resolution: ✅
    Disposable Detection: ✅
    ================================
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Email Validator MCP Server...');
    process.exit(0);
});

module.exports = { EmailValidatorMCPTool };