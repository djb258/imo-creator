# Template Stamp Protocol

**Rules for safely copying templates from parent to child repositories.**

This document defines the protocol for template inheritance. It is enforceable by policy, not tooling.

---

## 1. What is a Template Stamp?

A **template stamp** is a governance marker indicating:

- The template was copied from an authoritative source
- The copy occurred at a specific version
- The copy follows inheritance rules

A stamped template is a **governed artifact**. It carries obligations.

---

## 2. Conceptual Model

```
PARENT REPOSITORY (imo-creator)
│
│  templates/
│  ├── child/
│  │   ├── IMO_CONTROL.json.template    ← SOURCE
│  │   ├── REGISTRY.yaml.template       ← SOURCE
│  │   └── DOCTRINE.md.template         ← SOURCE
│  │
│  └── [other templates]                ← SOURCE
│
▼ COPY (one-way)
│
CHILD REPOSITORY
│
│  IMO_CONTROL.json                     ← STAMPED COPY
│  REGISTRY.yaml                        ← STAMPED COPY
│  DOCTRINE.md                          ← STAMPED COPY
│  doctrine/
│  └── REPO_DOMAIN_SPEC.md              ← CHILD-OWNED
```

---

## 3. Required Metadata Fields

Every stamped template MUST contain or reference:

| Field | Description | Location |
|-------|-------------|----------|
| `upstream_repo` | Parent repository identifier | In file or IMO_CONTROL.json |
| `upstream_commit` | Commit hash at time of copy | IMO_CONTROL.json |
| `template_version` | Version of source template | In file or inferred from parent |
| `copy_date` | Date the template was copied | Recommended in file header |

### 3.1 For JSON Files

```json
{
  "control_plane": {
    "upstream_repo": "imo-creator",
    "upstream_commit": "[COMMIT_HASH]"
  }
}
```

### 3.2 For YAML Files

```yaml
# Source: imo-creator/templates/child/REGISTRY.yaml.template
# Copied: [YYYY-MM-DD]
# Upstream Commit: [COMMIT_HASH]
```

### 3.3 For Markdown Files

```markdown
<!--
Template Source: imo-creator
Copied: [YYYY-MM-DD]
-->
```

---

## 4. Rules for Copying Templates

### 4.1 Pre-Copy Requirements

Before copying a template:

| Requirement | Mandatory |
|-------------|-----------|
| Identify the authoritative source file | YES |
| Record the current commit hash of parent | YES |
| Verify you are copying from `templates/` | YES |
| Verify the template is intended for child use | YES |

### 4.2 During Copy

When copying:

| Rule | Mandatory |
|------|-----------|
| Copy the ENTIRE file | YES |
| Do NOT modify during copy | YES |
| Preserve file structure | YES |
| Place in correct location | YES |

### 4.3 Post-Copy Requirements

After copying:

| Requirement | Mandatory |
|-------------|-----------|
| Replace ALL placeholders | YES |
| Update metadata fields | YES |
| Verify no brackets remain | YES |
| Commit with clear message | RECOMMENDED |

---

## 5. Rules for Modifying Copied Templates

### 5.1 Allowed Modifications in Child

| Modification | Allowed |
|--------------|---------|
| Replace placeholders with values | YES |
| Fill in required fields | YES |
| Add child-specific content in designated sections | YES |
| Update version references | YES |

### 5.2 Forbidden Modifications in Child

| Modification | Allowed |
|--------------|---------|
| Add new sections not in template | NO |
| Remove sections from template | NO |
| Rename sections | NO |
| Reorder sections | NO |
| Change structural formatting | NO |
| Modify governance rules | NO |

### 5.3 If Template Doesn't Fit

If a template does not fit your use case:

1. **Option A**: Your use case is wrong. Conform.
2. **Option B**: Submit an ADR to parent repository requesting template modification.

There is no Option C.

---

## 6. Prohibition Against Modifying Parent Templates

### 6.1 Absolute Rule

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   CHILD REPOSITORIES MAY NEVER MODIFY PARENT TEMPLATES.            ║
║                                                                    ║
║   Modification of templates in imo-creator requires:               ║
║   - ADR approval                                                   ║
║   - Human authorization                                            ║
║   - Version increment                                              ║
║   - Downstream notification                                        ║
║                                                                    ║
║   AI agents are PROHIBITED from modifying parent templates.        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

### 6.2 Violation Handling

If a child repository attempts to modify a parent template:

1. The modification is INVALID
2. The change MUST be reverted
3. The incident MUST be logged
4. The correct process (ADR) MUST be followed

---

## 7. Inheritance Direction

### 7.1 One-Way Flow

```
PARENT → CHILD

Never:
CHILD → PARENT
```

### 7.2 Inheritance Rules

| Rule | Description |
|------|-------------|
| Parent defines | Child conforms |
| Parent is authoritative | Child is derivative |
| Parent changes propagate down | Child changes do NOT propagate up |
| Parent templates are READ-ONLY | Child copies are WRITE-ONCE then GOVERNED |

### 7.3 Sync Protocol

When parent templates change:

1. Child repositories are notified
2. Child repositories MUST review changes
3. Child repositories MUST update or document deviation
4. Deviation without ADR is a violation

---

## 8. Template Categories

### 8.1 Child Bootstrap Templates

Location: `templates/child/`

| Template | Purpose | Required for Child |
|----------|---------|-------------------|
| `IMO_CONTROL.json.template` | Governance contract | YES |
| `REGISTRY.yaml.template` | Hub identity | YES |
| `DOCTRINE.md.template` | Doctrine reference | YES |

### 8.2 Artifact Templates

Location: `templates/`

| Template | Purpose | When to Use |
|----------|---------|-------------|
| `prd/PRD_HUB.md` | Hub definition | Creating a hub |
| `adr/ADR.md` | Decision record | Making architectural decisions |
| `checklists/HUB_COMPLIANCE.md` | Compliance verification | Before promotion |

### 8.3 Prompt Templates

Location: `templates/claude/`

| Template | Purpose | Who Uses |
|----------|---------|----------|
| `APPLY_DOCTRINE.prompt.md` | Constitutional admission | AI agents |
| `*.prompt.md` | Phase execution | AI agents |

---

## 9. Enforcement by Policy

This protocol is enforced by:

| Mechanism | Type |
|-----------|------|
| Human review | Policy |
| AI agent constraints | Contract (AI_EMPLOYEE_OPERATING_CONTRACT.md) |
| CI guard specification | Policy (GUARDSPEC.md) |
| Audit reports | Detection |

Implementation details are NOT specified here. Any compliant mechanism is acceptable.

---

## 10. Compliance Checklist

Before considering a template copy complete:

- [ ] Source template identified
- [ ] Upstream commit recorded
- [ ] File copied without modification
- [ ] All placeholders replaced
- [ ] No brackets `[ ]` remain
- [ ] Metadata fields updated
- [ ] File placed in correct location
- [ ] No forbidden modifications made

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | imo-creator |
| Type | Protocol (policy-level) |
| Status | ACTIVE |
