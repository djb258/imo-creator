import { Handle, Position } from 'reactflow'
import { GatekeeperSpec, CheckResult } from '../types'
import { Lock, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface GatekeeperNodeProps {
  data: {
    label: string
    status: 'pass' | 'warn' | 'fail'
    spec: GatekeeperSpec
    health?: CheckResult
  }
  selected?: boolean
}

export default function GatekeeperNode({ data, selected }: GatekeeperNodeProps) {
  const { label, status, spec, health } = data

  const getStatusColor = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return 'border-health-pass bg-green-900/30'
      case 'warn': return 'border-health-warn bg-yellow-900/30'
      case 'fail': return 'border-health-fail bg-red-900/30'
    }
  }

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-health-pass" />
      case 'warn': return <AlertTriangle className="w-4 h-4 text-health-warn" />
      case 'fail': return <XCircle className="w-4 h-4 text-health-fail" />
    }
  }

  const getEnforcementIcon = (enforcement: string) => {
    return enforcement === 'strict' ? <Lock className="w-3 h-3 text-red-400" /> : 
           <Shield className="w-3 h-3 text-yellow-400" />
  }

  const glowClass = status === 'pass' ? 'health-glow-pass' : 
                   status === 'warn' ? 'health-glow-warn' : 'health-glow-fail'

  return (
    <div 
      className={`
        min-w-[160px] px-3 py-3 rounded-lg border-2 bg-viz-panel text-white
        transition-all duration-200 cursor-pointer relative
        ${getStatusColor(status)}
        ${selected ? 'ring-2 ring-blue-400 scale-105' : ''}
        ${glowClass}
      `}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {/* Gatekeeper ornament decoration */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-viz-bg"></div>
      
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon(status)}
        <div className="font-medium text-sm">{label}</div>
      </div>
      
      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex items-center gap-1">
          {getEnforcementIcon(spec.enforcement)}
          <span>{spec.type} • {spec.enforcement}</span>
        </div>
        
        <div className="text-orange-300">
          Rules: {spec.rules.slice(0, 2).join(', ')}
          {spec.rules.length > 2 && '...'}
        </div>
        
        {health?.message && (
          <div className="text-xs text-gray-400 truncate">
            {health.message}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
}