"use client";

import { RunWorkflow } from "@/actions/workflows/RunWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { AppNode } from "@/types/appNode";
import { useMutation } from "@tanstack/react-query";
import { Edge, useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
	const generateExecutionPlan = useExecutionPlan();
	const { toObject } = useReactFlow();

	const mutation = useMutation({
		mutationFn: RunWorkflow,
		onSuccess: () => {
			toast.success("Execution started", { id: "workflow-execution" });
		},
		onError: () => {
			toast.error("Something went wrong", { id: "workflow-execution" });
		},
	});

	return (
		<Button
			// variant="outline"
			className="flex items-center gap-2"
			disabled={mutation.isPending}
			onClick={() => {
				const plan = generateExecutionPlan();
				if (!plan) {
					return;
				}
				mutation.mutate({
					workflowId,
					flowDefinition: JSON.stringify(toObject()),
				});
			}}
		>
			<PlayIcon size={16} className="" />
			<p>Execute</p>
		</Button>
	);
}
