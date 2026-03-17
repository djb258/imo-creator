export interface CheckTask {
  url_id: string;
  domain: string;
  path: string;
  field_name: string;
  field_id: string;
}

export interface GateResult {
  gate: number;
  name: string;
  passed: boolean;
  error: string | null;
  duration_ms: number;
}

export interface CheckResult {
  task: CheckTask;
  gate_reached: number;
  gates: GateResult[];
  old_value: string | null;
  new_value: string | null;
  changed: boolean;
  total_duration_ms: number;
  error: string | null;
}
