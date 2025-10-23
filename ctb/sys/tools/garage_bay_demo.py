#!/usr/bin/env python3
"""
Garage Bay Demo - Show complete workflow using garage_bay.py
"""

import subprocess
import sys
from pathlib import Path

def run_garage_bay_demo():
    """Demonstrate the complete garage_bay.py workflow"""
    
    print("🚢 Garage Bay Demo - Complete Repository Audit Workflow")
    print("=" * 60)
    
    root = Path(__file__).parent.parent
    garage_bay = root / "garage_bay.py"
    
    if not garage_bay.exists():
        print("❌ garage_bay.py not found!")
        sys.exit(1)
    
    # Demo targets - you can modify these
    demo_targets = [
        {
            "name": "Local hivemind-command-center",
            "target": r"C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\hivemind-command-center",
            "description": "Previously processed repository"
        },
        {
            "name": "GitHub repository (short form)",
            "target": "djb258/hivemind-command-center",
            "description": "GitHub repo using owner/repo format"
        }
    ]
    
    for i, demo in enumerate(demo_targets, 1):
        print(f"\n🎯 Demo {i}: {demo['name']}")
        print(f"📋 Description: {demo['description']}")
        print(f"🔗 Target: {demo['target']}")
        print("-" * 40)
        
        # Ask user if they want to run this demo
        response = input(f"Run this demo? (y/n): ").lower().strip()
        if response != 'y':
            print("⏭️  Skipped")
            continue
        
        try:
            # Basic audit
            print("\n📊 Running basic audit...")
            cmd = [sys.executable, str(garage_bay), "--target", demo["target"]]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            print("STDOUT:", result.stdout)
            if result.stderr:
                print("STDERR:", result.stderr)
            
            if result.returncode == 0:
                print("✅ Basic audit completed successfully")
            else:
                print(f"⚠️  Basic audit completed with return code: {result.returncode}")
            
            # Ask about applying fixes
            if "compliance_score" in result.stdout and "100" not in result.stdout:
                fix_response = input("\n🔧 Apply compliance fixes? (y/n): ").lower().strip()
                if fix_response == 'y':
                    print("\n🔧 Running audit with fix application...")
                    fix_cmd = cmd + ["--apply-fixes"]
                    
                    fix_result = subprocess.run(fix_cmd, capture_output=True, text=True)
                    print("STDOUT:", fix_result.stdout)
                    if fix_result.stderr:
                        print("STDERR:", fix_result.stderr)
                    
                    if fix_result.returncode == 0:
                        print("✅ Fixes applied successfully")
                    else:
                        print(f"⚠️  Fixes completed with return code: {fix_result.returncode}")
            
            # Ask about opening in VS Code
            code_response = input("\n💻 Open in VS Code? (y/n): ").lower().strip()
            if code_response == 'y':
                print("\n💻 Opening in VS Code...")
                code_cmd = cmd + ["--open-code"]
                subprocess.run(code_cmd, capture_output=True)
                print("✅ Opened in VS Code (if available)")
        
        except Exception as e:
            print(f"❌ Error running demo: {e}")
        
        print(f"\n{'='*60}")
    
    print("\n🎉 Garage Bay Demo Complete!")
    print("\n📚 Available Commands:")
    print("  # Basic audit")
    print(f"  python {garage_bay} --target owner/repo")
    print(f"  python {garage_bay} --target /path/to/local/repo")
    print(f"  python {garage_bay} --target https://github.com/owner/repo.git")
    print("\n  # With fixes")
    print(f"  python {garage_bay} --target owner/repo --apply-fixes")
    print("\n  # With VS Code")
    print(f"  python {garage_bay} --target owner/repo --open-code")
    print("\n  # Full workflow")
    print(f"  python {garage_bay} --target owner/repo --apply-fixes --open-code")

def main():
    run_garage_bay_demo()

if __name__ == "__main__":
    main()