import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to read the actual health.json file
    const healthPath = path.join(process.cwd(), '../../health.json')
    
    if (fs.existsSync(healthPath)) {
      const healthData = fs.readFileSync(healthPath, 'utf-8')
      const healthJson = JSON.parse(healthData)
      return res.status(200).json(healthJson)
    }
    
    // Fallback: return 404 to trigger sample data
    return res.status(404).json({ error: 'Health data not found' })
  } catch (error) {
    console.error('Error reading health data:', error)
    return res.status(500).json({ error: 'Failed to load health status' })
  }
}