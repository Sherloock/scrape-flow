"use client";

import FlowEditor from "@/app/workflow/_components/FlowEditor";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import React from "react";

function Editor({ workflow }: { workflow: Workflow }) {
	return (
		<ReactFlowProvider>
			<div className="flex h-full w-full flex-col overflow-hidden">

				<Topbar title={'Workflow Editor'} subtitle={workflow.name} workflowId={workflow.id} />
				<section className="flex h-full overflow-auto">
					<FlowEditor workflow={workflow} />
				</section>
			</div>
		</ReactFlowProvider>
	);
}

export default Editor;
