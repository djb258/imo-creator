# templates/scripts/

**Purpose**: Template scripts for child repos. Copied during bootstrap.

These scripts are distributed to downstream repos. They enforce doctrine compliance, manage hooks, and automate codegen.

---

## Scripts

### Hooks

| Script | Purpose |
|--------|---------|
| `hooks/pre-commit` | Pre-commit doctrine compliance gate (10 checks) |

### Doctrine & CTB

| Script | Purpose |
|--------|---------|
| `apply_doctrine_audit.sh` | Full doctrine audit with attestation output |
| `ctb_init.sh` | Initialize CTB folder structure |
| `ctb_verify.sh` | Verify CTB compliance |
| `ctb_enforce.sh` | Enforce CTB rules (used by CI) |
| `ctb_check_version.sh` | Check CTB doctrine version |
| `ctb_scaffold_new_repo.sh` | Scaffold new repo with CTB structure |
| `apply_ctb_plan.py` | Apply CTB migration plan |

### Codegen (Registry-First)

| Script | Purpose |
|--------|---------|
| `codegen-generate.sh` | Generate TypeScript types + Zod schemas from `column_registry.yml` |
| `codegen-verify.sh` | Drift detection: verify generated files match registry |

### Manifest Verification

| Script | Purpose |
|--------|---------|
| `verify_manifest.sh` | Manifest sync verification (Unix) |
| `verify_manifest.ps1` | Manifest sync verification (Windows) |

### Setup & Tools

| Script | Purpose |
|--------|---------|
| `install-hooks.sh` | Install git hooks (Unix) |
| `install-hooks.ps1` | Install git hooks (Windows) |
| `dev_setup.sh` | Development environment setup |
| `install_required_tools.sh` | Install required tools |
| `verify_required_tools.sh` | Verify required tools |

### Doctrine Sync

| Script | Purpose |
|--------|---------|
| `update_from_imo_creator.sh` | Pull updates from imo-creator |
| `push-doctrine-update.sh` | Push doctrine updates (Unix) |
| `push-doctrine-update.ps1` | Push doctrine updates (Windows) |

### Security

| Script | Purpose |
|--------|---------|
| `security_lockdown.sh` | Security scan and secret detection |
