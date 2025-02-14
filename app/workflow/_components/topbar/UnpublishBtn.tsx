"use client";

import { PublishWorkflow } from "@/actions/workflows/PublishWorkflow";
import { RunWorkflow } from "@/actions/workflows/RunWorkflow";
import { UnpublishWorkflow } from "@/actions/workflows/UnpublishWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { AppNode } from "@/types/appNode";
import { useMutation } from "@tanstack/react-query";
import { Edge, useReactFlow } from "@xyflow/react";
import { DownloadIcon, PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
	const mutation = useMutation({
		mutationFn: UnpublishWorkflow,
		onSuccess: () => {
			toast.success("Workflow unpublished", { id: workflowId });
		},
		onError: () => {
			toast.error("Something went wrong", { id: workflowId });
		},
	});

	return (
		<Button
			variant={"outline"}
			className="flex items-center gap-2"
			disabled={mutation.isPending}
			onClick={() => {
				toast.loading("Unpublishing workflow...", { id: workflowId });
				mutation.mutate({
					id: workflowId,
				});
			}}
		>
			<DownloadIcon size={16} className="stroke-orange-400" />
			<p>Unpublish</p>
		</Button>
	);
}
