import DeletableEdge from "@/app/workflow/_components/edges/DeletableEdge";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
	addEdge,
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	Edge,
	Node,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import NodeComponent from "./nodes/NodeComponent";

const NodeTypes = {
	FlowScrapeNode: NodeComponent,
};

const EdgeTypes = {
	default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
	// minZoom: 0.5,
	// maxZoom: 2,
	padding: 1,
};
function FlowEditor({ workflow }: { workflow: Workflow }) {
	// @settings
	const isRestoreViewport = useRef(false);
	// @end of settings

	// react flow
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

	useEffect(() => {
		try {
			const workflowDefinition = JSON.parse(workflow.definition);
			setNodes(workflowDefinition.nodes || []);
			setEdges(workflowDefinition.edges || []);

			//  restore viewport
			if (isRestoreViewport.current) {
				if (!workflowDefinition.viewport) return;
				const { x = 0, y = 0, zoom = 1 } = workflowDefinition.viewport;
				setViewport({ x, y, zoom });
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to load workflow!', { id: 'load-workflow' });
		}
	}, [workflow.definition, setNodes, setEdges, setViewport]);


	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		const taskType = event.dataTransfer.getData("application/reactflow");
		if (!taskType) return;

		const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
		const newNode = createFlowNode(taskType as TaskType, position);
		setNodes((nds) => nds.concat(newNode));
	}, []);

	const onConnect = useCallback((connection: Connection) => {
		setEdges((eds) => addEdge({ ...connection, animated: true }, eds));

		if (!connection.targetHandle) return;
		const node = nodes.find((n) => n.id === connection.target);
		if (!node) return;
		const nodeInputs = node.data.inputs;
		updateNodeData(node.id, {
			inputs: {
				...nodeInputs,
				[connection.targetHandle]: "",
			},
		});
	}, [setEdges, updateNodeData, nodes]);

	return (
		<main className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={(changes) => {
					onNodesChange(changes);

					// TODO: Save workflow on nodes change // AUTOSAVE FEATURE
					// toast.success('Workflow saved!', { id: 'save-workflow' });
				}}
				onEdgesChange={onEdgesChange}
				nodeTypes={NodeTypes}
				edgeTypes={EdgeTypes}
				snapGrid={snapGrid}
				snapToGrid={true}
				fitViewOptions={fitViewOptions}
				fitView={!isRestoreViewport.current}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onConnect={onConnect}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
