const express = require('express');
const ScrapeAdapter = require('../adapters/scrape');
const VerifyAdapter = require('../adapters/verify');
const NeonAdapter = require('../adapters/neon');
const { TransportManager } = require('../lib/transport');
const FreshnessManager = require('../lib/freshness');
const MappingHelper = require('../lib/mapping');

const router = express.Router();

// Initialize components
const transportManager = new TransportManager({
  transport: process.env.TRANSPORT_TYPE || 'rest',
  mcpServers: {
    'apify-mcp': { port: 3001 },
    'email-validator': { port: 3004 },
    'neon-mcp': { port: 3008 }
  },
  restEndpoints: {
    'apify': process.env.APIFY_API_ENDPOINT,
    'millionverifier': process.env.MILLIONVERIFIER_API_ENDPOINT,
    'neon': process.env.NEON_API_ENDPOINT
  }
});

const scrapeAdapter = new ScrapeAdapter(transportManager);
const verifyAdapter = new VerifyAdapter(transportManager);
const neonAdapter = new NeonAdapter(transportManager);
const freshnessManager = new FreshnessManager();
const mappingHelper = new MappingHelper();

// Complete cold outreach pipeline orchestration
router.post('/complete-pipeline', async (req, res) => {
  const startTime = Date.now();
  const { company_name, company_id, domain, target_roles = ['CEO', 'CFO', 'HR'], max_results = 10 } = req.body;

  const pipeline = {
    company_name,
    company_id,
    domain,
    target_roles,
    max_results,
    steps: {
      scrape: { status: 'pending', duration_ms: 0, results: null },
      verify: { status: 'pending', duration_ms: 0, results: null },
      store: { status: 'pending', duration_ms: 0, results: null },
      assign_slots: { status: 'pending', duration_ms: 0, results: null }
    },
    total_duration_ms: 0,
    success: false
  };

  try {
    // Step 1: Scrape contacts
    console.log(`[PIPELINE] Starting scrape for ${company_name}`);
    const scrapeStart = Date.now();
    
    const scrapeResult = await scrapeAdapter.scrapeContacts({
      company_name,
      target_roles,
      domain,
      max_results
    });
    
    pipeline.steps.scrape = {
      status: scrapeResult.success ? 'completed' : 'failed',
      duration_ms: Date.now() - scrapeStart,
      results: scrapeResult,
      contacts_found: scrapeResult.contacts?.length || 0
    };

    if (!scrapeResult.success || !scrapeResult.contacts?.length) {
      throw new Error('Scraping failed or no contacts found');
    }

    // Normalize and deduplicate contacts
    const normalizedContacts = scrapeResult.contacts
      .map(contact => mappingHelper.normalizeContactData(contact))
      .filter(contact => mappingHelper.validateContactData(contact).isValid);
    
    const deduplicatedContacts = mappingHelper.deduplicateContacts(normalizedContacts);

    // Step 2: Store contacts in database
    console.log(`[PIPELINE] Storing ${deduplicatedContacts.length} contacts`);
    const storeStart = Date.now();
    
    const storeResult = await neonAdapter.executeOperation({
      operation: 'insert_contacts',
      data: {
        contacts: deduplicatedContacts.map(contact => ({
          ...contact,
          company_id
        }))
      }
    });
    
    pipeline.steps.store = {
      status: storeResult.success ? 'completed' : 'failed',
      duration_ms: Date.now() - storeStart,
      results: storeResult,
      contacts_stored: storeResult.data?.total_inserted || 0
    };

    if (!storeResult.success) {
      throw new Error('Failed to store contacts in database');
    }

    // Step 3: Verify email addresses
    console.log(`[PIPELINE] Verifying emails for stored contacts`);
    const verifyStart = Date.now();
    
    const emailsToVerify = storeResult.data.inserted_contacts.map(contact => ({
      contact_id: contact.contact_id,
      email: contact.email
    }));

    const verifyResult = await verifyAdapter.verifyEmails({
      emails: emailsToVerify,
      verification_level: 'detailed'
    });
    
    pipeline.steps.verify = {
      status: verifyResult.success ? 'completed' : 'failed',
      duration_ms: Date.now() - verifyStart,
      results: verifyResult,
      emails_verified: verifyResult.verified_emails?.length || 0
    };

    if (verifyResult.success && verifyResult.verified_emails?.length) {
      // Step 4: Update verification results
      const verificationUpdates = verifyResult.verified_emails.map(result => ({
        contact_id: result.contact_id,
        email_status: result.status,
        email_confidence: result.confidence,
        email_source_url: 'verification-pipeline'
      }));

      await neonAdapter.executeOperation({
        operation: 'update_verification',
        data: { verification_updates: verificationUpdates }
      });
    }

    // Step 5: Assign company slots
    console.log(`[PIPELINE] Assigning company slots`);
    const assignStart = Date.now();
    
    const slotAssignments = storeResult.data.inserted_contacts
      .filter(contact => {
        const originalContact = deduplicatedContacts.find(c => c.email === contact.email);
        return originalContact && originalContact.role_code;
      })
      .map(contact => {
        const originalContact = deduplicatedContacts.find(c => c.email === contact.email);
        return {
          company_id,
          role_code: originalContact.role_code,
          contact_id: contact.contact_id
        };
      });

    const assignResult = await neonAdapter.executeOperation({
      operation: 'assign_slots',
      data: { slot_assignments: slotAssignments }
    });
    
    pipeline.steps.assign_slots = {
      status: assignResult.success ? 'completed' : 'failed',
      duration_ms: Date.now() - assignStart,
      results: assignResult,
      slots_assigned: assignResult.data?.assigned_count || 0
    };

    // Pipeline completed successfully
    pipeline.success = true;
    pipeline.total_duration_ms = Date.now() - startTime;

    res.json({
      success: true,
      message: 'Cold outreach pipeline completed successfully',
      pipeline,
      summary: {
        contacts_found: pipeline.steps.scrape.contacts_found,
        contacts_stored: pipeline.steps.store.contacts_stored,
        emails_verified: pipeline.steps.verify.emails_verified,
        slots_assigned: pipeline.steps.assign_slots.slots_assigned,
        total_duration_ms: pipeline.total_duration_ms
      }
    });

  } catch (error) {
    pipeline.success = false;
    pipeline.total_duration_ms = Date.now() - startTime;
    pipeline.error = {
      message: error.message,
      step: getCurrentFailedStep(pipeline.steps)
    };

    console.error('[PIPELINE ERROR]', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Pipeline failed',
      pipeline,
      error: error.message
    });
  }
});

// Individual route handlers
router.post('/scrape', async (req, res) => {
  try {
    const result = await scrapeAdapter.scrapeContacts(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: error.message } 
    });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const result = await verifyAdapter.verifyEmails(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: error.message } 
    });
  }
});

router.post('/database/:operation', async (req, res) => {
  try {
    const result = await neonAdapter.executeOperation({
      operation: req.params.operation,
      data: req.body
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: error.message } 
    });
  }
});

// Freshness analysis routes
router.get('/freshness/report/:company_id?', async (req, res) => {
  try {
    const { company_id } = req.params;
    const filters = company_id ? { company_id: parseInt(company_id) } : {};
    
    const contactsResult = await neonAdapter.executeOperation({
      operation: 'get_contacts',
      data: { filters, limit: 1000 }
    });

    if (!contactsResult.success) {
      throw new Error('Failed to fetch contacts for freshness analysis');
    }

    const report = freshnessManager.getFreshnessReport(contactsResult.data.contacts);
    
    res.json({
      success: true,
      freshness_report: report,
      company_id: company_id || 'all'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: error.message } 
    });
  }
});

// Transport switching
router.post('/transport/switch', (req, res) => {
  try {
    const { transport_type } = req.body;
    
    if (!['rest', 'mcp'].includes(transport_type)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid transport type. Must be "rest" or "mcp"' }
      });
    }
    
    transportManager.setTransportType(transport_type);
    
    res.json({
      success: true,
      message: `Transport switched to ${transport_type}`,
      current_transport: transportManager.getTransportType()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: error.message } 
    });
  }
});

router.get('/transport/status', (req, res) => {
  res.json({
    success: true,
    current_transport: transportManager.getTransportType(),
    available_transports: ['rest', 'mcp']
  });
});

// Helper functions
function getCurrentFailedStep(steps) {
  for (const [step, info] of Object.entries(steps)) {
    if (info.status === 'failed') return step;
    if (info.status === 'pending') return step;
  }
  return 'unknown';
}

module.exports = router;