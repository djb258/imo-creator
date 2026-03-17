/**
 * Layer 0 Doctrine — encoded as TypeScript constants.
 * Source of truth: imo-creator/docs/LAYER0_DOCTRINE.md
 *
 * This file is the CONSTANT. The domain fed into the engine is the VARIABLE.
 * If you can tell what domain is being analyzed by reading this file, it's broken.
 */

export const LAYER0_DOCTRINE = {
  version: "1.0.0",

  objective:
    "Extract constants from the domain until remaining variable space is within operational tolerance",

  fourElements: {
    constantsAndVariables: {
      name: "Constants & Variables",
      description:
        "Every domain contains things that never change (constants) and things that do (variables). The engine separates them.",
    },
    imo: {
      name: "IMO (Ingress → Middle → Egress)",
      description:
        "Every process has input, processing, and output. Constants stay fixed regardless of what flows through.",
    },
    ctb: {
      name: "CTB (Christmas Tree Backbone)",
      description:
        "Every system organizes as trunk → branches → leaves. Constants stay fixed at every level.",
    },
    circle: {
      name: "Circle (Feedback Loop)",
      description:
        "Every system has feedback. Constants still hold after a full cycle.",
    },
  },

  validators: {
    imo: {
      name: "IMO Test",
      question:
        "Does this candidate constant stay fixed regardless of what flows through the process?",
    },
    ctb: {
      name: "CTB Test",
      question:
        "Does this candidate constant stay fixed at every level of the hierarchy?",
    },
    circle: {
      name: "Circle Test",
      question:
        "Does this candidate constant still hold after a full feedback cycle?",
    },
  },

  gateLogic: {
    allThreePass: "CONSTANT_LOCKED" as const,
    sigmaTightened: "CONSTANT_LOCKED" as const,
    sigmaUnchanged: "PHANTOM_RECLASSIFY" as const,
    sigmaExpanded: "BACK_PROPAGATE" as const,
    sigmaBelowTolerance: "DONE" as const,
  },

  verdicts: [
    "CONSTANT_LOCKED",
    "VARIABLE",
    "PHANTOM_RECLASSIFY",
    "BACK_PROPAGATE",
    "DONE",
  ] as const,

  stoppingConditions: [
    "No new constants can be extracted",
    "Back-propagation finds no broken prior constants",
    "Both conditions must be true simultaneously",
  ],

  altitudeModel: {
    upper: {
      name: "Qualitative Phase",
      altitudes: [50000, 45000, 40000, 35000, 30000],
      method: "LLM validates candidate constants against three tests (IMO, CTB, Circle)",
    },
    lower: {
      name: "Quantitative Phase",
      altitudes: [25000, 20000, 15000, 10000, 5000],
      method: "Monte Carlo simulation measures variable-space reduction as sigma",
    },
    crossover: {
      altitude: 30000,
      description:
        "Transition point where qualitative locking gives way to quantitative measurement",
    },
  },

  toleranceCascade: {
    description:
      "Each gate must tighten sigma vs prior gate. If sigma expands, back-propagation fires.",
    formula: "sigma(gate_n) < sigma(gate_n-1)",
  },

  qualitativePrompt: `You are running a constant-extraction gate for the Layer 0 engine.
Given the domain context and candidate constant below, validate using three tests:

1. IMO Test: Does this stay fixed regardless of what flows through the process?
2. CTB Test: Does this stay fixed at every level of the hierarchy?
3. Circle Test: Does this still hold after a full feedback cycle?

Return ONLY valid JSON:
{
  "imo": { "pass": true/false, "reason": "one sentence" },
  "ctb": { "pass": true/false, "reason": "one sentence" },
  "circle": { "pass": true/false, "reason": "one sentence" },
  "verdict": "CONSTANT" or "VARIABLE",
  "constantDefinition": "one sentence definition if CONSTANT, null if VARIABLE",
  "nextCandidateConstant": "next candidate to test, or null if extraction complete",
  "nextCandidateReason": "why this is worth testing, or null"
}`,

  extractionPrompt: `You are starting a constant-extraction session for the Layer 0 engine.
Given the domain below, identify the first candidate constant — the thing most likely to be universally true regardless of implementation.

Return ONLY valid JSON:
{
  "candidateConstant": "name of the candidate",
  "candidateReason": "why this is likely a constant",
  "domainDefinition": "one sentence definition of the domain at 50,000 ft"
}`,
} as const;

/** Type helpers derived from doctrine */
export type Verdict = (typeof LAYER0_DOCTRINE.verdicts)[number];
export type SigmaDirection = "TIGHTENED" | "UNCHANGED" | "EXPANDED";

export interface GateResult {
  id: string;
  sessionId: string;
  gateNumber: number;
  altitudeFt: number;
  candidateConstant: string;
  imoValidation: { pass: boolean; reason: string } | null;
  ctbValidation: { pass: boolean; reason: string } | null;
  circleValidation: { pass: boolean; reason: string } | null;
  monteCarloSigma: number | null;
  priorGateSigma: number | null;
  sigmaDirection: SigmaDirection | null;
  verdict: Verdict;
  backPropagationTarget: number | null;
}

export interface Session {
  id: string;
  domainName: string;
  domainDescription: string;
  status: "IN_PROGRESS" | "COMPLETE" | "FAILED";
  totalGates: number;
  totalConstants: number;
  totalVariables: number;
  finalSigma: number | null;
}

export interface LockedConstant {
  id: string;
  sessionId: string;
  gateNumber: number;
  constantName: string;
  constantDefinition: string;
  validationEvidence: {
    imo: { pass: boolean; reason: string };
    ctb: { pass: boolean; reason: string };
    circle: { pass: boolean; reason: string };
  };
}

export interface IsolatedVariable {
  id: string;
  sessionId: string;
  variableName: string;
  variableType: "QUALITATIVE" | "QUANTITATIVE";
  rangeMin: number | null;
  rangeMax: number | null;
  distribution: string | null;
}

export interface LLMValidationResponse {
  imo: { pass: boolean; reason: string };
  ctb: { pass: boolean; reason: string };
  circle: { pass: boolean; reason: string };
  verdict: "CONSTANT" | "VARIABLE";
  constantDefinition: string | null;
  nextCandidateConstant: string | null;
  nextCandidateReason: string | null;
}

export interface LLMExtractionResponse {
  candidateConstant: string;
  candidateReason: string;
  domainDefinition: string;
}
