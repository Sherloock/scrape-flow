import { MILLION } from "@/lib/helper/number";

export const inputTokenPricePerMillionTokens = Number(
	process.env.GEMINI_INPUT_TOKEN_PRICE!
);
export const outputTokenPricePerMillionTokens = Number(
	process.env.GEMINI_OUTPUT_TOKEN_PRICE!
);

export function getAiUsageCredits(
	inputTokens: number,
	outputTokens: number
): number {
	return getInputTokensCost(inputTokens) + getOutputTokensCost(outputTokens);
}

export function getInputTokensCost(inputTokens: number): number {
	return (inputTokens * inputTokenPricePerMillionTokens) / MILLION;
}

export function getOutputTokensCost(outputTokens: number): number {
	return (outputTokens * outputTokenPricePerMillionTokens) / MILLION;
}
