import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Edit3Icon } from "lucide-react";

export const FillCredentialTask = {
	type: TaskType.FILL_CREDENTIAL,
	label: "Fill Credential",
	icon: (props) => <Edit3Icon className="stroke-orange-400" {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INSTANCE,
			required: true,
		},
		{
			name: "Input selector",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "Credential",
			type: TaskParamType.CREDENTIAL,
			required: true,
		},
	] as const,
	outputs: [
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INSTANCE,
		},
	] as const,
} satisfies WorkflowTask;
