#!/usr/bin/env python
"""Generate Mermaid visualizations from manifest and progress"""
import json
import yaml
import sys
from pathlib import Path

def load_files(slug: str) -> tuple:
    """Load manifest and progress files"""
    base_dir = Path(__file__).parent.parent
    blueprint_dir = base_dir / "docs" / "blueprints" / slug
    blueprint_dir.mkdir(parents=True, exist_ok=True)
    
    manifest_path = blueprint_dir / "manifest.yaml"
    progress_path = blueprint_dir / "progress.json"
    
    if not manifest_path.exists():
        print(f"Warning: Manifest not found at {manifest_path}")
        print("Please run blueprint_score.py first to create a starter manifest")
        # Return empty structures to generate placeholder diagrams
        manifest = {
            'process': slug,
            'version': '1.0.0',
            'buckets': {
                'input': {'stages': []},
                'middle': {'stages': []},
                'output': {'stages': []}
            }
        }
    else:
        with open(manifest_path, 'r') as f:
            manifest = yaml.safe_load(f)
    
    progress = {}
    if progress_path.exists():
        with open(progress_path, 'r') as f:
            progress = json.load(f)
    else:
        print(f"Note: No progress.json found. All stages will show as 'todo'")
    
    return manifest, progress

def generate_tree_overview(manifest: dict, progress: dict) -> str:
    """Generate tree overview Mermaid diagram"""
    lines = ["flowchart LR"]
    lines.append("    classDef done fill:#22c55e,stroke:#15803d,color:#fff;")
    lines.append("    classDef wip fill:#f59e0b,stroke:#b45309,color:#111;")
    lines.append("    classDef todo fill:#ef4444,stroke:#7f1d1d,color:#fff;")
    lines.append("")
    
    buckets_progress = progress.get('buckets', {})
    
    for bucket_name, bucket_data in manifest.get('buckets', {}).items():
        lines.append(f"    subgraph {bucket_name.upper()}[\"{bucket_name.upper()}\"]")
        
        stages = bucket_data.get('stages', [])
        bucket_progress = buckets_progress.get(bucket_name, {})
        
        for i, stage in enumerate(stages):
            stage_key = stage.get('key', '')
            stage_title = stage.get('title', '')
            status = bucket_progress.get(stage_key, 'todo')
            
            node_id = f"{bucket_name}_{stage_key}"
            lines.append(f"        {node_id}[\"{stage_key}<br/>{stage_title}\"]:::{status}")
            
            if i > 0:
                prev_key = stages[i-1].get('key', '')
                prev_id = f"{bucket_name}_{prev_key}"
                lines.append(f"        {prev_id} --> {node_id}")
        
        lines.append("    end")
        lines.append("")
    
    # Only add connections if we have stages
    has_stages = any(
        len(manifest.get('buckets', {}).get(b, {}).get('stages', [])) > 0
        for b in ['input', 'middle', 'output']
    )
    if has_stages:
        lines.append("    INPUT --> MIDDLE")
        lines.append("    MIDDLE --> OUTPUT")
    
    return "\n".join(lines)

def generate_ladder(bucket_name: str, bucket_data: dict, bucket_progress: dict) -> str:
    """Generate ladder diagram for a bucket"""
    lines = ["flowchart TD"]
    lines.append("    classDef done fill:#22c55e,stroke:#15803d,color:#fff;")
    lines.append("    classDef wip fill:#f59e0b,stroke:#b45309,color:#111;")
    lines.append("    classDef todo fill:#ef4444,stroke:#7f1d1d,color:#fff;")
    lines.append("")
    
    stages = bucket_data.get('stages', [])
    
    for i, stage in enumerate(stages):
        stage_key = stage.get('key', '')
        stage_title = stage.get('title', '')
        stage_kind = stage.get('kind', '')
        status = bucket_progress.get(stage_key, 'todo')
        
        fields = stage.get('fields', {})
        field_count = len(fields)
        
        node_id = f"{bucket_name}_{stage_key}"
        label = f"{stage_key} [{stage_kind}]<br/>{stage_title}<br/>({field_count} fields)"
        lines.append(f"    {node_id}[\"{label}\"]:::{status}")
        
        if i > 0:
            prev_key = stages[i-1].get('key', '')
            prev_id = f"{bucket_name}_{prev_key}"
            lines.append(f"    {prev_id} --> {node_id}")
    
    return "\n".join(lines)

def main():
    if len(sys.argv) != 2:
        print("Usage: python blueprint_visual.py <slug>")
        sys.exit(1)
    
    slug = sys.argv[1]
    manifest, progress = load_files(slug)
    
    base_dir = Path(__file__).parent.parent
    output_dir = base_dir / "docs" / "blueprints" / slug
    output_dir.mkdir(parents=True, exist_ok=True)
    
    buckets_progress = progress.get('buckets', {})
    
    overview = generate_tree_overview(manifest, progress)
    with open(output_dir / "tree_overview.mmd", 'w') as f:
        f.write(overview)
    
    for bucket_name, bucket_data in manifest.get('buckets', {}).items():
        bucket_progress = buckets_progress.get(bucket_name, {})
        ladder = generate_ladder(bucket_name, bucket_data, bucket_progress)
        with open(output_dir / f"ladder_{bucket_name}.mmd", 'w') as f:
            f.write(ladder)
    
    print(f"Generated 4 Mermaid files in {output_dir}")

if __name__ == "__main__":
    main()