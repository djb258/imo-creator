# Repo-Lens UI

Repository picker and launcher interface for IMO Creator ecosystem.

## Purpose
- **Select** repositories for processing
- **Launch** appropriate cockpit (Factory for new, Mechanic for existing)
- **Monitor** compliance scores and health status
- **Track** processed repositories

## Integration Points
- **Factory**: Create new compliant applications
- **Mechanic**: Recall and repair existing repositories
- **Garage-MCP**: Orchestration and subagent coordination
- **HEIR System**: Error handling and altitude management

## Workflow
1. User selects repository from list or provides path/URL
2. Repo-Lens analyzes repository type and status
3. Routes to appropriate tool:
   - New/Empty → Factory (init)
   - Existing → Mechanic (recall)
   - Complex → Garage-MCP orchestration
4. Monitors compliance and health post-processing

## Status
- Picker UI: In development
- Integration: Ready (uses IMO-Creator factory/mechanic)
- Monitoring: Via compliance heartbeat system