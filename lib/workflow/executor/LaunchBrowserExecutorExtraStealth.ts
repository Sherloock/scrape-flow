import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { createExecutor, IExecutor } from "./IExecutor";
import puppeteer from "puppeteer-extra";
import type { Page, Browser } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
const BD_PROXY_URL =
	"***REMOVED***";

const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function setupPageBasics(page: Page) {
	await Promise.all([
		page.setUserAgent(USER_AGENT),
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
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		}),
	]);
}

async function injectAntiDetection(page: Page) {
	await page.evaluateOnNewDocument(() => {
		// Remove webdriver flag
		delete Object.getPrototypeOf(navigator).webdriver;

		// Define a mock Plugin object
		class MockPlugin {
			constructor(
				public name: string,
				public filename: string
			) {}
		}

		// Define a mock PluginArray object
		class MockPluginArray {
			private plugins: MockPlugin[];

			constructor(plugins: MockPlugin[]) {
				this.plugins = plugins;
			}

			get length(): number {
				return this.plugins.length;
			}

			item(index: number): MockPlugin | null {
				return this.plugins[index] || null;
			}

			namedItem(name: string): MockPlugin | null {
				return this.plugins.find((plugin) => plugin.name === name) || null;
			}

			refresh(): void {
				// No-op
			}

			*[Symbol.iterator](): IterableIterator<MockPlugin> {
				for (const plugin of this.plugins) {
					yield plugin;
				}
			}
		}

		// Create mock plugins
		const mockPlugins = [
			new MockPlugin("Chrome PDF Plugin", "internal-pdf-viewer"),
			new MockPlugin("Chrome PDF Viewer", "chrome-pdf-viewer"),
			new MockPlugin("Native Client", "native-client"),
			new MockPlugin("Widevine Content Decryption Module", "widevinecdm"),
			new MockPlugin("Microsoft Edge PDF Plugin", "edge-pdf-viewer"),
		];

		// Mock navigator.plugins
		Object.defineProperty(navigator, "plugins", {
			value: new MockPluginArray(mockPlugins),
			enumerable: true,
			configurable: false,
			writable: false,
		});
	});
}
const executor: IExecutor<typeof LaunchBrowserTask> = {
	...createExecutor(LaunchBrowserTask),
	execute: async (
		env: ExecutionEnv<typeof LaunchBrowserTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			env.log.info("Launching browser with enhanced stealth and proxy");
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
					"--disable-gpu",
					"--hide-scrollbars",
					"--disable-notifications",
					"--disable-popup-blocking",
					"--ignore-certificate-errors",
					`--proxy-server=${BD_PROXY_URL}`,
				],
				ignoreDefaultArgs: ["--enable-automation"],
			});

			env.setBrowser(browser);
			const page = await browser.newPage();

			// Authenticate with the proxy
			await page.authenticate({
				username: "brd-customer-hl_3f327964-zone-scrapeflow",
				password: "h9bvimm12ary",
			});

			await setupPageBasics(page);
			await injectAntiDetection(page);

			// Add proxy check before proceeding
			try {
				await page.goto("https://lumtest.com/myip.json", {
					waitUntil: "networkidle2",
					timeout: 30000,
				});
				env.log.info("Proxy connection successful");
			} catch (error) {
				env.log.error("Proxy connection failed");
				throw new Error("Failed to establish proxy connection");
			}

			// Navigate to website
			const websiteUrl = env.getInput("Website URL");
			await page.goto(websiteUrl, {
				waitUntil: "networkidle2",
				timeout: 60000,
			});

			// Add randomized delay
			const delay = 1000 + Math.floor(Math.random() * 3000);
			await new Promise((r) => setTimeout(r, delay));

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
