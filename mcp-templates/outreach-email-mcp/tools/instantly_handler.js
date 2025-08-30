/**
 * Instantly.com Email Handler Template
 * Handles C-suite email campaigns with professional compliance
 */

class InstantlyHandler {
  constructor() {
    this.apiKey = process.env.INSTANTLY_API_KEY;
    this.baseURL = 'https://api.instantly.ai/api/v1';
    this.campaignTemplates = this.loadCampaignTemplates();
  }

  async send_intro_email(payload) {
    try {
      const { executive, campaign_type, personalization = {} } = payload.data;
      
      // Get appropriate email template
      const template = this.campaignTemplates[campaign_type];
      if (!template) {
        throw new Error(`Unknown campaign type: ${campaign_type}`);
      }

      // Personalize email content
      const personalizedContent = this.personalizeTemplate(
        template, 
        executive, 
        personalization
      );

      // Send via Instantly.com API
      const response = await fetch(`${this.baseURL}/lead/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          campaign_id: template.campaign_id,
          email: executive.email,
          first_name: executive.name.split(' ')[0],
          last_name: executive.name.split(' ').slice(1).join(' '),
          company_name: executive.company,
          variables: {
            executive_title: executive.title,
            company_name: executive.company,
            personalized_message: personalizedContent.message,
            sender_signature: process.env.EMAIL_SIGNATURE || 'Best regards'
          }
        })
      });

      const result = await response.json();

      return {
        success: true,
        result: {
          instantly_response: result,
          campaign_type,
          executive_contacted: {
            name: executive.name,
            title: executive.title,
            company: executive.company,
            email: executive.email
          },
          email_content: personalizedContent,
          sent_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'send_intro_email',
          campaign_type,
          target_executive: executive.title,
          target_company: executive.company,
          email_compliance: 'can_spam_compliant',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'instantly_api_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          campaign_type: payload.data.campaign_type,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async trigger_sniper_campaign(payload) {
    try {
      const { movement_event, campaign_timing = {} } = payload.data;
      const { executive, type } = movement_event;

      // Determine appropriate sniper campaign
      const sniperTemplate = this.getSniperTemplate(type, executive.new_title);
      
      // Calculate timing
      const delay = campaign_timing.delay_days || 3; // Default 3-day delay
      const triggerDate = new Date();
      triggerDate.setDate(triggerDate.getDate() + delay);

      // Schedule campaign with Instantly.com
      const response = await fetch(`${this.baseURL}/campaign/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          campaign_id: sniperTemplate.campaign_id,
          email: executive.email,
          schedule_date: triggerDate.toISOString(),
          variables: {
            executive_name: executive.name,
            new_title: executive.new_title,
            company_name: executive.company,
            congratulations_message: this.getCongratulationsMessage(type),
            value_proposition: sniperTemplate.value_proposition
          }
        })
      });

      const result = await response.json();

      return {
        success: true,
        result: {
          sniper_campaign_triggered: true,
          movement_type: type,
          executive: {
            name: executive.name,
            new_title: executive.new_title,
            company: executive.company
          },
          campaign_schedule: {
            trigger_date: triggerDate.toISOString(),
            delay_days: delay,
            follow_up_sequence: campaign_timing.follow_up_sequence || false
          },
          instantly_response: result
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'trigger_sniper_campaign',
          movement_type: type,
          target_executive: executive.new_title,
          target_company: executive.company,
          ple_triggered: true,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_type: 'sniper_campaign_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Template and personalization methods
  loadCampaignTemplates() {
    return {
      ceo_intro: {
        campaign_id: process.env.INSTANTLY_CEO_CAMPAIGN_ID,
        subject: "Strategic Partnership Opportunity - {{company_name}}",
        value_proposition: "executive_efficiency",
        tone: "executive"
      },
      cfo_intro: {
        campaign_id: process.env.INSTANTLY_CFO_CAMPAIGN_ID,
        subject: "Cost Optimization Discussion - {{company_name}}",
        value_proposition: "financial_efficiency", 
        tone: "analytical"
      },
      hr_intro: {
        campaign_id: process.env.INSTANTLY_HR_CAMPAIGN_ID,
        subject: "Talent Management Innovation - {{company_name}}",
        value_proposition: "people_efficiency",
        tone: "collaborative"
      }
    };
  }

  personalizeTemplate(template, executive, personalization) {
    // Basic personalization logic
    let message = template.value_proposition;
    
    if (personalization.company_news) {
      message += ` I noticed ${personalization.company_news} about ${executive.company}.`;
    }
    
    if (personalization.industry_insights) {
      message += ` ${personalization.industry_insights}`;
    }
    
    if (personalization.custom_message) {
      message += ` ${personalization.custom_message}`;
    }

    return {
      message,
      subject: template.subject.replace('{{company_name}}', executive.company),
      tone: template.tone
    };
  }

  getSniperTemplate(movementType, newTitle) {
    const sniperTemplates = {
      new_hire: {
        campaign_id: process.env.INSTANTLY_NEW_HIRE_CAMPAIGN_ID,
        value_proposition: "Congratulations on your new role! Let's discuss how we can support your first 90 days.",
      },
      promotion: {
        campaign_id: process.env.INSTANTLY_PROMOTION_CAMPAIGN_ID,
        value_proposition: "Congratulations on your promotion! Your expanded responsibilities create new opportunities.",
      }
    };

    return sniperTemplates[movementType] || sniperTemplates.new_hire;
  }

  getCongratulationsMessage(type) {
    const messages = {
      new_hire: "Welcome to your new role!",
      promotion: "Congratulations on your well-deserved promotion!",
      departure: "Best wishes in your next venture!"
    };
    
    return messages[type] || "Congratulations!";
  }

  async handleToolCall(payload) {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Instantly.com API key not configured',
        configuration_required: 'INSTANTLY_API_KEY environment variable'
      };
    }

    switch (payload.tool) {
      case 'send_intro_email':
        return await this.send_intro_email(payload);
      case 'trigger_sniper_campaign':
        return await this.trigger_sniper_campaign(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: ['send_intro_email', 'trigger_sniper_campaign']
        };
    }
  }
}

module.exports = InstantlyHandler;