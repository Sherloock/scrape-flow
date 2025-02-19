import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";
import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof WaitForElementTask> = {
	...createExecutor(WaitForElementTask),
	execute: async (
		env: ExecutionEnv<typeof WaitForElementTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const selector = env.getInput("Selector");
			const visibility = env.getInput("Visibility");

			await env.getPage()!.waitForSelector(selector, {
				visible: visibility === "visible",
				hidden: visibility === "hidden",
			});

			env.log.info(`Element ${selector} become ${visibility}`);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const WaitForElementExecutor = executor.execute.bind(executor);
