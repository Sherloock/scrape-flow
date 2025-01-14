"use client";

import { cn } from "@/lib/utils";
import { NodeProps, useReactFlow } from "@xyflow/react";

export default function NodeCard({
	children,
	nodeId,
	isSelected,
}: {
	children: React.ReactNode;
	nodeId: string;
	isSelected: boolean;
}) {
	const { getNode, setCenter } = useReactFlow();

	return (
		<div
			onDoubleClick={() => {
				// center the node on the screen
				const node = getNode(nodeId);
				if (!node) return;
				const { position, measured } = node;
				if (!measured || !position) return;
				const { width, height } = measured;
				if (!width || !height) return;
				const x = position.x + width / 2;
				const y = position.y + height / 2;
				if (x === undefined || y === undefined) return;
				setCenter(x, y, { zoom: 1, duration: 500 });
			}}
			className={cn(
				"flex w-[420px] border-separate cursor-pointer flex-col gap-1 rounded-md border-2 bg-background text-sm",
				isSelected && "border-primary"
			)}
		>
			{children}
		</div>
	);
}
