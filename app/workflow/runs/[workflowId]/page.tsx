import { GetWorkflowExecutions } from "@/actions/workflows/GetWorkflowExecutions";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import ExecutionsTable from "@/app/workflow/runs/[workflowId]/_components/ExecutionsTable";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function ExecutionsPage({
	params,
}: {
	params: { workflowId: string };
}) {
	return (
		<div className="h-full w-full overflow-auto">
			<Topbar
				title="All runs"
				subtitle="List of all executions for this workflow"
				workflowId={params.workflowId}
				hideButtons={true}
			/>

			<Suspense
				fallback={
					<div className="flex h-full w-full items-center justify-center">
						<Loader2Icon className="animate-spin stroke-primary" size={30} />
					</div>
				}
			>
				<ExecutionsTableWrapper workflowId={params.workflowId} />
			</Suspense>
		</div>
	);
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
	const executions = await GetWorkflowExecutions(workflowId);

	if (executions.length === 0) {
		return (
			<div className="flex h-[calc(100vh-100px)] items-center justify-center">
				<div className="flex flex-col items-center justify-center gap-2">
					<div className="flex size-20 items-center justify-center rounded-full bg-accent">
						<InboxIcon size={40} className="stroke-primary" />
					</div>
					<div className="flex flex-col items-center gap-1">
						<p className="font-bold">This workflow hasn't been executed yet</p>
						<p className="text-sm text-muted-foreground">
							You can execute your workflow from the editor page
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto w-full py-6">
			<ExecutionsTable workflowId={workflowId} initialData={executions} />
		</div>
	);
}
