# Contributing to IMO Creator

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js (for Vercel deployment)

### Local Development

1. **Clone and setup**:
   ```bash
   git clone https://github.com/djb258/imo-creator.git
   cd imo-creator
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run development server**:
   ```bash
   uvicorn src.server.main:app --port 7002 --reload
   ```

4. **Test tools**:
   ```bash
   python tools/blueprint_score.py example
   python tools/blueprint_visual.py example
   ```

5. **Open UI**:
   Open `docs/blueprints/ui/overview.html` in your browser

### Running Tests

```bash
pip install pytest ruff black
pytest -q
```

### Code Quality

We use `ruff` for linting and `black` for formatting:
```bash
ruff check .
black --check .
```

To fix formatting issues:
```bash
black .
```

## Commit Style

Use conventional commits with clear, concise messages:

- `feat(api): add new endpoint`
- `fix(ui): resolve blueprint rendering issue`
- `chore(deps): update requirements`
- `docs: update README with new examples`

Keep commits atomic - one logical change per commit.

## Architecture

- **FastAPI**: Backend API (`src/server/main.py`)
- **Static UI**: HTML/JS/CSS in `docs/blueprints/ui/`
- **Tools**: Python scripts in `tools/`
- **Tests**: Located in `tests/`

## API Endpoints

- `/llm` - LLM proxy with provider fallback
- `/api/ssot/save` - SSOT processing with HEIR doctrine
- `/api/subagents` - Subagent registry with garage-mcp integration
- `/blueprints/{slug}/*` - Blueprint CRUD operations

## Deployment

The project is configured for Vercel deployment with:
- `vercel.json` - Routing configuration
- `VERCEL_ENVS.md` - Environment variable documentation
- Static assets served from `docs/blueprints/ui/`

## Getting Help

- Check existing issues for similar problems
- Create detailed bug reports with reproduction steps
- Include relevant logs and environment information