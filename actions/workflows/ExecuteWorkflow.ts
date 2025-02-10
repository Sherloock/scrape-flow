"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";

export async function ExecuteWorkflow(executionId: string) {
	const userId = CheckAuth();

	const execution = await prisma.workflowExecution.findUnique({
		where: { id: executionId, userId },
	});
}
