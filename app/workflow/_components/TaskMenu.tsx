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
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
    </Button>
  );
}
