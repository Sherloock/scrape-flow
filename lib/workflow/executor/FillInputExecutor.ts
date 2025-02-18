import { FillInputTask } from "@/lib/workflow/task/FillInput";
import { ExecutionEnv } from "@/types/executor";

export async function FillInputExecutor(
	env: ExecutionEnv<typeof FillInputTask>
): Promise<boolean> {
	try {
		const selector = env.getInput("Input selector");
		if (!selector) {
			env.log.error("input selector not defined");
			return false;
		}

		const value = env.getInput("Input value");
		if (!value) {
			env.log.error("input value not defined");
			return false;
		}

		await env.getPage()!.type(selector, value);
		return true;
	} catch (error) {
		env.log.error(error instanceof Error ? error.message : "Unknown error");
		return false;
	}
}
