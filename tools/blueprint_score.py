#!/usr/bin/env python
"""Score a blueprint manifest to generate progress.json"""
import json
import yaml
import sys
from pathlib import Path

def load_manifest(slug: str) -> dict:
    """Load manifest.yaml for given slug"""
    base_dir = Path(__file__).parent.parent
    blueprint_dir = base_dir / "docs" / "blueprints" / slug
    blueprint_dir.mkdir(parents=True, exist_ok=True)
    
    manifest_path = blueprint_dir / "manifest.yaml"
    
    if not manifest_path.exists():
        print(f"Warning: Manifest not found at {manifest_path}")
        print("Creating minimal starter manifest...")
        starter_manifest = {
            'process': slug,
            'version': '1.0.0',
            'mission': {
                'north_star': f"Describe what the {slug} process achieves.",
                'success_metrics': [],
                'constraints': [],
                'risks': []
            },
            'universals': {
                'triggers': [],
                'gates': [],
                'idempotency': {'key': None},
                'retries': {'max': 0, 'backoff': 'none', 'timeout_ms': None},
                'observe': {'events': [], 'metrics': [], 'redact': []},
                'security': {'secrets': [], 'scopes': []},
                'data_policy': {'classification': 'internal', 'retention': 'P30D'},
                'limits': {'qps': None, 'budget_usd': None, 'slo_ms': None},
                'errors': {'on_fail': 'retry'},
                'human': {'approval_required': False}
            },
            'buckets': {
                'input': {'stages': []},
                'middle': {'stages': []},
                'output': {'stages': []}
            }
        }
        
        with open(manifest_path, 'w') as f:
            yaml.dump(starter_manifest, f, default_flow_style=False, sort_keys=False)
        
        return starter_manifest
    
    with open(manifest_path, 'r') as f:
        return yaml.safe_load(f)

def score_stage(stage: dict) -> str:
    """Score a single stage: done/wip/todo"""
    fields = stage.get('fields', {})
    required_fields = stage.get('required_fields', [])
    
    if not required_fields:
        return 'done'
    
    truthy_required = sum(1 for field in required_fields if fields.get(field))
    
    if truthy_required == len(required_fields):
        return 'done'
    elif truthy_required > 0:
        return 'wip'
    else:
        return 'todo'

def score_manifest(manifest: dict, slug: str) -> dict:
    """Generate progress from manifest"""
    buckets_progress = {}
    todo_items = {'input': [], 'middle': [], 'output': []}
    total_stages = 0
    done_stages = 0
    
    for bucket_name, bucket_data in manifest.get('buckets', {}).items():
        bucket_progress = {}
        
        for stage in bucket_data.get('stages', []):
            stage_key = stage.get('key', '')
            status = score_stage(stage)
            bucket_progress[stage_key] = status
            
            total_stages += 1
            if status == 'done':
                done_stages += 1
            elif status in ['wip', 'todo']:
                todo_items[bucket_name].append({
                    'key': stage_key,
                    'title': stage.get('title', ''),
                    'status': status,
                    'missing': [f for f in stage.get('required_fields', []) 
                               if not stage.get('fields', {}).get(f)]
                })
        
        buckets_progress[bucket_name] = bucket_progress
    
    percent = int((done_stages / total_stages * 100) if total_stages > 0 else 0)
    
    return {
        'slug': slug,
        'overall': {
            'done': done_stages,
            'total': total_stages,
            'percent': percent
        },
        'buckets': buckets_progress,
        'todo': todo_items
    }

def main():
    if len(sys.argv) != 2:
        print("Usage: python blueprint_score.py <slug>")
        sys.exit(1)
    
    slug = sys.argv[1]
    manifest = load_manifest(slug)
    progress = score_manifest(manifest, slug)
    
    base_dir = Path(__file__).parent.parent
    output_dir = base_dir / "docs" / "blueprints" / slug
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "progress.json"
    
    with open(output_path, 'w') as f:
        json.dump(progress, f, indent=2)
    
    print(f"Progress saved to {output_path}")
    print(f"Overall: {progress['overall']['done']}/{progress['overall']['total']} ({progress['overall']['percent']}%)")

if __name__ == "__main__":
    main()