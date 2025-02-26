export enum PackageId {
	P1000 = "P1000",
	P2500 = "P2500",
	P5000 = "P5000",
	P10000 = "P10000",
}
// TODO: Gamify Bulk Purchases:

// Add a gamification element, such as bonus credits for reaching certain milestones (e.g., "Buy 10,000 credits and get 1,000 bonus credits free"). This would further incentivize bulk purchases.

// Consider offering a small number of free credits (e.g., 100 credits) or a very low-cost entry-level option (e.g., $1.99 for 200 credits). This would allow new users to test the service with minimal commitment, potentially increasing conversion rates.

export type CreditsPackage = {
	id: PackageId;
	name: string;
	label: string;
	credits: number;
	priceCents: number;
	// pricePerCredit: number;
	comment: string;
	stripeName: string;
	priceId: string;
	savings?: string;
	mostPopular?: boolean;
};

export const CreditsPackages: CreditsPackage[] = [
	{
		id: PackageId.P1000,
		name: "Data Explorer",
		label: "1,000 Credits",
		credits: 1000,
		priceCents: 999,
		comment: "Perfect for light users or one-time projects.",
		stripeName: "ScrapeEase - Data Explorer - 1,000 credits",
		priceId: process.env.STRIPE_PRICE_ID_1000!,
	},
	{
		id: PackageId.P2500,
		name: "Advanced Scraper",
		label: "3,000 Credits",
		credits: 3000,
		priceCents: 2699,
		savings: "SAVE 10%",
		comment:
			"Perfect for users who need more than 1,000 credits without committing to the Pro tier.",
		stripeName: "ScrapeEase - Advanced Scraper - 3,000 credits",
		priceId: process.env.STRIPE_PRICE_ID_2500!,
	},
	{
		id: PackageId.P5000,
		name: "Pro Harvester",
		label: "5,000 Credits",
		credits: 5000,
		priceCents: 3999,
		savings: "SAVE 20%",
		comment: "Ideal for regular users with moderate needs.",
		stripeName: "ScrapeEase - Pro Harvester - 5,000 credits",
		priceId: process.env.STRIPE_PRICE_ID_5000!,
		mostPopular: true,
	},
	{
		id: PackageId.P10000,
		name: "Master Miner",
		label: "10,000 Credits",
		credits: 10000,
		priceCents: 6999,
		savings: "SAVE 30%",
		comment: "Best for power users or teams with heavy usage.",
		stripeName: "ScrapeEase - Master Miner - 10,000 credits",
		priceId: process.env.STRIPE_PRICE_ID_10000!,
	},
];

export const getCreditsPackageById = (id: PackageId) => {
	return CreditsPackages.find((pkg) => pkg.id === id);
};
