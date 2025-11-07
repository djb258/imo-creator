const vscode = require('vscode');
const axios = require('axios');

class DeepSeekClient {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
        this.conversationHistory = [];
    }

    /**
     * Get configuration
     */
    getConfig() {
        const config = vscode.workspace.getConfiguration('deepseek');
        return {
            apiKey: config.get('apiKey'),
            apiEndpoint: config.get('apiEndpoint'),
            model: config.get('model'),
            temperature: config.get('temperature'),
            maxTokens: config.get('maxTokens')
        };
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        const config = this.getConfig();
        if (!config.apiKey) {
            throw new Error('DeepSeek API key is not configured. Please set it in settings.');
        }
        return config;
    }

    /**
     * Send a chat message to DeepSeek
     */
    async chat(message, cancellationToken = null) {
        const config = this.validateConfig();

        this.outputChannel.appendLine(`Sending request to DeepSeek: ${message.substring(0, 100)}...`);

        try {
            const response = await axios.post(
                `${config.apiEndpoint}/chat/completions`,
                {
                    model: config.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI coding assistant integrated into VS Code. Provide clear, concise, and accurate responses. Format code blocks with proper syntax highlighting.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: config.temperature,
                    max_tokens: config.maxTokens,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${config.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000,
                    cancelToken: cancellationToken ? new axios.CancelToken((cancel) => {
                        cancellationToken.onCancellationRequested(() => {
                            cancel('Request cancelled by user');
                        });
                    }) : undefined
                }
            );

            const content = response.data.choices[0].message.content;
            this.outputChannel.appendLine('Response received successfully');

            return content;

        } catch (error) {
            if (axios.isCancel(error)) {
                this.outputChannel.appendLine('Request cancelled');
                throw new Error('Request cancelled');
            }

            this.outputChannel.appendLine(`Error: ${error.message}`);

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 401) {
                    throw new Error('Invalid API key. Please check your DeepSeek API key in settings.');
                } else if (status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                } else if (status === 500) {
                    throw new Error('DeepSeek server error. Please try again later.');
                } else {
                    throw new Error(`API error (${status}): ${data.error?.message || 'Unknown error'}`);
                }
            } else if (error.request) {
                throw new Error('Network error. Please check your internet connection.');
            } else {
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    /**
     * Send a streaming chat message
     */
    async chatStream(message, onChunk, cancellationToken = null) {
        const config = this.validateConfig();

        this.outputChannel.appendLine(`Sending streaming request to DeepSeek`);

        try {
            const response = await axios.post(
                `${config.apiEndpoint}/chat/completions`,
                {
                    model: config.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI coding assistant integrated into VS Code.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: config.temperature,
                    max_tokens: config.maxTokens,
                    stream: true
                },
                {
                    headers: {
                        'Authorization': `Bearer ${config.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'stream',
                    timeout: 60000
                }
            );

            return new Promise((resolve, reject) => {
                let fullContent = '';

                response.data.on('data', (chunk) => {
                    if (cancellationToken?.isCancellationRequested) {
                        response.data.destroy();
                        reject(new Error('Request cancelled'));
                        return;
                    }

                    const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices[0]?.delta?.content || '';
                                if (content) {
                                    fullContent += content;
                                    onChunk(content);
                                }
                            } catch (e) {
                                // Ignore parse errors
                            }
                        }
                    }
                });

                response.data.on('end', () => {
                    this.outputChannel.appendLine('Streaming completed');
                    resolve(fullContent);
                });

                response.data.on('error', (error) => {
                    this.outputChannel.appendLine(`Stream error: ${error.message}`);
                    reject(error);
                });
            });

        } catch (error) {
            this.outputChannel.appendLine(`Streaming error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get code completion
     */
    async getCompletion(code, language, cursor) {
        const prompt = `Complete the following ${language} code at the cursor position (marked with <CURSOR>):

\`\`\`${language}
${code}
\`\`\`

Provide only the completion, without explanations.`;

        return await this.chat(prompt);
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        this.outputChannel.appendLine('Conversation history cleared');
    }
}

module.exports = DeepSeekClient;
