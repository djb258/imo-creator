const { validateContract } = require('../lib/transport');
const { Pool } = require('pg');

class NeonAdapter {
  constructor(transport) {
    this.transport = transport;
    this.contractPath = require('path').resolve(__dirname, '../contracts/neon.schema.json');
    
    // Initialize connection pool for direct database access
    this.pool = new Pool({
      connectionString: process.env.NEON_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  async executeOperation(request) {
    const startTime = Date.now();

    try {
      // Validate request against contract
      const validatedRequest = await validateContract(this.contractPath, 'request', request);
      
      // Route to appropriate transport (REST or MCP)
      let result;
      if (this.transport.type === 'rest') {
        result = await this.executeViaRest(validatedRequest);
      } else if (this.transport.type === 'mcp') {
        result = await this.executeViaMcp(validatedRequest);
      } else {
        throw new Error(`Unsupported transport type: ${this.transport.type}`);
      }

      // Add execution metadata
      result.metadata = {
        ...result.metadata,
        execution_time_ms: Date.now() - startTime,
        connection_pool_info: {
          active_connections: this.pool.totalCount,
          idle_connections: this.pool.idleCount
        }
      };

      // Validate response against contract
      const validatedResponse = await validateContract(this.contractPath, 'response', result);
      return validatedResponse;

    } catch (error) {
      return {
        success: false,
        data: null,
        metadata: {
          execution_time_ms: Date.now() - startTime,
          connection_pool_info: {
            active_connections: this.pool?.totalCount || 0,
            idle_connections: this.pool?.idleCount || 0
          }
        },
        error: {
          code: 'DATABASE_ERROR',
          message: error.message,
          sql_state: error.code || 'UNKNOWN'
        }
      };
    }
  }

  async executeViaRest(request) {
    // Direct database execution via connection pool
    const { operation, data } = request;
    
    switch (operation) {
      case 'insert_contacts':
        return await this.insertContacts(data.contacts);
      
      case 'update_verification':
        return await this.updateVerification(data.verification_updates);
      
      case 'get_contacts':
        return await this.getContacts(data.filters, data.limit, data.offset);
      
      case 'assign_slots':
        return await this.assignSlots(data.slot_assignments);
      
      case 'bulk_update':
        return await this.bulkUpdate(data);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  async executeViaMcp(request) {
    // Implementation for MCP transport using Neon MCP server
    const { operation, data } = request;
    
    try {
      const mcpPayload = {
        tool: this.mapOperationToMcpTool(operation),
        data: data
      };

      const mcpResponse = await this.transport.call('neon-mcp', mcpPayload);
      
      if (!mcpResponse.success) {
        throw new Error(mcpResponse.error?.message || 'MCP call failed');
      }

      return {
        success: true,
        data: mcpResponse.data,
        metadata: mcpResponse.metadata || {},
        error: null
      };

    } catch (error) {
      throw new Error(`MCP database operation failed: ${error.message}`);
    }
  }

  async insertContacts(contacts) {
    const client = await this.pool.connect();
    let inserted = 0;
    let duplicatesSkipped = 0;
    const insertedContacts = [];

    try {
      await client.query('BEGIN');

      for (const contact of contacts) {
        const { full_name, title, email, phone, company_id, role_code } = contact;
        
        try {
          // Use upsert function from SQL
          const result = await client.query(`
            SELECT people.upsert_contact_with_verification($1, $2, $3, $4)
          `, [full_name, title, email, phone]);
          
          const contactId = result.rows[0].upsert_contact_with_verification;
          insertedContacts.push({ contact_id: contactId, email });
          inserted++;

          // If company_id and role_code provided, try to assign slot
          if (company_id && role_code) {
            await client.query(`
              SELECT company.assign_contact_to_slot($1, $2, $3)
            `, [company_id, role_code, contactId]);
          }

        } catch (err) {
          if (err.code === '23505') { // Unique constraint violation
            duplicatesSkipped++;
          } else {
            throw err;
          }
        }
      }

      await client.query('COMMIT');
      
      return {
        success: true,
        data: {
          inserted_contacts: insertedContacts,
          total_inserted: inserted,
          duplicates_skipped: duplicatesSkipped
        },
        metadata: {},
        error: null
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateVerification(updates) {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT people.bulk_update_verification($1::jsonb)
      `, [JSON.stringify(updates)]);
      
      const updatedCount = result.rows[0].bulk_update_verification;

      return {
        success: true,
        data: {
          updated_count: updatedCount,
          failed_updates: []
        },
        metadata: {},
        error: null
      };

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async getContacts(filters = {}, limit = 100, offset = 0) {
    const client = await this.pool.connect();
    
    try {
      let whereClause = 'WHERE 1=1';
      const params = [];
      let paramCount = 0;

      if (filters.company_id) {
        whereClause += ` AND company_id = $${++paramCount}`;
        params.push(filters.company_id);
      }

      if (filters.role_code) {
        whereClause += ` AND role_code = $${++paramCount}`;
        params.push(filters.role_code);
      }

      if (filters.email_status) {
        whereClause += ` AND email_status = $${++paramCount}`;
        params.push(filters.email_status);
      }

      if (filters.verified_only) {
        whereClause += ` AND email_status IS NOT NULL`;
      }

      const query = `
        SELECT * FROM people.contact_full 
        ${whereClause}
        ORDER BY updated_at DESC
        LIMIT $${++paramCount} OFFSET $${++paramCount}
      `;
      params.push(limit, offset);

      const result = await client.query(query, params);
      
      // Get total count
      const countQuery = `SELECT COUNT(*) FROM people.contact_full ${whereClause}`;
      const countResult = await client.query(countQuery, params.slice(0, -2));
      const totalCount = parseInt(countResult.rows[0].count);

      return {
        success: true,
        data: {
          contacts: result.rows,
          total_count: totalCount,
          has_more: offset + limit < totalCount
        },
        metadata: {},
        error: null
      };

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async assignSlots(assignments) {
    const client = await this.pool.connect();
    let assignedCount = 0;
    const failedAssignments = [];

    try {
      await client.query('BEGIN');

      for (const assignment of assignments) {
        const { company_id, role_code, contact_id } = assignment;
        
        try {
          const result = await client.query(`
            SELECT company.assign_contact_to_slot($1, $2, $3)
          `, [company_id, role_code, contact_id]);
          
          if (result.rows[0].assign_contact_to_slot) {
            assignedCount++;
          } else {
            failedAssignments.push({
              company_id,
              role_code,
              contact_id,
              error: 'Slot not available or already occupied'
            });
          }

        } catch (err) {
          failedAssignments.push({
            company_id,
            role_code,
            contact_id,
            error: err.message
          });
        }
      }

      await client.query('COMMIT');
      
      return {
        success: true,
        data: {
          assigned_count: assignedCount,
          failed_assignments: failedAssignments
        },
        metadata: {},
        error: null
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async bulkUpdate(data) {
    // Generic bulk update operation
    throw new Error('Bulk update operation not yet implemented');
  }

  mapOperationToMcpTool(operation) {
    const mapping = {
      'insert_contacts': 'insert_record',
      'update_verification': 'execute_query',
      'get_contacts': 'execute_query',
      'assign_slots': 'execute_query',
      'bulk_update': 'execute_query'
    };
    
    return mapping[operation] || 'execute_query';
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = NeonAdapter;