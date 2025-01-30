import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";

import { Edge, getIncomers } from "@xyflow/react";

export enum FlowToExecutionPlanValidationError {
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
  INVALID_INPUTS = "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }
  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();
  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = {
      phase,
      nodes: [],
    };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // node already planned
        continue;
      }

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        // node has invalid inputs
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all incoming edges are planned and there is invalid input, this means what workflow is not valid
          console.error(`Workflow is not valid!`);
          console.log({ currentNode, invalidInputs });
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          // If not all incoming edges are planned, we need to plan the incomers first
          continue;
        }
      }

      // All inputs are valid
      nextPhase.nodes.push(currentNode);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(
  node: AppNode,
  edges: Edge[],
  planned: Set<string>
): string[] {
  console.log({ node, edges, planned });
  const invalidInputs: string[] = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue: any = node.data.inputs[input.name];
    const inputValueProvided: boolean = inputValue?.length > 0;
    if (inputValueProvided) {
      continue;
    }

    // Check if the input is provided by an incoming edge
    const incomingEdges: Edge[] = edges.filter(
      (edge) => edge.target === node.id
    );
    const inputLinkedToOutput: Edge | undefined = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    // console.log({ inputLinkedToOutput });

    const requiredInputProvidedByVisitedOutput: boolean =
      !!input.required &&
      !!inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // the input is provided by an incoming edge and is required and the source node is already planned
      continue;
    } else if (!input.required) {
      // the input is not required and not provided by incoming edge
      if (!inputLinkedToOutput) {
        // the input is not provided by an incoming edge
        continue;
      }

      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // the input is provided by an incoming edge and the source node is already planned
        continue;
      }
    }

    // the input is required and not provided by an incoming edge
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}
