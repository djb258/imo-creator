# scripts/ (Root)

**Purpose**: Repository-level operational scripts for imo-creator itself.

These scripts operate on the **imo-creator repo** directly. They are NOT templates for child repos.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `verify_templates_manifest.sh` | Verify `templates/TEMPLATES_MANIFEST.yaml` matches actual files on disk |
| `fleet-status.sh` | Fleet health check — walks `FLEET_REGISTRY.yaml` and reports doctrine version status per child repo |
| `fleet-status.ps1` | Fleet health check (Windows equivalent) |
| `adr-check.sh` | ADR index audit — compares `ADR_INDEX.md` against actual ADR files found in fleet repos |
| `adr-check.ps1` | ADR index audit (Windows equivalent) |

### Fleet Scripts

`fleet-status.sh` and `adr-check.sh` operate ON imo-creator's fleet, not on individual repos. They read `FLEET_REGISTRY.yaml` (repo root) to discover child repos, then walk each one.

- **fleet-status**: Reads each child's `DOCTRINE.md` to get its version, compares against parent manifest version. Reports CURRENT / STALE / MISSING.
- **adr-check**: Scans each repo for ADR files (`docs/adr/ADR-*.md`), compares against `ADR_INDEX.md`. Reports discrepancies.

---

## Template Scripts (For Child Repos)

Child repo scripts live in `templates/scripts/` and are copied to downstream repos during bootstrap. See `templates/scripts/README.md`.
