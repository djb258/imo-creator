import { useState } from 'react'
import { FlowSpec, HealthStatus, PageSpec, GatekeeperSpec, CheckResult, PageHealth } from '../types'
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Shield,
  Lock,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react'

interface SidebarProps {
  flowSpec: FlowSpec
  health: HealthStatus
  selectedNodeId: string | null
  onNodeSelect: (nodeId: string | null) => void
  telemetryEnabled: boolean
  onToggleTelemetry: () => void
}

export default function Sidebar({ 
  flowSpec, 
  health, 
  selectedNodeId, 
  onNodeSelect,
  telemetryEnabled,
  onToggleTelemetry
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pages: true,
    gatekeepers: true,
    health: true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-health-pass" />
      case 'warn': return <AlertTriangle className="w-4 h-4 text-health-warn" />
      case 'fail': return <XCircle className="w-4 h-4 text-health-fail" />
    }
  }

  const selectedNode = selectedNodeId ? {
    ...flowSpec.flow.pages[selectedNodeId] ? { 
      type: 'page', 
      spec: flowSpec.flow.pages[selectedNodeId],
      health: health.pages[selectedNodeId]
    } : {
      type: 'gatekeeper',
      spec: flowSpec.flow.gatekeepers[selectedNodeId],
      health: health.checks[`gatekeeper_${selectedNodeId}`]
    }
  } : null

  return (
    <div className="w-80 h-full bg-viz-panel border-r border-viz-border text-white overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-viz-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Flow Visualization</h2>
          <button
            onClick={onToggleTelemetry}
            className={`p-2 rounded-lg transition-colors ${
              telemetryEnabled 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}
            title="Toggle telemetry heat map"
          >
            {telemetryEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          VIN: {flowSpec.vin}
        </div>
        <div className="flex items-center gap-2 mt-2">
          {getStatusIcon(health.overall)}
          <span className="text-sm">Overall: {health.overall.toUpperCase()}</span>
        </div>
      </div>

      {/* Selected Node Detail */}
      {selectedNode && (
        <div className="p-4 border-b border-viz-border bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Selected Node</h3>
            <button 
              onClick={() => onNodeSelect(null)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear
            </button>
          </div>
          
          <div className="text-sm space-y-2">
            <div className="font-medium">{selectedNodeId}</div>
            
            {selectedNode.type === 'page' ? (
              <PageDetail spec={selectedNode.spec as PageSpec} health={selectedNode.health as PageHealth} />
            ) : (
              <GatekeeperDetail spec={selectedNode.spec as GatekeeperSpec} health={selectedNode.health as CheckResult} />
            )}
          </div>
        </div>
      )}

      {/* Pages Section */}
      <div className="border-b border-viz-border">
        <button
          onClick={() => toggleSection('pages')}
          className="w-full p-4 flex items-center gap-2 hover:bg-viz-bg/50 transition-colors"
        >
          {expandedSections.pages ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">Pages ({Object.keys(flowSpec.flow.pages).length})</span>
        </button>
        
        {expandedSections.pages && (
          <div className="pb-2">
            {Object.entries(flowSpec.flow.pages).map(([pageId, pageSpec]) => {
              const pageHealth = health.pages[pageId]
              const isSelected = selectedNodeId === pageId
              
              return (
                <button
                  key={pageId}
                  onClick={() => onNodeSelect(pageId)}
                  className={`w-full p-3 text-left hover:bg-viz-bg/50 transition-colors border-l-2 ${
                    isSelected ? 'border-blue-400 bg-blue-900/30' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(pageHealth?.status || 'fail')}
                    <span className="text-sm font-medium">{pageSpec.title}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {pageSpec.type} • {pageSpec.guards.length} guards • {pageSpec.validators.length} validators
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Gatekeepers Section */}
      <div className="border-b border-viz-border">
        <button
          onClick={() => toggleSection('gatekeepers')}
          className="w-full p-4 flex items-center gap-2 hover:bg-viz-bg/50 transition-colors"
        >
          {expandedSections.gatekeepers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">Gatekeepers ({Object.keys(flowSpec.flow.gatekeepers).length})</span>
        </button>
        
        {expandedSections.gatekeepers && (
          <div className="pb-2">
            {Object.entries(flowSpec.flow.gatekeepers).map(([gatekeeperId, gatekeeperSpec]) => {
              const gatekeeperHealth = health.checks[`gatekeeper_${gatekeeperId}`]
              const isSelected = selectedNodeId === gatekeeperId
              
              return (
                <button
                  key={gatekeeperId}
                  onClick={() => onNodeSelect(gatekeeperId)}
                  className={`w-full p-3 text-left hover:bg-viz-bg/50 transition-colors border-l-2 ${
                    isSelected ? 'border-blue-400 bg-blue-900/30' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(gatekeeperHealth?.status || 'fail')}
                    <span className="text-sm font-medium">🚪 {gatekeeperId}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {gatekeeperSpec.type} • {gatekeeperSpec.enforcement} • {gatekeeperSpec.rules.length} rules
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Health Checks Section */}
      <div>
        <button
          onClick={() => toggleSection('health')}
          className="w-full p-4 flex items-center gap-2 hover:bg-viz-bg/50 transition-colors"
        >
          {expandedSections.health ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">Health Checks</span>
        </button>
        
        {expandedSections.health && (
          <div className="pb-4">
            {Object.entries(health.checks).map(([checkId, checkResult]) => (
              <div key={checkId} className="p-3 border-l-2 border-transparent">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(checkResult.status)}
                  <span className="text-sm font-medium">{checkId}</span>
                </div>
                <div className="text-xs text-gray-400">{checkResult.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PageDetail({ spec, health }: { spec: PageSpec, health?: PageHealth }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span>{spec.type}</span>
      </div>
      
      {spec.guards.length > 0 && (
        <div>
          <div className="text-xs text-blue-300 mb-1">Guards:</div>
          <div className="text-xs text-gray-300">{spec.guards.join(', ')}</div>
        </div>
      )}
      
      {spec.validators.length > 0 && (
        <div>
          <div className="text-xs text-purple-300 mb-1">Validators:</div>
          <div className="text-xs text-gray-300">{spec.validators.join(', ')}</div>
        </div>
      )}
      
      {spec.telemetry.required && (
        <div>
          <div className="text-xs text-green-300 mb-1">Telemetry Events:</div>
          <div className="text-xs text-gray-300">{spec.telemetry.events.join(', ')}</div>
        </div>
      )}
      
      {health?.issues && health.issues.length > 0 && (
        <div>
          <div className="text-xs text-red-300 mb-1">Issues:</div>
          {health.issues.map((issue, i) => (
            <div key={i} className="text-xs text-red-200">{issue}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function GatekeeperDetail({ spec, health }: { spec: GatekeeperSpec, health?: CheckResult }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span>{spec.type} • {spec.enforcement}</span>
      </div>
      
      <div>
        <div className="text-xs text-orange-300 mb-1">Rules:</div>
        <div className="text-xs text-gray-300">{spec.rules.join(', ')}</div>
      </div>
      
      {health?.message && (
        <div>
          <div className="text-xs text-gray-300 mb-1">Status:</div>
          <div className="text-xs text-gray-200">{health.message}</div>
        </div>
      )}
      
      {health?.details && (
        <div>
          <div className="text-xs text-gray-300 mb-1">Details:</div>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(health.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}