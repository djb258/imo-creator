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

---

## 📦 Workbench System (Global Doctrine)

The Workbench system provides a standardized pipeline for data enrichment, diffing, and validator integration across all IMO-Creator repositories.

### Architecture

```
Backblaze B2 → DuckDB → Enrichment → Diff Engine → Validator
```

The Workbench module enables:
- **Cloud Storage**: Backblaze B2 for persistent DuckDB storage
- **Local Processing**: DuckDB for high-performance data analysis
- **Neon Integration**: Pull data from PostgreSQL for enrichment
- **Delta Generation**: Diff engine to identify changes
- **Validator Updates**: Send deltas to validator endpoint

### Why Workbench is Part of Global Doctrine

The Workbench system is inherited by all child repositories to ensure:
- **Consistent data pipelines** across all IMO projects
- **Standardized enrichment workflows** for data validation
- **Reusable infrastructure** for cloud storage and local processing
- **Compliance with CTB standards** for data operations

### Setup Instructions

1. **Copy environment template**:
   ```bash
   cp .env.template .env
   ```

2. **Configure environment variables** in `.env`:
   ```bash
   # Backblaze B2 Configuration
   B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
   B2_KEY_ID=your_key_id_here
   B2_APPLICATION_KEY=your_application_key_here
   B2_BUCKET=your_bucket_name

   # Neon PostgreSQL
   POSTGRES_URL=postgresql://user:pass@host/db

   # Validator Endpoint
   VALIDATOR_ENDPOINT=https://your-validator.com/api/deltas
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run bootstrap validation**:
   ```bash
   python workbench/bootstrap.py
   ```

   This will:
   - Validate Backblaze B2 connectivity
   - Download `workbench.duckdb` from B2
   - Test DuckDB connection
   - Confirm all modules are working

### Module Overview

| Module | Purpose |
|--------|---------|
| `b2_client.py` | S3-compatible Backblaze B2 client |
| `load_duckdb.py` | Download DuckDB from B2 to local temp |
| `save_duckdb.py` | Upload modified DuckDB back to B2 |
| `neon_pull.py` | Pull table data from Neon PostgreSQL |
| `run_diff.py` | Diff engine (placeholder) |
| `apply_deltas.py` | Send deltas to validator endpoint |
| `bootstrap.py` | Validation and setup script |

### Security Best Practices

⚠️ **NEVER commit real secrets to source control**

- Real credentials go in `.env` (gitignored)
- `.env.template` contains placeholders only
- Use environment variables for all sensitive data
- Rotate keys regularly and use least-privilege access

### Usage Example

```python
from workbench import get_b2_client, load_workbench, save_workbench, pull_table

# Load DuckDB from Backblaze B2
db, db_path = load_workbench()

# Pull data from Neon
neon_data = pull_table('your_table_name')

# Perform enrichment operations
db.execute("CREATE TABLE IF NOT EXISTS enriched AS SELECT * FROM neon_data")

# Save back to B2
save_workbench(db_path)
```

### Integration with Global Config

The Workbench configuration in `imo-creator/global-config.yaml`:

```yaml
workbench:
  module_path: workbench
  duckdb_path: workbench/workbench.duckdb
  b2_keys_required: true
  uses_neon: true
  inherits_env: true
  description: "Workbench: Backblaze B2 + DuckDB integration for enrichment, diffing, and validator deltas."
```

This ensures every child repo inherits the Workbench module and knows where to find it.

### Troubleshooting

**Issue**: `boto3` connection errors
**Solution**: Verify `B2_ENDPOINT` matches your Backblaze region (e.g., `s3.us-west-004.backblazeb2.com`)

**Issue**: DuckDB file not found
**Solution**: Run `bootstrap.py` to download from B2, or it will create a new local file

**Issue**: PostgreSQL connection timeout
**Solution**: Check `POSTGRES_URL` format and Neon database status

For detailed logs, check the bootstrap output when running `python workbench/bootstrap.py`.