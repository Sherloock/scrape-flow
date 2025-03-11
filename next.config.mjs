/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: [
			"puppeteer-extra",
			"puppeteer-extra-plugin-stealth",
			"puppeteer-extra-plugin-recaptcha",
			// "clone-deep",
			"puppeteer-extra-plugin-adblocker",
		],
	},
};

export default nextConfig;
