const API_BASE = import.meta.env.VITE_API_BASE || 'https://svg-outreach.workers.dev';

export async function fetchAPI<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

// Health
export const getHealth = () => fetchAPI('/health');

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
