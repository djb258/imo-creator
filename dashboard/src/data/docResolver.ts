/**
 * Central doc resolver — one map, one function.
 * Follows templates/doc/DOC_MANIFEST.md conventions.
 *
 * NOTE: Disk paths are only valid in the dev environment.
 */

export const REPO_ROOTS: Record<string, string> = {
  'imo-creator': '/Users/employeeai/Documents/IMO-Creator',
  'barton-outreach-core': '/Users/employeeai/Documents/barton-outreach-core',
  'client': '/Users/employeeai/Documents/client',
  'company-lifecycle-cl': '/Users/employeeai/Documents/CL/company-lifecycle-cl',
  'sales': '/Users/employeeai/Documents/Sales Process',
  'barton-storage': '/Users/employeeai/Documents/storage container go-nogo',
};

/** Resolve a doc file to an absolute disk path */
export function resolveDoc(repo: string, file: string): string | undefined {
  const root = REPO_ROOTS[repo];
  if (!root) return undefined;
  return `${root}/${file}`;
}

const ADR_DIR_OVERRIDES: Record<string, string> = {
  'imo-creator': 'templates/adr',
};

/** Resolve the ADR directory for a repo */
export function resolveAdrDir(repo: string): string | undefined {
  const root = REPO_ROOTS[repo];
  if (!root) return undefined;
  return `${root}/${ADR_DIR_OVERRIDES[repo] ?? 'docs/adr'}`;
}
