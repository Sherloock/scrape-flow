"use server";

import { checkAuth } from "@/actions/auth/authCheck";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
