"""
IMO Creator - Main Entry Point
CTB (Christmas Tree Backbone) Structure

This file serves as the application entry point for deployment.
All application logic is organized under the ctb/ directory structure.
"""

import sys
from pathlib import Path

# Add CTB structure to Python path
CTB_ROOT = Path(__file__).parent / "ctb"
sys.path.insert(0, str(CTB_ROOT / "sys"))

# Import and run the FastAPI server from CTB structure
from server.main import app

if __name__ == "__main__":
    import uvicorn

    # Get configuration from environment or use defaults
    import os
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))

    print(f"🌲 Starting IMO Creator (CTB Structure)")
    print(f"📍 Server: {host}:{port}")
    print(f"📁 Structure: Christmas Tree Backbone (CTB)")
    print(f"🔧 API Documentation: http://{host}:{port}/docs")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("RELOAD", "false").lower() == "true"
    )
