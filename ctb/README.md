# CTB Structure System

A comprehensive, programmatic framework for creating and managing CTB (Christmas Tree Backbone) diagram layouts used across all IMO Creator repositories.

## Overview

The CTB Structure System provides:

- **Standardized altitude-based hierarchy** (40k → 20k → 30k → 10k → 5k → 1k)
- **Programmatic CTB creation** with Python classes and methods
- **YAML serialization/deserialization** for storage and transport
- **Validation and default handling** for IMO/ORBT blocks
- **Template generation** for rapid CTB scaffolding

## Architecture

### Altitude Levels

| Altitude | Type | IMO/ORBT Requirements |
|----------|------|--------------------|
| **40k** | Star node | Title only (no IMO/ORBT) |
| **20k** | Branches | Optional IMO/ORBT (default: "A") |
| **30k** | High nodes | Full IMO/ORBT blocks |
| **10k** | Medium nodes | Full IMO/ORBT blocks |
| **5k** | Low nodes | Full IMO/ORBT blocks |
| **1k** | Ground nodes | Full IMO/ORBT blocks |

### Default Values

When IMO/ORBT blocks are not specified for nodes requiring them:

**Default IMO:**
```yaml
imo:
  input: "A"
  middle: "A" 
  output: "A"
```

**Default ORBT:**
```yaml
orbt:
  operate: "A"
  repair: "A"
  build: "A"
  train: "A"
```

## Core Components

### CTBNode Class

The primary data structure representing a node in the CTB hierarchy:

```python
from ctb_structure import CTBNode, CTBAltitude

# Create a star node
star = CTBNode(
    altitude=CTBAltitude.STAR.value,  # "40k"
    label="My Project CTB",
    description="Main project backbone"
)

# Create branch with custom IMO/ORBT
branch = CTBNode(
    altitude=CTBAltitude.BRANCH.value,  # "20k"
    label="Frontend Branch",
    imo="UI",  # Simple string for branches
    orbt="UX"
)

# Create detailed node with full blocks
node = CTBNode(
    altitude=CTBAltitude.HIGH.value,  # "30k"
    label="API Gateway",
    imo={
        "input": "HTTP requests",
        "middle": "Route processing",
        "output": "JSON responses"
    },
    orbt={
        "operate": "Monitor endpoints",
        "repair": "Fix routing issues",
        "build": "Deploy API services",
        "train": "API documentation"
    }
)
```

### Key Methods

**Tree Building:**
```python
# Add child nodes
branch.add_subnode(node)
star.add_subnode(branch)

# Find nodes by ID
api_node = star.find_node("30k_api_gateway")

# Get all nodes in subtree
all_nodes = star.get_all_nodes()
```

**Validation:**
```python
# Validate structure
errors = star.validate()
if not errors:
    print("Structure is valid!")
```

**YAML Operations:**
```python
from ctb_structure import ctb_to_yaml, ctb_from_yaml

# Convert to YAML
yaml_content = ctb_to_yaml(star)

# Load from YAML
reconstructed = ctb_from_yaml(yaml_content)
```

## Quick Start

### Generate a Template

```python
from ctb_structure import generate_ctb_template, CTBNode

# Generate basic template
template_dict = generate_ctb_template("My Project")
template = CTBNode.from_dict(template_dict)

print(f"Created template with {len(template.get_all_nodes())} nodes")
```

### Create Custom Structure

```python
from ctb_structure import CTBNode, CTBAltitude, ctb_to_yaml

# Build custom structure
star = CTBNode(altitude="40k", label="E-commerce Platform")

frontend = CTBNode(altitude="20k", label="Frontend Branch")
ui_layer = CTBNode(
    altitude="30k", 
    label="UI Components",
    imo={"input": "User actions", "middle": "React", "output": "UI"}
)

frontend.add_subnode(ui_layer)
star.add_subnode(frontend)

# Export to YAML
yaml_output = ctb_to_yaml(star)
print(yaml_output)
```

## File Structure

```
ctb/
├── ctb_structure.py      # Core CTB system classes and functions
├── generate_blueprint.py # Blueprint generator for IMO Creator
├── example_usage.py      # Comprehensive usage examples
├── ctb_blueprint.yaml    # Generated production blueprint
├── ctb_blueprint.schema.json # JSON schema for validation
└── README.md            # This documentation
```

## Usage Examples

### 1. Basic Template Generation

```bash
cd ctb
python -c "
from ctb_structure import generate_ctb_template, ctb_to_yaml, CTBNode
template = CTBNode.from_dict(generate_ctb_template('Test Project'))
print(ctb_to_yaml(template))
"
```

### 2. Interactive Exploration

```bash
cd ctb
python example_usage.py
```

### 3. Generate Production Blueprint

```bash
cd ctb
python generate_blueprint.py
```

## Integration with Downstream Tools

The CTB Structure System is designed for integration with rendering tools:

### For GDT (Graphical Diagram Tool)

```python
# Export structure for GDT consumption
ctb_data = star.to_dict()

# GDT can process the hierarchical structure
for branch in ctb_data['subnodes']:
    render_branch(branch)
```

### For Whimsical Integration

```python
# Clean YAML for Whimsical import
yaml_for_whimsical = ctb_to_yaml(star, include_metadata=False)
```

### For LLM Processing

```python
# Structured data for LLM consumption
structured_data = {
    "total_nodes": len(star.get_all_nodes()),
    "structure": star.to_dict(),
    "validation": star.validate()
}
```

## Validation and Standards

### Schema Compliance

The system enforces CTB schema discipline:

- **Required altitude values**: 40k, 20k, 30k, 10k, 5k, 1k
- **IMO block structure**: input, middle, output keys
- **ORBT block structure**: operate, repair, build, train keys
- **Hierarchical integrity**: Proper parent-child relationships

### Validation Checks

```python
from ctb_structure import validate_ctb_structure

errors = validate_ctb_structure(ctb_node)
for error in errors:
    print(f"Validation error: {error}")
```

## Extension Points

### Custom Node Types

```python
# Extend CTBNode for specialized needs
class CustomCTBNode(CTBNode):
    def __init__(self, *args, custom_field=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.custom_field = custom_field
```

### Custom Validators

```python
# Add custom validation logic
def custom_validate(node):
    errors = node.validate()  # Standard validation
    
    # Add custom checks
    if "api" in node.label.lower() and not node.imo.get("input"):
        errors.append("API nodes must specify input")
    
    return errors
```

## Advanced Features

### Node Search and Manipulation

```python
# Complex node operations
def update_all_apis(root_node):
    for node in root_node.get_all_nodes():
        if "api" in node.label.lower():
            node.orbt["operate"] = "Monitor with APM"
            node.orbt["repair"] = "Auto-restart services"
```

### Batch Operations

```python
# Update multiple nodes
api_nodes = [n for n in star.get_all_nodes() if "API" in n.label]
for node in api_nodes:
    node.metadata["category"] = "backend"
```

### Template Customization

```python
def create_microservices_template(service_names):
    star = CTBNode(altitude="40k", label="Microservices Architecture")
    
    for service in service_names:
        branch = CTBNode(altitude="20k", label=f"{service} Service")
        api_node = CTBNode(
            altitude="30k",
            label=f"{service} API",
            imo={"input": "Requests", "middle": "Business Logic", "output": "Response"}
        )
        branch.add_subnode(api_node)
        star.add_subnode(branch)
    
    return star
```

## Best Practices

1. **Consistent Labeling**: Use clear, descriptive labels
2. **Meaningful IMO/ORBT**: Specify actual inputs/outputs and operations
3. **Hierarchical Logic**: Maintain logical parent-child relationships
4. **Validation First**: Always validate before serializing
5. **Documentation**: Include descriptions for complex nodes

## Contributing

When extending the CTB Structure System:

1. Maintain backward compatibility
2. Add comprehensive validation
3. Update documentation and examples
4. Ensure YAML roundtrip compatibility
5. Test with various CTB scenarios

---

**Generated by CTB Structure System v1.0.0**  
Part of the IMO Creator ecosystem.