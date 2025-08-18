.PHONY: score visuals run-api open-ui test

score:
	python tools/blueprint_score.py example

visuals:
	python tools/blueprint_visual.py example

run-api:
	uvicorn src.server.main:app --port 7002 --reload

open-ui:
	@echo "Open docs/blueprints/ui/overview.html in your browser"

test:
	pytest -q tests/test_blueprint_shell.py