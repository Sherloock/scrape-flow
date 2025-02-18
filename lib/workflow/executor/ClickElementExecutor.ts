import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { ExecutionEnv } from "@/types/executor";

export async function ClickElementExecutor(
	env: ExecutionEnv<typeof ClickElementTask>
): Promise<boolean> {
	try {
		const selector = env.getInput("Selector");
		if (!selector) {
			env.log.error("input selector not defined");
			return false;
		}

		// TODO: ADD MORE FUNCTIOANLITIES TO THIS TASK AS NEEDED (CLICK OPTIONS)
		await env.getPage()!.click(selector);
		return true;
	} catch (error) {
		env.log.error(error instanceof Error ? error.message : "Unknown error");
		return false;
	}
}
