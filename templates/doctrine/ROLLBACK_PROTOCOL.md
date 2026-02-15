# Rollback Protocol

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.0.0

---

## When to Use

- Sync from imo-creator broke a child repo (tests fail, build breaks, runtime errors)
- A doctrine version introduced a breaking change that conflicts with child implementation
- Pre-commit hooks from new version reject previously valid code

---

## Rollback Steps

### Step 1: STOP

Do not continue syncing other repos. Isolate the problem to the affected child repo.

### Step 2: IDENTIFY

What version was the child on before sync? Check git log for the sync commit. The commit message from `update_from_imo_creator.sh` includes version numbers (`Previous: vX.Y.Z`).

```bash
git log --oneline --all | grep -i "sync\|imo-creator\|doctrine"
```

### Step 3: REVERT

Revert the sync commit (preferred) or checkout pre-sync versions of synced files.

```bash
git revert <sync-commit-hash>
```

**Do NOT revert child-specific files** — `IMO_CONTROL.json`, `REGISTRY.yaml`, local PRDs, and `CLAUDE.md` were not touched by sync. Only always_sync files were overwritten.

### Step 4: PIN

Update `DOCTRINE.md` to pin to the last working version. Add a comment:

```markdown
| **Doctrine Version** | 2.5.0 |
```

```yaml
# PINNED: v2.6.0 broke pre-commit CHECK 12 on existing schema.
# ADR-XXX filed. Pin until v2.7.0 resolves the issue.
# Pinned by: [name], [date]
```

### Step 5: REPORT

Create an ADR in imo-creator documenting:
- What broke (specific error, failing check, broken behavior)
- Which child repo
- Which version transition (e.g., v2.5.0 -> v2.6.0)
- What needs to change in parent doctrine to prevent recurrence

### Step 6: RE-SYNC

After the parent fixes the issue and bumps version, remove the pin comment and re-sync:

```bash
./scripts/update_from_imo_creator.sh
```

---

## What NOT to Do

| Action | Why |
|--------|-----|
| Modify parent doctrine from a child repo | Governance flows DOWN, never up |
| Delete the sync script | You need it to re-sync after the fix |
| Disable pre-commit hooks as a workaround | Hooks enforce doctrine; disabling them hides the problem |
| Stay pinned indefinitely | Pinning is temporary; file an ADR and get it fixed |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-15 |
| Last Modified | 2026-02-15 |
| Version | 1.0.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
