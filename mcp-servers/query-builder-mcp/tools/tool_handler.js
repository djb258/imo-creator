const { queryBuilder } = require('../../shared/multi-database-query-builder');

class QueryBuilderHandler {
  constructor() {
    this.queryBuilder = queryBuilder;
  }

  async execute_query(payload) {
    try {
      const result = await this.queryBuilder.executeQuery(payload);
      
      return {
        success: true,
        result: {
          ...result,
          query_metadata: {
            database: payload.data.database,
            query_type: this.queryBuilder.isReadOperation(payload.data.query) ? 'read' : 'write',
            cached: result.fromCache || false
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'execute_query',
          database_target: payload.data.database,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'query_execution_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          database_target: payload.data.database,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async cross_db_join(payload) {
    try {
      const result = await this.queryBuilder.executeCrossDBJoin(payload);
      
      return {
        success: true,
        result: {
          ...result,
          join_metadata: {
            performance_impact: result.rowCount > 10000 ? 'high' : 'normal',
            optimization_suggestions: this.getJoinOptimizations(result)
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'cross_db_join',
          databases_involved: [payload.data.leftDB, payload.data.rightDB],
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'cross_join_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get_schema(payload) {
    try {
      const schema = await this.queryBuilder.getSchema(payload.data.database);
      
      return {
        success: true,
        result: {
          database: payload.data.database,
          schema: schema,
          table_count: Object.keys(schema).length,
          generated_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'get_schema',
          database_target: payload.data.database,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'schema_introspection_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get_stats(payload) {
    try {
      const stats = this.queryBuilder.getStats();
      
      return {
        success: true,
        result: {
          ...stats,
          performance_summary: {
            total_databases: stats.connections.length,
            cache_efficiency: this.calculateCacheEfficiency(),
            system_health: 'optimal'
          }
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'get_stats',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'stats_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  getJoinOptimizations(result) {
    const suggestions = [];
    
    if (result.rowCount > 10000) {
      suggestions.push('Consider adding indexes on join columns');
      suggestions.push('Use LIMIT clauses to reduce result set');
    }
    
    if (result.joinType === 'cross_database_join') {
      suggestions.push('Consider data replication for frequently joined tables');
    }
    
    return suggestions;
  }

  calculateCacheEfficiency() {
    // Simple cache efficiency calculation
    const cacheSize = this.queryBuilder.queryCache?.size || 0;
    return cacheSize > 0 ? 'active' : 'building';
  }

  async handleToolCall(payload) {
    switch (payload.tool) {
      case 'execute_query':
        return await this.execute_query(payload);
      case 'cross_db_join':
        return await this.cross_db_join(payload);
      case 'get_schema':
        return await this.get_schema(payload);
      case 'get_stats':
        return await this.get_stats(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: ['execute_query', 'cross_db_join', 'get_schema', 'get_stats']
        };
    }
  }
}

module.exports = new QueryBuilderHandler();