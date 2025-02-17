import { prisma } from "@/lib/prisma";
import {
	ExecutionPhaseStatus,
	WorkflowExecutionPlanPhase,
	WorkflowExecutionStatus,
	WorkflowExecutionTrigger,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { timingSafeEqual } from "crypto";
import { AppNode } from "@/types/appNode";
import { ExecuteWorkflow } from "@/lib/workflow/ExecuteWorkflow";

function isValidSecretKey(requestKey: string): boolean {
	const apiSecretKey = process.env.API_SECRET_KEY;

	if (!apiSecretKey || !requestKey) {
		return false;
	}

	try {
		const apiKeyBuffer = Buffer.from(apiSecretKey, "utf-8");
		const requestKeyBuffer = Buffer.from(requestKey, "utf-8");

		return timingSafeEqual(apiKeyBuffer, requestKeyBuffer);
	} catch (error) {
		console.error("Error validating secret key:", error);
		return false;
	}
}

export async function GET(request: Request) {
	const authHeader = request.headers.get("Authorization");

	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7) // "Bearer ".length === 7
		: null;

	if (!token || !isValidSecretKey(token)) {
		return Response.json(
			{ error: "Unauthorized" },
			{
				status: 401,
				headers: {
					"Content-Type": "application/json",
					"WWW-Authenticate": "Bearer",
				},
			}
		);
	}

	const { searchParams } = new URL(request.url);
	const workflowId = searchParams.get("workflowId") as string;

	if (!workflowId) {
		return Response.json({ error: "Bad Request" }, { status: 400 });
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: workflowId,
		},
	});

	if (!workflow) {
		return Response.json({ error: "Bad Request" }, { status: 400 });
	}

	const executionPlan = JSON.parse(workflow.executionPlan!);

	if (!executionPlan) {
		return Response.json({ error: "Bad Request" }, { status: 400 });
	}

	const execution = await prisma.workflowExecution.create({
		data: {
			workflowId: workflowId,
			userId: workflow.userId,
			definition: workflow.definition,
			status: WorkflowExecutionStatus.PENDING,
			trigger: WorkflowExecutionTrigger.CRON,
			phases: {
				create: executionPlan.flatMap((phase: WorkflowExecutionPlanPhase) => {
					return phase.nodes.map((node: AppNode) => {
						return {
							userId: workflow.userId,
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

	await ExecuteWorkflow(execution.id);
	return Response.json(null, { status: 200 });
}
