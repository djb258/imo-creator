# DeepSeek Agent - Quick Start Guide

This guide will help you get started with the DeepSeek AI Agent extension for VS Code.

## Quick Setup (5 minutes)

### Step 1: Get Your API Key
1. Visit [https://platform.deepseek.com](https://platform.deepseek.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it in Step 3)

### Step 2: Install the Extension

#### Option A: Install from VSIX (Recommended)
```bash
cd extensions/deepseek-agent
npm install
npm run package
```
Then in VS Code: `Ctrl+Shift+P` → "Extensions: Install from VSIX" → Select the `.vsix` file

#### Option B: Development Mode
```bash
cd extensions/deepseek-agent
npm install
code .
```
Press `F5` to launch in development mode

### Step 3: Configure Your API Key
1. Open VS Code Settings: `Ctrl+,` (or `Cmd+,` on Mac)
2. Search for "deepseek"
3. Paste your API key in `DeepSeek: Api Key`
4. Save settings

### Step 4: Start Using DeepSeek
Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to open the chat!

## Common Use Cases

### 1. Explain Code
**Scenario**: You're reviewing unfamiliar code and need to understand what it does.

**Steps**:
1. Select the code you want explained
2. Right-click → "DeepSeek: Explain Selected Code"
3. Or press `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`)

**Example**:
```javascript
// Select this code and explain it
const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key);
  };
};
```

### 2. Refactor Legacy Code
**Scenario**: You have old code that needs modernization.

**Steps**:
1. Select the code to refactor
2. Right-click → "DeepSeek: Refactor Code"

**Example**:
```javascript
// Before refactoring
function getUserData(userId) {
  var user = null;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/users/' + userId, false);
  xhr.send();
  if (xhr.status === 200) {
    user = JSON.parse(xhr.responseText);
  }
  return user;
}
```

### 3. Generate Unit Tests
**Scenario**: You need comprehensive tests for your functions.

**Steps**:
1. Select the function to test
2. Right-click → "DeepSeek: Generate Tests"

**Example**:
```python
# Select this function and generate tests
def validate_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
```

### 4. Fix Bugs
**Scenario**: Your code has issues and you need help identifying them.

**Steps**:
1. Select the problematic code
2. Right-click → "DeepSeek: Fix Bugs"

**Example**:
```javascript
// This has a bug - let DeepSeek find and fix it
function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i <= numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}
```

### 5. Optimize Performance
**Scenario**: Your code works but is slow.

**Steps**:
1. Select the code to optimize
2. Command Palette → "DeepSeek: Optimize Code"

**Example**:
```python
# Optimize this code
def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates
```

### 6. Generate Documentation
**Scenario**: You need to document your code.

**Steps**:
1. Select the function/class
2. Command Palette → "DeepSeek: Generate Documentation"

**Example**:
```typescript
// Generate docs for this class
class DataProcessor {
  constructor(private config: Config) {}

  process(data: any[]): ProcessedData[] {
    return data.map(item => this.transform(item));
  }

  private transform(item: any): ProcessedData {
    return { ...item, processed: true };
  }
}
```

### 7. Interactive Chat
**Scenario**: You have questions about coding concepts or need help with a problem.

**Steps**:
1. Press `Ctrl+Shift+D` (Mac: `Cmd+Shift+D`)
2. Type your question
3. Press Enter

**Example Questions**:
- "How do I implement a binary search tree in Python?"
- "What's the difference between async/await and promises?"
- "How can I optimize this SQL query?"
- "Explain the SOLID principles with examples"

### 8. Custom Prompts
**Scenario**: You have a specific task that doesn't fit the predefined commands.

**Steps**:
1. Select relevant code
2. Command Palette → "DeepSeek: Custom Prompt"
3. Enter your custom instruction

**Example Prompts**:
- "Convert this to TypeScript with proper types"
- "Add error handling and logging"
- "Rewrite this using functional programming"
- "Add JSDoc comments"
- "Convert this class to use composition instead of inheritance"

## Keyboard Shortcuts Cheat Sheet

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Open Chat | `Ctrl+Shift+D` | `Cmd+Shift+D` |
| Explain Code | `Ctrl+Shift+E` | `Cmd+Shift+E` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Settings | `Ctrl+,` | `Cmd+,` |

## Tips & Best Practices

### 1. Provide Context
When asking questions, include relevant context:
```
Bad:  "Fix this"
Good: "This function should validate user input but it's not catching empty strings. Can you fix it?"
```

### 2. Use Specific Commands
Use the right command for the job:
- **Explain**: Understanding existing code
- **Refactor**: Improving code structure
- **Generate Tests**: Creating test cases
- **Fix Bugs**: Identifying and fixing issues
- **Optimize**: Improving performance

### 3. Adjust Context Window
If responses lack context, increase the context window:
```json
{
  "deepseek.contextWindow": 20  // Default is 10
}
```

### 4. Choose the Right Model
- **deepseek-chat**: General purpose, good for explanations
- **deepseek-coder**: Optimized for code generation and analysis

```json
{
  "deepseek.model": "deepseek-coder"
}
```

### 5. Adjust Temperature
- Lower (0.1-0.3): More focused, deterministic responses
- Medium (0.5-0.7): Balanced creativity and accuracy
- Higher (0.8-1.0): More creative, varied responses

```json
{
  "deepseek.temperature": 0.3  // For precise code generation
}
```

## Workflow Examples

### Workflow 1: Code Review
1. Open a file to review
2. Select a function
3. "Explain Selected Code" to understand it
4. "Fix Bugs" to identify issues
5. "Optimize Code" for performance improvements
6. "Generate Tests" to ensure quality

### Workflow 2: Legacy Code Modernization
1. Select old code
2. "Refactor Code" to modernize syntax
3. Review suggestions
4. "Generate Tests" for the refactored code
5. "Generate Documentation" for the new code

### Workflow 3: Learning New Concepts
1. Open chat (`Ctrl+Shift+D`)
2. Ask: "Explain [concept] with examples"
3. Ask follow-up questions
4. Request code examples
5. Use "Custom Prompt" to apply to your code

## Troubleshooting Quick Fixes

### Issue: "Invalid API Key"
**Fix**:
```bash
# Check your API key in settings
# Make sure there are no spaces or extra characters
```

### Issue: Slow Responses
**Fix**:
```json
{
  "deepseek.maxTokens": 2048,  // Reduce from 4096
  "deepseek.contextWindow": 5   // Reduce from 10
}
```

### Issue: MCP Server Won't Start
**Fix**:
```json
{
  "deepseek.mcpPort": 7003  // Try a different port
}
```

### Issue: Extension Not Activating
**Fix**:
```bash
# Reinstall dependencies
cd extensions/deepseek-agent
rm -rf node_modules
npm install
```

## Advanced Usage

### Using with MCP Protocol
Connect other tools to the DeepSeek MCP server:

```javascript
// Example: Connect via WebSocket
const ws = new WebSocket('ws://localhost:7002');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'chat',
    message: 'Explain async/await',
    stream: true
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log(response);
});
```

### Programmatic API Usage
```javascript
// In your VS Code extension
const deepseek = vscode.extensions.getExtension('imo-creator.deepseek-agent');
if (deepseek) {
  const api = deepseek.exports;
  const response = await api.chat('Your question here');
}
```

## Next Steps

1. **Explore All Commands**: Try each command to see what works best for you
2. **Customize Settings**: Adjust settings to match your workflow
3. **Learn Shortcuts**: Memorize keyboard shortcuts for faster access
4. **Integrate with Workflow**: Make DeepSeek part of your daily coding routine
5. **Provide Feedback**: Report issues and suggest features

## Resources

- **Documentation**: See `README.md` for full documentation
- **API Reference**: [https://platform.deepseek.com/docs](https://platform.deepseek.com/docs)
- **VS Code API**: [https://code.visualstudio.com/api](https://code.visualstudio.com/api)
- **Issues**: Report bugs on GitHub

## Example Project Setup

Here's a complete example of setting up DeepSeek in a project:

```json
// .vscode/settings.json
{
  "deepseek.apiKey": "your_key_here",
  "deepseek.model": "deepseek-coder",
  "deepseek.temperature": 0.5,
  "deepseek.maxTokens": 4096,
  "deepseek.contextWindow": 15,
  "deepseek.enableMCP": true,
  "deepseek.mcpPort": 7002
}
```

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start DeepSeek MCP",
      "type": "shell",
      "command": "node",
      "args": ["extensions/deepseek-agent/src/mcpServer.js"],
      "isBackground": true
    }
  ]
}
```

---

**Happy Coding with DeepSeek! 🚀**

Need help? Open the chat with `Ctrl+Shift+D` and ask DeepSeek!
