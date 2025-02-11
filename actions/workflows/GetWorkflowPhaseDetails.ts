"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";

export async function GetWorkflowPhaseDetails(phaseId: string) {
	const userId = CheckAuth();

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
