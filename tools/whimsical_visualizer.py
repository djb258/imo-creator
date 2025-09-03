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
        
        # Generate complete repository mind map
        mindmap = self._generate_mindmap(analysis)
        (output_path / "repository_mindmap.md").write_text(mindmap)
        
        print(f"[INFO] Visual exports generated in {output_path}")
        print(f"  - whimsical_diagram.json: Import data for Whimsical")
        print(f"  - architecture.mmd: Mermaid diagram")
        print(f"  - architecture.puml: PlantUML diagram")
        print(f"  - repository_mindmap.md: Complete repository mind map")
    
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
    
    def _generate_mindmap(self, analysis: Dict) -> str:
        """Generate comprehensive repository mind map for Whimsical"""
        
        repo_name = analysis['name']
        structure = analysis.get('structure', {})
        mcp_servers = analysis.get('mcp_servers', [])
        compliance = analysis.get('compliance', {})
        
        lines = [
            f"# {repo_name} - Complete Repository Visualization",
            "",
            "## Core System Architecture"
        ]
        
        # Analyze major directories and their purposes
        major_dirs = self._analyze_major_directories(structure, analysis['path'])
        
        for dir_info in major_dirs:
            if dir_info['name'] == 'mcp-servers' and mcp_servers:
                lines.append(f"- **{dir_info['name']}/** - {dir_info['description']}")
                # Add MCP server details
                server_groups = self._group_mcp_servers(mcp_servers)
                for group_name, servers in server_groups.items():
                    lines.append(f"  - {group_name} - {', '.join([s['name'] for s in servers[:3]])}{'...' if len(servers) > 3 else ''}")
            else:
                lines.append(f"- **{dir_info['name']}/** - {dir_info['description']}")
                # Add key files/subdirs
                for subitem in dir_info.get('key_items', [])[:3]:
                    lines.append(f"  - {subitem['name']} - {subitem['description']}")
        
        # Add compliance and system status
        lines.extend([
            "",
            "## System Status",
            f"- **Repository Type**: {self._determine_repo_type(analysis)}",
            f"- **Compliance Score**: {compliance.get('score', 0):.1f}%",
            f"- **MCP Servers**: {len(mcp_servers)} operational",
            f"- **Architecture**: {'Production Ready' if compliance.get('score', 0) > 80 else 'In Development'}"
        ])
        
        return "\n".join(lines)
    
    def _analyze_major_directories(self, structure: Dict, repo_path: str) -> List[Dict]:
        """Analyze major directories and determine their purposes"""
        
        major_dirs = []
        
        # Directory purpose mappings based on common patterns
        dir_purposes = {
            'src': 'Main application source code with components, utilities, and business logic',
            'mcp-servers': f'Model Context Protocol servers for service integrations and API connections',
            'api': 'API endpoints, route handlers, and server-side business logic',
            'tools': 'Repository automation, analysis, and development utility scripts',
            'scripts': 'Build automation, deployment, and development workflow scripts',
            'docs': 'Comprehensive documentation, specifications, and developer guides',
            'tests': 'Automated test suites covering unit, integration, and system tests',
            'garage-mcp': 'Comprehensive audit, compliance, and quality assurance system',
            'bmad': 'Break/Measure/Analyze/Do performance tracking and optimization system',
            'ctb': 'Concept Tree Blueprint system for architecture documentation',
            'templates': 'Reusable project templates and boilerplate code generators',
            'garage': 'Real-time system monitoring and visualization dashboard',
            'pages': 'Next.js application pages and API route definitions',
            'components': 'Reusable UI components and shared application modules',
            'lib': 'Shared libraries, utilities, and configuration modules',
            'public': 'Static assets, images, and publicly accessible files',
            'config': 'Application configuration files and environment settings',
            'middleware': 'Request/response processing and application middleware',
            'heir': 'Hierarchical Event Identity Registry compliance and governance',
            'logs': 'System logs, audit trails, and performance monitoring data',
            'mcp-doctrine-layer': 'MCP governance framework and compliance enforcement',
            'factory': 'Automated build and deployment infrastructure',
            'shared': 'Common utilities and shared modules across multiple services'
        }
        
        if 'children' in structure:
            for child in structure['children']:
                if child.get('type') == 'directory':
                    dir_name = child['name']
                    description = dir_purposes.get(dir_name, f'{dir_name.replace("-", " ").replace("_", " ").title()} directory')
                    
                    major_dirs.append({
                        'name': dir_name,
                        'description': description,
                        'key_items': self._extract_key_items(child)
                    })
        
        # Sort by importance (src, mcp-servers, api first)
        priority_order = ['src', 'mcp-servers', 'api', 'garage-mcp', 'tools', 'scripts', 'docs']
        
        def sort_priority(dir_info):
            if dir_info['name'] in priority_order:
                return priority_order.index(dir_info['name'])
            return 999
        
        major_dirs.sort(key=sort_priority)
        
        return major_dirs
    
    def _extract_key_items(self, directory: Dict) -> List[Dict]:
        """Extract key files/subdirectories from a directory"""
        
        key_items = []
        
        if 'children' in directory:
            for child in directory['children']:
                if child.get('type') == 'file':
                    # Important files to highlight
                    important_files = {
                        'server.js': 'Main server entry point',
                        'package.json': 'Node.js project configuration',
                        'README.md': 'Project documentation',
                        'index.js': 'Module entry point',
                        'index.ts': 'TypeScript module entry point',
                        'config.py': 'Python configuration module',
                        'main.py': 'Python application entry point',
                        'Dockerfile': 'Container deployment configuration',
                        'docker-compose.yml': 'Multi-container deployment setup'
                    }
                    
                    if child['name'] in important_files:
                        key_items.append({
                            'name': child['name'],
                            'description': important_files[child['name']]
                        })
                elif child.get('type') == 'directory' and not child.get('truncated'):
                    # Important subdirectories
                    key_items.append({
                        'name': f"{child['name']}/",
                        'description': f"{child['name'].replace('-', ' ').replace('_', ' ').title()} module"
                    })
        
        return key_items[:5]  # Limit to top 5 items
    
    def _group_mcp_servers(self, servers: List[Dict]) -> Dict[str, List[Dict]]:
        """Group MCP servers by category"""
        
        groups = {
            'Database Integration': [],
            'Web Services': [],
            'Development Tools': [],
            'Communication': [],
            'Visualization': []
        }
        
        for server in servers:
            name = server['name'].lower()
            if any(db in name for db in ['neon', 'firebase', 'bigquery', 'query-builder']):
                groups['Database Integration'].append(server)
            elif any(web in name for web in ['github', 'vercel', 'render', 'composio']):
                groups['Web Services'].append(server)
            elif any(tool in name for tool in ['ref-tools', 'apify', 'fire-crawl']):
                groups['Development Tools'].append(server)
            elif any(comm in name for comm in ['twilio', 'email']):
                groups['Communication'].append(server)
            elif any(viz in name for viz in ['whimsical', 'plasmic']):
                groups['Visualization'].append(server)
            else:
                groups['Development Tools'].append(server)
        
        # Remove empty groups
        return {k: v for k, v in groups.items() if v}
    
    def _determine_repo_type(self, analysis: Dict) -> str:
        """Determine the type of repository based on structure"""
        
        structure = analysis.get('structure', {})
        mcp_servers = analysis.get('mcp_servers', [])
        
        if len(mcp_servers) > 10:
            return 'Multi-Service MCP Platform'
        elif any('next.config.js' in str(child) for child in structure.get('children', [])):
            return 'Full-Stack Next.js Application'
        elif any('package.json' in str(child) for child in structure.get('children', [])):
            return 'Node.js Application'
        elif any('requirements.txt' in str(child) for child in structure.get('children', [])):
            return 'Python Application'
        else:
            return 'Mixed Technology Stack'
    
    def render_to_whimsical_mcp(self, analysis: Dict) -> Dict:
        """Send mind map to Whimsical MCP server for rendering"""
        
        mindmap = self._generate_mindmap(analysis)
        
        # Prepare MCP command for Whimsical rendering
        mcp_command = {
            "command": "render_mindmap",
            "args": {
                "markdown": mindmap,
                "title": f"Repo Structure - {analysis['name']}"
            }
        }
        
        print(f"[INFO] Generated mind map for Whimsical MCP:")
        print(json.dumps(mcp_command, indent=2))
        
        return mcp_command
    
    def send_to_composio_whimsical(self, analysis: Dict, workspace_id: str = None, user_id: str = None) -> Dict:
        """Send repository mind map to Whimsical via Composio"""
        
        mindmap = self._generate_mindmap(analysis)
        repo_name = analysis['name']
        
        # Prepare Composio payload for Whimsical integration
        composio_payload = {
            "unique_id": f"HEIR-2024-12-WHIMSICAL-{repo_name.upper()}-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "process_id": f"PRC-WHIMSICAL-{datetime.now().timestamp():.0f}",
            "orbt_layer": 5,
            "blueprint_version": "v1.0.0",
            "tool": "execute_composio_tool",
            "data": {
                "toolkit": "whimsical",
                "tool": "create_mindmap",
                "arguments": {
                    "workspace_id": workspace_id or "default",
                    "title": f"{repo_name} - Complete Architecture",
                    "description": f"Auto-generated repository visualization for {repo_name}",
                    "content": {
                        "type": "mindmap",
                        "markdown": mindmap,
                        "metadata": {
                            "repository": repo_name,
                            "mcp_servers": len(analysis.get('mcp_servers', [])),
                            "compliance_score": analysis.get('compliance', {}).get('score', 0),
                            "generated_at": datetime.now().isoformat(),
                            "tool_version": "whimsical_visualizer_v1.2"
                        }
                    }
                },
                "user_id": user_id or "imo-creator-system"
            }
        }
        
        print(f"[INFO] Generated Composio payload for Whimsical:")
        print(f"  - Repository: {repo_name}")
        print(f"  - MCP Servers: {len(analysis.get('mcp_servers', []))}")
        print(f"  - Compliance: {analysis.get('compliance', {}).get('score', 0):.1f}%")
        print(f"  - Unique ID: {composio_payload['unique_id']}")
        
        return composio_payload
    
    def send_to_whimsical_mcp(self, analysis: Dict, workspace_id: str = None, user_id: str = None) -> bool:
        """Send repository visualization directly to Whimsical MCP server"""
        
        whimsical_url = os.environ.get('WHIMSICAL_MCP_URL', 'http://localhost:3002/tool')
        mindmap = self._generate_mindmap(analysis)
        repo_name = analysis['name']
        
        # Create Whimsical MCP payload
        payload = {
            "unique_id": f"HEIR-2024-12-WHIMSICAL-{repo_name.upper()}-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "process_id": f"PRC-WHIMSICAL-{datetime.now().timestamp():.0f}",
            "orbt_layer": 5,
            "blueprint_version": "v1.0.0",
            "tool": "create_mindmap",
            "data": {
                "workspaceId": workspace_id or "default",
                "boardType": "mindmap",
                "diagramData": {
                    "title": f"{repo_name} - Complete Architecture",
                    "description": f"Auto-generated repository visualization for {repo_name}",
                    "content": mindmap,
                    "metadata": {
                        "repository": repo_name,
                        "mcp_servers": len(analysis.get('mcp_servers', [])),
                        "compliance_score": analysis.get('compliance', {}).get('score', 0),
                        "generated_at": datetime.now().isoformat(),
                        "tool_version": "whimsical_visualizer_v1.2"
                    }
                }
            }
        }
        
        try:
            response = requests.post(whimsical_url, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('success'):
                print(f"[SUCCESS] Repository visualization sent to Whimsical MCP server!")
                print(f"  - Board created/updated in workspace: {workspace_id or 'default'}")
                if 'result' in result and 'url' in result['result']:
                    print(f"  - Whimsical URL: {result['result']['url']}")
                return True
            else:
                print(f"[ERROR] Whimsical MCP request failed: {result.get('error', 'Unknown error')}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Failed to send to Whimsical MCP: {e}")
            return False
        except Exception as e:
            print(f"[ERROR] Unexpected error: {e}")
            return False
    
    def send_to_composio_api(self, analysis: Dict, workspace_id: str = None, user_id: str = None) -> bool:
        """Send repository visualization - falls back to direct Whimsical since Composio lacks support"""
        
        print(f"[INFO] Composio doesn't support Whimsical toolkit - routing to direct Whimsical MCP server")
        return self.send_to_whimsical_mcp(analysis, workspace_id, user_id)


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
    parser.add_argument("--workspace-id", help="Whimsical workspace ID for Composio")
    parser.add_argument("--user-id", help="User ID for Composio")
    parser.add_argument("--export-only", action="store_true", help="Only export, don't sync")
    parser.add_argument("--export", help="Export diagram to specific file (e.g. whimsical.json)")
    parser.add_argument("--composio", action="store_true", help="Send to Whimsical via Composio")
    parser.add_argument("--composio-payload", action="store_true", help="Generate Composio payload only")
    
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
    elif args.export:
        # Export diagram data to specific file for GitHub Actions
        diagram_data = visualizer._generate_diagram_data(analysis)
        export_file = pathlib.Path(args.export)
        export_file.write_text(json.dumps(diagram_data, indent=2))
        print(f"[INFO] Diagram data exported to {export_file}")
        print(f"  - Title: {diagram_data['title']}")
        print(f"  - Nodes: {len(diagram_data['nodes'])}")
        print(f"  - Metadata: MCP Servers: {diagram_data['metadata']['mcp_servers']}")
        
        # Also generate standard exports in .whimsical/
        output_dir = repo_path / ".whimsical"
        visualizer.generate_export(analysis, output_dir)
    elif args.composio_payload:
        # Generate Composio payload for manual use
        payload = visualizer.send_to_composio_whimsical(analysis, args.workspace_id, args.user_id)
        print("\n" + "="*60)
        print("COMPOSIO PAYLOAD FOR WHIMSICAL")
        print("="*60)
        print(json.dumps(payload, indent=2))
        print("\n" + "="*60)
        print("USAGE: Send this payload to http://localhost:3001/tool")
        print("="*60)
    elif args.composio:
        # Send via Composio (falls back to direct Whimsical MCP)
        success = visualizer.send_to_composio_api(analysis, args.workspace_id, args.user_id)
        if success:
            print("\n✅ Repository visualization successfully sent to Whimsical!")
        else:
            print("\n❌ Failed to send repository visualization to Whimsical")
    else:
        visualizer.sync_with_whimsical(analysis)
        
    if not args.composio_payload:
        print("\n" + "="*50)
        print("REPOSITORY ANALYSIS SUMMARY")
        print("="*50)
        print(f"Repository: {analysis['name']}")
        print(f"MCP Servers: {len(analysis.get('mcp_servers', []))}")
        print(f"Compliance Score: {analysis.get('compliance', {}).get('score', 0):.1f}%")
        print(f"Architecture Type: {visualizer._determine_repo_type(analysis)}")
        print("="*50)