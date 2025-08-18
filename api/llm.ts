export const runtime = 'edge';

interface LLMRequest {
  system?: string;
  prompt: string;
  json?: boolean;
  model?: string;
  max_tokens?: number;
}

interface LLMResponse {
  text?: string;
  json?: any;
  model: string;
  provider: string;
  error?: string;
}

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: LLMRequest = await request.json();
    const { system, prompt, json = false, model, max_tokens = 1024 } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine provider
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const preferredProvider = process.env.LLM_PROVIDER || 'anthropic';
    
    let provider: string;
    if (preferredProvider === 'openai' && openaiKey) {
      provider = 'openai';
    } else if (preferredProvider === 'anthropic' && anthropicKey) {
      provider = 'anthropic';
    } else if (anthropicKey) {
      provider = 'anthropic';
    } else if (openaiKey) {
      provider = 'openai';
    } else {
      return new Response(JSON.stringify({ error: 'No API key configured' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result: LLMResponse;

    if (provider === 'anthropic') {
      const defaultModel = 'claude-3-5-sonnet-20240620';
      const anthropicModel = model || defaultModel;
      
      const anthropicBody: any = {
        model: anthropicModel,
        max_tokens,
        messages: [{ role: 'user', content: prompt }],
      };
      
      if (system) {
        anthropicBody.system = system;
      }
      
      if (json) {
        anthropicBody.tools = [{
          name: 'json_response',
          description: 'Return the response as valid JSON',
          input_schema: {
            type: 'object',
            properties: {
              response: { type: 'object', description: 'The JSON response' }
            },
            required: ['response']
          }
        }];
        anthropicBody.tool_choice = { type: 'tool', name: 'json_response' };
      }

      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey!,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(anthropicBody),
      });

      const anthropicResult = await anthropicResponse.json();
      
      if (!anthropicResponse.ok) {
        throw new Error(anthropicResult.error?.message || 'Anthropic API error');
      }

      if (json && anthropicResult.content?.[0]?.type === 'tool_use') {
        result = {
          json: anthropicResult.content[0].input.response,
          model: anthropicModel,
          provider: 'anthropic',
        };
      } else {
        const text = anthropicResult.content?.[0]?.text || '';
        if (json) {
          try {
            result = {
              json: JSON.parse(text),
              model: anthropicModel,
              provider: 'anthropic',
            };
          } catch {
            result = {
              text,
              model: anthropicModel,
              provider: 'anthropic',
            };
          }
        } else {
          result = {
            text,
            model: anthropicModel,
            provider: 'anthropic',
          };
        }
      }
    } else {
      // OpenAI
      const defaultModel = 'gpt-4o-mini';
      const openaiModel = model || defaultModel;
      
      const openaiBody: any = {
        model: openaiModel,
        max_tokens,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt },
        ],
      };
      
      if (json) {
        openaiBody.response_format = { type: 'json_object' };
        // Ensure JSON instruction in system message
        const jsonInstruction = 'You must respond with valid JSON only.';
        if (system) {
          openaiBody.messages[0].content += ' ' + jsonInstruction;
        } else {
          openaiBody.messages.unshift({ role: 'system', content: jsonInstruction });
        }
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openaiBody),
      });

      const openaiResult = await openaiResponse.json();
      
      if (!openaiResponse.ok) {
        throw new Error(openaiResult.error?.message || 'OpenAI API error');
      }

      const text = openaiResult.choices?.[0]?.message?.content || '';
      
      if (json) {
        try {
          result = {
            json: JSON.parse(text),
            model: openaiModel,
            provider: 'openai',
          };
        } catch {
          result = {
            text,
            model: openaiModel,
            provider: 'openai',
          };
        }
      } else {
        result = {
          text,
          model: openaiModel,
          provider: 'openai',
        };
      }
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('LLM API error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}