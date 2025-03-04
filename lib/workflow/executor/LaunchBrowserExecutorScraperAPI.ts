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

			const websiteUrl = env.getInput("Website URL");
			const scraperApiKey = process.env.SCRAPER_API_KEY!;

			if (!scraperApiKey) {
				env.log.error("ScraperAPI Key is required");
				return false;
			}

			env.log.info("Launching browser with ScraperAPI proxy");

			// Launch a local browser instance
			const browser = await puppeteer.launch({
				headless: true,
				args: [
					// Use ScraperAPI as a proxy
					`--proxy-server=proxy-server.scraperapi.com:8001`,
				],
			});

			env.setBrowser(browser);
			const page = await browser.newPage();

			// Authenticate with the proxy
			await page.authenticate({
				username: "scraperapi",
				password: scraperApiKey,
			});

			await page.setViewport({ width: 1920, height: 1080 });

			// Set a reasonable timeout
			page.setDefaultNavigationTimeout(70000);

			// Add additional headers if needed
			await page.setExtraHTTPHeaders({
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			});

			await page.goto(websiteUrl);
			env.setPage(page);

			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const LaunchBrowserExecutor = executor.execute.bind(executor);
