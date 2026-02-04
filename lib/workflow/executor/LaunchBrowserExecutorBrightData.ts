import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import puppeteer from "puppeteer";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof LaunchBrowserTask> = {
	...createExecutor(LaunchBrowserTask),
	execute: async (
		env: ExecutionEnv<typeof LaunchBrowserTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const browserWsEndpoint = process.env.BRIGHT_DATA_BROWSER_WS;
			if (!browserWsEndpoint) {
				env.log.error("BRIGHT_DATA_BROWSER_WS environment variable is required");
				return false;
			}

			env.log.info("Launching browser with bright data");

			const websiteUrl = env.getInput("Website URL");
			const browser = await puppeteer.connect({
				browserWSEndpoint: browserWsEndpoint,
			});

			// env.log.info(`Launching browser for ${websiteUrl}`);
			env.setBrowser(browser);
			const page = await browser.newPage();
			await page.setViewport({ width: 1920, height: 1080 });

			await page.goto(websiteUrl);
			env.setPage(page);
			// env.log.info(`Navigated to ${websiteUrl}`);

			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const LaunchBrowserExecutor = executor.execute.bind(executor);
