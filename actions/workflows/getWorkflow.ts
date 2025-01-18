"use server";

import { checkAuth } from "@/actions/auth/authCheck";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflow(workflowId: string) {
	const userId = checkAuth();

	return prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId,
		},
	});
}
