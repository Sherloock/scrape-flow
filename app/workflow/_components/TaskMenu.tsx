"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/types/task";
import { CoinsIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React, { useState } from "react";

function TaskMenu() {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<aside
			className={`relative border-r-2 transition-all duration-300 ${
				isCollapsed
					? "w-[40px] min-w-[40px]"
					: "w-[340px] min-w-[340px] max-w-[340px]"
			}`}
		>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-0 top-0 z-10 shadow-md transition-all hover:scale-105 hover:bg-primary/90"
				onClick={() => setIsCollapsed(!isCollapsed)}
			>
				{isCollapsed ? (
					<PanelLeftOpen size={20} />
				) : (
					<PanelLeftClose size={20} />
				)}
			</Button>

			<div
				className={`h-full overflow-auto p-2 px-4 ${isCollapsed ? "hidden" : "block"}`}
			>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={[
						"interaction",
						"extraction",
						"storage",
						"timing",
						"results",
					]}
				>
					<AccordionItem value="interaction">
						<AccordionTrigger className="font-bold">
							User Interaction
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-1">
							<TaskMenuBtn taskType={TaskType.NAVIGATE_TO_URL} />
							<TaskMenuBtn taskType={TaskType.FILL_INPUT} />
							<TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
							<TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="extraction">
						<AccordionTrigger className="font-bold">
							Data Extraction
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-1">
							<TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
							<TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
							<TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="storage">
						<AccordionTrigger className="font-bold">
							Data Storage
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-1">
							<TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
							<TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="timing">
						<AccordionTrigger className="font-bold">
							Timing controls
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-1">
							<TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
							{/* todo: add delay task */}
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="results">
						<AccordionTrigger className="font-bold">
							Results delivery
						</AccordionTrigger>
						<AccordionContent className="flex flex-col gap-1">
							<TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
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

			<Badge variant={"outline"} className="flex items-center gap-2">
				<CoinsIcon size={16} />
				{task.credits}
			</Badge>
		</Button>
	);
}
