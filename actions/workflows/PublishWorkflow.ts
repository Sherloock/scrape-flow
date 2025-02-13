"use server";

import { prisma } from "@/lib/prisma";
import { CheckAuth } from "../auth/CheckAuth";
import { WorkflowStatus } from "@/types/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { CalculateCreditsCost } from "@/lib/workflow/helpers";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
	id,
	flowDefinition,
}: {
	id: string;
	flowDefinition: string;
}) {
	const userId = CheckAuth();

	const workflow = await prisma.workflow.findUnique({
		where: {
			id,
			userId,
		},
	});

	if (!workflow) {
		throw new Error("Workflow not found");
	}
	if (workflow.status !== WorkflowStatus.DRAFT) {
		throw new Error("Workflow is not in draft status");
	}

	const flow = JSON.parse(flowDefinition);
	const result = FlowToExecutionPlan(flow.nodes, flow.edges);
	if (!result) {
		throw new Error("Invalid flow definition");
	}
	if (!result.executionPlan) {
		throw new Error("No execution plan generated");
	}

	const creditsCost = CalculateCreditsCost(flow.nodes);

	await prisma.workflow.update({
		where: { id },
		data: {
			status: WorkflowStatus.PUBLISHED,
			creditsCost,
			executionPlan: JSON.stringify(result.executionPlan),
			definition: flowDefinition,
		},
	});

	revalidatePath(`/workflows/editor/${id}`);
}
