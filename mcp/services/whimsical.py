#!/usr/bin/env python3
"""
Whimsical Integration Service
============================

Service for updating Whimsical diagrams with CTB structure data.
Handles the one-way flow: GitHub → MCP → Whimsical (visualization only).

This service:
1. Takes CTB structure data
2. Converts to Whimsical-compatible format
3. Updates Whimsical diagrams via API
4. Returns update status and diagram URLs
"""

import httpx
from typing import Dict, Any, Optional
import logging
import json

from config import settings
from utils.logger import get_logger, log_api_call

logger = get_logger(__name__)


class WhimsicalService:
    """
    Service for integrating with Whimsical API.
    
    Provides methods to update diagrams with CTB structure data.
    Note: This is a one-way integration - we only push to Whimsical.
    """
    
    def __init__(self):
        self.base_url = settings.WHIMSICAL_API_URL
        self.headers = settings.get_whimsical_headers()
    
    async def update_diagram(
        self, 
        project_url: str, 
        ctb_structure,  # CTBNode instance
        diagram_type: str = "mindmap"
    ) -> Dict[str, Any]:
        """
        Update a Whimsical diagram with CTB structure.
        
        Args:
            project_url: Whimsical project URL
            ctb_structure: CTBNode instance with CTB data
            diagram_type: Type of diagram to create/update
            
        Returns:
            Dictionary with update results and diagram info
        """
        log_api_call(logger, "Whimsical", "update_diagram", "started",
                    project_url=project_url)
        
        try:
            # Extract project ID from URL
            project_id = self._extract_project_id(project_url)
            
            if not project_id:
                raise ValueError("Could not extract project ID from Whimsical URL")
            
            # Convert CTB structure to Whimsical format
            whimsical_data = self._convert_ctb_to_whimsical(ctb_structure)
            
            # Update or create diagram
            result = await self._update_whimsical_diagram(
                project_id=project_id,
                diagram_data=whimsical_data,
                diagram_type=diagram_type
            )
            
            log_api_call(logger, "Whimsical", "update_diagram", "completed",
                        diagram_id=result.get('diagram_id'))
            
            return result
            
        except Exception as e:
            logger.error(f"Error updating Whimsical diagram: {e}", exc_info=True)
            raise
    
    def _extract_project_id(self, project_url: str) -> Optional[str]:
        """
        Extract project ID from Whimsical project URL.
        
        Args:
            project_url: Whimsical project URL
            
        Returns:
            Project ID or None if extraction fails
        """
        try:
            # Example Whimsical URL format: https://whimsical.com/project/ABC123
            if "/project/" in project_url:
                return project_url.split("/project/")[1].split("/")[0]
            
            # Alternative format handling
            if "whimsical.com/" in project_url:
                path_parts = project_url.split("whimsical.com/")[1].split("/")
                if path_parts:
                    return path_parts[0]
            
            logger.warning(f"Unable to extract project ID from URL: {project_url}")
            return None
            
        except Exception as e:
            logger.error(f"Error extracting project ID: {e}")
            return None
    
    def _convert_ctb_to_whimsical(self, ctb_structure) -> Dict[str, Any]:
        """
        Convert CTB structure to Whimsical-compatible format.
        
        Args:
            ctb_structure: CTBNode instance
            
        Returns:
            Dictionary with Whimsical diagram data
        """
        try:
            # Build Whimsical mindmap structure
            mindmap_data = {
                "type": "mindmap",
                "title": ctb_structure.label,
                "nodes": [],
                "connections": []
            }
            
            # Convert CTB nodes to Whimsical nodes
            all_nodes = ctb_structure.get_all_nodes()
            node_positions = self._calculate_node_positions(all_nodes)
            
            for i, node in enumerate(all_nodes):
                whimsical_node = {
                    "id": f"node_{i}",
                    "text": node.label,
                    "position": node_positions.get(node.node_id, {"x": 0, "y": 0}),
                    "metadata": {
                        "altitude": node.altitude,
                        "node_id": node.node_id,
                        "ctb_type": self._get_node_type_from_altitude(node.altitude)
                    }
                }
                
                # Add IMO/ORBT details if present
                if node.imo and node.imo != "A":
                    whimsical_node["metadata"]["imo"] = node.imo
                
                if node.orbt and node.orbt != "A":
                    whimsical_node["metadata"]["orbt"] = node.orbt
                
                # Add styling based on altitude
                whimsical_node["style"] = self._get_node_style(node.altitude)
                
                mindmap_data["nodes"].append(whimsical_node)
            
            # Create connections based on CTB hierarchy
            connections = self._create_node_connections(ctb_structure)
            mindmap_data["connections"] = connections
            
            return mindmap_data
            
        except Exception as e:
            logger.error(f"Error converting CTB to Whimsical format: {e}")
            raise
    
    def _calculate_node_positions(self, nodes) -> Dict[str, Dict[str, int]]:
        """
        Calculate positions for nodes in Whimsical diagram.
        
        Creates a hierarchical layout based on CTB altitude levels.
        """
        positions = {}
        altitude_levels = {
            "40k": {"y": 0, "nodes": []},      # Star level
            "20k": {"y": 150, "nodes": []},    # Branch level  
            "30k": {"y": 300, "nodes": []},    # High level
            "10k": {"y": 450, "nodes": []},    # Medium level
            "5k": {"y": 600, "nodes": []},     # Low level
            "1k": {"y": 750, "nodes": []}      # Ground level
        }
        
        # Group nodes by altitude
        for node in nodes:
            if node.altitude in altitude_levels:
                altitude_levels[node.altitude]["nodes"].append(node)
        
        # Calculate positions within each level
        for altitude, level_data in altitude_levels.items():
            level_nodes = level_data["nodes"]
            y_position = level_data["y"]
            
            if not level_nodes:
                continue
            
            # Space nodes horizontally
            total_width = 800  # Total width for node distribution
            node_spacing = total_width // max(1, len(level_nodes))
            start_x = -total_width // 2
            
            for i, node in enumerate(level_nodes):
                positions[node.node_id] = {
                    "x": start_x + (i * node_spacing),
                    "y": y_position
                }
        
        return positions
    
    def _get_node_type_from_altitude(self, altitude: str) -> str:
        """Get node type based on altitude"""
        type_mapping = {
            "40k": "star",
            "20k": "branch", 
            "30k": "high_node",
            "10k": "medium_node",
            "5k": "low_node",
            "1k": "ground_node"
        }
        return type_mapping.get(altitude, "unknown")
    
    def _get_node_style(self, altitude: str) -> Dict[str, Any]:
        """Get Whimsical styling for node based on altitude"""
        style_mapping = {
            "40k": {"color": "#FF6B6B", "shape": "circle", "size": "large"},
            "20k": {"color": "#4ECDC4", "shape": "rectangle", "size": "medium"},
            "30k": {"color": "#45B7D1", "shape": "rectangle", "size": "medium"},
            "10k": {"color": "#96CEB4", "shape": "rectangle", "size": "small"},
            "5k": {"color": "#FECA57", "shape": "rectangle", "size": "small"},
            "1k": {"color": "#FF9FF3", "shape": "rectangle", "size": "small"}
        }
        return style_mapping.get(altitude, {"color": "#CCCCCC", "shape": "rectangle", "size": "small"})
    
    def _create_node_connections(self, ctb_structure) -> list:
        """
        Create connections between nodes based on CTB hierarchy.
        
        Args:
            ctb_structure: Root CTBNode
            
        Returns:
            List of connection objects for Whimsical
        """
        connections = []
        connection_id = 0
        
        def add_connections_for_node(node, node_index_map):
            nonlocal connection_id
            
            parent_index = node_index_map.get(node.node_id)
            
            for subnode in node.subnodes:
                child_index = node_index_map.get(subnode.node_id)
                
                if parent_index is not None and child_index is not None:
                    connections.append({
                        "id": f"conn_{connection_id}",
                        "from": f"node_{parent_index}",
                        "to": f"node_{child_index}",
                        "type": "straight"
                    })
                    connection_id += 1
                
                # Recursively add connections for subnodes
                add_connections_for_node(subnode, node_index_map)
        
        # Create mapping of node IDs to indices
        all_nodes = ctb_structure.get_all_nodes()
        node_index_map = {node.node_id: i for i, node in enumerate(all_nodes)}
        
        # Generate connections
        add_connections_for_node(ctb_structure, node_index_map)
        
        return connections
    
    async def _update_whimsical_diagram(
        self, 
        project_id: str, 
        diagram_data: Dict[str, Any],
        diagram_type: str = "mindmap"
    ) -> Dict[str, Any]:
        """
        Make API call to update Whimsical diagram.
        
        Args:
            project_id: Whimsical project ID
            diagram_data: Diagram data in Whimsical format
            diagram_type: Type of diagram
            
        Returns:
            API response with diagram info
        """
        # NOTE: This is a placeholder implementation
        # Actual Whimsical API integration would require:
        # 1. Real Whimsical API endpoints
        # 2. Proper authentication 
        # 3. Correct data format for their API
        
        logger.info(f"Updating Whimsical diagram for project {project_id}")
        
        try:
            # Simulate API call (replace with real Whimsical API)
            async with httpx.AsyncClient() as client:
                # Placeholder URL - replace with actual Whimsical API endpoint
                api_url = f"{self.base_url}/projects/{project_id}/diagrams"
                
                # Prepare payload
                payload = {
                    "type": diagram_type,
                    "data": diagram_data,
                    "title": f"CTB Structure - {diagram_data.get('title', 'Untitled')}"
                }
                
                logger.debug(f"Sending payload to Whimsical: {json.dumps(payload, indent=2)}")
                
                # For now, return a mock success response
                # In real implementation, use:
                # async with session.post(api_url, headers=self.headers, json=payload) as response:
                #     result = await response.json()
                #     return result
                
                # Mock response
                mock_response = {
                    "success": True,
                    "diagram_id": f"diagram_{project_id}_{diagram_type}",
                    "project_id": project_id,
                    "diagram_url": f"https://whimsical.com/project/{project_id}/diagram/{diagram_type}",
                    "updated_at": "2024-08-29T12:00:00Z",
                    "nodes_count": len(diagram_data.get("nodes", [])),
                    "connections_count": len(diagram_data.get("connections", []))
                }
                
                logger.info(f"Mock Whimsical update completed: {mock_response}")
                return mock_response
                
        except Exception as e:
            logger.error(f"Error calling Whimsical API: {e}", exc_info=True)
            raise
    
    async def get_project_info(self, project_url: str) -> Optional[Dict[str, Any]]:
        """
        Get information about a Whimsical project.
        
        Args:
            project_url: Whimsical project URL
            
        Returns:
            Project information or None if not found
        """
        try:
            project_id = self._extract_project_id(project_url)
            
            if not project_id:
                return None
            
            # Mock project info (replace with real API call)
            project_info = {
                "project_id": project_id,
                "project_url": project_url,
                "title": "CTB Diagram Project",
                "diagrams": [
                    {
                        "id": f"diagram_{project_id}",
                        "type": "mindmap",
                        "title": "CTB Structure",
                        "last_updated": "2024-08-29T12:00:00Z"
                    }
                ]
            }
            
            return project_info
            
        except Exception as e:
            logger.error(f"Error getting project info: {e}")
            return None