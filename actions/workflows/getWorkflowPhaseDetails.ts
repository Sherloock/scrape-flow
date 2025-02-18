"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function getWorkflowPhaseDetails(phaseId: string) {
	const userId = checkAuth();

	const phase = await prisma.executionPhase.findUnique({
		where: {
			id: phaseId,
			workflowExecution: {
				userId,
			},
		},
		include: {
			logs: {
				orderBy: {
					timestamp: "asc",
				},
			},
		},
	});

	return phase;
}
