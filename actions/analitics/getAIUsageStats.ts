import { checkAuth } from "@/actions/auth/checkAuth";

import { prisma } from "@/lib/prisma";
import { Month } from "@/types/analitics";

export async function getAIUsageStats(month: Month) {
	const userId = checkAuth();

	// Get the start and end dates for the specified month
	const startDate = new Date(month.year, month.month - 1, 1);
	const endDate = new Date(month.year, month.month, 0);

	// Query the database for AI usage statistics
	const aiUsage = await prisma.aIUsage.findMany({
		where: {
			userId,
			createdAt: {
				gte: startDate,
				lte: endDate,
			},
		},
		select: {
			inputTokens: true,
			outputTokens: true,
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
	};
}
