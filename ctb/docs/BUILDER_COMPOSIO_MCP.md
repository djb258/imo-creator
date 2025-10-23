# 🎨 Builder.io via Composio MCP - IMO Calculator

## 🚨 CRITICAL ARCHITECTURE RULE

**ALL BUILDER.IO API CALLS MUST GO THROUGH COMPOSIO MCP SERVER - NO EXCEPTIONS**

This document supersedes `BUILDER_IO_INTEGRATION.md` with the correct architecture using Composio MCP on port 3001.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VSCode Builder.io Extension              │
│                   (Visual Editing in Editor)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Composio MCP Server                      │
│                      (Port 3001)                            │
│                                                             │
│  Available Builder.io Tools:                                │
│  - BUILDER_CREATE_CONTENT                                   │
│  - BUILDER_UPDATE_CONTENT                                   │
│  - BUILDER_GET_CONTENT                                      │
│  - BUILDER_DELETE_CONTENT                                   │
│  - BUILDER_PUBLISH_CONTENT                                  │
│  - BUILDER_LIST_MODELS                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    React Components                         │
│              (Registered with Builder.io)                   │
│  - Factfinder Form                                          │
│  - Dashboard Layout                                         │
│  - Sniper Marketing                                         │
│  - Chart Components                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Firestore Collections                    │
│           (System of Record - Schema Locked)                │
│  /factfinder/{prospect_id}                                  │
│  /montecarlo/{prospect_id}                                  │
│  /insurance_split/{prospect_id}                             │
│  /compliance/{prospect_id}                                  │
│  /savings_scenarios/{prospect_id}                           │
│  /sniper_marketing/{prospect_id}                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Firebase Cloud Functions                   │
│                  (Calculation Engines - LOCKED)             │
│  - Monte Carlo (10k iterations)                             │
│  - Insurance Split (10/85 rule)                             │
│  - Compliance Matcher                                       │
│  - Savings Vehicle                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Setup: Composio MCP Integration

### 1. Start Composio MCP Server (MANDATORY)

```bash
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\imo-creator\mcp-servers\composio-mcp"
node server.js
```

**Verify it's running**:
```bash
curl http://localhost:3001/mcp/health
```

Expected response:
```json
{
  "status": "ok",
  "composio": "connected"
}
```

### 2. Check Builder.io Connection

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "manage_connected_account",
    "data": {
      "action": "list"
    },
    "unique_id": "HEIR-2025-10-CALC-BUILDER-01",
    "process_id": "PRC-CALC-BUILDER-001",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

Look for Builder.io in the connected accounts list.

### 3. VSCode Builder.io Extension

The Builder.io extension in VSCode connects to the Composio MCP server automatically.

**Extension Features**:
- Live preview of Builder.io pages
- Inline editing of component props
- Direct content sync with Builder.io
- Component registration helper

---

## 📋 Builder.io Operations via Composio MCP

### HEIR/ORBT Payload Format

All Builder.io API calls use this format:

```json
{
  "tool": "BUILDER_<OPERATION>",
  "data": {
    // Operation-specific data
  },
  "unique_id": "HEIR-2025-10-CALC-<OPERATION>-<SEQ>",
  "process_id": "PRC-CALC-<TIMESTAMP>",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

---

## 🔧 Common Operations

### 1. Create Builder.io Page (Dashboard)

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_CREATE_CONTENT",
    "data": {
      "model": "page",
      "name": "IMO Dashboard",
      "data": {
        "url": "/dashboard/:prospectId",
        "blocks": [
          {
            "id": "dashboard-main",
            "component": {
              "name": "Dashboard Layout",
              "options": {
                "prospectId": "{{state.prospectId}}",
                "defaultTab": "factfinder",
                "colors": {
                  "primary": "#3b82f6",
                  "accent": "#8b5cf6"
                }
              }
            }
          }
        ],
        "state": {
          "prospectId": {
            "type": "string",
            "default": ""
          }
        }
      },
      "published": false
    },
    "unique_id": "HEIR-2025-10-CALC-CREATE-PAGE-01",
    "process_id": "PRC-CALC-'$(date +%s)'",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

### 2. Get Builder.io Content

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_GET_CONTENT",
    "data": {
      "model": "page",
      "url": "/dashboard/:prospectId"
    },
    "unique_id": "HEIR-2025-10-CALC-GET-PAGE-01",
    "process_id": "PRC-CALC-'$(date +%s)'",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

### 3. Update Builder.io Content (Change Colors)

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_UPDATE_CONTENT",
    "data": {
      "model": "page",
      "id": "page-id-here",
      "data": {
        "blocks": [
          {
            "id": "dashboard-main",
            "component": {
              "name": "Dashboard Layout",
              "options": {
                "colors": {
                  "primary": "#8b5cf6",
                  "accent": "#ec4899"
                }
              }
            }
          }
        ]
      }
    },
    "unique_id": "HEIR-2025-10-CALC-UPDATE-PAGE-01",
    "process_id": "PRC-CALC-'$(date +%s)'",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

### 4. Publish Builder.io Content

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_PUBLISH_CONTENT",
    "data": {
      "model": "page",
      "id": "page-id-here"
    },
    "unique_id": "HEIR-2025-10-CALC-PUBLISH-PAGE-01",
    "process_id": "PRC-CALC-'$(date +%s)'",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

### 5. List Builder.io Models

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_LIST_MODELS",
    "data": {},
    "unique_id": "HEIR-2025-10-CALC-LIST-MODELS-01",
    "process_id": "PRC-CALC-'$(date +%s)'",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

---

## 🎨 VSCode Builder.io Extension Workflow

### Setup in VSCode

1. **Install Extension**: Builder.io extension should already be installed
2. **Configure MCP URL**: Extension auto-detects Composio MCP on port 3001
3. **Authenticate**: Extension uses Composio MCP credentials

### Editing Workflow

#### Scenario 1: Edit Dashboard Colors

**In VSCode**:
1. Open `src/components/DashboardEnhanced.tsx`
2. Right-click component → "Edit in Builder.io"
3. VSCode opens Builder.io panel
4. Change colors in visual editor
5. Click "Save" → Extension calls Composio MCP → Updates Builder.io

**Behind the scenes**:
```javascript
// VSCode Extension makes this call to Composio MCP
fetch('http://localhost:3001/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'BUILDER_UPDATE_CONTENT',
    data: {
      model: 'page',
      id: 'dashboard-page-id',
      data: {
        blocks: [/* updated blocks with new colors */]
      }
    },
    unique_id: 'HEIR-2025-10-VSCODE-UPDATE-01',
    process_id: 'PRC-VSCODE-' + Date.now(),
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

#### Scenario 2: Add New Component

**In VSCode**:
1. Create component: `src/components/MyCustomCard.tsx`
2. Register with Builder.io: Add to `src/builder/builder-components.tsx`
3. Right-click file → "Register Component with Builder.io"
4. Extension calls Composio MCP to register
5. Component now available in Builder.io visual editor

#### Scenario 3: Preview Live Changes

**In VSCode**:
1. Open `src/builder/page-templates.json`
2. Edit template (e.g., change CTA text)
3. VSCode extension shows live preview
4. Click "Sync to Builder.io"
5. Extension calls Composio MCP → Updates live page

---

## 🔒 Programmatic Access (Node.js)

### Helper Module

Create `src/builder/composio-builder.ts`:

```typescript
/**
 * Builder.io operations via Composio MCP
 * ALL operations go through MCP server on port 3001
 */

const MCP_URL = process.env.IMOCREATOR_MCP_URL || 'http://localhost:3001';

interface MCPPayload {
  tool: string;
  data: Record<string, any>;
  unique_id: string;
  process_id: string;
  orbt_layer: number;
  blueprint_version: string;
}

async function callComposioMCP(payload: MCPPayload) {
  const response = await fetch(`${MCP_URL}/tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`MCP call failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create Builder.io page via Composio MCP
 */
export async function createBuilderPage(
  name: string,
  url: string,
  blocks: any[]
) {
  return callComposioMCP({
    tool: 'BUILDER_CREATE_CONTENT',
    data: {
      model: 'page',
      name,
      data: { url, blocks },
      published: false,
    },
    unique_id: `HEIR-2025-10-CALC-CREATE-${Date.now()}`,
    process_id: `PRC-CALC-${Date.now()}`,
    orbt_layer: 2,
    blueprint_version: '1.0',
  });
}

/**
 * Update Builder.io content via Composio MCP
 */
export async function updateBuilderContent(
  model: string,
  id: string,
  data: any
) {
  return callComposioMCP({
    tool: 'BUILDER_UPDATE_CONTENT',
    data: { model, id, data },
    unique_id: `HEIR-2025-10-CALC-UPDATE-${Date.now()}`,
    process_id: `PRC-CALC-${Date.now()}`,
    orbt_layer: 2,
    blueprint_version: '1.0',
  });
}

/**
 * Get Builder.io content via Composio MCP
 */
export async function getBuilderContent(model: string, url: string) {
  return callComposioMCP({
    tool: 'BUILDER_GET_CONTENT',
    data: { model, url },
    unique_id: `HEIR-2025-10-CALC-GET-${Date.now()}`,
    process_id: `PRC-CALC-${Date.now()}`,
    orbt_layer: 2,
    blueprint_version: '1.0',
  });
}

/**
 * Publish Builder.io content via Composio MCP
 */
export async function publishBuilderContent(model: string, id: string) {
  return callComposioMCP({
    tool: 'BUILDER_PUBLISH_CONTENT',
    data: { model, id },
    unique_id: `HEIR-2025-10-CALC-PUBLISH-${Date.now()}`,
    process_id: `PRC-CALC-${Date.now()}`,
    orbt_layer: 2,
    blueprint_version: '1.0',
  });
}

/**
 * List Builder.io models via Composio MCP
 */
export async function listBuilderModels() {
  return callComposioMCP({
    tool: 'BUILDER_LIST_MODELS',
    data: {},
    unique_id: `HEIR-2025-10-CALC-LIST-${Date.now()}`,
    process_id: `PRC-CALC-${Date.now()}`,
    orbt_layer: 2,
    blueprint_version: '1.0',
  });
}
```

### Usage Example

```typescript
import {
  createBuilderPage,
  updateBuilderContent,
  publishBuilderContent,
} from '@/builder/composio-builder';

// Create new dashboard page
const page = await createBuilderPage(
  'Custom Dashboard',
  '/dashboard/:prospectId',
  [
    {
      id: 'dashboard-1',
      component: {
        name: 'Dashboard Layout',
        options: {
          prospectId: '{{state.prospectId}}',
          colors: { primary: '#8b5cf6' },
        },
      },
    },
  ]
);

console.log('Created page:', page.id);

// Update page colors
await updateBuilderContent('page', page.id, {
  blocks: [
    {
      id: 'dashboard-1',
      component: {
        options: {
          colors: { primary: '#ec4899' },
        },
      },
    },
  ],
});

// Publish changes
await publishBuilderContent('page', page.id);
```

---

## 🚨 NEVER DO THESE THINGS

❌ **NEVER** use Builder.io SDK directly:
```typescript
// ❌ WRONG - Bypasses Composio MCP
import { Builder } from '@builder.io/react';
Builder.init(API_KEY);
const content = await Builder.get('page', { url }).promise();
```

✅ **ALWAYS** use Composio MCP:
```typescript
// ✅ CORRECT - Goes through MCP
import { getBuilderContent } from '@/builder/composio-builder';
const content = await getBuilderContent('page', url);
```

---

❌ **NEVER** hardcode Builder.io API keys:
```bash
# ❌ WRONG
VITE_BUILDER_API_KEY=your-api-key-here
```

✅ **ALWAYS** use Composio MCP URL:
```bash
# ✅ CORRECT
IMOCREATOR_MCP_URL=http://localhost:3001
```

---

❌ **NEVER** skip HEIR/ORBT payload format:
```typescript
// ❌ WRONG
fetch('http://localhost:3001/tool', {
  body: JSON.stringify({
    tool: 'BUILDER_GET_CONTENT',
    data: { model: 'page', url: '/dashboard' }
  })
});
```

✅ **ALWAYS** include full HEIR/ORBT metadata:
```typescript
// ✅ CORRECT
fetch('http://localhost:3001/tool', {
  body: JSON.stringify({
    tool: 'BUILDER_GET_CONTENT',
    data: { model: 'page', url: '/dashboard' },
    unique_id: 'HEIR-2025-10-CALC-GET-01',
    process_id: 'PRC-CALC-' + Date.now(),
    orbt_layer: 2,
    blueprint_version: '1.0'
  })
});
```

---

## 📁 Updated File Structure

```
calculator-app/
├── src/
│   ├── builder/
│   │   ├── composio-builder.ts         ✅ MCP helper functions
│   │   ├── builder-components.tsx      📝 Component registration (local)
│   │   └── page-templates.json         📋 Templates for MCP operations
│   ├── hooks/
│   │   └── useFirestoreDoc.ts          🔥 Firestore hooks (unchanged)
│   ├── schemas/
│   │   └── firestore.ts                ✅ Zod validation (unchanged)
│   └── components/
│       └── ...                          📦 React components
├── .env
│   └── IMOCREATOR_MCP_URL=http://localhost:3001
├── BUILDER_COMPOSIO_MCP.md             📖 This file (replaces BUILDER_IO_INTEGRATION.md)
└── COMPOSIO_INTEGRATION.md             🚨 Parent MCP architecture doc
```

---

## 🔄 Integration with Sales Process IMO

This calculator app is part of the larger `sales-process-imo` repo.

**Parent Architecture**:
- All external APIs → Composio MCP (Gmail, Drive, Sheets, Builder.io)
- See `../../COMPOSIO_INTEGRATION.md` for full details

**Builder.io in Sales Context**:
- Create custom dashboard pages per prospect
- Dynamic CTA buttons linking to sales actions
- A/B test different dashboard layouts
- Track engagement via Builder.io analytics

---

## 🧪 Testing Composio MCP Integration

### 1. Verify MCP Server is Running

```bash
curl http://localhost:3001/mcp/health
```

Expected: `{"status": "ok"}`

### 2. Test Builder.io Connection

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_LIST_MODELS",
    "data": {},
    "unique_id": "HEIR-2025-10-TEST-01",
    "process_id": "PRC-TEST-001",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

Expected: List of Builder.io models (page, section, symbol, etc.)

### 3. Create Test Page

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "BUILDER_CREATE_CONTENT",
    "data": {
      "model": "page",
      "name": "Test Page",
      "data": {
        "url": "/test",
        "blocks": []
      }
    },
    "unique_id": "HEIR-2025-10-TEST-CREATE-01",
    "process_id": "PRC-TEST-002",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

Expected: Returns page ID

### 4. Test VSCode Extension

1. Open VSCode in `calculator-app`
2. Open `src/components/DashboardEnhanced.tsx`
3. Right-click → "Builder.io: Preview Component"
4. Extension should connect to MCP server
5. Preview panel should load

---

## 📚 Additional Resources

### Documentation
- **Parent MCP Doc**: `../../COMPOSIO_INTEGRATION.md`
- **Sales Process**: `../../CLAUDE.md`
- **Engine Logic**: `ENGINE_README.md`
- **PDF Export**: `PDF_EXPORT_README.md`

### Composio MCP
- **Server Location**: `C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\imo-creator\mcp-servers\composio-mcp`
- **Start Command**: `node server.js`
- **Port**: 3001
- **Health Check**: `http://localhost:3001/mcp/health`

### Builder.io Tools Available
- `BUILDER_CREATE_CONTENT` - Create new pages/sections
- `BUILDER_UPDATE_CONTENT` - Update existing content
- `BUILDER_GET_CONTENT` - Fetch content by URL
- `BUILDER_DELETE_CONTENT` - Delete content
- `BUILDER_PUBLISH_CONTENT` - Publish draft content
- `BUILDER_LIST_MODELS` - List available models

---

## ✅ Checklist: Composio MCP + Builder.io

Before using Builder.io in the IMO Calculator:

- [ ] Composio MCP server is running on port 3001
- [ ] `IMOCREATOR_MCP_URL` is set in `.env`
- [ ] Builder.io is connected in Composio (check `manage_connected_account`)
- [ ] VSCode Builder.io extension is installed
- [ ] All API calls use HEIR/ORBT payload format
- [ ] No direct Builder.io SDK usage (no `@builder.io/react` API calls)
- [ ] Components registered locally in `builder-components.tsx`
- [ ] Page templates ready in `page-templates.json`

---

**Status**: ✅ Composio MCP Integration Complete
**Last Updated**: 2025-10-01
**Architecture**: Builder.io → Composio MCP (port 3001) → React Components → Firestore → Cloud Functions
**Critical Rule**: ALL Builder.io operations MUST go through Composio MCP - NO EXCEPTIONS
