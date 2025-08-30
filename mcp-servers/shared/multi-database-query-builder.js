/**
 * Multi-Database Query Builder - Solo Developer Edition
 * Unified interface for PostgreSQL, BigQuery, Firebase across 5 databases
 */

const { Pool } = require('pg');
const { BigQuery } = require('@google-cloud/bigquery');
const admin = require('firebase-admin');

class MultiDatabaseQueryBuilder {
  constructor() {
    this.connections = new Map();
    this.queryCache = new Map();
    this.initializeConnections();
  }

  async initializeConnections() {
    // Neon PostgreSQL
    if (process.env.NEON_DATABASE_URL) {
      this.connections.set('neon', {
        type: 'postgresql',
        pool: new Pool({ connectionString: process.env.NEON_DATABASE_URL })
      });
    }

    // Marketing Database (PostgreSQL)
    if (process.env.MARKETING_DATABASE_URL) {
      this.connections.set('marketing', {
        type: 'postgresql', 
        pool: new Pool({ connectionString: process.env.MARKETING_DATABASE_URL })
      });
    }

    // Real Estate Database (PostgreSQL)
    if (process.env.REAL_ESTATE_DATABASE_URL) {
      this.connections.set('real_estate', {
        type: 'postgresql',
        pool: new Pool({ connectionString: process.env.REAL_ESTATE_DATABASE_URL })
      });
    }

    // Command Ops Database (PostgreSQL)
    if (process.env.COMMAND_OPS_DATABASE_URL) {
      this.connections.set('command_ops', {
        type: 'postgresql',
        pool: new Pool({ connectionString: process.env.COMMAND_OPS_DATABASE_URL })
      });
    }

    // BigQuery
    if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
      this.connections.set('bigquery', {
        type: 'bigquery',
        client: new BigQuery({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
        })
      });
    }

    // Firebase
    if (process.env.FIREBASE_PROJECT_ID && !admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
      
      this.connections.set('firebase', {
        type: 'firebase',
        db: admin.firestore()
      });
    }

    console.log(`🗄️ Initialized ${this.connections.size} database connections`);
  }

  // Unified query interface
  async executeQuery(payload) {
    const { database, query, params = [], options = {} } = payload.data;
    
    if (!this.connections.has(database)) {
      throw new Error(`Database '${database}' not configured`);
    }

    const connection = this.connections.get(database);
    const cacheKey = `${database}:${JSON.stringify({ query, params })}`;
    
    // Check cache for read operations
    if (this.isReadOperation(query) && this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      if (Date.now() < cached.expires) {
        console.log(`📈 Query cache HIT: ${database}`);
        return cached.result;
      }
    }

    let result;
    
    try {
      switch (connection.type) {
        case 'postgresql':
          result = await this.executePostgreSQL(connection.pool, query, params, options);
          break;
        case 'bigquery':
          result = await this.executeBigQuery(connection.client, query, options);
          break;
        case 'firebase':
          result = await this.executeFirestore(connection.db, query, options);
          break;
        default:
          throw new Error(`Unsupported database type: ${connection.type}`);
      }

      // Cache read operations for 5 minutes
      if (this.isReadOperation(query)) {
        this.queryCache.set(cacheKey, {
          result,
          expires: Date.now() + 300000 // 5 minutes
        });
      }

      return result;

    } catch (error) {
      console.error(`Database query error (${database}):`, error.message);
      throw error;
    }
  }

  async executePostgreSQL(pool, query, params, options) {
    const client = await pool.connect();
    
    try {
      // Safety checks for destructive operations
      if (this.isDestructiveOperation(query) && !options.allowDestructive) {
        throw new Error('Destructive operations require explicit allowDestructive flag');
      }

      const result = await client.query(query, params);
      
      return {
        type: 'postgresql',
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields?.map(f => ({ name: f.name, type: f.dataTypeID })) || [],
        executionTime: Date.now()
      };
    } finally {
      client.release();
    }
  }

  async executeBigQuery(client, query, options) {
    // Safety checks
    if (this.isDestructiveOperation(query) && !options.allowDestructive) {
      throw new Error('Destructive operations require explicit allowDestructive flag');
    }

    const [job] = await client.createQueryJob({
      query,
      location: options.location || 'US',
      dryRun: options.dryRun || false
    });

    const [rows] = await job.getQueryResults();
    
    return {
      type: 'bigquery',
      rows: rows,
      rowCount: rows.length,
      jobId: job.id,
      executionTime: Date.now()
    };
  }

  async executeFirestore(db, query, options) {
    // Parse Firestore query from structured format
    const { collection, where = [], orderBy = [], limit } = query;
    
    let ref = db.collection(collection);
    
    // Apply where clauses
    where.forEach(([field, operator, value]) => {
      ref = ref.where(field, operator, value);
    });
    
    // Apply ordering
    orderBy.forEach(([field, direction = 'asc']) => {
      ref = ref.orderBy(field, direction);
    });
    
    // Apply limit
    if (limit) {
      ref = ref.limit(limit);
    }
    
    const snapshot = await ref.get();
    const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return {
      type: 'firestore',
      rows: rows,
      rowCount: rows.length,
      executionTime: Date.now()
    };
  }

  // Cross-database join operations
  async executeCrossDBJoin(payload) {
    const { leftDB, leftQuery, rightDB, rightQuery, joinType = 'inner', joinOn } = payload.data;
    
    console.log(`🔗 Cross-database join: ${leftDB} ${joinType} ${rightDB}`);
    
    // Execute both queries in parallel
    const [leftResult, rightResult] = await Promise.all([
      this.executeQuery({ data: { database: leftDB, query: leftQuery } }),
      this.executeQuery({ data: { database: rightDB, query: rightQuery } })
    ]);
    
    // Perform in-memory join
    const joinedRows = this.performJoin(
      leftResult.rows, 
      rightResult.rows, 
      joinType, 
      joinOn
    );
    
    return {
      type: 'cross_database_join',
      rows: joinedRows,
      rowCount: joinedRows.length,
      leftSource: leftDB,
      rightSource: rightDB,
      joinType,
      executionTime: Date.now()
    };
  }

  performJoin(leftRows, rightRows, joinType, joinOn) {
    const [leftKey, rightKey] = joinOn;
    const result = [];
    
    // Create lookup map for right table
    const rightMap = new Map();
    rightRows.forEach(row => {
      const key = row[rightKey];
      if (!rightMap.has(key)) rightMap.set(key, []);
      rightMap.get(key).push(row);
    });
    
    // Perform join
    leftRows.forEach(leftRow => {
      const key = leftRow[leftKey];
      const rightMatches = rightMap.get(key) || [];
      
      if (rightMatches.length > 0) {
        // Inner/Left join - include matches
        rightMatches.forEach(rightRow => {
          result.push({ ...leftRow, ...rightRow });
        });
      } else if (joinType === 'left') {
        // Left join - include left row with nulls for right
        result.push({ ...leftRow });
      }
    });
    
    return result;
  }

  // Query analysis and safety
  isReadOperation(query) {
    if (typeof query === 'object') return true; // Firestore queries are objects
    const readOperations = /^\s*(SELECT|WITH|EXPLAIN|SHOW|DESCRIBE|DESC)/i;
    return readOperations.test(query.trim());
  }

  isDestructiveOperation(query) {
    if (typeof query === 'object') return false; // Firestore is generally safe
    const destructiveOps = /^\s*(DROP|DELETE|TRUNCATE|ALTER|CREATE|INSERT|UPDATE)/i;
    return destructiveOps.test(query.trim());
  }

  // Schema introspection across databases
  async getSchema(database) {
    const connection = this.connections.get(database);
    if (!connection) throw new Error(`Database '${database}' not configured`);

    switch (connection.type) {
      case 'postgresql':
        return await this.getPostgreSQLSchema(connection.pool);
      case 'bigquery':
        return await this.getBigQuerySchema(connection.client);
      case 'firebase':
        return await this.getFirestoreSchema(connection.db);
      default:
        throw new Error(`Schema introspection not supported for ${connection.type}`);
    }
  }

  async getPostgreSQLSchema(pool) {
    const query = `
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
    
    const result = await pool.query(query);
    const schema = {};
    
    result.rows.forEach(row => {
      if (!schema[row.table_name]) schema[row.table_name] = [];
      schema[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES'
      });
    });
    
    return schema;
  }

  async getBigQuerySchema(client) {
    const [datasets] = await client.getDatasets();
    const schema = {};
    
    for (const dataset of datasets) {
      const [tables] = await dataset.getTables();
      
      for (const table of tables) {
        const [metadata] = await table.getMetadata();
        const tableName = `${dataset.id}.${table.id}`;
        
        schema[tableName] = metadata.schema.fields.map(field => ({
          column: field.name,
          type: field.type,
          mode: field.mode
        }));
      }
    }
    
    return schema;
  }

  async getFirestoreSchema(db) {
    // Firestore is schema-less, but we can sample documents
    const collections = await db.listCollections();
    const schema = {};
    
    for (const collection of collections) {
      const snapshot = await collection.limit(5).get();
      const fields = new Set();
      
      snapshot.docs.forEach(doc => {
        Object.keys(doc.data()).forEach(key => fields.add(key));
      });
      
      schema[collection.id] = Array.from(fields).map(field => ({
        column: field,
        type: 'dynamic',
        nullable: true
      }));
    }
    
    return schema;
  }

  // Performance and monitoring
  getStats() {
    const stats = {
      connections: Array.from(this.connections.keys()),
      cacheSize: this.queryCache.size,
      uptime: process.uptime()
    };
    
    return stats;
  }

  // Cleanup
  cleanup() {
    // Clean expired cache entries
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now > value.expires) {
        this.queryCache.delete(key);
      }
    }
  }
}

// Singleton instance
const queryBuilder = new MultiDatabaseQueryBuilder();

// Cleanup timer
setInterval(() => queryBuilder.cleanup(), 60000); // Every minute

module.exports = { 
  MultiDatabaseQueryBuilder,
  queryBuilder
};