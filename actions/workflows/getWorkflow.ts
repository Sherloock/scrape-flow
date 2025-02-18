"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function getWorkflow(workflowId: string) {
	const userId = checkAuth();

	return prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId,
		},
	});
}
