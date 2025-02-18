import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";
import { ExecutionEnv } from "@/types/executor";

export async function WaitForElementExecutor(
	env: ExecutionEnv<typeof WaitForElementTask>
): Promise<boolean> {
	try {
		const selector = env.getInput("Selector");
		if (!selector) {
			env.log.error("input selector not defined");
			return false;
		}

		const visibility = env.getInput("Visibility");
		if (!visibility) {
			env.log.error("input visibility not defined");
			return false;
		}

		// TODO: add timeout
		// const timeout = env.getInput("Timeout");
		// if (!timeout) {
		// 	env.log.error("input timeout not defined");
		// 	return false;
		// }

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
}
