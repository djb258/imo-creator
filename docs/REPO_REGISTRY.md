# Repo Registry — Alias Resolution

**Authority**: imo-creator (CC-01 Sovereign)
**Version**: 1.0.0
**Status**: OPERATIONAL

---

## Purpose

The Repo Registry provides deterministic alias-to-URL resolution for all child repositories. Instead of passing raw GitHub URLs through WORK_PACKETs, users reference repos by short alias (e.g., `client`, `outreach`, `sales`). The Worker resolves the alias through `sys/registry/repo_registry.json` before mounting.

This enables phone-friendly intake, eliminates URL typos, and enforces branch allowlists and enable/disable gates at the registry level.

---

## How It Works

```
User says "client"
    → Planner validates alias in repo_registry.json
    → WORK_PACKET.target_repo_alias = "client", target_branch = "main"
    → Worker loads repo_registry.json
    → Resolves: github_url, default_branch, auth_method, workspace_slug
    → Validates: enabled=true, branch in allowed_branches
    → Derives mount path: /workspaces/client/main/
    → Emits mount_receipt (resolved_repo_url, resolved_branch, resolved_workspace_path, auth_method)
    → Mount protocol proceeds with resolved values
```

---

## Registry Files

| File | Purpose |
|------|---------|
| `sys/registry/repo_registry.json` | Alias → URL + branch + auth mapping for all child repos |
| `sys/registry/repo_registry.schema.json` | JSON Schema enforcing registry structure |
| `sys/registry/repo_pull_policy.json` | Controls whether raw URLs (bypassing alias) are permitted |

---

## How to Add a New Repo Alias

1. Open `sys/registry/repo_registry.json`.
2. Add an entry to the `repos` array:

```json
{
  "repo_alias": "my-repo",
  "display_name": "My Repo Display Name",
  "github_url": "https://github.com/OWNER/my-repo.git",
  "default_branch": "main",
  "allowed_branches": ["main", "master", "develop"],
  "auth_method": "https_token",
  "workspace_slug": "my-repo",
  "enabled": true
}
```

3. Validate against `sys/registry/repo_registry.schema.json`.
4. Commit. The alias is now available for WORK_PACKETs.

### Field Rules

| Field | Constraint |
|-------|-----------|
| `repo_alias` | Lowercase, 2-32 chars, `[a-z0-9_-]` only. Must be unique. |
| `display_name` | Human-readable. Non-empty. |
| `github_url` | Must match `^(https://github\.com/\|git@github\.com:).+\.git$`. |
| `default_branch` | Used when WORK_PACKET omits `target_branch`. |
| `allowed_branches` | Allowlist. Branch not in this list = FAIL at resolution. |
| `auth_method` | `ssh` or `https_token`. Determines clone authentication. |
| `workspace_slug` | Directory slug for mount isolation. One workspace per repo. `[a-z0-9_-]`, 2-32 chars. |
| `enabled` | Must be `true` for the repo to be mountable. `false` = fail closed. |

---

## Enabled / Disabled Semantics

| State | Behavior |
|-------|----------|
| `enabled: true` | Alias resolves normally. Mount proceeds. |
| `enabled: false` | Alias exists but is blocked. Worker halts with FAIL. Mount does not proceed. |

Use `enabled: false` to:
- Temporarily block a repo without removing it from the registry.
- Stage a repo entry before it's ready for production use.
- Disable a repo during maintenance or migration.

Re-enabling requires setting `enabled: true` and committing. No ADR required for enable/disable toggling.

---

## Branch Allowlist

Every registry entry declares `allowed_branches` — the branches the Garage is permitted to clone and mount.

| Scenario | Outcome |
|----------|---------|
| `target_branch` in `allowed_branches` | Proceed |
| `target_branch` not in `allowed_branches` | FAIL — branch not allowed |
| `target_branch` omitted | Use `default_branch` (which must be in `allowed_branches`) |

This prevents accidental mounts of feature branches, release branches, or any branch not explicitly approved.

---

## Why Raw URLs Are Blocked

By default, `repo_pull_policy.json` sets `allow_raw_url: false`. This means:

- All repos **must** be registered in `repo_registry.json` with alias, allowed branches, and auth method.
- Raw URL pulls bypass alias resolution, branch allowlists, and workspace isolation.
- No WORK_PACKET can specify `target_repo_url` unless the policy is temporarily overridden.

### Override Protocol

To temporarily allow raw URLs:

1. Submit an ADR at sovereign level with justification.
2. Obtain human approval.
3. Set `allow_raw_url: true` in `repo_pull_policy.json`.
4. Perform the one-off operation.
5. Revert `allow_raw_url` to `false` immediately after.

This is an emergency-only path. Permanent raw URL access is not permitted.

---

## Audit Enforcement

**RULE-013: NO_UNREGISTERED_REPO_PULL** (in `sys/registry/audit_rules.json`)

The Auditor evaluates every execution for:

| Check | On Failure |
|-------|-----------|
| `mount_receipt` is present | FAIL_EXECUTION |
| `resolution_method` is `alias` (unless raw URL policy is true) | FAIL_EXECUTION |
| `resolved_alias` exists in `repo_registry.json` | FAIL_EXECUTION |
| Resolved repo has `enabled: true` | FAIL_EXECUTION |
| `resolved_branch` is in `allowed_branches` | FAIL_EXECUTION |

No mount_receipt = no proof of resolution = audit failure.

---

## Example: Phone Command to WORK_PACKET

**User says** (from phone): "Run the audit checklist against client on main"

**Planner produces WORK_PACKET V2**:

```json
{
  "id": "WP-2026-0225-001",
  "change_type": "audit",
  "target_repo_alias": "client",
  "target_branch": "main",
  "architectural_flag": false,
  "requires_pressure_test": false,
  "allowed_paths": ["docs/", "checklists/"],
  "summary": "Run audit checklist against client repo on main branch.",
  "doctrine_version": "3.5.0",
  "timestamp": "2026-02-25T12:00:00Z",
  "payload": {},
  "db_required": false,
  "ui_required": false,
  "container_required": false
}
```

**Planner validates**:
- `"client"` → found in `repo_registry.json` → `enabled: false` (seed default; set to `true` when ready)
- `target_branch: "main"` → in `allowed_branches: ["main", "master", "develop"]` → PASS
- Emits WORK_PACKET with `target_repo_alias: "client"`, `target_branch: "main"`

**Worker resolves**:
- `target_repo_alias: "client"` → looks up `repo_registry.json`
- Resolves: `resolved_repo_url: "https://github.com/OWNER/client.git"`, `auth_method: "https_token"`, `workspace_slug: "client"`
- Derives: `resolved_workspace_path: "/workspaces/client/main/"`
- Emits `mount_receipt` → clone proceeds into `/workspaces/client/main/`

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-25 |
| Authority | imo-creator (Sovereign) |
| Version | 1.0.0 |
| Related | `sys/registry/repo_registry.json`, `sys/registry/repo_pull_policy.json`, RULE-013 |
