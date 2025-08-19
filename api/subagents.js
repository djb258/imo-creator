// Vercel API Route for subagent registry with garage-mcp integration
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    
    const BASE = process.env.GARAGE_MCP_URL
    const TOKEN = process.env.GARAGE_MCP_TOKEN
    const PATH = process.env.SUBAGENT_REGISTRY_PATH || '/registry/subagents'
    
    const FALLBACK = [
        {"id":"validate-ssot","bay":"frontend","desc":"Validate SSOT against HEIR schema"},
        {"id":"heir-check","bay":"backend","desc":"Run HEIR checks on blueprint"},
        {"id":"register-blueprint","bay":"backend","desc":"Persist + emit registration event"},
    ]
    
    // If no garage-mcp URL configured, return fallback
    if (!BASE) {
        return res.status(200).json({ items: FALLBACK })
    }
    
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...(TOKEN && { 'Authorization': `Bearer ${TOKEN}` })
        }
        
        const response = await fetch(`${BASE}${PATH}`, {
            method: 'GET',
            headers,
            timeout: 5000
        })
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        const items = Array.isArray(data) ? data : (data.items || [])
        
        const processedItems = items.map(item => ({
            id: item.id || item.name || 'unknown',
            bay: item.bay || item.namespace || 'unknown',
            desc: item.description || item.desc || ''
        }))
        
        // Return processed items or fallback if empty
        return res.status(200).json({ 
            items: processedItems.length > 0 ? processedItems : FALLBACK 
        })
        
    } catch (error) {
        console.error('Garage-MCP fetch error:', error.message)
        // Gracefully fall back to static list
        return res.status(200).json({ items: FALLBACK })
    }
}