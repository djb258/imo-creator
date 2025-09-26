#!/usr/bin/env python3
"""
Render startup script that handles both build and start phases
"""
import os
import sys
import subprocess

def run_command(cmd):
    """Run command and exit if it fails"""
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        sys.exit(result.returncode)

def main():
    # Detect if we're in build or start phase
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        print("=== RENDER BUILD PHASE ===")
        run_command("python3 -m pip install --upgrade pip")
        run_command("pip3 install -r requirements.txt")
        run_command("pip3 install composio-sdk fastapi uvicorn gunicorn python-multipart")
        print("=== BUILD COMPLETE ===")
    else:
        print("=== RENDER START PHASE ===")
        port = os.environ.get("PORT", "10000")
        cmd = f"gunicorn src.server.main:app --bind 0.0.0.0:{port} --worker-class uvicorn.workers.UvicornWorker"
        run_command(cmd)

if __name__ == "__main__":
    main()