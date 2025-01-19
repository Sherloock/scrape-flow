import { TaskParam, TaskType } from "@/types/task";
import { LucideProps } from "lucide-react";

export enum WorkflowStatus {
	DRAFT = "DRAFT",
	PUBLISHED = "PUBLISHED",
	// ARCHIVED = 'ARCHIVED',
}

export type WorkflowTask = {
	label: string;
	icon: React.FC<LucideProps>;
	type: TaskType;
	isEntryPoint?: boolean;
	inputs: TaskParam[];
	outputs: TaskParam[];
	credits: number;
};
