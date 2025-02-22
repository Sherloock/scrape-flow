import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { createExecutor, IExecutor } from "./IExecutor";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
const BD_PROXY_URL =
	"***REMOVED***";

const executor: IExecutor<typeof LaunchBrowserTask> = {
	...createExecutor(LaunchBrowserTask),
	execute: async (
		env: ExecutionEnv<typeof LaunchBrowserTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			env.log.info("Launching browser with enhanced stealth");
			puppeteer.use(StealthPlugin());

			const browser = await puppeteer.launch({
				headless:
					process.env.DEV_TEST_EXECUTION_HEADLESS === "1" ? false : true,
				defaultViewport: null,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--start-maximized",
					"--disable-blink-features=AutomationControlled",
					"--disable-features=IsolateOrigins,site-per-process",
					"--disable-web-security",
				],
			});

			env.setBrowser(browser);
			const page = await browser.newPage();

			// Configure basic stealth settings
			await Promise.all([
				page.setUserAgent(
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
				),
				page.setViewport({
					width: 1920,
					height: 1080,
					deviceScaleFactor: 1,
					hasTouch: false,
					isLandscape: true,
					isMobile: false,
				}),
				page.setExtraHTTPHeaders({
					"Accept-Language": "en-US,en;q=0.9",
					Accept:
						"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				}),
			]);

			// Basic anti-detection script
			await page.evaluateOnNewDocument(() => {
				Object.defineProperty(navigator, "webdriver", { get: () => undefined });
				Object.defineProperty(navigator, "plugins", {
					get: () => [1, 2, 3, 4, 5],
				});
			});

			// Navigate to website
			const websiteUrl = env.getInput("Website URL");
			await page.goto(websiteUrl, { waitUntil: "networkidle2" });

			// Add small random delay
			await new Promise((r) => setTimeout(r, 1000 + Math.random() * 2000));

			env.setPage(page);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			const browser = env.getBrowser();
			if (browser) await browser.close().catch(() => {});
			return false;
		}
	},
};

export const LaunchBrowserExecutor = executor.execute.bind(executor);
