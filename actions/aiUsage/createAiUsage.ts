"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export type AIUsageData = {
	inputTokens: number;
	outputTokens: number;
	creditsConsumed: number;
};

export async function createAiUsage(data: AIUsageData, phaseId: string) {
	const userId = checkAuth();

	await prisma.aIUsage.create({
		data: {
			...data,
			userId,
			executionPhaseId: phaseId,
		},
	});
}
