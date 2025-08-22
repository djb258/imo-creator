import { TelemetryEvent } from '../types'

export interface TelemetryHeatMap {
  [edgeId: string]: number // failure rate or frequency
}

export interface TelemetryStats {
  totalEvents: number
  errorRate: number
  avgDuration: number
  pageStats: Record<string, {
    visits: number
    errors: number
    avgDuration: number
  }>
  edgeStats: Record<string, {
    transitions: number
    failures: number
    avgDuration: number
  }>
}

export function parseTelemetryLog(logData: string): TelemetryEvent[] {
  const events: TelemetryEvent[] = []
  
  logData.split('\n').forEach(line => {
    if (!line.trim()) return
    
    try {
      const event = JSON.parse(line)
      if (event.timestamp && event.event_type) {
        events.push({
          timestamp: event.timestamp,
          event_type: event.event_type,
          page_id: event.page_id,
          gatekeeper_id: event.gatekeeper_id,
          success: event.success !== false, // default to true if not specified
          duration_ms: event.duration_ms,
          error: event.error
        })
      }
    } catch (e) {
      console.warn('Invalid telemetry line:', line)
    }
  })
  
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export function generateHeatMap(events: TelemetryEvent[]): TelemetryHeatMap {
  const edgeFailures: Record<string, { total: number, failures: number }> = {}
  
  // Track page transitions and gatekeeper results
  for (let i = 0; i < events.length - 1; i++) {
    const current = events[i]
    const next = events[i + 1]
    
    // Page to page transitions
    if (current.event_type === 'page_exit' && next.event_type === 'page_enter') {
      const edgeId = `${current.page_id}-${next.page_id}`
      if (!edgeFailures[edgeId]) edgeFailures[edgeId] = { total: 0, failures: 0 }
      edgeFailures[edgeId].total++
      if (!current.success || current.error) {
        edgeFailures[edgeId].failures++
      }
    }
    
    // Page to gatekeeper transitions
    if (current.event_type === 'page_exit' && next.event_type === 'guard_result') {
      const edgeId = `${current.page_id}-${next.gatekeeper_id}`
      if (!edgeFailures[edgeId]) edgeFailures[edgeId] = { total: 0, failures: 0 }
      edgeFailures[edgeId].total++
      if (!next.success || next.error) {
        edgeFailures[edgeId].failures++
      }
    }
  }
  
  // Convert to heat map values (0-10 scale based on failure rate)
  const heatMap: TelemetryHeatMap = {}
  Object.entries(edgeFailures).forEach(([edgeId, stats]) => {
    const failureRate = stats.failures / stats.total
    heatMap[edgeId] = Math.round(failureRate * 10)
  })
  
  return heatMap
}

export function analyzeTelemetry(events: TelemetryEvent[]): TelemetryStats {
  const pageStats: Record<string, { visits: number, errors: number, durations: number[] }> = {}
  const edgeStats: Record<string, { transitions: number, failures: number, durations: number[] }> = {}
  
  let totalErrors = 0
  const allDurations: number[] = []
  
  events.forEach(event => {
    // Track page statistics
    if (event.page_id) {
      if (!pageStats[event.page_id]) {
        pageStats[event.page_id] = { visits: 0, errors: 0, durations: [] }
      }
      
      if (event.event_type === 'page_enter') {
        pageStats[event.page_id].visits++
      }
      
      if (!event.success || event.error) {
        pageStats[event.page_id].errors++
        totalErrors++
      }
      
      if (event.duration_ms) {
        pageStats[event.page_id].durations.push(event.duration_ms)
        allDurations.push(event.duration_ms)
      }
    }
  })
  
  // Calculate averages
  const finalPageStats: Record<string, { visits: number, errors: number, avgDuration: number }> = {}
  Object.entries(pageStats).forEach(([pageId, stats]) => {
    finalPageStats[pageId] = {
      visits: stats.visits,
      errors: stats.errors,
      avgDuration: stats.durations.length > 0 
        ? stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length 
        : 0
    }
  })
  
  const finalEdgeStats: Record<string, { transitions: number, failures: number, avgDuration: number }> = {}
  Object.entries(edgeStats).forEach(([edgeId, stats]) => {
    finalEdgeStats[edgeId] = {
      transitions: stats.transitions,
      failures: stats.failures,
      avgDuration: stats.durations.length > 0
        ? stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length
        : 0
    }
  })
  
  return {
    totalEvents: events.length,
    errorRate: events.length > 0 ? totalErrors / events.length : 0,
    avgDuration: allDurations.length > 0 
      ? allDurations.reduce((a, b) => a + b, 0) / allDurations.length 
      : 0,
    pageStats: finalPageStats,
    edgeStats: finalEdgeStats
  }
}

export function generateSampleTelemetry(): string {
  const events = [
    {
      timestamp: new Date(Date.now() - 60000).toISOString(),
      event_type: 'flow_start',
      page_id: 'overview',
      success: true,
      session_id: 'session-123'
    },
    {
      timestamp: new Date(Date.now() - 50000).toISOString(),
      event_type: 'page_enter',
      page_id: 'overview',
      success: true,
      duration_ms: 250
    },
    {
      timestamp: new Date(Date.now() - 40000).toISOString(),
      event_type: 'page_exit',
      page_id: 'overview',
      success: true
    },
    {
      timestamp: new Date(Date.now() - 35000).toISOString(),
      event_type: 'guard_result',
      gatekeeper_id: 'input_gate',
      success: false,
      error: 'Schema validation failed',
      duration_ms: 150
    },
    {
      timestamp: new Date(Date.now() - 30000).toISOString(),
      event_type: 'page_enter',
      page_id: 'input',
      success: true,
      duration_ms: 200
    },
    {
      timestamp: new Date(Date.now() - 20000).toISOString(),
      event_type: 'validation_result',
      page_id: 'input',
      success: false,
      error: 'Invalid data format'
    },
    {
      timestamp: new Date(Date.now() - 10000).toISOString(),
      event_type: 'error_occurred',
      page_id: 'input',
      success: false,
      error: 'Network timeout'
    }
  ]
  
  return events.map(event => JSON.stringify(event)).join('\n')
}