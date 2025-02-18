"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function getWorkflowsForUser() {
	const userId = checkAuth();

	return prisma.workflow.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "asc",
		},
	});
}
