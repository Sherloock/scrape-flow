export enum PackageId {
	P1000 = "P1000",
	P2500 = "P2500",
	P5000 = "P5000",
	P10000 = "P10000",
}

export type CreditsPackage = {
	id: PackageId;
	name: string;
	label: string;
	credits: number;
	priceCents: number;
	// pricePerCredit: number;
	savings?: string;
	comment?: string;
};

export const CreditsPackages: CreditsPackage[] = [
	{
		id: PackageId.P1000,
		name: "Data Explorer",
		label: "1,000 Credits",
		credits: 1000,
		priceCents: 999,
		comment: "Perfect for light users or one-time projects.",
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
	},
	{
		id: PackageId.P5000,
		name: "Pro Harvester",
		label: "5,000 Credits",
		credits: 5000,
		priceCents: 3999,
		savings: "SAVE 20%",
		comment: "Ideal for regular users with moderate needs.",
	},
	{
		id: PackageId.P10000,
		name: "Master Miner",
		label: "10,000 Credits",
		credits: 10000,
		priceCents: 6999,
		savings: "SAVE 30%",
		comment: "Best for power users or teams with heavy usage.",
	},
];

export const getCreditsPackageById = (id: PackageId) => {
	return CreditsPackages.find((pkg) => pkg.id === id);
};
