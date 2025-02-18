"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteWorkflowSchedule(workflowId: string) {
	const userId = checkAuth();

	await prisma.workflow.update({
		where: { id: workflowId, userId },
		data: { cron: null, nextRunAt: null },
	});

	revalidatePath("/workflows");
}
