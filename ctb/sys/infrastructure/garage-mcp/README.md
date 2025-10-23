# Garage MCP

A Model Context Protocol (MCP) server with bay-based architecture for managing tools and services.

## Architecture

The system consists of:
- **MCP Service**: FastAPI server exposing tools with bearer token auth
- **Sidecar Service**: Event logging and HEIR compliance checking service
- **Bay System**: Domain-specific tool modules that can be dynamically loaded

## Setup

### Prerequisites
- Python 3.9+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/djb258/garage-mcp.git
cd garage-mcp
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy environment variables:
```bash
cp .env.example .env
```

## Running Services

### Start MCP Service (Port 7001)
```bash
make run-mcp
# or
uvicorn services.mcp.main:app --port 7001
```

### Start Sidecar Service (Port 8000)
```bash
make run-sidecar
# or
uvicorn services.sidecar.main:app --port 8000
```

## Bay System

The system uses a "bay" architecture to load domain-specific tools. Select a bay by setting the `BAY` environment variable:

```bash
export BAY=database  # Load database tools
export BAY=frontend  # Load frontend tools
export BAY=backend   # Load backend tools
```

Available bays:
- **database**: Database migration, backup, and management tools
- **frontend**: Frontend scaffolding, building, and deployment tools
- **backend**: Backend development, testing, and deployment tools

## Tool Namespaces

### Core Tools (Always Loaded)
- `fs.read` / `fs.write`: File system operations
- `exec.run`: Execute shell commands
- `git.diff` / `git.commit`: Git operations
- `heir.check`: Run HEIR compliance checks
- `sidecar.event` / `sidecar.health`: Sidecar integration

### Intake Tools (Always Loaded)
- `intake.ingest.*`: Data ingestion (upload, extract, parse, snapshot)
- `intake.mapping.*`: Data mapping (validate, normalize, align, diff)

### Domain Tools (Bay-Specific)
Loaded based on selected bay configuration.

## Architecture Flow

```
MCP Tools → POST event to Sidecar → Log events
                                  → Run HEIR checks
```

## VS Code + MCP Quickstart

1. **Start the MCP service** (pick a bay):
   ```bash
   # Option A: VS Code debugger (recommended)
   # Use Run and Debug → "MCP: Run (frontend|backend|database)"

   # Option B: Makefile
   make run-mcp
   # or
   BAY=frontend uvicorn services.mcp.main:app --port 7001 --reload
   ```

2. **Verify it's up**:
   ```bash
   curl http://localhost:7001/docs
   ```

3. **Install the "Model Context Protocol"** (or "MCP Inspector") extension in VS Code.

4. **Create the MCP client config**:
   - **macOS/Linux**: `~/.config/mcp/config.json`
   - **Windows**: `%APPDATA%\\mcp\\config.json`
   
   Use this template (you can copy from `docs/mcp.config.sample.json`):
   ```json
   {
     "servers": {
       "garage-mcp": {
         "command": "uvicorn",
         "args": ["services.mcp.main:app", "--port", "7001"],
         "env": { "BAY": "frontend" }
       }
     }
   }
   ```

5. **In VS Code → MCP panel**, confirm tools are listed (fs.*, git.*, heir.*, etc.). Run `fs.read` on a local file to test.

### Troubleshooting

- **Port busy?** Change `--port` in launch.json and config.json to an open port.
- **BAY not loading tools?** Ensure BAY is in your debug env or shell: `export BAY=frontend` (bash/zsh) or `setx BAY frontend` (Windows, then restart terminal).
- **Missing deps?** `pip install -r requirements.txt`.

#### HEIR Module Notes

The `heir.*` tools are optional compliance checks. If missing or degraded:

- **Install HEIR extras**: `pip install -r extras/heir.txt`
- **Check status**: Use the `heir.status` tool in MCP panel
- **Expected responses**:
  - `{"status":"ok"}` - All dependencies present, checks working
  - `{"status":"degraded","missing":[...]}` - Some optional deps missing
  - `{"status":"unavailable"}` - Module import failed, install deps

## Development

### Running Tests
```bash
make test
# or
pytest tests/ -v
```

### Running HEIR Checks
```bash
make check
# or
python -m packages.heir.checks
```

### Available Make Commands
- `make install`: Install dependencies
- `make run-mcp`: Start MCP service
- `make run-sidecar`: Start Sidecar service
- `make test`: Run tests
- `make check`: Run HEIR compliance checks
- `make clean`: Clean cache files

## API Documentation

Once services are running:
- MCP API: http://localhost:7001/docs
- Sidecar API: http://localhost:8000/docs

## CI/CD

The project uses GitHub Actions for CI:
- Runs tests on Python 3.9, 3.10, 3.11
- Executes HEIR compliance checks
- Validates TOML configurations
- Verifies project structure

## Project Structure

```
garage-mcp/
├── bays/                  # Bay configurations
│   ├── database.toml
│   ├── frontend.toml
│   └── backend.toml
├── config/
│   └── toolbox.toml      # Main configuration
├── services/
│   ├── mcp/              # MCP service
│   │   ├── main.py
│   │   └── modules/      # Tool implementations
│   │       ├── core/     # Core tools
│   │       ├── intake/   # Intake tools
│   │       └── domains/  # Domain-specific tools
│   └── sidecar/          # Sidecar service
│       └── main.py
├── packages/
│   └── heir/             # HEIR compliance checks
│       └── checks.py
├── docs/
│   └── tools/            # Tool documentation
├── tests/
│   └── modules/          # Module tests
└── requirements.txt
```

## License

MIT