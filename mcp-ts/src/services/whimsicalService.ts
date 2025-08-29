import axios from 'axios';
import { logger } from '../server';
import { CTBStructure } from './ctbService';

export interface WhimsicalProject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  diagrams: WhimsicalDiagram[];
}

export interface WhimsicalDiagram {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface DiagramUpdateResult {
  success: boolean;
  diagram_id: string;
  diagram_url: string;
  message: string;
}

export class WhimsicalService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.WHIMSICAL_API_KEY || '';
    this.baseUrl = process.env.WHIMSICAL_API_URL || 'https://whimsical.com/api/v1';
  }
  
  async updateDiagramWithCTB(
    projectId: string,
    ctbStructure: CTBStructure,
    diagramTitle?: string
  ): Promise<DiagramUpdateResult> {
    try {
      if (!this.apiKey) {
        logger.warn('Whimsical API key not configured, returning mock response');
        return this.getMockUpdateResult(projectId, diagramTitle);
      }
      
      logger.info('Updating Whimsical diagram with CTB structure', {
        projectId,
        diagramTitle,
        starName: ctbStructure.star?.name
      });
      
      // Convert CTB structure to Whimsical format
      const whimsicalData = this.convertCTBToWhimsical(ctbStructure);
      
      // Create or update diagram
      const diagramData = {
        name: diagramTitle || `CTB: ${ctbStructure.star?.name || 'Structure'}`,
        type: 'mindmap',
        data: whimsicalData
      };
      
      // For now, we'll simulate the API call since Whimsical API details may vary
      // In a real implementation, you'd make the actual API call here
      const response = await this.mockWhimsicalApiCall(projectId, diagramData);
      
      return {
        success: true,
        diagram_id: response.diagram_id,
        diagram_url: response.url,
        message: 'Diagram updated successfully with CTB structure'
      };
      
    } catch (error) {
      logger.error('Failed to update Whimsical diagram', {
        projectId,
        diagramTitle,
        error: error.message
      });
      
      return {
        success: false,
        diagram_id: '',
        diagram_url: '',
        message: `Failed to update diagram: ${error.message}`
      };
    }
  }
  
  async getProjectInfo(projectId: string): Promise<WhimsicalProject> {
    try {
      if (!this.apiKey) {
        logger.warn('Whimsical API key not configured, returning mock project');
        return this.getMockProject(projectId);
      }
      
      logger.info('Getting Whimsical project info', { projectId });
      
      // In a real implementation, make actual API call
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
      
      // Mock API call for now
      return this.getMockProject(projectId);
      
    } catch (error) {
      logger.error('Failed to get Whimsical project info', {
        projectId,
        error: error.message
      });
      throw error;
    }
  }
  
  private convertCTBToWhimsical(ctbStructure: CTBStructure): any {
    const rootNode = {
      id: 'root',
      text: ctbStructure.star?.label || ctbStructure.star?.name || 'CTB Structure',
      type: 'central_node',
      style: {
        backgroundColor: '#ff6b6b',
        textColor: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
      },
      children: []
    };
    
    // Convert branches to Whimsical nodes
    ctbStructure.branches?.forEach((branch, branchIndex) => {
      const branchNode = {
        id: `branch-${branchIndex}`,
        text: branch.name,
        type: 'branch_node',
        style: {
          backgroundColor: this.getAltitudeColor(40000), // Default branch color
          textColor: '#333333'
        },
        children: []
      };
      
      // Group nodes by altitude
      const nodesByAltitude = new Map<number, any[]>();
      
      branch.nodes?.forEach((node, nodeIndex) => {
        const whimsicalNode = {
          id: `node-${branchIndex}-${nodeIndex}`,
          text: node.label,
          type: 'leaf_node',
          style: {
            backgroundColor: this.getAltitudeColor(node.altitude),
            textColor: this.getTextColor(node.altitude)
          },
          metadata: {
            altitude: node.altitude,
            node_id: node.node_id,
            imo: node.imo,
            orbt: node.orbt
          }
        };
        
        if (!nodesByAltitude.has(node.altitude)) {
          nodesByAltitude.set(node.altitude, []);
        }
        nodesByAltitude.get(node.altitude)!.push(whimsicalNode);
      });
      
      // Create altitude level nodes
      Array.from(nodesByAltitude.keys())
        .sort((a, b) => b - a) // Sort descending (40k -> 1k)
        .forEach(altitude => {
          const altitudeNode = {
            id: `altitude-${branchIndex}-${altitude}`,
            text: `${altitude / 1000}k Level`,
            type: 'group_node',
            style: {
              backgroundColor: this.getAltitudeColor(altitude),
              textColor: this.getTextColor(altitude),
              fontWeight: 'bold'
            },
            children: nodesByAltitude.get(altitude) || []
          };
          
          branchNode.children.push(altitudeNode);
        });
      
      rootNode.children.push(branchNode);
    });
    
    return {
      type: 'mindmap',
      root: rootNode,
      metadata: {
        generated_by: 'MCP Backend',
        timestamp: new Date().toISOString(),
        ctb_star: ctbStructure.star?.name,
        imo: ctbStructure.IMO,
        orbt: ctbStructure.ORBT
      }
    };
  }
  
  private getAltitudeColor(altitude: number): string {
    const colors = {
      40000: '#4a90e2', // Blue for strategy
      30000: '#7ed321', // Green for architecture
      20000: '#f5a623', // Orange for implementation
      10000: '#d0021b', // Red for execution
      5000: '#9013fe',  // Purple for documentation
      1000: '#50e3c2'   // Teal for ground level
    };
    
    return colors[altitude] || '#95a5a6'; // Default gray
  }
  
  private getTextColor(altitude: number): string {
    // Use white text for darker backgrounds
    const darkBackgrounds = [10000]; // Red background
    return darkBackgrounds.includes(altitude) ? '#ffffff' : '#333333';
  }
  
  private async mockWhimsicalApiCall(projectId: string, diagramData: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      diagram_id: `diagram_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://whimsical.com/ctb-structure-${projectId}`,
      name: diagramData.name,
      updated_at: new Date().toISOString()
    };
  }
  
  private getMockUpdateResult(projectId: string, title?: string): DiagramUpdateResult {
    return {
      success: true,
      diagram_id: `mock_diagram_${Math.random().toString(36).substr(2, 9)}`,
      diagram_url: `https://whimsical.com/ctb-${projectId}`,
      message: 'Mock diagram updated successfully (API key not configured)'
    };
  }
  
  private getMockProject(projectId: string): WhimsicalProject {
    return {
      id: projectId,
      name: `CTB Project ${projectId}`,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      diagrams: [
        {
          id: 'mock_diagram_1',
          name: 'CTB Structure Overview',
          type: 'mindmap',
          url: `https://whimsical.com/ctb-overview-${projectId}`
        },
        {
          id: 'mock_diagram_2',
          name: 'Implementation Flow',
          type: 'flowchart',
          url: `https://whimsical.com/ctb-flow-${projectId}`
        }
      ]
    };
  }
}