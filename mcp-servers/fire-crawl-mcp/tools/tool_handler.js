/**
 * FireCrawlMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * FireCrawl MCP Tool Handler
 */
class FireCrawlMCPTool extends SimpleMCPTool {
    constructor() {
        super('fire-crawl-scraper', {
            version: '1.0.0',
            orbtLayer: 5, // External API level
            systemCode: 'FRCWL'
        });
        
        this.apiKey = process.env.FIRECRAWL_API_KEY;
        this.baseUrl = 'https://api.firecrawl.dev/v0';
        
        if (!this.apiKey) {
            console.warn('⚠️  FIRECRAWL_API_KEY not set - some features will be limited');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, url, urls, options = {} } = params;
        
        // Validate operation type
        const allowedOperations = [
            'scrape_single', 'crawl_website', 'batch_scrape', 'extract_data',
            'monitor_changes', 'get_sitemap', 'check_status', 'get_credits'
        ];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        // Security validation
        if (url && !url.startsWith('https://') && !url.startsWith('http://')) {
            throw new Error('Invalid URL format - must include protocol (http:// or https://)');
        }

        let result;
        switch (operation) {
            case 'scrape_single':
                result = await this.scrapeSingle(url, options);
                break;
            case 'crawl_website':
                result = await this.crawlWebsite(url, options);
                break;
            case 'batch_scrape':
                result = await this.batchScrape(urls, options);
                break;
            case 'extract_data':
                result = await this.extractData(url, options);
                break;
            case 'monitor_changes':
                result = await this.monitorChanges(url, options);
                break;
            case 'get_sitemap':
                result = await this.getSitemap(url, options);
                break;
            case 'check_status':
                result = await this.checkStatus(options.jobId);
                break;
            case 'get_credits':
                result = await this.getCredits();
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            credits_used: result.creditsUsed || 1
        };
    }

    

    /**
     * Health check implementation
     */
    async healthCheck() {
        try {
            const startTime = Date.now();
            
            // Test API connectivity
            let apiConnected = false;
            let creditsInfo = null;
            
            if (this.apiKey) {
                try {
                    const credits = await this.getCredits();
                    apiConnected = true;
                    creditsInfo = credits;
                } catch (error) {
                    // Credit check failed but API might still work
                    try {
                        // Try a minimal test scrape
                        await axios.get(`${this.baseUrl}/credits`, {
                            headers: { 'Authorization': `Bearer ${this.apiKey}` },
                            timeout: 5000
                        });
                        apiConnected = true;
                    } catch (testError) {
                        // API test failed
                    }
                }
            }

            const responseTime = Date.now() - startTime;

            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'healthy',
                api_connected: apiConnected,
                api_key_configured: !!this.apiKey,
                credits_info: creditsInfo,
                response_time_ms: responseTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = { FireCrawlMCPTool };