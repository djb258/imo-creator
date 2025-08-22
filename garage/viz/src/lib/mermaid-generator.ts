import { FlowSpec, HealthStatus } from '../types'

export function generateMermaidDiagram(flowSpec: FlowSpec, health?: HealthStatus): string {
  const lines = [
    'flowchart TB',
    '    %% HEIR/ORBT Compliant Flow Diagram',
    '    %% Generated from flow.json',
    '',
    '    %% Styles',
    '    classDef pageNode fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000;',
    '    classDef gateNode fill:#fff3e0,stroke:#e65100,stroke-width:3px,color:#000;',
    '    classDef entryNode fill:#c8e6c9,stroke:#1b5e20,stroke-width:3px,color:#000;',
    '    classDef passNode fill:#c8e6c9,stroke:#10b981,stroke-width:2px,color:#000;',
    '    classDef warnNode fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#000;',
    '    classDef failNode fill:#fecaca,stroke:#ef4444,stroke-width:2px,color:#000;',
    ''
  ]

  // Add page nodes with health status
  Object.entries(flowSpec.flow.pages).forEach(([pageId, pageSpec]) => {
    const isEntry = pageId === flowSpec.flow.entrypoint
    const pageHealth = health?.pages[pageId]
    const status = pageHealth?.status || 'fail'
    
    const nodeStyle = isEntry ? 'entryNode' : 
                     status === 'pass' ? 'passNode' :
                     status === 'warn' ? 'warnNode' : 'failNode'
    
    const label = pageSpec.title.replace(/['"]/g, '')
    const nodeType = isEntry ? '[🚀 Entry]' : '[📄 Page]'
    
    lines.push(`    ${pageId}["${label}\\n${nodeType}\\n[${pageSpec.type}]"]:::${nodeStyle}`)
    
    // Add guards and validators as decorative elements
    if (pageSpec.guards.length > 0) {
      lines.push(`    ${pageId}_guards{{"Guards: ${pageSpec.guards.slice(0, 2).join(', ')}"}}`)
      lines.push(`    ${pageId}_guards -.-> ${pageId}`)
    }
    
    if (pageSpec.validators.length > 0) {
      lines.push(`    ${pageId}_validators{{"Validators: ${pageSpec.validators.slice(0, 2).join(', ')}"}}`)
      lines.push(`    ${pageId}_validators -.-> ${pageId}`)
    }
  })

  lines.push('')

  // Add gatekeeper nodes
  Object.entries(flowSpec.flow.gatekeepers).forEach(([gatekeeperId, gatekeeperSpec]) => {
    const gatekeeperHealth = health?.checks[`gatekeeper_${gatekeeperId}`]
    const status = gatekeeperHealth?.status || 'fail'
    
    const nodeStyle = status === 'pass' ? 'passNode' :
                     status === 'warn' ? 'warnNode' : 'failNode'
    
    lines.push(`    ${gatekeeperId}[["🚪 ${gatekeeperId}\\n[${gatekeeperSpec.type}]\\nEnforcement: ${gatekeeperSpec.enforcement}"]]:::${nodeStyle}`)
    
    if (gatekeeperSpec.rules.length > 0) {
      lines.push(`    ${gatekeeperId}_rules{{"Rules:\\n${gatekeeperSpec.rules.join('\\n')}"}}`)
      lines.push(`    ${gatekeeperId}_rules -.-> ${gatekeeperId}`)
    }
  })

  lines.push('')
  lines.push('    %% Connections')

  // Add connections between pages
  Object.entries(flowSpec.flow.pages).forEach(([pageId, pageSpec]) => {
    if (pageSpec.next) {
      pageSpec.next.forEach(nextPageId => {
        lines.push(`    ${pageId} --> ${nextPageId}`)
      })
    }
  })

  // Add connections from pages to gatekeepers
  Object.entries(flowSpec.flow.pages).forEach(([pageId]) => {
    Object.entries(flowSpec.flow.gatekeepers).forEach(([gatekeeperId]) => {
      lines.push(`    ${pageId} ==> ${gatekeeperId}`)
    })
  })

  // Add legend
  lines.push('')
  lines.push('    %% Legend')
  lines.push('    subgraph Legend')
  lines.push('        L1["📄 Page"]:::pageNode')
  lines.push('        L2[["🚪 Gatekeeper"]]:::gateNode')
  lines.push('        L3["🚀 Entry Point"]:::entryNode')
  lines.push('        L4["✅ Pass"]:::passNode')
  lines.push('        L5["⚠️ Warn"]:::warnNode')
  lines.push('        L6["❌ Fail"]:::failNode')
  lines.push('        L7{{"Guards/Validators"}}')
  lines.push('    end')

  return lines.join('\n')
}

export function loadMermaidFromFile(filePath: string): Promise<string> {
  return fetch(filePath)
    .then(res => res.ok ? res.text() : Promise.reject('File not found'))
    .catch(() => {
      // Fallback to default diagram
      return `
flowchart TB
    A["No diagram available"] --> B["Run 'pnpm garage:scan' to generate"]
    B --> C["Check /docs/imo-spec/diagram.mmd"]
`
    })
}