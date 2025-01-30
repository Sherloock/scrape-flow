"use client";

import FlowEditor from "@/app/workflow/_components/FlowEditor";
import TaskMenu from "@/app/workflow/_components/TaskMenu";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import React from "react";

function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <Topbar
            title={"Workflow Editor"}
            subtitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
