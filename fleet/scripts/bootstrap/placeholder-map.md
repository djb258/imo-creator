# Placeholder Map — Bootstrap Reference

Load during Phase 4 (Stamp) when replacing placeholders in stamped files.

---

## Valid Placeholders

| Placeholder | Value Source | Format | Example |
|-------------|-------------|--------|---------|
| [REPO_NAME] | Repo directory name | lowercase-hyphenated | ultimate-tool |
| [TIER] | Confirmed in Phase 1 | Garage / Car / Sub-Hub | Car |
| [DATE] | Current date | YYYY-MM-DD | 2026-03-09 |
| [SOVEREIGN_ID] | Developer declaration | HEIR notation | H.E.1.R |
| [PARENT_REPO] | Parent Car repo name | lowercase-hyphenated | imo-creator |

---

## Replacement Rules

1. Replace ALL instances of each placeholder in each stamped file.
2. Do not replace placeholders in files that already exist (skipped files).
3. Do not invent new placeholders. Only the five above are valid.
4. If a placeholder value is unknown, halt Phase 4 and ask developer.
   Do not stamp with empty or placeholder text like "TBD".

---

## Placeholder Validation

Before Phase 4 executes, confirm all placeholder values are known:

| Check | Pass Condition |
|-------|---------------|
| [REPO_NAME] | Matches actual directory name |
| [TIER] | Confirmed in Phase 1 |
| [DATE] | Current date, auto-populated |
| [SOVEREIGN_ID] | Developer declared (not generated) |
| [PARENT_REPO] | Required for Sub-Hub tier only |

If any required placeholder is unresolved → halt Phase 4, report to developer.
