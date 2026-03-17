const API_BASE = import.meta.env.VITE_API_BASE || 'https://svg-outreach.workers.dev';
const L0_API_BASE = import.meta.env.VITE_L0_API_BASE || 'https://layer0-engine.svg-outreach.workers.dev';

async function fetchFromBase<T = unknown>(base: string, path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

// SVG Outreach API
export const fetchAPI = <T = unknown>(path: string, params?: Record<string, string>) =>
  fetchFromBase<T>(API_BASE, path, params);

// Health
export const getHealth = () => fetchAPI('/health');

// Tier 0 Engine
export const getL0Health = () => fetchFromBase(L0_API_BASE, '/health');
export const getL0Sessions = () => fetchFromBase<{ sessions: L0Session[] }>(L0_API_BASE, '/api/sessions');
export const getL0Session = (id: string) => fetchFromBase<{ gates: L0GateResult[]; constants: L0Constant[] }>(L0_API_BASE, `/api/sessions/${id}`);
export const getL0Constants = (sessionId?: string) => {
  const params = sessionId ? { session_id: sessionId } : undefined;
  return fetchFromBase<{ constants: L0Constant[]; total?: number }>(L0_API_BASE, '/api/constants', params);
};
export const getL0GateResults = (sessionId: string) =>
  fetchFromBase<{ gates: L0GateResult[] }>(L0_API_BASE, `/api/sessions/${sessionId}/gates`);
export const getL0BackPropLog = (sessionId: string) =>
  fetchFromBase<{ backprop: L0BackProp[] }>(L0_API_BASE, `/api/sessions/${sessionId}/backprop`);
export const getL0Variables = (sessionId: string) =>
  fetchFromBase<{ variables: L0Variable[] }>(L0_API_BASE, `/api/sessions/${sessionId}/variables`);

// Tier 0 types
export interface L0Session {
  id: string;
  domain_name: string;
  domain_description: string;
  status: 'IN_PROGRESS' | 'COMPLETE' | 'FAILED';
  total_gates: number;
  total_constants: number;
  total_variables: number;
  final_sigma: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface L0GateResult {
  id: string;
  session_id: string;
  gate_number: number;
  altitude_ft: number;
  candidate_constant: string;
  imo_validation: string | null;
  ctb_validation: string | null;
  circle_validation: string | null;
  monte_carlo_sigma: number | null;
  prior_gate_sigma: number | null;
  sigma_direction: 'TIGHTENED' | 'UNCHANGED' | 'EXPANDED' | null;
  verdict: string;
  back_propagation_target: number | null;
  created_at: string;
}

export interface L0Constant {
  id: string;
  session_id: string;
  gate_number: number;
  constant_name: string;
  constant_definition: string;
  validation_evidence: string;
  created_at: string;
}

export interface L0BackProp {
  id: string;
  session_id: string;
  trigger_gate: number;
  target_gate: number;
  original_verdict: string;
  new_verdict: string;
  reason: string;
  created_at: string;
}

export interface L0Variable {
  id: string;
  session_id: string;
  variable_name: string;
  variable_type: string;
  range_min: number | null;
  range_max: number | null;
  distribution: string | null;
  created_at: string;
}

// Domains
export const getDomains = () => fetchAPI('/domains');

// Reference Bible
export const getGlossary = (term?: string) =>
  fetchAPI('/reference/glossary', term ? { term } : undefined);
export const getArchitecture = (component?: string) =>
  fetchAPI('/reference/architecture', component ? { component } : undefined);
export const getCFPlatform = (product?: string) =>
  fetchAPI('/reference/cf-platform', product ? { product } : undefined);
export const getSchema = (table?: string) =>
  fetchAPI('/reference/schema', table ? { table } : undefined);
export const getHandoffRules = (source?: string, target?: string) => {
  const params: Record<string, string> = {};
  if (source) params.source = source;
  if (target) params.target = target;
  return fetchAPI('/reference/handoff', params);
};
export const searchReference = (q: string) => fetchAPI('/reference/search', { q });

// Email Triage
export const getEmailsByCompany = (id: string) => fetchAPI(`/email/by-company/${id}`);
export const getEmailsByInbox = (inbox: string) => fetchAPI(`/email/by-inbox/${inbox}`);
export const getUnclassifiedEmails = () => fetchAPI('/email/unclassified');
export const getEmailTimeline = (id: string) => fetchAPI(`/email/timeline/${id}`);
export const searchEmails = (q: string) => fetchAPI('/email/search', { q });

// Activity Ledger
export const getActivityTimeline = (id: string, params?: Record<string, string>) =>
  fetchAPI(`/activity/timeline/${id}`, params);
export const getActivitySummary = (id: string) => fetchAPI(`/activity/summary/${id}`);

// Video
export const getVideoList = (clientId: string, token: string) =>
  fetchAPI(`/video/list/${clientId}`, { token });
