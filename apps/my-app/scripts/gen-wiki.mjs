import fs from 'fs';
import path from 'path';

// Simple YAML parser (basic support)
function parseYAML(content) {
  const lines = content.split('\n');
  const result = {};
  let currentKey = null;
  let currentArray = null;
  let indent = 0;
  
  for (const line of lines) {
    if (line.trim().startsWith('#') || line.trim() === '') continue;
    
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    if (match) {
      const [, spaces, key, value] = match;
      const currentIndent = spaces.length;
      
      if (value.startsWith('[') && value.endsWith(']')) {
        // Array in bracket notation
        result[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
      } else if (value === '') {
        // Start of nested object or array
        currentKey = key;
        result[key] = {};
      } else {
        result[key] = value.replace(/['"]/g, '');
      }
    } else if (line.trim().startsWith('- ')) {
      // Array item
      const item = line.trim().slice(2);
      if (currentKey && !Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      if (currentKey) {
        result[currentKey].push(item.replace(/['"]/g, ''));
      }
    }
  }
  
  return result;
}

const branchesDir = 'docs/branches';
const wikiDir = 'docs/wiki';
const toolboxDir = 'docs/toolbox';

// Ensure directories exist
fs.mkdirSync(wikiDir, { recursive: true });
fs.mkdirSync(path.join(wikiDir, 'branches'), { recursive: true });

// Load toolbox profiles if available
let profiles = {};
try {
  const profilesContent = fs.readFileSync(path.join(toolboxDir, 'profiles.yml'), 'utf8');
  const parsed = parseYAML(profilesContent);
  profiles = parsed.profiles || {};
} catch (e) {
  console.log('No toolbox profiles found, using defaults');
}

function renderMermaid(branch) {
  const inputs = branch.input?.sources?.join('\\n') || 'Input';
  const outputs = branch.output?.destinations?.join('\\n') || 'Output';
  const steps = branch.middle?.steps?.slice(0, 3).join(' --> ') || 'Process';
  
  return `
\`\`\`mermaid
flowchart TB
    subgraph "Input Layer"
        I[${inputs}]
    end
    
    subgraph "Middle Layer (${branch.altitude || '10k'})"
        ${steps}
    end
    
    subgraph "Output Layer"
        O[${outputs}]
    end
    
    subgraph "Tools"
        ${branch.tools_profile?.join(':::tool\\n') || 'Tools'}:::tool
    end
    
    I --> Middle
    Middle --> O
    
    classDef tool fill:#f9f,stroke:#333,stroke-width:2px;
\`\`\`
  `.trim();
}

function renderToolProfile(profileName) {
  const profile = profiles[profileName];
  if (!profile) return `- ${profileName} (profile not found)`;
  
  return `
### ${profileName}
- **Dependencies**: ${profile.deps?.join(', ') || 'None'}
- **Services**: ${profile.services?.join(', ') || 'None'}  
- **Patterns**: ${profile.patterns?.join(', ') || 'None'}
`;
}

function writeBranchWiki(branch) {
  const dir = path.join(wikiDir, 'branches', branch.branch_id);
  fs.mkdirSync(dir, { recursive: true });
  
  // Tool profiles section
  const toolsSection = branch.tools_profile?.map(renderToolProfile).join('\\n') || 'No tools configured';
  
  const md = `# ${branch.title}

**Branch ID**: \`${branch.branch_id}\`  
**Altitude**: ${branch.altitude}  
**Parent**: ${branch.parent_id || 'root'}  

## Architecture Overview
${renderMermaid(branch)}

## Input Layer
- **Sources**: ${branch.input?.sources?.join(', ') || 'Not specified'}
- **Schema**: ${branch.input?.schema?.join(', ') || 'Not specified'}
- **Guards**: ${branch.input?.guards?.join(', ') || 'Not specified'}

## Middle Layer Processing
- **Steps**: ${branch.middle?.steps?.join(' → ') || 'Not specified'}
- **Validators**: ${branch.middle?.validators?.join(', ') || 'Not specified'}

## Output Layer
- **Destinations**: ${branch.output?.destinations?.join(', ') || 'Not specified'}
- **SLAs**: ${branch.output?.sLAs?.join(', ') || 'Not specified'}

## API Contracts
${branch.contracts?.map(c => \`- \\\`\${c}\\\`\`).join('\\n') || '- No contracts specified'}

## Tool Profiles
${toolsSection}

## Observability

### Metrics
${branch.metrics?.map(m => \`- \${m}\`).join('\\n') || '- No metrics specified'}

### Dashboards
${branch.dashboards?.map(d => \`- [\${d}](\${d})\`).join('\\n') || '- No dashboards specified'}

### Risk Assessment
${branch.risks?.map(r => \`- ⚠️ \${r}\`).join('\\n') || '- No risks identified'}

## Related Documentation
- [[../../00-overview/index.md|System Overview]]
- [[../../10-input/index.md|Input Layer Details]]
- [[../../20-middle/index.md|Middle Layer Details]]
- [[../../30-output/index.md|Output Layer Details]]
- [[../../60-operations/index.md|Operations Guide]]

---
*Generated from \`docs/branches/${branch.branch_id}.yml\`*
`;

  fs.writeFileSync(path.join(dir, 'index.md'), md);
  
  // Create navigation file
  const navMd = \`# Branch: \${branch.title}

## Quick Navigation
- [[index.md|Overview]]
- [[input.md|Input Details]] 
- [[middle.md|Processing Logic]]
- [[output.md|Output Handling]]
- [[monitoring.md|Monitoring & Alerts]]

## Altitude: \${branch.altitude}
\${branch.altitude === '30k' ? '**Strategic Level** - Planning & Orchestration' : 
  branch.altitude === '20k' ? '**Tactical Level** - Analysis & Decisions' :
  branch.altitude === '10k' ? '**Implementation Level** - Core Processing' :
  '**Validation Level** - Testing & Verification'}
\`;

  fs.writeFileSync(path.join(dir, 'README.md'), navMd);
}

function generateOverview() {
  const branches = [];
  
  try {
    for (const file of fs.readdirSync(branchesDir)) {
      if (!file.endsWith('.yml') || file === '_tree.yml') continue;
      
      const content = fs.readFileSync(path.join(branchesDir, file), 'utf8');
      const branch = parseYAML(content);
      branches.push(branch);
    }
  } catch (e) {
    console.log('No branch files found');
  }
  
  const overviewMd = \`# Branch Architecture Overview

## System Branches
\${branches.map(b => \`- [[\${b.branch_id}/index.md|\${b.title}]] (\${b.altitude})\`).join('\\n')}

## Altitude Distribution
\${branches.reduce((acc, b) => {
  acc[b.altitude] = acc[b.altitude] || [];
  acc[b.altitude].push(b);
  return acc;
}, {})}

## System Flow
\`\`\`mermaid
graph TB
    \${branches.filter(b => b.altitude === '30k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
    \${branches.filter(b => b.altitude === '20k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
    \${branches.filter(b => b.altitude === '10k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
    \${branches.filter(b => b.altitude === '5k').map(b => \`\${b.branch_id}["\${b.title}"]\`).join('\\n    ')}
\`\`\`

---
*Auto-generated from branch specifications*
\`;

  fs.writeFileSync(path.join(wikiDir, 'branches', 'README.md'), overviewMd);
}

// Process all branch files
try {
  for (const file of fs.readdirSync(branchesDir)) {
    if (!file.endsWith('.yml') || file === '_tree.yml') continue;
    
    const content = fs.readFileSync(path.join(branchesDir, file), 'utf8');
    const branch = parseYAML(content);
    writeBranchWiki(branch);
    console.log(\`Generated wiki for branch: \${branch.branch_id}\`);
  }
  
  generateOverview();
  console.log("Deep Wiki with branch specifications generated under docs/wiki/");
} catch (e) {
  console.log("Error generating wiki:", e.message);
  console.log("Creating basic structure...");
  
  // Fallback: create basic structure
  fs.writeFileSync(path.join(wikiDir, 'branches', 'README.md'), '# Branches\\n\\nNo branch specifications found.');
}
