/**
 * Circle Validator — Does the candidate constant still hold after
 * a full feedback cycle?
 */

export interface CircleValidation {
  pass: boolean;
  reason: string;
}

/**
 * Check if a Circle validation result meets the gate threshold.
 */
export function evaluateCircle(validation: CircleValidation): {
  accepted: boolean;
  reason: string;
} {
  if (!validation.reason || validation.reason.trim().length === 0) {
    return {
      accepted: false,
      reason: "Circle validation missing reasoning — gate cannot pass without evidence",
    };
  }

  return {
    accepted: validation.pass,
    reason: validation.reason,
  };
}
