# SYSTEM MAP — [REPO_NAME]

**Tier**: [TIER]
**Sovereign ID**: [SOVEREIGN_ID]
**Date**: [DATE]
**Status**: DRAFT — fill in all sections before marking ACTIVE

---

## Wheel Diagram

```
                    RIM (I/O Interface)
                 ┌──────────────────────┐
                 │                      │
    INPUT SIDE   │   [RIM COMPONENT]    │   OUTPUT SIDE
    (Triggers)   │                      │   (Signals/Actions)
                 └──────────────────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
           SPOKE 1     SPOKE 2     SPOKE N
         [name]       [name]       [name]
              │           │           │
              └───────────┼───────────┘
                          │
                    ┌─────────────┐
                    │     HUB     │
                    │  (M Layer)  │
                    │  [HUB NAME] │
                    └─────────────┘
```

---

## Hub

| Field | Value |
|-------|-------|
| Hub Name | [name of the processing center] |
| Purpose | [one sentence — what does it transform?] |
| CONST → VAR | [what constants go in, what variables come out] |
| Owner | [Dave / SVG Agency] |

---

## Rim (I/O Interface)

| Side | Component | Type | Description |
|------|-----------|------|-------------|
| Input | [component name] | [API / webhook / CLI / cron / manual] | [what triggers it] |
| Output | [component name] | [API / event / file / DB write] | [what it produces] |

---

## Spokes

| Spoke | Direction | Carries | From | To |
|-------|-----------|---------|------|----|
| [name] | Inbound | [data type] | [source] | Hub |
| [name] | Outbound | [data type] | Hub | [destination] |

**Spoke rule:** Spokes carry data only. No logic lives in a spoke.

---

## Sub-Hubs

| Sub-Hub | Sovereign ID | Purpose | Status |
|---------|-------------|---------|--------|
| [name] | [H.E.I.R] | [one sentence] | [ACTIVE / STUB / PLANNED] |

---

## Data Flow

```
[Trigger]
    │
    ▼
[Rim — Input Side]
    │
    ▼ (spoke)
[Hub — M Layer]
    ├── [Sub-Hub 1]
    ├── [Sub-Hub 2]
    └── [Sub-Hub N]
    │
    ▼ (spoke)
[Rim — Output Side]
    │
    ▼
[Downstream / Consumer]
```

---

## Sovereign ID Map

| Entity | Sovereign ID | Join Key | Notes |
|--------|-------------|----------|-------|
| This repo | [SOVEREIGN_ID] | [field name] | |
| Parent repo | [parent sovereign ID] | [field name] | |
| Child sub-hub | [sub-hub sovereign ID] | [field name] | |

---

## External Dependencies

| Dependency | Type | Purpose | Tier |
|------------|------|---------|------|
| [name] | [API / DB / service] | [why this repo needs it] | [Tier 0/1/2] |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | [DATE] |
| Last Modified | [DATE] |
| Status | DRAFT |
| Authority | Human only |
| Next Review | [DATE + 90 days] |
