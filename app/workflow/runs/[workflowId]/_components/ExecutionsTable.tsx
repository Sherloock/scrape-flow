"use client";
import { GetWorkflowExecutions } from "@/actions/workflows/GetWorkflowExecutions";
import ExecutionStatusIndicator from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialData = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

async function ExecutionsTable({
	workflowId,
	initialData,
}: {
	workflowId: string;
	initialData: InitialData;
}) {
	const router = useRouter();
	const query = useQuery({
		queryKey: ["executions", workflowId],
		initialData,
		queryFn: () => GetWorkflowExecutions(workflowId),
		// staleTime: 60000, // Mark data as fresh for 60 seconds
		// refetchOnWindowFocus: false, // Prevent refetching when tab gains focus
		// refetchInterval: 10000, // Refetch every 30 seconds (adjust as needed)
	});

	// TODO: SOLVE FLICKERING ISSUE

	// Use the data directly since we're keeping previous data
	const executions = query.data;

	return (
		<div className="overflow-auto rounded-lg border shadow-md">
			<Table className="h-full">
				<TableHeader className="bg-muted">
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Consumed</TableHead>
						<TableHead className="text-right text-xs text-muted-foreground">
							Started At
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody className="h-full gap-2 overflow-auto">
					{executions?.map((execution) => {
						const duration = DatesToDurationString(
							execution.startedAt,
							execution.completedAt
						);

						const formattedStartedAt = execution.startedAt
							? formatDistanceToNow(new Date(execution.startedAt), {
									addSuffix: true,
								})
							: "-";

						return (
							<TableRow
								key={execution.id}
								className="cursor-pointer"
								onClick={() => {
									router.push(
										`/workflow/runs/${execution.workflowId}/${execution.id}`
									);
								}}
							>
								{/* ID */}
								<TableCell>
									<div className="flex flex-col">
										<span className="font-semibold">{execution.id}</span>
										<div className="flex items-center gap-1">
											<span>Triggered via</span>
											<Badge variant="outline">{execution.trigger}</Badge>
										</div>
									</div>
								</TableCell>

								{/* Status */}
								<TableCell>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<ExecutionStatusIndicator
												status={execution.status as WorkflowExecutionStatus}
											/>
											<span className="font-semibold capitalize">
												{execution.status}
											</span>
										</div>
										<div className="mx-5 text-xs text-muted-foreground">
											{duration}
										</div>
									</div>
								</TableCell>

								{/* Consumed */}
								<TableCell>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<CoinsIcon size={16} className="text-primary" />
											<span className="font-semibold capitalize">
												{execution.creditsConsumed}
											</span>
										</div>
										<div className="mx-5 text-xs text-muted-foreground">
											{"Credits"}
										</div>
									</div>
								</TableCell>

								{/* Started At */}
								<TableCell className="text-right text-muted-foreground">
									{formattedStartedAt}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default ExecutionsTable;
