import "server-only";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WorkflowExecutionStatus, WorkflowTask } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ExecutorRegistry } from "@/lib/workflow/executor/Registry";
import { Env, ExecutionEnv } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogColletor } from "@/types/log";
import { createLogCollector } from "@/lib/log";
import { CheckAuth } from "@/actions/auth/CheckAuth";
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
	const edges = JSON.parse(execution.definition).edges as Edge[];
	const env: Env = { phases: {} };

	await initWorkflowExecution(executionId, execution.workflowId);
	await initPhaseStatuses(execution);

	let creditsConsumedOverall = 0;
	let executionFailed = false;
	for (const phase of execution.phases) {
		// const logCollector: LogColletor = createLogCollector();
		const { success, creditsConsumed } = await executeWorkflowPhase(
			phase,
			env,
			edges,
			execution.userId
		);
		creditsConsumedOverall += creditsConsumed;
		if (!success) {
			executionFailed = true;
			break;
		}
	}

	await finalizeWorkflowExecution(
		executionId,
		execution.workflowId,
		executionFailed,
		creditsConsumedOverall
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
	creditsConsumedOverall: number
) {
	const finalStatus = executionFailed
		? WorkflowExecutionStatus.FAILED
		: WorkflowExecutionStatus.COMPLETED;

	await prisma.workflowExecution.update({
		where: { id: executionId },
		data: {
			status: finalStatus,
			completedAt: new Date(),
			creditsConsumed: creditsConsumedOverall,
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

async function executeWorkflowPhase(
	phase: ExecutionPhase,
	env: Env,
	edges: Edge[],
	userId: string
) {
	const logCollector: LogColletor = createLogCollector();
	const startedAt = new Date();
	const node = JSON.parse(phase.node) as AppNode;
	setupEnvForPhase(node, env, edges);

	// update phase status
	await prisma.executionPhase.update({
		where: { id: phase.id },
		data: {
			status: WorkflowExecutionStatus.RUNNING,
			startedAt,
			inputs: JSON.stringify(env.phases[node.id].inputs),
		},
	});

	const creditsRequired = TaskRegistry[node.data.type].credits;
	let success = await decrementUserCredits(
		creditsRequired,
		logCollector,
		userId
	);

	let creditsConsumed = success ? creditsRequired : 0;
	if (success) {
		success = await executePhase(phase, node, env, logCollector);
	}

	const outputs = env.phases[node.id].outputs;
	await finalizePhase(
		phase.id,
		success,
		outputs,
		logCollector,
		creditsConsumed
	);

	return { success, creditsConsumed };
}

async function finalizePhase(
	phaseId: string,
	success: boolean,
	outputs: any,
	logCollector: LogColletor,
	creditsConsumed: number
) {
	const finalStatus = success
		? WorkflowExecutionStatus.COMPLETED
		: WorkflowExecutionStatus.FAILED;

	await prisma.executionPhase.update({
		where: { id: phaseId },
		data: {
			status: finalStatus,
			completedAt: new Date(),
			outputs: JSON.stringify(outputs),
			creditsConsumed,
			logs: {
				createMany: {
					data: logCollector.getAll().map((log) => ({
						message: log.message,
						logLevel: log.level,
						timestamp: log.timestamp,
					})),
				},
			},
		},
	});
}

async function executePhase(
	phase: ExecutionPhase,
	node: AppNode,
	env: Env,
	logCollector: LogColletor
): Promise<boolean> {
	// TODO: REMOVE THIS SLOW DOWN THE EXECUTION FOR TESTING PURPOSES
	await waitFor(3000);

	const runFn = ExecutorRegistry[node.data.type];
	if (!runFn) {
		return false;
	}

	const executionEnv: ExecutionEnv<any> = createExecutionEnv(
		node,
		env,
		logCollector
	);

	return await runFn(executionEnv);
}

function setupEnvForPhase(node: AppNode, env: Env, edges: Edge[]) {
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
		const connectedEdge = edges.find(
			(edge) => edge.target === node.id && edge.targetHandle === input.name
		);
		if (!connectedEdge) {
			console.error(`Missing edge for input ${input.name}`);
			continue;
		}

		const outputValue =
			env.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
		env.phases[node.id].inputs[input.name] = outputValue;
	}
}

function createExecutionEnv<T extends WorkflowTask>(
	node: AppNode,
	env: Env,
	logCollector: LogColletor
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
		log: logCollector,
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
async function decrementUserCredits(
	amount: number,
	logCollector: LogColletor,
	userId: string
): Promise<boolean> {
	try {
		await prisma.userBalance.update({
			where: { userId: userId, credits: { gte: amount } },
			data: { credits: { decrement: amount } },
		});

		return true;
	} catch (error) {
		logCollector.error("Insufficient balance");
		return false;
	}
}
