#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface WhimsicalExport {
  ready: boolean
  completeness: number
  prompt: string
  payload: any
}

class WhimsicalExporter {
  
  async exportForWhimsical(filePath: string): Promise<WhimsicalExport> {
    try {
      // Read blueprint file
      if (!fs.existsSync(filePath)) {
        throw new Error(`Blueprint file not found: ${filePath}`)
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const blueprint = JSON.parse(fileContent)
      
      // Check if ready for Whimsical
      const ready = blueprint.status_flags?.is_whimsical_ready || false
      const completeness = this.calculateCompleteness(blueprint)
      
      // Generate Whimsical prompt
      const prompt = this.generateWhimsicalPrompt(blueprint)
      
      return {
        ready,
        completeness,
        prompt,
        payload: blueprint
      }
      
    } catch (error) {
      throw new Error(`Export failed: ${error}`)
    }
  }
  
  private calculateCompleteness(blueprint: any): number {
    let totalFields = 0
    let filledFields = 0
    
    const checkCompleteness = (obj: any) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          totalFields++
          if (value.length > 0) filledFields++
        } else if (typeof value === 'string') {
          totalFields++
          if (value && !value.includes('your-') && !value.includes('...')) {
            filledFields++
          }
        } else if (typeof value === 'object' && value !== null) {
          checkCompleteness(value)
        }
      })
    }
    
    checkCompleteness(blueprint.altitudes)
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  }
  
  private generateWhimsicalPrompt(blueprint: any): string {
    const projectName = blueprint.altitudes?.['30000']?.project_name || blueprint.project_slug
    
    return `
🎨 Generate comprehensive project visualizations from this IMO blueprint:

PROJECT: ${projectName}
SLUG: ${blueprint.project_slug}
VIN: ${blueprint.meta.process_id}

${JSON.stringify(blueprint, null, 2)}

📊 REQUESTED VISUALIZATIONS:

1. **Strategic Mind Map** (30,000ft view)
   - Project vision and objectives
   - Success criteria branches
   - Stakeholder connections
   - Core value propositions

2. **System Architecture Flowchart** (20,000ft view)
   - Component relationships
   - Data flow between services
   - Integration points
   - Technology stack layout

3. **Implementation Sequence Diagram** (10,000ft view)
   - Step-by-step execution flow
   - API interactions
   - Decision points and branches
   - Compliance checkpoints

4. **Agent Coordination Map** (5,000ft view)
   - Role assignments and responsibilities
   - Handoff workflows
   - Communication channels
   - Documentation flows

🎯 STYLE PREFERENCES:
- Use modern, professional color scheme
- Include project branding if applicable
- Make diagrams suitable for stakeholder presentations
- Ensure diagrams are printable and embeddable

📋 DELIVERABLES NEEDED:
- Live Whimsical collaboration links
- High-resolution PNG exports
- Embeddable iframe codes
- Editable diagram source files

Please generate these visualizations and provide the Whimsical links and embed codes for integration into our project documentation.
    `.trim()
  }
  
  printExportResults(result: WhimsicalExport, filePath: string): void {
    console.log(`\n🎨 Whimsical Export Results for: ${path.basename(filePath)}`)
    console.log(`${'='.repeat(60)}`)
    
    console.log(`\n📊 Status: ${result.ready ? '✅ READY FOR WHIMSICAL' : '⚠️  NEEDS MORE COMPLETION'}`)
    console.log(`📈 Completeness: ${result.completeness}%`)
    
    if (!result.ready) {
      console.log(`\n❌ Not ready for Whimsical GPT`)
      console.log(`   • Minimum 80% completion required`)
      console.log(`   • Current completion: ${result.completeness}%`)
      console.log(`   • Run 'npm run validate' to see what's missing`)
      return
    }
    
    console.log(`\n🎯 Blueprint is ready for Whimsical GPT!`)
    console.log(`\n📋 COPY AND PASTE THIS PROMPT:`)
    console.log(`${'─'.repeat(60)}`)
    console.log(result.prompt)
    console.log(`${'─'.repeat(60)}`)
    
    console.log(`\n🚀 Next Steps:`)
    console.log(`   1. Copy the prompt above`)
    console.log(`   2. Paste it into Whimsical GPT`)
    console.log(`   3. Receive your generated diagrams`)
    console.log(`   4. Update blueprint.json with diagram IDs`)
    
    // Save prompt to file for easy copying
    const promptFile = 'whimsical-prompt.txt'
    fs.writeFileSync(promptFile, result.prompt)
    console.log(`\n💾 Prompt saved to: ${promptFile}`)
    
    console.log(`\n${'='.repeat(60)}`)
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🎨 Whimsical Exporter

Usage: npm run export-whimsical [blueprint-file]

Examples:
  npm run export-whimsical blueprint.json
  npm run export-whimsical my-project-blueprint.json
`)
    process.exit(1)
  }
  
  const exporter = new WhimsicalExporter()
  const filePath = args[0]
  
  try {
    const result = await exporter.exportForWhimsical(filePath)
    exporter.printExportResults(result, filePath)
    
    process.exit(result.ready ? 0 : 1)
    
  } catch (error) {
    console.error(`❌ Export failed: ${error}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { WhimsicalExporter }