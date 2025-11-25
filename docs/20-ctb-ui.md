---
title: CTB Layer - UI
aliases: [ui, ctb-ui, frontend, cli, web]
tags:
  - ctb/ui
  - imo/input
  - imo/output
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# CTB Layer: UI

> **Layer**: ui
> **Path**: `/src/ui`
> **Tests**: `/tests/ui`

---

## Purpose

The **ui** layer handles all user-facing interfaces - web dashboards, CLI tools, and generated documentation. This layer consumes the app layer's APIs and presents data to users.

---

## IMO Phase Mapping

| IMO Phase | Responsibility |
|-----------|----------------|
| **INPUT** | User interactions, form submissions, CLI commands |
| **MIDDLE** | Client-side validation, state management |
| **OUTPUT** | Rendered views, CLI output, generated docs |

---

## Modules

| Module | File Pattern | Purpose |
|--------|--------------|---------|
| **Web** | `web/*.ts`, `web/*.tsx` | React/Next.js components |
| **CLI** | `cli/*.py` | Command-line interface |
| **Generated** | `generated/*.md` | Auto-generated documentation |
| **Assets** | `assets/*` | Static files, styles |

---

## File Naming Conventions

```
/src/ui/
├── web/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── forms/
│   │       ├── BlueprintForm.tsx
│   │       └── ScaffoldForm.tsx
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── blueprints/
│   │   └── scaffold/
│   ├── hooks/
│   │   ├── useSubagents.ts
│   │   ├── useBlueprints.ts
│   │   └── useHealth.ts
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   └── utils.ts        # UI utilities
│   └── styles/
│       ├── globals.css
│       └── tailwind.config.js
├── cli/
│   ├── __init__.py
│   ├── main.py             # CLI entrypoint
│   ├── commands/
│   │   ├── scaffold.py     # imo scaffold <template>
│   │   ├── validate.py     # imo validate <manifest>
│   │   └── audit.py        # imo audit <repo>
│   └── output/
│       ├── formatters.py   # Output formatting
│       └── colors.py       # Terminal colors
└── generated/
    ├── diagrams/           # Auto-generated diagrams
    ├── summaries/          # Auto-generated summaries
    └── indexes/            # Search indexes
```

---

## Dependencies

| Depends On | Reason |
|------------|--------|
| **system** | Constants, config |
| **app** | API routes for data |

| Depended By | Reason |
|-------------|--------|
| None | UI is the presentation layer |

---

## Web Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React framework, SSR |
| Tailwind | Utility-first CSS |
| Vercel | Deployment platform |
| TypeScript | Type safety |

---

## CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `imo scaffold` | Create new repo from template | `imo scaffold my-app --template=default` |
| `imo validate` | Validate blueprint manifest | `imo validate ./manifest.yaml` |
| `imo audit` | Audit repo for doctrine compliance | `imo audit ./my-repo` |
| `imo diagram` | Generate architecture diagrams | `imo diagram ./my-repo --format=svg` |

---

## Kill Switch Behavior

| Failure | UI Layer Response |
|---------|-------------------|
| API unreachable | Show error toast, retry button |
| Form validation fails | Inline error messages |
| CLI command fails | Exit code 1, stderr output |
| Render error | Error boundary, fallback UI |

---

## Deployment

| Target | Platform | Config |
|--------|----------|--------|
| Web | Vercel | `vercel.json` |
| CLI | PyPI | `setup.py` |
| Docs | GitHub Pages | `.github/workflows/` |

---

## Testing Requirements

```bash
# Run UI tests
npm test                    # Web tests (Jest)
pytest tests/ui/ -v         # CLI tests

# Required coverage
# - Components: 80%+
# - Hooks: 85%+
# - CLI commands: 90%+

# E2E tests
npx playwright test         # Web E2E
pytest tests/ui/ -m e2e     # CLI E2E
```

---

## Related Docs

- [10-imo.md](./10-imo.md) - IMO definition
- [vercel.json](../vercel.json) - Vercel config
- [index.html](../index.html) - Landing page
