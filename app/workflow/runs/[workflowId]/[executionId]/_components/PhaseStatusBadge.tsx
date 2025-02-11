import { WorkflowExecutionStatus } from "@/types/workflow";
import {
	CircleCheckIcon,
	Loader2Icon,
	CircleXIcon,
	CircleDashedIcon,
} from "lucide-react";
import React from "react";

export default function PhaseStatusBadge({
	status,
}: {
	status: WorkflowExecutionStatus;
}) {
	switch (status) {
		case WorkflowExecutionStatus.PENDING:
			return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;

		case WorkflowExecutionStatus.RUNNING:
			return (
				<Loader2Icon size={20} className="animate-spin stroke-yellow-500" />
			);

		case WorkflowExecutionStatus.FAILED:
			return <CircleXIcon size={20} className="text-destructive" />;

		case WorkflowExecutionStatus.COMPLETED:
			return <CircleCheckIcon size={20} className="text-green-500" />;

		default:
			return <div className="rounded-full">{status}</div>;
	}
}
