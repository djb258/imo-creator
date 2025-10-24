#!/usr/bin/env python3
# # CTB Metadata
# # Generated: 2025-10-23T14:32:35.769649
# # CTB Version: 1.3.3
# # Division: System Infrastructure
# # Category: scripts
# # Compliance: 100%
# # HEIR ID: HEIR-2025-10-SYS-SCRIPT-01

"""
Render deployment entry point - bypasses auto-detection
This forces Render to run our FastAPI app correctly
"""
import os
import sys
from pathlib import Path

# Add src to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Import the FastAPI app
from src.server.main import app

if __name__ == "__main__":
    import uvicorn

    # Get port from environment (Render sets this)
    port = int(os.getenv("PORT", 8000))

    print(f"Starting IMO-Creator FastAPI server on port {port}")
    print("Using uvicorn directly - bypassing gunicorn auto-detection")

    # Run with uvicorn directly
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )