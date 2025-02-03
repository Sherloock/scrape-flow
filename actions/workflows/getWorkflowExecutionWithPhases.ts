"use server";

import { checkAuth } from "@/actions/auth/authCheck";
import { prisma } from "@/lib/prisma";

export async function getWorkflowExecutionWithPhases(executionId: string) {
	const userId = checkAuth();

	const execution = await prisma.workflowExecution.findUnique({
		where: {
			id: executionId,
			userId,
		},
		include: {
			phases: { orderBy: { number: "asc" } },
		},
	});

	return execution;
}
