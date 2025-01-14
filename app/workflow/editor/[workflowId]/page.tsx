import { getWorkflow } from "@/actions/workflows/getWorkflow";
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

	// await waitFor(10000);

	const workflow = await getWorkflow(workflowId);

	if (!workflow) {
		return <div>Workflow not found</div>;
	}

	return <Editor workflow={workflow} />;
}
