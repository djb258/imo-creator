export interface FlowSpec {
  schema_version: string
  vin: string
  metadata: {
    created_at: string
    author: string
    environment: string
    stamped: boolean
  }
  flow: {
    entrypoint: string
    pages: Record<string, PageSpec>
    gatekeepers: Record<string, GatekeeperSpec>
  }
  compliance: {
    heir_rules: string[]
    orbt_version: string
    enforcement_level: string
  }
}

export interface PageSpec {
  id: string
  title: string
  type: string
  guards: string[]
  validators: string[]
  next?: string[]
  telemetry: {
    events: string[]
    required: boolean
  }
}

export interface GatekeeperSpec {
  type: string
  rules: string[]
  enforcement: string
}

export interface HealthStatus {
  overall: 'pass' | 'warn' | 'fail'
  timestamp: string
  checks: Record<string, CheckResult>
  pages: Record<string, PageHealth>
}

export interface CheckResult {
  status: 'pass' | 'warn' | 'fail'
  message: string
  details?: any
}

export interface PageHealth {
  status: 'pass' | 'warn' | 'fail'
  guards_status: 'pass' | 'warn' | 'fail'
  validators_status: 'pass' | 'warn' | 'fail'
  telemetry_status: 'pass' | 'warn' | 'fail'
  issues: string[]
}

export interface TelemetryEvent {
  timestamp: string
  event_type: string
  page_id?: string
  gatekeeper_id?: string
  success: boolean
  duration_ms?: number
  error?: string
}

export interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    status: 'pass' | 'warn' | 'fail'
    spec: PageSpec | GatekeeperSpec
    health?: PageHealth | CheckResult
  }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
  style?: any
}