"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
	id,
	definition,
}: {
	id: string;

	definition: string;
}) {
	const userId = CheckAuth();

	const workflow = await prisma.workflow.findUnique({
		where: { id, userId },
	});

	if (!workflow) {
		throw new Error("Workflow not found!");
	}

	if (workflow.status !== WorkflowStatus.DRAFT) {
		throw new Error("Workflow is not a draft!");
	}

	await prisma.workflow.update({
		where: { id, userId },
		data: { definition },
	});

	revalidatePath(`/workflows`);

	return workflow;
}
