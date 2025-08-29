import axios from 'axios';
import * as yaml from 'js-yaml';
import { logger } from '../server';

export interface CTBNode {
  label: string;
  node_id: string;
  altitude: number;
  imo?: string;
  orbt?: string;
  subnodes?: CTBNode[];
}

export interface CTBStructure {
  star: {
    name: string;
    label: string;
  };
  branches: Array<{
    name: string;
    nodes: CTBNode[];
  }>;
  IMO?: {
    trace_id: string;
    compliance: string;
  };
  ORBT?: {
    policy_id: string;
    tracking: string;
  };
}

export interface CTBValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: {
    total_nodes: number;
    star_label: string;
    branches: number;
    altitudes: number[];
  };
}

export interface CTBSummary {
  star_label: string;
  total_nodes: number;
  altitude_breakdown: Record<number, Array<{
    label: string;
    node_id: string;
    has_imo: boolean;
    has_orbt: boolean;
  }>>;
  validation_status: 'valid' | 'warnings' | 'errors';
}

export class CTBService {
  private githubToken: string | undefined;
  
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
  }
  
  async parseCTBFromRepository(repoUrl: string, branch = 'main'): Promise<CTBStructure | null> {
    try {
      logger.info('Parsing CTB from repository', { repoUrl, branch });
      
      // Extract owner/repo from URL
      const { owner, repo } = this.parseGitHubUrl(repoUrl);
      
      // Fetch CTB blueprint file
      const ctbContent = await this.fetchFileFromGitHub(
        owner,
        repo,
        'ctb/ctb_blueprint.yaml',
        branch
      );
      
      if (!ctbContent) {
        logger.warn('CTB blueprint file not found', { repoUrl, branch });
        return null;
      }
      
      // Parse YAML content
      const ctbStructure = yaml.load(ctbContent) as CTBStructure;
      
      logger.info('CTB structure parsed successfully', {
        repoUrl,
        branch,
        starName: ctbStructure.star?.name,
        branchCount: ctbStructure.branches?.length || 0
      });
      
      return ctbStructure;
      
    } catch (error) {
      logger.error('Failed to parse CTB from repository', {
        repoUrl,
        branch,
        error: error.message
      });
      throw error;
    }
  }
  
  async validateCTBStructure(repoUrl: string, branch = 'main'): Promise<CTBValidation> {
    try {
      const ctbStructure = await this.parseCTBFromRepository(repoUrl, branch);
      
      if (!ctbStructure) {
        return {
          valid: false,
          errors: ['CTB structure not found'],
          warnings: [],
          info: {
            total_nodes: 0,
            star_label: '',
            branches: 0,
            altitudes: []
          }
        };
      }
      
      const validation: CTBValidation = {
        valid: true,
        errors: [],
        warnings: [],
        info: {
          total_nodes: 0,
          star_label: ctbStructure.star?.label || ctbStructure.star?.name || '',
          branches: ctbStructure.branches?.length || 0,
          altitudes: []
        }
      };
      
      // Validate structure
      if (!ctbStructure.star) {
        validation.errors.push('Missing star configuration');
        validation.valid = false;
      }
      
      if (!ctbStructure.branches || ctbStructure.branches.length === 0) {
        validation.errors.push('No branches defined');
        validation.valid = false;
      }
      
      // Count nodes and altitudes
      const altitudes = new Set<number>();
      let totalNodes = 0;
      
      ctbStructure.branches?.forEach(branch => {
        branch.nodes?.forEach(node => {
          totalNodes++;
          altitudes.add(node.altitude);
          
          // Validate node structure
          if (!node.label) {
            validation.warnings.push(`Node ${node.node_id} missing label`);
          }
          if (!node.node_id) {
            validation.errors.push('Node missing node_id');
            validation.valid = false;
          }
          if (!node.altitude) {
            validation.warnings.push(`Node ${node.label} missing altitude`);
          }
        });
      });
      
      validation.info.total_nodes = totalNodes;
      validation.info.altitudes = Array.from(altitudes).sort((a, b) => b - a);
      
      // IMO/ORBT validation
      if (!ctbStructure.IMO) {
        validation.warnings.push('Missing IMO configuration');
      }
      if (!ctbStructure.ORBT) {
        validation.warnings.push('Missing ORBT configuration');
      }
      
      return validation;
      
    } catch (error) {
      logger.error('CTB validation failed', {
        repoUrl,
        branch,
        error: error.message
      });
      
      return {
        valid: false,
        errors: [`Validation failed: ${error.message}`],
        warnings: [],
        info: {
          total_nodes: 0,
          star_label: '',
          branches: 0,
          altitudes: []
        }
      };
    }
  }
  
  async getCTBSummary(repoUrl: string, branch = 'main'): Promise<CTBSummary | null> {
    try {
      const ctbStructure = await this.parseCTBFromRepository(repoUrl, branch);
      
      if (!ctbStructure) {
        return null;
      }
      
      const altitudeBreakdown: Record<number, any[]> = {};
      let totalNodes = 0;
      
      ctbStructure.branches?.forEach(branch => {
        branch.nodes?.forEach(node => {
          totalNodes++;
          
          if (!altitudeBreakdown[node.altitude]) {
            altitudeBreakdown[node.altitude] = [];
          }
          
          altitudeBreakdown[node.altitude].push({
            label: node.label,
            node_id: node.node_id,
            has_imo: !!(node.imo && node.imo !== 'A'),
            has_orbt: !!(node.orbt && node.orbt !== 'A')
          });
        });
      });
      
      // Get validation status
      const validation = await this.validateCTBStructure(repoUrl, branch);
      let validationStatus: 'valid' | 'warnings' | 'errors' = 'valid';
      
      if (validation.errors.length > 0) {
        validationStatus = 'errors';
      } else if (validation.warnings.length > 0) {
        validationStatus = 'warnings';
      }
      
      return {
        star_label: ctbStructure.star?.label || ctbStructure.star?.name || '',
        total_nodes: totalNodes,
        altitude_breakdown: altitudeBreakdown,
        validation_status: validationStatus
      };
      
    } catch (error) {
      logger.error('Failed to create CTB summary', {
        repoUrl,
        branch,
        error: error.message
      });
      return null;
    }
  }
  
  private parseGitHubUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }
    
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    };
  }
  
  private async fetchFileFromGitHub(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null> {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MCP-Backend/1.0.0'
      };
      
      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`;
      }
      
      const response = await axios.get(url, { headers });
      
      if (response.data.content) {
        // Decode base64 content
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      
      return null;
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.debug('File not found', { owner, repo, path, branch });
        return null;
      }
      
      logger.error('Failed to fetch file from GitHub', {
        owner,
        repo,
        path,
        branch,
        error: error.message
      });
      throw error;
    }
  }
}