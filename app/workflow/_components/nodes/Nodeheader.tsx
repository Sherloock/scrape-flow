"use client";

import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/types/task";
import React from "react";

function NodeHeader({ taskType }: { taskType: TaskType }) {
	const task = TaskRegistry[taskType];

	return (
		<div className="flex items-center gap-2 p-2">
			<task.icon size={16} />
		</div>
	);
}

export default NodeHeader;
