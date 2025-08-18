export const runtime = 'edge';

interface LLMRequest {
  provider?: 'anthropic' | 'openai';
  model?: string;
  system?: string;
  prompt: string;
  json?: boolean;
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
    const { provider: requestedProvider, model, system, prompt, json = false, max_tokens = 1024 } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Provider selection algorithm
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const defaultProvider = process.env.LLM_DEFAULT_PROVIDER || 'openai';
    
    let provider: string;
    
    // 1. If provider explicitly requested
    if (requestedProvider) {
      provider = requestedProvider;
      if (provider === 'anthropic' && !anthropicKey) {
        return new Response(JSON.stringify({ 
          error: 'Anthropic API key not configured',
          help: 'Add ANTHROPIC_API_KEY=sk-ant-xxx to Vercel environment variables',
          provider: 'anthropic'
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (provider === 'openai' && !openaiKey) {
        return new Response(JSON.stringify({ 
          error: 'OpenAI API key not configured',
          help: 'Add OPENAI_API_KEY=sk-xxx to Vercel environment variables',
          provider: 'openai'
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    // 2. Infer from model name
    else if (model) {
      if (model.toLowerCase().includes('claude')) {
        provider = 'anthropic';
      } else if (model.toLowerCase().includes('gpt') || model.toLowerCase().startsWith('o')) {
        provider = 'openai';
      } else {
        provider = defaultProvider;
      }
    }
    // 3. Use default provider
    else if (defaultProvider === 'anthropic' && anthropicKey) {
      provider = 'anthropic';
    } else if (defaultProvider === 'openai' && openaiKey) {
      provider = 'openai';
    }
    // 4. Use whichever single key is available
    else if (anthropicKey && !openaiKey) {
      provider = 'anthropic';
    } else if (openaiKey && !anthropicKey) {
      provider = 'openai';
    }
    // 5. No provider available - graceful degradation
    else {
      return new Response(JSON.stringify({ 
        error: 'No API keys configured yet. Add ANTHROPIC_API_KEY and/or OPENAI_API_KEY to Vercel environment variables.',
        help: 'Go to Vercel Dashboard → Project Settings → Environment Variables'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate selected provider has key - with helpful messages
    if (provider === 'anthropic' && !anthropicKey) {
      return new Response(JSON.stringify({ 
        error: 'Anthropic API key not configured',
        help: 'Add ANTHROPIC_API_KEY=sk-ant-xxx to Vercel environment variables',
        provider: 'anthropic'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (provider === 'openai' && !openaiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        help: 'Add OPENAI_API_KEY=sk-xxx to Vercel environment variables',
        provider: 'openai'
      }), {
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
      
      const messages: any[] = [];
      if (system) {
        messages.push({ role: 'system', content: system });
      }
      messages.push({ role: 'user', content: prompt });
      
      const openaiBody: any = {
        model: openaiModel,
        max_tokens,
        messages,
      };
      
      if (json) {
        openaiBody.response_format = { type: 'json_object' };
        // Ensure JSON instruction in system message
        const jsonInstruction = 'You must respond with valid JSON only.';
        if (system) {
          messages[0].content += ' ' + jsonInstruction;
        } else {
          messages.unshift({ role: 'system', content: jsonInstruction });
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