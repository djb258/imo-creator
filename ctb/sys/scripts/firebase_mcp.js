#!/usr/bin/env node

/**
 * Firebase MCP Server - Barton Doctrine Compliant
 *
 * Purpose: Bridge between Composio and Firebase (staging memory)
 * Doctrine: Firebase = staging memory, Neon = vault, BigQuery = silo
 * Role: All agents must go through Composio, no direct DB calls
 */

const { admin } = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let firebaseApp;
let db;

try {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  db = admin.firestore();
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Barton Doctrine Schema Validation
const REQUIRED_FIELDS = ['unique_id', 'process_id', 'timestamp_last_touched', 'validated'];

function validateDoctrineSchema(payload) {
  const missing = REQUIRED_FIELDS.filter(field => !payload.hasOwnProperty(field));
  if (missing.length > 0) {
    throw new Error(`Barton Doctrine violation: Missing required fields: ${missing.join(', ')}`);
  }

  // Validate timestamp format
  if (typeof payload.timestamp_last_touched !== 'number') {
    throw new Error('Barton Doctrine violation: timestamp_last_touched must be a Unix timestamp');
  }

  // Validate boolean fields
  if (typeof payload.validated !== 'boolean') {
    throw new Error('Barton Doctrine violation: validated must be a boolean');
  }

  return true;
}

// Audit logging function
async function auditLog(operation, collection, docId, payload, result, error = null) {
  const auditEntry = {
    unique_id: `audit_${uuidv4()}`,
    process_id: `firebase_mcp.${operation}.${Date.now()}`,
    timestamp_last_touched: Date.now(),
    validated: true,
    operation,
    collection,
    doc_id: docId || null,
    payload_keys: payload ? Object.keys(payload) : null,
    result_status: error ? 'error' : 'success',
    error_message: error?.message || null,
    timestamp: new Date().toISOString(),
    source: 'firebase_mcp_server'
  };

  try {
    await db.collection('firebase_audit_log').add(auditEntry);
  } catch (auditError) {
    console.error('Failed to write audit log:', auditError);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'firebase_mcp_server',
    firebase_connected: !!db,
    doctrine: 'barton_compliant'
  });
});

// MCP Tool: Firebase Write
app.post('/mcp/firebase_write', async (req, res) => {
  const { collection, payload } = req.body;

  try {
    // Validate inputs
    if (!collection || !payload) {
      throw new Error('Missing required parameters: collection, payload');
    }

    // Validate Barton Doctrine schema
    validateDoctrineSchema(payload);

    // Add server-side metadata
    const docData = {
      ...payload,
      _created_at: new Date().toISOString(),
      _created_by: 'firebase_mcp_server',
      _doctrine_compliant: true
    };

    // Write to Firestore
    const docRef = await db.collection(collection).add(docData);
    const result = { doc_id: docRef.id, collection };

    // Audit log
    await auditLog('write', collection, docRef.id, payload, result);

    res.json({
      success: true,
      data: result,
      message: `Document written to ${collection}`,
      doctrine_status: 'validated'
    });

  } catch (error) {
    await auditLog('write', collection, null, payload, null, error);
    res.status(400).json({
      success: false,
      error: error.message,
      doctrine_status: 'violation'
    });
  }
});

// MCP Tool: Firebase Read
app.post('/mcp/firebase_read', async (req, res) => {
  const { collection, query = {} } = req.body;

  try {
    if (!collection) {
      throw new Error('Missing required parameter: collection');
    }

    let queryRef = db.collection(collection);

    // Apply query filters
    if (query.where) {
      query.where.forEach(([field, operator, value]) => {
        queryRef = queryRef.where(field, operator, value);
      });
    }

    if (query.orderBy) {
      const [field, direction = 'asc'] = query.orderBy;
      queryRef = queryRef.orderBy(field, direction);
    }

    if (query.limit) {
      queryRef = queryRef.limit(query.limit);
    }

    const snapshot = await queryRef.get();
    const docs = [];

    snapshot.forEach(doc => {
      docs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const result = { docs, count: docs.length };

    // Audit log
    await auditLog('read', collection, null, query, result);

    res.json({
      success: true,
      data: result,
      message: `Retrieved ${docs.length} documents from ${collection}`
    });

  } catch (error) {
    await auditLog('read', collection, null, query, null, error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// MCP Tool: Firebase Update
app.post('/mcp/firebase_update', async (req, res) => {
  const { collection, docId, fields } = req.body;

  try {
    if (!collection || !docId || !fields) {
      throw new Error('Missing required parameters: collection, docId, fields');
    }

    // Validate Barton Doctrine schema for updates
    validateDoctrineSchema(fields);

    // Add update metadata
    const updateData = {
      ...fields,
      _updated_at: new Date().toISOString(),
      _updated_by: 'firebase_mcp_server'
    };

    await db.collection(collection).doc(docId).update(updateData);
    const result = { doc_id: docId, collection, updated_fields: Object.keys(fields) };

    // Audit log
    await auditLog('update', collection, docId, fields, result);

    res.json({
      success: true,
      data: result,
      message: `Document ${docId} updated in ${collection}`,
      doctrine_status: 'validated'
    });

  } catch (error) {
    await auditLog('update', collection, docId, fields, null, error);
    res.status(400).json({
      success: false,
      error: error.message,
      doctrine_status: 'violation'
    });
  }
});

// MCP Tool: Firebase Delete (Soft Delete)
app.post('/mcp/firebase_delete', async (req, res) => {
  const { collection, docId } = req.body;

  try {
    if (!collection || !docId) {
      throw new Error('Missing required parameters: collection, docId');
    }

    // Soft delete - mark as deleted instead of actual deletion
    const softDeleteData = {
      _deleted: true,
      _deleted_at: new Date().toISOString(),
      _deleted_by: 'firebase_mcp_server',
      timestamp_last_touched: Date.now()
    };

    await db.collection(collection).doc(docId).update(softDeleteData);
    const result = { doc_id: docId, collection, operation: 'soft_delete' };

    // Audit log
    await auditLog('delete', collection, docId, {}, result);

    res.json({
      success: true,
      data: result,
      message: `Document ${docId} soft deleted in ${collection}`,
      doctrine_status: 'compliant'
    });

  } catch (error) {
    await auditLog('delete', collection, docId, {}, null, error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// MCP Tool: Firebase Studio List
app.get('/mcp/firebase_studio_list', async (req, res) => {
  try {
    // Query the studio_apps collection for deployed apps
    const snapshot = await db.collection('studio_apps')
      .where('_deleted', '!=', true)
      .orderBy('_created_at', 'desc')
      .get();

    const apps = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      apps.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        status: data.status,
        deployment_url: data.deployment_url,
        github_repo: data.github_repo,
        last_deployed: data.last_deployed,
        created_at: data._created_at
      });
    });

    const result = { apps, count: apps.length };

    // Audit log
    await auditLog('studio_list', 'studio_apps', null, {}, result);

    res.json({
      success: true,
      data: result,
      message: `Retrieved ${apps.length} Studio apps`
    });

  } catch (error) {
    await auditLog('studio_list', 'studio_apps', null, {}, null, error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// MCP Tool: Firebase Studio Deploy
app.post('/mcp/firebase_studio_deploy', async (req, res) => {
  const { appId, githubRepo, branch = 'main' } = req.body;

  try {
    if (!appId || !githubRepo) {
      throw new Error('Missing required parameters: appId, githubRepo');
    }

    // Update app deployment status
    const deploymentData = {
      status: 'deploying',
      deployment_triggered_at: new Date().toISOString(),
      deployment_triggered_by: 'firebase_mcp_server',
      github_repo: githubRepo,
      branch,
      timestamp_last_touched: Date.now()
    };

    await db.collection('studio_apps').doc(appId).update(deploymentData);

    // TODO: Trigger GitHub Action via API
    // This would typically call GitHub's API to trigger a workflow
    const mockDeploymentId = `deploy_${Date.now()}`;

    const result = {
      app_id: appId,
      deployment_id: mockDeploymentId,
      status: 'triggered',
      github_repo: githubRepo,
      branch
    };

    // Audit log
    await auditLog('studio_deploy', 'studio_apps', appId, req.body, result);

    res.json({
      success: true,
      data: result,
      message: `Deployment triggered for app ${appId}`,
      note: 'GitHub Action integration pending'
    });

  } catch (error) {
    await auditLog('studio_deploy', 'studio_apps', appId, req.body, null, error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Root endpoint - list all MCP tools
app.get('/', (req, res) => {
  res.json({
    service: 'Firebase MCP Server',
    doctrine: 'Barton Compliant',
    description: 'Firebase = staging memory, Neon = vault, BigQuery = silo',
    mcp_tools: [
      {
        name: 'firebase_write',
        method: 'POST',
        endpoint: '/mcp/firebase_write',
        description: 'Write document to Firebase with Barton Doctrine validation'
      },
      {
        name: 'firebase_read',
        method: 'POST',
        endpoint: '/mcp/firebase_read',
        description: 'Read documents from Firebase with query support'
      },
      {
        name: 'firebase_update',
        method: 'POST',
        endpoint: '/mcp/firebase_update',
        description: 'Update document in Firebase with Barton Doctrine validation'
      },
      {
        name: 'firebase_delete',
        method: 'POST',
        endpoint: '/mcp/firebase_delete',
        description: 'Soft delete document in Firebase'
      },
      {
        name: 'firebase_studio_list',
        method: 'GET',
        endpoint: '/mcp/firebase_studio_list',
        description: 'List deployed Firebase Studio apps'
      },
      {
        name: 'firebase_studio_deploy',
        method: 'POST',
        endpoint: '/mcp/firebase_studio_deploy',
        description: 'Trigger deployment of Firebase Studio app from GitHub'
      }
    ],
    required_env_vars: [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_DATABASE_URL',
      'FIREBASE_STORAGE_BUCKET'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    doctrine_status: 'server_error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Firebase MCP Server running on port ${PORT}`);
  console.log(`📋 Barton Doctrine: Firebase = staging memory`);
  console.log(`🔗 All operations require: unique_id, process_id, timestamp_last_touched, validated`);
});

module.exports = app;