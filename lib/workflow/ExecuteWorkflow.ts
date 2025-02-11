import "server-only";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
	WorkflowExecutionStatus,
	WorkflowStatus,
	WorkflowTask,
} from "@/types/workflow";
import { ExecutionPhase, WorkflowExecution } from "@prisma/client";
import { waitFor } from "@/lib/helper/waitFor";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ExecutorRegistry } from "@/lib/workflow/executor/Registry";
import { Env, ExecutionEnv } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";

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

	const env: Env = { phases: {} };

	await initWorkflowExecution(executionId, execution.workflowId);
	await initPhaseStatuses(execution);

	let creditsConsumed = 0;
	let executionFailed = false;
	for (const phase of execution.phases) {
		const { success, creditsCost } = await executeWorkflowPhase(phase, env);
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

	await cleanupExecutionEnvironment(env);

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

async function executeWorkflowPhase(phase: ExecutionPhase, env: Env) {
	const startedAt = new Date();
	const node = JSON.parse(phase.node) as AppNode;
	setupEnvironmentForPhase(node, env);

	// update phase status
	await prisma.executionPhase.update({
		where: { id: phase.id },
		data: {
			status: WorkflowExecutionStatus.RUNNING,
			startedAt,
			inputs: JSON.stringify(env.phases[node.id].inputs),
		},
	});

	const creditsCost = TaskRegistry[node.data.type].credits;
	console.log(`executing phase ${phase.name} with ${creditsCost} credits`);

	// TODO: decrement user credits
	const success = await executePhase(phase, node, env);
	const outputs = env.phases[node.id].outputs;
	await finalizePhase(phase.id, success, outputs);

	return { success, creditsCost };
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any) {
	const finalStatus = success
		? WorkflowExecutionStatus.COMPLETED
		: WorkflowExecutionStatus.FAILED;

	await prisma.executionPhase.update({
		where: { id: phaseId },
		data: {
			status: finalStatus,
			completedAt: new Date(),
			outputs: JSON.stringify(outputs),
		},
	});
}

async function executePhase(
	phase: ExecutionPhase,
	node: AppNode,
	env: Env
): Promise<boolean> {
	const runFn = ExecutorRegistry[node.data.type];
	if (!runFn) {
		return false;
	}

	const executionEnv: ExecutionEnv<any> = createExecutionEnv(node, env);

	return await runFn(executionEnv);
}

function setupEnvironmentForPhase(node: AppNode, env: Env) {
	env.phases[node.id] = {
		inputs: {},
		outputs: {},
	};

	const inputs = TaskRegistry[node.data.type].inputs;
	for (const input of inputs) {
		if (input.type === TaskParamType.BROWSER_INSTANCE) {
			continue;
		}

		const inputValue = node.data.inputs[input.name];
		if (inputValue) {
			env.phases[node.id].inputs[input.name] = inputValue;
			continue;
		}
	}
}

function createExecutionEnv<T extends WorkflowTask>(
	node: AppNode,
	env: Env
): ExecutionEnv<any> {
	return {
		getInput: (name: string) => env.phases[node.id]?.inputs[name],
		setOutput: (name: string, value: string) => {
			env.phases[node.id]!.outputs[name] = value;
		},
		getBrowser: () => env.browser,
		setBrowser: (browser: Browser) => {
			env.browser = browser;
		},
		getPage: () => env.page,
		setPage: (page: Page) => {
			env.page = page;
		},
	};
}

async function cleanupExecutionEnvironment(env: Env) {
	if (env.browser) {
		await env.browser.close().catch((error) => {
			console.error("Failed to close browser. Reason: ", error);
		});
	}

	if (env.page) {
		await env.page.close().catch((error) => {
			console.error("Failed to close page. Reason: ", error);
		});
	}
}
