"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CheckAuth } from "@/actions/auth/CheckAuth";

export async function DeleteWorkflow(workflowId: string) {
	const userId = CheckAuth();

	const result = await prisma.workflow.delete({
		where: {
			id: workflowId,
			userId,
		},
	});

	revalidatePath("/workflows");
}
