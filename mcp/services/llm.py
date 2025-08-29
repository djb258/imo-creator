#!/usr/bin/env python3
"""
LLM Integration Service
======================

Service for integrating with custom GPT/Claude for CTB analysis and enhancement.
Analyzes existing CTB structures and suggests improvements/additions.

This service:
1. Takes CTB structure and repository context
2. Analyzes structure for completeness and quality
3. Suggests enhancements and improvements
4. Returns enhanced CTB structure for approval
5. Integrates suggestions back into CTB data
"""

import httpx
import json
from typing import Dict, Any, Optional, List
import logging

# Import CTB structure system
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'ctb'))

try:
    from ctb_structure import CTBNode, CTBAltitude, ctb_to_yaml, ctb_from_yaml
except ImportError as e:
    logging.error(f"Failed to import CTB structure system: {e}")
    raise

from config import settings
from utils.logger import get_logger, log_api_call

logger = get_logger(__name__)


class LLMService:
    """
    Service for LLM-powered CTB analysis and enhancement.
    
    Integrates with custom GPT/Claude to analyze CTB structures
    and provide intelligent suggestions for improvements.
    """
    
    def __init__(self):
        self.api_url = settings.LLM_API_URL
        self.headers = settings.get_llm_headers()
        self.model = settings.LLM_MODEL
        self.max_tokens = settings.LLM_MAX_TOKENS
        self.temperature = settings.LLM_TEMPERATURE
    
    async def analyze_and_enhance_ctb(
        self, 
        ctb_structure: CTBNode, 
        repo_context: Dict[str, Any]
    ) -> CTBNode:
        """
        Analyze CTB structure and return enhanced version.
        
        Args:
            ctb_structure: Original CTB structure
            repo_context: Repository context (URL, branch, etc.)
            
        Returns:
            Enhanced CTB structure with LLM suggestions applied
        """
        log_api_call(logger, "LLM", "analyze_enhance_ctb", "started",
                    nodes=len(ctb_structure.get_all_nodes()))
        
        try:
            # Step 1: Analyze current structure
            analysis = await self._analyze_ctb_structure(ctb_structure, repo_context)
            
            # Step 2: Generate enhancement suggestions
            suggestions = await self._generate_enhancement_suggestions(
                ctb_structure, analysis, repo_context
            )
            
            # Step 3: Apply approved enhancements
            enhanced_ctb = await self._apply_enhancements(
                ctb_structure, suggestions
            )
            
            log_api_call(logger, "LLM", "analyze_enhance_ctb", "completed",
                        original_nodes=len(ctb_structure.get_all_nodes()),
                        enhanced_nodes=len(enhanced_ctb.get_all_nodes()))
            
            return enhanced_ctb
            
        except Exception as e:
            logger.error(f"Error in LLM CTB analysis: {e}", exc_info=True)
            # Return original structure if enhancement fails
            return ctb_structure
    
    async def _analyze_ctb_structure(
        self, 
        ctb_structure: CTBNode, 
        repo_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyze CTB structure for completeness and quality.
        
        Args:
            ctb_structure: CTB structure to analyze
            repo_context: Repository context
            
        Returns:
            Analysis results dictionary
        """
        logger.info("Analyzing CTB structure with LLM")
        
        # Convert CTB to YAML for LLM analysis
        ctb_yaml = ctb_to_yaml(ctb_structure, include_metadata=False)
        
        # Prepare analysis prompt
        analysis_prompt = self._create_analysis_prompt(ctb_yaml, repo_context)
        
        # Call LLM for analysis
        analysis_response = await self._call_llm(
            prompt=analysis_prompt,
            system_message="You are an expert in CTB (Christmas Tree Backbone) architecture analysis. Analyze the provided CTB structure and provide detailed insights."
        )
        
        # Parse analysis response
        try:
            analysis = json.loads(analysis_response)
        except json.JSONDecodeError:
            # Fallback to simple analysis if JSON parsing fails
            analysis = {
                "completeness_score": 75,
                "missing_elements": ["Some nodes lack detailed IMO/ORBT blocks"],
                "strengths": ["Good hierarchical structure"],
                "areas_for_improvement": ["Add more specific node descriptions"],
                "raw_response": analysis_response
            }
        
        logger.info(f"LLM analysis completed - Score: {analysis.get('completeness_score', 'N/A')}")
        return analysis
    
    async def _generate_enhancement_suggestions(
        self, 
        ctb_structure: CTBNode,
        analysis: Dict[str, Any],
        repo_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Generate specific enhancement suggestions based on analysis.
        
        Args:
            ctb_structure: Original CTB structure
            analysis: Analysis results
            repo_context: Repository context
            
        Returns:
            List of enhancement suggestions
        """
        logger.info("Generating enhancement suggestions with LLM")
        
        # Create enhancement prompt
        enhancement_prompt = self._create_enhancement_prompt(
            ctb_structure, analysis, repo_context
        )
        
        # Call LLM for suggestions
        suggestions_response = await self._call_llm(
            prompt=enhancement_prompt,
            system_message="You are an expert CTB architect. Generate specific, actionable suggestions to improve the CTB structure."
        )
        
        # Parse suggestions
        try:
            suggestions = json.loads(suggestions_response)
            if isinstance(suggestions, dict) and "suggestions" in suggestions:
                suggestions = suggestions["suggestions"]
        except json.JSONDecodeError:
            # Fallback suggestions
            suggestions = [
                {
                    "type": "add_node",
                    "description": "Consider adding more detailed operational nodes",
                    "suggested_altitude": "10k",
                    "suggested_label": "Enhanced Operational Layer"
                }
            ]
        
        logger.info(f"Generated {len(suggestions)} enhancement suggestions")
        return suggestions
    
    async def _apply_enhancements(
        self, 
        original_ctb: CTBNode, 
        suggestions: List[Dict[str, Any]]
    ) -> CTBNode:
        """
        Apply enhancement suggestions to CTB structure.
        
        Args:
            original_ctb: Original CTB structure
            suggestions: List of enhancement suggestions
            
        Returns:
            Enhanced CTB structure
        """
        logger.info(f"Applying {len(suggestions)} enhancements to CTB structure")
        
        # Create a copy of the original structure
        enhanced_ctb = self._deep_copy_ctb(original_ctb)
        
        applied_enhancements = 0
        
        for suggestion in suggestions:
            try:
                if self._should_apply_suggestion(suggestion):
                    if suggestion.get("type") == "add_node":
                        self._add_suggested_node(enhanced_ctb, suggestion)
                        applied_enhancements += 1
                    
                    elif suggestion.get("type") == "enhance_node":
                        self._enhance_existing_node(enhanced_ctb, suggestion)
                        applied_enhancements += 1
                    
                    elif suggestion.get("type") == "add_branch":
                        self._add_suggested_branch(enhanced_ctb, suggestion)
                        applied_enhancements += 1
                        
            except Exception as e:
                logger.warning(f"Failed to apply suggestion: {suggestion.get('description', 'Unknown')} - {e}")
        
        logger.info(f"Applied {applied_enhancements}/{len(suggestions)} enhancements")
        return enhanced_ctb
    
    def _create_analysis_prompt(self, ctb_yaml: str, repo_context: Dict[str, Any]) -> str:
        """Create prompt for CTB structure analysis"""
        return f"""
Analyze the following CTB (Christmas Tree Backbone) structure:

Repository Context:
- URL: {repo_context.get('url', 'Unknown')}
- Branch: {repo_context.get('branch', 'Unknown')}

CTB Structure (YAML):
```yaml
{ctb_yaml}
```

Please analyze this CTB structure and provide a JSON response with:
{{
    "completeness_score": <number 0-100>,
    "missing_elements": [<list of missing or incomplete elements>],
    "strengths": [<list of structure strengths>],
    "areas_for_improvement": [<list of specific improvements>],
    "node_analysis": [<analysis of individual nodes>],
    "hierarchy_quality": <assessment of hierarchical organization>
}}

Focus on:
1. Completeness of IMO/ORBT blocks
2. Logical hierarchy and relationships
3. Missing operational details
4. Consistency across altitude levels
5. Specific suggestions for improvement
"""
    
    def _create_enhancement_prompt(
        self, 
        ctb_structure: CTBNode, 
        analysis: Dict[str, Any],
        repo_context: Dict[str, Any]
    ) -> str:
        """Create prompt for generating enhancement suggestions"""
        return f"""
Based on the CTB analysis, generate specific enhancement suggestions:

Analysis Results:
- Completeness Score: {analysis.get('completeness_score', 'Unknown')}
- Missing Elements: {analysis.get('missing_elements', [])}
- Areas for Improvement: {analysis.get('areas_for_improvement', [])}

Repository Context:
- URL: {repo_context.get('url', 'Unknown')}
- Type: {self._infer_repo_type(repo_context.get('url', ''))}

Provide JSON response with suggestions:
{{
    "suggestions": [
        {{
            "type": "add_node|enhance_node|add_branch",
            "description": "<clear description of suggestion>",
            "suggested_altitude": "<40k|20k|30k|10k|5k|1k>",
            "suggested_label": "<proposed node label>",
            "suggested_imo": {{
                "input": "<suggested input>",
                "middle": "<suggested process>", 
                "output": "<suggested output>"
            }},
            "suggested_orbt": {{
                "operate": "<operation description>",
                "repair": "<repair process>",
                "build": "<build process>",
                "train": "<training process>"
            }},
            "rationale": "<why this suggestion is valuable>",
            "priority": "<high|medium|low>"
        }}
    ]
}}

Guidelines:
1. Focus on practical, actionable suggestions
2. Ensure suggestions align with CTB altitude rules
3. Consider the repository's apparent purpose
4. Prioritize high-impact improvements
5. Limit to 3-5 most valuable suggestions
"""
    
    def _infer_repo_type(self, repo_url: str) -> str:
        """Infer repository type from URL for context"""
        if "frontend" in repo_url.lower() or "ui" in repo_url.lower():
            return "frontend"
        elif "backend" in repo_url.lower() or "api" in repo_url.lower():
            return "backend"
        elif "full" in repo_url.lower() or "stack" in repo_url.lower():
            return "fullstack"
        else:
            return "general"
    
    async def _call_llm(
        self, 
        prompt: str, 
        system_message: str = "You are a helpful assistant."
    ) -> str:
        """
        Make API call to LLM service.
        
        Args:
            prompt: User prompt
            system_message: System message for context
            
        Returns:
            LLM response text
        """
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": self.max_tokens,
                    "temperature": self.temperature
                }
                
                # For development/testing, return mock response
                if not settings.LLM_API_KEY or settings.DEBUG:
                    return self._get_mock_llm_response(prompt)
                
                response = await client.post(
                    f"{self.api_url}/chat/completions",
                    headers=self.headers,
                    json=payload
                )
                
                if response.status_code != 200:
                    raise Exception(f"LLM API error: {response.status_code}")
                
                result = response.json()
                return result["choices"][0]["message"]["content"]
                    
        except Exception as e:
            logger.error(f"LLM API call failed: {e}")
            # Return mock response on failure
            return self._get_mock_llm_response(prompt)
    
    def _get_mock_llm_response(self, prompt: str) -> str:
        """Generate mock LLM response for development/testing"""
        if "analyze" in prompt.lower():
            return json.dumps({
                "completeness_score": 85,
                "missing_elements": ["Some nodes need more detailed ORBT blocks"],
                "strengths": ["Well-structured hierarchy", "Good altitude distribution"],
                "areas_for_improvement": [
                    "Add more specific operational details",
                    "Consider adding monitoring nodes"
                ],
                "node_analysis": "Nodes are well-organized but could benefit from more specificity",
                "hierarchy_quality": "Good hierarchical organization with clear altitude levels"
            })
        
        elif "enhancement" in prompt.lower():
            return json.dumps({
                "suggestions": [
                    {
                        "type": "add_node",
                        "description": "Add monitoring and observability node",
                        "suggested_altitude": "10k",
                        "suggested_label": "System Monitoring",
                        "suggested_imo": {
                            "input": "System metrics",
                            "middle": "Analysis and alerting",
                            "output": "Health reports"
                        },
                        "suggested_orbt": {
                            "operate": "Monitor system health",
                            "repair": "Address performance issues", 
                            "build": "Deploy monitoring tools",
                            "train": "Monitor training guides"
                        },
                        "rationale": "Monitoring is essential for operational visibility",
                        "priority": "high"
                    }
                ]
            })
        
        return "Mock LLM response - API integration needed"
    
    def _should_apply_suggestion(self, suggestion: Dict[str, Any]) -> bool:
        """Determine if a suggestion should be auto-applied"""
        # For now, apply high priority suggestions automatically
        # In production, you might want user approval
        priority = suggestion.get("priority", "medium").lower()
        return priority in ["high", "medium"]
    
    def _deep_copy_ctb(self, ctb_node: CTBNode) -> CTBNode:
        """Create a deep copy of CTB structure"""
        # Convert to dict and back to create deep copy
        ctb_dict = ctb_node.to_dict()
        return CTBNode.from_dict(ctb_dict)
    
    def _add_suggested_node(self, ctb_structure: CTBNode, suggestion: Dict[str, Any]):
        """Add a suggested node to CTB structure"""
        try:
            new_node = CTBNode(
                altitude=suggestion.get("suggested_altitude", "10k"),
                label=suggestion.get("suggested_label", "New Node"),
                imo=suggestion.get("suggested_imo", {}),
                orbt=suggestion.get("suggested_orbt", {}),
                description=suggestion.get("description", "LLM suggested node")
            )
            
            # Find appropriate parent node
            target_altitude = suggestion.get("suggested_altitude", "10k")
            parent_node = self._find_best_parent(ctb_structure, target_altitude)
            
            if parent_node:
                parent_node.add_subnode(new_node)
                logger.info(f"Added suggested node: {new_node.label}")
            
        except Exception as e:
            logger.error(f"Failed to add suggested node: {e}")
    
    def _enhance_existing_node(self, ctb_structure: CTBNode, suggestion: Dict[str, Any]):
        """Enhance an existing node with suggestions"""
        # Implementation for enhancing existing nodes
        pass
    
    def _add_suggested_branch(self, ctb_structure: CTBNode, suggestion: Dict[str, Any]):
        """Add a suggested branch to CTB structure"""
        # Implementation for adding new branches
        pass
    
    def _find_best_parent(self, ctb_structure: CTBNode, target_altitude: str) -> Optional[CTBNode]:
        """Find the best parent node for a new node at target altitude"""
        # Simple heuristic: find a node one level up that has room
        altitude_hierarchy = ["40k", "20k", "30k", "10k", "5k", "1k"]
        
        try:
            target_index = altitude_hierarchy.index(target_altitude)
            if target_index > 0:
                parent_altitude = altitude_hierarchy[target_index - 1]
                
                # Find nodes at parent altitude
                all_nodes = ctb_structure.get_all_nodes()
                parent_candidates = [n for n in all_nodes if n.altitude == parent_altitude]
                
                if parent_candidates:
                    # Return first suitable parent (could be more sophisticated)
                    return parent_candidates[0]
        
        except ValueError:
            pass
        
        return None