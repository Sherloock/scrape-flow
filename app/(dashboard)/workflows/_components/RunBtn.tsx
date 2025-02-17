"use client";

import { useMutation } from "@tanstack/react-query";
import { RunWorkflow } from "@/actions/workflows/RunWorkflow";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

function RunBtn({ workflowId }: { workflowId: string }) {
	const mutation = useMutation({
		mutationFn: RunWorkflow,
		onSuccess: () => {
			toast.success("Workflow started", { id: workflowId });
		},
		onError: () => {
			toast.error("Something went wrong", { id: workflowId });
		},
	});

	return (
		<Button
			variant="outline"
			size="sm"
			className="flex items-center gap-2"
			disabled={mutation.isPending}
			onClick={() => {
				toast.loading("Scheduling run...", { id: workflowId });
				mutation.mutate({ workflowId });
			}}
		>
			<PlayIcon size={16} />
			{mutation.isPending ? "Starting..." : "Run"}
		</Button>
	);
}

export default RunBtn;
