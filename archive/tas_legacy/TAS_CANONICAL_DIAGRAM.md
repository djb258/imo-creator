# TAS — Canonical System Diagrams

**Generated**: 2026-01-28
**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: AUTHORITATIVE

---

## 1. Authority Hierarchy Diagram

```mermaid
graph TD
    subgraph CONSTITUTIONAL["CONSTITUTIONAL LAYER"]
        CONST[CONSTITUTION.md]
        CTRL[IMO_CONTROL.json]
        SPEC[IMO_SYSTEM_SPEC.md]
        CONTRACT[AI_EMPLOYEE_OPERATING_CONTRACT.md]
    end

    subgraph DOCTRINE["DOCTRINE LAYER"]
        CAN[ARCHITECTURE.md<br/>v2.0.0]
        REPO[REPO_REFACTOR_PROTOCOL.md<br/>v1.2.0]
        DBA[DBA_ENFORCEMENT_DOCTRINE.md<br/>v1.0.0]
        DOC[DOCUMENTATION_ERD_DOCTRINE.md<br/>v1.0.0]
        TEMPL[TEMPLATE_IMMUTABILITY.md<br/>v1.0.0]
    end

    subgraph OPERATIONAL["OPERATIONAL LAYER"]
        SNAP[SNAP_ON_TOOLBOX.yaml]
        GUARD[GUARDSPEC.md]
        CLAUDE[CLAUDE.md]
    end

    CONST --> CAN
    CTRL --> CAN
    SPEC --> CAN
    CONTRACT --> CAN

    CAN --> REPO
    CAN --> DBA
    CAN --> DOC
    CAN --> TEMPL

    CAN --> SNAP
    CAN --> GUARD
    CAN --> CLAUDE
```

---

## 2. Canonical Chain (CC) Descent Model

```mermaid
graph TD
    subgraph CC01["CC-01: SOVEREIGN"]
        SOV[Boundary Declaration]
        SOV_GATE{Sovereignty<br/>Declared?}
    end

    subgraph CC02["CC-02: HUB"]
        HUB_PRD[PRD]
        HUB_REG[REGISTRY.yaml]
        HUB_ID[Hub Identity]
        HUB_GATE{PRD<br/>Approved?}
    end

    subgraph CC03["CC-03: CONTEXT"]
        CTX_ADR[ADR]
        CTX_FLOW[Process Flows]
        CTX_SPOKE[Spoke Definitions]
        CTX_GATE{ADR<br/>Approved?}
    end

    subgraph CC04["CC-04: PROCESS"]
        PRC_CODE[Code]
        PRC_TEST[Tests]
        PRC_CFG[Config]
        PRC_UI[UI Components]
    end

    SOV --> SOV_GATE
    SOV_GATE -->|YES| HUB_PRD
    SOV_GATE -->|NO| HALT1[HALT]

    HUB_PRD --> HUB_REG
    HUB_REG --> HUB_ID
    HUB_ID --> HUB_GATE
    HUB_GATE -->|YES| CTX_ADR
    HUB_GATE -->|NO| HALT2[HALT]

    CTX_ADR --> CTX_FLOW
    CTX_FLOW --> CTX_SPOKE
    CTX_SPOKE --> CTX_GATE
    CTX_GATE -->|YES| PRC_CODE
    CTX_GATE -->|NO| HALT3[HALT]

    PRC_CODE --> PRC_TEST
    PRC_TEST --> PRC_CFG
    PRC_CFG --> PRC_UI
```

---

## 3. CTB Branch Structure

```mermaid
graph TD
    subgraph REPO["Repository Root"]
        SRC[src/]
    end

    subgraph CTB["CTB Branches"]
        SYS[sys/<br/>System Infrastructure]
        DATA[data/<br/>Data Layer]
        APP[app/<br/>Application Logic]
        AI[ai/<br/>AI Components]
        UI[ui/<br/>User Interface]
    end

    SRC --> SYS
    SRC --> DATA
    SRC --> APP
    SRC --> AI
    SRC --> UI

    SYS --> SYS_CONT[env loaders<br/>bootstraps<br/>infrastructure]
    DATA --> DATA_CONT[schemas<br/>queries<br/>migrations]
    APP --> APP_CONT[modules<br/>services<br/>workflows]
    AI --> AI_CONT[agents<br/>routers<br/>prompts]
    UI --> UI_CONT[pages<br/>components<br/>layouts]
```

---

## 4. Hub-Spoke Geometry

```mermaid
graph LR
    subgraph EXTERNAL["External Systems"]
        EXT1[API]
        EXT2[Webhook]
        EXT3[File]
    end

    subgraph SPOKES_I["Ingress Spokes"]
        SI1[Spoke-I-1]
        SI2[Spoke-I-2]
        SI3[Spoke-I-3]
    end

    subgraph HUB["HUB"]
        direction TB
        I[Ingress]
        M[Middle<br/>Logic/State/Decisions]
        E[Egress]
        I --> M
        M --> E
    end

    subgraph SPOKES_O["Egress Spokes"]
        SO1[Spoke-O-1]
        SO2[Spoke-O-2]
    end

    subgraph TARGETS["Target Systems"]
        TGT1[Database]
        TGT2[Notification]
    end

    EXT1 --> SI1
    EXT2 --> SI2
    EXT3 --> SI3

    SI1 --> I
    SI2 --> I
    SI3 --> I

    E --> SO1
    E --> SO2

    SO1 --> TGT1
    SO2 --> TGT2
```

---

## 5. Lifecycle Phase Flow

```mermaid
graph TD
    START[Start] --> P1

    subgraph P1["Phase 1"]
        ADMIT[constitutional_admission<br/>APPLY_DOCTRINE.prompt.md]
    end

    subgraph P2["Phase 2"]
        STRUCT[structural_instantiation<br/>DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md]
    end

    subgraph P3["Phase 3"]
        DATA_D[data_declaration<br/>DECLARE_DATA_AND_RENDER_ERD.prompt.md]
    end

    subgraph P4["Phase 4"]
        EXEC[execution_wiring<br/>DECLARE_EXECUTION_WIRING.prompt.md]
    end

    subgraph P5["Phase 5"]
        DBA_E[dba_enforcement<br/>DBA_ENFORCEMENT.prompt.md]
    end

    subgraph P6["Phase 6"]
        DOC_E[documentation_enforcement<br/>DOCUMENTATION_ERD_ENFORCEMENT.prompt.md]
    end

    subgraph P7["Phase 7"]
        HYG[hygiene_audit<br/>HYGIENE_AUDITOR.prompt.md]
    end

    subgraph P8["Phase 8"]
        CLEAN[cleanup_execution<br/>CLEANUP_EXECUTOR.prompt.md]
    end

    ADMIT --> STRUCT
    STRUCT --> DATA_D
    DATA_D --> EXEC
    EXEC --> DBA_E
    DBA_E --> DOC_E
    DOC_E --> HYG
    HYG --> CLEAN
    CLEAN --> DONE[Complete]
```

---

## 6. Repo Mode Classification

```mermaid
graph TD
    START[Repo Detected] --> CHECK{Is this<br/>imo-creator?}

    CHECK -->|YES| PARENT[PARENT MODE<br/>Generic/Constitutional]
    CHECK -->|NO| CHILD[CHILD MODE<br/>Domain-Specific]

    PARENT --> P_RULES[Rules:<br/>- Define generic structures<br/>- No domain meaning<br/>- Templates only]

    CHILD --> C_CHECK{doctrine/REPO_DOMAIN_SPEC.md<br/>exists?}
    C_CHECK -->|YES| C_PROCEED[PROCEED<br/>Domain bound]
    C_CHECK -->|NO| C_HALT[HALT<br/>Cannot proceed]
```

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | IMO-Creator (Sovereign) |
| Status | AUTHORITATIVE |
| Diagram Standard | Mermaid |
| Change Protocol | ADR + Human Approval |
