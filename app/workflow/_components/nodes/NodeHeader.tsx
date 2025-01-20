"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

function NodeHeader({
	taskType,
	nodeId,
}: {
	taskType: TaskType;
	nodeId: string;
}) {
	const task = TaskRegistry[taskType];

	const { deleteElements, getNode, addNodes } = useReactFlow();

	return (
		<div className='flex items-center gap-2 p-2'>
			<task.icon size={16} />
			<div className='flex w-full items-center justify-between'>
				<p className='text-sm font-bold uppercase text-muted-foreground'>
					{task.label}
				</p>
				<div className='flex items-center gap-1'>
					{task.isEntryPoint && <Badge className='gap-2'>Entry Point</Badge>}
					<Badge className='flex items-center gap-1 text-xs'>
						<CoinsIcon size={12} />
						{task.credits}
					</Badge>
					{!task.isEntryPoint && (
						<>
							<Button
								variant={"ghost"}
								size={"icon"}
								onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
							>
								<TrashIcon size={12} />
							</Button>
							<Button
								variant={"ghost"}
								size={"icon"}
								onClick={() => {
									const node = getNode(nodeId) as AppNode;
									const newNode = createFlowNode(node.data.type, {
										x: node.position.x /*+ (node.measured?.width ?? 0) + 20*/,
										y: node.position.y + (node.measured?.height ?? 0) + 20,
									});
									addNodes([newNode]);
								}}
							>
								<CopyIcon size={12} />
							</Button>
						</>
					)}
					<Button
						variant='ghost'
						size='icon'
						className='drag-handle cursor-grab'
					>
						<GripVerticalIcon size={20} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default NodeHeader;
