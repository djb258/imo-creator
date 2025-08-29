/**
 * EmailValidatorMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * EmailValidator MCP Tool Handler
 */
class EmailValidatorMCPTool extends SimpleMCPTool {
    constructor() {
        super('email-validator', {
            version: '1.0.5',
            orbtLayer: 6, // Automated/utility level
            systemCode: 'EMLVAL'
        });
        
        // Cache for DNS lookups to improve performance
        this.dnsCache = new Map();
        this.cacheTimeout = 3600000; // 1 hour
        
        // Common disposable email domains
        this.disposableDomains = new Set([
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email', 'temp-mail.org'
        ]);
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, email, emails, options = {} } = params;
        
        // Validate operation type
        const allowedOperations = [
            'validate_single', 'validate_batch', 'check_deliverability',
            'verify_domain', 'detect_disposable', 'suggest_corrections'
        ];
        
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'validate_single':
                result = await this.validateSingle(email, options);
                break;
            case 'validate_batch':
                result = await this.validateBatch(emails, options);
                break;
            case 'check_deliverability':
                result = await this.checkDeliverability(email);
                break;
            case 'verify_domain':
                result = await this.verifyDomain(params.domain);
                break;
            case 'detect_disposable':
                result = await this.detectDisposable(email);
                break;
            case 'suggest_corrections':
                result = await this.suggestCorrections(email);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        };
    }

    

    /**
     * Health check implementation
     */
    async healthCheck() {
        try {
            const startTime = Date.now();
            
            // Test validation functionality
            const testEmail = 'test@example.com';
            const validation = await this.validateSingle(testEmail, { checkDeliverability: false });
            
            // Test DNS resolution
            let dnsWorking = false;
            try {
                await dns.resolve4('google.com');
                dnsWorking = true;
            } catch (error) {
                // DNS test failed
            }

            const responseTime = Date.now() - startTime;

            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'healthy',
                validator_functional: validation.checks.syntax,
                dns_resolution: dnsWorking,
                cache_size: this.dnsCache.size,
                disposable_domains_loaded: this.disposableDomains.size,
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

module.exports = { EmailValidatorMCPTool };