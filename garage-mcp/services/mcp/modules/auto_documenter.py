"""
Automated Documentation Generator
Uses Claude subagents to generate comprehensive repository documentation.
"""

import os
import ast
import json
from pathlib import Path
from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass

@dataclass
class CodeElement:
    """Represents a code element for documentation"""
    name: str
    type: str  # "class", "function", "module", "variable"
    docstring: Optional[str]
    signature: Optional[str]
    file_path: str
    line_number: int
    complexity: int = 0
    dependencies: List[str] = None

class AutoDocumenter:
    """
    Generates documentation automatically for repositories using 
    code analysis and Claude subagent assistance.
    """
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.code_elements = []
        self.api_endpoints = []
        self.configuration_files = []
        
    def analyze_python_code(self) -> List[CodeElement]:
        """Analyze Python files and extract documentable elements"""
        python_files = list(self.repo_path.rglob("*.py"))
        elements = []
        
        for py_file in python_files:
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                tree = ast.parse(content)
                
                for node in ast.walk(tree):
                    element = None
                    
                    if isinstance(node, ast.ClassDef):
                        element = CodeElement(
                            name=node.name,
                            type="class",
                            docstring=ast.get_docstring(node),
                            signature=f"class {node.name}",
                            file_path=str(py_file.relative_to(self.repo_path)),
                            line_number=node.lineno
                        )
                    
                    elif isinstance(node, ast.FunctionDef):
                        args = [arg.arg for arg in node.args.args]
                        signature = f"def {node.name}({', '.join(args)})"
                        
                        element = CodeElement(
                            name=node.name,
                            type="function",
                            docstring=ast.get_docstring(node),
                            signature=signature,
                            file_path=str(py_file.relative_to(self.repo_path)),
                            line_number=node.lineno
                        )
                    
                    if element:
                        elements.append(element)
                        
            except Exception as e:
                print(f"Error analyzing {py_file}: {e}")
                continue
        
        self.code_elements = elements
        return elements
    
    def detect_api_endpoints(self) -> List[Dict[str, Any]]:
        """Detect API endpoints in FastAPI or Flask applications"""
        endpoints = []
        
        # Look for FastAPI patterns
        python_files = list(self.repo_path.rglob("*.py"))
        
        for py_file in python_files:
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Simple pattern matching for FastAPI decorators
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    line = line.strip()
                    
                    # FastAPI route decorators
                    if any(line.startswith(f"@app.{method}(") for method in ["get", "post", "put", "delete", "patch"]):
                        method = line.split('.')[1].split('(')[0].upper()
                        
                        # Extract path
                        if '"' in line:
                            path = line.split('"')[1]
                        elif "'" in line:
                            path = line.split("'")[1]
                        else:
                            path = "unknown"
                        
                        # Look for function definition on next lines
                        func_name = "unknown"
                        for j in range(i+1, min(i+5, len(lines))):
                            if lines[j].strip().startswith("def "):
                                func_name = lines[j].strip().split('def ')[1].split('(')[0]
                                break
                        
                        endpoints.append({
                            "method": method,
                            "path": path,
                            "function": func_name,
                            "file": str(py_file.relative_to(self.repo_path)),
                            "line": i + 1
                        })
                        
            except Exception as e:
                print(f"Error detecting endpoints in {py_file}: {e}")
                continue
        
        self.api_endpoints = endpoints
        return endpoints
    
    def analyze_configuration_files(self) -> List[Dict[str, Any]]:
        """Analyze configuration files for documentation"""
        config_patterns = [
            "*.json", "*.yml", "*.yaml", "*.toml", "*.ini", "*.cfg",
            ".env", ".env.*", "Dockerfile", "docker-compose.yml",
            "requirements.txt", "package.json", "pyproject.toml"
        ]
        
        config_files = []
        for pattern in config_patterns:
            config_files.extend(list(self.repo_path.rglob(pattern)))
        
        analyzed_configs = []
        
        for config_file in config_files:
            try:
                file_info = {
                    "name": config_file.name,
                    "path": str(config_file.relative_to(self.repo_path)),
                    "type": self._detect_config_type(config_file),
                    "size": config_file.stat().st_size,
                    "description": self._get_config_description(config_file)
                }
                
                analyzed_configs.append(file_info)
                
            except Exception as e:
                print(f"Error analyzing config {config_file}: {e}")
                continue
        
        self.configuration_files = analyzed_configs
        return analyzed_configs
    
    def _detect_config_type(self, file_path: Path) -> str:
        """Detect the type/purpose of a configuration file"""
        file_name = file_path.name.lower()
        
        if file_name == "requirements.txt":
            return "python_dependencies"
        elif file_name == "package.json":
            return "node_dependencies"
        elif file_name == "pyproject.toml":
            return "python_project_config"
        elif file_name.startswith(".env"):
            return "environment_variables"
        elif file_name == "dockerfile":
            return "docker_container"
        elif file_name == "docker-compose.yml":
            return "docker_orchestration"
        elif file_name == "vercel.json":
            return "vercel_deployment"
        elif file_name.endswith((".yml", ".yaml")):
            return "yaml_configuration"
        elif file_name.endswith(".json"):
            return "json_configuration"
        else:
            return "configuration"
    
    def _get_config_description(self, file_path: Path) -> str:
        """Get a description of what a configuration file does"""
        descriptions = {
            "requirements.txt": "Python package dependencies",
            "package.json": "Node.js project configuration and dependencies",
            "pyproject.toml": "Modern Python project configuration",
            "vercel.json": "Vercel deployment configuration",
            "dockerfile": "Docker container build instructions",
            "docker-compose.yml": "Multi-container Docker application definition",
            ".github/workflows/ci.yml": "GitHub Actions CI/CD pipeline",
            ".env": "Environment variables (keep secure!)"
        }
        
        return descriptions.get(file_path.name.lower(), f"Configuration file for {file_path.suffix[1:] if file_path.suffix else 'application'}")
    
    def generate_readme_content(self, project_info: Dict[str, Any] = None) -> str:
        """Generate README.md content based on repository analysis"""
        
        project_info = project_info or {}
        project_name = project_info.get("name", self.repo_path.name)
        
        # Analyze repository structure
        self.analyze_python_code()
        self.detect_api_endpoints()
        self.analyze_configuration_files()
        
        readme_content = f"""# {project_name}

{project_info.get('description', 'Repository automatically documented by IMO Creator')}

## Overview

This repository contains a {"Python-based " if any(f.endswith('.py') for f in os.listdir(self.repo_path)) else ""}project with the following structure:

"""
        
        # Add API endpoints section if found
        if self.api_endpoints:
            readme_content += "## API Endpoints\n\n"
            readme_content += "| Method | Path | Function | Description |\n"
            readme_content += "|--------|------|----------|-------------|\n"
            
            for endpoint in self.api_endpoints:
                readme_content += f"| {endpoint['method']} | `{endpoint['path']}` | {endpoint['function']} | Auto-detected endpoint |\n"
            
            readme_content += "\n"
        
        # Add setup instructions
        readme_content += """## Setup

### Prerequisites
- Python 3.11+
"""
        
        # Add specific setup based on detected configs
        has_requirements = any(f["name"] == "requirements.txt" for f in self.configuration_files)
        has_package_json = any(f["name"] == "package.json" for f in self.configuration_files)
        
        if has_requirements:
            readme_content += "- pip (Python package manager)\n"
        if has_package_json:
            readme_content += "- Node.js and npm\n"
        
        readme_content += "\n### Installation\n\n"
        
        if has_requirements:
            readme_content += """```bash
# Clone the repository
git clone <repository-url>
cd """ + project_name + """

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt
```

"""
        
        # Add usage instructions
        readme_content += "## Usage\n\n"
        
        if self.api_endpoints:
            readme_content += """### Running the API Server

```bash
uvicorn src.main:app --reload
# or
python src/main.py
```

The API will be available at `http://localhost:8000`

"""
        
        # Add development section
        readme_content += "## Development\n\n"
        
        # Add testing if test files detected
        test_files = list(self.repo_path.rglob("test_*.py")) + list(self.repo_path.rglob("*_test.py"))
        if test_files:
            readme_content += """### Running Tests

```bash
pytest
```

"""
        
        # Add code quality section if configs detected
        has_ruff = any("ruff" in str(f) for f in self.configuration_files)
        has_black = any("black" in str(f) for f in self.configuration_files)
        
        if has_ruff or has_black:
            readme_content += "### Code Quality\n\n"
            if has_ruff:
                readme_content += "```bash\nruff check .\n```\n\n"
            if has_black:
                readme_content += "```bash\nblack --check .\n```\n\n"
        
        # Add configuration section
        if self.configuration_files:
            readme_content += "## Configuration Files\n\n"
            
            for config in self.configuration_files:
                readme_content += f"- **{config['name']}**: {config['description']}\n"
            
            readme_content += "\n"
        
        # Add deployment section if deployment configs found
        has_vercel = any(f["name"] == "vercel.json" for f in self.configuration_files)
        has_docker = any(f["name"] in ["Dockerfile", "docker-compose.yml"] for f in self.configuration_files)
        
        if has_vercel or has_docker:
            readme_content += "## Deployment\n\n"
            
            if has_vercel:
                readme_content += """### Vercel

This project is configured for Vercel deployment. Set environment variables in the Vercel dashboard.

"""
            
            if has_docker:
                readme_content += """### Docker

```bash
docker build -t """ + project_name + """ .
docker run -p 8000:8000 """ + project_name + """
```

"""
        
        # Add license and contributing
        readme_content += """## Contributing

Please read CONTRIBUTING.md for development guidelines.

## License

See LICENSE file for details.
"""
        
        return readme_content
    
    def generate_api_documentation(self) -> str:
        """Generate API documentation based on detected endpoints"""
        if not self.api_endpoints:
            return ""
        
        api_docs = """# API Documentation

## Overview

This API provides the following endpoints:

"""
        
        # Group endpoints by path prefix
        grouped_endpoints = {}
        for endpoint in self.api_endpoints:
            prefix = endpoint['path'].split('/')[1] if '/' in endpoint['path'] else 'root'
            if prefix not in grouped_endpoints:
                grouped_endpoints[prefix] = []
            grouped_endpoints[prefix].append(endpoint)
        
        for prefix, endpoints in grouped_endpoints.items():
            api_docs += f"## {prefix.title()} Endpoints\n\n"
            
            for endpoint in endpoints:
                api_docs += f"### {endpoint['method']} {endpoint['path']}\n\n"
                api_docs += f"**Function**: `{endpoint['function']}`\n\n"
                api_docs += f"**File**: {endpoint['file']}:{endpoint['line']}\n\n"
                api_docs += "**Description**: Auto-detected endpoint\n\n"
                api_docs += "**Parameters**: _Documentation needed_\n\n"
                api_docs += "**Response**: _Documentation needed_\n\n"
                api_docs += "---\n\n"
        
        return api_docs


def generate_repository_documentation(repo_path: str, output_dir: Optional[str] = None) -> Dict[str, str]:
    """
    Main function to generate comprehensive repository documentation
    """
    documenter = AutoDocumenter(repo_path)
    
    # Generate different types of documentation
    docs = {}
    
    # README.md
    docs["README.md"] = documenter.generate_readme_content()
    
    # API documentation (if applicable)
    api_docs = documenter.generate_api_documentation()
    if api_docs:
        docs["API.md"] = api_docs
    
    # Code structure documentation
    elements = documenter.analyze_python_code()
    if elements:
        code_docs = "# Code Structure\n\n"
        
        # Group by file
        files = {}
        for element in elements:
            if element.file_path not in files:
                files[element.file_path] = []
            files[element.file_path].append(element)
        
        for file_path, file_elements in files.items():
            code_docs += f"## {file_path}\n\n"
            
            for element in file_elements:
                code_docs += f"### {element.name} ({element.type})\n\n"
                if element.signature:
                    code_docs += f"```python\n{element.signature}\n```\n\n"
                if element.docstring:
                    code_docs += f"{element.docstring}\n\n"
                else:
                    code_docs += "_No documentation available_\n\n"
        
        docs["CODE_STRUCTURE.md"] = code_docs
    
    # Save documentation files if output directory specified
    if output_dir:
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        for filename, content in docs.items():
            doc_file = output_path / filename
            with open(doc_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Generated: {doc_file}")
    
    return docs