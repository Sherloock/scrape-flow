import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/helper/appUrl";
import { WorkflowStatus } from "@/types/workflow";
export async function GET(request: Request) {
	const now = new Date();
	const workflows = await prisma.workflow.findMany({
		select: {
			id: true,
			cron: true,
		},
		where: {
			status: WorkflowStatus.PUBLISHED,
			cron: { not: null },
			nextRunAt: {
				lte: now,
			},
		},
	});

	console.log({ "workflows to run": workflows });

	for (const workflow of workflows) {
		triggerWorkflow(workflow.id);
	}

	return new Response("Workflows triggered", { status: 200 });
}

async function triggerWorkflow(workflowId: string) {
	const triggerApiUrl = getAppUrl(
		`api/workflows/execute?workflowId=${workflowId}`
	);

	console.log({ triggerApiUrl });

	const response = await fetch(triggerApiUrl, {
		headers: {
			Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
		},
		cache: "no-store",
		signal: AbortSignal.timeout(60000),
	}).catch((error) => {
		console.error(`Error triggering workflow with id ${workflowId}:`, error);
	});

	console.log({ response });
}
