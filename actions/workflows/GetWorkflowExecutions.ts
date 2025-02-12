"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";

export async function GetWorkflowExecutions(workflowId: string) {
	const userId = CheckAuth();

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
