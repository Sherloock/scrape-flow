import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { createExecutor, IExecutor } from "./IExecutor";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

const executor: IExecutor<typeof LaunchBrowserTask> = {
	...createExecutor(LaunchBrowserTask),
	execute: async (
		env: ExecutionEnv<typeof LaunchBrowserTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			env.log.info("Launching browser with extra stealth");

			// Add stealth plugin and additional evasions
			puppeteer.use(StealthPlugin());

			const websiteUrl = env.getInput("Website URL");
			const browser = await puppeteer.launch({
				headless: false,
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
					"--disable-blink-features=AutomationControlled", // Additional stealth
					"--disable-dev-shm-usage", // Memory optimization
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

			// Enhanced user agent rotation
			const userAgents = [
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/121.0.0.0 Safari/537.36",
			];
			await page.setUserAgent(
				userAgents[Math.floor(Math.random() * userAgents.length)]
			);

			// Enhanced browser fingerprint evasion
			await page.evaluateOnNewDocument(() => {
				// Override permissions
				const originalQuery = window.navigator.permissions.query;
				window.navigator.permissions.query = (parameters: any): Promise<any> =>
					parameters.name === "notifications"
						? Promise.resolve({ state: Notification.permission })
						: originalQuery(parameters);

				// Fake plugins
				Object.defineProperty(navigator, "plugins", {
					get: () => [
						{
							0: { type: "application/x-google-chrome-pdf" },
							description: "Portable Document Format",
							filename: "internal-pdf-viewer",
							length: 1,
							name: "Chrome PDF Plugin",
						},
					],
				});

				// Modify WebGL vendor and renderer
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

				// Add language and webdriver attributes
				Object.defineProperty(navigator, "languages", {
					get: () => ["en-US", "en"],
				});
				Object.defineProperty(navigator, "webdriver", {
					get: () => false,
				});
			});

			// Random delay before navigation (1-3 seconds)
			await new Promise((resolve) =>
				setTimeout(resolve, 1000 + Math.random() * 2000)
			);

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
