import { colorForHandle } from "@/app/workflow/_components/nodes/common";
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React from "react";

export function NodeOutputs({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-1 divide-y">{children}</div>;
}
export function NodeOutput({ output }: { output: TaskParam }) {
	return (
		<div className="relative flex justify-end bg-secondary px-2 py-1">
			<p className="text-xs text-muted-foreground">{output.name}</p>
			{!output.hideHandle && (
				<Handle
					id={output.name}
					type="source"
					position={Position.Right}
					className={cn(
						"!-right-2 !h-4 !w-4 !border-2 !border-background !bg-muted-foreground",
						colorForHandle[output.type]
					)}
				/>
			)}
		</div>
	);
}

export default NodeOutputs;
