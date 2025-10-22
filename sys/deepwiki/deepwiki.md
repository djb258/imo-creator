# DeepWiki-Open - AI-Powered Repository Documentation Generator

## Overview

**DeepWiki-Open** is an AI-powered automatic wiki generator that creates beautiful, interactive documentation for any GitHub, GitLab, or BitBucket repository. It analyzes code structure, generates comprehensive documentation, creates visual diagrams, and organizes everything into an easy-to-navigate wiki.

**Doctrine ID**: `04.04.11`
**Altitude**: 40k ft (System Infrastructure)
**Category**: Documentation & Knowledge Management
**Repository**: https://github.com/djb258/deepwiki-open.git

---

## Features

### Core Capabilities
- **Instant Documentation**: Turn any repo into a comprehensive wiki in seconds
- **Private Repository Support**: Securely access private repositories with personal access tokens
- **Smart Analysis**: AI-powered understanding of code structure and relationships
- **Beautiful Diagrams**: Automatic Mermaid diagrams to visualize architecture and data flow
- **Easy Navigation**: Simple, intuitive interface to explore the wiki
- **RAG-Powered Chat**: Ask questions about your repository and get accurate AI-powered answers
- **DeepResearch**: Multi-turn research process that thoroughly investigates complex topics

### AI Model Support
- **Google Gemini**: Full support for Gemini models
- **OpenAI**: GPT-3.5, GPT-4, GPT-4 Turbo
- **OpenRouter**: Access to multiple AI providers through one API
- **Azure OpenAI**: Enterprise-grade OpenAI deployment
- **Ollama**: Local AI models for privacy and offline use

### Flexible Embeddings
- OpenAI embeddings (default)
- Google AI embeddings (recommended with Google models)
- Local Ollama embeddings for privacy

---

## Architecture

### Technology Stack
- **Frontend**: Next.js 15.3, React 19, TypeScript
- **Backend**: Python FastAPI
- **UI Framework**: Tailwind CSS 4
- **Diagram Generation**: Mermaid.js
- **Markdown Rendering**: react-markdown with GFM support
- **Code Highlighting**: react-syntax-highlighter
- **Internationalization**: next-intl (multi-language support)

### Ports
- **Frontend (Next.js)**: `3000`
- **Backend API (FastAPI)**: `8001` (configurable via PORT env var)

### Data Persistence
- Repository data: `~/.adalflow`
- API logs: `api/logs/application.log`

---

## Quick Start

### Option 1: Docker Deployment (Recommended)

```bash
# Navigate to deepwiki directory
cd deepwiki

# Create .env file
cat > .env << EOF
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
DEEPWIKI_EMBEDDER_TYPE=google
OPENROUTER_API_KEY=your_openrouter_api_key (optional)
OLLAMA_HOST=http://localhost:11434 (optional)
AZURE_OPENAI_API_KEY=your_azure_key (optional)
AZURE_OPENAI_ENDPOINT=your_azure_endpoint (optional)
AZURE_OPENAI_VERSION=your_azure_version (optional)
EOF

# Start with Docker Compose
docker-compose up
```

### Option 2: Manual Setup

```bash
# Backend setup
cd deepwiki
pip install -r api/requirements.txt
python -m api.main

# Frontend setup (in new terminal)
cd deepwiki
npm install
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8001
- **Health Check**: http://localhost:8001/health

---

## Usage Examples

### Generate Wiki for Any Repository

1. Open http://localhost:3000
2. Enter repository URL (e.g., `https://github.com/username/repo`)
3. For private repos, provide personal access token
4. Click "Generate Wiki"
5. DeepWiki will:
   - Clone and analyze the repository
   - Generate comprehensive documentation
   - Create architecture diagrams
   - Build interactive navigation

### Chat with Your Repository

1. After wiki generation, use the "Ask" feature
2. Type questions like:
   - "What does this function do?"
   - "How is authentication implemented?"
   - "Explain the data flow"
3. RAG-powered AI provides accurate answers from your codebase

### DeepResearch Mode

1. Enable DeepResearch for complex topics
2. AI performs multi-turn investigation
3. Provides thorough analysis with citations

---

## Integration with IMO Creator

DeepWiki-Open integrates with the IMO Creator ecosystem as a **40k ft infrastructure tool** for:

1. **Automatic Documentation**: Generate wikis for all IMO Creator modules
2. **Codebase Understanding**: Help developers quickly understand complex systems
3. **Knowledge Base**: Create searchable documentation for the entire project
4. **AI-Assisted Development**: Answer questions about codebase architecture
5. **Onboarding**: Accelerate new developer onboarding with auto-generated docs

### HEIR/ORBT Integration Pattern

```json
{
  "unique_id": "HEIR-2025-10-DEEPWIKI-001",
  "process_id": "PRC-WIKI-001",
  "orbt_layer": 1,
  "blueprint_version": "1.0",
  "tool": "generate_wiki",
  "data": {
    "repository_url": "https://github.com/djb258/imo-creator.git",
    "include_private": true,
    "ai_provider": "google",
    "embedder_type": "google",
    "generate_diagrams": true
  }
}
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_API_KEY` | Conditional | - | Google AI API key |
| `OPENAI_API_KEY` | Conditional | - | OpenAI API key |
| `DEEPWIKI_EMBEDDER_TYPE` | No | `openai` | Embedder type (openai/google/ollama) |
| `OPENROUTER_API_KEY` | No | - | OpenRouter API key |
| `OLLAMA_HOST` | No | `http://localhost:11434` | Ollama server URL |
| `AZURE_OPENAI_API_KEY` | No | - | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | No | - | Azure OpenAI endpoint |
| `AZURE_OPENAI_VERSION` | No | - | Azure OpenAI API version |
| `PORT` | No | `8001` | Backend API port |
| `LOG_LEVEL` | No | `INFO` | Logging level |
| `LOG_FILE_PATH` | No | `api/logs/application.log` | Log file path |

### Docker Resource Limits
- **Memory Limit**: 6GB
- **Memory Reservation**: 2GB
- **Health Check Interval**: 60s

---

## API Endpoints

### Health Check
```bash
GET http://localhost:8001/health
```

### Generate Wiki
```bash
POST http://localhost:8001/api/generate
Content-Type: application/json

{
  "repository_url": "https://github.com/username/repo",
  "access_token": "optional_token",
  "ai_provider": "google",
  "embedder_type": "google"
}
```

### Ask Question (RAG)
```bash
POST http://localhost:8001/api/ask
Content-Type: application/json

{
  "question": "How does authentication work?",
  "repository_id": "repo_uuid"
}
```

---

## CTB Doctrine Compliance

### Branch Structure
- **Branch Name**: `sys/deepwiki`
- **Altitude**: 40k ft (System Infrastructure)
- **Type**: External Repository Integration
- **Doctrine ID**: `04.04.11`

### File Organization
```
sys/deepwiki/
├── deepwiki.md              # This documentation file
├── deepwiki.manifest.json   # MCP tool manifest
└── deepwiki/                # Cloned repository
    ├── api/                 # Python FastAPI backend
    ├── src/                 # Next.js frontend
    ├── public/              # Static assets
    ├── tests/               # Test suite
    └── docker-compose.yml   # Docker configuration
```

### MCP Registry Entry
```json
{
  "id": "deepwiki",
  "doctrine_id": "04.04.11",
  "name": "DeepWiki-Open",
  "version": "0.1.0",
  "description": "AI-powered automatic wiki generator for code repositories",
  "type": "external_repo",
  "repository": "https://github.com/djb258/deepwiki-open.git",
  "altitude": "40k",
  "ports": {
    "frontend": 3000,
    "api": 8001
  },
  "enabled": true,
  "required": false,
  "health_check": "http://localhost:8001/health"
}
```

---

## Supported Languages

DeepWiki-Open includes comprehensive internationalization support:

- 🇺🇸 English
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇯🇵 日本語 (Japanese)
- 🇪🇸 Español (Spanish)
- 🇰🇷 한국어 (Korean)
- 🇻🇳 Tiếng Việt (Vietnamese)
- 🇧🇷 Português Brasileiro (Brazilian Portuguese)
- 🇫🇷 Français (French)
- 🇷🇺 Русский (Russian)

---

## Use Cases

### For IMO Creator Project
1. **Automated Documentation**: Generate wikis for all microservices
2. **API Documentation**: Auto-document all Composio integrations
3. **Architecture Visualization**: Create diagrams of the multi-altitude system
4. **Developer Onboarding**: Provide new developers with instant codebase understanding
5. **Knowledge Management**: Build searchable knowledge base of all project documentation

### For External Projects
1. **Open Source Documentation**: Create beautiful wikis for GitHub projects
2. **Private Repository Docs**: Document internal codebases securely
3. **Client Handoffs**: Generate comprehensive documentation for client projects
4. **Code Reviews**: Understand unfamiliar codebases quickly
5. **Technical Writing**: Auto-generate initial documentation for editing

---

## Troubleshooting

### Port Conflicts
If ports 3000 or 8001 are in use:
```bash
# Change backend port
PORT=8002 docker-compose up

# For manual setup
PORT=8002 python -m api.main
npm run dev -- --port 3001
```

### Missing API Keys
Ensure your `.env` file contains at least one of:
- `GOOGLE_API_KEY`
- `OPENAI_API_KEY`
- Ollama running locally

### Docker Memory Issues
Increase Docker memory allocation to at least 6GB in Docker Desktop settings.

### Repository Access Issues
For private repositories:
1. Generate a personal access token with repo scope
2. Pass it in the `access_token` field when generating wiki

---

## Development

### Running Tests
```bash
# Python tests
cd deepwiki
pytest

# Frontend tests (if available)
npm test
```

### Building for Production
```bash
# Build frontend
npm run build
npm start

# Backend runs same in production
python -m api.main
```

---

## Resources

- **GitHub Repository**: https://github.com/djb258/deepwiki-open
- **Original DeepWiki**: Inspired by AsyncFuncAI/deepwiki-open
- **Get API Keys**:
  - [Google AI Studio](https://makersuite.google.com/app/apikey)
  - [OpenAI Platform](https://platform.openai.com/api-keys)
  - [Azure Portal](https://portal.azure.com/)

---

## Version History

- **v0.1.0** (2025-10-22): Initial integration into IMO Creator CTB architecture
  - Cloned from https://github.com/djb258/deepwiki-open.git
  - Registered as doctrine_id 04.04.11
  - Added to sys/deepwiki branch at 40k altitude
  - Created MCP integration manifest

---

## License

Check the `deepwiki/LICENSE` file for licensing information.

---

**Last Updated**: 2025-10-22
**Status**: Active - Integrated into CTB Doctrine v1.3.2+
**Maintainer**: Barton Enterprises
**Support**: See main repository for issues and support
