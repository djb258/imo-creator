# Render auto-detection compatibility layer
# This file exists solely to make Render's auto-detection work correctly
from src.server.main import app

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)