#!/usr/bin/env python3
"""
Generate CTB Blueprint YAML
==========================

This script generates a production-ready ctb_blueprint.yaml file using
the CTB structure system.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ctb_structure import generate_ctb_template, ctb_to_yaml, CTBNode, CTBAltitude


def create_imo_creator_blueprint():
    """Create a CTB blueprint specifically for the imo-creator project"""
    
    # Create the star node
    star = CTBNode(
        altitude=CTBAltitude.STAR.value,
        label="IMO Creator Blueprint",
        description="Christmas Tree Backbone for IMO Creator system"
    )
    
    # Create main branches
    ui_branch = CTBNode(
        altitude=CTBAltitude.BRANCH.value,
        label="UI/Frontend Branch",
        imo="UI",
        orbt="UX",
        description="User interface and experience components"
    )
    
    backend_branch = CTBNode(
        altitude=CTBAltitude.BRANCH.value,
        label="Backend/API Branch", 
        imo="API",
        orbt="SRV",
        description="Backend services and API endpoints"
    )
    
    tools_branch = CTBNode(
        altitude=CTBAltitude.BRANCH.value,
        label="Tooling/DevOps Branch",
        imo="TOOL",
        orbt="OPS",
        description="Development tools and operations"
    )
    
    # UI Branch nodes
    plasmic_node = CTBNode(
        altitude=CTBAltitude.HIGH.value,
        label="Plasmic Integration",
        imo={
            "input": "Design components",
            "middle": "Component sync",
            "output": "React components"
        },
        orbt={
            "operate": "Monitor sync",
            "repair": "Fix component issues", 
            "build": "Deploy components",
            "train": "Design system docs"
        }
    )
    
    ui_components = CTBNode(
        altitude=CTBAltitude.MEDIUM.value,
        label="UI Component Library",
        description="Reusable UI components and patterns"
    )
    
    styling_system = CTBNode(
        altitude=CTBAltitude.LOW.value,
        label="Styling & Theming",
        description="Tailwind CSS configuration and theme system"
    )
    
    # Backend Branch nodes  
    ctb_api = CTBNode(
        altitude=CTBAltitude.HIGH.value,
        label="CTB Validation API",
        imo={
            "input": "CTB blueprints",
            "middle": "Schema validation", 
            "output": "Validation results"
        },
        orbt={
            "operate": "Process validations",
            "repair": "Handle validation errors",
            "build": "Deploy validation service", 
            "train": "API documentation"
        }
    )
    
    data_layer = CTBNode(
        altitude=CTBAltitude.MEDIUM.value,
        label="Data Management",
        description="Database and data persistence layer"
    )
    
    auth_system = CTBNode(
        altitude=CTBAltitude.LOW.value,
        label="Authentication",
        description="User authentication and authorization"
    )
    
    # Tools Branch nodes
    bmad_system = CTBNode(
        altitude=CTBAltitude.HIGH.value,
        label="BMAD System",
        imo={
            "input": "Performance metrics",
            "middle": "Analysis & measurement",
            "output": "BMAD reports"  
        },
        orbt={
            "operate": "Run measurements",
            "repair": "Fix performance issues",
            "build": "Deploy monitoring",
            "train": "BMAD documentation"
        }
    )
    
    github_actions = CTBNode(
        altitude=CTBAltitude.MEDIUM.value,
        label="CI/CD Pipeline",
        description="GitHub Actions workflows and automation"
    )
    
    validation_tools = CTBNode(
        altitude=CTBAltitude.LOW.value,
        label="Validation Tools",
        description="CTB schema validation and linting tools"
    )
    
    # Build the hierarchy
    # UI Branch
    ui_components.add_subnode(styling_system)
    plasmic_node.add_subnode(ui_components)
    ui_branch.add_subnode(plasmic_node)
    
    # Backend Branch
    data_layer.add_subnode(auth_system)
    ctb_api.add_subnode(data_layer)
    backend_branch.add_subnode(ctb_api)
    
    # Tools Branch
    github_actions.add_subnode(validation_tools)
    bmad_system.add_subnode(github_actions)
    tools_branch.add_subnode(bmad_system)
    
    # Assemble the star
    star.add_subnode(ui_branch)
    star.add_subnode(backend_branch)  
    star.add_subnode(tools_branch)
    
    return star


def main():
    """Generate and save the CTB blueprint"""
    
    print("Generating IMO Creator CTB Blueprint...")
    
    # Create the blueprint
    blueprint = create_imo_creator_blueprint()
    
    # Convert to YAML (clean format for production)
    yaml_content = ctb_to_yaml(blueprint, include_metadata=False)
    
    # Prepare the final YAML with header
    header = '''# CTB Blueprint Configuration
# ===========================
# Christmas Tree Backbone structure for IMO Creator
# Generated by CTB Structure System

version: "1.0"
'''
    
    final_yaml = header + yaml_content
    
    # Save to file
    output_file = os.path.join(os.path.dirname(__file__), 'ctb_blueprint.yaml')
    with open(output_file, 'w') as f:
        f.write(final_yaml)
    
    print(f"Blueprint generated: {output_file}")
    print(f"Structure summary:")
    print(f"   - Total nodes: {len(blueprint.get_all_nodes())}")
    print(f"   - Branches: {len(blueprint.subnodes)}")
    print(f"   - Star label: {blueprint.label}")
    
    # Validate
    from ctb_structure import validate_ctb_structure
    errors = validate_ctb_structure(blueprint)
    
    if errors:
        print(f"Validation errors:")
        for error in errors:
            print(f"   - {error}")
    else:
        print("Blueprint validation passed!")
    
    print(f"\nPreview (first 15 lines):")
    lines = final_yaml.split('\n')
    for i, line in enumerate(lines[:15]):
        print(f"   {i+1:2d}: {line}")
    
    if len(lines) > 15:
        print(f"   ... ({len(lines)-15} more lines)")


if __name__ == "__main__":
    main()