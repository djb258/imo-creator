import axios from 'axios';
import { logger } from '../server';
import { CTBService, CTBStructure } from './ctbService';

export interface CTBAnalysis {
  summary: string;
  strengths: string[];
  suggestions: string[];
  completeness_score: number;
  structural_issues: string[];
  enhancement_opportunities: string[];
}

export interface CTBEnhancements {
  enhanced_structure: CTBStructure;
  changes_made: string[];
  rationale: string;
  implementation_notes: string[];
}

export class LLMService {
  private apiKey: string;
  private model: string;
  private apiUrl: string;
  private ctbService: CTBService;
  
  constructor() {
    this.apiKey = process.env.LLM_API_KEY || '';
    this.model = process.env.LLM_MODEL || 'gpt-4';
    this.apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1';
    this.ctbService = new CTBService();
  }
  
  async analyzeCTBStructure(
    repoUrl?: string,
    branch = 'main',
    ctbStructure?: CTBStructure
  ): Promise<CTBAnalysis> {
    try {
      // Get CTB structure if not provided
      let structure = ctbStructure;
      if (!structure && repoUrl) {
        structure = await this.ctbService.parseCTBFromRepository(repoUrl, branch);
        if (!structure) {
          throw new Error('CTB structure not found in repository');
        }
      }
      
      if (!structure) {
        throw new Error('No CTB structure provided or found');
      }
      
      logger.info('Analyzing CTB structure with LLM', {
        repoUrl,
        branch,
        model: this.model
      });
      
      const prompt = this.buildAnalysisPrompt(structure);
      const analysis = await this.callLLM(prompt);
      
      return this.parseAnalysisResponse(analysis);
      
    } catch (error) {
      logger.error('CTB analysis failed', {
        repoUrl,
        branch,
        error: error.message
      });
      throw error;
    }
  }
  
  async generateCTBEnhancements(
    repoUrl?: string,
    branch = 'main',
    ctbStructure?: CTBStructure,
    enhancementRequest?: string
  ): Promise<CTBEnhancements> {
    try {
      // Get CTB structure if not provided
      let structure = ctbStructure;
      if (!structure && repoUrl) {
        structure = await this.ctbService.parseCTBFromRepository(repoUrl, branch);
        if (!structure) {
          throw new Error('CTB structure not found in repository');
        }
      }
      
      if (!structure) {
        throw new Error('No CTB structure provided or found');
      }
      
      logger.info('Generating CTB enhancements with LLM', {
        repoUrl,
        branch,
        model: this.model,
        hasRequest: !!enhancementRequest
      });
      
      const prompt = this.buildEnhancementPrompt(structure, enhancementRequest);
      const enhancements = await this.callLLM(prompt);
      
      return this.parseEnhancementResponse(enhancements);
      
    } catch (error) {
      logger.error('CTB enhancement generation failed', {
        repoUrl,
        branch,
        error: error.message
      });
      throw error;
    }
  }
  
  private buildAnalysisPrompt(structure: CTBStructure): string {
    const structureJson = JSON.stringify(structure, null, 2);
    
    return `You are a CTB (Christmas Tree Backbone) structure analysis expert. Analyze the following CTB structure and provide comprehensive feedback.

CTB Structure:
${structureJson}

Please analyze this CTB structure and respond with a JSON object containing:

{
  "summary": "Brief overview of the CTB structure",
  "strengths": ["List of strengths in the structure"],
  "suggestions": ["List of improvement suggestions"],
  "completeness_score": 85, // Score out of 100
  "structural_issues": ["Any structural problems"],
  "enhancement_opportunities": ["Areas for potential enhancement"]
}

Focus on:
1. Hierarchical organization (altitudes: 40k, 30k, 20k, 10k, 5k, 1k)
2. Node completeness (labels, IDs, IMO/ORBT values)
3. Branch organization and balance
4. IMO compliance and ORBT policy adherence
5. Overall structure clarity and maintainability

Respond only with valid JSON.`;
  }
  
  private buildEnhancementPrompt(structure: CTBStructure, request?: string): string {
    const structureJson = JSON.stringify(structure, null, 2);
    const requestSection = request ? `\n\nSpecific Enhancement Request:\n${request}` : '';
    
    return `You are a CTB (Christmas Tree Backbone) structure enhancement expert. Enhance the following CTB structure based on best practices and the specific request if provided.

Current CTB Structure:
${structureJson}${requestSection}

Please enhance this CTB structure and respond with a JSON object containing:

{
  "enhanced_structure": { /* Enhanced CTB structure following the same schema */ },
  "changes_made": ["List of specific changes made"],
  "rationale": "Explanation of why these changes improve the structure",
  "implementation_notes": ["Notes for implementing these changes"]
}

Enhancement Guidelines:
1. Maintain proper altitude hierarchy (40k-1k)
2. Ensure balanced branch distribution
3. Add missing IMO/ORBT values where appropriate
4. Improve node labels for clarity
5. Add strategic nodes if gaps are identified
6. Maintain structural integrity and relationships

Respond only with valid JSON.`;
  }
  
  private async callLLM(prompt: string): Promise<string> {
    if (!this.apiKey) {
      // Return mock response for development
      logger.warn('LLM API key not configured, returning mock response');
      return this.getMockResponse(prompt);
    }
    
    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a CTB structure analysis and enhancement expert. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content;
      
    } catch (error) {
      logger.error('LLM API call failed', {
        error: error.message,
        model: this.model
      });
      
      // Return mock response on failure
      return this.getMockResponse(prompt);
    }
  }
  
  private parseAnalysisResponse(response: string): CTBAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      logger.warn('Failed to parse LLM analysis response, using fallback');
      return {
        summary: 'CTB structure analysis completed',
        strengths: ['Well-structured hierarchy', 'Clear node definitions'],
        suggestions: ['Consider adding more detail to node descriptions', 'Review IMO/ORBT compliance'],
        completeness_score: 75,
        structural_issues: [],
        enhancement_opportunities: ['Add missing altitude levels', 'Improve branch balance']
      };
    }
  }
  
  private parseEnhancementResponse(response: string): CTBEnhancements {
    try {
      return JSON.parse(response);
    } catch (error) {
      logger.warn('Failed to parse LLM enhancement response, using fallback');
      return {
        enhanced_structure: {} as CTBStructure,
        changes_made: ['Enhanced node structure', 'Improved hierarchy'],
        rationale: 'Improvements based on CTB best practices',
        implementation_notes: ['Review enhanced structure', 'Validate against requirements']
      };
    }
  }
  
  private getMockResponse(prompt: string): string {
    if (prompt.includes('analysis')) {
      return JSON.stringify({
        summary: 'CTB structure shows good hierarchical organization with room for improvement',
        strengths: ['Clear altitude hierarchy', 'Well-defined branches', 'Good node labeling'],
        suggestions: ['Add more detail to lower altitude nodes', 'Enhance IMO compliance tracking'],
        completeness_score: 78,
        structural_issues: ['Some missing ORBT values', 'Uneven branch distribution'],
        enhancement_opportunities: ['Add strategic planning nodes at 30k', 'Improve execution detail at 1k']
      });
    } else {
      return JSON.stringify({
        enhanced_structure: {},
        changes_made: ['Added strategic planning nodes', 'Enhanced IMO compliance', 'Improved node descriptions'],
        rationale: 'Changes improve structure clarity and compliance while maintaining hierarchy',
        implementation_notes: ['Validate enhanced structure', 'Update documentation', 'Test with existing processes']
      });
    }
  }
}