"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";

export async function GetWorkflow(workflowId: string) {
	const userId = CheckAuth();

	return prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId,
		},
	});
}
