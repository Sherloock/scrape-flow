import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import puppeteer from "puppeteer";

export async function LaunchBrowserExecutor(
	env: ExecutionEnv<typeof LaunchBrowserTask>
): Promise<boolean> {
	try {
		const websiteUrl = env.getInput("Website URL");
		const browser = await puppeteer.launch({
			headless: true,
		});

		env.log.info(`Launching browser for ${websiteUrl}`);
		env.setBrowser(browser);
		const page = await browser.newPage();
		await page.goto(websiteUrl);
		env.setPage(page);
		env.log.info(`Navigated to ${websiteUrl}`);

		return true;
	} catch (error) {
		env.log.error(error instanceof Error ? error.message : "Unknown error");
		return false;
	}
}
