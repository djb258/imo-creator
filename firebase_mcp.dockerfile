# Firebase MCP Server Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY firebase_mcp_package.json package.json
COPY firebase_mcp.js .

# Install dependencies
RUN npm install --production

# Create non-root user for security
RUN addgroup -g 1001 -S firebase && \
    adduser -S firebase -u 1001

# Change ownership of app directory
RUN chown -R firebase:firebase /app

# Switch to non-root user
USER firebase

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["node", "firebase_mcp.js"]

# Labels for metadata
LABEL maintainer="IMO-Creator Team"
LABEL description="Firebase MCP Server - Barton Doctrine Compliant"
LABEL version="1.0.0"
LABEL barton.doctrine.role="staging_memory"