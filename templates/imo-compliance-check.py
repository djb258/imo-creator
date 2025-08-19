#!/usr/bin/env python3
"""
IMO Creator Compliance Check
This file was added by IMO Creator to enable automatic compliance monitoring.

Run this script to check for compliance updates from IMO Creator.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime

# IMO Creator endpoints
IMO_CREATOR_API = "https://imo-creator.vercel.app/api"
IMO_CREATOR_GITHUB = "https://github.com/djb258/imo-creator"

def check_compliance_status():
    """Check current compliance status"""
    repo_path = Path.cwd()
    
    # Check for compliance configuration
    config_file = repo_path / ".imo-compliance.json"
    
    if config_file.exists():
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
            print(f"Repository processed by IMO Creator")
            print(f"   Version: {config.get('imo_creator_version', 'unknown')}")
            print(f"   Last Check: {config.get('last_check', 'never')}")
            print(f"   Compliance Score: {config.get('repo_metadata', {}).get('current_compliance_score', 'unknown')}")
            return config
        except Exception as e:
            print(f"❌ Error reading compliance config: {e}")
            return None
    else:
        print("⚠️  Repository not yet processed by IMO Creator")
        return None

def download_heartbeat_script():
    """Download the latest heartbeat script from IMO Creator"""
    heartbeat_url = f"{IMO_CREATOR_GITHUB}/raw/master/tools/compliance_heartbeat.py"
    
    try:
        print(f"📥 Downloading heartbeat script...")
        
        with urllib.request.urlopen(heartbeat_url) as response:
            content = response.read().decode('utf-8')
        
        # Save to local file
        heartbeat_file = Path.cwd() / "imo-heartbeat.py"
        with open(heartbeat_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Make executable on Unix systems
        if hasattr(os, 'chmod'):
            os.chmod(heartbeat_file, 0o755)
        
        print(f"✅ Heartbeat script saved: {heartbeat_file}")
        return heartbeat_file
        
    except Exception as e:
        print(f"❌ Failed to download heartbeat script: {e}")
        return None

def check_for_updates():
    """Check if updates are available"""
    try:
        print(f"🔍 Checking for updates...")
        
        # Simple version check
        version_url = f"{IMO_CREATOR_API}/version"
        
        with urllib.request.urlopen(version_url, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                print(f"📦 Latest IMO Creator version: {data.get('version', 'unknown')}")
                
                if data.get('compliance_updates'):
                    print(f"🔄 Compliance updates available:")
                    for update in data['compliance_updates']:
                        print(f"   - {update}")
                
                return True
            
    except urllib.error.URLError:
        print(f"⚠️  Could not connect to IMO Creator API")
    except Exception as e:
        print(f"❌ Error checking updates: {e}")
    
    return False

def run_compliance_check():
    """Run a basic local compliance check"""
    repo_path = Path.cwd()
    
    print(f"\\n📋 Basic Compliance Check for: {repo_path.name}")
    print(f"=" * 50)
    
    checks = [
        ("README.md", "Documentation"),
        ("LICENSE", "License file"),
        ("CONTRIBUTING.md", "Contribution guidelines"),
        (".github/workflows/ci.yml", "CI/CD pipeline"),
        ("requirements.txt", "Python dependencies"),
        ("tests/", "Test directory"),
        ("vercel.json", "Deployment config")
    ]
    
    passed = 0
    total = len(checks)
    
    for file_path, description in checks:
        path = repo_path / file_path
        exists = path.exists()
        status = "✅" if exists else "❌"
        print(f"  {status} {description}: {'Found' if exists else 'Missing'}")
        if exists:
            passed += 1
    
    score = round((passed / total) * 100, 1)
    print(f"\\n📊 Compliance Score: {score}% ({passed}/{total})")
    
    if score < 80:
        print(f"💡 Consider running IMO Creator compliance tools to improve score")
    
    return score

def main():
    print(f"IMO Creator Compliance Check")
    print(f"Repository: {Path.cwd().name}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"=" * 60)
    
    # Check current status
    config = check_compliance_status()
    
    # Run basic compliance check
    score = run_compliance_check()
    
    # Check for updates
    print(f"\\n🔍 Update Check")
    print(f"=" * 20)
    
    updates_available = check_for_updates()
    
    # Provide next steps
    print(f"\\n🎯 Next Steps")
    print(f"=" * 15)
    
    if not config:
        print(f"1. Process this repository with IMO Creator:")
        print(f"   python /path/to/imo-creator/tools/repo_audit.py {Path.cwd()} --fix")
    
    if updates_available:
        print(f"2. Download and run heartbeat script for auto-updates:")
        heartbeat_file = download_heartbeat_script()
        if heartbeat_file:
            print(f"   python {heartbeat_file} --apply")
    
    if score < 80:
        print(f"3. Consider improving compliance score:")
        print(f"   - Add missing documentation files")
        print(f"   - Set up CI/CD pipeline")
        print(f"   - Add comprehensive tests")
    
    print(f"\\n📚 More Info: {IMO_CREATOR_GITHUB}")

if __name__ == "__main__":
    main()