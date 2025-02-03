"use server";

import { checkAuth } from "@/actions/auth/authCheck";
import { prisma } from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import {
	ExecutionPhaseStatus,
	WorkflowExecutionPlan,
	WorkflowExecutionStatus,
	WorkflowExecutionTrigger,
} from "@/types/workflow";

export async function runWorkflow(form: {
	workflowId: string;
	flowDefinition: string;
}) {
	const userId = checkAuth();

	const { workflowId, flowDefinition } = form;
	if (!workflowId) {
		throw new Error("Workflow ID is required");
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId,
		},
	});

	if (!workflow) {
		throw new Error("Workflow not found");
	}

	let executionPlan: WorkflowExecutionPlan;

	if (!flowDefinition) {
		throw new Error("Flow definition is not defined");
	}

	const flow = JSON.parse(flowDefinition);
	const result = FlowToExecutionPlan(flow.nodes, flow.edges);

	if (result.error) {
		throw new Error("Flow is not valid");
	}

	if (!result.executionPlan) {
		throw new Error("No execution plan found");
	}

	executionPlan = result.executionPlan;
	const execution = await prisma.workflowExecution.create({
		data: {
			workflowId,
			userId,
			status: WorkflowExecutionStatus.PENDING,
			startedAt: new Date(),
			trigger: WorkflowExecutionTrigger.MANUAL,

			phases: {
				create: executionPlan.flatMap((phase) => {
					return phase.nodes.map((node) => {
						return {
							userId,
							status: ExecutionPhaseStatus.CREATED,
							number: phase.phase,
							node: JSON.stringify(node),
							name: TaskRegistry[node.data.type].label,
						};
					});
				}),
			},
		},
	});
}
