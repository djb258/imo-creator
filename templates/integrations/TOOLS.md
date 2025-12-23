# Tool Selection Doctrine Template

## Hub Identity

| Field | Value |
|-------|-------|
| **Hub Name** | |
| **Hub ID** | |

---

## Core Doctrine

> **Determinism > Cost > Auditability**
> **LLMs are allowed only as tail arbitration**
> **Tools are swappable; doctrine is not**

---

## Tool Approval Rules

| Rule | Enforcement |
|------|-------------|
| All tools MUST be registered in this ledger | PR rejected if not |
| New tools require an ADR | No exceptions |
| LLMs cannot replace deterministic scripts | PR invalid |
| Tools are scoped to hub M layer only | Spokes cannot own tools |

---

## Approved Tool Ledger

### Required Tools (All Hubs)

| Tool | Purpose | Doctrine ID | ADR |
|------|---------|-------------|-----|
| Doppler | Secrets management | 04.05.01 | Required |
| GitHub | Version control | 04.05.02 | Required |
| Linear | Task management | 04.05.03 | Required |

### Integration Tools

| Tool | Purpose | Doctrine ID | ADR |
|------|---------|-------------|-----|
| Composio | MCP server | 04.04.XX | |
| Vercel | Deployment | 04.04.XX | |
| Firebase | Database/Auth | 04.04.XX | |
| Neon | PostgreSQL | 04.04.XX | |
| BigQuery | Analytics | 04.04.XX | |

### Development Tools

| Tool | Purpose | Doctrine ID | ADR |
|------|---------|-------------|-----|
| VS Code | Editor | 04.06.01 | |
| Claude Code | AI assistant | 04.06.02 | |
| Git | Version control | 04.06.03 | |

---

## Tool Categories

### Category 1: Deterministic (Preferred)
- Scripts
- APIs with fixed contracts
- Database queries
- File operations

### Category 2: Probabilistic (Controlled)
- LLM calls (only for tail arbitration)
- ML inference
- Fuzzy matching

### Category 3: Forbidden
- Unregistered tools
- Tools without ADR
- Tools spanning multiple hubs
- Tools in spokes

---

## Adding a New Tool

1. Create ADR using `templates/adr/ADR.md`
2. Document:
   - Why this tool is needed
   - Why alternatives were rejected
   - How it fits IMO structure
   - Security implications
3. Assign Doctrine ID
4. Add to this ledger
5. Get hub owner approval

---

## Tool Scoping Rules

| Location | Tools Allowed |
|----------|---------------|
| **I — Ingress** | None (data only) |
| **M — Middle** | All approved tools |
| **O — Egress** | None (data only) |
| **Spokes** | None (interface only) |

---

## LLM Usage Guidelines

LLMs are permitted ONLY when:
- Deterministic solution is not possible
- Human judgment is being augmented, not replaced
- Output is validated before action
- Audit trail is maintained

LLMs are FORBIDDEN when:
- A script can do the job
- The task is pure data transformation
- No human review is possible
- Security decisions are involved

---

## Compliance Checklist

- [ ] All tools registered in ledger
- [ ] Each tool has Doctrine ID
- [ ] Each tool has ADR reference
- [ ] No tools in spokes
- [ ] No tools spanning hubs
- [ ] LLM usage justified and documented
- [ ] Security review completed

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| PRD | |
| ADR | |
| Linear Issue | |
