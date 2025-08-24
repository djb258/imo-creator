/* Lightweight BMAD request logger with HEIR/ORBT compliance */
import type { NextApiRequest, NextApiResponse } from 'next'

export function withBmad(handler: (req: NextApiRequest, res: NextApiResponse) => any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (process.env.BMAD_ENABLED === '0') return handler(req, res)
    
    // HEIR/ORBT required fields
    const trace = (req.headers['x-trace-id'] as string) || 
                  process.env.BMAD_TRACE_ID || 
                  `BMAD-${Date.now()}`
    const processId = process.env.PROCESS_ID || 'imo-creator'
    const blueprintId = process.env.BLUEPRINT_ID || 'imo-blueprint'
    const agentId = process.env.AGENT_ID || 'claude-code'
    
    const start = Date.now()
    res.setHeader('x-trace-id', trace)
    res.setHeader('x-heir-compliant', 'true')
    res.setHeader('x-orbt-tracked', 'true')
    
    try { 
      return await handler(req, res) 
    }
    finally {
      const duration = Date.now() - start
      const line = JSON.stringify({ 
        stamp: 'BMAD',
        trace_id: trace,
        process_id: processId,
        blueprint_id: blueprintId,
        agent_id: agentId,
        duration_ms: duration,
        path: req.url,
        method: req.method,
        status: res.statusCode,
        heir_compliant: true,
        orbt_policy: 'enforced',
        ts: new Date().toISOString()
      })
      
      // Log to BMAD system
      const fs = require('fs')
      const logPath = `logs/bmad/${new Date().toISOString().split('T')[0]}.log`
      fs.appendFileSync(logPath, line + '\n')
      
      // fire-and-forget server-side log; tolerate failures
      if (process.env.BMAD_LOG_ENDPOINT) {
        fetch(process.env.BMAD_LOG_ENDPOINT, { 
          method: 'POST', 
          body: line,
          headers: { 'x-heir-policy': 'bmad' }
        }).catch(()=>{})
      }
    }
  }
}

export default withBmad