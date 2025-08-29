#!/usr/bin/env node
/**
 * MCP Backend Server - TypeScript/Node.js Implementation
 * =====================================================
 * 
 * Mission Control Processor for orchestrating GitHub repositories,
 * Whimsical diagrams, Plasmic UIs, and LLM enhancements.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { githubWebhookRouter } from './routes/github';
import { ctbRouter } from './routes/ctb';
import { whimsicalRouter } from './routes/whimsical';
import { llmRouter } from './routes/llm';
import { healthRouter } from './routes/health';

// Load environment variables
dotenv.config();

// Configure logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'mcp-backend' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request tracking middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  next();
});

// API Routes
app.use('/health', healthRouter);
app.use('/webhooks/github', githubWebhookRouter);
app.use('/api/ctb', ctbRouter);
app.use('/api/whimsical', whimsicalRouter);
app.use('/api/llm', llmRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'MCP Backend Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      github_webhook: '/webhooks/github',
      ctb_operations: '/api/ctb/*',
      whimsical: '/api/whimsical/*',
      llm: '/api/llm/*'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const server = app.listen(PORT, HOST as string, () => {
  logger.info(`🚀 MCP Backend Server running on ${HOST}:${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://${HOST}:${PORT}/health`);
});

// Handle shutdown signals
const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export { app, logger };