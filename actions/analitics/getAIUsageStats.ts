import { checkAuth } from "@/actions/auth/checkAuth";
import { getInputTokensCost, getOutputTokensCost } from "@/lib/helper/ai";
import { monthToDateRange } from "@/lib/helper/dates";

import { prisma } from "@/lib/prisma";
import { Month } from "@/types/analitics";

type AIUsageStats = {
	inputTokens: number;
	outputTokens: number;
	inputTokensCost: number;
	outputTokensCost: number;
};

export async function getAIUsageStats(month: Month): Promise<AIUsageStats> {
	const userId = checkAuth();

	const dateRange = monthToDateRange(month);

	// Query the database for AI usage statistics
	const aiUsage = await prisma.aIUsage.findMany({
		where: {
			userId,
			createdAt: {
				gte: dateRange.startDate,
				lte: dateRange.endDate,
			},
		},
		// Convert Decimal to number to avoid serialization issues
		select: {
			inputTokens: true,
			outputTokens: true,
			creditsConsumed: true,
		},
	});

	// Calculate total input and output tokens
	const totalInputTokens = aiUsage.reduce(
		(sum, usage) => sum + usage.inputTokens,
		0
	);
	const totalOutputTokens = aiUsage.reduce(
		(sum, usage) => sum + usage.outputTokens,
		0
	);

	return {
		inputTokens: totalInputTokens,
		outputTokens: totalOutputTokens,
		inputTokensCost: getInputTokensCost(totalInputTokens),
		outputTokensCost: getOutputTokensCost(totalOutputTokens),
	};
}
