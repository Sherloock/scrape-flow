import useFlowValidation from "@/components/hooks/useFlowValidation";
import {
	FlowToExecutionPlan,
	FlowToExecutionPlanValidationError,
} from "@/lib/workflow/ExecutionPlan";
import { AppNode } from "@/types/appNode";
import { Edge, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

const useExecutionPlan = () => {
	const { toObject } = useReactFlow();
	const { setInvalidInputs, clearErrors } = useFlowValidation();

	const handleError = useCallback(
		(error: any) => {
			switch (error.type) {
				case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
					toast.error("No entry point found");
					break;
				case FlowToExecutionPlanValidationError.INVALID_INPUTS:
					toast.error("Not all inputs are valid");
					setInvalidInputs(error.invalidElements);
					break;
				default:
					toast.error("Unknown error");
					break;
			}
		},
		[setInvalidInputs]
	);

	const generateExecutionPlan = useCallback(() => {
		const { nodes, edges } = toObject();
		const { executionPlan, error } = FlowToExecutionPlan(
			nodes as AppNode[],
			edges
		);
		if (error) {
			handleError(error);
			return null;
		}
		clearErrors();
		return executionPlan;
	}, [toObject, handleError, clearErrors]);

	return generateExecutionPlan;
};

export default useExecutionPlan;
