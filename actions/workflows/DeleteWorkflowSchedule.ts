"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflowSchedule(workflowId: string) {
	const userId = CheckAuth();

	await prisma.workflow.update({
		where: { id: workflowId, userId },
		data: { cron: null, nextRunAt: null },
	});

	revalidatePath("/workflows");
}
