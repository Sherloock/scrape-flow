import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { Env, ExecutionEnv } from "@/types/executor";

export async function PageToHtmlExecutor(
	env: ExecutionEnv<typeof PageToHtmlTask>
): Promise<boolean> {
	try {
		const html = await env.getPage()!.content();
		env.setOutput("Html", html);

		return true;
	} catch (error) {
		env.log.error(error instanceof Error ? error.message : "Unknown error");
		return false;
	}
}
