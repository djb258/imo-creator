#!/usr/bin/env node

/**
 * Comprehensive Composio Tools Testing Suite
 * Tests all connected services and documents functionality with timestamps
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ComposioToolTester {
    constructor() {
        this.testReport = {
            timestamp: new Date().toISOString(),
            repository: 'imo-creator',
            mcpEndpoint: 'http://localhost:3001/tool',
            testResults: {},
            serviceOverview: {},
            summary: {
                totalServices: 0,
                connectedServices: 0,
                workingServices: 0,
                failedServices: 0
            }
        };
    }

    async runAllTests() {
        console.log('🧪 Starting Comprehensive Composio Tools Testing Suite\n');

        await this.testMCPConnection();
        await this.getConnectedAccounts();
        await this.testGoogleServices();
        await this.testAdditionalServices();
        await this.generateReport();

        console.log('\n✅ All tests completed!');
        return this.testReport;
    }

    async testMCPConnection() {
        console.log('🔌 Testing MCP Server Connection...');

        try {
            const payload = {
                tool: 'get_composio_stats',
                data: {},
                unique_id: `HEIR-2025-09-TEST-${Date.now()}`,
                process_id: 'PRC-TEST-001',
                orbt_layer: 2,
                blueprint_version: '1.0'
            };

            const curlCommand = `curl -s -X POST ${this.testReport.mcpEndpoint} -H "Content-Type: application/json" -d "${JSON.stringify(payload).replace(/"/g, '\\"')}"`;
            const response = execSync(curlCommand, { encoding: 'utf8' });
            const data = JSON.parse(response);

            this.testReport.testResults.mcp_connection = {
                status: 'SUCCESS',
                timestamp: new Date().toISOString(),
                response: data,
                details: 'MCP server responding correctly'
            };

            console.log('✅ MCP Server: CONNECTED');
        } catch (error) {
            this.testReport.testResults.mcp_connection = {
                status: 'FAILED',
                timestamp: new Date().toISOString(),
                error: error.message,
                details: 'MCP server connection failed'
            };
            console.log('❌ MCP Server: FAILED');
        }
    }

    async getConnectedAccounts() {
        console.log('\n📱 Getting All Connected Accounts...');

        const services = ['GMAIL', 'GOOGLEDRIVE', 'GOOGLECALENDAR', 'GOOGLESHEETS', 'NOTION', 'RENDER', 'VERCEL', 'GITHUB', 'SLACK'];

        for (const service of services) {
            try {
                const payload = {
                    tool: 'manage_connected_account',
                    data: {
                        action: 'list',
                        app: service
                    },
                    unique_id: `HEIR-2025-09-LIST-${service}-${Date.now()}`,
                    process_id: 'PRC-LIST-001',
                    orbt_layer: 2,
                    blueprint_version: '1.0'
                };

                const curlCommand = `curl -s -X POST ${this.testReport.mcpEndpoint} -H "Content-Type: application/json" -d "${JSON.stringify(payload).replace(/"/g, '\\"')}"`;
                const response = execSync(curlCommand, { encoding: 'utf8' });
                const data = JSON.parse(response);

                const accounts = data.result?.account_data?.items || [];

                this.testReport.serviceOverview[service.toLowerCase()] = {
                    status: accounts.length > 0 ? 'CONNECTED' : 'NOT_CONNECTED',
                    accountCount: accounts.length,
                    accounts: accounts.map(acc => ({
                        id: acc.id,
                        status: acc.status,
                        connectionTime: acc.createdAt || 'unknown'
                    })),
                    lastChecked: new Date().toISOString()
                };

                console.log(`${accounts.length > 0 ? '✅' : '❌'} ${service}: ${accounts.length} accounts`);

                if (accounts.length > 0) {
                    this.testReport.summary.connectedServices++;
                }
                this.testReport.summary.totalServices++;

            } catch (error) {
                this.testReport.serviceOverview[service.toLowerCase()] = {
                    status: 'ERROR',
                    error: error.message,
                    lastChecked: new Date().toISOString()
                };
                console.log(`❌ ${service}: ERROR - ${error.message}`);
                this.testReport.summary.totalServices++;
            }
        }
    }

    async testGoogleServices() {
        console.log('\n🧪 Testing Google Services Functionality...');

        // Test Gmail
        await this.testServiceTool('GMAIL', 'GMAIL_GET_PROFILE', {}, 'Gmail Profile Access');

        // Test Google Drive
        await this.testServiceTool('GOOGLEDRIVE', 'GOOGLEDRIVE_LIST_FILES', { pageSize: 3 }, 'Google Drive File Listing');

        // Test Google Calendar
        await this.testServiceTool('GOOGLECALENDAR', 'GOOGLECALENDAR_LIST_CALENDARS', {}, 'Google Calendar Listing');

        // Test Google Sheets
        await this.testServiceTool('GOOGLESHEETS', 'GOOGLESHEETS_LIST_SPREADSHEETS', {}, 'Google Sheets Listing');
    }

    async testAdditionalServices() {
        console.log('\n🧪 Testing Additional Services...');

        // Test Notion if available
        if (this.testReport.serviceOverview.notion?.accountCount > 0) {
            await this.testServiceTool('NOTION', 'NOTION_LIST_PAGES', {}, 'Notion Pages Listing');
        }

        // Test GitHub if available
        if (this.testReport.serviceOverview.github?.accountCount > 0) {
            await this.testServiceTool('GITHUB', 'GITHUB_GET_USER', {}, 'GitHub User Info');
        }

        // Test Slack if available
        if (this.testReport.serviceOverview.slack?.accountCount > 0) {
            await this.testServiceTool('SLACK', 'SLACK_LIST_CHANNELS', {}, 'Slack Channels Listing');
        }
    }

    async testServiceTool(appName, toolName, inputParams, description) {
        try {
            const serviceAccounts = this.testReport.serviceOverview[appName.toLowerCase()]?.accounts || [];

            if (serviceAccounts.length === 0) {
                console.log(`⚠️  ${description}: No accounts available`);
                return;
            }

            const testAccount = serviceAccounts[0];

            const payload = {
                tool: 'execute_tool',
                data: {
                    tool_name: toolName,
                    connected_account_id: testAccount.id,
                    input: inputParams
                },
                unique_id: `HEIR-2025-09-TOOL-${toolName}-${Date.now()}`,
                process_id: 'PRC-TOOL-001',
                orbt_layer: 2,
                blueprint_version: '1.0'
            };

            const curlCommand = `curl -s -X POST ${this.testReport.mcpEndpoint} -H "Content-Type: application/json" -d "${JSON.stringify(payload).replace(/"/g, '\\"')}"`;
            const response = execSync(curlCommand, { encoding: 'utf8', timeout: 10000 });
            const data = JSON.parse(response);

            if (data.success || data.result) {
                this.testReport.testResults[toolName.toLowerCase()] = {
                    status: 'SUCCESS',
                    timestamp: new Date().toISOString(),
                    tool: toolName,
                    accountUsed: testAccount.id,
                    response: data.result || data,
                    description: description
                };
                console.log(`✅ ${description}: SUCCESS`);
                this.testReport.summary.workingServices++;
            } else {
                throw new Error(data.error || 'Tool execution failed');
            }

        } catch (error) {
            this.testReport.testResults[toolName.toLowerCase()] = {
                status: 'FAILED',
                timestamp: new Date().toISOString(),
                tool: toolName,
                error: error.message,
                description: description
            };
            console.log(`❌ ${description}: FAILED - ${error.message.substring(0, 50)}...`);
            this.testReport.summary.failedServices++;
        }
    }

    generateReport() {
        console.log('\n📊 COMPREHENSIVE TEST REPORT');
        console.log('=' .repeat(60));

        console.log(`\n🎯 SUMMARY:`);
        console.log(`   Total Services Checked: ${this.testReport.summary.totalServices}`);
        console.log(`   Connected Services: ${this.testReport.summary.connectedServices}`);
        console.log(`   Working Tools: ${this.testReport.summary.workingServices}`);
        console.log(`   Failed Tools: ${this.testReport.summary.failedServices}`);

        console.log(`\n🔗 CONNECTED SERVICES:`);
        Object.entries(this.testReport.serviceOverview).forEach(([service, data]) => {
            if (data.status === 'CONNECTED') {
                console.log(`   ✅ ${service.toUpperCase()}: ${data.accountCount} accounts`);
            }
        });

        console.log(`\n⚡ WORKING TOOLS:`);
        Object.entries(this.testReport.testResults).forEach(([tool, data]) => {
            if (data.status === 'SUCCESS') {
                console.log(`   ✅ ${data.description}`);
            }
        });

        if (this.testReport.summary.failedServices > 0) {
            console.log(`\n⚠️  FAILED TOOLS:`);
            Object.entries(this.testReport.testResults).forEach(([tool, data]) => {
                if (data.status === 'FAILED') {
                    console.log(`   ❌ ${data.description}: ${data.error?.substring(0, 50)}...`);
                }
            });
        }

        // Save detailed report
        const reportPath = path.join(process.cwd(), '.composio-test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.testReport, null, 2));
        console.log(`\n💾 Detailed test report saved: ${reportPath}`);

        // Update tools overview file
        this.updateToolsFile();
    }

    updateToolsFile() {
        const toolsOverview = {
            lastUpdated: new Date().toISOString(),
            mcpServer: {
                endpoint: this.testReport.mcpEndpoint,
                status: this.testReport.testResults.mcp_connection?.status || 'UNKNOWN'
            },
            connectedServices: this.testReport.serviceOverview,
            testingSummary: this.testReport.summary,
            verifiedTools: Object.entries(this.testReport.testResults)
                .filter(([_, data]) => data.status === 'SUCCESS')
                .map(([tool, data]) => ({
                    tool: data.tool,
                    description: data.description,
                    lastTested: data.timestamp
                }))
        };

        const toolsPath = path.join(process.cwd(), 'COMPOSIO_TOOLS_STATUS.json');
        fs.writeFileSync(toolsPath, JSON.stringify(toolsOverview, null, 2));
        console.log(`💾 Tools overview updated: ${toolsPath}`);
    }
}

// Run the comprehensive test if called directly
if (require.main === module) {
    const tester = new ComposioToolTester();
    tester.runAllTests().then(report => {
        console.log('\n🎉 All Composio tools tested and documented!');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Testing failed:', error.message);
        process.exit(1);
    });
}

module.exports = ComposioToolTester;