#!/usr/bin/env python3
"""
MCP Configuration Management
===========================

Centralized configuration for the MCP backend server.
Handles environment variables, settings validation, and service configuration.
"""

import os
from typing import List, Optional
from pydantic import BaseSettings, validator
import logging


class Settings(BaseSettings):
    """
    Application settings with environment variable support.
    
    Environment variables can be prefixed with MCP_ (e.g., MCP_DEBUG=true)
    """
    
    # Server Configuration
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # GitHub Integration
    GITHUB_WEBHOOK_SECRET: Optional[str] = None
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_API_URL: str = "https://api.github.com"
    
    # Whimsical Integration
    WHIMSICAL_API_KEY: Optional[str] = None
    WHIMSICAL_API_URL: str = "https://whimsical.com/api/v1"
    
    # Plasmic Integration  
    PLASMIC_PROJECT_ID: Optional[str] = None
    PLASMIC_AUTH_TOKEN: Optional[str] = None
    PLASMIC_API_URL: str = "https://studio.plasmic.app/api/v1"
    
    # LLM Integration (Custom GPT)
    LLM_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gpt-4"
    LLM_API_URL: str = "https://api.openai.com/v1"
    LLM_MAX_TOKENS: int = 2000
    LLM_TEMPERATURE: float = 0.3
    
    # CTB Processing
    CTB_MAX_NODES: int = 100
    CTB_VALIDATION_STRICT: bool = True
    
    # Repository Processing
    REPO_CLONE_TIMEOUT: int = 300  # 5 minutes
    REPO_MAX_SIZE_MB: int = 100
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 3600  # 1 hour
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Validate environment setting"""
        valid_environments = ["development", "staging", "production"]
        if v not in valid_environments:
            raise ValueError(f"ENVIRONMENT must be one of: {valid_environments}")
        return v
    
    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        """Validate log level setting"""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"LOG_LEVEL must be one of: {valid_levels}")
        return v.upper()
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def validate_allowed_origins(cls, v):
        """Parse ALLOWED_ORIGINS from string if needed"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.ENVIRONMENT == "production"
    
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.ENVIRONMENT == "development"
    
    def get_github_headers(self) -> dict:
        """Get GitHub API headers with authentication"""
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MCP-Backend/1.0.0"
        }
        
        if self.GITHUB_TOKEN:
            headers["Authorization"] = f"token {self.GITHUB_TOKEN}"
        
        return headers
    
    def get_whimsical_headers(self) -> dict:
        """Get Whimsical API headers with authentication"""
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "MCP-Backend/1.0.0"
        }
        
        if self.WHIMSICAL_API_KEY:
            headers["Authorization"] = f"Bearer {self.WHIMSICAL_API_KEY}"
        
        return headers
    
    def get_plasmic_headers(self) -> dict:
        """Get Plasmic API headers with authentication"""
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "MCP-Backend/1.0.0"
        }
        
        if self.PLASMIC_AUTH_TOKEN:
            headers["Authorization"] = f"Bearer {self.PLASMIC_AUTH_TOKEN}"
        
        return headers
    
    def get_llm_headers(self) -> dict:
        """Get LLM API headers with authentication"""
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "MCP-Backend/1.0.0"
        }
        
        if self.LLM_API_KEY:
            headers["Authorization"] = f"Bearer {self.LLM_API_KEY}"
        
        return headers
    
    class Config:
        env_prefix = "MCP_"
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get global settings instance"""
    return settings


def validate_required_settings():
    """
    Validate that required settings are present for production.
    Called during application startup.
    """
    required_in_production = [
        "GITHUB_WEBHOOK_SECRET",
        "GITHUB_TOKEN", 
        "WHIMSICAL_API_KEY",
        "LLM_API_KEY"
    ]
    
    missing_settings = []
    
    if settings.is_production():
        for setting in required_in_production:
            if not getattr(settings, setting):
                missing_settings.append(setting)
    
    if missing_settings:
        error_msg = f"Missing required settings for production: {missing_settings}"
        logging.error(error_msg)
        raise ValueError(error_msg)
    
    logging.info("✅ Settings validation passed")


# Environment-specific configurations
ENVIRONMENT_CONFIGS = {
    "development": {
        "LOG_LEVEL": "DEBUG",
        "DEBUG": True,
        "ALLOWED_ORIGINS": ["*"]
    },
    "staging": {
        "LOG_LEVEL": "INFO", 
        "DEBUG": False,
        "ALLOWED_ORIGINS": ["https://staging.example.com"]
    },
    "production": {
        "LOG_LEVEL": "WARNING",
        "DEBUG": False,
        "ALLOWED_ORIGINS": ["https://example.com"]
    }
}


def apply_environment_config():
    """Apply environment-specific configuration overrides"""
    env_config = ENVIRONMENT_CONFIGS.get(settings.ENVIRONMENT, {})
    
    for key, value in env_config.items():
        if not os.getenv(f"MCP_{key}"):  # Only override if not explicitly set
            setattr(settings, key, value)
    
    logging.info(f"Applied {settings.ENVIRONMENT} environment configuration")


# Apply environment configuration on import
apply_environment_config()