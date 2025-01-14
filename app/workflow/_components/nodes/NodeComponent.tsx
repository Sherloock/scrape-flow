import { AppNodeData } from "@/types/appNode";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import Nodeheader from "./Nodeheader";

const NodeComponent = memo((props: NodeProps) => {
	const nodeData = props.data as AppNodeData;
	return (
		<NodeCard nodeId={props.id} isSelected={!!props.selected}>
			<Nodeheader />
		</NodeCard>
	);
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";
