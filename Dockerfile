# Multi-stage Docker build for MCP servers
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash \
    curl \
    git

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
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

# Change ownership
RUN chown -R mcp:nodejs /app
USER mcp

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000-3020

CMD ["npm", "run", "mcp:start"]