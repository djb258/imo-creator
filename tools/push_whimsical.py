#!/usr/bin/env python3
"""
Push Whimsical Script - Send repository diagrams to Whimsical
Automatically pushes generated diagram data to Whimsical API/MCP endpoint
"""

import json
import os
import sys
import requests
from datetime import datetime
from pathlib import Path


def load_diagram_data(file_path: str) -> dict:
    """Load diagram data from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"[ERROR] Diagram file '{file_path}' not found")
        return None
    except json.JSONDecodeError as e:
        print(f"[ERROR] Invalid JSON in '{file_path}': {e}")
        return None


def push_to_whimsical(diagram_data: dict, api_key: str) -> bool:
    """Push diagram data to Whimsical API endpoint"""
    
    # Whimsical API endpoint (placeholder - will be updated with actual endpoint)
    whimsical_url = os.environ.get('WHIMSICAL_API_URL', 'https://api.whimsical.com/v1/boards')
    
    # Prepare headers
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'User-Agent': 'IMO-Creator-Repository-Visualizer/1.0'
    }
    
    # Prepare payload for Whimsical API
    payload = {
        'title': diagram_data.get('title', 'Repository Architecture'),
        'type': 'mindmap',
        'content': diagram_data,
        'metadata': {
            'source': 'imo-creator-github-action',
            'generated_at': datetime.now().isoformat(),
            'repository': os.environ.get('GITHUB_REPOSITORY', 'imo-creator'),
            'commit_sha': os.environ.get('GITHUB_SHA', 'unknown'),
            'branch': os.environ.get('GITHUB_REF_NAME', 'unknown')
        }
    }
    
    try:
        print(f"[INFO] Pushing diagram to Whimsical: {whimsical_url}")
        response = requests.post(whimsical_url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            board_url = result.get('url', result.get('board_url', 'No URL returned'))
            print(f"[SUCCESS] Successfully pushed diagram to Whimsical!")
            print(f"[INFO] Board URL: {board_url}")
            return True
            
        elif response.status_code == 401:
            print("[ERROR] Authentication failed - check WHIMSICAL_API_KEY")
            return False
            
        elif response.status_code == 403:
            print("[ERROR] Access forbidden - API key may lack permissions")
            return False
            
        else:
            print(f"[ERROR] Whimsical API error: HTTP {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            return False
            
    except requests.exceptions.ConnectionError:
        print("[ERROR] Network error: Unable to connect to Whimsical API")
        return False
    except requests.exceptions.Timeout:
        print("[ERROR] Timeout: Whimsical API request timed out")
        return False
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        return False


def push_to_fallback_endpoint(diagram_data: dict, api_key: str) -> bool:
    """Fallback: Push to local Whimsical MCP server if available"""
    
    mcp_url = os.environ.get('WHIMSICAL_MCP_URL', 'http://localhost:3002/tool')
    
    # Prepare MCP payload
    payload = {
        "unique_id": f"HEIR-2024-12-GITHUB-ACTION-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        "process_id": f"PRC-GITHUB-{datetime.now().timestamp():.0f}",
        "orbt_layer": 5,
        "blueprint_version": "v1.0.0",
        "tool": "create_mindmap",
        "data": {
            "workspaceId": "github-actions",
            "boardType": "mindmap",
            "diagramData": diagram_data
        }
    }
    
    try:
        print(f"[INFO] Trying fallback MCP endpoint: {mcp_url}")
        response = requests.post(mcp_url, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("[SUCCESS] Successfully pushed via MCP fallback endpoint!")
                return True
        
        print("[WARNING] MCP fallback unavailable")
        return False
        
    except:
        print("[WARNING] MCP fallback endpoint not accessible")
        return False


def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python push_whimsical.py <diagram_file.json>")
        sys.exit(1)
    
    diagram_file = sys.argv[1]
    
    # Check for API key
    api_key = os.environ.get('WHIMSICAL_API_KEY')
    if not api_key:
        print("[WARNING] WHIMSICAL_API_KEY not found in environment variables")
        print("[INFO] Diagram data will be generated but not pushed to Whimsical")
        
        # Still load and validate the diagram data
        diagram_data = load_diagram_data(diagram_file)
        if diagram_data:
            print(f"[SUCCESS] Diagram data loaded successfully from {diagram_file}")
            print(f"[INFO] Nodes: {len(diagram_data.get('nodes', []))}")
            print(f"[INFO] Metadata: {diagram_data.get('metadata', {})}")
        return
    
    # Load diagram data
    diagram_data = load_diagram_data(diagram_file)
    if not diagram_data:
        sys.exit(1)
    
    print(f"[INFO] Loaded diagram: {len(diagram_data.get('nodes', []))} nodes")
    
    # Try to push to Whimsical API
    success = push_to_whimsical(diagram_data, api_key)
    
    # If main API fails, try fallback
    if not success:
        print("[INFO] Trying fallback endpoint...")
        success = push_to_fallback_endpoint(diagram_data, api_key)
    
    if success:
        print("[SUCCESS] Repository visualization successfully synchronized with Whimsical!")
    else:
        print("[ERROR] Failed to push diagram to Whimsical")
        sys.exit(1)


if __name__ == "__main__":
    main()