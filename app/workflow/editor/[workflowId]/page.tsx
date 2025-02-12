import { GetWorkflow } from "@/actions/workflows/GetWorkflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Editor from "../../_components/Editor";

export default async function page({
	params,
}: {
	params: { workflowId: string };
}) {
	const { workflowId } = params;
	const { userId } = auth();
	if (!userId) {
		redirect("/sign-in");
	}

	const workflow = await GetWorkflow(workflowId);

	if (!workflow) {
		return <div>Workflow not found</div>;
	}

	return <Editor workflow={workflow} />;
}
