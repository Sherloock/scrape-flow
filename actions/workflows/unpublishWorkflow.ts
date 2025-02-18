"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "../auth/checkAuth";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function unpublishWorkflow({ id }: { id: string }) {
	const userId = checkAuth();

	const workflow = await prisma.workflow.findUnique({
		where: {
			id,
			userId,
		},
	});

	if (!workflow) {
		throw new Error("Workflow not found");
	}
	if (workflow.status !== WorkflowStatus.PUBLISHED) {
		throw new Error("Workflow is not in published status");
	}

	await prisma.workflow.update({
		where: { id, userId },
		data: {
			status: WorkflowStatus.DRAFT,
			executionPlan: null,
			creditsCost: 0,
		},
	});

	revalidatePath(`/workflows/editor/${id}`);
}
