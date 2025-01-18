"use client";

import BrowserInstanceParam from '@/app/workflow/_components/nodes/param/BrowserInstanceParam';
import StringParam from '@/app/workflow/_components/nodes/param/StringParam';
import { AppNode } from '@/types/appNode';
import { TaskParam, TaskParamType } from '@/types/task';
import { useReactFlow } from '@xyflow/react';
import React, { useCallback } from 'react';

function NodeParamField({ param, nodeId }: { param: TaskParam, nodeId: string }) {
	const { updateNodeData, getNode } = useReactFlow();
	const node = getNode(nodeId) as AppNode;
	const value = node?.data.inputs?.[param.name];

	const updateNodeParamValue = useCallback((newValue: string) => {
		updateNodeData(nodeId, {
			// ...node.data,
			inputs: {
				...node?.data.inputs,
				[param.name]: newValue
			}
		})
	}, [nodeId, param.name, updateNodeData, node?.data.inputs]);

	switch (param.type) {
		case TaskParamType.STRING:
			return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} />

		case TaskParamType.BROWSER_INSTANCE:
			return <BrowserInstanceParam param={param} value={""} updateNodeParamValue={updateNodeParamValue} />

		default:
			return <div className='w-full'>
				<p className="text-xs text-muted-foreground">Not implemented</p>
			</div>
	}
}

export default NodeParamField