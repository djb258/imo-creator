const twilio = require('twilio');

class TwilioHandler {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.defaultFrom = process.env.TWILIO_PHONE_NUMBER;
  }

  async send_sms(payload) {
    try {
      const { to, message, from } = payload.data;
      
      const messageOptions = {
        body: message,
        from: from || this.defaultFrom,
        to: to
      };

      const twilioMessage = await this.client.messages.create(messageOptions);
      
      return {
        success: true,
        result: {
          sid: twilioMessage.sid,
          status: twilioMessage.status,
          to: twilioMessage.to,
          from: twilioMessage.from,
          cost: twilioMessage.price || 'Calculating...',
          sent_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'send_sms',
          twilio_sid: twilioMessage.sid,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_code: error.code,
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          error_type: 'twilio_api_error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async make_call(payload) {
    try {
      const { to, message, from } = payload.data;
      
      // Create TwiML for text-to-speech
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="alice">${message}</Say>
        </Response>`;
      
      const callOptions = {
        to: to,
        from: from || this.defaultFrom,
        twiml: twiml
      };

      const call = await this.client.calls.create(callOptions);
      
      return {
        success: true,
        result: {
          sid: call.sid,
          status: call.status,
          to: call.to,
          from: call.from,
          direction: call.direction,
          started_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'make_call',
          twilio_sid: call.sid,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_code: error.code,
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          error_type: 'twilio_api_error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async handleToolCall(payload) {
    switch (payload.tool) {
      case 'send_sms':
        return await this.send_sms(payload);
      case 'make_call':
        return await this.make_call(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: ['send_sms', 'make_call']
        };
    }
  }
}

module.exports = new TwilioHandler();