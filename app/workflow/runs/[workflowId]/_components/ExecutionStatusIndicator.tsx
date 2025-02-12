import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const statusColors: Record<WorkflowExecutionStatus, string> = {
	PENDING: "bg-stale-400",
	RUNNING: "bg-yellow-400",
	FAILED: "bg-red-400",
	COMPLETED: "bg-emerald-600",
};

function ExecutionStatusIndicator({
	status,
}: {
	status: WorkflowExecutionStatus;
}) {
	return (
		<div className={cn("size-2 rounded-full", statusColors[status])}></div>
	);
}

export default ExecutionStatusIndicator;
