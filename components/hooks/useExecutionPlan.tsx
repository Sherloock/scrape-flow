import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { Edge, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useExecutionPlan = () => {
	const { toObject } = useReactFlow();

	const generateExecutionPlan = useCallback(() => {
		const { nodes, edges } = toObject();
		const result = FlowToExecutionPlan(nodes as AppNode[], edges as Edge[]);
		return result;
	}, [toObject]);

	return generateExecutionPlan;
};

export default useExecutionPlan;
