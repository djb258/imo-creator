/**
 * Multi-Database Connection Router
 * Manages connection pools for multiple databases while maintaining control
 */

const { Pool } = require('pg');
const { BigQuery } = require('@google-cloud/bigquery');
const admin = require('firebase-admin');

class DatabaseRouter {
  constructor() {
    this.pools = new Map();
    this.queryStats = new Map();
    
    this.initializePools();
  }

  initializePools() {
    const databases = {
      // PostgreSQL Databases
      neon: {
        type: 'postgresql',
        url: process.env.NEON_DATABASE_URL,
        user: process.env.NEON_APP_USER || 'mcp_app',
        maxConnections: 5
      },
      
      marketing: {
        type: 'postgresql',
        url: process.env.MARKETING_DATABASE_URL,
        user: process.env.MARKETING_APP_USER || 'marketing_app',
        maxConnections: 3
      },
      
      real_estate: {
        type: 'postgresql',
        url: process.env.REAL_ESTATE_DATABASE_URL,
        user: process.env.REAL_ESTATE_APP_USER || 'realestate_app',
        maxConnections: 3
      },
      
      command_ops: {
        type: 'postgresql',
        url: process.env.COMMAND_OPS_DATABASE_URL,
        user: process.env.COMMAND_OPS_APP_USER || 'commandops_app',
        maxConnections: 4
      },
      
      audit_logs: {
        type: 'postgresql',
        url: process.env.AUDIT_DATABASE_URL || process.env.NEON_DATABASE_URL,
        user: process.env.AUDIT_APP_USER || 'audit_app',
        maxConnections: 5
      },

      // BigQuery Databases
      bigquery: {
        type: 'bigquery',
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
        location: process.env.BIGQUERY_LOCATION || 'US'
      },

      // Firebase Databases
      firebase: {
        type: 'firebase',
        serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID
      }
    };

    for (const [dbName, config] of Object.entries(databases)) {
      console.log(`🔗 Initializing ${dbName} database connection...`);

      try {
        if (config.type === 'postgresql') {
          if (config.url) {
            const pool = new Pool({
              connectionString: config.url,
              max: config.maxConnections,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 2000,
              user: config.user
            });

            // Test connection on startup
            pool.connect()
              .then(client => {
                client.release();
                console.log(`✅ ${dbName} PostgreSQL database connected`);
              })
              .catch(err => {
                console.error(`❌ ${dbName} PostgreSQL connection failed:`, err.message);
              });

            this.pools.set(dbName, pool);
            this.queryStats.set(dbName, { queries: 0, errors: 0, lastUsed: Date.now() });
          } else {
            console.warn(`⚠️  No connection string configured for ${dbName}`);
          }
        }

        else if (config.type === 'bigquery') {
          if (config.projectId) {
            const bigqueryOptions = {
              projectId: config.projectId,
              location: config.location
            };

            if (config.keyFilename) {
              bigqueryOptions.keyFilename = config.keyFilename;
            }

            const bigqueryClient = new BigQuery(bigqueryOptions);

            // Test BigQuery connection
            bigqueryClient.getDatasets()
              .then(() => {
                console.log(`✅ ${dbName} BigQuery client connected`);
              })
              .catch(err => {
                console.error(`❌ ${dbName} BigQuery connection failed:`, err.message);
              });

            this.pools.set(dbName, bigqueryClient);
            this.queryStats.set(dbName, { queries: 0, errors: 0, lastUsed: Date.now() });
          } else {
            console.warn(`⚠️  No project ID configured for ${dbName}`);
          }
        }

        else if (config.type === 'firebase') {
          if (config.projectId) {
            let serviceAccount;
            
            // Handle service account key (JSON string or file path)
            if (config.serviceAccountKey) {
              try {
                serviceAccount = typeof config.serviceAccountKey === 'string' 
                  ? JSON.parse(config.serviceAccountKey)
                  : config.serviceAccountKey;
              } catch (e) {
                console.error(`❌ Invalid Firebase service account key for ${dbName}`);
                continue;
              }
            }

            const firebaseConfig = {
              projectId: config.projectId
            };

            if (config.databaseURL) {
              firebaseConfig.databaseURL = config.databaseURL;
            }

            if (serviceAccount) {
              firebaseConfig.credential = admin.credential.cert(serviceAccount);
            }

            // Initialize Firebase app with unique name
            const firebaseApp = admin.initializeApp(firebaseConfig, dbName);
            const firestore = firebaseApp.firestore();

            // Test Firebase connection
            firestore.listCollections()
              .then(() => {
                console.log(`✅ ${dbName} Firebase/Firestore connected`);
              })
              .catch(err => {
                console.error(`❌ ${dbName} Firebase connection failed:`, err.message);
              });

            this.pools.set(dbName, { app: firebaseApp, firestore });
            this.queryStats.set(dbName, { queries: 0, errors: 0, lastUsed: Date.now() });
          } else {
            console.warn(`⚠️  No project ID configured for ${dbName}`);
          }
        }

      } catch (error) {
        console.error(`❌ Failed to initialize ${dbName}:`, error.message);
      }
    }
  }

  // Get connection for specific database
  async getConnection(databaseName = 'neon') {
    const connection = this.pools.get(databaseName);
    if (!connection) {
      throw new Error(`Database '${databaseName}' not configured`);
    }
    
    // For PostgreSQL pools, return connection
    if (connection.connect) {
      return connection.connect();
    }
    
    // For BigQuery/Firebase, return the client directly
    return connection;
  }

  // Execute query on specific database with safety checks
  async query(databaseName, queryText, params = []) {
    const connection = this.pools.get(databaseName);
    if (!connection) {
      throw new Error(`Database '${databaseName}' not configured`);
    }

    // Update stats
    const stats = this.queryStats.get(databaseName);
    stats.queries++;
    stats.lastUsed = Date.now();

    try {
      // PostgreSQL queries
      if (connection.query) {
        // Block dangerous operations for SQL databases
        const forbidden = ['CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'TRUNCATE', 'DELETE FROM'];
        const upperQuery = queryText.toUpperCase().trim();
        
        const hasForbidden = forbidden.some(cmd => upperQuery.includes(cmd));
        if (hasForbidden) {
          throw new Error(`DDL/Destructive operations not allowed: ${queryText.substring(0, 50)}...`);
        }

        return await connection.query(queryText, params);
      }

      // BigQuery queries
      if (connection.query && connection.getDatasets) {
        const [rows] = await connection.query({
          query: queryText,
          params: params,
          location: connection.location
        });
        return { rows };
      }

      // Firebase/Firestore operations
      if (connection.firestore) {
        throw new Error('Use specific Firebase methods instead of generic query');
      }

      throw new Error(`Unsupported database type for ${databaseName}`);
    } catch (error) {
      stats.errors++;
      console.error(`Database query error on ${databaseName}:`, error.message);
      throw error;
    }
  }

  // Database-specific query methods
  async queryPostgreSQL(databaseName, queryText, params = []) {
    return this.query(databaseName, queryText, params);
  }

  async queryBigQuery(databaseName, queryText, params = []) {
    const client = this.pools.get(databaseName);
    if (!client || !client.getDatasets) {
      throw new Error(`BigQuery database '${databaseName}' not configured`);
    }

    const stats = this.queryStats.get(databaseName);
    stats.queries++;
    stats.lastUsed = Date.now();

    try {
      const [rows] = await client.query({
        query: queryText,
        params: params || []
      });
      return { rows };
    } catch (error) {
      stats.errors++;
      console.error(`BigQuery error on ${databaseName}:`, error.message);
      throw error;
    }
  }

  // Firebase/Firestore methods
  async firestoreGet(databaseName, collection, documentId = null) {
    const connection = this.pools.get(databaseName);
    if (!connection || !connection.firestore) {
      throw new Error(`Firebase database '${databaseName}' not configured`);
    }

    const stats = this.queryStats.get(databaseName);
    stats.queries++;
    stats.lastUsed = Date.now();

    try {
      const firestore = connection.firestore;
      
      if (documentId) {
        const doc = await firestore.collection(collection).doc(documentId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      } else {
        const snapshot = await firestore.collection(collection).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (error) {
      stats.errors++;
      console.error(`Firestore error on ${databaseName}:`, error.message);
      throw error;
    }
  }

  async firestoreSet(databaseName, collection, documentId, data) {
    const connection = this.pools.get(databaseName);
    if (!connection || !connection.firestore) {
      throw new Error(`Firebase database '${databaseName}' not configured`);
    }

    const stats = this.queryStats.get(databaseName);
    stats.queries++;
    stats.lastUsed = Date.now();

    try {
      const firestore = connection.firestore;
      await firestore.collection(collection).doc(documentId).set(data);
      return { success: true, id: documentId };
    } catch (error) {
      stats.errors++;
      console.error(`Firestore error on ${databaseName}:`, error.message);
      throw error;
    }
  }

  async firestoreAdd(databaseName, collection, data) {
    const connection = this.pools.get(databaseName);
    if (!connection || !connection.firestore) {
      throw new Error(`Firebase database '${databaseName}' not configured`);
    }

    const stats = this.queryStats.get(databaseName);
    stats.queries++;
    stats.lastUsed = Date.now();

    try {
      const firestore = connection.firestore;
      const docRef = await firestore.collection(collection).add(data);
      return { success: true, id: docRef.id };
    } catch (error) {
      stats.errors++;
      console.error(`Firestore error on ${databaseName}:`, error.message);
      throw error;
    }
  }

  // Pre-approved operations for common use cases
  async insertLog(databaseName, logData) {
    return this.query(databaseName, 
      'INSERT INTO mantis_logs (timestamp, unique_id, process_id, message, structured_data) VALUES ($1, $2, $3, $4, $5)',
      [logData.timestamp, logData.unique_id, logData.process_id, logData.message, JSON.stringify(logData.structured_data)]
    );
  }

  async selectById(databaseName, tableName, id) {
    // Table name whitelist for security
    const allowedTables = ['users', 'properties', 'campaigns', 'operations', 'audit_logs'];
    if (!allowedTables.includes(tableName)) {
      throw new Error(`Table '${tableName}' not in allowed list`);
    }
    
    return this.query(databaseName, `SELECT * FROM ${tableName} WHERE id = $1`, [id]);
  }

  async insertRecord(databaseName, tableName, data) {
    const allowedTables = ['users', 'properties', 'campaigns', 'operations', 'audit_logs'];
    if (!allowedTables.includes(tableName)) {
      throw new Error(`Table '${tableName}' not in allowed list`);
    }

    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    return this.query(databaseName, 
      `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
  }

  // Database-specific helper methods
  async queryMarketing(queryText, params) {
    return this.query('marketing', queryText, params);
  }

  async queryRealEstate(queryText, params) {
    return this.query('real_estate', queryText, params);
  }

  async queryCommandOps(queryText, params) {
    return this.query('command_ops', queryText, params);
  }

  async queryAuditLogs(queryText, params) {
    return this.query('audit_logs', queryText, params);
  }

  // Health check for all databases
  async healthCheck() {
    const health = {};
    
    for (const [dbName, connection] of this.pools) {
      const stats = this.queryStats.get(dbName);
      
      try {
        // PostgreSQL health check
        if (connection.connect && connection.query) {
          const client = await connection.connect();
          await client.query('SELECT 1 as healthy');
          client.release();
          
          health[dbName] = {
            type: 'postgresql',
            status: 'healthy',
            totalConnections: connection.totalCount || 0,
            idleConnections: connection.idleCount || 0,
            waitingCount: connection.waitingCount || 0,
            queries: stats.queries,
            errors: stats.errors,
            lastUsed: stats.lastUsed
          };
        }

        // BigQuery health check
        else if (connection.getDatasets) {
          await connection.getDatasets();
          
          health[dbName] = {
            type: 'bigquery',
            status: 'healthy',
            queries: stats.queries,
            errors: stats.errors,
            lastUsed: stats.lastUsed
          };
        }

        // Firebase health check
        else if (connection.firestore) {
          await connection.firestore.listCollections();
          
          health[dbName] = {
            type: 'firebase',
            status: 'healthy',
            queries: stats.queries,
            errors: stats.errors,
            lastUsed: stats.lastUsed
          };
        }

        else {
          health[dbName] = {
            status: 'unknown',
            error: 'Unknown database type'
          };
        }

      } catch (error) {
        health[dbName] = {
          status: 'unhealthy',
          error: error.message,
          queries: stats.queries,
          errors: stats.errors,
          lastUsed: stats.lastUsed
        };
      }
    }
    
    return health;
  }

  // Get database statistics
  getStats() {
    const stats = {};
    
    for (const [dbName, dbStats] of this.queryStats) {
      const pool = this.pools.get(dbName);
      stats[dbName] = {
        ...dbStats,
        totalConnections: pool?.totalCount || 0,
        idleConnections: pool?.idleCount || 0,
        waitingCount: pool?.waitingCount || 0
      };
    }
    
    return stats;
  }

  // Graceful shutdown
  async shutdown() {
    console.log('🛑 Shutting down database connections...');
    
    for (const [dbName, connection] of this.pools) {
      try {
        // PostgreSQL pool shutdown
        if (connection.end) {
          await connection.end();
          console.log(`✅ ${dbName} PostgreSQL pool closed`);
        }
        
        // Firebase app shutdown
        else if (connection.app && connection.app.delete) {
          await connection.app.delete();
          console.log(`✅ ${dbName} Firebase app closed`);
        }
        
        // BigQuery doesn't need explicit cleanup
        else if (connection.getDatasets) {
          console.log(`✅ ${dbName} BigQuery client closed`);
        }
        
        else {
          console.log(`✅ ${dbName} connection closed`);
        }
      } catch (error) {
        console.error(`❌ Error closing ${dbName}:`, error.message);
      }
    }
  }
}

// Singleton instance
const dbRouter = new DatabaseRouter();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  dbRouter.shutdown().then(() => process.exit(0));
});

process.on('SIGINT', () => {
  dbRouter.shutdown().then(() => process.exit(0));
});

module.exports = dbRouter;