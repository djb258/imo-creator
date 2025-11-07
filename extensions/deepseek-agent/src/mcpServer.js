const WebSocket = require('ws');
const http = require('http');

class MCPServer {
    constructor(deepseekClient, port = 7002) {
        this.deepseekClient = deepseekClient;
        this.port = port;
        this.server = null;
        this.wss = null;
        this.clients = new Set();
    }

    /**
     * Start the MCP server
     */
    async start() {
        return new Promise((resolve, reject) => {
            try {
                // Create HTTP server
                this.server = http.createServer((req, res) => {
                    if (req.url === '/health') {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'ok', service: 'deepseek-mcp' }));
                    } else if (req.url === '/info') {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            name: 'DeepSeek MCP Server',
                            version: '1.0.0',
                            protocol: 'mcp',
                            capabilities: ['chat', 'code-completion', 'code-analysis']
                        }));
                    } else {
                        res.writeHead(404);
                        res.end('Not found');
                    }
                });

                // Create WebSocket server
                this.wss = new WebSocket.Server({ server: this.server });

                this.wss.on('connection', (ws) => {
                    console.log('MCP client connected');
                    this.clients.add(ws);

                    // Notify Composio MCP (if enabled) about new connection
                    if (this.composioEnabled && this.composioUrl) {
                        const remote = ws._socket && ws._socket.remoteAddress ? ws._socket.remoteAddress : null;
                        axios.post(`${this.composioUrl}/mcp/connect`, { remote })
                            .catch((err) => {
                                console.error('Failed to notify Composio about connection:', err.message || err);
                            });
                    }

                    ws.on('message', async (message) => {
                        try {
                            // Always let internal handler process the message first
                            await this.handleMessage(ws, message);
                        } catch (err) {
                            console.error('Error handling message:', err);
                        }

                        // Attempt to forward relevant messages to Composio MCP for cross-server routing
                        if (this.composioEnabled && this.composioUrl) {
                            let payload = null;
                            try {
                                // Accept Buffer or string
                                const text = Buffer.isBuffer(message) ? message.toString('utf8') : message;
                                payload = JSON.parse(text);
                            } catch (e) {
                                // not JSON - nothing to forward
                                payload = null;
                            }

                            if (payload && (payload.forward_to_composio || payload.type === 'relay' || payload.type === 'composio_relay')) {
                                axios.post(`${this.composioUrl}/mcp/relay`, payload, { timeout: 5000 })
                                    .catch((err) => {
                                        console.error('Failed to relay message to Composio:', err.message || err);
                                    });
                            }
                        }
                    });

                    ws.on('close', () => {
                        console.log('MCP client disconnected');
                        this.clients.delete(ws);

                        // Notify Composio about disconnection
                        if (this.composioEnabled && this.composioUrl) {
                            const remote = ws._socket && ws._socket.remoteAddress ? ws._socket.remoteAddress : null;
                            axios.post(`${this.composioUrl}/mcp/disconnect`, { remote })
                                .catch((err) => {
                                    console.error('Failed to notify Composio about disconnect:', err.message || err);
                                });
                        }
                        this.clients.delete(ws);
                    });

                    ws.on('error', (error) => {
                        console.error('WebSocket error:', error);
                        this.clients.delete(ws);
                    });

                    // Send welcome message
                    this.sendMessage(ws, {
                        type: 'welcome',
                        message: 'Connected to DeepSeek MCP Server',
                        capabilities: ['chat', 'code-completion', 'code-analysis']
                    });
                });

                this.server.listen(this.port, () => {
                    console.log(`MCP Server listening on port ${this.port}`);
                    resolve();
                });

                this.server.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Handle incoming messages
     */
    async handleMessage(ws, message) {
        try {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case 'chat':
                    await this.handleChat(ws, data);
                    break;

                case 'completion':
                    await this.handleCompletion(ws, data);
                    break;

                case 'analyze':
                    await this.handleAnalyze(ws, data);
                    break;

                case 'ping':
                    this.sendMessage(ws, { type: 'pong' });
                    break;

                default:
                    this.sendError(ws, `Unknown message type: ${data.type}`);
            }

        } catch (error) {
            this.sendError(ws, `Error processing message: ${error.message}`);
        }
    }

    /**
     * Handle chat request
     */
    async handleChat(ws, data) {
        try {
            const { message, stream = false } = data;

            if (stream) {
                // Streaming response
                await this.deepseekClient.chatStream(
                    message,
                    (chunk) => {
                        this.sendMessage(ws, {
                            type: 'chat-chunk',
                            chunk: chunk
                        });
                    }
                );

                this.sendMessage(ws, {
                    type: 'chat-complete'
                });
            } else {
                // Non-streaming response
                const response = await this.deepseekClient.chat(message);

                this.sendMessage(ws, {
                    type: 'chat-response',
                    response: response
                });
            }

        } catch (error) {
            this.sendError(ws, `Chat error: ${error.message}`);
        }
    }

    /**
     * Handle code completion request
     */
    async handleCompletion(ws, data) {
        try {
            const { code, language, cursor } = data;
            const completion = await this.deepseekClient.getCompletion(code, language, cursor);

            this.sendMessage(ws, {
                type: 'completion-response',
                completion: completion
            });

        } catch (error) {
            this.sendError(ws, `Completion error: ${error.message}`);
        }
    }

    /**
     * Handle code analysis request
     */
    async handleAnalyze(ws, data) {
        try {
            const { code, language, analysisType } = data;

            let prompt = '';
            switch (analysisType) {
                case 'bugs':
                    prompt = `Analyze the following ${language} code for bugs and issues:\n\n\`\`\`${language}\n${code}\n\`\`\``;
                    break;
                case 'performance':
                    prompt = `Analyze the following ${language} code for performance issues:\n\n\`\`\`${language}\n${code}\n\`\`\``;
                    break;
                case 'security':
                    prompt = `Analyze the following ${language} code for security vulnerabilities:\n\n\`\`\`${language}\n${code}\n\`\`\``;
                    break;
                default:
                    prompt = `Analyze the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
            }

            const analysis = await this.deepseekClient.chat(prompt);

            this.sendMessage(ws, {
                type: 'analyze-response',
                analysis: analysis
            });

        } catch (error) {
            this.sendError(ws, `Analysis error: ${error.message}`);
        }
    }

    /**
     * Send message to client
     */
    sendMessage(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    /**
     * Send error to client
     */
    sendError(ws, message) {
        this.sendMessage(ws, {
            type: 'error',
            error: message
        });
    }

    /**
     * Broadcast message to all clients
     */
    broadcast(data) {
        const message = JSON.stringify(data);
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    /**
     * Stop the MCP server
     */
    async stop() {
        return new Promise((resolve) => {
            // Close all client connections
            this.clients.forEach((client) => {
                client.close();
            });
            this.clients.clear();

            // Close WebSocket server
            if (this.wss) {
                this.wss.close(() => {
                    console.log('WebSocket server closed');
                });
            }

            // Close HTTP server
            if (this.server) {
                this.server.close(() => {
                    console.log('HTTP server closed');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = MCPServer;
