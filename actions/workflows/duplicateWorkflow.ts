"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";
import {
	DuplicateWorkflowSchema,
	DuplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflow(form: DuplicateWorkflowSchemaType) {
	const { success, data } = DuplicateWorkflowSchema.safeParse(form);
	if (!success) {
		throw new Error("Invalid form data!");
	}

	const userId = checkAuth();

	const sourceWorkflow = await prisma.workflow.findUnique({
		where: { id: data.workflowId, userId },
	});

	if (!sourceWorkflow) {
		throw new Error("Workflow not found!");
	}

	const newWorkflow = await prisma.workflow.create({
		data: {
			userId,
			name: data.name,
			description: data.description,
			status: WorkflowStatus.DRAFT,
			definition: sourceWorkflow.definition,
			// executionPlan: sourceWorkflow.executionPlan,
			// creditsCost: sourceWorkflow.creditsCost,
			// createdAt: new Date(),
			// updatedAt: new Date(),
		},
	});

	if (!newWorkflow) {
		throw new Error("Failed to duplicate workflow!");
	}

	revalidatePath("/workflows");
	// return newWorkflow;
}
