import { Router, Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import { logger } from '../server';
import { CTBService } from '../services/ctbService';

const router = Router();
const ctbService = new CTBService();

// Parse CTB structure from repository
router.get('/parse', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repo_url, branch = 'main' } = req.query;
    
    if (!repo_url || typeof repo_url !== 'string') {
      return next(createError('repo_url parameter is required', 400, 'MISSING_REPO_URL'));
    }
    
    logger.info('Parsing CTB structure', {
      requestId: req.requestId,
      repo_url,
      branch
    });
    
    const ctbStructure = await ctbService.parseCTBFromRepository(
      repo_url,
      branch as string
    );
    
    if (!ctbStructure) {
      return next(createError('CTB structure not found or invalid', 404, 'CTB_NOT_FOUND'));
    }
    
    res.json({
      success: true,
      data: ctbStructure,
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

// Validate CTB structure
router.get('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repo_url, branch = 'main' } = req.query;
    
    if (!repo_url || typeof repo_url !== 'string') {
      return next(createError('repo_url parameter is required', 400, 'MISSING_REPO_URL'));
    }
    
    logger.info('Validating CTB structure', {
      requestId: req.requestId,
      repo_url,
      branch
    });
    
    const validation = await ctbService.validateCTBStructure(
      repo_url,
      branch as string
    );
    
    res.json({
      success: true,
      data: validation,
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

// Get CTB summary
router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repo_url, branch = 'main' } = req.query;
    
    if (!repo_url || typeof repo_url !== 'string') {
      return next(createError('repo_url parameter is required', 400, 'MISSING_REPO_URL'));
    }
    
    logger.info('Getting CTB summary', {
      requestId: req.requestId,
      repo_url,
      branch
    });
    
    const summary = await ctbService.getCTBSummary(
      repo_url,
      branch as string
    );
    
    if (!summary) {
      return next(createError('CTB structure not found', 404, 'CTB_NOT_FOUND'));
    }
    
    res.json({
      success: true,
      data: summary,
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

export { router as ctbRouter };