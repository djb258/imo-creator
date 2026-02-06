# Migration Guide — CTB Hardening v2.0.0

**Effective Date**: 2026-02-06
**Applies To**: All child repos derived from imo-creator

---

## What Changed

The CTB Hardening refactor consolidated three architecture doctrine files into one:

| Before (v1.x) | After (v2.0.0) | Status |
|---------------|----------------|--------|
| CANONICAL_ARCHITECTURE_DOCTRINE.md | ARCHITECTURE.md | CONSOLIDATED |
| HUB_SPOKE_ARCHITECTURE.md | ARCHITECTURE.md Part IV | CONSOLIDATED |
| ALTITUDE_DESCENT_MODEL.md | ARCHITECTURE.md Part VI | CONSOLIDATED |

**The old files still exist as REDIRECTs.** They point to ARCHITECTURE.md.

---

## Why This Change

1. **LLM Clarity**: One authoritative file instead of three
2. **No Reconciliation**: AI agents don't need to merge content from multiple files
3. **Hardened Law**: CTB rules now presented as constitutional axioms and numbered laws
4. **Zero Confusion**: Clear reading order with single entry point

---

## What Child Repos Must Do

### Step 1: Pull Updated Templates

```bash
# From your child repo
git fetch origin
git pull origin master
```

Verify you have the new file:
```bash
ls templates/doctrine/ARCHITECTURE.md
```

### Step 2: Update DOCTRINE.md References

If your child repo's `DOCTRINE.md` references the old files, update:

**Before:**
```markdown
| Doctrine | imo-creator Path |
|----------|------------------|
| Architecture | templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub-Spoke | templates/doctrine/HUB_SPOKE_ARCHITECTURE.md |
| Descent | templates/doctrine/ALTITUDE_DESCENT_MODEL.md |
```

**After:**
```markdown
| Doctrine | imo-creator Path |
|----------|------------------|
| Architecture | templates/doctrine/ARCHITECTURE.md |
```

### Step 3: Update CLAUDE.md References

If your `CLAUDE.md` references old files in the locked files table:

**Before:**
```markdown
| templates/doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md | Operating physics |
| templates/doctrine/HUB_SPOKE_ARCHITECTURE.md | Hub-spoke geometry |
| templates/doctrine/ALTITUDE_DESCENT_MODEL.md | Descent gates |
```

**After:**
```markdown
| templates/doctrine/ARCHITECTURE.md | CTB Constitutional Law (all architecture) |
```

### Step 4: Update Reading Order References

If any documentation references reading order:

**Before:**
```
4. doctrine/CANONICAL_ARCHITECTURE_DOCTRINE.md — root law
```

**After:**
```
4. doctrine/ARCHITECTURE.md — CTB Constitutional Law
```

### Step 5: Update Section References

If you reference specific sections from old files:

| Old Reference | New Reference |
|---------------|---------------|
| CANONICAL §1 (CTB) | ARCHITECTURE.md Part II |
| CANONICAL §2 (CC) | ARCHITECTURE.md Part III |
| CANONICAL §3 (Hub-Spoke) | ARCHITECTURE.md Part IV |
| CANONICAL §3.5 (IMO) | ARCHITECTURE.md Part V |
| CANONICAL §4 (Constants) | ARCHITECTURE.md Part VII |
| CANONICAL §5 (PID) | ARCHITECTURE.md Part VIII |
| CANONICAL §6 (Authorization) | ARCHITECTURE.md Part III §3 |
| ALTITUDE_DESCENT (all) | ARCHITECTURE.md Part VI |
| HUB_SPOKE (all) | ARCHITECTURE.md Part IV |

### Step 6: Run Compliance Check

After updating, verify with checklist:

- [ ] `DOCTRINE.md` references ARCHITECTURE.md
- [ ] `CLAUDE.md` locked files table is updated
- [ ] No MD files reference old section numbers (e.g., "CANONICAL §3")
- [ ] Reading order documentation updated

---

## Backward Compatibility

**You don't have to update immediately.**

The old files (CANONICAL_ARCHITECTURE_DOCTRINE.md, HUB_SPOKE_ARCHITECTURE.md, ALTITUDE_DESCENT_MODEL.md) still exist as redirect pointers. They point to ARCHITECTURE.md.

If your AI agent reads the old file, it will see:
```markdown
**Status**: REDIRECT
**Canonical Source**: doctrine/ARCHITECTURE.md
```

This means:
1. Existing references won't break
2. AI agents will know to look at ARCHITECTURE.md
3. You can migrate at your own pace

However, for clarity and to reduce confusion, we recommend updating within 30 days.

---

## Verification Commands

Check if your repo references old files:

```bash
# Find references to old files
grep -r "CANONICAL_ARCHITECTURE_DOCTRINE" .
grep -r "HUB_SPOKE_ARCHITECTURE" .
grep -r "ALTITUDE_DESCENT_MODEL" .
```

Check if you have the new file:
```bash
ls templates/doctrine/ARCHITECTURE.md
```

---

## New Section Mapping

For detailed section-by-section mapping:

| ARCHITECTURE.md Part | Contains |
|----------------------|----------|
| Part I | Axioms (5 foundational truths) |
| Part II | CTB Topology Law |
| Part III | CC Hierarchy Law + Authorization Matrix |
| Part IV | Hub-Spoke Geometry Law |
| Part V | IMO Flow Law |
| Part VI | Descent Gate Law |
| Part VII | Constants vs Variables Law |
| Part VIII | PID Doctrine |
| Part IX | Violation Enforcement |
| Part X | Ownership Constraints |
| Part XI | Global Invariants |
| Part XII | Document Control |

---

## Checklist for AI Agents

If you are an AI agent migrating a child repo:

1. [ ] Read ARCHITECTURE.md first (new authoritative file)
2. [ ] Update all references from old files to ARCHITECTURE.md
3. [ ] Update section references using mapping table above
4. [ ] Do NOT delete old file references if unsure — they redirect
5. [ ] Report any references you cannot map

---

## Questions?

If migration is unclear:
1. Read ARCHITECTURE.md directly
2. Check archive/templates/doctrine/ for original content
3. ASK before guessing

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-06 |
| Version | 2.0.0 |
| Applies To | All child repos |
| Status | ACTIVE |
