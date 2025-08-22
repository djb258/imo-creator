# 🎄 IMO Factory + Garage Visualization Dashboard

A Christmas tree-style flow visualization dashboard for HEIR/ORBT compliant Factory + Garage systems.

## 🚀 Quick Start

```bash
# Install dependencies and launch visualization dashboard
pnpm garage:viz

# Or run individual commands
cd garage/viz
pnpm install
pnpm dev
```

Dashboard will be available at: http://localhost:3001

## 🎯 Features

### 🌲 Christmas Tree Layout
- **Root at Top**: Entrypoint page positioned as the "star" of the tree
- **Hierarchical Flow**: Pages arranged in tree branches below the entrypoint  
- **Ornament Gatekeepers**: Gatekeepers positioned as decorative elements
- **Animated Connections**: Selected nodes highlight their connections with flowing edges

### 🎨 Color-Coded Health Status

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 **Green** | `pass` | All checks passing, healthy |
| 🟡 **Yellow** | `warn` | Some warnings, but functional |
| 🔴 **Red** | `fail` | Critical issues, requires attention |

### 📊 Interactive Sidebar

- **Pages Section**: Shows all flow pages with health indicators
- **Gatekeepers Section**: Lists all gatekeepers and their enforcement status
- **Health Checks**: Displays system-wide health check results
- **Selected Node Detail**: Click any node to see detailed information

### 📈 Telemetry Heat Map

- **Runtime Overlay**: Toggle to show real-time failure patterns
- **Edge Opacity**: Failing edges appear darker/more prominent
- **Heat Levels**: 0-10 scale based on failure frequency
- **Live Data**: Reads from `/logs/telemetry.jsonl`

### 🗺️ Mermaid Fallback

- **Static Diagrams**: Fallback when React Flow is not available
- **Export Function**: Copy Mermaid syntax to clipboard
- **Auto-Generation**: Creates diagrams from `flow.json` + `health.json`
- **Dark Theme**: Optimized for dark mode visualization

## 📋 Commands

```bash
# Launch visualization dashboard (installs deps if needed)
pnpm garage:viz

# Refresh health.json from static checks
pnpm garage:scan  

# Build production version
pnpm garage:viz:build

# Start production server
pnpm garage:viz:start
```

## 📁 Data Sources

The dashboard reads from these files:

### Required Files
- `/docs/imo-spec/flow.json` - Flow specification with pages and gatekeepers
- `/health.json` - Health status from garage scan operations

### Optional Files  
- `/docs/imo-spec/diagram.mmd` - Pre-generated Mermaid diagram
- `/logs/telemetry.jsonl` - Telemetry events for heat map overlay

### Sample Data
If files are missing, the dashboard uses built-in sample data for demonstration.

## 🔧 Flow Specification Format

```json
{
  "schema_version": "HEIR/1.0",
  "vin": "IMO-2025-01-FACTORY-GARAGE-V1", 
  "flow": {
    "entrypoint": "overview",
    "pages": {
      "overview": {
        "id": "overview",
        "title": "Blueprint Overview",
        "type": "dashboard",
        "guards": ["auth", "health_check"],
        "validators": ["manifest_present", "progress_valid"],
        "next": ["input", "middle", "output"],
        "telemetry": { "events": ["page_view"], "required": true }
      }
    },
    "gatekeepers": {
      "input_gate": {
        "type": "validator",
        "rules": ["schema_congruence", "vin_format"],
        "enforcement": "strict"
      }
    }
  }
}
```

## 🏥 Health Status Format

```json
{
  "overall": "pass|warn|fail",
  "timestamp": "2025-01-22T12:00:00Z",
  "checks": {
    "vin_format": { "status": "pass", "message": "..." },
    "gatekeeper_input_gate": { "status": "warn", "message": "..." }
  },
  "pages": {
    "overview": {
      "status": "pass",
      "guards_status": "pass", 
      "validators_status": "pass",
      "telemetry_status": "pass",
      "issues": []
    }
  }
}
```

## 📊 Telemetry Event Format

```json
{"timestamp": "2025-01-22T11:55:00Z", "event_type": "flow_start", "page_id": "overview", "success": true, "session_id": "session-123"}
{"timestamp": "2025-01-22T11:55:01Z", "event_type": "page_enter", "page_id": "overview", "success": true, "duration_ms": 120}
{"timestamp": "2025-01-22T11:55:02Z", "event_type": "guard_result", "gatekeeper_id": "input_gate", "success": false, "error": "Schema validation failed"}
```

### Event Types
- `flow_start` / `flow_complete` - Flow lifecycle
- `page_enter` / `page_exit` - Page transitions  
- `guard_result` - Gatekeeper validation results
- `validation_result` - Page validator results
- `error_occurred` - Error events

## 🎮 User Interface

### Main Views
- **Flow View**: Interactive React Flow diagram with Christmas tree layout
- **Mermaid View**: Static Mermaid diagram with export functionality

### Controls
- **Refresh Button**: Reload all data sources
- **Telemetry Toggle**: Show/hide heat map overlay
- **Node Selection**: Click nodes to highlight connections and show details
- **Export Button**: Copy Mermaid diagram syntax

### Navigation
- **Sidebar Sections**: Collapsible sections for pages, gatekeepers, health
- **Search/Filter**: Filter nodes by status or type
- **Zoom Controls**: Pan and zoom the diagram area

## 🔍 Troubleshooting

### Data Not Loading
1. Check that `/docs/imo-spec/flow.json` exists and is valid JSON
2. Run `pnpm garage:scan` to generate fresh `health.json`
3. Check browser console for API errors

### Visualization Issues
1. Clear browser cache and reload
2. Check that all required dependencies are installed
3. Verify Node.js version >= 18.0.0

### Performance Issues  
1. Disable telemetry heat map if lag occurs
2. Limit telemetry.jsonl file size (< 10MB recommended)
3. Use Mermaid view for better performance on large flows

## 🛠️ Development

### Local Development
```bash
cd garage/viz
pnpm install
pnpm dev
```

### Build for Production
```bash
cd garage/viz  
pnpm build
pnpm start
```

### Tech Stack
- **Next.js 14** - React framework
- **React Flow** - Interactive flow diagrams
- **Mermaid** - Static diagram generation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **TypeScript** - Type safety

## 📈 Extending the Dashboard

### Adding New Node Types
1. Create component in `/src/components/`
2. Register in `nodeTypes` object in `FlowViz.tsx`
3. Update type definitions in `/src/types/index.ts`

### Custom Health Checks
1. Add check logic to garage scan scripts
2. Update health status format
3. Add corresponding UI in sidebar

### Additional Telemetry Events
1. Update event type definitions
2. Add parsing logic in `telemetry-analyzer.ts`
3. Update heat map visualization

---

## 🎄 Christmas Tree Visualization Legend

```
      ⭐ overview (entrypoint)
     /   |   \
    📄   📄   📄  (pages: input, middle, output)
   /     |     \
  🚪    🚪    🚪  (gatekeepers)
 🎄     🎄    🎄   (ornaments/decorations)

Colors:
🟢 Green ornaments = Healthy (pass)
🟡 Yellow ornaments = Warning (warn)  
🔴 Red ornaments = Critical (fail)
```

**Happy Visualizing! 🎅**