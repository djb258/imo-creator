# DeepSeek + Composio Integration Workflows

## Visual Workflow Diagrams

### Workflow 1: AI-Powered Component Generation

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
│  "Generate a login form component with email and password"      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VS CODE DEEPSEEK EXTENSION                    │
│  • Captures user request                                        │
│  • Gathers context (file, language, framework)                  │
│  • Sends to DeepSeek MCP Server                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Receives chat request via WebSocket                          │
│  • Prepares prompt with context                                 │
│  • Calls DeepSeek API                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DEEPSEEK API                               │
│  • Processes request with deepseek-chat model                   │
│  • Generates React login form component                         │
│  • Returns code with TypeScript types                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Receives generated code                                      │
│  • Detects validation opportunity                               │
│  • Prepares relay message to Composio                           │
│  • POST to http://localhost:7001/mcp/relay                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO MCP SERVER (7001)                     │
│  • Receives relay message from DeepSeek                         │
│  • Extracts code for HEIR validation                            │
│  • Calls HEIR validator                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       HEIR VALIDATOR                             │
│  • Validates component structure                                │
│  • Checks SSOT compliance                                       │
│  • Verifies prop types and interfaces                           │
│  • Returns validation result                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO MCP SERVER (7001)                     │
│  • Receives validation result (✅ PASSED)                       │
│  • Optionally creates in Builder.io                             │
│  • Sends response back to DeepSeek                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Receives validation result                                   │
│  • Combines with generated code                                 │
│  • Sends complete response to VS Code                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VS CODE DEEPSEEK EXTENSION                    │
│  • Displays generated code in editor                            │
│  • Shows validation status: ✅ HEIR Compliant                   │
│  • Provides Builder.io link (if created)                        │
│  • User can accept/modify code                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 2: Design-to-Code Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                      FIGMA DESIGN CREATED                        │
│  Designer creates login form in Figma                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO MCP SERVER (7001)                     │
│  • Syncs Figma design via API                                   │
│  • Extracts design tokens (colors, spacing, typography)         │
│  • Parses component structure                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO → DEEPSEEK RELAY                      │
│  • Sends design data to DeepSeek                                │
│  • Includes component specifications                            │
│  • POST to http://localhost:7002/mcp/relay                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Receives design data                                         │
│  • Prepares design-to-code prompt                               │
│  • Calls DeepSeek API                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DEEPSEEK API                               │
│  • Processes design-to-code request                             │
│  • Generates React component matching design                    │
│  • Includes design tokens as CSS/styled-components              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK → COMPOSIO RELAY                      │
│  • Sends generated code back to Composio                        │
│  • Includes metadata and context                                │
│  • POST to http://localhost:7001/mcp/relay                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO MCP SERVER (7001)                     │
│  • Validates with HEIR                                          │
│  • Creates component in Builder.io                              │
│  • Links to original Figma design                               │
│  • Returns complete result                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER RECEIVES                            │
│  • Generated code in VS Code                                    │
│  • Builder.io component link                                    │
│  • Figma design reference                                       │
│  • Validation status                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 3: Code Review + Documentation

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
│  Selects code in VS Code → Right-click → "DeepSeek: Explain"   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VS CODE DEEPSEEK EXTENSION                    │
│  • Captures selected code                                       │
│  • Gathers context (file, imports, surrounding code)            │
│  • Sends to DeepSeek MCP Server                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Receives code analysis request                               │
│  • Calls DeepSeek API for analysis                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DEEPSEEK API                               │
│  • Analyzes code for:                                           │
│    - Bugs and issues                                            │
│    - Performance problems                                       │
│    - Security vulnerabilities                                   │
│    - Best practices                                             │
│  • Generates detailed explanation                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Receives analysis                                            │
│  • Generates documentation                                      │
│  • Prepares relay to Composio for publishing                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO MCP SERVER (7001)                     │
│  • Receives documentation                                       │
│  • Creates documentation page in Builder.io                     │
│  • Returns published URL                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER RECEIVES                            │
│  • Code analysis in VS Code                                     │
│  • Suggested improvements                                       │
│  • Published documentation link                                 │
│  • Can apply fixes directly                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 4: Test Generation + Validation

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
│  Selects function → "DeepSeek: Generate Tests"                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK MCP SERVER (7002)                     │
│  • Analyzes function signature                                  │
│  • Identifies edge cases                                        │
│  • Calls DeepSeek API                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DEEPSEEK API                               │
│  • Generates comprehensive test suite                           │
│  • Includes:                                                    │
│    - Unit tests                                                 │
│    - Edge cases                                                 │
│    - Mock data                                                  │
│    - Test descriptions                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEEPSEEK → COMPOSIO RELAY                      │
│  • Sends tests for validation                                   │
│  • Checks test coverage                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPOSIO MCP SERVER (7001)                     │
│  • Validates test structure                                     │
│  • Checks HEIR compliance                                       │
│  • Returns validation result                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER RECEIVES                            │
│  • Generated test file                                          │
│  • Validation status                                            │
│  • Can run tests immediately                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Message Flow Examples

### Example 1: Chat Message Flow

```
User Types: "Generate a button component"
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│ VS Code Extension                                        │
│ {                                                        │
│   type: "chat",                                          │
│   message: "Generate a button component",                │
│   context: {                                             │
│     file: "components/Button.tsx",                       │
│     language: "typescript",                              │
│     framework: "react"                                   │
│   }                                                      │
│ }                                                        │
└────────────────────────┬─────────────────────────────────┘
                         │ WebSocket
                         ▼
┌──────────────────────────────────────────────────────────┐
│ DeepSeek MCP Server                                      │
│ • Receives message                                       │
│ • Adds system context                                    │
│ • Calls DeepSeek API                                     │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
                         ▼
┌──────────────────────────────────────────────────────────┐
│ DeepSeek API                                             │
│ • Generates component code                               │
│ • Returns structured response                            │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ DeepSeek MCP Server                                      │
│ {                                                        │
│   type: "chat-response",                                 │
│   response: {                                            │
│     code: "import React from 'react'...",                │
│     language: "typescript",                              │
│     explanation: "..."                                   │
│   }                                                      │
│ }                                                        │
└────────────────────────┬─────────────────────────────────┘
                         │ WebSocket
                         ▼
┌──────────────────────────────────────────────────────────┐
│ VS Code Extension                                        │
│ • Displays code in editor                                │
│ • Shows explanation                                      │
└──────────────────────────────────────────────────────────┘
```

### Example 2: Relay Message Flow

```
DeepSeek generates code
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│ DeepSeek MCP Server                                      │
│ {                                                        │
│   type: "relay",                                         │
│   forward_to_composio: true,                             │
│   target: "heir_validate",                               │
│   payload: {                                             │
│     ssot: {                                              │
│       meta: { app_name: "MyApp" },                       │
│       doctrine: { component: "..." }                     │
│     }                                                    │
│   }                                                      │
│ }                                                        │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌──────────────────────────────────────────────────────────┐
│ Composio MCP Server                                      │
│ • Receives relay message                                 │
│ • Validates with HEIR                                    │
│ • Returns result                                         │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP Response
                         ▼
┌──────────────────────────────────────────────────────────┐
│ DeepSeek MCP Server                                      │
│ {                                                        │
│   type: "validation-result",                             │
│   result: {                                              │
│     ok: true,                                            │
│     errors: null,                                        │
│     warnings: []                                         │
│   }                                                      │
│ }                                                        │
└────────────────────────┬─────────────────────────────────┘
                         │ WebSocket
                         ▼
┌──────────────────────────────────────────────────────────┐
│ VS Code Extension                                        │
│ • Shows validation status: ✅ HEIR Compliant             │
└──────────────────────────────────────────────────────────┘
```

## Integration Patterns

### Pattern 1: Request-Response

```
Client → DeepSeek → API → DeepSeek → Client
```

**Use Cases:**
- Simple chat queries
- Code explanations
- Quick completions

### Pattern 2: Request-Relay-Response

```
Client → DeepSeek → Composio → DeepSeek → Client
```

**Use Cases:**
- Code generation + validation
- Component creation + Builder.io publish
- Analysis + documentation publish

### Pattern 3: Bidirectional Relay

```
Client → DeepSeek ⇄ Composio → External Services
```

**Use Cases:**
- Design-to-code workflows
- Multi-step validations
- Complex integrations

### Pattern 4: Event Broadcasting

```
DeepSeek → All Connected Clients
Composio → All Connected Clients
```

**Use Cases:**
- Status updates
- Progress notifications
- Real-time collaboration

## State Management

### DeepSeek State

```javascript
{
  connections: Set<WebSocket>,
  activeRequests: Map<requestId, Request>,
  composioConnection: {
    url: "http://localhost:7001",
    enabled: true,
    lastPing: timestamp
  },
  cache: Map<promptHash, Response>
}
```

### Composio State

```javascript
{
  builderioClient: BuilderIOClient,
  heirValidator: HEIRValidator,
  figmaSync: FigmaSync,
  deepseekConnection: {
    url: "http://localhost:7002",
    lastMessage: timestamp
  }
}
```

## Error Handling

### Error Flow

```
Error Occurs
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│ Catch Error                                              │
│ • Log error details                                      │
│ • Determine error type                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ Error Classification                                     │
│ • Network error → Retry                                  │
│ • API error → Return to user                             │
│ • Validation error → Show details                        │
│ • Integration error → Fallback                           │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ Send Error Response                                      │
│ {                                                        │
│   type: "error",                                         │
│   error: {                                               │
│     message: "...",                                      │
│     code: "...",                                         │
│     recoverable: true/false                              │
│   }                                                      │
│ }                                                        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ User Notification                                        │
│ • Show error message                                     │
│ • Suggest recovery action                                │
│ • Provide retry option                                   │
└──────────────────────────────────────────────────────────┘
```

---

**Workflow Documentation Version**: 1.0.0
**Last Updated**: 2024
**Status**: ✅ Complete
