# ref-tools-mcp

Token-efficient documentation and reference lookup via Ref.tools API, integrated with HEIR/ORBT compliance framework.

## 🎯 What This Provides

**Token-Optimized Documentation Access:**
- **1000+ technical documentation sites** indexed and searchable
- **GitHub repository search** for code examples
- **API reference lookup** with targeted queries
- **Session deduplication** - never returns repeated results
- **Content dropout** - returns most relevant 5k tokens based on search history

## 🚀 Key Features

### vs Generic Search Tools
- **Specialized for technical documentation** - preserves code blocks and API signatures
- **Token efficient** - 5k token optimal responses vs bloated generic results
- **Session awareness** - avoids redundant information in conversations  
- **Code preservation** - maintains formatting that generic tools corrupt

### Integration Benefits
- **HEIR/ORBT compliant** - full audit trail and governance
- **Performance cached** - 5-minute TTL with intelligent deduplication
- **Rate limited** - 30 requests/minute per process for stability
- **Emergency controls** - kill switch and graceful shutdown

## 🔧 Environment Variables

```bash
# Optional - uses default key if not set
REF_API_KEY=your_ref_api_key

# Standard MCP environment
PORT=3000
KILL_SWITCH_ACTIVE=false
```

## 📡 Usage Examples

### Search Technical Documentation
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-REFTOOLS-REQ-123",
    "process_id": "PRC-REFTOOLS-456",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0-abcd1234",
    "tool": "search_documentation",
    "data": {
      "query": "React hooks useEffect cleanup",
      "max_results": 5,
      "include_code_examples": true
    }
  }'
```

### Read Documentation URL
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-REFTOOLS-REQ-124",
    "process_id": "PRC-REFTOOLS-457",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0-abcd1234",
    "tool": "read_documentation_url",
    "data": {
      "url": "https://reactjs.org/docs/hooks-effect.html",
      "extract_code_blocks": true,
      "max_content_length": 5000
    }
  }'
```

### Get API Reference
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-REFTOOLS-REQ-125",
    "process_id": "PRC-REFTOOLS-458",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0-abcd1234",
    "tool": "get_api_reference",
    "data": {
      "api_name": "GitHub API",
      "endpoint_or_method": "create repository",
      "include_examples": true
    }
  }'
```

### Search GitHub Repositories  
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-REFTOOLS-REQ-126",
    "process_id": "PRC-REFTOOLS-459",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0-abcd1234",
    "tool": "search_github_repos",
    "data": {
      "query": "React hooks authentication",
      "language": "javascript",
      "max_repos": 10
    }
  }'
```

## 🔧 Quick Testing Endpoints

### Documentation Search
```bash
curl "http://localhost:3000/mcp/search/React%20hooks?max_results=3&include_code=true"
```

### API Reference Lookup
```bash
curl "http://localhost:3000/mcp/api/GitHub%20API/create%20repo?include_examples=true"
```

### Performance Statistics
```bash
curl "http://localhost:3000/mcp/stats"
```

## 🎯 Token Optimization Features

### Session Deduplication
- **Never repeats results** in same conversation session
- Tracks search history per process ID
- Eliminates redundant information automatically

### Content Dropout
- **5k token maximum** per response for optimal context usage
- Uses session search history to prioritize most relevant sections
- Preserves code blocks and API signatures

### Smart Caching
- **5-minute TTL** for documentation searches
- Session-aware cache keys prevent duplicate API calls
- Memory-efficient cleanup of expired entries

## 🏗️ Architecture Integration

### With Your Existing MCP Ecosystem
- **Composio MCP**: External service integrations (GitHub, Gmail, Slack)
- **Query Builder MCP**: Multi-database operations
- **Ref Tools MCP**: Documentation and reference lookup ← **This Server**
- **Factory Architecture**: Template-based deployment maintained

### Unique Value Preserved
- **HEIR/ORBT compliance** - full governance framework maintained
- **Performance optimizations** - caching and rate limiting
- **Factory/garage model** - consistent deployment patterns
- **<$350/month structure** - cost-effective operation

## 📊 Performance Characteristics

### Token Efficiency
- **Average response**: 2k-5k tokens (vs 10k+ generic tools)
- **Code preservation**: Maintains exact formatting
- **Relevance scoring**: Position and query-based ranking
- **Session optimization**: No repeated information

### Rate Limiting
- **30 requests/minute** per process ID
- Sliding window implementation
- Graceful degradation on limits
- Clear error messaging

### Caching Strategy
- **Documentation searches**: 5 minutes
- **URL content**: Session-based with cleanup
- **API references**: Targeted caching by endpoint
- **Memory management**: Automatic expired entry removal

## 🔒 HEIR/ORBT Compliance

This server maintains full compliance with your governance framework:

### HEIR (Hierarchical Event Identity Registry)
- **Unique ID Format**: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
- **Process Tracking**: `PRC-SYSTCODE-EPOCHTIMESTAMP`
- **Documentation Access Logging**: All searches and reads tracked
- **Event Lineage**: Full audit trail maintained

### ORBT (Operations & Resource Blueprint Tracking)
- **Layer Authorization**: Layer 5 operations
- **Resource Constraints**: Rate limiting and token optimization
- **Security Policies**: Input validation and sanitization
- **Emergency Protocols**: Kill switch and graceful degradation

### Compliance Features
- ✅ Structured logging via Mantis integration
- ✅ Request/response payload validation
- ✅ Documentation access tracking
- ✅ Token usage optimization
- ✅ Session deduplication logging
- ✅ Rate limiting compliance
- ✅ Emergency shutdown capabilities

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Optional**: Set `REF_API_KEY` environment variable (uses default if not set)
3. **Start Server**: `npm start`
4. **Test Connection**: `curl http://localhost:3000/mcp/health`
5. **Try Search**: `curl "http://localhost:3000/mcp/search/your_query"`

## 📚 Documentation Coverage

- **1000+ technical sites** - Major documentation sources indexed
- **GitHub repositories** - Public repos with code examples
- **API documentation** - REST APIs, GraphQL, SDKs
- **Framework docs** - React, Vue, Angular, Node.js, Python, etc.
- **Database documentation** - PostgreSQL, MongoDB, Redis, etc.
- **Cloud services** - AWS, GCP, Azure documentation

## 🎯 Use Cases

### Development Workflow
- **API integration** - Quick endpoint reference lookup
- **Framework learning** - Code examples and best practices  
- **Troubleshooting** - Error solutions and debugging guides
- **Code review** - Reference implementations and patterns

### Business Applications
- **Technical documentation** - For C-suite technical briefings
- **Integration planning** - API capabilities and requirements
- **Technology evaluation** - Framework and tool comparisons
- **Training materials** - Code examples and tutorials

This server provides the documentation and reference backbone for your MCP ecosystem, ensuring developers have instant access to accurate, token-efficient technical information while maintaining your enterprise-grade governance standards.