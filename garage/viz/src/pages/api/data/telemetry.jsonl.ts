import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to read the actual telemetry log
    const telemetryPath = path.join(process.cwd(), '../../logs/telemetry.jsonl')
    
    if (fs.existsSync(telemetryPath)) {
      const telemetryData = fs.readFileSync(telemetryPath, 'utf-8')
      res.setHeader('Content-Type', 'text/plain')
      return res.status(200).send(telemetryData)
    }
    
    // Fallback: return 404 to trigger sample data
    return res.status(404).json({ error: 'Telemetry data not found' })
  } catch (error) {
    console.error('Error reading telemetry data:', error)
    return res.status(500).json({ error: 'Failed to load telemetry data' })
  }
}