import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      github: {
        configured: !!process.env.GITHUB_TOKEN,
        webhook_secret: !!process.env.GITHUB_WEBHOOK_SECRET
      },
      whimsical: {
        configured: !!process.env.WHIMSICAL_API_KEY
      },
      llm: {
        configured: !!process.env.LLM_API_KEY,
        model: process.env.LLM_MODEL || 'gpt-4'
      },
      plasmic: {
        configured: !!process.env.PLASMIC_AUTH_TOKEN
      }
    }
  });
});

export { router as healthRouter };