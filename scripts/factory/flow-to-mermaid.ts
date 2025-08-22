import * as fs from 'fs';
import * as path from 'path';

interface FlowSpec {
  flow: {
    entrypoint: string;
    pages: Record<string, {
      id: string;
      title: string;
      type: string;
      guards: string[];
      validators: string[];
      gatekeeper?: string;
      next: string[];
      telemetry: {
        events: string[];
        required: boolean;
      };
    }>;
    gatekeepers: Record<string, {
      type: string;
      rules: string[];
      enforcement: string;
    }>;
  };
}

class FlowToMermaid {
  private flow: FlowSpec['flow'];
  private mermaidCode: string[] = [];

  constructor(flowPath: string = 'docs/imo-spec/flow.json') {
    const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
    this.flow = flowData.flow;
  }

  generate(): string {
    this.mermaidCode = [];
    
    // Header
    this.mermaidCode.push('flowchart TB');
    this.mermaidCode.push('    %% HEIR/ORBT Compliant Flow Diagram');
    this.mermaidCode.push('    %% Generated from flow.json');
    this.mermaidCode.push('');
    
    // Style definitions
    this.addStyles();
    
    // Add nodes for pages
    this.addPageNodes();
    
    // Add gatekeeper nodes
    this.addGatekeeperNodes();
    
    // Add connections
    this.addConnections();
    
    // Add legend
    this.addLegend();
    
    return this.mermaidCode.join('\n');
  }

  private addStyles(): void {
    this.mermaidCode.push('    %% Styles');
    this.mermaidCode.push('    classDef pageNode fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000;');
    this.mermaidCode.push('    classDef gateNode fill:#fff3e0,stroke:#e65100,stroke-width:3px,color:#000;');
    this.mermaidCode.push('    classDef entryNode fill:#c8e6c9,stroke:#1b5e20,stroke-width:3px,color:#000;');
    this.mermaidCode.push('    classDef telemetryNode fill:#f3e5f5,stroke:#4a148c,stroke-width:1px,color:#000;');
    this.mermaidCode.push('');
  }

  private addPageNodes(): void {
    this.mermaidCode.push('    %% Page Nodes');
    
    for (const [pageId, page] of Object.entries(this.flow.pages)) {
      const isEntry = pageId === this.flow.entrypoint;
      const nodeClass = isEntry ? 'entryNode' : 'pageNode';
      
      // Main page node
      const label = `${page.title}\\n[${page.type}]`;
      this.mermaidCode.push(`    ${pageId}["${label}"]:::${nodeClass}`);
      
      // Add guard indicators
      if (page.guards.length > 0) {
        const guardId = `${pageId}_guards`;
        const guardLabel = `Guards: ${page.guards.join(', ')}`;
        this.mermaidCode.push(`    ${guardId}{{"${guardLabel}"}}`);
        this.mermaidCode.push(`    ${guardId} -.-> ${pageId}`);
      }
      
      // Add validator indicators
      if (page.validators.length > 0) {
        const validatorId = `${pageId}_validators`;
        const validatorLabel = `Validators: ${page.validators.join(', ')}`;
        this.mermaidCode.push(`    ${validatorId}{{"${validatorLabel}"}}`);
        this.mermaidCode.push(`    ${validatorId} -.-> ${pageId}`);
      }
      
      // Add telemetry indicator if required
      if (page.telemetry.required) {
        const telemetryId = `${pageId}_telemetry`;
        this.mermaidCode.push(`    ${telemetryId}(["📊 Telemetry"]):::telemetryNode`);
        this.mermaidCode.push(`    ${pageId} -.-> ${telemetryId}`);
      }
    }
    
    this.mermaidCode.push('');
  }

  private addGatekeeperNodes(): void {
    this.mermaidCode.push('    %% Gatekeeper Nodes');
    
    for (const [gateId, gate] of Object.entries(this.flow.gatekeepers)) {
      const label = `🚪 ${gateId}\\n[${gate.type}]\\nEnforcement: ${gate.enforcement}`;
      this.mermaidCode.push(`    ${gateId}[["${label}"]]:::gateNode`);
      
      // Add rules
      if (gate.rules.length > 0) {
        const rulesId = `${gateId}_rules`;
        const rulesLabel = `Rules:\\n${gate.rules.join('\\n')}`;
        this.mermaidCode.push(`    ${rulesId}{{"${rulesLabel}"}}`);
        this.mermaidCode.push(`    ${rulesId} -.-> ${gateId}`);
      }
    }
    
    this.mermaidCode.push('');
  }

  private addConnections(): void {
    this.mermaidCode.push('    %% Connections');
    
    for (const [pageId, page] of Object.entries(this.flow.pages)) {
      // Connect to gatekeeper if present
      if (page.gatekeeper) {
        this.mermaidCode.push(`    ${pageId} ==> ${page.gatekeeper}`);
        
        // Connect gatekeeper to next pages
        for (const nextPage of page.next) {
          this.mermaidCode.push(`    ${page.gatekeeper} ==> ${nextPage}`);
        }
      } else {
        // Direct connections to next pages
        for (const nextPage of page.next) {
          this.mermaidCode.push(`    ${pageId} --> ${nextPage}`);
        }
      }
    }
    
    this.mermaidCode.push('');
  }

  private addLegend(): void {
    this.mermaidCode.push('    %% Legend');
    this.mermaidCode.push('    subgraph Legend');
    this.mermaidCode.push('        L1["📄 Page"]:::pageNode');
    this.mermaidCode.push('        L2[["🚪 Gatekeeper"]]:::gateNode');
    this.mermaidCode.push('        L3["🚀 Entry Point"]:::entryNode');
    this.mermaidCode.push('        L4{{"Guards/Validators"}}');
    this.mermaidCode.push('        L5(["📊 Telemetry"]):::telemetryNode');
    this.mermaidCode.push('    end');
  }

  saveToFile(outputPath: string = 'docs/imo-spec/diagram.mmd'): void {
    const diagram = this.generate();
    fs.writeFileSync(outputPath, diagram);
    console.log(`✅ Mermaid diagram saved to ${outputPath}`);
  }

  generateWhimsicalPrompt(): string {
    const flowJson = JSON.stringify(this.flow, null, 2);
    
    const prompt = `Draw a Christmas tree-shaped flow diagram with the following specifications:

🎄 VISUAL STYLE:
- Shape the overall diagram like a Christmas tree
- Place the entry point at the top (star)
- Arrange pages in tiers going down
- Gatekeepers should be ornaments (circles with 🚪)
- Guards should be candy canes
- Validators should be gift boxes
- Telemetry points should be twinkling lights

🎯 LABELING:
- Clearly label all guards with their IDs
- Show gatekeeper enforcement levels
- Indicate required vs optional validators
- Mark telemetry collection points

📊 FLOW DATA:
${flowJson}

🎨 COLOR SCHEME:
- Entry point: Gold star
- Pages: Green boxes
- Gatekeepers: Red/orange ornaments
- Guards: Red/white candy canes
- Validators: Wrapped presents
- Telemetry: Yellow lights
- Connections: Silver tinsel

Please create this as a festive yet functional flow diagram that maintains technical accuracy while embracing the holiday theme!`;

    return prompt;
  }

  saveWhimsicalPrompt(outputPath: string = 'docs/imo-spec/whimsical_prompt.txt'): void {
    const prompt = this.generateWhimsicalPrompt();
    fs.writeFileSync(outputPath, prompt);
    console.log(`✅ Whimsical prompt saved to ${outputPath}`);
  }
}

// Export for use in other scripts
export { FlowToMermaid };

// CLI execution
if (require.main === module) {
  const converter = new FlowToMermaid();
  
  // Generate and save Mermaid diagram
  converter.saveToFile();
  
  // Generate and save Whimsical prompt
  converter.saveWhimsicalPrompt();
  
  console.log('\n📊 Flow visualization files generated:');
  console.log('  - docs/imo-spec/diagram.mmd (Mermaid diagram)');
  console.log('  - docs/imo-spec/whimsical_prompt.txt (Paste-ready prompt)');
}