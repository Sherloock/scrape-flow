"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/types/task";
import React from "react";

function TaskMenu() {
	return (
		<aside className="h-full w-[340px] min-w-[340px] max-w-[340px] border-separate overflow-auto border-r-2 p-2 px-4">
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={["extraction"]}
			>
				<AccordionItem value="extraction">
					<AccordionTrigger className="font-bold">
						Data Extraction
					</AccordionTrigger>
					<AccordionContent>
						<TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
						<TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	);
}

export default TaskMenu;

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
	const task = TaskRegistry[taskType];

	const onDragStart = (e: React.DragEvent, taskType: TaskType) => {
		e.dataTransfer.setData("application/reactflow", taskType);
		e.dataTransfer.effectAllowed = "move";
	};

	return (
		<Button
			variant={"secondary"}
			className="flex w-full items-center justify-between gap-2 border"
			draggable
			onDragStart={(e) => {
				onDragStart(e, taskType);
			}}
		>
			<div className="flex items-center gap-2">
				<task.icon size={20} />
				{task.label}
			</div>
		</Button>
	);
}
