/**
 * Simple Health Check System for MCP Tools
 * Single developer edition - no over-engineering
 */

const { MantisLogger } = require('../logging/log_wrapper');

class MCPHealthChecker {
    constructor() {
        this.logger = new MantisLogger({
            service_name: 'mcp-health-checker',
            heir_system_code: 'HEALTH',
            default_orbt_layer: 7 // Public health checks
        });
        
        this.tools = new Map();
    }

    /**
     * Register an MCP tool for health monitoring
     */
    registerTool(name, tool) {
        this.tools.set(name, tool);
    }

    /**
     * Check health of all registered tools
     */
    async checkAll() {
        const results = {};
        const startTime = Date.now();

        for (const [name, tool] of this.tools) {
            try {
                const healthResult = await tool.healthCheck();
                results[name] = {
                    status: 'healthy',
                    ...healthResult,
                    last_checked: new Date().toISOString()
                };
            } catch (error) {
                results[name] = {
                    status: 'unhealthy',
                    error: error.message,
                    last_checked: new Date().toISOString()
                };
            }
        }

        // Overall system health
        const healthyCount = Object.values(results).filter(r => r.status === 'healthy').length;
        const totalCount = Object.keys(results).length;
        const overallHealth = healthyCount === totalCount ? 'healthy' : 'degraded';

        const summary = {
            overall_status: overallHealth,
            healthy_tools: healthyCount,
            total_tools: totalCount,
            check_duration_ms: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            tools: results
        };

        // Log health check
        await this.logger.info('Health check completed', {
            unique_id: this.generateHealthId(),
            process_id: this.generateProcessId(),
            structured_data: summary
        });

        return summary;
    }

    /**
     * Check specific tool health
     */
    async checkTool(toolName) {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new Error(`Tool '${toolName}' not registered`);
        }

        try {
            const result = await tool.healthCheck();
            return {
                tool_name: toolName,
                status: 'healthy',
                ...result,
                last_checked: new Date().toISOString()
            };
        } catch (error) {
            return {
                tool_name: toolName,
                status: 'unhealthy',
                error: error.message,
                last_checked: new Date().toISOString()
            };
        }
    }

    /**
     * Express.js health endpoints
     */
    createHealthEndpoints() {
        const express = require('express');
        const router = express.Router();

        // All tools health check
        router.get('/health', async (req, res) => {
            try {
                const health = await this.checkAll();
                const statusCode = health.overall_status === 'healthy' ? 200 : 503;
                res.status(statusCode).json(health);
            } catch (error) {
                res.status(500).json({
                    overall_status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Specific tool health
        router.get('/health/:toolName', async (req, res) => {
            try {
                const health = await this.checkTool(req.params.toolName);
                const statusCode = health.status === 'healthy' ? 200 : 503;
                res.status(statusCode).json(health);
            } catch (error) {
                res.status(500).json({
                    tool_name: req.params.toolName,
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Simple status page
        router.get('/status', async (req, res) => {
            const health = await this.checkAll();
            const html = this.generateStatusHTML(health);
            res.send(html);
        });

        return router;
    }

    /**
     * Simple HTML status page
     */
    generateStatusHTML(health) {
        const statusColor = health.overall_status === 'healthy' ? 'green' : 'red';
        
        let toolsHTML = '';
        for (const [name, tool] of Object.entries(health.tools)) {
            const color = tool.status === 'healthy' ? 'green' : 'red';
            toolsHTML += `
                <tr>
                    <td>${name}</td>
                    <td style="color: ${color};">${tool.status}</td>
                    <td>${tool.last_checked}</td>
                    <td>${tool.error || 'N/A'}</td>
                </tr>
            `;
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>MCP Tools Health Status</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .status { font-size: 24px; font-weight: bold; color: ${statusColor}; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
                <meta http-equiv="refresh" content="30">
            </head>
            <body>
                <h1>MCP Tools Health Dashboard</h1>
                <div class="status">Overall Status: ${health.overall_status.toUpperCase()}</div>
                <p>Healthy: ${health.healthy_tools}/${health.total_tools} tools</p>
                <p>Last Updated: ${health.timestamp}</p>
                
                <table>
                    <tr>
                        <th>Tool Name</th>
                        <th>Status</th>
                        <th>Last Checked</th>
                        <th>Error</th>
                    </tr>
                    ${toolsHTML}
                </table>
                
                <p><small>Auto-refreshes every 30 seconds</small></p>
            </body>
            </html>
        `;
    }

    generateHealthId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `HEIR-${year}-${month}-HEALTH-CHECK-01`;
    }

    generateProcessId() {
        const timestamp = Date.now().toString();
        return `PRC-HEALTH01-${timestamp}`;
    }
}

/**
 * Quick setup for your main application
 */
function setupHealthChecking(app, tools = {}) {
    const healthChecker = new MCPHealthChecker();
    
    // Register all your tools
    for (const [name, tool] of Object.entries(tools)) {
        healthChecker.registerTool(name, tool);
    }
    
    // Add health endpoints to your Express app
    app.use('/mcp', healthChecker.createHealthEndpoints());
    
    console.log('✅ MCP Health checking enabled at:');
    console.log('   GET /mcp/health - All tools status (JSON)');
    console.log('   GET /mcp/health/:toolName - Specific tool status');  
    console.log('   GET /mcp/status - Visual status page');
    
    return healthChecker;
}

module.exports = { MCPHealthChecker, setupHealthChecking };

/**
 * Example usage:
 * 
 * const express = require('express');
 * const { setupHealthChecking } = require('./health/simple_health_check');
 * const { NeonWriter, ApifyScraper } = require('./templates/simple_mcp_tool');
 * 
 * const app = express();
 * 
 * const tools = {
 *   'neon-writer': new NeonWriter(),
 *   'apify-scraper': new ApifyScraper()
 * };
 * 
 * setupHealthChecking(app, tools);
 * 
 * app.listen(3000, () => {
 *   console.log('Server running with MCP health checks');
 * });
 */