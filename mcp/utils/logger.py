#!/usr/bin/env python3
"""
Logging Utilities for MCP Backend
=================================

Centralized logging configuration with structured formatting and
request tracking capabilities.
"""

import logging
import sys
from typing import Optional
from pathlib import Path

from config import settings


class RequestContextFilter(logging.Filter):
    """Add request context to log records"""
    
    def filter(self, record):
        # Add request ID if available (set by middleware)
        if not hasattr(record, 'request_id'):
            record.request_id = 'N/A'
        return True


class ColorFormatter(logging.Formatter):
    """Colored log formatter for development"""
    
    # ANSI color codes
    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m',  # Magenta
        'RESET': '\033[0m'       # Reset
    }
    
    def format(self, record):
        if settings.DEBUG:
            # Add color to level name
            level_color = self.COLORS.get(record.levelname, '')
            reset_color = self.COLORS['RESET']
            record.levelname = f"{level_color}{record.levelname}{reset_color}"
        
        return super().format(record)


def setup_logging():
    """
    Configure logging for the MCP backend.
    
    Sets up structured logging with request tracking and appropriate
    formatting based on environment.
    """
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Remove existing handlers
    root_logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Choose formatter based on environment
    if settings.DEBUG:
        formatter = ColorFormatter(
            '%(asctime)s - [%(request_id)s] - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    else:
        # Production: structured JSON-like format
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    
    console_handler.setFormatter(formatter)
    console_handler.addFilter(RequestContextFilter())
    root_logger.addHandler(console_handler)
    
    # File handler for production
    if not settings.DEBUG:
        file_handler = logging.FileHandler(log_dir / "mcp.log")
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        file_handler.addFilter(RequestContextFilter())
        root_logger.addHandler(file_handler)
        
        # Error file handler
        error_handler = logging.FileHandler(log_dir / "mcp_errors.log")
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        error_handler.addFilter(RequestContextFilter())
        root_logger.addHandler(error_handler)
    
    # Set specific logger levels
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    
    logging.info(f"✅ Logging configured - Level: {settings.LOG_LEVEL}")


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with consistent configuration.
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)


class LogContext:
    """Context manager for adding request-specific logging context"""
    
    def __init__(self, request_id: Optional[str] = None, **kwargs):
        self.request_id = request_id
        self.context = kwargs
        self.old_context = {}
    
    def __enter__(self):
        # Store old context and set new context
        logger = logging.getLogger()
        
        if self.request_id:
            # Set request ID in logger context
            for handler in logger.handlers:
                if hasattr(handler, 'addFilter'):
                    filter_instance = RequestContextFilter()
                    filter_instance.request_id = self.request_id
                    handler.addFilter(filter_instance)
        
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        # Restore old context
        pass


# Convenience functions for common logging patterns
def log_api_call(logger: logging.Logger, service: str, endpoint: str, 
                status: str = "started", **kwargs):
    """Log API call with consistent format"""
    extra_info = " - " + ", ".join(f"{k}={v}" for k, v in kwargs.items()) if kwargs else ""
    logger.info(f"API Call [{service}] {endpoint} - {status}{extra_info}")


def log_processing_step(logger: logging.Logger, step: str, status: str = "started", **kwargs):
    """Log processing step with consistent format"""
    extra_info = " - " + ", ".join(f"{k}={v}" for k, v in kwargs.items()) if kwargs else ""
    logger.info(f"Processing Step: {step} - {status}{extra_info}")


def log_error_with_context(logger: logging.Logger, error: Exception, 
                          context: str, **kwargs):
    """Log error with additional context"""
    extra_info = " - " + ", ".join(f"{k}={v}" for k, v in kwargs.items()) if kwargs else ""
    logger.error(f"Error in {context}: {str(error)}{extra_info}", exc_info=True)