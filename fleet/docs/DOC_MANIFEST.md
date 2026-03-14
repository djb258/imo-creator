# DOC_MANIFEST — Standard Document Structure

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Status | ACTIVE |
| Authority | imo-creator (Sovereign) |

---

## Purpose

Every repo in the fleet uses the same document layout. No exceptions. The dashboard resolves docs by convention — if a repo follows this structure, it works automatically. If it doesn't, the doc shows as MISSING until it conforms.

---

## Standard Structure

```
{repo}/
  CLAUDE.md
  README.md
  CONSTITUTION.md
  docs/
    PRD.md
    OSAM.md
    ERD.md
    CHECKLIST.md
    adr/
      ADR-NNN-*.md
```

---

## Resolution Rules

| File Location | Rule |
|---------------|------|
| Root files | `CLAUDE.md`, `README.md`, `CONSTITUTION.md` live at `{repo}/` |
| Doc files | Everything else lives at `{repo}/docs/` |
| ADR files | Always `{repo}/docs/adr/ADR-NNN-*.md` |
| Custom paths | If `file` contains `/`, resolve as relative from repo root |

---

## Conformance

Every child repo MUST place docs in these exact paths. The dashboard doc resolver uses `REPO_ROOTS[repoName] + '/' + file` — if the file isn't where the convention says it is, it won't resolve.

### Garage Exception

`imo-creator` (the Garage) has additional doc paths under `templates/` that are not part of the standard child structure. These are resolved as custom relative paths (they contain `/`).

---

## Dashboard Integration

The dashboard's `docResolver.ts` implements this manifest:

```
resolveDoc(repo, file)  → REPO_ROOTS[repo] + '/' + file
resolveAdrDir(repo)     → REPO_ROOTS[repo] + '/docs/adr'
```

No hardcoded paths in components. No `diskPath` on data objects. One resolver, one convention.
