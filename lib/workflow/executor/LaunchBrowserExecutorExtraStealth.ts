import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
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

			// Dynamic imports for server-side compatibility
			const puppeteer = (await import("puppeteer-extra")).default;
			const StealthPlugin = (await import("puppeteer-extra-plugin-stealth"))
				.default;

			// Add stealth plugin
			puppeteer.use(StealthPlugin());

			const websiteUrl = env.getInput("Website URL");
			const browser = await puppeteer.launch({
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-infobars",
					"--window-position=0,0",
					"--ignore-certifcate-errors",
					"--ignore-certifcate-errors-spki-list",
					"--disable-accelerated-2d-canvas",
					"--disable-gpu",
					"--hide-scrollbars",
					"--disable-notifications",
					"--disable-extensions",
					"--force-device-scale-factor=1",
				],
				// @ts-ignore
				ignoreHTTPSErrors: true,
			});

			env.setBrowser(browser);
			const page = await browser.newPage();

			// Set common viewport
			await page.setViewport({
				width: 1920,
				height: 1080,
				deviceScaleFactor: 1,
			});

			// Set user agent
			await page.setUserAgent(
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
			);

			// Set extra headers to appear more browser-like
			await page.setExtraHTTPHeaders({
				"Accept-Language": "en-US,en;q=0.9",
				"Accept-Encoding": "gzip, deflate, br",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
				"Upgrade-Insecure-Requests": "1",
				Connection: "keep-alive",
			});

			// Modify WebGL vendor and renderer
			await page.evaluateOnNewDocument(() => {
				const getParameter = WebGLRenderingContext.prototype.getParameter;
				WebGLRenderingContext.prototype.getParameter = function (parameter) {
					if (parameter === 37445) {
						return "Intel Inc.";
					}
					if (parameter === 37446) {
						return "Intel Iris OpenGL Engine";
					}
					return getParameter.apply(this, [parameter]);
				};
			});

			// Add language and webdriver attributes
			await page.evaluateOnNewDocument(() => {
				Object.defineProperty(navigator, "languages", {
					get: () => ["en-US", "en"],
				});
				Object.defineProperty(navigator, "webdriver", {
					get: () => false,
				});
			});

			await page.goto(websiteUrl, {
				waitUntil: "networkidle0",
				timeout: 30000,
			});

			env.setPage(page);

			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const LaunchBrowserExecutor = executor.execute.bind(executor);
