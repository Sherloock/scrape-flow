import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof PageToHtmlTask> = {
	...createExecutor(PageToHtmlTask),
	execute: async (
		env: ExecutionEnv<typeof PageToHtmlTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const html = await env.getPage()!.content();
			env.setOutput("Html", html);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const PageToHtmlExecutor = executor.execute.bind(executor);
