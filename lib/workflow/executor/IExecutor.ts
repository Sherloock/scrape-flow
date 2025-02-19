import { ExecutionEnv } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";

export interface IExecutor<T extends WorkflowTask> {
	execute(env: ExecutionEnv<T>): Promise<boolean>;
	validateRequiredInputs(env: ExecutionEnv<T>): boolean;
}

export function createExecutor<T extends WorkflowTask>(task: T): IExecutor<T> {
	return {
		execute: async (_env: ExecutionEnv<T>): Promise<boolean> => {
			throw new Error("Execute method not implemented");
		},
		validateRequiredInputs: (env: ExecutionEnv<T>): boolean => {
			const requiredInputs = task.inputs.filter(
				(input) =>
					input.required && input.type !== TaskParamType.BROWSER_INSTANCE
			);
			for (const input of requiredInputs) {
				const value = env.getInput(input.name);
				if (!value) {
					env.log.error(`Required input ${input.name} not defined`);
					return false;
				}
			}
			return true;
		},
	};
}
