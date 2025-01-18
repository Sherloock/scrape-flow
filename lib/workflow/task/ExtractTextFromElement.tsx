import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, LucideProps } from "lucide-react";

export const ExtractTextFromElementTask = {
	type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
	label: "Extract text from element",
	icon: (props: LucideProps) => (
		<CodeIcon className="stroke-rose-400" {...props} />
	),

	isEntryPoint: false,
	inputs: [
		{
			name: "Html",
			type: TaskParamType.STRING,
			required: true,
			variant: "textarea"
		},
		{
			name: "Selector",
			type: TaskParamType.STRING,
			required: true,
		},
	],
	outputs: [
		{
			name: "Extracted text",
			type: TaskParamType.STRING,
		},
	],
};
