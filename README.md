# AI/Human Readable Branch

This branch provides repository readability for both AI systems and human developers through automated analysis, diagram generation, and narrative summaries.

## 🤖 Purpose

Every repository explains itself to humans & AI by default through:

- **GitIngest indexing** for semantic search and AI comprehension
- **Diagram generation** using Mermaid, PlantUML, and SVG formats
- **Narrative summaries** in IMO + ORBT format for project understanding

## 🔄 Available Workflows

### `git-ingest.yml`
- **Purpose**: Generate comprehensive repository index for AI systems
- **Features**:
  - Full repository structure scanning with smart file filtering
  - Semantic search index generation for keyword and pattern matching
  - Repository analysis and project type detection
  - Weekly automated updates with manual trigger option

### `diagram.yml`
- **Purpose**: Automated diagram generation for visual documentation
- **Features**:
  - IMO Architecture diagrams showing Input → Middle → Output flow
  - MCP Registry flow diagrams from configuration files
  - Dependency graphs for Python and Node.js projects
  - Multiple output formats: Mermaid, SVG, PlantUML

### `summary.yml`
- **Purpose**: Human-readable project summaries and health scoring
- **Features**:
  - IMO narrative summaries with project maturity assessment
  - ORBT format summaries (Objective/Result/Benefit/Timeline)
  - Repository health scoring and optimization recommendations
  - Daily automated updates with comprehensive analysis

## 📊 Generated Outputs

### GitIngest Files
- **`.github/generated/git-ingest.json`** - Complete repository index
- **`.github/generated/search-index.json`** - Semantic search database
- **`.github/generated/repo-summary.json`** - Technical analysis summary

### Diagram Files
- **`.github/generated/diagrams/*.mmd`** - Mermaid diagram sources
- **`.github/generated/diagrams/*.svg`** - Rendered SVG diagrams
- **`.github/generated/diagrams/*.puml`** - PlantUML sequence diagrams

### Summary Files
- **`.github/generated/summaries/NARRATIVE.md`** - Human-readable project overview
- **`.github/generated/summaries/ORBT.md`** - Structured project summary
- **`.github/generated/summaries/repository-analysis.json`** - Detailed analysis data

## 🎯 AI Integration Benefits

### For AI Systems
- **Structured Data**: JSON indexes enable semantic understanding
- **Visual Context**: Diagrams provide architectural comprehension
- **Narrative Context**: Summaries explain project purpose and status
- **Search Capability**: Semantic indexes enable targeted file discovery

### For Human Developers
- **Project Health**: Automated health scoring with improvement suggestions
- **Visual Documentation**: Auto-generated architecture and flow diagrams
- **Onboarding**: Comprehensive summaries for new team members
- **Maintenance**: Regular analysis identifies technical debt and gaps

## 🚀 Integration with IMO-Creator

These workflows automatically integrate with:

```json
{
  "doctrine_branches": {
    "ai-human-readable": {
      "git_ingest": ".github/workflows/git-ingest.yml",
      "diagram": ".github/workflows/diagram.yml",
      "summary": ".github/workflows/summary.yml"
    }
  }
}
```

## 📋 Workflow Triggers

### Automatic Triggers
- **Push to main**: Updates diagrams and summaries
- **Schedule**: Daily summaries, weekly GitIngest updates
- **File Changes**: Diagram updates on architecture file changes

### Manual Triggers
- **workflow_dispatch**: All workflows support manual execution
- **Custom Parameters**: Choose specific diagram types or summary formats
- **Force Options**: Full repository scans and complete regeneration

## 🔧 Customization

### File Filtering
- **GitIngest**: Configurable file size limits and extension filtering
- **Diagrams**: Adjustable complexity and tool selection
- **Analysis**: Customizable health scoring criteria

### Output Formats
- **Multiple Formats**: JSON, Markdown, SVG, Mermaid, PlantUML
- **Configurable Templates**: Customize narrative and ORBT formats
- **Integration Ready**: Outputs designed for documentation systems

## 📈 Usage Examples

### Including Diagrams in Documentation
```markdown
<!-- Auto-generated IMO Architecture -->
![IMO Architecture](.github/generated/diagrams/imo-architecture.svg)

<!-- Mermaid diagram in markdown -->
```mermaid
graph TB
    <!-- Content from .github/generated/diagrams/imo-architecture.mmd -->
```

### Accessing Analysis Data
```javascript
// Load repository analysis
const analysis = await fetch('/.github/generated/summaries/repository-analysis.json')
    .then(r => r.json());

// Use semantic search
const searchIndex = await fetch('/.github/generated/search-index.json')
    .then(r => r.json());
```

## 🏷️ Branch Purpose

This is a **doctrine branch** that provides foundational AI/human readability capabilities. Every IMO-Creator repository automatically inherits these analysis and documentation workflows, ensuring consistent project comprehension across the ecosystem.

## 🔄 Update Frequency

- **GitIngest**: Weekly automated, triggered by significant changes
- **Diagrams**: On architecture file changes, manual on demand
- **Summaries**: Daily automated, comprehensive project analysis
- **All**: Available for manual trigger via GitHub Actions interface