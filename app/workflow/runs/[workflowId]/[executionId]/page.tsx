import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import ExecutionViewer from "@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionViewer";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function ExecutionViewPage({
	params,
}: {
	params: { workflowId: string; executionId: string };
}) {
	return (
		<div className="flex h-screen w-full flex-col overflow-hidden">
			<Topbar
				workflowId={params.workflowId}
				title="Workflow run details"
				subtitle={`Run ID: ${params.executionId}`}
				hideButtons={true}
			></Topbar>
			<section className="flex h-full overflow-auto">
				<Suspense
					fallback={
						<div className="flex h-full w-full items-center justify-center">
							<Loader2Icon
								className="size-10 animate-spin stroke-primary"
								size={20}
							/>
						</div>
					}
				>
					<ExecutionViewerWrapper executionId={params.executionId} />
				</Suspense>
			</section>
		</div>
	);
}

async function ExecutionViewerWrapper({
	executionId,
}: {
	executionId: string;
}) {
	const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
	if (!workflowExecution) {
		return <div>Execution not found</div>;
	}

	return <ExecutionViewer initialData={workflowExecution} />;
}
