import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { ScrollToElementTask } from "@/lib/workflow/task/ScrollToElement";
import { waitFor } from "@/lib/helper/waitFor";

const executor: IExecutor<typeof ScrollToElementTask> = {
	...createExecutor(ScrollToElementTask),
	execute: async (
		env: ExecutionEnv<typeof ScrollToElementTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const element = env.getInput("Element");
			await env.getPage()!.evaluate((selector: string) => {
				const element = document.querySelector(selector);
				if (!element) {
					throw new Error(`Element "${selector}" not found`);
				}
				const top = element.getBoundingClientRect().top;

				window.scrollTo({ top, behavior: "instant" });
			}, element);
			env.log.info(`Scrolled to element "${element}"`);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const ScrollToElementExecutor = executor.execute.bind(executor);
