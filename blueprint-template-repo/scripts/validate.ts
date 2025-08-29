#!/usr/bin/env tsx

import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'

// Blueprint schema validation
const BlueprintSchema = z.object({
  project_slug: z.string().min(1),
  created_at: z.string().datetime(),
  created_by: z.string().min(1),
  
  status_flags: z.object({
    is_filled: z.boolean(),
    is_validated: z.boolean(),
    is_whimsical_ready: z.boolean()
  }),
  
  meta: z.object({
    unique_id: z.string(),
    process_id: z.string(),
    blueprint_version_hash: z.string(),
    doctrine: z.array(z.string())
  }),
  
  altitudes: z.object({
    "30000": z.object({
      project_name: z.string().min(1),
      objective: z.string().min(1),
      success_criteria: z.array(z.string()).min(1),
      stakeholders: z.array(z.string()).min(1)
    }),
    
    "20000": z.object({
      components: z.array(z.string()).min(1),
      roles: z.array(z.string()).min(1),
      stages: z.array(z.string()).min(1),
      inputs: z.array(z.string()).min(1),
      outputs: z.array(z.string()).min(1)
    }),
    
    "10000": z.object({
      steps: z.array(z.string()).min(1),
      apis_services: z.array(z.string()),
      decision_points: z.array(z.string()),
      llms: z.array(z.string()),
      compliance: z.array(z.string())
    }),
    
    "5000": z.object({
      documentation_plan: z.array(z.string()),
      agent_roles: z.object({
        claude: z.string(),
        project_gpt: z.string(),
        whimsical_gpt: z.string(),
        sidecar: z.string(),
        heir: z.string()
      }),
      handoffs: z.array(z.string()),
      firebreak_queue: z.object({
        location: z.string(),
        policy: z.string()
      })
    })
  }),
  
  trunk_root: z.object({
    doctrine_foundation: z.array(z.string()),
    schema_enforcement: z.array(z.string()),
    telemetry: z.object({
      emit_at_every_stage: z.boolean(),
      sink: z.array(z.string())
    })
  }),
  
  whimsical_outputs: z.object({
    generate_mind_map: z.boolean(),
    generate_flowchart: z.boolean(),
    generate_agent_map: z.boolean(),
    generate_sequence_diagram: z.boolean()
  }),
  
  handoff_to_whimsical: z.boolean(),
  
  notion_links: z.object({
    project_page: z.string().url().optional().or(z.literal("")),
    backlog_board: z.string().url().optional().or(z.literal("")),
    diagrams_doc: z.string().url().optional().or(z.literal(""))
  }),
  
  visual_embedding: z.object({
    iframe_target: z.string().url().optional().or(z.literal("")),
    preferred_height_px: z.number(),
    whimsical_diagram_ids: z.array(z.string())
  }),
  
  diagram_trace_tags: z.array(z.string())
})

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  completeness: number
  suggestions: string[]
}

class BlueprintValidator {
  
  async validateBlueprint(filePath: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: [],
      completeness: 0,
      suggestions: []
    }
    
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        result.errors.push(`Blueprint file not found: ${filePath}`)
        return result
      }
      
      // Read and parse JSON
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      let blueprint: any
      
      try {
        blueprint = JSON.parse(fileContent)
      } catch (parseError) {
        result.errors.push(`Invalid JSON format: ${parseError}`)
        return result
      }
      
      // Schema validation
      const schemaResult = BlueprintSchema.safeParse(blueprint)
      
      if (!schemaResult.success) {
        schemaResult.error.errors.forEach(error => {
          result.errors.push(`${error.path.join('.')}: ${error.message}`)
        })
      }
      
      // Custom validation rules
      this.validateCustomRules(blueprint, result)
      
      // Calculate completeness
      result.completeness = this.calculateCompleteness(blueprint)
      
      // Generate suggestions
      result.suggestions = this.generateSuggestions(blueprint, result.completeness)
      
      // Update blueprint hash if validation passes
      if (result.errors.length === 0) {
        result.isValid = true
        const hash = this.generateBlueprintHash(blueprint)
        blueprint.meta.blueprint_version_hash = hash
        
        // Update validation status
        blueprint.status_flags.is_validated = true
        blueprint.status_flags.is_whimsical_ready = result.completeness >= 80
        
        // Write back the updated blueprint
        fs.writeFileSync(filePath, JSON.stringify(blueprint, null, 2))
      }
      
      return result
      
    } catch (error) {
      result.errors.push(`Validation failed: ${error}`)
      return result
    }
  }
  
  private validateCustomRules(blueprint: any, result: ValidationResult): void {
    // Check project slug format
    const slugPattern = /^[a-z0-9-]+$/
    if (!slugPattern.test(blueprint.project_slug)) {
      result.warnings.push('Project slug should be lowercase with hyphens only')
    }
    
    // Check for placeholder values
    const placeholders = [
      'your-project-name',
      'your-project',
      'your-backlog',
      'your-diagrams',
      'yourapp.dev'
    ]
    
    const jsonString = JSON.stringify(blueprint)
    placeholders.forEach(placeholder => {
      if (jsonString.includes(placeholder)) {
        result.warnings.push(`Replace placeholder value: ${placeholder}`)
      }
    })
    
    // Check doctrine compliance
    const requiredDoctrines = ['BARTON', 'ORBT', 'HEIR']
    const missingDoctrines = requiredDoctrines.filter(
      doctrine => !blueprint.meta.doctrine.includes(doctrine)
    )
    
    if (missingDoctrines.length > 0) {
      result.errors.push(`Missing required doctrines: ${missingDoctrines.join(', ')}`)
    }
    
    // Check altitude completeness
    const altitudes = ['30000', '20000', '10000', '5000']
    altitudes.forEach(altitude => {
      const altitudeData = blueprint.altitudes[altitude]
      if (!altitudeData) return
      
      // Check for empty arrays and strings
      Object.entries(altitudeData).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length === 0) {
          result.warnings.push(`${altitude}.${key} is empty`)
        } else if (typeof value === 'string' && value === '') {
          result.warnings.push(`${altitude}.${key} is empty`)
        }
      })
    })
  }
  
  private calculateCompleteness(blueprint: any): number {
    let totalFields = 0
    let filledFields = 0
    
    const checkCompleteness = (obj: any, path: string = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key
        
        if (Array.isArray(value)) {
          totalFields++
          if (value.length > 0) filledFields++
        } else if (typeof value === 'string') {
          totalFields++
          if (value && !value.includes('your-') && !value.includes('...')) {
            filledFields++
          }
        } else if (typeof value === 'object' && value !== null) {
          checkCompleteness(value, currentPath)
        } else {
          totalFields++
          if (value !== null && value !== undefined) filledFields++
        }
      })
    }
    
    // Only check altitudes for completeness calculation
    checkCompleteness(blueprint.altitudes)
    checkCompleteness(blueprint.notion_links)
    checkCompleteness(blueprint.visual_embedding)
    
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  }
  
  private generateSuggestions(blueprint: any, completeness: number): string[] {
    const suggestions: string[] = []
    
    if (completeness < 30) {
      suggestions.push('Start with the 30,000ft view - define your project vision and objectives')
    }
    
    if (completeness < 50) {
      suggestions.push('Break down your system architecture at 20,000ft - components and roles')
    }
    
    if (completeness < 70) {
      suggestions.push('Detail implementation steps at 10,000ft - APIs, decisions, compliance')
    }
    
    if (completeness < 90) {
      suggestions.push('Complete tactical planning at 5,000ft - documentation and handoffs')
    }
    
    if (!blueprint.notion_links.project_page) {
      suggestions.push('Add Notion project page link for better documentation integration')
    }
    
    if (!blueprint.visual_embedding.iframe_target) {
      suggestions.push('Consider adding an iframe target for visual embedding')
    }
    
    if (blueprint.whimsical_outputs.generate_mind_map && completeness >= 80) {
      suggestions.push('Your blueprint is ready for Whimsical diagram generation!')
    }
    
    return suggestions
  }
  
  private generateBlueprintHash(blueprint: any): string {
    // Create a stable hash excluding meta fields that change
    const { meta, status_flags, ...hashableContent } = blueprint
    const contentString = JSON.stringify(hashableContent, Object.keys(hashableContent).sort())
    return `sha256:${createHash('sha256').update(contentString).digest('hex').substring(0, 16)}`
  }
  
  printResults(result: ValidationResult, filePath: string): void {
    console.log(`\n🔍 Blueprint Validation Results for: ${path.basename(filePath)}`)
    console.log(`${'='.repeat(60)}`)
    
    // Status
    console.log(`\n📊 Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`)
    console.log(`📈 Completeness: ${result.completeness}%`)
    
    // Progress bar
    const progressWidth = 30
    const filledWidth = Math.round((result.completeness / 100) * progressWidth)
    const progressBar = '█'.repeat(filledWidth) + '░'.repeat(progressWidth - filledWidth)
    console.log(`📊 Progress: [${progressBar}] ${result.completeness}%`)
    
    // Errors
    if (result.errors.length > 0) {
      console.log(`\n❌ Errors (${result.errors.length}):`)
      result.errors.forEach(error => console.log(`   • ${error}`))
    }
    
    // Warnings
    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${result.warnings.length}):`)
      result.warnings.forEach(warning => console.log(`   • ${warning}`))
    }
    
    // Suggestions
    if (result.suggestions.length > 0) {
      console.log(`\n💡 Suggestions:`)
      result.suggestions.forEach(suggestion => console.log(`   • ${suggestion}`))
    }
    
    // Next steps
    console.log(`\n🚀 Next Steps:`)
    if (!result.isValid) {
      console.log(`   • Fix the errors listed above`)
      console.log(`   • Run validation again: npm run factory:validate-blueprint ${path.basename(filePath)}`)
    } else if (result.completeness < 80) {
      console.log(`   • Continue filling out the blueprint to reach 80% completion`)
      console.log(`   • Focus on the suggestions above`)
    } else {
      console.log(`   • ✅ Blueprint is ready for Whimsical GPT!`)
      console.log(`   • Copy the JSON content and submit to Whimsical GPT`)
      console.log(`   • You'll receive mind maps, flowcharts, and diagrams`)
    }
    
    console.log(`\n${'='.repeat(60)}`)
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🔍 Blueprint Validator

Usage: npm run factory:validate-blueprint <blueprint-file>

Examples:
  npm run factory:validate-blueprint templates/imo_project_blueprint.json
  npm run factory:validate-blueprint projects/my-app-blueprint.json
`)
    process.exit(1)
  }
  
  const validator = new BlueprintValidator()
  const filePath = args[0]
  
  try {
    const result = await validator.validateBlueprint(filePath)
    validator.printResults(result, filePath)
    
    // Exit with appropriate code
    process.exit(result.isValid ? 0 : 1)
    
  } catch (error) {
    console.error(`❌ Validation failed: ${error}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { BlueprintValidator, ValidationResult }