"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function getWorkflowExecutions(workflowId: string) {
	const userId = checkAuth();

	const executions = await prisma.workflowExecution.findMany({
		where: {
			workflowId,
			userId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return executions;
}
