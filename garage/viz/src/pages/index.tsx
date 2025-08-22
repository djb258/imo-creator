import { useState, useEffect } from 'react'
import Head from 'next/head'
import { FlowVizProvider } from '../components/FlowViz'
import FlowViz from '../components/FlowViz'
import Sidebar from '../components/Sidebar'
import MermaidView from '../components/MermaidView'
import { FlowSpec, HealthStatus, TelemetryEvent } from '../types'
import { generateMermaidDiagram, loadMermaidFromFile } from '../lib/mermaid-generator'
import { parseTelemetryLog, generateHeatMap, generateSampleTelemetry, TelemetryHeatMap } from '../lib/telemetry-analyzer'
import { RefreshCw, BarChart3, FileText, Activity } from 'lucide-react'

export default function Dashboard() {
  const [flowSpec, setFlowSpec] = useState<FlowSpec | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'flow' | 'mermaid'>('flow')
  const [telemetryEnabled, setTelemetryEnabled] = useState(false)
  const [telemetryHeatMap, setTelemetryHeatMap] = useState<TelemetryHeatMap>({})
  const [mermaidDiagram, setMermaidDiagram] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Update mermaid diagram when flow spec or health changes
  useEffect(() => {
    if (flowSpec && health) {
      const diagram = generateMermaidDiagram(flowSpec, health)
      setMermaidDiagram(diagram)
    }
  }, [flowSpec, health])

  // Load telemetry data when enabled
  useEffect(() => {
    if (telemetryEnabled) {
      loadTelemetryData()
    }
  }, [telemetryEnabled])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load flow spec
      const flowResponse = await fetch('/api/data/flow.json')
      if (flowResponse.ok) {
        const flowData = await flowResponse.json()
        setFlowSpec(flowData)
      } else {
        // Fallback to sample data
        setFlowSpec(getSampleFlowSpec())
      }

      // Load health data
      const healthResponse = await fetch('/api/data/health.json')
      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        setHealth(healthData)
      } else {
        // Fallback to sample data
        setHealth(getSampleHealthStatus())
      }

      // Try to load existing mermaid diagram
      try {
        const mermaidData = await loadMermaidFromFile('/api/data/diagram.mmd')
        setMermaidDiagram(mermaidData)
      } catch {
        // Will be generated from flow spec
      }

      setLastRefresh(new Date())
      setLoading(false)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load visualization data')
      
      // Use sample data as fallback
      setFlowSpec(getSampleFlowSpec())
      setHealth(getSampleHealthStatus())
      setLoading(false)
    }
  }

  const loadTelemetryData = async () => {
    try {
      const telemetryResponse = await fetch('/api/data/telemetry.jsonl')
      let telemetryData: string
      
      if (telemetryResponse.ok) {
        telemetryData = await telemetryResponse.text()
      } else {
        // Use sample telemetry data
        telemetryData = generateSampleTelemetry()
      }
      
      const events = parseTelemetryLog(telemetryData)
      const heatMap = generateHeatMap(events)
      setTelemetryHeatMap(heatMap)
    } catch (err) {
      console.error('Failed to load telemetry:', err)
    }
  }

  const refreshData = () => {
    loadData()
    if (telemetryEnabled) {
      loadTelemetryData()
    }
  }

  const exportMermaid = async () => {
    if (!mermaidDiagram) return
    
    try {
      await navigator.clipboard.writeText(mermaidDiagram)
      alert('Mermaid diagram copied to clipboard!')
    } catch {
      // Fallback: download as file
      const blob = new Blob([mermaidDiagram], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'flow-diagram.mmd'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-viz-bg flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <div>Loading visualization data...</div>
        </div>
      </div>
    )
  }

  if (error || !flowSpec || !health) {
    return (
      <div className="min-h-screen bg-viz-bg flex items-center justify-center">
        <div className="text-red-400 text-center">
          <div className="text-lg mb-4">Failed to Load Data</div>
          <div className="text-sm text-gray-400 mb-4">
            {error || 'Missing flow specification or health data'}
          </div>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>IMO Factory + Garage Visualization</title>
        <meta name="description" content="HEIR/ORBT compliant flow visualization dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-viz-bg text-white flex">
        {/* Sidebar */}
        <Sidebar
          flowSpec={flowSpec}
          health={health}
          selectedNodeId={selectedNodeId}
          onNodeSelect={setSelectedNodeId}
          telemetryEnabled={telemetryEnabled}
          onToggleTelemetry={() => setTelemetryEnabled(!telemetryEnabled)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-viz-panel border-b border-viz-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">Factory + Garage Visualization</h1>
                <div className="text-sm text-gray-400">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-viz-bg rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('flow')}
                    className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-2 ${
                      viewMode === 'flow' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Flow
                  </button>
                  <button
                    onClick={() => setViewMode('mermaid')}
                    className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-2 ${
                      viewMode === 'mermaid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Mermaid
                  </button>
                </div>

                {/* Actions */}
                <button
                  onClick={refreshData}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                
                {viewMode === 'mermaid' && (
                  <button
                    onClick={exportMermaid}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Export
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 relative">
            {viewMode === 'flow' ? (
              <FlowVizProvider>
                <FlowViz
                  flowSpec={flowSpec}
                  health={health}
                  selectedNodeId={selectedNodeId}
                  onNodeSelect={setSelectedNodeId}
                  telemetryHeatMap={telemetryEnabled ? telemetryHeatMap : undefined}
                />
              </FlowVizProvider>
            ) : (
              <MermaidView
                diagram={mermaidDiagram}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Sample data for fallback
function getSampleFlowSpec(): FlowSpec {
  return {
    schema_version: "HEIR/1.0",
    vin: "IMO-2025-01-FACTORY-GARAGE-V1",
    metadata: {
      created_at: new Date().toISOString(),
      author: "imo-creator",
      environment: "production",
      stamped: true
    },
    flow: {
      entrypoint: "overview",
      pages: {
        overview: {
          id: "overview",
          title: "Blueprint Overview",
          type: "dashboard",
          guards: ["auth", "health_check"],
          validators: ["manifest_present", "progress_valid"],
          next: ["input", "middle", "output"],
          telemetry: { events: ["page_view", "button_click"], required: true }
        },
        input: {
          id: "input",
          title: "Input Processing",
          type: "workflow",
          guards: ["auth", "permission_write"],
          validators: ["schema_valid", "idempotency_check"],
          telemetry: { events: ["data_input", "validation"], required: true }
        },
        middle: {
          id: "middle", 
          title: "Transformation Pipeline",
          type: "workflow",
          guards: ["auth", "permission_transform"],
          validators: ["transform_valid", "heir_compliance"],
          telemetry: { events: ["transform_start", "transform_complete"], required: true }
        },
        output: {
          id: "output",
          title: "Output Distribution", 
          type: "workflow",
          guards: ["auth", "permission_publish"],
          validators: ["output_schema_valid", "publish_ready"],
          telemetry: { events: ["publish_start", "publish_complete"], required: true }
        }
      },
      gatekeepers: {
        input_gate: {
          type: "validator",
          rules: ["schema_congruence", "vin_format", "version_lock"],
          enforcement: "strict"
        },
        middle_gate: {
          type: "transformer", 
          rules: ["heir_compliance", "data_integrity", "audit_trail"],
          enforcement: "strict"
        },
        output_gate: {
          type: "publisher",
          rules: ["final_validation", "signature_present", "telemetry_complete"],
          enforcement: "strict"
        }
      }
    },
    compliance: {
      heir_rules: ["STAMPED", "SPVPET", "STACKED"],
      orbt_version: "1.0.0",
      enforcement_level: "strict"
    }
  }
}

function getSampleHealthStatus(): HealthStatus {
  return {
    overall: "warn",
    timestamp: new Date().toISOString(),
    checks: {
      vin_format: { status: "pass", message: "VIN format valid" },
      schema_congruence: { status: "pass", message: "Schema congruent with HEIR rules" },
      gatekeeper_presence: { status: "warn", message: "2 of 3 gatekeepers active" },
      validator_status: { status: "fail", message: "Schema validation failing" },
      telemetry_active: { status: "pass", message: "Telemetry heartbeat active" },
      heir_compliance: { status: "warn", message: "SPVPET partially compliant" },
      gatekeeper_input_gate: { status: "warn", message: "Schema validation warnings" },
      gatekeeper_middle_gate: { status: "pass", message: "All checks passing" },
      gatekeeper_output_gate: { status: "fail", message: "Signature validation failed" }
    },
    pages: {
      overview: {
        status: "pass",
        guards_status: "pass",
        validators_status: "pass", 
        telemetry_status: "pass",
        issues: []
      },
      input: {
        status: "warn",
        guards_status: "pass",
        validators_status: "warn",
        telemetry_status: "pass",
        issues: ["Schema validation warnings", "Idempotency check slow"]
      },
      middle: {
        status: "pass",
        guards_status: "pass",
        validators_status: "pass",
        telemetry_status: "pass", 
        issues: []
      },
      output: {
        status: "fail",
        guards_status: "pass",
        validators_status: "fail",
        telemetry_status: "pass",
        issues: ["Output schema validation failed", "Signature missing"]
      }
    }
  }
}