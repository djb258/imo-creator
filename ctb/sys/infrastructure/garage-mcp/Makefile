.PHONY: help install install-dev install-extras build run-mcp run-sidecar run-mcp-frontend run-mcp-backend run-mcp-database test test-heir check clean dev-setup agents-global agents-sync hdo-seed plan-validate run-plan db-migrate db-ids-migrate ids-doc-check

help:
	@echo "Available commands:"
	@echo "  make install      - Install Python dependencies"
	@echo "  make install-dev  - Install dev dependencies + extras"
	@echo "  make install-extras - Install optional dependencies"
	@echo "  make build        - Full build and test pipeline"
	@echo "  make dev-setup    - Setup world-class development environment"
	@echo "  make run-mcp      - Run MCP service on port 7001"
	@echo "  make run-sidecar  - Run Sidecar service on port 8000"
	@echo "  make run-mcp-frontend  - Run MCP service with frontend bay"
	@echo "  make run-mcp-backend   - Run MCP service with backend bay"
	@echo "  make run-mcp-database  - Run MCP service with database bay"
	@echo "  make test         - Run tests with pytest"
	@echo "  make test-heir    - Run HEIR module tests specifically"
	@echo "  make check        - Run HEIR compliance checks"
	@echo "  make clean        - Clean cache and temp files"
	@echo ""
	@echo "Claude Code Integration:"
	@echo "  make agents-global    - List global Claude agents"
	@echo "  make agents-sync      - Sync agents to global directory"
	@echo "  make plan-validate    - Validate altitude plans"
	@echo "  make hdo-seed         - Create seed HDO for testing"
	@echo "  make run-plan         - Execute altitude plan with HDO"
	@echo "  make db-migrate       - Run error log migrations"
	@echo "  make db-ids-migrate   - Run ID system migrations"
	@echo "  make ids-doc-check    - Generate sample IDs for documentation"

install:
	pip install -r requirements.txt

install-extras:
	@echo "Installing optional dependencies..."
	pip install -r extras/heir.txt

install-dev: install install-extras
	@echo "Installing development dependencies..."
	pip install -r requirements-dev.txt

build: clean install-dev
	@echo "Running full build pipeline..."
	@echo "1. Installing dependencies..."
	@$(MAKE) install-dev
	@echo "2. Running tests..."
	@$(MAKE) test
	@echo "3. Running HEIR tests..."
	@$(MAKE) test-heir
	@echo "4. Running compliance checks..."
	@$(MAKE) check
	@echo "5. TypeScript build..."
	npm run build
	@echo "✅ Build complete!"

dev-setup:
	@echo "Setting up world-class development environment..."
	@echo "1. Installing Python dependencies..."
	@$(MAKE) install-dev
	@echo "2. Installing Node.js dependencies..."
	npm install
	@echo "3. Setting up pre-commit hooks..."
	pre-commit install
	@echo "4. Installing global CLI tools..."
	npm install -g typescript ts-node nodemon live-server
	@echo "5. Installing Python development tools..."
	pip install ipython jupyter black isort autopep8
	@echo "6. Setting up VS Code extensions recommendations..."
	@echo "✅ Development environment ready!"

run-mcp:
	@echo "Starting MCP service on port 7001..."
	cd services/mcp && uvicorn main:app --reload --port 7001

run-sidecar:
	@echo "Starting Sidecar service on port 8000..."
	cd services/sidecar && uvicorn main:app --reload --port 8000

run-mcp-frontend:
	BAY=frontend uvicorn services.mcp.main:app --port 7001 --reload

run-mcp-backend:
	BAY=backend uvicorn services.mcp.main:app --port 7001 --reload

run-mcp-database:
	BAY=database uvicorn services.mcp.main:app --port 7001 --reload

test:
	@echo "Running tests..."
	pytest tests/ -v

test-heir:
	@echo "Running HEIR module tests..."
	pytest tests/modules/test_heir_module.py -v
	@echo "Testing HEIR module import..."
	python -c "from services.mcp.modules.core.heir import heir_checks; print('HEIR module loaded:', heir_checks is not None)"

check:
	@echo "Running HEIR compliance checks..."
	python -m packages.heir.checks

clean:
	@echo "Cleaning cache and temp files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name ".DS_Store" -delete

# =====================================================================================
# Claude Code Integration Targets
# =====================================================================================

agents-global:
	@echo "🔍 Listing global Claude agents..."
	@bash scripts/list_global_agents.sh

agents-sync:
	@echo "🔄 Syncing agents to global directory..."
	@if [ "$$OS" = "Windows_NT" ]; then \
		GLOBAL_DIR="$$USERPROFILE/.claude/agents"; \
	else \
		GLOBAL_DIR="$$HOME/.claude/agents"; \
	fi; \
	echo "Creating global agents directory: $$GLOBAL_DIR"; \
	mkdir -p "$$GLOBAL_DIR"; \
	echo "Copying agents..."; \
	cp -r .claude/agents/* "$$GLOBAL_DIR/"; \
	echo "✅ Agents synced to: $$GLOBAL_DIR"

plan-validate:
	@echo "✅ Validating altitude plans..."
	@python scripts/validate_plan.py

hdo-seed:
	@echo "🌱 Creating seed HDO..."
	@if [ -f "artifacts/hdo.seed.json" ]; then \
		echo "✅ Seed HDO already exists: artifacts/hdo.seed.json"; \
	else \
		echo "Creating artifacts directory..."; \
		mkdir -p artifacts; \
		echo "Generating seed HDO..."; \
		python -c "import json; from datetime import datetime, timezone; from scripts.id_tools import make_process_id, make_idempotency_key; process_id = make_process_id('clients_intake'); hdo = {'stage': 'input', 'process_id': process_id, 'blueprint_id': 'clients_intake', 'ttl': 3600, 'validated': False, 'promoted_to': None, 'timestamp_last_touched': datetime.now(timezone.utc).isoformat(), 'payload': {}, 'log': [], 'meta': {'plan_id': 'clients_intake', 'plan_version': '1.0.0', 'plan_hash': 'abc123', 'idempotency_key': make_idempotency_key(process_id)}}; print(json.dumps(hdo, indent=2))" > artifacts/hdo.seed.json; \
		echo "✅ Created seed HDO: artifacts/hdo.seed.json"; \
	fi

run-plan:
	@echo "🚀 Executing altitude plan with HDO..."
	@python -c "import json; import asyncio; from services.mcp.modules.orchestra_runner import run_altitude_plan; async def main(): plan = json.load(open('blueprints/clients_intake/altitude.plan.json')); hdo = json.load(open('artifacts/hdo.seed.json')); result = await run_altitude_plan(plan, hdo); print('Plan execution completed:', result.get('process_id')); asyncio.run(main())"

db-migrate:
	@echo "📊 Running error log database migrations..."
	@if [ -z "$$DATABASE_URL" ]; then \
		echo "⚠️  DATABASE_URL not set. Set it to run migrations."; \
		echo "Example: export DATABASE_URL='postgresql://user:pass@host:port/db'"; \
	else \
		echo "Running migration: packages/sql/2025-08-19_create_shq_master_error_log.sql"; \
		psql "$$DATABASE_URL" -f packages/sql/2025-08-19_create_shq_master_error_log.sql; \
		echo "✅ Error log migrations complete"; \
	fi

db-ids-migrate:
	@echo "🔑 Running ID system database migrations..."
	@if [ -z "$$DATABASE_URL" ]; then \
		echo "⚠️  DATABASE_URL not set. Set it to run migrations."; \
		echo "Example: export DATABASE_URL='postgresql://user:pass@host:port/db'"; \
	else \
		echo "Running migration: packages/sql/2025-08-19_ids.sql"; \
		psql "$$DATABASE_URL" -f packages/sql/2025-08-19_ids.sql; \
		echo "✅ ID system migrations complete"; \
	fi

ids-doc-check:
	@echo "📋 Generating sample IDs for documentation..."
	@python scripts/id_tools.py sample