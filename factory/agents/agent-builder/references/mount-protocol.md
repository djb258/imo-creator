# Mount Protocol — Repo Resolution and Clone Integrity

## Resolution Sequence

1. Read `WORK_PACKET.target_repo_alias` (or `target_repo_url` if present).
2. Enforce exactly-one rule: exactly one of `target_repo_alias` or `target_repo_url` must be present. Both = **FAIL**. Neither = **FAIL**.
3. **If alias provided:**
   - Load `law/registry/repo_registry.json`.
   - Find entry where `repo_alias === target_repo_alias`.
   - If no match: **HALT. FAIL — unknown alias.**
   - If `entry.enabled === false`: **HALT. FAIL — repo disabled.**
   - Resolve: `github_url`, `default_branch`, `auth_method`, `workspace_slug`.
   - If `WORK_PACKET.target_branch` is set: verify it exists in `entry.allowed_branches`. If not: **HALT. FAIL — branch not in allowlist.**
   - If `WORK_PACKET.target_branch` is absent: use `entry.default_branch`.
4. **If raw URL provided:**
   - Load `law/registry/repo_pull_policy.json`.
   - If `allow_raw_url === false`: **HALT. FAIL_SCOPE — raw URLs blocked by policy.**
   - If `allow_raw_url === true`: proceed with raw URL. Log warning.
5. Derive mount path: `/workspaces/<workspace_slug>/<resolved_branch>/`
6. Emit **mount_receipt** artifact.

## mount_receipt Fields

| Field | Value |
|-------|-------|
| `resolved_alias` | The alias that was resolved (or `null` if raw URL) |
| `resolved_repo_url` | The github_url from registry (or the raw URL) |
| `resolved_branch` | The branch that was cloned |
| `resolved_workspace_path` | Derived path: `/workspaces/<workspace_slug>/<branch>/` |
| `auth_method` | Auth method from registry |
| `resolved_commit_sha` | HEAD SHA after clone (`git rev-parse HEAD`) |
| `remote_head_sha` | Remote branch SHA after clone (`git rev-parse origin/<branch>`) |
| `detached_head` | Boolean — `true` if detached HEAD state, `false` otherwise |
| `doctrine_version` | Current doctrine version at resolution time |
| `timestamp` | ISO 8601 timestamp after clone and integrity capture |

## Post-Clone Integrity Capture

After clone completes and before validation:

1. Capture `resolved_commit_sha` = `git rev-parse HEAD` in cloned workspace.
2. Capture `remote_head_sha` = `git rev-parse origin/<resolved_branch>` in cloned workspace.
3. Determine `detached_head` = `true` if `git symbolic-ref HEAD` fails; `false` otherwise.
4. Write all three fields into the mount_receipt.

## Integrity Fail Conditions

| Condition | Action |
|-----------|--------|
| `detached_head === true` | **HALT. FAIL mount.** Clone is in detached HEAD state. |
| `resolved_commit_sha !== remote_head_sha` | **HALT. FAIL mount.** Clone is not at remote branch tip. |

Both conditions indicate a corrupted clone, shallow fetch error, or race condition. Fail closed.

## Resolution Rules

| Rule | Enforcement |
|------|-------------|
| Unknown alias | FAIL — do not guess or search by URL |
| Disabled repo | FAIL — repo must be explicitly enabled |
| Branch not in allowlist | FAIL — no branch override outside allowlist |
| Raw URL with policy blocking | FAIL_SCOPE — all repos must be registered |
| Both alias and URL | FAIL — ambiguous intake |
| Neither alias nor URL | FAIL — missing target |
| mount_receipt not emitted | RULE-013 audit failure |
