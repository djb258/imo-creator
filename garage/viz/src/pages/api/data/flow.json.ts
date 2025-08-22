import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to read the actual flow.json file
    const flowPath = path.join(process.cwd(), '../../docs/imo-spec/flow.json')
    
    if (fs.existsSync(flowPath)) {
      const flowData = fs.readFileSync(flowPath, 'utf-8')
      const flowJson = JSON.parse(flowData)
      return res.status(200).json(flowJson)
    }
    
    // Fallback to sample data
    return res.status(404).json({ error: 'Flow spec not found' })
  } catch (error) {
    console.error('Error reading flow spec:', error)
    return res.status(500).json({ error: 'Failed to load flow specification' })
  }
}