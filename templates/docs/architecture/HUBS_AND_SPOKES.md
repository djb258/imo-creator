# Hubs and Spokes

**Status**: NON-AUTHORITATIVE — EXPLANATORY ONLY
**Subordinate to**: CONSTITUTION.md, IMO_SYSTEM_SPEC.md
**Purpose**: Precise definitions for enforcement

---

## One-Sentence Definitions

**HUB**: A hub is the sole owner of logic, state, and governed transformations for a declared problem space.

**SPOKE**: A spoke is a boundary-crossing conduit that moves data or events into a hub's Ingress or out of a hub's Egress, and never touches Middle.

---

## What a Hub OWNS

A hub MUST:

- Own the CONST → VAR transformation (declared in PRD §3)
- Own all decisions, validation, enrichment, joins, and scoring
- Own state and source-of-truth artifacts
- Own internal invariants and auditability
- Contain all logic within the M (Middle) layer

A hub MUST NOT:

- Leak logic into spokes
- Create sideways hub-to-hub coupling (communication occurs only via Egress → Ingress events)
- Delegate transformation logic to external components
- Allow spokes to make decisions on its behalf

---

## What a Spoke MAY Do

A spoke MAY:

- Transport data, events, files, or signals to a hub's Ingress
- Transport artifacts, events, or state outputs from a hub's Egress
- Perform non-semantic wrapping IF explicitly permitted (e.g., packaging into a required schema envelope)
- Be swapped, replaced, or removed without requiring hub logic changes

---

## What a Spoke MUST NOT Do

A spoke MUST NOT:

- Make decisions or branch logic
- Validate "truth" or reject data for business reasons
- Enrich, join, score, classify, or interpret meaning
- Write to a source-of-truth store (unless that store is explicitly defined as an Egress sink and the hub emitted the write artifact)
- Call other spokes (no spoke-to-spoke chains)
- Touch Middle in any way
- Contain conditional business logic
- Reference transformation rules

---

## The IMO Binding Rule

```
┌─────────────────────────────────────────────────────────────┐
│                         HUB                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ INGRESS  │ ──▶│  MIDDLE  │──▶ │  EGRESS  │              │
│  │   (I)    │    │   (M)    │    │   (O)    │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│       ▲               │               │                     │
│       │          (hub-internal)       │                     │
└───────┼───────────────────────────────┼─────────────────────┘
        │                               │
        │                               ▼
   ┌────────┐                      ┌────────┐
   │ SPOKE  │                      │ SPOKE  │
   │  (I)   │                      │  (O)   │
   └────────┘                      └────────┘
   Ingress                         Egress
   Transport                       Transport
```

- Spokes MAY connect ONLY to Ingress or Egress
- Middle is hub-internal only
- Any spoke touching Middle is a constitutional violation

---

## The Hub-to-Hub Communication Rule

Hubs communicate via explicit Egress-to-Ingress events only.

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│  HUB A  │         │  EVENT  │         │  HUB B  │
│         │──Egress─▶│ ARTIFACT│──Ingress─▶│         │
│         │         │         │         │         │
└─────────┘         └─────────┘         └─────────┘
```

- Hub-to-hub movement occurs ONLY as an explicit Egress event or artifact consumed by another hub's Ingress
- No direct hub-to-hub internal calls
- No sideways state mutation
- No shared mutable state between hubs

---

## Hub-Spoke Decision in PRD

Per locked doctrine, the Hub-Spoke decision occurs during PRD creation.

PRD §6 (Spokes) MUST explicitly declare one of:

| Declaration | Meaning |
|-------------|---------|
| **IMPLEMENTED** | Spokes exist, with justification for each |
| **DECLINED** | No spokes needed, with rationale |

A PRD is INVALID if §6 is empty or ambiguous.

---

## Enforcement Checklist (Pass/Fail)

AI employees and auditors apply these binary checks:

| Check | Result |
|-------|--------|
| Spoke contains conditional business logic | **FAIL** |
| Spoke modifies source-of-truth state | **FAIL** |
| Spoke references transformation rules | **FAIL** |
| Hub delegates logic to a spoke | **FAIL** |
| Hub-to-hub coupling is sideways (not via event) | **FAIL** |
| Spoke calls another spoke directly | **FAIL** |
| Spoke touches Middle layer | **FAIL** |
| PRD §6 is empty or ambiguous | **FAIL** |

If ANY check fails, the component is non-compliant.

---

## Examples (Generic)

### Example 1: Ingress Transport Spoke

**Name**: File intake spoke
**Type**: Ingress (I)
**Function**: Reads files from an external location, passes raw data to hub Ingress
**Owns**: Nothing — pure transport
**Compliance**: No logic, no decisions, no transformation

### Example 2: Egress Transport Spoke

**Name**: Export sink spoke
**Type**: Egress (O)
**Function**: Receives output artifacts from hub Egress, writes to external destination
**Owns**: Nothing — pure transport
**Compliance**: No logic, no decisions, no transformation

### Example 3: Event Ingress Spoke

**Name**: Webhook event spoke
**Type**: Ingress (I)
**Function**: Receives external event signals, passes payload to hub Ingress
**Owns**: Nothing — pure transport
**Compliance**: No logic, no decisions, no transformation

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-30 |
| Authority | NON-AUTHORITATIVE |
| Subordinate To | CONSTITUTION.md, IMO_SYSTEM_SPEC.md |
| Purpose | Definitions and enforcement rules |
| Change Protocol | Human approval required |
