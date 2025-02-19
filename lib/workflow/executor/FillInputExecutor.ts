import { FillInputTask } from "@/lib/workflow/task/FillInput";
import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof FillInputTask> = {
	...createExecutor(FillInputTask),
	execute: async (
		env: ExecutionEnv<typeof FillInputTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const selector = env.getInput("Input selector");
			const value = env.getInput("Input value");

			await env.getPage()!.type(selector, value);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const FillInputExecutor = executor.execute.bind(executor);
