const { validateContract } = require('../lib/transport');

class ScrapeAdapter {
  constructor(transport) {
    this.transport = transport;
    this.contractPath = require('path').resolve(__dirname, '../contracts/scrape.schema.json');
  }

  async scrapeContacts(request) {
    const startTime = Date.now();

    try {
      // Validate request against contract
      const validatedRequest = await validateContract(this.contractPath, 'request', request);
      
      // Route to appropriate transport (REST or MCP)
      let result;
      if (this.transport.type === 'rest') {
        result = await this.scrapeViaRest(validatedRequest);
      } else if (this.transport.type === 'mcp') {
        result = await this.scrapeViaMcp(validatedRequest);
      } else {
        throw new Error(`Unsupported transport type: ${this.transport.type}`);
      }

      // Validate response against contract
      const validatedResponse = await validateContract(this.contractPath, 'response', result);
      return validatedResponse;

    } catch (error) {
      return {
        success: false,
        contacts: [],
        metadata: {
          scraped_at: new Date().toISOString(),
          scrape_duration_ms: Date.now() - startTime,
          pages_scraped: 0,
          total_contacts_found: 0
        },
        error: {
          code: 'SCRAPE_FAILED',
          message: error.message
        }
      };
    }
  }

  async scrapeViaRest(request) {
    // Implementation for REST transport using Apify API
    const { company_name, target_roles, domain, max_results = 10 } = request;
    
    // Mock REST implementation (replace with actual Apify API calls)
    const mockContacts = target_roles.flatMap(role => 
      Array.from({ length: Math.min(max_results, 3) }, (_, i) => ({
        full_name: `${role} Contact ${i + 1}`,
        title: role === 'CEO' ? 'Chief Executive Officer' : 
              role === 'CFO' ? 'Chief Financial Officer' : 
              'Human Resources Director',
        email: `${role.toLowerCase()}${i + 1}@${domain || company_name.toLowerCase().replace(/\s+/g, '') + '.com'}`,
        phone: Math.random() > 0.5 ? `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : null,
        role_code: role,
        confidence_score: 0.7 + Math.random() * 0.3,
        source_url: `https://www.${domain || company_name.toLowerCase().replace(/\s+/g, '') + '.com'}/about`
      }))
    );

    return {
      success: true,
      contacts: mockContacts,
      metadata: {
        scraped_at: new Date().toISOString(),
        scrape_duration_ms: Math.floor(Math.random() * 5000) + 1000,
        pages_scraped: Math.floor(Math.random() * 10) + 1,
        total_contacts_found: mockContacts.length
      },
      error: null
    };
  }

  async scrapeViaMcp(request) {
    // Implementation for MCP transport using Apify MCP server
    const { company_name, target_roles, domain, max_results = 10 } = request;
    
    try {
      const mcpPayload = {
        tool: 'scrape_website',
        data: {
          company_name,
          target_roles,
          domain,
          max_results
        }
      };

      const mcpResponse = await this.transport.call('apify-mcp', mcpPayload);
      
      if (!mcpResponse.success) {
        throw new Error(mcpResponse.error?.message || 'MCP call failed');
      }

      // Transform MCP response to match contract
      return {
        success: true,
        contacts: mcpResponse.data.contacts.map(contact => ({
          full_name: contact.full_name,
          title: contact.title,
          email: contact.email,
          phone: contact.phone,
          role_code: contact.role_code,
          confidence_score: contact.confidence_score || 0.8,
          source_url: contact.source_url
        })),
        metadata: {
          scraped_at: new Date().toISOString(),
          scrape_duration_ms: mcpResponse.data.duration_ms || 2000,
          pages_scraped: mcpResponse.data.pages_scraped || 1,
          total_contacts_found: mcpResponse.data.contacts.length
        },
        error: null
      };

    } catch (error) {
      throw new Error(`MCP scraping failed: ${error.message}`);
    }
  }
}

module.exports = ScrapeAdapter;