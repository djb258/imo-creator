const vscode = require('vscode');

class ChatViewProvider {
    constructor(extensionUri, deepseekClient) {
        this._extensionUri = extensionUri;
        this._deepseekClient = deepseekClient;
        this._view = undefined;
    }

    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this._handleSendMessage(data.message);
                    break;
                case 'clearChat':
                    this._deepseekClient.clearHistory();
                    break;
            }
        });
    }

    async _handleSendMessage(message) {
        try {
            // Show user message
            this._view.webview.postMessage({
                type: 'userMessage',
                message: message
            });

            // Show loading indicator
            this._view.webview.postMessage({
                type: 'loading',
                isLoading: true
            });

            // Get response from DeepSeek
            let fullResponse = '';
            await this._deepseekClient.chatStream(
                message,
                (chunk) => {
                    fullResponse += chunk;
                    this._view.webview.postMessage({
                        type: 'assistantChunk',
                        chunk: chunk
                    });
                }
            );

            // Hide loading indicator
            this._view.webview.postMessage({
                type: 'loading',
                isLoading: false
            });

        } catch (error) {
            this._view.webview.postMessage({
                type: 'error',
                message: error.message
            });

            this._view.webview.postMessage({
                type: 'loading',
                isLoading: false
            });
        }
    }

    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepSeek Chat</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        #chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .message {
            padding: 12px;
            border-radius: 6px;
            max-width: 90%;
            word-wrap: break-word;
        }

        .user-message {
            background-color: var(--vscode-input-background);
            align-self: flex-end;
            border: 1px solid var(--vscode-input-border);
        }

        .assistant-message {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            align-self: flex-start;
        }

        .error-message {
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            align-self: center;
            max-width: 100%;
        }

        .loading {
            display: flex;
            gap: 4px;
            padding: 12px;
        }

        .loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--vscode-foreground);
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        #input-container {
            padding: 16px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            gap: 8px;
            background-color: var(--vscode-editor-background);
        }

        #message-input {
            flex: 1;
            padding: 8px 12px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            resize: none;
            min-height: 36px;
            max-height: 120px;
        }

        #message-input:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }

        button {
            padding: 8px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .header {
            padding: 12px 16px;
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h3 {
            font-size: 14px;
            font-weight: 600;
        }

        .clear-btn {
            padding: 4px 12px;
            font-size: 12px;
        }

        code {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: var(--vscode-editor-font-family);
        }

        pre {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 8px 0;
        }

        pre code {
            padding: 0;
            background: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h3>DeepSeek Chat</h3>
        <button class="clear-btn" onclick="clearChat()">Clear</button>
    </div>

    <div id="chat-container"></div>

    <div id="input-container">
        <textarea
            id="message-input"
            placeholder="Ask DeepSeek anything..."
            rows="1"
        ></textarea>
        <button id="send-btn" onclick="sendMessage()">Send</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const chatContainer = document.getElementById('chat-container');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        let currentAssistantMessage = null;

        // Handle Enter key
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = messageInput.scrollHeight + 'px';
        });

        function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            vscode.postMessage({
                type: 'sendMessage',
                message: message
            });

            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendBtn.disabled = true;
        }

        function clearChat() {
            chatContainer.innerHTML = '';
            vscode.postMessage({ type: 'clearChat' });
        }

        function addMessage(content, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${type}-message\`;
            messageDiv.textContent = content;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function showLoading(show) {
            const existingLoading = document.querySelector('.loading');
            if (existingLoading) {
                existingLoading.remove();
            }

            if (show) {
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'loading';
                loadingDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';
                chatContainer.appendChild(loadingDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;

            switch (message.type) {
                case 'userMessage':
                    addMessage(message.message, 'user');
                    currentAssistantMessage = null;
                    break;

                case 'assistantChunk':
                    if (!currentAssistantMessage) {
                        currentAssistantMessage = document.createElement('div');
                        currentAssistantMessage.className = 'message assistant-message';
                        chatContainer.appendChild(currentAssistantMessage);
                    }
                    currentAssistantMessage.textContent += message.chunk;
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    break;

                case 'loading':
                    showLoading(message.isLoading);
                    sendBtn.disabled = message.isLoading;
                    break;

                case 'error':
                    addMessage('Error: ' + message.message, 'error');
                    sendBtn.disabled = false;
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}

module.exports = ChatViewProvider;
