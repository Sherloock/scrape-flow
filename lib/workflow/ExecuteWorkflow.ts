import "server-only";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { ExecutionPhase, WorkflowExecution } from "@prisma/client";
import { waitFor } from "@/lib/helper/waitFor";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ExecutorRegistry } from "@/lib/workflow/executor/Registry";

export async function ExecuteWorkflow(executionId: string) {
	const execution = await prisma.workflowExecution.findUnique({
		where: { id: executionId },
		include: {
			phases: true,
			workflow: true,
		},
	});

	if (!execution) {
		throw new Error("Execution not found");
	}

	const enviroment = { phases: {} };

	await initWorkflowExecution(executionId, execution.workflowId);
	await initPhaseStatuses(execution);

	let creditsConsumed = 0;
	let executionFailed = false;
	for (const phase of execution.phases) {
		const { success, creditsCost } = await executeWorkflowPhase(phase);
		if (!success) {
			executionFailed = true;
			break;
		}

		creditsConsumed += creditsCost;
	}

	await finalizeWorkflowExecution(
		executionId,
		execution.workflowId,
		executionFailed,
		creditsConsumed
	);

	// TODO: cleanup execution environment

	revalidatePath(`/workflow/runs/`);
}

async function initWorkflowExecution(executionId: string, workflowId: string) {
	await prisma.workflowExecution.update({
		where: { id: executionId },
		data: {
			startedAt: new Date(),
			status: WorkflowExecutionStatus.RUNNING,
		},
	});

	await prisma.workflow.update({
		where: { id: workflowId },
		data: {
			lastRunAt: new Date(),
			lastRunStatus: WorkflowExecutionStatus.RUNNING,
			lastRunId: executionId,
		},
	});
}

async function initPhaseStatuses(execution: any) {
	await prisma.executionPhase.updateMany({
		where: { id: { in: execution.phases.map((phase: any) => phase.id) } },
		data: { status: WorkflowExecutionStatus.PENDING },
	});
}

async function finalizeWorkflowExecution(
	executionId: string,
	workflowId: string,
	executionFailed: boolean,
	creditsConsumed: number
) {
	const finalStatus = executionFailed
		? WorkflowExecutionStatus.FAILED
		: WorkflowExecutionStatus.COMPLETED;

	await prisma.workflowExecution.update({
		where: { id: executionId },
		data: {
			status: finalStatus,
			completedAt: new Date(),
			creditsConsumed,
		},
	});

	await prisma.workflow
		.update({
			where: { id: workflowId, lastRunId: executionId },
			data: {
				lastRunStatus: finalStatus,
			},
		})
		.catch((error) => {
			// IGNORE ERROR
			// this means that we have triggered other runs while the first one was running
		});
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
	const startedAt = new Date();

	const node = JSON.parse(phase.node) as AppNode;

	// update phase status
	await prisma.executionPhase.update({
		where: { id: phase.id },
		data: { status: WorkflowExecutionStatus.RUNNING, startedAt },
	});

	const creditsCost = TaskRegistry[node.data.type].credits;
	console.log(`executing phase ${phase.name} with ${creditsCost} credits`);

	// TODO: decrement user credits
	const success = await executePhase(phase, node);
	await finalizePhase(phase.id, success);

	return { success, creditsCost };
}

async function finalizePhase(phaseId: string, success: boolean) {
	const finalStatus = success
		? WorkflowExecutionStatus.COMPLETED
		: WorkflowExecutionStatus.FAILED;

	await prisma.executionPhase.update({
		where: { id: phaseId },
		data: { status: finalStatus, completedAt: new Date() },
	});
}

async function executePhase(
	phase: ExecutionPhase,
	node: AppNode
): Promise<boolean> {
	const runFn = ExecutorRegistry[node.data.type];
	if (!runFn) {
		return false;
	}

	return await runFn(phase, node);
}
