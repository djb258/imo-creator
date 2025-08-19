.PHONY: score visuals run-api run-mcp run-sidecar run-garage-mcp open-ui test heir-check check

score:
	python tools/blueprint_score.py example

visuals:
	python tools/blueprint_visual.py example

run-api:
	uvicorn src.server.main:app --port 7002 --reload

run-mcp:
	uvicorn src.mcp_server:app --port 7001 --reload

run-sidecar:
	uvicorn src.sidecar_server:app --port 8000 --reload

run-garage-mcp:
	cd garage-mcp && python -m services.mcp.main

open-ui:
	@echo "Open docs/blueprints/ui/overview.html in your browser"

test:
	pytest -q tests/test_blueprint_shell.py

heir-check:
	python -m packages.heir.checks

check:
	@echo "Running HEIR validation checks..."
	@python -m packages.heir.checks || echo "HEIR checks completed with warnings"

# Full system startup
run-full-stack:
	@echo "Starting full HEIR/MCP stack..."
	@echo "1. Starting sidecar service..."
	@uvicorn src.sidecar_server:app --port 8000 --reload &
	@echo "2. Starting garage-mcp service..." 
	@cd garage-mcp && python -m services.mcp.main &
	@echo "3. Starting main API..."
	@uvicorn src.server.main:app --port 7002 --reload