const vscode = require('vscode');
const axios = require('axios');
const DeepSeekClient = require('./deepseekClient');
const ChatViewProvider = require('./chatViewProvider');
const MCPServer = require('./mcpServer');

let deepseekClient;
let chatViewProvider;
let mcpServer;
let outputChannel;

/**
 * Activate the DeepSeek extension
 */
async function activate(context) {
    console.log('DeepSeek Agent extension is now active');

    // Create output channel
    outputChannel = vscode.window.createOutputChannel('DeepSeek Agent');
    outputChannel.appendLine('DeepSeek Agent extension activated');

    // Initialize DeepSeek client
    deepseekClient = new DeepSeekClient(outputChannel);

    // Register chat view provider
    chatViewProvider = new ChatViewProvider(context.extensionUri, deepseekClient);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('deepseek.chatView', chatViewProvider)
    );

    // Start MCP server if enabled
    const config = vscode.workspace.getConfiguration('deepseek');
    if (config.get('enableMCP')) {
        mcpServer = new MCPServer(deepseekClient, config.get('mcpPort'));
        await mcpServer.start();
        outputChannel.appendLine(`MCP Server started on port ${config.get('mcpPort')}`);
    }

    // Register commands
    registerCommands(context);

    // Show welcome message
    vscode.window.showInformationMessage('DeepSeek Agent is ready! Press Ctrl+Shift+D to start chatting.');
}

/**
 * Register all extension commands
 */
function registerCommands(context) {
    // Chat command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.chat', async () => {
            await vscode.commands.executeCommand('deepseek.chatView.focus');
        })
    );

    // Explain code command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.explainCode', async () => {
            await handleCodeAction('explain', 'Explain the following code in detail:');
        })
    );

    // Refactor code command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.refactorCode', async () => {
            await handleCodeAction('refactor', 'Refactor the following code to improve readability and maintainability:');
        })
    );

    // Generate tests command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.generateTests', async () => {
            await handleCodeAction('test', 'Generate comprehensive unit tests for the following code:');
        })
    );

    // Fix bugs command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.fixBugs', async () => {
            await handleCodeAction('fix', 'Analyze and fix any bugs or issues in the following code:');
        })
    );

    // Optimize code command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.optimizeCode', async () => {
            await handleCodeAction('optimize', 'Optimize the following code for better performance:');
        })
    );

    // Generate documentation command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.generateDocumentation', async () => {
            await handleCodeAction('document', 'Generate comprehensive documentation for the following code:');
        })
    );

    // Custom prompt command
    context.subscriptions.push(
        vscode.commands.registerCommand('deepseek.customPrompt', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            if (!selectedText) {
                vscode.window.showErrorMessage('Please select some code first');
                return;
            }

            const customPrompt = await vscode.window.showInputBox({
                prompt: 'Enter your custom prompt',
                placeHolder: 'What would you like DeepSeek to do with the selected code?'
            });

            if (customPrompt) {
                await handleCodeAction('custom', customPrompt);
            }
        })
    );
}

/**
 * Handle code action commands
 */
async function handleCodeAction(action, promptPrefix) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
        vscode.window.showErrorMessage('Please select some code first');
        return;
    }

    // Get file context
    const document = editor.document;
    const languageId = document.languageId;
    const fileName = document.fileName;

    // Build context
    const config = vscode.workspace.getConfiguration('deepseek');
    const contextWindow = config.get('contextWindow', 10);
    const startLine = Math.max(0, selection.start.line - contextWindow);
    const endLine = Math.min(document.lineCount - 1, selection.end.line + contextWindow);
    const contextRange = new vscode.Range(startLine, 0, endLine, document.lineAt(endLine).text.length);
    const contextText = document.getText(contextRange);

    // Show progress
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `DeepSeek is ${action}ing your code...`,
        cancellable: true
    }, async (progress, token) => {
        try {
            // Build prompt
            const prompt = `${promptPrefix}

File: ${fileName}
Language: ${languageId}

Context:
\`\`\`${languageId}
${contextText}
\`\`\`

Selected Code:
\`\`\`${languageId}
${selectedText}
\`\`\`

Please provide a detailed response.`;

            // Get response from DeepSeek
            const response = await deepseekClient.chat(prompt, token);

            if (token.isCancellationRequested) {
                return;
            }

            // Show response in a new document
            const doc = await vscode.workspace.openTextDocument({
                content: response,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

            outputChannel.appendLine(`Action '${action}' completed successfully`);

        } catch (error) {
            vscode.window.showErrorMessage(`DeepSeek error: ${error.message}`);
            outputChannel.appendLine(`Error: ${error.message}`);
        }
    });
}

/**
 * Deactivate the extension
 */
async function deactivate() {
    if (mcpServer) {
        await mcpServer.stop();
    }
    if (outputChannel) {
        outputChannel.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
