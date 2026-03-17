/**
 * LLM Client — Anthropic API integration for qualitative gate validation.
 *
 * The LLM validates. It never decides gate progression.
 * The gate engine orchestrates. The LLM is tail, not spine.
 */

import {
  LAYER0_DOCTRINE,
  type LLMValidationResponse,
  type LLMExtractionResponse,
} from "./doctrine";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: "text"; text: string }>;
}

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }] as AnthropicMessage[],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  return data.content[0].text;
}

function parseJSON<T>(raw: string): T {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as T;
}

/**
 * Extract the first candidate constant from a domain description.
 */
export async function extractFirstCandidate(
  apiKey: string,
  domainName: string,
  domainDescription: string,
): Promise<LLMExtractionResponse> {
  const raw = await callAnthropic(
    apiKey,
    LAYER0_DOCTRINE.extractionPrompt,
    `Domain: ${domainName}\n\nContext: ${domainDescription}`,
  );
  return parseJSON<LLMExtractionResponse>(raw);
}

/**
 * Validate a candidate constant through the three qualitative tests.
 */
export async function validateCandidate(
  apiKey: string,
  domainName: string,
  domainDescription: string,
  candidateConstant: string,
  priorConstants: string[],
  gateNumber: number,
): Promise<LLMValidationResponse> {
  const priorContext =
    priorConstants.length > 0
      ? `\n\nAlready locked constants:\n${priorConstants.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
      : "";

  const raw = await callAnthropic(
    apiKey,
    LAYER0_DOCTRINE.qualitativePrompt,
    `Domain: ${domainName}
Context: ${domainDescription}
Gate: ${gateNumber}
Candidate Constant: ${candidateConstant}${priorContext}`,
  );
  return parseJSON<LLMValidationResponse>(raw);
}
