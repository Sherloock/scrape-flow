import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
	Background,
	BackgroundVariant,
	Controls,
	Node,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";
import NodeComponent from "./nodes/NodeComponent";

const NodeTypes = {
	FlowScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
	// minZoom: 0.5,
	// maxZoom: 2,
	padding: 1,
};
function FlowEditor({ workflow }: { workflow: Workflow }) {
	const [nodes, setNodes, onNodesChange] = useNodesState([
		createFlowNode(TaskType.LAUNCH_BROWSER),
	]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={NodeTypes}
				snapGrid={snapGrid}
				snapToGrid={true}
				fitView={true}
				fitViewOptions={fitViewOptions}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
