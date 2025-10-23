#!/usr/bin/env python3
"""Test script to list Composio tools and test integration"""

import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    from composio import Composio
    print("✅ Composio library imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Composio: {e}")
    print("Installing composio...")
    os.system("pip install composio-core")
    from composio import Composio

def list_composio_tools():
    """List all available Composio tools"""
    print("\n" + "="*60)
    print("🔧 COMPOSIO TOOLS DISCOVERY")
    print("="*60 + "\n")

    try:
        # Initialize Composio client
        composio_client = Composio()
        print("✅ Composio client initialized\n")

        # Get all available apps
        print("📦 Available Composio Apps:")
        print("-" * 60)

        apps = composio_client.get_apps()

        if not apps:
            print("⚠️  No apps found")
            return

        for i, app in enumerate(apps[:20], 1):  # Show first 20
            print(f"{i}. {app.name}")
            if hasattr(app, 'description'):
                print(f"   Description: {app.description}")
            print()

        print(f"\n📊 Total apps available: {len(apps)}")

        # Get tools/actions
        print("\n" + "="*60)
        print("🛠️  COMPOSIO ACTIONS/TOOLS")
        print("="*60 + "\n")

        # Try to get actions for a specific app (e.g., GitHub)
        try:
            actions = composio_client.get_actions()
            print(f"📊 Total actions available: {len(actions)}\n")

            print("Sample Actions:")
            print("-" * 60)
            for i, action in enumerate(actions[:10], 1):  # Show first 10
                print(f"{i}. {action.name}")
                if hasattr(action, 'description'):
                    print(f"   Description: {action.description}")
                if hasattr(action, 'app'):
                    print(f"   App: {action.app}")
                print()

        except Exception as e:
            print(f"⚠️  Could not fetch actions: {e}")

        # Check for Builder.io integration
        print("\n" + "="*60)
        print("🔍 CHECKING FOR BUILDER.IO INTEGRATION")
        print("="*60 + "\n")

        builder_apps = [app for app in apps if 'builder' in app.name.lower()]
        if builder_apps:
            print("✅ Found Builder.io related apps:")
            for app in builder_apps:
                print(f"   - {app.name}")
        else:
            print("⚠️  No Builder.io apps found in Composio")
            print("   You may need to add custom integration")

        # Check for Figma integration
        print("\n" + "="*60)
        print("🔍 CHECKING FOR FIGMA INTEGRATION")
        print("="*60 + "\n")

        figma_apps = [app for app in apps if 'figma' in app.name.lower()]
        if figma_apps:
            print("✅ Found Figma related apps:")
            for app in figma_apps:
                print(f"   - {app.name}")
        else:
            print("⚠️  No Figma apps found in Composio")

        return apps, actions if 'actions' in locals() else []

    except Exception as e:
        print(f"❌ Error listing Composio tools: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def test_composio_connection():
    """Test basic Composio connection"""
    print("\n" + "="*60)
    print("🧪 TESTING COMPOSIO CONNECTION")
    print("="*60 + "\n")

    try:
        from composio import Composio
        client = Composio()

        # Try to get entity
        print("Testing entity retrieval...")
        entity = client.get_entity()
        print(f"✅ Entity retrieved: {entity}")

        return True
    except Exception as e:
        print(f"⚠️  Connection test: {e}")
        return False

def check_mcp_server_endpoints():
    """Check if MCP server endpoints are available"""
    print("\n" + "="*60)
    print("🌐 CHECKING MCP SERVER ENDPOINTS")
    print("="*60 + "\n")

    import requests

    endpoints = [
        ("http://localhost:7001/health", "Composio MCP Health"),
        ("http://localhost:7001/info", "Composio MCP Info"),
        ("http://localhost:7001/mcp/tools", "Composio MCP Tools"),
        ("http://localhost:7002/health", "DeepSeek MCP Health"),
        ("http://localhost:7002/info", "DeepSeek MCP Info"),
    ]

    for url, name in endpoints:
        try:
            response = requests.get(url, timeout=2)
            if response.status_code == 200:
                print(f"✅ {name}: {url}")
                try:
                    data = response.json()
                    print(f"   Response: {data}")
                except:
                    print(f"   Response: {response.text[:100]}")
            else:
                print(f"⚠️  {name}: {url} (Status: {response.status_code})")
        except requests.exceptions.ConnectionError:
            print(f"❌ {name}: {url} (Not running)")
        except Exception as e:
            print(f"❌ {name}: {url} (Error: {e})")
        print()

def main():
    """Main test function"""
    print("\n" + "="*60)
    print("🚀 COMPOSIO INTEGRATION TEST")
    print("="*60)

    # Test Composio connection
    test_composio_connection()

    # List Composio tools
    apps, actions = list_composio_tools()

    # Check MCP server endpoints
    check_mcp_server_endpoints()

    # Summary
    print("\n" + "="*60)
    print("📋 SUMMARY")
    print("="*60 + "\n")

    if apps:
        print(f"✅ Composio is working")
        print(f"   - {len(apps)} apps available")
        if actions:
            print(f"   - {len(actions)} actions available")
    else:
        print("⚠️  Composio connection issues")

    print("\n" + "="*60)
    print("✅ TEST COMPLETE")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
