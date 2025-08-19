.PHONY: help install install-dev install-extras build run-mcp run-sidecar run-mcp-frontend run-mcp-backend run-mcp-database test test-heir check clean dev-setup

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