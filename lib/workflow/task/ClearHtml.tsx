import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileX } from "lucide-react";

export const ClearHtmlTask = {
	type: TaskType.CLEAR_HTML,
	label: "Clear HTML",
	icon: (props) => <FileX className="stroke-rose-400" {...props} />,
	isEntryPoint: false,
	credits: 1,
	inputs: [
		{
			name: "HTML",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "remove <head> tag",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove <script> tag",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove <style> tag",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove <link> tag",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove <meta> tag",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove 'class' attribute",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove 'style' attribute",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove comments",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove data-* attributes",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove empty attributes",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "remove inline events",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "minify HTML",
			type: TaskParamType.BOOLEAN,
			defaultValue: "0",
		},
		{
			name: "remove hidden elements",
			type: TaskParamType.BOOLEAN,
			defaultValue: "0",
		},
		{
			name: "remove empty elements",
			type: TaskParamType.BOOLEAN,
			defaultValue: "1",
		},
		{
			name: "keep only main content",
			type: TaskParamType.BOOLEAN,
			defaultValue: "0",
		},
	] as const,
	outputs: [
		{
			name: "Cleared HTML",
			type: TaskParamType.STRING,
		},
	] as const,
} satisfies WorkflowTask;
