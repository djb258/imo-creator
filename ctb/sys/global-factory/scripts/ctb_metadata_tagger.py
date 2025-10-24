#!/usr/bin/env python3
"""
CTB Metadata Tagger
Automatically tags files with CTB metadata and branch classifications

Usage:
    python ctb_metadata_tagger.py [directory]
"""

import os
import json
import yaml
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional


class CTBMetadataTagger:
    """Tags files with CTB metadata based on content and location"""

    # CTB branch patterns
    BRANCH_PATTERNS = {
        'sys': {
            'patterns': ['composio', 'mcp', 'firebase', 'neon', 'github', 'factory', 'gatekeeper', 'validator'],
            'extensions': ['.js', '.ts', '.py', '.sh', '.yml', '.yaml'],
            'keywords': ['integration', 'server', 'service', 'api', 'database', 'auth']
        },
        'ai': {
            'patterns': ['gemini', 'openai', 'claude', 'llm', 'model', 'prompt', 'agent'],
            'extensions': ['.py', '.js', '.ts', '.md'],
            'keywords': ['ai', 'ml', 'inference', 'training', 'blueprint']
        },
        'data': {
            'patterns': ['schema', 'migration', 'query', 'zod', 'bigquery'],
            'extensions': ['.sql', '.prisma', '.json', '.yaml', '.py'],
            'keywords': ['database', 'table', 'column', 'migration', 'schema']
        },
        'docs': {
            'patterns': ['readme', 'doc', 'guide', 'manual'],
            'extensions': ['.md', '.txt', '.pdf'],
            'keywords': ['documentation', 'tutorial', 'reference', 'guide']
        },
        'ui': {
            'patterns': ['component', 'page', 'layout', 'template'],
            'extensions': ['.tsx', '.jsx', '.css', '.scss', '.html'],
            'keywords': ['react', 'vue', 'ui', 'frontend', 'component']
        }
    }

    def __init__(self, root_dir: str = '.'):
        self.root_dir = Path(root_dir).resolve()
        self.metadata = {}

    def classify_file(self, file_path: Path) -> Dict[str, Any]:
        """Classify a file into CTB branch and generate metadata"""
        relative_path = file_path.relative_to(self.root_dir)

        # Check if already in CTB structure
        parts = relative_path.parts
        if parts[0] == 'ctb' and len(parts) > 1:
            ctb_branch = parts[1]
        else:
            ctb_branch = self._detect_branch(file_path)

        metadata = {
            'file_path': str(relative_path),
            'ctb_branch': ctb_branch,
            'file_type': file_path.suffix,
            'size_bytes': file_path.stat().st_size if file_path.exists() else 0,
            'last_modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat() if file_path.exists() else None,
            'tagged_at': datetime.utcnow().isoformat(),
            'heir_id': self._generate_heir_id(ctb_branch),
            'suggested_location': self._suggest_location(file_path, ctb_branch)
        }

        return metadata

    def _detect_branch(self, file_path: Path) -> str:
        """Detect which CTB branch a file belongs to"""
        file_name = file_path.name.lower()
        file_ext = file_path.suffix.lower()

        # Read file content for keyword detection (if text file and small enough)
        content = ""
        if file_ext in ['.py', '.js', '.ts', '.md', '.txt', '.yaml', '.yml', '.json']:
            try:
                if file_path.stat().st_size < 1_000_000:  # Only read files < 1MB
                    content = file_path.read_text(encoding='utf-8', errors='ignore').lower()
            except:
                pass

        # Score each branch
        scores = {}
        for branch, config in self.BRANCH_PATTERNS.items():
            score = 0

            # Check file name patterns
            for pattern in config['patterns']:
                if pattern in file_name:
                    score += 3
                if pattern in str(file_path).lower():
                    score += 1

            # Check extension
            if file_ext in config['extensions']:
                score += 2

            # Check keywords in content
            for keyword in config['keywords']:
                if keyword in content:
                    score += 1

            scores[branch] = score

        # Return branch with highest score, default to 'sys'
        if max(scores.values()) == 0:
            # Check path-based heuristics
            path_str = str(file_path).lower()
            if 'doc' in path_str or file_ext == '.md':
                return 'docs'
            if 'ui' in path_str or 'component' in path_str:
                return 'ui'
            return 'sys'

        return max(scores, key=scores.get)

    def _suggest_location(self, file_path: Path, branch: str) -> str:
        """Suggest new location in CTB structure"""
        relative_path = file_path.relative_to(self.root_dir)

        # If already in ctb/, keep it there
        if relative_path.parts[0] == 'ctb':
            return str(relative_path)

        # Suggest new location
        file_name = file_path.name

        # Special handling for common directories
        if 'script' in str(file_path).lower():
            return f"ctb/{branch}/scripts/{file_name}"
        elif 'config' in str(file_path).lower():
            return f"ctb/{branch}/config/{file_name}"
        elif 'test' in str(file_path).lower():
            return f"ctb/{branch}/tests/{file_name}"
        elif 'doc' in str(file_path).lower() or file_path.suffix == '.md':
            return f"ctb/docs/{branch}/{file_name}"
        else:
            return f"ctb/{branch}/{file_name}"

    def _generate_heir_id(self, branch: str) -> str:
        """Generate HEIR ID for metadata tracking"""
        now = datetime.utcnow()
        return f"HEIR-{now.year}-{now.month:02d}-CTB-{branch.upper()}-01"

    def scan_directory(self, directory: Path = None) -> Dict[str, Any]:
        """Scan directory and tag all files"""
        if directory is None:
            directory = self.root_dir

        results = {
            'scanned_at': datetime.utcnow().isoformat(),
            'root_directory': str(directory),
            'files': [],
            'summary': {
                'total_files': 0,
                'by_branch': {}
            }
        }

        # Ignore patterns
        ignore_patterns = [
            'node_modules', '.git', '__pycache__', 'dist', 'build',
            '.next', '.venv', 'venv', 'env'
        ]

        for root, dirs, files in os.walk(directory):
            # Remove ignored directories
            dirs[:] = [d for d in dirs if d not in ignore_patterns]

            for file in files:
                file_path = Path(root) / file

                try:
                    metadata = self.classify_file(file_path)
                    results['files'].append(metadata)

                    # Update summary
                    results['summary']['total_files'] += 1
                    branch = metadata['ctb_branch']
                    results['summary']['by_branch'][branch] = results['summary']['by_branch'].get(branch, 0) + 1
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

        return results

    def generate_tag_file(self, output_path: str = 'ctb/meta/ctb_tags.json'):
        """Generate tag file with all metadata"""
        results = self.scan_directory()

        output_file = self.root_dir / output_path
        output_file.parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)

        print(f"✅ Generated metadata tags: {output_file}")
        print(f"   Total files tagged: {results['summary']['total_files']}")
        print(f"   Branch distribution:")
        for branch, count in sorted(results['summary']['by_branch'].items()):
            print(f"      {branch}: {count} files")

        return results


def main():
    import sys

    directory = sys.argv[1] if len(sys.argv) > 1 else '.'

    print(f"🏷️  CTB Metadata Tagger")
    print(f"📂 Scanning: {directory}\n")

    tagger = CTBMetadataTagger(directory)
    results = tagger.generate_tag_file()

    print(f"\n✅ Tagging complete!")
    print(f"📄 Results saved to: ctb/meta/ctb_tags.json")


if __name__ == '__main__':
    main()
