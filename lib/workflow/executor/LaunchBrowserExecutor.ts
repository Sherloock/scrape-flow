import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import puppeteer from "puppeteer";

export async function LaunchBrowserExecutor(
	env: ExecutionEnv<typeof LaunchBrowserTask>
): Promise<boolean> {
	try {
		const websiteUrl = env.getInput("Website URL");
		const browser = await puppeteer.launch({
			headless: false,
		});

		env.setBrowser(browser);
		const page = await browser.newPage();
		await page.goto(websiteUrl);
		env.setPage(page);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
