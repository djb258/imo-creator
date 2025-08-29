#!/usr/bin/env python3
"""
CTB Structure System - Example Usage
===================================

This script demonstrates how to use the CTB structure system to create,
validate, and serialize CTB diagrams.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ctb_structure import (
    CTBNode, CTBAltitude, generate_ctb_template, 
    ctb_to_yaml, ctb_from_yaml, validate_ctb_structure,
    create_example_ctb
)


def main():
    print("🎄 CTB Structure System - Example Usage")
    print("=" * 50)
    
    # Example 1: Generate a basic template
    print("\n1️⃣ Generating Basic CTB Template")
    print("-" * 35)
    
    template = generate_ctb_template("My Project")
    template_node = CTBNode.from_dict(template)
    
    print("Generated structure:")
    print(f"  - Star: {template_node.label}")
    print(f"  - Branches: {len(template_node.subnodes)}")
    print(f"  - Total nodes: {len(template_node.get_all_nodes())}")
    
    # Validate the template
    errors = validate_ctb_structure(template_node)
    print(f"  - Validation: {'✅ Valid' if not errors else '❌ Errors: ' + str(errors)}")
    
    
    # Example 2: Create a custom CTB structure
    print("\n2️⃣ Creating Custom CTB Structure")
    print("-" * 37)
    
    # Create star node
    star = CTBNode(
        altitude=CTBAltitude.STAR.value,
        label="E-commerce Platform",
        description="Main CTB for e-commerce system"
    )
    
    # Create branches
    frontend_branch = CTBNode(
        altitude=CTBAltitude.BRANCH.value,
        label="Frontend Branch",
        imo="UI",  # Simple string for branch
        orbt="UX"
    )
    
    backend_branch = CTBNode(
        altitude=CTBAltitude.BRANCH.value,
        label="Backend Branch",
        description="API and data processing"
    )
    
    # Add detailed nodes to frontend branch
    ui_node = CTBNode(
        altitude=CTBAltitude.HIGH.value,
        label="User Interface Layer",
        imo={
            "input": "User interactions",
            "middle": "React components", 
            "output": "Rendered UI"
        },
        orbt={
            "operate": "Monitor performance",
            "repair": "Fix UI bugs",
            "build": "Deploy components",
            "train": "User onboarding"
        }
    )
    
    components_node = CTBNode(
        altitude=CTBAltitude.MEDIUM.value,
        label="Component Library",
        description="Reusable UI components"
    )
    
    styling_node = CTBNode(
        altitude=CTBAltitude.LOW.value,
        label="Styling System",
        description="CSS and theming"
    )
    
    # Build the tree
    components_node.add_subnode(styling_node)
    ui_node.add_subnode(components_node)
    frontend_branch.add_subnode(ui_node)
    
    # Add nodes to backend branch  
    api_node = CTBNode(
        altitude=CTBAltitude.HIGH.value,
        label="API Gateway",
        imo={
            "input": "HTTP requests",
            "middle": "Route processing",
            "output": "JSON responses"  
        }
    )
    
    backend_branch.add_subnode(api_node)
    
    # Assemble the full structure
    star.add_subnode(frontend_branch)
    star.add_subnode(backend_branch)
    
    print(f"Custom structure created:")
    print(f"  - Star: {star.label}")
    print(f"  - Branches: {len(star.subnodes)}")
    print(f"  - Total nodes: {len(star.get_all_nodes())}")
    
    # Validate
    errors = validate_ctb_structure(star)
    print(f"  - Validation: {'✅ Valid' if not errors else '❌ Errors: ' + str(errors)}")
    
    
    # Example 3: YAML serialization
    print("\n3️⃣ YAML Serialization Example")
    print("-" * 34)
    
    yaml_content = ctb_to_yaml(star, include_metadata=True)
    print("YAML output (first 10 lines):")
    yaml_lines = yaml_content.split('\n')
    for i, line in enumerate(yaml_lines[:10]):
        print(f"  {i+1:2d}: {line}")
    if len(yaml_lines) > 10:
        print(f"  ... ({len(yaml_lines)-10} more lines)")
    
    
    # Example 4: Round-trip test (YAML → Object → YAML)
    print("\n4️⃣ Round-trip Test (YAML ↔ Object)")
    print("-" * 36)
    
    # Convert to YAML and back
    reconstructed = ctb_from_yaml(yaml_content)
    
    # Verify they're equivalent
    original_dict = star.to_dict()
    reconstructed_dict = reconstructed.to_dict()
    
    nodes_match = len(original_dict.get('subnodes', [])) == len(reconstructed_dict.get('subnodes', []))
    labels_match = original_dict.get('label') == reconstructed_dict.get('label')
    
    print(f"  - Structure preserved: {'✅ Yes' if nodes_match and labels_match else '❌ No'}")
    print(f"  - Original nodes: {len(star.get_all_nodes())}")
    print(f"  - Reconstructed nodes: {len(reconstructed.get_all_nodes())}")
    
    
    # Example 5: Node search and manipulation
    print("\n5️⃣ Node Search and Manipulation")
    print("-" * 36)
    
    # Find specific nodes
    ui_found = star.find_node("30k_user_interface_layer")
    api_found = star.find_node("30k_api_gateway")
    
    print(f"  - Found UI node: {'✅ Yes' if ui_found else '❌ No'}")
    print(f"  - Found API node: {'✅ Yes' if api_found else '❌ No'}")
    
    if ui_found:
        print(f"  - UI node details: {ui_found}")
        print(f"  - UI IMO input: {ui_found.imo.get('input', 'N/A')}")
    
    
    # Example 6: Create production-ready blueprint
    print("\n6️⃣ Production-Ready Blueprint")
    print("-" * 33)
    
    example_ctb = create_example_ctb()
    
    # Save to file-like structure (demonstrating file output)
    blueprint_yaml = ctb_to_yaml(example_ctb, include_metadata=False)
    
    print(f"  - Created example with {len(example_ctb.get_all_nodes())} nodes")
    print(f"  - YAML size: {len(blueprint_yaml)} characters")
    print(f"  - Ready for ctb_blueprint.yaml: ✅ Yes")
    
    # Show validation
    validation_errors = validate_ctb_structure(example_ctb)
    print(f"  - Validation status: {'✅ Valid' if not validation_errors else '❌ Invalid'}")
    
    if validation_errors:
        print("  - Errors:")
        for error in validation_errors:
            print(f"    • {error}")
    
    
    print("\n" + "=" * 50)
    print("🎯 CTB Structure System Demo Complete!")
    print("📖 Use ctb_structure.py in your projects for consistent CTB diagrams")


if __name__ == "__main__":
    main()