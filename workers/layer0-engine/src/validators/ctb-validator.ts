/**
 * CTB Validator — Does the candidate constant stay fixed at every
 * level of the hierarchy (trunk → branches → leaves)?
 */

export interface CTBValidation {
  pass: boolean;
  reason: string;
}

/**
 * Check if a CTB validation result meets the gate threshold.
 */
export function evaluateCTB(validation: CTBValidation): {
  accepted: boolean;
  reason: string;
} {
  if (!validation.reason || validation.reason.trim().length === 0) {
    return {
      accepted: false,
      reason: "CTB validation missing reasoning — gate cannot pass without evidence",
    };
  }

  return {
    accepted: validation.pass,
    reason: validation.reason,
  };
}
