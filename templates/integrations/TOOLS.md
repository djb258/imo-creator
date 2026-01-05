# Tool Registration Doctrine

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 1.1.0 |
| **CC Layer** | CC-02 (Hub) |
| **CTB Placement** | Declared per hub |

---

## Overview

This doctrine governs the admission, ownership, and operation of tools within any hub.

> **Tools are scoped to hubs. Spokes do not own tools.**
> **Determinism is preferred. LLM is tail arbitration only.**

---

## Core Principles

### 1. Hub-Scoped Ownership

- All tools MUST be owned by exactly one hub.
- Tools operate within the hub's M (Middle) layer only.
- Spokes (I/O interfaces) do not own, invoke, or expose tools.
- Cross-hub tool sharing is prohibited.

### 2. Determinism First

- Deterministic solutions MUST be evaluated before any non-deterministic alternative.
- If a deterministic solution exists, it MUST be used.
- Non-deterministic tools (including LLM-based) are permitted only as **tail arbitration**.

### 3. LLM as Tail, Not Spine

- LLM-based tools may only be invoked after deterministic logic has been exhausted.
- LLM output MUST be validated before action.
- LLM MUST NOT replace deterministic scripts for repeatable operations.
- Audit trails MUST be maintained for all LLM invocations.

---

## Tool Admission Requirements

Every tool admitted to a hub MUST satisfy:

| Requirement | Enforcement |
|-------------|-------------|
| Registered in hub tool ledger | PR rejected if missing |
| ADR documents the decision | No exceptions |
| Scoped to hub M layer only | Doctrine violation if in spoke |
| Deterministic alternative evaluated | ADR must document evaluation |
| CC layer declared | Must be CC-02 or CC-03 |
| PID scope declared (if CC-04) | Required for execution tools |

---

## Tool Ledger Structure

Each hub MUST maintain a tool ledger with the following fields:

| Field | Description |
|-------|-------------|
| **Tool Name** | Abstract identifier |
| **Solution Type** | Deterministic / Rules-based / LLM-tail |
| **CC Layer** | CC-02, CC-03, or CC-04 |
| **IMO Layer** | I (Ingress), M (Middle), or O (Egress) |
| **ADR Reference** | Link to approving ADR |
| **Owner Hub** | Hub ID that owns this tool |

---

## IMO Layer Constraints

| Layer | Tools Permitted |
|-------|-----------------|
| **I — Ingress** | Data ingestors only (no transformation logic) |
| **M — Middle** | All processing, decision, and transformation tools |
| **O — Egress** | Output formatters only (no decision logic) |
| **Spokes** | None (interface only) |

---

## Tool Categories

### Category 1: Pure Deterministic

- Output is 100% predictable given input.
- No randomness, no LLM, no external state dependency.
- Preferred for all repeatable operations.

### Category 2: Rules-Based with Deterministic Fallback

- Applies rules first.
- Falls back to deterministic logic when rules exhaust.
- No LLM invocation.

### Category 3: LLM Tail Only

- Deterministic logic executes first.
- LLM invoked only for edge cases that cannot be resolved deterministically.
- LLM output validated before action.
- Audit trail required.

### Category 4: Forbidden

- Tools without ADR approval.
- Tools spanning multiple hubs.
- Tools in spokes.
- LLM as primary solution (not tail).
- Unregistered tools.

---

## Adding a New Tool

1. Evaluate if deterministic solution exists.
2. If yes → implement deterministically.
3. If no → implement rules first, LLM as tail only.
4. Create ADR documenting decision and alternatives.
5. Assign to owning hub.
6. Declare CC layer and IMO layer.
7. Add to hub tool ledger.
8. Obtain hub owner approval.

---

## LLM Usage Validation

Before admitting any LLM-based tool:

- [ ] Deterministic solution proven impossible or impractical
- [ ] Rules/templates evaluated first
- [ ] LLM handles edge cases only
- [ ] Output validation mechanism defined
- [ ] Audit trail mechanism defined
- [ ] ADR documents the decision

---

## Compliance Checklist

- [ ] All tools registered in hub ledger
- [ ] Each tool has ADR reference
- [ ] Each tool declares CC layer
- [ ] Each tool declares IMO layer
- [ ] No tools in spokes
- [ ] No tools spanning hubs
- [ ] LLM usage justified and documented
- [ ] Deterministic alternatives evaluated

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub PRD | (per hub) |
| Tool ADRs | (per tool) |
