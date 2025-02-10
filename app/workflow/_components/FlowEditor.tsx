import DeletableEdge from "@/app/workflow/_components/edges/DeletableEdge";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
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
	getOutgoers,
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
			toast.error("Failed to load workflow!", { id: "load-workflow" });
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

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});
		const newNode = createFlowNode(taskType as TaskType, position);
		setNodes((nds) => nds.concat(newNode));
	}, []);

	const onConnect = useCallback(
		(connection: Connection) => {
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
		},
		[setEdges, updateNodeData, nodes]
	);

	const isValidConnection = useCallback(
		(connection: Edge | Connection) => {
			// No connection to the same node
			if (connection.source === connection.target) return false;

			// Same taskParam type
			const sourceNode = nodes.find((n) => n.id === connection.source);
			const targetNode = nodes.find((n) => n.id === connection.target);
			if (!sourceNode || !targetNode) {
				console.error("No source or target node");
				return false;
			}
			const sourceTask = TaskRegistry[sourceNode.data.type];
			const targetTask = TaskRegistry[targetNode.data.type];

			const output = sourceTask.outputs.find(
				(o) => o.name === connection.sourceHandle
			);
			const input = targetTask.inputs.find(
				(i) => i.name === connection.targetHandle
			);
			// console.log({ output, input });
			if (!output || !input) {
				console.error("No output or input found");
				return false;
			}
			if (output.type !== input.type) {
				console.error("Output type does not match input type");
				return false;
			}

			// loop detection
			const hasCycle = (node: Node, visited = new Set()) => {
				if (visited.has(node.id)) return false;

				visited.add(node.id);

				for (const outgoer of getOutgoers(node, nodes, edges)) {
					if (outgoer.id === connection.source) return true;
					if (hasCycle(outgoer, visited)) return true;
				}
			};

			return !hasCycle(targetNode);
		},
		[nodes, edges]
	);

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
				isValidConnection={isValidConnection}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
