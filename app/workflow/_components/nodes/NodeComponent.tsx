import NodeCard from "@/app/workflow/_components/nodes/NodeCard";
import NodeHeader from "@/app/workflow/_components/nodes/NodeHeader";
import { NodeInput, NodeInputs } from "@/app/workflow/_components/nodes/NodeInputs";
import { NodeOutput, NodeOutputs } from "@/app/workflow/_components/nodes/NodeOutputs";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { AppNodeData } from "@/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";

const NodeComponent = memo((props: NodeProps) => {
	const nodeData = props.data as AppNodeData;
	const task = TaskRegistry[nodeData.type];
	return (
		<NodeCard nodeId={props.id} isSelected={!!props.selected}>
			<NodeHeader taskType={nodeData.type} />
			<NodeInputs  >
				{task.inputs.map((input) => (
					<NodeInput key={input.name} input={input} nodeId={props.id} />
				))}

			</NodeInputs>

			<NodeOutputs  >
				{task.outputs.map((output) => (
					<NodeOutput key={output.name} output={output} nodeId={props.id} />
				))}

			</NodeOutputs>
		</NodeCard>
	);
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";
