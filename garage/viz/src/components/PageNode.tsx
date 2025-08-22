import { Handle, Position } from 'reactflow'
import { PageSpec, PageHealth } from '../types'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface PageNodeProps {
  data: {
    label: string
    status: 'pass' | 'warn' | 'fail'
    spec: PageSpec
    health?: PageHealth
  }
  selected?: boolean
}

export default function PageNode({ data, selected }: PageNodeProps) {
  const { label, status, spec, health } = data

  const getStatusColor = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return 'border-health-pass bg-green-900/20'
      case 'warn': return 'border-health-warn bg-yellow-900/20'
      case 'fail': return 'border-health-fail bg-red-900/20'
    }
  }

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-health-pass" />
      case 'warn': return <AlertTriangle className="w-4 h-4 text-health-warn" />
      case 'fail': return <XCircle className="w-4 h-4 text-health-fail" />
    }
  }

  const glowClass = status === 'pass' ? 'health-glow-pass' : 
                   status === 'warn' ? 'health-glow-warn' : 'health-glow-fail'

  return (
    <div 
      className={`
        min-w-[180px] px-4 py-3 rounded-lg border-2 bg-viz-panel text-white
        transition-all duration-200 cursor-pointer
        ${getStatusColor(status)}
        ${selected ? 'ring-2 ring-blue-400 scale-105' : ''}
        ${glowClass}
      `}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon(status)}
        <div className="font-medium text-sm">{label}</div>
      </div>
      
      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>{spec.type}</span>
        </div>
        
        {spec.guards.length > 0 && (
          <div className="text-blue-300">
            Guards: {spec.guards.slice(0, 2).join(', ')}
            {spec.guards.length > 2 && '...'}
          </div>
        )}
        
        {spec.validators.length > 0 && (
          <div className="text-purple-300">
            Validators: {spec.validators.slice(0, 2).join(', ')}
            {spec.validators.length > 2 && '...'}
          </div>
        )}
        
        {health && health.issues.length > 0 && (
          <div className="text-red-300 text-xs truncate">
            Issues: {health.issues.length}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
}