"use client";

import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, SaveIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveBtn({ workflowId }: { workflowId: string }) {
	const { toObject } = useReactFlow();

	const saveMutation = useMutation({
		mutationFn: updateWorkflow,
		onSuccess: () => {
			toast.success("Workflow saved!", { id: "save-workflow" });
		},
		onError: () => {
			toast.error("Failed to save workflow!", { id: "save-workflow" });
		},
	});
	return (
		<Button
			disabled={saveMutation.isPending}
			variant="outline"
			className="flex items-center gap-1"
			onClick={() => {
				const workflowDefinition = JSON.stringify(toObject());
				toast.loading("Saving workflow...", { id: "save-workflow" });
				saveMutation.mutate({
					id: workflowId,
					definition: workflowDefinition,
				});
			}}
		>
			<CheckIcon size={16} className="stroke-green-400" />
			<p>Save</p>
		</Button>
	);
}

export default SaveBtn;
