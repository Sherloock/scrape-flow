import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { NavigateToUrlTask } from "@/lib/workflow/task/NavigateToUrl";

const executor: IExecutor<typeof NavigateToUrlTask> = {
	...createExecutor(NavigateToUrlTask),
	execute: async (
		env: ExecutionEnv<typeof NavigateToUrlTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const url = env.getInput("URL");
			await env.getPage()!.goto(url);
			// env.log.info(`Visited ${url}`);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const NavigateToUrlExecutor = executor.execute.bind(executor);
