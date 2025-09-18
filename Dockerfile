# Multi-stage Docker build for MCP servers
FROM node:18-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    bash \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .env.template .env

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Development stage
FROM base AS development
EXPOSE 3000-3020
CMD ["npm", "run", "mcp:start"]

# Production stage
FROM base AS production

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN groupadd -r nodejs -g 1001 && \
    useradd -r -u 1001 -g nodejs mcp

# Change ownership
RUN chown -R mcp:nodejs /app
USER mcp

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000-3020

CMD ["npm", "run", "mcp:start"]