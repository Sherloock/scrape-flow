import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof ClickElementTask> = {
	...createExecutor(ClickElementTask),
	execute: async (
		env: ExecutionEnv<typeof ClickElementTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const selector = env.getInput("Selector");
			await env.getPage()!.click(selector);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const ClickElementExecutor = executor.execute.bind(executor);
