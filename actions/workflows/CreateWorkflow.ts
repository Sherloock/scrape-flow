"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import {
	createWorkflowSchema,
	createWorkflowSchemaType,
} from "@/schema/workflows";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { Edge, Viewport } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
	const userId = CheckAuth();

	const { success, data } = createWorkflowSchema.safeParse(form);
	if (!success) {
		throw new Error("Invalid form data!");
	}

	const initWorkflowDefinition: {
		nodes: AppNode[];
		edges: Edge[];
		viewport: Viewport;
	} = {
		nodes: [],
		edges: [],
		viewport: { x: 0, y: 0, zoom: 1 },
	};
	initWorkflowDefinition.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));

	const result = await prisma.workflow.create({
		data: {
			userId,
			status: WorkflowStatus.DRAFT,
			definition: JSON.stringify(initWorkflowDefinition),
			...data,
		},
	});

	if (!result) {
		throw new Error("Failed to create workflow!");
	}

	redirect(`/workflow/editor/${result.id}`);
}
