import { AiApi, AiModels } from "@/types/ai";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAiTask = {
	type: TaskType.EXTRACT_DATA_WITH_AI,
	label: "Extract data with AI",
	icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,

	isEntryPoint: false,
	credits: 4,
	inputs: [
		{
			name: "Content",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "API",
			type: TaskParamType.SELECT,
			required: true,
			options: [
				{ label: AiModels[AiApi.BUILT_IN].label, value: AiApi.BUILT_IN },
				{ label: AiModels[AiApi.GOOGLE].label, value: AiApi.GOOGLE },
				{ label: AiModels[AiApi.OPENAI].label, value: AiApi.OPENAI },
			],
			defaultValue: AiApi.BUILT_IN,
		},
		{
			name: "API Key",
			type: TaskParamType.CREDENTIAL,
			required: false,
		},
		{
			name: "Prompt",
			type: TaskParamType.STRING,
			required: true,
			variant: "textarea",
			helperText: "e.g. Name, age, and email of the person",
		},
		{
			name: "Format of extracted data",
			type: TaskParamType.STRING,
			required: false,
			// variant: "textarea",
			helperText: "e.g. JSON array, comma separated csv",
			defaultValue: "JSON array",
		},
	] as const,
	outputs: [
		{
			name: "Extracted data",
			type: TaskParamType.STRING,
		},
	] as const,
} satisfies WorkflowTask;
