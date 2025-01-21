"use client";

import { Button } from "@/components/ui/button";
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
	getSmoothStepPath,
	Handle,
	Position,
	useReactFlow,
} from "@xyflow/react";
import { Trash2Icon } from "lucide-react";
import React from "react";

export default function DeletableEdge(props: EdgeProps) {
	const [edgePath, labelX, labelY] = getSmoothStepPath(props);
	const { setEdges } = useReactFlow();

	return (
		<>
			<BaseEdge
				path={edgePath}
				markerEnd={props.markerEnd}
				style={props.style}
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
						pointerEvents: "all",
					}}
				>
					<Button
						className="size-10 cursor-pointer rounded-full border text-xs leading-none hover:shadow-lg"
						variant="outline"
						size="icon"
						onClick={() => {
							setEdges((eds) => eds.filter((e) => e.id !== props.id));
						}}
					>
						<Trash2Icon
							size={20}
							className="stroke-red-500 text-muted-foreground"
						/>
					</Button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
