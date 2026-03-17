/**
 * Monte Carlo Simulation Engine — quantitative gate validation.
 *
 * Pure math. No LLM. Runs entirely within the Worker's CPU budget.
 *
 * The idea: Hold constants fixed, randomize all variables across their ranges,
 * measure the standard deviation of the output space. As more constants are
 * extracted, the output space should TIGHTEN (sigma decreases).
 */

import type { SigmaDirection } from "./doctrine";

export interface MonteCarloVariable {
  name: string;
  min: number;
  max: number;
  distribution: "uniform" | "normal" | "beta";
}

export interface MonteCarloResult {
  sigma: number;
  mean: number;
  min: number;
  max: number;
  iterations: number;
  priorSigma: number | null;
  direction: SigmaDirection | null;
}

/**
 * Seeded PRNG (xoshiro128**) for reproducible simulations.
 * CF Workers don't guarantee Math.random() consistency across isolates.
 */
function createRng(seed: number): () => number {
  let s0 = seed | 0;
  let s1 = (seed << 13) | 0;
  let s2 = ((seed >> 9) ^ (seed << 7)) | 0;
  let s3 = (seed * 2654435761) | 0;

  return () => {
    const result = Math.imul(s1 * 5, 7) >>> 0;
    const t = s1 << 9;
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = (s3 << 11) | (s3 >>> 21);
    return (result >>> 0) / 4294967296;
  };
}

/**
 * Generate a random value for a variable according to its distribution.
 */
function sampleVariable(v: MonteCarloVariable, rng: () => number): number {
  const range = v.max - v.min;

  switch (v.distribution) {
    case "uniform":
      return v.min + rng() * range;

    case "normal": {
      // Box-Muller transform, clamped to [min, max]
      const u1 = rng();
      const u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
      const mean = (v.min + v.max) / 2;
      const stddev = range / 6; // 99.7% within range
      return Math.max(v.min, Math.min(v.max, mean + z * stddev));
    }

    case "beta": {
      // Simple beta(2,2) approximation — bell-shaped on [0,1], scaled to range
      const a = rng();
      const b = rng();
      const beta = (a + b) / 2; // Rough approximation
      return v.min + beta * range;
    }

    default:
      return v.min + rng() * range;
  }
}

/**
 * Run a Monte Carlo simulation.
 *
 * Each iteration: randomize all variables, compute an "output space" score.
 * The score is the sum of normalized variable values — representing the
 * dimensionality of the output space. As constants are extracted (variables removed),
 * fewer variables contribute, and sigma should tighten.
 *
 * @param variables - Current variable set (constants already removed)
 * @param iterations - Number of simulation runs (default 1000)
 * @param seed - RNG seed for reproducibility
 * @param priorSigma - Sigma from the previous gate (null for first gate)
 */
export function runSimulation(
  variables: MonteCarloVariable[],
  iterations: number = 1000,
  seed: number = Date.now(),
  priorSigma: number | null = null,
): MonteCarloResult {
  if (variables.length === 0) {
    return {
      sigma: 0,
      mean: 0,
      min: 0,
      max: 0,
      iterations,
      priorSigma,
      direction: priorSigma !== null ? "TIGHTENED" : null,
    };
  }

  const rng = createRng(seed);
  const scores: number[] = new Array(iterations);

  for (let i = 0; i < iterations; i++) {
    let score = 0;
    for (const v of variables) {
      const sample = sampleVariable(v, rng);
      // Normalize to [0, 1] range
      const normalized = (sample - v.min) / (v.max - v.min || 1);
      score += normalized;
    }
    // Normalize by variable count so sigma is comparable across gates
    scores[i] = score / variables.length;
  }

  // Calculate statistics
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;

  for (const s of scores) {
    sum += s;
    if (s < min) min = s;
    if (s > max) max = s;
  }

  const mean = sum / iterations;

  let varianceSum = 0;
  for (const s of scores) {
    varianceSum += (s - mean) ** 2;
  }
  const sigma = Math.sqrt(varianceSum / iterations);

  return {
    sigma,
    mean,
    min,
    max,
    iterations,
    priorSigma,
    direction: compareGates(sigma, priorSigma),
  };
}

/**
 * Compare current sigma to prior gate sigma.
 */
export function compareGates(
  currentSigma: number,
  priorSigma: number | null,
): SigmaDirection | null {
  if (priorSigma === null) return null;

  const threshold = 0.001; // Tolerance for "unchanged"

  if (currentSigma < priorSigma - threshold) return "TIGHTENED";
  if (currentSigma > priorSigma + threshold) return "EXPANDED";
  return "UNCHANGED";
}

/**
 * Check if sigma is within operational tolerance.
 */
export function withinTolerance(sigma: number, threshold: number): boolean {
  return sigma <= threshold;
}
