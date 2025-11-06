# Eraser Diagrams for IMO-Creator

This directory contains [Eraser.io](https://eraser.io) diagrams for visualizing the IMO-Creator architecture.

## 📁 Available Diagrams

### 1. `imo-creator-architecture.eraser`
**Overview**: Complete system architecture showing all major components and their interactions.

**Components:**
- User interface
- FastAPI server (Render deployment)
- Composio MCP server (Port 3001)
- Firebase database
- Neon PostgreSQL database
- Google Workspace integration (Gmail, Drive, Calendar, Sheets)

**Use Case**: Understanding the overall system flow and component relationships.

---

### 2. `ctb-structure.eraser`
**Overview**: Christmas Tree Backbone (CTB) repository structure and role-based abstraction.

**Components:**
- Altitude layers (40k, 20k, 10k, 5k, Ground)
- Functional roles (AI_ENGINE, WORKBENCH_DB, VAULT_DB, INTEGRATION_BRIDGE)
- Driver manifests (vendor-agnostic interfaces)
- Supported drivers (Gemini, Claude, GPT, Firebase, MongoDB, PostgreSQL)

**Use Case**: Understanding CTB architecture, altitude-based organization, and driver abstraction.

---

### 3. `composio-integration-flow.eraser`
**Overview**: Detailed flow of how Composio MCP integration works with HEIR/ORBT payload format.

**Components:**
- Client request flow (7 steps)
- MCP server validation
- Composio API calls
- Google API execution
- HEIR/ORBT payload structure
- Error handling

**Use Case**: Understanding the MCP integration pattern and Barton Doctrine compliance.

---

## 🚀 How to Use Eraser Diagrams

### Method 1: VS Code Extension (Recommended)

The Eraser VS Code extension (`eraserlabs.eraserlabs`) is already installed.

**Steps:**

1. **Open a diagram file**:
   ```bash
   # In VS Code, open any .eraser file
   code docs/diagrams/eraser/imo-creator-architecture.eraser
   ```

2. **View the diagram**:
   - Click the **"Open in Eraser"** button in the top-right corner of the editor
   - OR use the command palette (`Ctrl+Shift+P`) → "Eraser: Open Diagram"

3. **Edit the diagram**:
   - Modify the `.eraser` file text (diagram-as-code)
   - The visual diagram updates automatically
   - Changes sync between VS Code and Eraser.io web app

4. **Export the diagram**:
   - Use Eraser.io web interface to export as PNG, SVG, or PDF
   - OR use the VS Code extension export feature

---

### Method 2: Eraser.io Web App

1. **Visit**: https://app.eraser.io
2. **Sign in** with your account
3. **Import diagram**:
   - Click "Import" → Upload `.eraser` file
   - OR paste the diagram code directly
4. **Edit** using the visual editor or code editor
5. **Export** in multiple formats (PNG, SVG, PDF)

---

### Method 3: Diagram-as-Code (Text Editing)

You can edit `.eraser` files directly as text:

```eraser
// Simple example
title My Diagram

ComponentA [icon: server, color: blue]
ComponentB [icon: database, color: green]

ComponentA > ComponentB: Data flow

note right of ComponentA: This is a note
```

**Syntax Elements:**

- **Components**: `Name [icon: type, color: value, label: "Display Name"]`
- **Connections**: `ComponentA > ComponentB: Label`
- **Bidirectional**: `ComponentA <> ComponentB: Two-way`
- **Groups**: `group "Name" { ... }`
- **Notes**: `note position of Component: Text`
- **Icons**: server, database, cloud, user, email, folder, calendar, table, brain, lock, bridge, tools, alert, google, etc.
- **Colors**: blue, green, red, purple, orange, teal, yellow, gray, etc.

---

## 🎨 Eraser Diagram Syntax Quick Reference

### Basic Components
```eraser
// Define a component
Server [icon: server, color: blue, label: "API Server"]

// Component with default settings
Database
```

### Connections
```eraser
// One-way connection
A > B: Request

// Two-way connection
A <> B: Sync

// Chained connections
A > B > C: Flow
```

### Groups
```eraser
group "Backend Services" {
  API
  Database
  Cache
}
```

### Notes
```eraser
note right of Component: This is a note
note left of Component: Another note
note top of Component: Top note
note bottom of Component: Bottom note
```

### Advanced Features
```eraser
// Decision node
decision [label: "Is valid?", color: yellow]
A > decision: Check
decision > B: Yes
decision > C: No

// Error handling
error [icon: alert, color: red]
Process > error: On failure
```

---

## 🔄 Integration with IMO-Creator

### Recommended Workflow

1. **Document new features**: Create Eraser diagrams before implementation
2. **Update existing diagrams**: Keep diagrams in sync with code changes
3. **Use in documentation**: Export diagrams as images for README files
4. **Include in PRs**: Add relevant diagrams to pull requests
5. **Track in GitHub Projects**: Link diagrams to issues/PRs

### CTB Integration

Eraser diagrams can be added to:
- **CTB documentation**: `docs/ctb/`
- **System manuals**: `ctb-template/manual/`
- **Architecture docs**: `docs/architecture/`
- **GitHub Issues**: Export and attach to feature requests

---

## 📊 Example Use Cases

### 1. Document a New Integration
```eraser
title New Slack Integration

SlackAPI [icon: slack, color: purple]
ComposioMCP [icon: server, color: blue]
IMOCreator [icon: app, color: green]

IMOCreator > ComposioMCP: MCP Request
ComposioMCP > SlackAPI: Send message
SlackAPI > ComposioMCP: Success
ComposioMCP > IMOCreator: Result
```

### 2. Visualize Data Flow
```eraser
title User Registration Flow

User [icon: user]
API [icon: server]
Workbench [icon: database, label: Workbench DB]
Vault [icon: lock, label: Vault DB]
Gatekeeper [icon: shield]

User > API: Register
API > Workbench: Store temp data
API > Gatekeeper: Validate
Gatekeeper > Vault: Store securely
Vault > API: Success
API > User: Confirmation
```

### 3. Map CTB Altitude
```eraser
title CTB Altitude Mapping

Strategic [label: 40k ft, color: blue]
Architecture [label: 20k ft, color: green]
Implementation [label: 10k ft, color: yellow]
Data [label: 5k ft, color: orange]
Operations [label: Ground, color: red]

Strategic > Architecture: Vision
Architecture > Implementation: Design
Implementation > Data: Code
Data > Operations: Deploy
```

---

## 🛠️ Tips & Tricks

1. **Live Preview**: Open Eraser.io web app alongside VS Code for real-time visual updates
2. **Version Control**: `.eraser` files are text-based, perfect for Git tracking
3. **Collaboration**: Share diagram links with team members
4. **Export Options**: Export as PNG for documentation, SVG for scalability
5. **Templates**: Create reusable diagram templates for common patterns

---

## 📚 Additional Resources

- **Eraser.io Docs**: https://docs.eraser.io
- **Syntax Guide**: https://docs.eraser.io/docs/diagram-as-code
- **VS Code Extension**: https://marketplace.visualstudio.com/items?itemName=eraserlabs.eraserlabs
- **Community Examples**: https://app.eraser.io/explore

---

## 🔄 Next Steps

1. Open `imo-creator-architecture.eraser` in VS Code
2. Click "Open in Eraser" to see the visual diagram
3. Edit the text to customize the diagram
4. Export as PNG and add to project README
5. Create your own diagrams for new features!

---

**Created**: 2025-11-06
**IMO-Creator Version**: v1.3.1+
**Eraser Version**: Latest
