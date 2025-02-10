import "server-only";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { WorkflowExecution } from "@prisma/client";
import { waitFor } from "@/lib/helper/waitFor";

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
		await waitFor(3000);
		// TODO: execute phase
		creditsConsumed += phase.creditsConsumed ?? 0;
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
