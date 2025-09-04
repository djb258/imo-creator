const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const orchestrationRoutes = require('../routes/orchestration');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'cold-outreach-toolchain',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    transport: process.env.TRANSPORT_TYPE || 'rest',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/v1', orchestrationRoutes);

// Serve static files from UI directory
app.use('/ui', express.static(path.join(__dirname, '../ui')));

// Default API info endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'Cold Outreach Toolchain API',
    version: '1.0.0',
    description: 'Minimal, modular cold-outreach toolchain with swappable transports',
    transport: process.env.TRANSPORT_TYPE || 'rest',
    endpoints: {
      'POST /api/v1/complete-pipeline': 'Run complete cold outreach pipeline',
      'POST /api/v1/scrape': 'Scrape contacts for a company',
      'POST /api/v1/verify': 'Verify email addresses',
      'POST /api/v1/database/:operation': 'Execute database operations',
      'GET /api/v1/freshness/report/:company_id?': 'Get data freshness report',
      'POST /api/v1/transport/switch': 'Switch between REST and MCP transport',
      'GET /api/v1/transport/status': 'Get current transport status',
      'GET /health': 'Health check endpoint',
      'GET /ui': 'Basic web UI for testing'
    },
    available_operations: {
      database: ['insert_contacts', 'update_verification', 'get_contacts', 'assign_slots'],
      transport_types: ['rest', 'mcp']
    }
  });
});

// Serve basic UI at root
app.get('/', (req, res) => {
  res.redirect('/ui');
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('[ERROR]', error.message);
  console.error(error.stack);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message,
      type: error.name || 'ServerError',
      timestamp: new Date().toISOString()
    },
    request_id: req.headers['x-request-id'] || 'unknown'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      type: 'NotFoundError',
      timestamp: new Date().toISOString()
    }
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[SERVER] Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('[SERVER] Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SERVER] Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('[SERVER] Process terminated');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('COLD OUTREACH TOOLCHAIN SERVER STARTED');
  console.log('='.repeat(60));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Transport: ${process.env.TRANSPORT_TYPE || 'rest'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api`);
  console.log(`UI: http://localhost:${PORT}/ui`);
  console.log('='.repeat(60));
  
  // Log configuration
  const config = {
    database: process.env.NEON_CONNECTION_STRING ? 'Connected' : 'Not configured',
    apify: process.env.APIFY_API_KEY ? 'Configured' : 'Not configured',
    millionverifier: process.env.MILLIONVERIFIER_API_KEY ? 'Configured' : 'Not configured'
  };
  
  console.log('Configuration status:');
  Object.entries(config).forEach(([service, status]) => {
    console.log(`  ${service}: ${status}`);
  });
  console.log('='.repeat(60));
});

module.exports = app;