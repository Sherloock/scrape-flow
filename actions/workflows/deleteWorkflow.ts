"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { checkAuth } from "@/actions/auth/authCheck";
import { auth } from "@clerk/nextjs/server";

export async function deleteWorkflow(workflowId: string) {
	const userId = checkAuth();

	const result = await prisma.workflow.delete({
		where: {
			id: workflowId,
			userId,
		},
	});

	revalidatePath("/workflows");
}
