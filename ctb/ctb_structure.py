#!/usr/bin/env python3
"""
CTB (Christmas Tree Backbone) Structure System
==============================================

This module provides a programmatic representation of the standard CTB diagram
layout used across all repositories. It defines altitude-based hierarchical
structures that can be rendered by downstream tools like GDT into Whimsical
diagrams.

Altitude Structure:
- 40k: Star node (title only, no IMO/ORBT)
- 20k: Branches (label + optional IMO/ORBT, default to 'A') 
- 30k, 10k, 5k, 1k: Nodes with full IMO and ORBT blocks

Author: IMO Creator System
Version: 1.0.0
"""

from typing import Dict, List, Optional, Union, Any
from dataclasses import dataclass, field, asdict
from enum import Enum
import yaml
import json


class CTBAltitude(Enum):
    """Enumeration of CTB altitude levels"""
    STAR = "40k"      # Star node - title only
    BRANCH = "20k"    # Branch nodes - label + optional IMO/ORBT
    HIGH = "30k"      # High altitude nodes - full IMO/ORBT
    MEDIUM = "10k"    # Medium altitude nodes - full IMO/ORBT  
    LOW = "5k"        # Low altitude nodes - full IMO/ORBT
    GROUND = "1k"     # Ground level nodes - full IMO/ORBT


# Default IMO/ORBT values for nodes that don't specify them
DEFAULT_IMO = {
    "input": "A",
    "middle": "A", 
    "output": "A"
}

DEFAULT_ORBT = {
    "operate": "A",
    "repair": "A",
    "build": "A",
    "train": "A"
}


@dataclass
class CTBNode:
    """
    Represents a node in the CTB (Christmas Tree Backbone) structure.
    
    This class encapsulates all the information needed to represent a node
    at any altitude level in the CTB hierarchy, with appropriate defaults
    and validation based on altitude-specific requirements.
    """
    
    altitude: str  # CTBAltitude value (40k, 20k, 30k, 10k, 5k, 1k)
    label: str     # Required human-readable label
    imo: Optional[Union[Dict[str, str], str]] = None    # IMO block or "A"
    orbt: Optional[Union[Dict[str, str], str]] = None   # ORBT block or "A"
    subnodes: List['CTBNode'] = field(default_factory=list)  # Child nodes
    
    # Optional metadata
    node_id: Optional[str] = None           # Unique identifier
    description: Optional[str] = None       # Extended description
    metadata: Dict[str, Any] = field(default_factory=dict)  # Extensible metadata
    
    def __post_init__(self):
        """Post-initialization validation and default assignment"""
        # Validate altitude
        valid_altitudes = [alt.value for alt in CTBAltitude]
        if self.altitude not in valid_altitudes:
            raise ValueError(f"Invalid altitude '{self.altitude}'. Must be one of: {valid_altitudes}")
        
        # Apply altitude-specific rules
        if self.altitude == CTBAltitude.STAR.value:
            # Star nodes (40k) don't have IMO/ORBT
            if self.imo is not None or self.orbt is not None:
                raise ValueError("Star nodes (40k) cannot have IMO or ORBT blocks")
        
        elif self.altitude == CTBAltitude.BRANCH.value:
            # Branch nodes (20k) have optional IMO/ORBT, default to "A"
            if self.imo is None:
                self.imo = "A"
            if self.orbt is None:
                self.orbt = "A"
        
        else:
            # All other nodes (30k, 10k, 5k, 1k) have full IMO/ORBT blocks
            if self.imo is None or self.imo == "A":
                self.imo = DEFAULT_IMO.copy()
            if self.orbt is None or self.orbt == "A":
                self.orbt = DEFAULT_ORBT.copy()
        
        # Generate node_id if not provided
        if self.node_id is None:
            self.node_id = self._generate_node_id()
    
    def _generate_node_id(self) -> str:
        """Generate a unique node ID based on altitude and label"""
        safe_label = "".join(c.lower() if c.isalnum() else "_" for c in self.label)
        return f"{self.altitude}_{safe_label}"
    
    def add_subnode(self, subnode: 'CTBNode') -> 'CTBNode':
        """
        Add a child node to this node.
        
        Args:
            subnode: The CTBNode to add as a child
            
        Returns:
            The added subnode for method chaining
        """
        self.subnodes.append(subnode)
        return subnode
    
    def find_node(self, node_id: str) -> Optional['CTBNode']:
        """
        Recursively find a node by its ID.
        
        Args:
            node_id: The node ID to search for
            
        Returns:
            The CTBNode if found, None otherwise
        """
        if self.node_id == node_id:
            return self
        
        for subnode in self.subnodes:
            result = subnode.find_node(node_id)
            if result:
                return result
        
        return None
    
    def get_all_nodes(self) -> List['CTBNode']:
        """
        Get all nodes in the tree (including this node).
        
        Returns:
            List of all CTBNode instances in the subtree
        """
        nodes = [self]
        for subnode in self.subnodes:
            nodes.extend(subnode.get_all_nodes())
        return nodes
    
    def validate(self) -> List[str]:
        """
        Validate the node and all its subnodes.
        
        Returns:
            List of validation error messages (empty if valid)
        """
        errors = []
        
        # Validate required fields
        if not self.label or not self.label.strip():
            errors.append(f"Node {self.node_id}: label cannot be empty")
        
        # Validate IMO structure for non-star nodes
        if self.altitude != CTBAltitude.STAR.value and isinstance(self.imo, dict):
            required_imo_keys = {"input", "middle", "output"}
            imo_keys = set(self.imo.keys())
            missing_keys = required_imo_keys - imo_keys
            if missing_keys:
                errors.append(f"Node {self.node_id}: IMO missing keys: {missing_keys}")
        
        # Validate ORBT structure for non-star nodes
        if self.altitude != CTBAltitude.STAR.value and isinstance(self.orbt, dict):
            required_orbt_keys = {"operate", "repair", "build", "train"}
            orbt_keys = set(self.orbt.keys())
            missing_keys = required_orbt_keys - orbt_keys
            if missing_keys:
                errors.append(f"Node {self.node_id}: ORBT missing keys: {missing_keys}")
        
        # Validate subnodes
        for subnode in self.subnodes:
            errors.extend(subnode.validate())
        
        return errors
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the node to a dictionary representation.
        
        Returns:
            Dictionary representation of the node
        """
        result = {
            "altitude": self.altitude,
            "label": self.label,
            "node_id": self.node_id
        }
        
        # Add IMO/ORBT if present
        if self.imo is not None:
            result["imo"] = self.imo
        if self.orbt is not None:
            result["orbt"] = self.orbt
        
        # Add optional fields if present
        if self.description:
            result["description"] = self.description
        if self.metadata:
            result["metadata"] = self.metadata
        
        # Add subnodes
        if self.subnodes:
            result["subnodes"] = [subnode.to_dict() for subnode in self.subnodes]
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CTBNode':
        """
        Create a CTBNode from a dictionary representation.
        
        Args:
            data: Dictionary containing node data
            
        Returns:
            CTBNode instance
        """
        # Extract subnodes and create them recursively
        subnodes_data = data.pop("subnodes", [])
        subnodes = [cls.from_dict(subnode_data) for subnode_data in subnodes_data]
        
        # Create the node
        node = cls(**data, subnodes=subnodes)
        return node
    
    def __str__(self) -> str:
        """String representation of the node"""
        return f"CTBNode({self.altitude}, '{self.label}', {len(self.subnodes)} subnodes)"
    
    def __repr__(self) -> str:
        """Detailed string representation"""
        return (f"CTBNode(altitude='{self.altitude}', label='{self.label}', "
                f"node_id='{self.node_id}', subnodes={len(self.subnodes)})")


def generate_ctb_template(star_name: str) -> Dict[str, Any]:
    """
    Generate a complete CTB template ready for customization.
    
    This function creates a standard CTB structure with:
    - One star node (40k)
    - One branch (20k)
    - A chain: 30k → 10k → 5k
    
    Args:
        star_name: The name/label for the star node
        
    Returns:
        Dictionary representation of the complete CTB structure
    """
    # Create the star node (40k)
    star = CTBNode(
        altitude=CTBAltitude.STAR.value,
        label=star_name,
        description=f"Main star node for {star_name}"
    )
    
    # Create branch node (20k)
    branch = CTBNode(
        altitude=CTBAltitude.BRANCH.value,
        label="Main Branch",
        description="Primary branch of the CTB structure"
    )
    
    # Create the node chain: 30k → 10k → 5k
    node_30k = CTBNode(
        altitude=CTBAltitude.HIGH.value,
        label="High Level Node",
        description="High altitude operational node"
    )
    
    node_10k = CTBNode(
        altitude=CTBAltitude.MEDIUM.value,
        label="Medium Level Node", 
        description="Medium altitude operational node"
    )
    
    node_5k = CTBNode(
        altitude=CTBAltitude.LOW.value,
        label="Low Level Node",
        description="Low altitude operational node"
    )
    
    # Build the hierarchy: 30k → 10k → 5k
    node_10k.add_subnode(node_5k)
    node_30k.add_subnode(node_10k)
    branch.add_subnode(node_30k)
    star.add_subnode(branch)
    
    return star.to_dict()


def ctb_to_yaml(ctb_structure: Union[CTBNode, Dict[str, Any]], 
                include_metadata: bool = True) -> str:
    """
    Convert CTB structure to YAML format.
    
    Args:
        ctb_structure: CTBNode instance or dictionary
        include_metadata: Whether to include metadata fields
        
    Returns:
        YAML string representation
    """
    if isinstance(ctb_structure, CTBNode):
        data = ctb_structure.to_dict()
    else:
        data = ctb_structure
    
    # Optionally remove metadata
    if not include_metadata:
        data = _remove_metadata(data)
    
    return yaml.dump(data, default_flow_style=False, indent=2, sort_keys=False)


def ctb_from_yaml(yaml_content: str) -> CTBNode:
    """
    Create CTB structure from YAML content.
    
    Args:
        yaml_content: YAML string containing CTB structure
        
    Returns:
        CTBNode instance representing the root
    """
    data = yaml.safe_load(yaml_content)
    return CTBNode.from_dict(data)


def _remove_metadata(data: Dict[str, Any]) -> Dict[str, Any]:
    """Helper function to remove metadata fields recursively"""
    cleaned = {}
    skip_keys = {"node_id", "description", "metadata"}
    
    for key, value in data.items():
        if key in skip_keys:
            continue
        
        if key == "subnodes" and isinstance(value, list):
            cleaned[key] = [_remove_metadata(subnode) for subnode in value]
        else:
            cleaned[key] = value
    
    return cleaned


def validate_ctb_structure(ctb_structure: Union[CTBNode, Dict[str, Any]]) -> List[str]:
    """
    Validate a complete CTB structure.
    
    Args:
        ctb_structure: CTBNode instance or dictionary to validate
        
    Returns:
        List of validation error messages (empty if valid)
    """
    if isinstance(ctb_structure, dict):
        ctb_structure = CTBNode.from_dict(ctb_structure)
    
    errors = ctb_structure.validate()
    
    # Additional structural validations
    all_nodes = ctb_structure.get_all_nodes()
    
    # Check for duplicate node IDs
    node_ids = [node.node_id for node in all_nodes if node.node_id]
    duplicates = [node_id for node_id in set(node_ids) if node_ids.count(node_id) > 1]
    if duplicates:
        errors.append(f"Duplicate node IDs found: {duplicates}")
    
    # Ensure we have at least a star node
    star_nodes = [node for node in all_nodes if node.altitude == CTBAltitude.STAR.value]
    if not star_nodes:
        errors.append("CTB structure must have at least one star node (40k)")
    elif len(star_nodes) > 1:
        errors.append("CTB structure should have exactly one star node (40k)")
    
    return errors


# Example usage and testing functions
def create_example_ctb() -> CTBNode:
    """Create an example CTB structure for demonstration"""
    star = CTBNode(
        altitude=CTBAltitude.STAR.value,
        label="Example Project CTB",
        description="Example Christmas Tree Backbone structure"
    )
    
    # Create two branches
    for i, branch_name in enumerate(["Development Branch", "Operations Branch"], 1):
        branch = CTBNode(
            altitude=CTBAltitude.BRANCH.value,
            label=branch_name,
            description=f"Branch {i} of the CTB structure"
        )
        
        # Add a node chain to each branch
        high_node = CTBNode(
            altitude=CTBAltitude.HIGH.value,
            label=f"High Level - {branch_name}",
            imo={"input": "API", "middle": "Process", "output": "Result"},
            orbt={"operate": "Monitor", "repair": "Fix", "build": "Deploy", "train": "Guide"}
        )
        
        medium_node = CTBNode(
            altitude=CTBAltitude.MEDIUM.value,
            label=f"Medium Level - {branch_name}",
            description="Implementation level operations"
        )
        
        low_node = CTBNode(
            altitude=CTBAltitude.LOW.value,
            label=f"Low Level - {branch_name}",
            description="Ground level execution"
        )
        
        # Build chain
        medium_node.add_subnode(low_node)
        high_node.add_subnode(medium_node)
        branch.add_subnode(high_node)
        star.add_subnode(branch)
    
    return star


if __name__ == "__main__":
    # Demo usage
    print("CTB Structure System Demo")
    print("=" * 40)
    
    # Generate template
    template = generate_ctb_template("Demo Project")
    template_node = CTBNode.from_dict(template)
    
    print("Generated Template:")
    print(ctb_to_yaml(template_node))
    
    # Validate
    errors = validate_ctb_structure(template_node)
    print(f"Validation: {'✅ Valid' if not errors else '❌ Errors: ' + str(errors)}")
    
    # Create example
    example = create_example_ctb()
    print(f"\nExample CTB created with {len(example.get_all_nodes())} total nodes")