import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to read the generated mermaid diagram
    const diagramPath = path.join(process.cwd(), '../../docs/imo-spec/diagram.mmd')
    
    if (fs.existsSync(diagramPath)) {
      const diagramData = fs.readFileSync(diagramPath, 'utf-8')
      res.setHeader('Content-Type', 'text/plain')
      return res.status(200).send(diagramData)
    }
    
    // Fallback: return 404 to trigger generation
    return res.status(404).json({ error: 'Mermaid diagram not found' })
  } catch (error) {
    console.error('Error reading diagram:', error)
    return res.status(500).json({ error: 'Failed to load diagram' })
  }
}