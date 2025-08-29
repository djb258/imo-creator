import { Request, Response, NextFunction } from 'express';
import { logger } from '../server';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  logger.error('Request error', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    statusCode,
    message,
    stack: error.stack,
    code: error.code
  });

  res.status(statusCode).json({
    error: {
      message,
      code: error.code || 'INTERNAL_ERROR',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    }
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    }
  });
};

export const createError = (message: string, statusCode = 500, code?: string): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};