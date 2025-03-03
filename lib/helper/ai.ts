export function getAiUsageCredits(
	inputTokens: number,
	outputTokens: number
): number {
	return (
		(inputTokens * Number(process.env.GEMINI_INPUT_TOKEN_PRICE!) +
			outputTokens * Number(process.env.GEMINI_OUTPUT_TOKEN_PRICE!)) /
		1000000
	);
}
