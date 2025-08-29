import { Router, Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import { logger } from '../server';
import { LLMService } from '../services/llmService';

const router = Router();
const llmService = new LLMService();

// Analyze CTB structure with LLM
router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repo_url, branch = 'main', ctb_structure } = req.body;
    
    if (!repo_url && !ctb_structure) {
      return next(createError(
        'Either repo_url or ctb_structure is required',
        400,
        'MISSING_INPUT'
      ));
    }
    
    logger.info('Analyzing CTB structure with LLM', {
      requestId: req.requestId,
      repo_url,
      branch,
      hasStructure: !!ctb_structure
    });
    
    const analysis = await llmService.analyzeCTBStructure(
      repo_url,
      branch,
      ctb_structure
    );
    
    res.json({
      success: true,
      data: analysis,
      metadata: {
        repository: repo_url,
        branch,
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      }
    });
    
  } catch (error) {
    next(error);
  }
});

// Generate CTB enhancements
router.post('/enhance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repo_url, branch = 'main', ctb_structure, enhancement_request } = req.body;
    
    if (!repo_url && !ctb_structure) {
      return next(createError(
        'Either repo_url or ctb_structure is required',
        400,
        'MISSING_INPUT'
      ));
    }
    
    logger.info('Generating CTB enhancements with LLM', {
      requestId: req.requestId,
      repo_url,
      branch,
      hasStructure: !!ctb_structure,
      hasRequest: !!enhancement_request
    });
    
    const enhancements = await llmService.generateCTBEnhancements(
      repo_url,
      branch,
      ctb_structure,
      enhancement_request
    );
    
    res.json({
      success: true,
      data: enhancements,
      metadata: {
        repository: repo_url,
        branch,
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      }
    });
    
  } catch (error) {
    next(error);
  }
});

export { router as llmRouter };