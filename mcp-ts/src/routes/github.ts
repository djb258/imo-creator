import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { createError } from '../middleware/errorHandler';
import { logger } from '../server';

const router = Router();

// GitHub webhook signature verification middleware
const verifyGitHubSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.get('X-Hub-Signature-256');
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  
  if (!secret) {
    logger.warn('GitHub webhook secret not configured');
    return next(createError('Webhook secret not configured', 500, 'WEBHOOK_SECRET_MISSING'));
  }
  
  if (!signature) {
    return next(createError('Missing GitHub signature', 400, 'SIGNATURE_MISSING'));
  }
  
  const payload = JSON.stringify(req.body);
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return next(createError('Invalid GitHub signature', 401, 'SIGNATURE_INVALID'));
  }
  
  next();
};

// GitHub webhook handler
router.post('/', verifyGitHubSignature, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.get('X-GitHub-Event');
    const payload = req.body;
    
    logger.info('GitHub webhook received', {
      requestId: req.requestId,
      event,
      repository: payload.repository?.full_name,
      action: payload.action,
      ref: payload.ref
    });
    
    // Handle different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(payload, req.requestId);
        break;
      case 'pull_request':
        await handlePullRequestEvent(payload, req.requestId);
        break;
      default:
        logger.info('Ignoring webhook event', { event, requestId: req.requestId });
    }
    
    res.json({
      message: 'Webhook processed successfully',
      event,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

// Handle push events
async function handlePushEvent(payload: any, requestId?: string) {
  const { repository, ref, commits } = payload;
  
  logger.info('Processing push event', {
    requestId,
    repository: repository.full_name,
    ref,
    commitCount: commits?.length || 0
  });
  
  // Check if this is a main/master branch push
  if (ref === 'refs/heads/main' || ref === 'refs/heads/master') {
    logger.info('Main branch push detected, triggering CTB processing', {
      requestId,
      repository: repository.full_name
    });
    
    // TODO: Process CTB structure
    // await processCTBStructure(repository.html_url, ref.replace('refs/heads/', ''));
    
    // TODO: Trigger LLM analysis
    // await analyzeCTBWithLLM(repository.html_url);
    
    // TODO: Update Whimsical diagrams
    // await updateWhimsicalDiagrams(repository.html_url);
  }
}

// Handle pull request events
async function handlePullRequestEvent(payload: any, requestId?: string) {
  const { action, pull_request, repository } = payload;
  
  logger.info('Processing pull request event', {
    requestId,
    action,
    pr: pull_request.number,
    repository: repository.full_name
  });
  
  if (action === 'opened' || action === 'synchronize') {
    logger.info('PR opened/updated, checking for CTB changes', {
      requestId,
      pr: pull_request.number
    });
    
    // TODO: Check if CTB files changed
    // TODO: Validate CTB structure
    // TODO: Post PR comment with validation results
  }
}

export { router as githubWebhookRouter };