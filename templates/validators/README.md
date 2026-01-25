# Validators — Per-Repo by Design

**Status**: GUIDANCE
**Authority**: IMO-Creator

---

## Purpose

This folder documents the validator pattern. **Validators are not shipped as templates.**

Validators are **generated per-repo** because:

1. They must reflect the specific hub/sub-hub structure of each repo
2. They must validate against that repo's actual `REGISTRY.yaml`
3. They must integrate with that repo's CI/CD pipeline

---

## Required Validators (Per-Repo)

Each downstream repo MUST implement these validators:

| Validator | Purpose | Checks |
|-----------|---------|--------|
| `ctb-structure-check` | CTB branch compliance | Folders exist, no rogue folders, no loose files in `src/` |
| `cc-descent-check` | CC gate compliance | PRD before code, ADR before code |
| `hub-spoke-check` | Hub/Spoke geometry | Spokes typed I/O only, hub has IMO |
| `registry-schema-check` | REGISTRY.yaml format | Required fields present, valid YAML |

---

## Implementation Pattern

```bash
# Example: ctb-structure-check.sh

#!/bin/bash
set -e

# Check CTB branches exist
for branch in sys data app ai ui; do
  if [ -d "src/$branch" ] || [ ! -d "src" ]; then
    echo "PASS: src/$branch"
  else
    echo "FAIL: src/$branch missing"
    exit 1
  fi
done

# Check forbidden folders
for forbidden in utils helpers common shared lib misc; do
  if [ -d "src/$forbidden" ]; then
    echo "FAIL: Forbidden folder src/$forbidden exists"
    exit 1
  fi
done

echo "CTB structure check passed"
```

---

## Why Not Template Validators?

| Reason | Explanation |
|--------|-------------|
| **Structure varies** | Each repo has different sub-hubs and processes |
| **CI varies** | GitHub Actions, GitLab CI, or other pipelines |
| **Language varies** | Python, Bash, Node — repo's choice |
| **Registry varies** | Validation must parse that repo's REGISTRY.yaml |

---

## Validator Admission

Downstream repos MUST:

1. Implement all required validators
2. Run validators in pre-commit hooks (local)
3. Run validators in CI pipeline (remote)
4. Document validator coverage in `REGISTRY.yaml`

---

## Compliance Rule

> Validators exist per-repo by design.
> This folder is guidance, not implementation.
> Silence here is intentional, not a gap.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-25 |
| Status | GUIDANCE |
| Authority | IMO-Creator |
