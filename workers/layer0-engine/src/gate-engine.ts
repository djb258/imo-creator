/**
 * Gate Engine — the heart of the Layer 0 Engine.
 *
 * Orchestrates the constant-extraction loop:
 * 1. Receive domain input
 * 2. Extract first candidate constant (LLM)
 * 3. Run gate: validate candidate through IMO + CTB + Circle (LLM)
 * 4. If qualitative gates pass → lock constant
 * 5. If quantitative phase → run Monte Carlo, check sigma direction
 * 6. Back-propagate if sigma expands
 * 7. Request next candidate from LLM
 * 8. Repeat until stopping conditions met
 *
 * RULES:
 * - The Worker orchestrates. The LLM validates. The LLM never decides gate progression.
 * - Every gate result is persisted. No in-memory-only processing.
 * - The tool is domain-agnostic.
 */

import {
  LAYER0_DOCTRINE,
  type GateResult,
  type Session,
  type LockedConstant,
  type IsolatedVariable,
  type Verdict,
} from "./doctrine";
import { evaluateIMO } from "./validators/imo-validator";
import { evaluateCTB } from "./validators/ctb-validator";
import { evaluateCircle } from "./validators/circle-validator";
import { extractFirstCandidate, validateCandidate } from "./llm-client";
import {
  runSimulation,
  withinTolerance,
  type MonteCarloVariable,
} from "./monte-carlo";

/** Env bindings from wrangler.toml */
export interface Env {
  DB: D1Database;
  ANTHROPIC_API_KEY: string;
  DOCTRINE_VERSION: string;
}

/** Configuration for a gate run */
export interface GateConfig {
  maxGates: number;
  maxBackPropagations: number;
  sigmaTolerance: number;
  monteCarloIterations: number;
  qualitativeGateCount: number; // Gates 1-N are qualitative, rest are quantitative
}

const DEFAULT_CONFIG: GateConfig = {
  maxGates: 10,
  maxBackPropagations: 3,
  sigmaTolerance: 0.05,
  monteCarloIterations: 1000,
  qualitativeGateCount: 5,
};

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Create a new extraction session.
 */
export async function createSession(
  env: Env,
  domainName: string,
  domainDescription: string,
): Promise<Session> {
  const session: Session = {
    id: generateId(),
    domainName,
    domainDescription,
    status: "IN_PROGRESS",
    totalGates: 0,
    totalConstants: 0,
    totalVariables: 0,
    finalSigma: null,
  };

  await env.DB.prepare(
    `INSERT INTO sessions (id, domain_name, domain_description, status)
     VALUES (?, ?, ?, ?)`,
  )
    .bind(session.id, session.domainName, session.domainDescription, session.status)
    .run();

  return session;
}

/**
 * Persist a gate result to D1.
 */
async function persistGateResult(env: Env, gate: GateResult): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO gate_results
     (id, session_id, gate_number, altitude_ft, candidate_constant,
      imo_validation, ctb_validation, circle_validation,
      monte_carlo_sigma, prior_gate_sigma, sigma_direction,
      verdict, back_propagation_target)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      gate.id,
      gate.sessionId,
      gate.gateNumber,
      gate.altitudeFt,
      gate.candidateConstant,
      gate.imoValidation ? JSON.stringify(gate.imoValidation) : null,
      gate.ctbValidation ? JSON.stringify(gate.ctbValidation) : null,
      gate.circleValidation ? JSON.stringify(gate.circleValidation) : null,
      gate.monteCarloSigma,
      gate.priorGateSigma,
      gate.sigmaDirection,
      gate.verdict,
      gate.backPropagationTarget,
    )
    .run();
}

/**
 * Persist a locked constant to D1.
 */
async function persistConstant(env: Env, constant: LockedConstant): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO locked_constants
     (id, session_id, gate_number, constant_name, constant_definition, validation_evidence)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      constant.id,
      constant.sessionId,
      constant.gateNumber,
      constant.constantName,
      constant.constantDefinition,
      JSON.stringify(constant.validationEvidence),
    )
    .run();
}

/**
 * Persist an isolated variable to D1.
 */
async function persistVariable(env: Env, variable: IsolatedVariable): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO isolated_variables
     (id, session_id, variable_name, variable_type, range_min, range_max, distribution)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      variable.id,
      variable.sessionId,
      variable.variableName,
      variable.variableType,
      variable.rangeMin,
      variable.rangeMax,
      variable.distribution,
    )
    .run();
}

/**
 * Log a back-propagation event.
 */
async function logBackPropagation(
  env: Env,
  sessionId: string,
  triggerGate: number,
  targetGate: number,
  originalVerdict: string,
  newVerdict: string,
  reason: string,
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO back_propagation_log
     (id, session_id, trigger_gate, target_gate, original_verdict, new_verdict, reason)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(generateId(), sessionId, triggerGate, targetGate, originalVerdict, newVerdict, reason)
    .run();
}

/**
 * Log an error.
 */
async function logError(
  env: Env,
  sessionId: string,
  gateNumber: number | null,
  errorType: string,
  errorDetail: string,
  rawOutput: string | null,
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO errors (id, session_id, gate_number, error_type, error_detail, raw_output)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(generateId(), sessionId, gateNumber, errorType, errorDetail, rawOutput)
    .run();
}

/**
 * Get altitude for a gate number.
 */
function getAltitude(gateNumber: number): number {
  const altitudes = [
    ...LAYER0_DOCTRINE.altitudeModel.upper.altitudes,
    ...LAYER0_DOCTRINE.altitudeModel.lower.altitudes,
  ];
  return altitudes[Math.min(gateNumber - 1, altitudes.length - 1)];
}

/**
 * Run the full extraction engine for a session.
 */
export async function runExtraction(
  env: Env,
  sessionId: string,
  domainName: string,
  domainDescription: string,
  config: Partial<GateConfig> = {},
): Promise<{
  session: Session;
  gates: GateResult[];
  constants: LockedConstant[];
  variables: IsolatedVariable[];
}> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const gates: GateResult[] = [];
  const constants: LockedConstant[] = [];
  const variables: IsolatedVariable[] = [];
  let backPropCount = 0;
  let priorSigma: number | null = null;

  // Step 1: Extract first candidate
  let currentCandidate: string;
  try {
    const extraction = await extractFirstCandidate(
      env.ANTHROPIC_API_KEY,
      domainName,
      domainDescription,
    );
    currentCandidate = extraction.candidateConstant;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logError(env, sessionId, null, "LLM_ERROR", `Failed to extract first candidate: ${msg}`, null);
    await updateSessionStatus(env, sessionId, "FAILED", gates.length, constants.length, variables.length, null);
    return { session: await getSession(env, sessionId), gates, constants, variables };
  }

  // Step 2: Gate loop
  for (let gateNumber = 1; gateNumber <= cfg.maxGates; gateNumber++) {
    const altitude = getAltitude(gateNumber);
    const isQuantitative = gateNumber > cfg.qualitativeGateCount;

    // Qualitative validation via LLM
    let validation;
    try {
      validation = await validateCandidate(
        env.ANTHROPIC_API_KEY,
        domainName,
        domainDescription,
        currentCandidate,
        constants.map((c) => c.constantName),
        gateNumber,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await logError(env, sessionId, gateNumber, "LLM_ERROR", `Validation failed: ${msg}`, null);
      continue;
    }

    // Evaluate through validators
    const imoResult = evaluateIMO(validation.imo);
    const ctbResult = evaluateCTB(validation.ctb);
    const circleResult = evaluateCircle(validation.circle);
    const allPass = imoResult.accepted && ctbResult.accepted && circleResult.accepted;

    // Determine verdict
    let verdict: Verdict;
    let monteCarloSigma: number | null = null;
    let sigmaDirection: GateResult["sigmaDirection"] = null;

    if (!allPass) {
      // Failed qualitative — classify as variable
      verdict = "VARIABLE";

      const variable: IsolatedVariable = {
        id: generateId(),
        sessionId,
        variableName: currentCandidate,
        variableType: "QUALITATIVE",
        rangeMin: null,
        rangeMax: null,
        distribution: null,
      };
      variables.push(variable);
      await persistVariable(env, variable);
    } else if (isQuantitative) {
      // Quantitative phase — run Monte Carlo
      const mcVariables: MonteCarloVariable[] = variables
        .filter((v) => v.variableType === "QUANTITATIVE" && v.rangeMin !== null)
        .map((v) => ({
          name: v.variableName,
          min: v.rangeMin!,
          max: v.rangeMax!,
          distribution: (v.distribution as "uniform" | "normal" | "beta") || "uniform",
        }));

      const mcResult = runSimulation(mcVariables, cfg.monteCarloIterations, Date.now(), priorSigma);

      monteCarloSigma = mcResult.sigma;
      sigmaDirection = mcResult.direction;

      if (mcResult.direction === "TIGHTENED" || mcResult.direction === null) {
        verdict = "CONSTANT_LOCKED";
      } else if (mcResult.direction === "UNCHANGED") {
        verdict = "PHANTOM_RECLASSIFY";
      } else {
        // EXPANDED — back-propagate
        verdict = "BACK_PROPAGATE";
      }

      priorSigma = monteCarloSigma;

      // Check stopping condition
      if (withinTolerance(monteCarloSigma, cfg.sigmaTolerance)) {
        verdict = "DONE";
      }
    } else {
      // Qualitative phase, all pass — lock it
      verdict = "CONSTANT_LOCKED";
    }

    // Build gate result
    const gate: GateResult = {
      id: generateId(),
      sessionId,
      gateNumber,
      altitudeFt: altitude,
      candidateConstant: currentCandidate,
      imoValidation: validation.imo,
      ctbValidation: validation.ctb,
      circleValidation: validation.circle,
      monteCarloSigma,
      priorGateSigma: priorSigma,
      sigmaDirection,
      verdict,
      backPropagationTarget: null,
    };

    gates.push(gate);
    await persistGateResult(env, gate);

    // Handle verdict outcomes
    if (verdict === "CONSTANT_LOCKED") {
      const constant: LockedConstant = {
        id: generateId(),
        sessionId,
        gateNumber,
        constantName: currentCandidate,
        constantDefinition: validation.constantDefinition || currentCandidate,
        validationEvidence: {
          imo: validation.imo,
          ctb: validation.ctb,
          circle: validation.circle,
        },
      };
      constants.push(constant);
      await persistConstant(env, constant);
    }

    if (verdict === "BACK_PROPAGATE" && backPropCount < cfg.maxBackPropagations) {
      backPropCount++;
      // Re-evaluate the most recent constant
      if (constants.length > 0) {
        const lastConstant = constants[constants.length - 1];
        await logBackPropagation(
          env,
          sessionId,
          gateNumber,
          lastConstant.gateNumber,
          "CONSTANT_LOCKED",
          "UNDER_REVIEW",
          `Sigma expanded at gate ${gateNumber} — re-evaluating prior constant`,
        );
      }
    }

    if (verdict === "DONE") {
      break;
    }

    // Get next candidate
    if (validation.nextCandidateConstant) {
      currentCandidate = validation.nextCandidateConstant;
    } else {
      // LLM says no more candidates — check stopping conditions
      break;
    }
  }

  // Update session
  const finalSig = priorSigma;
  await updateSessionStatus(env, sessionId, "COMPLETE", gates.length, constants.length, variables.length, finalSig);

  return {
    session: await getSession(env, sessionId),
    gates,
    constants,
    variables,
  };
}

/**
 * Update session status in D1.
 */
async function updateSessionStatus(
  env: Env,
  sessionId: string,
  status: string,
  totalGates: number,
  totalConstants: number,
  totalVariables: number,
  finalSigma: number | null,
): Promise<void> {
  await env.DB.prepare(
    `UPDATE sessions
     SET status = ?, total_gates = ?, total_constants = ?, total_variables = ?,
         final_sigma = ?, completed_at = datetime('now')
     WHERE id = ?`,
  )
    .bind(status, totalGates, totalConstants, totalVariables, finalSigma, sessionId)
    .run();
}

/**
 * Retrieve a session from D1.
 */
async function getSession(env: Env, sessionId: string): Promise<Session> {
  const row = await env.DB.prepare("SELECT * FROM sessions WHERE id = ?")
    .bind(sessionId)
    .first();

  if (!row) throw new Error(`Session ${sessionId} not found`);

  return {
    id: row.id as string,
    domainName: row.domain_name as string,
    domainDescription: row.domain_description as string,
    status: row.status as Session["status"],
    totalGates: row.total_gates as number,
    totalConstants: row.total_constants as number,
    totalVariables: row.total_variables as number,
    finalSigma: row.final_sigma as number | null,
  };
}

/**
 * Get all gate results for a session.
 */
export async function getGateResults(env: Env, sessionId: string): Promise<GateResult[]> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM gate_results WHERE session_id = ? ORDER BY gate_number",
  )
    .bind(sessionId)
    .all();

  return results.map((row) => ({
    id: row.id as string,
    sessionId: row.session_id as string,
    gateNumber: row.gate_number as number,
    altitudeFt: row.altitude_ft as number,
    candidateConstant: row.candidate_constant as string,
    imoValidation: row.imo_validation ? JSON.parse(row.imo_validation as string) : null,
    ctbValidation: row.ctb_validation ? JSON.parse(row.ctb_validation as string) : null,
    circleValidation: row.circle_validation ? JSON.parse(row.circle_validation as string) : null,
    monteCarloSigma: row.monte_carlo_sigma as number | null,
    priorGateSigma: row.prior_gate_sigma as number | null,
    sigmaDirection: row.sigma_direction as GateResult["sigmaDirection"],
    verdict: row.verdict as Verdict,
    backPropagationTarget: row.back_propagation_target as number | null,
  }));
}

/**
 * Get all locked constants for a session.
 */
export async function getLockedConstants(env: Env, sessionId: string): Promise<LockedConstant[]> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM locked_constants WHERE session_id = ? ORDER BY gate_number",
  )
    .bind(sessionId)
    .all();

  return results.map((row) => ({
    id: row.id as string,
    sessionId: row.session_id as string,
    gateNumber: row.gate_number as number,
    constantName: row.constant_name as string,
    constantDefinition: row.constant_definition as string,
    validationEvidence: JSON.parse(row.validation_evidence as string),
  }));
}

/**
 * List all sessions.
 */
export async function listSessions(env: Env): Promise<Session[]> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM sessions ORDER BY created_at DESC",
  ).all();

  return results.map((row) => ({
    id: row.id as string,
    domainName: row.domain_name as string,
    domainDescription: row.domain_description as string,
    status: row.status as Session["status"],
    totalGates: row.total_gates as number,
    totalConstants: row.total_constants as number,
    totalVariables: row.total_variables as number,
    finalSigma: row.final_sigma as number | null,
  }));
}
