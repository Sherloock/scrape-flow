import { colorForHandle } from '@/app/workflow/_components/nodes/common'
import NodeParamField from '@/app/workflow/_components/nodes/NodeParamField'
import { cn } from '@/lib/utils'
import { TaskParam } from '@/types/task'
import { Handle, Position } from '@xyflow/react'
import React from 'react'

export function NodeOutputs({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex flex-col gap-1 divide-y'>
			{children}
		</div>
	)
}
export function NodeOutput({ output, nodeId }: { output: TaskParam, nodeId: string }) {
	return (
		<div className='flex justify-end relative p-3 bg-secondary'>
			<p className="text-xs text-muted-foreground">{output.name}</p>
			{!output.hideHandle && <Handle id={output.name} type="source" position={Position.Right} className={cn('!bg-muted-foreground !border-background !border-2 !-right-2 !w-4 !h-4', colorForHandle[output.type])} />}
		</div>
	)
}

export default NodeOutputs