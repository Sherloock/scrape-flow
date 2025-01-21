"use client";

import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { Edge, useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React from "react";

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
	const generateExecutionPlan = useExecutionPlan();

	return (
		<Button
			onClick={() => {
				const plan = generateExecutionPlan();
				console.table(plan);
			}}
		>
			<PlayIcon size={16} className="" />
			<p>Execute</p>
		</Button>
	);
}
