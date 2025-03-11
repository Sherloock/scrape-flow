import { ExecutionEnv } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { createExecutor, IExecutor } from "./IExecutor";
import puppeteer from "puppeteer-extra";
import type { Page, Browser } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
// const BD_PROXY_URL =	"***REMOVED***";

// ScraperAPI proxy configuration
const SCRAPER_API_PROXY = {
	host: "proxy-server.scraperapi.com",
	port: 8001,
	username: "scraperapi.output_format=json.autoparse=true",
	password: "***REMOVED***",
};

const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

// More diverse user agents
const USER_AGENTS = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
];

const getRandomUserAgent = () =>
	USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Add a delay helper function
async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupPageBasics(page: Page) {
	const userAgent = getRandomUserAgent();

	// Randomize viewport size slightly to avoid fingerprinting
	const width = 1920 + Math.floor(Math.random() * 100);
	const height = 1080 + Math.floor(Math.random() * 100);

	await Promise.all([
		page.setUserAgent(userAgent),
		page.setViewport({
			width,
			height,
			deviceScaleFactor: 1,
			hasTouch: false,
			isLandscape: true,
			isMobile: false,
		}),
		page.setExtraHTTPHeaders({
			"Accept-Language": "en-US,en;q=0.9",
			Accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"sec-ch-ua": `"Not.A/Brand";v="8", "Chromium";v="${Math.floor(Math.random() * 5) + 120}"`,
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": userAgent.includes("Windows")
				? "Windows"
				: userAgent.includes("Mac")
					? "macOS"
					: "Linux",
			"Upgrade-Insecure-Requests": "1",
			"Sec-Fetch-Dest": "document",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-Site": "none",
			"Sec-Fetch-User": "?1",
			"Cache-Control": "max-age=0",
		}),
	]);
}

async function injectAntiDetection(page: Page) {
	await page.evaluateOnNewDocument(() => {
		// Remove webdriver flag
		delete Object.getPrototypeOf(navigator).webdriver;

		// Override property descriptors to prevent detection
		const originalQuery = window.navigator.permissions.query;
		// @ts-ignore - Intentionally overriding permissions API
		window.navigator.permissions.query = function (
			parameters: PermissionDescriptor
		): Promise<PermissionStatus> {
			if (parameters.name === "notifications") {
				return Promise.resolve({
					state: Notification.permission,
					name: parameters.name,
					onchange: null,
					addEventListener: function () {},
					removeEventListener: function () {},
					dispatchEvent: function () {
						return true;
					},
				} as PermissionStatus);
			}
			return originalQuery.call(this, parameters);
		};

		// Override navigator properties with realistic values
		const navigatorProps = {
			languages: ["en-US", "en"],
			deviceMemory: 8,
			hardwareConcurrency: 8,
			platform: "Win32",
			userAgentData: {
				brands: [
					{ brand: "Chromium", version: "123" },
					{ brand: "Google Chrome", version: "123" },
					{ brand: "Not:A-Brand", version: "8" },
				],
				mobile: false,
				platform: "Windows",
			},
		};

		// Apply navigator properties
		for (const [key, value] of Object.entries(navigatorProps)) {
			if (key === "userAgentData") continue; // Handle separately
			Object.defineProperty(navigator, key, { get: () => value });
		}

		// Override navigator.userAgentData if it exists
		if ("userAgentData" in navigator) {
			// @ts-ignore
			for (const [key, value] of Object.entries(navigatorProps.userAgentData)) {
				// @ts-ignore
				Object.defineProperty(navigator.userAgentData, key, {
					get: () => value,
				});
			}
		}

		// Add randomized WebGL fingerprint
		const getParameter = WebGLRenderingContext.prototype.getParameter;
		WebGLRenderingContext.prototype.getParameter = function (parameter: any) {
			// Randomize the WebGL fingerprint
			const gpuVendors = [
				{
					vendor: "Google Inc. (NVIDIA)",
					renderer:
						"ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0)",
				},
				{
					vendor: "Google Inc. (AMD)",
					renderer:
						"ANGLE (AMD, AMD Radeon RX 6800 XT Direct3D11 vs_5_0 ps_5_0)",
				},
				{
					vendor: "Google Inc. (Intel)",
					renderer:
						"ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)",
				},
				{ vendor: "Apple", renderer: "Apple M1 Pro" },
				{ vendor: "Google Inc.", renderer: "WebKit WebGL" },
			];

			const selectedGpu =
				gpuVendors[Math.floor(Math.random() * gpuVendors.length)];

			if (parameter === 37445) return selectedGpu.vendor;
			if (parameter === 37446) return selectedGpu.renderer;

			return getParameter.call(this, parameter);
		};

		// Override canvas fingerprinting
		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		// @ts-ignore - Intentionally overriding canvas context
		HTMLCanvasElement.prototype.getContext = function (
			contextType: string,
			options?: any
		) {
			const context = originalGetContext.call(this, contextType, options);

			if (contextType === "2d" && context) {
				const ctx = context as CanvasRenderingContext2D;
				const originalFillText = ctx.fillText;
				ctx.fillText = function (
					text: string,
					x: number,
					y: number,
					maxWidth?: number
				) {
					const modifiedText = text.replace(/[a-zA-Z]/g, (c: string) => {
						return String.fromCharCode(
							c.charCodeAt(0) +
								(Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5)
						);
					});
					return originalFillText.call(this, modifiedText, x, y, maxWidth);
				};

				const originalMeasureText = ctx.measureText;
				ctx.measureText = function (text: string) {
					const result = originalMeasureText.call(this, text);
					const oldWidth = result.width;
					Object.defineProperty(result, "width", {
						get: () => oldWidth * (1 + (Math.random() - 0.5) * 0.01),
					});
					return result;
				};
			}

			return context;
		};

		// Override audio fingerprinting
		const audioContext =
			window.AudioContext || (window as any).webkitAudioContext;
		if (audioContext) {
			const originalGetChannelData = AudioBuffer.prototype.getChannelData;
			AudioBuffer.prototype.getChannelData = function (channel) {
				const data = originalGetChannelData.call(this, channel);
				if (data.length > 0) {
					// Add subtle noise to audio data
					const noise = 0.0001;
					for (let i = 0; i < 500; i++) {
						const index = Math.floor(Math.random() * data.length);
						data[index] = data[index] + (Math.random() * noise - noise / 2);
					}
				}
				return data;
			};
		}

		// Override font fingerprinting
		const originalMatchMedia = window.matchMedia;
		window.matchMedia = function (query: string) {
			if (query.includes("prefers-color-scheme")) {
				return {
					matches: Math.random() > 0.5,
					media: query,
					onchange: null,
					addListener: function () {},
					removeListener: function () {},
					addEventListener: function () {},
					removeEventListener: function () {},
					dispatchEvent: function () {
						return true;
					},
				};
			}
			return originalMatchMedia(query);
		};
	});
}

async function simulateHumanBehavior(page: Page) {
	// Random mouse movements with realistic acceleration and deceleration
	for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
		const startX = Math.floor(Math.random() * 1000);
		const startY = Math.floor(Math.random() * 800);
		const endX = Math.floor(Math.random() * 1000);
		const endY = Math.floor(Math.random() * 800);

		// Move to start position
		await page.mouse.move(startX, startY);
		await delay(Math.random() * 300 + 100);

		// Move to end position with steps (simulating human-like curve)
		const steps = 10 + Math.floor(Math.random() * 15);
		for (let step = 1; step <= steps; step++) {
			// Bezier curve simulation for more natural movement
			const progress = step / steps;
			const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI); // Ease in-out

			const currX = startX + (endX - startX) * easedProgress;
			const currY = startY + (endY - startY) * easedProgress;

			// Add slight jitter
			const jitterX = (Math.random() - 0.5) * 3;
			const jitterY = (Math.random() - 0.5) * 3;

			await page.mouse.move(
				Math.round(currX + jitterX),
				Math.round(currY + jitterY)
			);

			// Variable delay between movements
			await delay(Math.random() * 20 + 10);
		}

		// Pause at destination
		await delay(Math.random() * 500 + 200);
	}

	// Random scrolling with natural acceleration/deceleration
	const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
	if (scrollHeight > 1000) {
		const scrollSteps = 5 + Math.floor(Math.random() * 10);
		const maxScroll = Math.min(scrollHeight, 5000);

		const scroll = async (step: number) => {
			const progress = step / scrollSteps;
			const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI); // Ease in-out
			const scrollPos = Math.round(maxScroll * easedProgress);

			await page.evaluate((pos) => {
				window.scrollTo({
					top: pos,
					behavior: "smooth",
				});
			}, scrollPos);

			await delay(Math.random() * 300 + 200);
		};

		for (let i = 1; i <= scrollSteps; i++) {
			await scroll(i);
		}
	}

	// Random delays between actions
	await delay(Math.random() * 2000 + 1000);
}

const executor: IExecutor<typeof LaunchBrowserTask> = {
	...createExecutor(LaunchBrowserTask),
	execute: async (
		env: ExecutionEnv<typeof LaunchBrowserTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) return false;

			env.log.info("Launching browser with enhanced stealth");

			// Add stealth plugin
			puppeteer.use(StealthPlugin());

			// Add adblocker to avoid ad-related detection
			puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

			// Get website URL and proxy settings
			const websiteUrl = env.getInput("Website URL");
			const proxyUrl = env.getInput("Website URL").includes("proxy")
				? env.getInput("Website URL")
				: "";

			const browser = await puppeteer.launch({
				headless:
					process.env.DEV_TEST_EXECUTION_HEADLESS === "1" ? false : true,
				defaultViewport: null,
				ignoreDefaultArgs: ["--enable-automation"],
				executablePath: process.env.CHROME_PATH || undefined,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-infobars",
					"--window-position=0,0",
					"--ignore-certificate-errors",
					"--ignore-certificate-errors-spki-list",
					"--disable-accelerated-2d-canvas",
					"--hide-scrollbars",
					"--disable-notifications",
					"--disable-extensions",
					"--force-device-scale-factor=1",
					"--disable-blink-features=AutomationControlled",
					"--disable-dev-shm-usage",
					`--proxy-server=${proxyUrl}`,
					"--disable-web-security",
					"--disable-features=IsolateOrigins,site-per-process",
					"--window-size=1920,1080",
					"--start-maximized",
					"--disable-background-timer-throttling",
					"--disable-backgrounding-occluded-windows",
					"--disable-renderer-backgrounding",
					"--disable-site-isolation-trials",
					"--disable-features=ScriptStreaming",
					"--no-default-browser-check",
					"--no-experiments",
					"--no-first-run",
					"--disable-features=BlockInsecurePrivateNetworkRequests",
					"--host-rules=MAP * 127.0.0.1",
					"--enable-features=NetworkService,NetworkServiceInProcess",
				],
			});

			env.setBrowser(browser);

			// Create a new page with stealth settings
			const page = await browser.newPage();

			// Block common resources that might trigger detection
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const url = request.url().toLowerCase();
				const resourceType = request.resourceType();

				// Block known fingerprinting scripts
				if (
					url.includes("fingerprint") ||
					url.includes("botdetect") ||
					url.includes("captcha") ||
					url.includes("cloudflare") ||
					url.includes("recaptcha") ||
					url.includes("datadome") ||
					url.includes("imperva") ||
					url.includes("distil") ||
					url.includes("perimeterx")
				) {
					request.abort();
					return;
				}

				// Block trackers and analytics
				if (
					url.includes("google-analytics") ||
					url.includes("analytics") ||
					url.includes("tracking") ||
					url.includes("stats") ||
					url.includes("pixel")
				) {
					request.abort();
					return;
				}

				// Allow essential resources, block others to speed up loading
				if (
					resourceType === "image" ||
					resourceType === "media" ||
					resourceType === "font" ||
					(resourceType === "stylesheet" && !url.includes("main"))
				) {
					request.abort();
					return;
				}

				request.continue();
			});

			// Apply basic settings
			await setupPageBasics(page);

			// Inject anti-detection scripts
			await injectAntiDetection(page);

			// Simulate human behavior
			await simulateHumanBehavior(page);

			// Add pre-navigation delay
			await delay(1000 + Math.random() * 2000);

			// Navigate with retry logic
			let success = false;
			let attempts = 0;
			const maxAttempts = 3;

			while (!success && attempts < maxAttempts) {
				attempts++;
				try {
					// Navigate to the website with a longer timeout
					const response = await page.goto(websiteUrl, {
						waitUntil: "networkidle2",
						timeout: 60000,
					});

					// Check if navigation was successful
					if (!response) {
						env.log.warn(`Navigation attempt ${attempts} failed: No response`);
						continue;
					}

					if (!response.ok() && response.status() !== 304) {
						env.log.warn(
							`Navigation attempt ${attempts} failed: HTTP ${response.status()}`
						);
						continue;
					}

					// Additional check to ensure page loaded properly
					const docStatus = await page.evaluate(() => {
						return {
							readyState: document.readyState,
							bodyContent: document.body.innerHTML.length,
							title: document.title,
						};
					});

					if (
						docStatus.readyState !== "complete" ||
						docStatus.bodyContent < 100
					) {
						env.log.warn(
							`Navigation attempt ${attempts} failed: Incomplete page load`
						);
						continue;
					}

					// Success!
					success = true;
					env.log.info(
						`Successfully loaded ${websiteUrl} on attempt ${attempts}`
					);

					// Add post-navigation human behavior
					await simulateHumanBehavior(page);
				} catch (error) {
					env.log.warn(
						`Navigation attempt ${attempts} error: ${error instanceof Error ? error.message : "Unknown error"}`
					);

					// Wait before retry
					await delay(2000 + Math.random() * 3000);

					// Refresh anti-detection on retry
					if (attempts < maxAttempts) {
						await injectAntiDetection(page);
					}
				}
			}

			if (!success) {
				throw new Error(
					`Failed to load ${websiteUrl} after ${maxAttempts} attempts`
				);
			}

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
