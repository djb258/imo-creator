#!/bin/bash

echo "=== CUSTOM START SCRIPT ==="
echo "Starting FastAPI with uvicorn..."
echo "Python version: $(python3 --version)"
echo "Uvicorn version: $(python3 -m uvicorn --version)"
echo "Port: $PORT"

# Start uvicorn with explicit python module call
exec python3 -m uvicorn src.server.main:app --host 0.0.0.0 --port $PORT --log-level info