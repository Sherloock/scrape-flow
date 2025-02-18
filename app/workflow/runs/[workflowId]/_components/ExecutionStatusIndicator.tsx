import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const statusColors: Record<WorkflowExecutionStatus, string> = {
	PENDING: "bg-stale-400",
	RUNNING: "bg-yellow-400",
	FAILED: "bg-red-400",
	COMPLETED: "bg-emerald-600",
};

export default function ExecutionStatusIndicator({
	status,
}: {
	status: WorkflowExecutionStatus;
}) {
	return (
		<div className={cn("size-2 rounded-full", statusColors[status])}></div>
	);
}

const labelColors: Record<WorkflowExecutionStatus, string> = {
	PENDING: "text-stale-400",
	RUNNING: "text-yellow-400",
	FAILED: "text-red-400",
	COMPLETED: "text-emerald-600",
};

export function ExecutionStatusLabel({
	status,
}: {
	status: WorkflowExecutionStatus;
}) {
	return <span className={cn("", labelColors[status])}>{status}</span>;
}
