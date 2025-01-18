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
	useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
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
	// @settings
	const isRestoreViewport = useRef(false);
	// @end of settings

	// react flow
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const { setViewport } = useReactFlow();

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
				snapGrid={snapGrid}
				snapToGrid={true}
				fitViewOptions={fitViewOptions}
				fitView={!isRestoreViewport.current}
			>
				<Controls position="top-left" fitViewOptions={fitViewOptions} />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</main>
	);
}

export default FlowEditor;
