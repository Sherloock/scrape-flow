import { colorForHandle } from '@/app/workflow/_components/nodes/common'
import NodeParamField from '@/app/workflow/_components/nodes/NodeParamField'
import { cn } from '@/lib/utils'
import { TaskParam } from '@/types/task'
import { Handle, Position } from '@xyflow/react'
import React from 'react'

export function NodeInputs({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex flex-col gap-2 divide-y'>
			{children}
		</div>
	)
}
export function NodeInput({ input, nodeId }: { input: TaskParam, nodeId: string }) {
	return (
		<div className='flex justify-start relative p-3 bg-secondary w-full'>
			<NodeParamField param={input} nodeId={nodeId} />
			{!input.hideHandle && <Handle id={input.name} type="target" position={Position.Left} className={cn('!bg-muted-foreground !border-background !border-2 !-left-2 !w-4 !h-4', colorForHandle[input.type])} />}
		</div>
	)
}

export default NodeInputs