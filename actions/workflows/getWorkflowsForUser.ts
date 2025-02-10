"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";

export async function GetWorkflowsForUser() {
	const userId = CheckAuth();

	return prisma.workflow.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "asc",
		},
	});
}
