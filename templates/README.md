# 📋 IMO Project Blueprint Template

A comprehensive project planning template designed to capture project requirements at multiple altitudes and generate Whimsical visualizations.

## 🚀 Quick Start

1. **Copy the template**:
   ```bash
   cp templates/imo_project_blueprint.json my-project-blueprint.json
   ```

2. **Fill out all sections** (see guide below)

3. **Validate completeness**:
   ```bash
   # Set is_filled to true when complete
   "status_flags.is_filled": true
   ```

4. **Submit to Whimsical GPT** for diagram generation

## 📊 Altitude-Based Planning

### 🛩️ 30,000 ft - Strategic Vision
```json
"30000": {
  "project_name": "My Awesome Project",
  "objective": "Build a world-class web application that...",
  "success_criteria": [
    "Achieve 99.9% uptime",
    "Handle 10k+ concurrent users", 
    "Deploy in under 30 days"
  ],
  "stakeholders": [
    "Product Manager",
    "Engineering Team",
    "DevOps Team"
  ]
}
```

### ✈️ 20,000 ft - System Architecture
```json
"20000": {
  "components": [
    "Frontend (React/Next.js)",
    "Backend API (Node.js)",
    "Database (PostgreSQL)",
    "Cache (Redis)"
  ],
  "roles": [
    "Frontend Developer",
    "Backend Developer", 
    "DevOps Engineer"
  ],
  "stages": [
    "Planning",
    "Development",
    "Testing",
    "Deployment"
  ],
  "inputs": [
    "User requirements",
    "Design mockups",
    "API specifications"
  ],
  "outputs": [
    "Deployed application",
    "Documentation",
    "Test reports"
  ]
}
```

### 🚁 10,000 ft - Implementation Details
```json
"10000": {
  "steps": [
    "Set up development environment",
    "Create database schema",
    "Build API endpoints",
    "Implement frontend components"
  ],
  "apis_services": [
    "Authentication API",
    "Payment processing",
    "Email service",
    "File storage"
  ],
  "decision_points": [
    "Choose between SQL vs NoSQL",
    "Select deployment platform",
    "Decide on testing strategy"
  ],
  "llms": [
    "Claude for code review",
    "GPT-4 for documentation",
    "Copilot for development"
  ],
  "compliance": [
    "GDPR compliance",
    "SOC 2 Type II",
    "WCAG 2.1 AA"
  ]
}
```

### 🏃 5,000 ft - Tactical Execution
```json
"5000": {
  "documentation_plan": [
    "API documentation",
    "User guides",
    "Deployment runbooks"
  ],
  "agent_roles": {
    "claude": "Code review and optimization",
    "project_gpt": "Project planning and coordination",
    "whimsical_gpt": "Diagram generation and visualization",
    "sidecar": "Telemetry and monitoring",
    "heir": "Compliance validation"
  },
  "handoffs": [
    "Dev → QA: Feature complete",
    "QA → DevOps: Tests passing",
    "DevOps → Product: Deployed"
  ],
  "firebreak_queue": {
    "location": "GitHub Issues with 'firebreak' label",
    "policy": "Address within 24 hours"
  }
}
```

## 🏗️ Metadata Structure

### Status Flags
- `is_filled`: All required fields completed
- `is_validated`: Schema validation passed
- `is_whimsical_ready`: Ready for diagram generation

### Meta Information
- `unique_id`: Database/hive/sub/process identifier
- `process_id`: IMO process identifier
- `blueprint_version_hash`: Content hash for versioning
- `doctrine`: Compliance frameworks applied

## 🎨 Whimsical Integration

When `handoff_to_whimsical` is true, the template will generate:

### 🧠 Mind Map
- Strategic overview
- Component relationships
- Stakeholder connections

### 📊 Flowchart  
- Process flow
- Decision points
- Stage transitions

### 🤖 Agent Map
- Role assignments
- Handoff points
- Communication flows

### 📈 Sequence Diagrams
- API interactions
- User journeys
- System integrations

## 🔧 Schema Enforcement

The template enforces compliance with:
- **STAMPED**: Neon database schemas
- **SPVPET**: Firebase event tracking
- **STACKED**: BigQuery analytics

## 📝 Fill-Out Guide

### Step 1: Project Basics
```json
{
  "project_slug": "my-awesome-app",
  "created_at": "2025-01-22T12:00:00Z",
  "created_by": "Your Name"
}
```

### Step 2: High-Level Vision (30,000 ft)
- Define clear project objectives
- List measurable success criteria
- Identify all stakeholders

### Step 3: Architecture (20,000 ft)
- Break down system components
- Define team roles
- Plan project stages
- Specify inputs and outputs

### Step 4: Implementation (10,000 ft)
- List concrete steps
- Identify external services
- Plan decision points
- Choose AI/LLM tools
- Address compliance needs

### Step 5: Execution (5,000 ft)
- Create documentation plan
- Assign agent roles
- Define handoff criteria
- Set up firebreak process

### Step 6: Infrastructure
- Configure telemetry sinks
- Set up Notion integration
- Plan visual embeddings

### Step 7: Finalize
```json
{
  "status_flags": {
    "is_filled": true,
    "is_validated": false,
    "is_whimsical_ready": true
  }
}
```

## 🎯 Example Usage

```bash
# 1. Copy template
cp templates/imo_project_blueprint.json projects/my-app-blueprint.json

# 2. Fill out the template
# Edit projects/my-app-blueprint.json

# 3. Validate with factory tools
npm run factory:validate -- projects/my-app-blueprint.json

# 4. Generate diagrams
# Submit to Whimsical GPT or use visualization dashboard

# 5. Embed results
# Use generated iframe codes in your documentation
```

## 🔍 Validation Commands

```bash
# Check schema compliance
npm run factory:validate

# Generate health report  
npm run garage:scan

# Launch visualization dashboard
npm run garage:viz
```

## 🎨 Visual Outputs

Once processed by Whimsical GPT, you'll receive:

- **Live Whimsical links** for collaborative editing
- **Iframe-ready embeds** for documentation
- **PNG/SVG exports** for presentations
- **Interactive visualizations** in the garage dashboard

## 🔗 Integration Points

### Notion Workspace
- Project pages linked automatically
- Backlog boards created
- Diagram galleries embedded

### Development Tools
- GitHub integration for issue tracking
- Vercel deployment hooks
- Monitoring dashboards

### Compliance Systems
- HEIR validation reports
- ORBT compliance checks
- Telemetry event tracking

---

**Ready to build something amazing? Start with the blueprint template!** 🚀