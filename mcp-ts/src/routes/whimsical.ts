import { Router, Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import { logger } from '../server';
import { WhimsicalService } from '../services/whimsicalService';

const router = Router();
const whimsicalService = new WhimsicalService();

// Update Whimsical diagram with CTB data
router.post('/update', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project_id, ctb_structure, diagram_title } = req.body;
    
    if (!project_id) {
      return next(createError('project_id is required', 400, 'MISSING_PROJECT_ID'));
    }
    
    if (!ctb_structure) {
      return next(createError('ctb_structure is required', 400, 'MISSING_CTB_STRUCTURE'));
    }
    
    logger.info('Updating Whimsical diagram', {
      requestId: req.requestId,
      project_id,
      diagram_title
    });
    
    const result = await whimsicalService.updateDiagramWithCTB(
      project_id,
      ctb_structure,
      diagram_title
    );
    
    res.json({
      success: true,
      data: result,
      metadata: {
        project_id,
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      }
    });
    
  } catch (error) {
    next(error);
  }
});

// Get Whimsical project info
router.get('/project/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    logger.info('Getting Whimsical project info', {
      requestId: req.requestId,
      project_id: id
    });
    
    const projectInfo = await whimsicalService.getProjectInfo(id);
    
    res.json({
      success: true,
      data: projectInfo,
      metadata: {
        project_id: id,
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      }
    });
    
  } catch (error) {
    next(error);
  }
});

export { router as whimsicalRouter };