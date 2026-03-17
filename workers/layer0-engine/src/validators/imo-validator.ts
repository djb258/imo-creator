/**
 * IMO Validator — Does the candidate constant stay fixed regardless
 * of what flows through the process?
 *
 * This is a structural check, not an LLM call. The LLM provides
 * the pass/fail + reason. This validator interprets the result
 * and enforces the gate logic.
 */

export interface IMOValidation {
  pass: boolean;
  reason: string;
}

/**
 * Check if an IMO validation result meets the gate threshold.
 * The LLM already answered the question — this function applies doctrine rules.
 */
export function evaluateIMO(validation: IMOValidation): {
  accepted: boolean;
  reason: string;
} {
  if (!validation.reason || validation.reason.trim().length === 0) {
    return {
      accepted: false,
      reason: "IMO validation missing reasoning — gate cannot pass without evidence",
    };
  }

  return {
    accepted: validation.pass,
    reason: validation.reason,
  };
}
