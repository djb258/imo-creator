#!/usr/bin/env python3
"""
Whimsical Visualizer - Automatic visualization layer for repositories
Integrates with garage_bay.py to create/update Whimsical diagrams

Features:
- Auto-generates architecture diagrams from repo structure
- Creates flowcharts from code relationships
- Maintains sync between code and visual documentation
- Updates CTB (Concept Tree Blueprint) in Whimsical
"""

import json
import os
import pathlib
import re
import subprocess
import sys
import requests
from typing import Dict, List, Optional, Tuple
import ast
import yaml
import hashlib
import hmac
from datetime import datetime

class WhimsicalVisualizer:
    """Manages Whimsical integration for repository visualization"""
    
    def __init__(self, api_key: str = None, board_id: str = None):
        self.api_key = api_key or os.environ.get("WHIMSICAL_API_KEY")
        self.board_id = board_id or os.environ.get("WHIMSICAL_BOARD_ID")
        self.base_url = "https://api.whimsical.com/v1"
        
        if not self.api_key:
            print("[WARN] Whimsical API key not found. Set WHIMSICAL_API_KEY env variable.")
    
    def analyze_repository(self, repo_path: pathlib.Path) -> Dict:
        """Analyze repository structure and generate visualization data"""
        
        analysis = {
            "name": repo_path.name,
            "path": str(repo_path),
            "structure": {},
            "relationships": [],
            "components": [],
            "mcp_servers": [],
            "compliance": {}
        }
        
        # Scan directory structure
        analysis["structure"] = self._scan_structure(repo_path)
        
        # Detect MCP servers
        mcp_servers_dir = repo_path / "mcp-servers"
        if mcp_servers_dir.exists():
            analysis["mcp_servers"] = self._analyze_mcp_servers(mcp_servers_dir)
        
        # Analyze code relationships
        analysis["relationships"] = self._analyze_relationships(repo_path)
        
        # Check for CTB (Concept Tree Blueprint)
        ctb_file = repo_path / "ctb.yaml"
        if ctb_file.exists():
            analysis["ctb"] = yaml.safe_load(ctb_file.read_text())
        
        # Check IMO Creator compliance
        analysis["compliance"] = self._check_compliance(repo_path)
        
        return analysis
    
    def _scan_structure(self, path: pathlib.Path, max_depth: int = 3, current_depth: int = 0) -> Dict:
        """Recursively scan directory structure"""
        
        if current_depth >= max_depth:
            return {"type": "directory", "truncated": True}
        
        structure = {
            "name": path.name,
            "type": "directory" if path.is_dir() else "file",
            "children": []
        }
        
        if path.is_dir():
            # Skip common directories
            skip_dirs = {".git", "node_modules", "__pycache__", ".venv", "venv", ".pytest_cache"}
            
            for item in sorted(path.iterdir()):
                if item.name.startswith(".") and item.name not in {".env", ".gitignore"}:
                    continue
                if item.name in skip_dirs:
                    continue
                    
                if item.is_dir():
                    structure["children"].append(
                        self._scan_structure(item, max_depth, current_depth + 1)
                    )
                else:
                    # Include important files
                    important_extensions = {".py", ".js", ".ts", ".jsx", ".tsx", ".json", ".yaml", ".yml", ".md"}
                    if item.suffix in important_extensions:
                        structure["children"].append({
                            "name": item.name,
                            "type": "file",
                            "extension": item.suffix
                        })
        
        return structure
    
    def _analyze_mcp_servers(self, mcp_dir: pathlib.Path) -> List[Dict]:
        """Analyze MCP server configurations"""
        
        servers = []
        
        for server_dir in mcp_dir.iterdir():
            if not server_dir.is_dir():
                continue
                
            server_info = {
                "name": server_dir.name,
                "path": str(server_dir),
                "tools": [],
                "compliance": {}
            }
            
            # Check for tool manifest
            manifest_path = server_dir / "manifests" / "tool_manifest.json"
            if manifest_path.exists():
                try:
                    manifest = json.loads(manifest_path.read_text())
                    server_info["tools"] = [tool["name"] for tool in manifest.get("tools", [])]
                    server_info["compliance"]["heir"] = manifest.get("heir_compliance", {})
                    server_info["compliance"]["orbt"] = manifest.get("orbt_escalation_matrix", {})
                except Exception as e:
                    print(f"[WARN] Error reading manifest for {server_dir.name}: {e}")
            
            servers.append(server_info)
        
        return servers
    
    def _analyze_relationships(self, repo_path: pathlib.Path) -> List[Dict]:
        """Analyze code relationships and dependencies"""
        
        relationships = []
        
        # Python imports
        for py_file in repo_path.rglob("*.py"):
            if "venv" in str(py_file) or "__pycache__" in str(py_file):
                continue
            
            try:
                content = py_file.read_text(encoding="utf-8", errors="ignore")
                tree = ast.parse(content)
                
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            relationships.append({
                                "source": str(py_file.relative_to(repo_path)),
                                "target": alias.name,
                                "type": "import"
                            })
                    elif isinstance(node, ast.ImportFrom):
                        if node.module:
                            relationships.append({
                                "source": str(py_file.relative_to(repo_path)),
                                "target": node.module,
                                "type": "import_from"
                            })
            except Exception:
                pass  # Skip files that can't be parsed
        
        # JavaScript/TypeScript imports
        for js_file in list(repo_path.rglob("*.js")) + list(repo_path.rglob("*.ts")):
            if "node_modules" in str(js_file):
                continue
            
            try:
                content = js_file.read_text(encoding="utf-8", errors="ignore")
                # Simple regex for imports
                imports = re.findall(r'(?:import|require)\s*\(?["\']([^"\']+)["\']\)?', content)
                
                for imp in imports:
                    relationships.append({
                        "source": str(js_file.relative_to(repo_path)),
                        "target": imp,
                        "type": "js_import"
                    })
            except Exception:
                pass
        
        return relationships
    
    def _check_compliance(self, repo_path: pathlib.Path) -> Dict:
        """Check IMO Creator compliance status"""
        
        compliance = {
            "has_readme": (repo_path / "README.md").exists(),
            "has_ctb": (repo_path / "ctb.yaml").exists(),
            "has_bmad": (repo_path / "bmad").exists(),
            "has_mcp_servers": (repo_path / "mcp-servers").exists(),
            "has_heir_config": (repo_path / ".heir").exists() or (repo_path / "heir.yaml").exists(),
            "has_factory_config": (repo_path / "factory.yaml").exists(),
            "has_garage_config": (repo_path / "garage.yaml").exists() or (repo_path / "garage_bay.py").exists()
        }
        
        compliance["score"] = sum(1 for v in compliance.values() if v) / len(compliance) * 100
        
        return compliance
    
    def create_whimsical_diagram(self, analysis: Dict) -> Optional[str]:
        """Create or update Whimsical diagram from repository analysis"""
        
        if not self.api_key:
            print("[ERROR] Whimsical API key required to create diagrams")
            return None
        
        diagram_data = self._generate_diagram_data(analysis)
        
        # This would use Whimsical's API to create/update the diagram
        # Note: Whimsical's API is currently limited, so we generate
        # a structured format that can be imported or manually created
        
        return json.dumps(diagram_data, indent=2)
    
    def _generate_diagram_data(self, analysis: Dict) -> Dict:
        """Generate diagram data structure for Whimsical"""
        
        diagram = {
            "title": f"{analysis['name']} - Architecture Overview",
            "type": "flowchart",
            "nodes": [],
            "edges": [],
            "metadata": {
                "compliance_score": analysis.get("compliance", {}).get("score", 0),
                "mcp_servers": len(analysis.get("mcp_servers", [])),
                "last_updated": datetime.now().isoformat()
            }
        }
        
        # Create main repository node
        diagram["nodes"].append({
            "id": "repo_root",
            "label": analysis["name"],
            "type": "container",
            "style": "primary",
            "position": {"x": 400, "y": 50}
        })
        
        # Add MCP servers as nodes
        y_offset = 200
        for i, server in enumerate(analysis.get("mcp_servers", [])):
            node_id = f"mcp_{server['name']}"
            diagram["nodes"].append({
                "id": node_id,
                "label": server["name"],
                "type": "service",
                "style": "mcp",
                "position": {"x": 200 + i * 150, "y": y_offset},
                "metadata": {
                    "tools": server.get("tools", []),
                    "compliance": server.get("compliance", {})
                }
            })
            
            # Connect to main repo
            diagram["edges"].append({
                "source": "repo_root",
                "target": node_id,
                "label": "contains"
            })
        
        # Add compliance status node
        compliance_node_id = "compliance_status"
        diagram["nodes"].append({
            "id": compliance_node_id,
            "label": f"Compliance: {analysis.get('compliance', {}).get('score', 0):.1f}%",
            "type": "status",
            "style": self._get_compliance_style(analysis.get("compliance", {}).get("score", 0)),
            "position": {"x": 700, "y": 50}
        })
        
        # Add CTB if exists
        if "ctb" in analysis:
            ctb_node_id = "ctb_root"
            diagram["nodes"].append({
                "id": ctb_node_id,
                "label": "CTB Blueprint",
                "type": "blueprint",
                "style": "ctb",
                "position": {"x": 400, "y": 400}
            })
            
            diagram["edges"].append({
                "source": "repo_root",
                "target": ctb_node_id,
                "label": "blueprint"
            })
        
        return diagram
    
    def _get_compliance_style(self, score: float) -> str:
        """Get visual style based on compliance score"""
        if score >= 90:
            return "success"
        elif score >= 70:
            return "warning"
        else:
            return "danger"
    
    def sync_with_whimsical(self, analysis: Dict, webhook_url: str = None) -> bool:
        """Sync repository analysis with Whimsical board"""
        
        webhook_url = webhook_url or os.environ.get("WHIMSICAL_WEBHOOK_URL")
        
        if not webhook_url:
            print("[INFO] No Whimsical webhook configured for real-time sync")
            return False
        
        try:
            # Send update to Whimsical via webhook
            payload = {
                "action": "update_diagram",
                "board_id": self.board_id,
                "data": self._generate_diagram_data(analysis),
                "metadata": {
                    "source": "imo-creator",
                    "timestamp": datetime.now().isoformat(),
                    "repo_path": analysis["path"]
                }
            }
            
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            
            print(f"[SUCCESS] Synced with Whimsical board {self.board_id}")
            return True
            
        except Exception as e:
            print(f"[ERROR] Failed to sync with Whimsical: {e}")
            return False
    
    def generate_export(self, analysis: Dict, output_path: pathlib.Path) -> None:
        """Generate export files for manual Whimsical import"""
        
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Generate diagram data
        diagram_data = self._generate_diagram_data(analysis)
        (output_path / "whimsical_diagram.json").write_text(
            json.dumps(diagram_data, indent=2)
        )
        
        # Generate Mermaid diagram as alternative
        mermaid = self._generate_mermaid(analysis)
        (output_path / "architecture.mmd").write_text(mermaid)
        
        # Generate PlantUML as another alternative
        plantuml = self._generate_plantuml(analysis)
        (output_path / "architecture.puml").write_text(plantuml)
        
        print(f"[INFO] Visual exports generated in {output_path}")
        print(f"  - whimsical_diagram.json: Import data for Whimsical")
        print(f"  - architecture.mmd: Mermaid diagram")
        print(f"  - architecture.puml: PlantUML diagram")
    
    def _generate_mermaid(self, analysis: Dict) -> str:
        """Generate Mermaid diagram from analysis"""
        
        lines = ["graph TB"]
        
        # Main repo node
        lines.append(f"    REPO[{analysis['name']}]")
        
        # MCP servers
        for server in analysis.get("mcp_servers", []):
            safe_name = server["name"].replace("-", "_")
            lines.append(f"    {safe_name}[{server['name']}]")
            lines.append(f"    REPO --> {safe_name}")
        
        # Compliance
        score = analysis.get("compliance", {}).get("score", 0)
        lines.append(f"    COMPLIANCE[Compliance: {score:.1f}%]")
        lines.append(f"    REPO --> COMPLIANCE")
        
        # CTB
        if "ctb" in analysis:
            lines.append(f"    CTB[CTB Blueprint]")
            lines.append(f"    REPO --> CTB")
        
        return "\n".join(lines)
    
    def _generate_plantuml(self, analysis: Dict) -> str:
        """Generate PlantUML diagram from analysis"""
        
        lines = ["@startuml"]
        lines.append(f"package \"{analysis['name']}\" {{")
        
        # MCP servers
        for server in analysis.get("mcp_servers", []):
            lines.append(f"  component [{server['name']}] as {server['name'].replace('-', '_')}")
        
        # Compliance
        score = analysis.get("compliance", {}).get("score", 0)
        lines.append(f"  component [Compliance: {score:.1f}%] as compliance")
        
        # CTB
        if "ctb" in analysis:
            lines.append(f"  component [CTB Blueprint] as ctb")
        
        lines.append("}")
        lines.append("@enduml")
        
        return "\n".join(lines)


def integrate_with_garage_bay(repo_path: pathlib.Path, whimsical_config: Dict = None) -> Dict:
    """Integration function to be called from garage_bay.py"""
    
    visualizer = WhimsicalVisualizer(
        api_key=whimsical_config.get("api_key") if whimsical_config else None,
        board_id=whimsical_config.get("board_id") if whimsical_config else None
    )
    
    # Analyze repository
    analysis = visualizer.analyze_repository(repo_path)
    
    # Generate visualization exports
    output_dir = pathlib.Path("audit_results") / repo_path.name / "visualizations"
    visualizer.generate_export(analysis, output_dir)
    
    # Attempt to sync with Whimsical
    visualizer.sync_with_whimsical(analysis)
    
    return analysis


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate Whimsical visualizations for repository")
    parser.add_argument("repo_path", help="Path to repository")
    parser.add_argument("--api-key", help="Whimsical API key")
    parser.add_argument("--board-id", help="Whimsical board ID")
    parser.add_argument("--export-only", action="store_true", help="Only export, don't sync")
    
    args = parser.parse_args()
    
    repo_path = pathlib.Path(args.repo_path).resolve()
    
    visualizer = WhimsicalVisualizer(
        api_key=args.api_key,
        board_id=args.board_id
    )
    
    analysis = visualizer.analyze_repository(repo_path)
    
    if args.export_only:
        output_dir = repo_path / ".whimsical"
        visualizer.generate_export(analysis, output_dir)
    else:
        visualizer.sync_with_whimsical(analysis)
        
    print(json.dumps(analysis, indent=2))