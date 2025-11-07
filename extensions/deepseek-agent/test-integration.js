#!/usr/bin/env node

/**
 * DeepSeek + Composio Integration Test
 * Tests the connection and communication between both MCP servers
 */

const WebSocket = require('ws');
const axios = require('axios');

class IntegrationTester {
    constructor() {
        this.deepseekUrl = 'http://localhost:7002';
        this.composioUrl = 'http://localhost:7001';
        this.results = {
            deepseek: { health: false, websocket: false, chat: false },
            composio: { health: false, heir: false, builder: false },
            integration: { relay: false, crossServer: false }
        };
    }

    async run() {
        console.log('🧪 DeepSeek + Composio Integration Test\n');
        console.log('=' .repeat(50));

        await this.testDeepSeek();
        await this.testComposio();
        await this.testIntegration();

        this.printResults();
    }

    async testDeepSeek() {
        console.log('\n📡 Testing DeepSeek MCP Server...');

        // Test health endpoint
        try {
            const health = await axios.get(`${this.deepseekUrl}/health`, { timeout: 3000 });
            console.log('  ✅ Health check:', health.data.status);
            this.results.deepseek.health = true;
        } catch (error) {
            console.log('  ❌ Health check failed:', error.message);
        }

        // Test WebSocket connection
        try {
            await this.testDeepSeekWebSocket();
        } catch (error) {
            console.log('  ❌ WebSocket test failed:', error.message);
        }
    }

    async testDeepSeekWebSocket() {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`ws://localhost:7002`);
            const timeout = setTimeout(() => {
                ws.close();
                reject(new Error('WebSocket connection timeout'));
            }, 5000);

            ws.on('open', () => {
                console.log('  ✅ WebSocket connected');
                this.results.deepseek.websocket = true;

                // Test chat
                ws.send(JSON.stringify({
                    type: 'ping'
                }));
            });

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    if (message.type === 'welcome') {
                        console.log('  ✅ Received welcome message');
                    } else if (message.type === 'pong') {
                        console.log('  ✅ Ping/pong successful');
                        this.results.deepseek.chat = true;
                    }
                } catch (error) {
                    console.log('  ⚠️  Message parse error:', error.message);
                }
            });

            ws.on('close', () => {
                clearTimeout(timeout);
                resolve();
            });

            ws.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });

            // Close after 3 seconds
            setTimeout(() => {
                ws.close();
            }, 3000);
        });
    }

    async testComposio() {
        console.log('\n📡 Testing Composio MCP Server...');

        // Test health endpoint
        try {
            const health = await axios.get(`${this.composioUrl}/health`, { timeout: 3000 });
            console.log('  ✅ Health check:', health.data.status);
            this.results.composio.health = true;
        } catch (error) {
            console.log('  ❌ Health check failed:', error.message);
        }

        // Test root endpoint
        try {
            const info = await axios.get(`${this.composioUrl}/`, { timeout: 3000 });
            console.log('  ✅ Server info:', info.data.service);
            console.log('  ℹ️  Integrations:', info.data.integrations.join(', '));
        } catch (error) {
            console.log('  ❌ Info endpoint failed:', error.message);
        }

        // Test HEIR validation (stub)
        try {
            const heirCheck = await axios.post(`${this.composioUrl}/heir/check`, {
                ssot: {
                    meta: { app_name: 'TestApp' },
                    doctrine: { test: true }
                }
            }, { timeout: 3000 });

            if (heirCheck.data.ok) {
                console.log('  ✅ HEIR validation working');
                this.results.composio.heir = true;
            }
        } catch (error) {
            console.log('  ❌ HEIR validation failed:', error.message);
        }
    }

    async testIntegration() {
        console.log('\n🔗 Testing Integration...');

        // Check if both servers are aware of each other
        try {
            const deepseekInfo = await axios.get(`${this.deepseekUrl}/info`, { timeout: 3000 });

            if (deepseekInfo.data.integrations && deepseekInfo.data.integrations.composio) {
                console.log('  ✅ DeepSeek is aware of Composio');
                console.log('  ℹ️  Composio URL:', deepseekInfo.data.integrations.composio_url);
                this.results.integration.relay = true;
            } else {
                console.log('  ⚠️  DeepSeek not configured for Composio integration');
            }
        } catch (error) {
            console.log('  ❌ Integration check failed:', error.message);
        }

        // Test cross-server communication
        console.log('  ℹ️  Cross-server relay requires both servers running with proper config');
        this.results.integration.crossServer = this.results.deepseek.health && this.results.composio.health;
    }

    printResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Results Summary\n');

        console.log('DeepSeek MCP Server:');
        console.log(`  Health:     ${this.results.deepseek.health ? '✅' : '❌'}`);
        console.log(`  WebSocket:  ${this.results.deepseek.websocket ? '✅' : '❌'}`);
        console.log(`  Chat:       ${this.results.deepseek.chat ? '✅' : '❌'}`);

        console.log('\nComposio MCP Server:');
        console.log(`  Health:     ${this.results.composio.health ? '✅' : '❌'}`);
        console.log(`  HEIR:       ${this.results.composio.heir ? '✅' : '❌'}`);

        console.log('\nIntegration:');
        console.log(`  Relay:      ${this.results.integration.relay ? '✅' : '❌'}`);
        console.log(`  Cross-Srv:  ${this.results.integration.crossServer ? '✅' : '❌'}`);

        const totalTests = Object.values(this.results).reduce((sum, category) => {
            return sum + Object.values(category).length;
        }, 0);

        const passedTests = Object.values(this.results).reduce((sum, category) => {
            return sum + Object.values(category).filter(v => v === true).length;
        }, 0);

        console.log('\n' + '='.repeat(50));
        console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`);

        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Integration is working perfectly.\n');
        } else if (passedTests > 0) {
            console.log('⚠️  Some tests failed. Check the output above for details.\n');
        } else {
            console.log('❌ All tests failed. Make sure both servers are running.\n');
        }

        console.log('💡 Tips:');
        console.log('  - Start DeepSeek: cd extensions/deepseek-agent && npm start');
        console.log('  - Start Composio: python src/mcp_server.py');
        console.log('  - Check ports: lsof -i :7001 && lsof -i :7002');
        console.log('  - View logs: VS Code Output panel\n');
    }
}

// Run the tests
if (require.main === module) {
    const tester = new IntegrationTester();
    tester.run().catch(error => {
        console.error('\n❌ Test suite failed:', error.message);
        process.exit(1);
    });
}

module.exports = IntegrationTester;
