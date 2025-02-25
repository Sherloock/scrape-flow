export enum PackageId {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE",
}

export type CreditsPackage = {
	id: PackageId;
	name: string;
	label: string;
	credits: number;
	priceCents: number;
	pricePerCredit: number;
	savings?: string;
};

export const CreditsPackages: CreditsPackage[] = [
	{
		id: PackageId.SMALL,
		name: "Data Explorer",
		label: "1,000 Credits",
		credits: 1000,
		priceCents: 999, // $9.99
		pricePerCredit: 0.00999, // $0.00999 per credit
	},
	{
		id: PackageId.MEDIUM,
		name: "Pro Harvester",
		label: "5,000 Credits",
		credits: 5000,
		priceCents: 3999, // $39.99
		pricePerCredit: 0.00799, // $0.00799 per credit
		savings: "SAVE 20%",
	},
	{
		id: PackageId.LARGE,
		name: "Master Miner",
		label: "10,000 Credits",
		credits: 10000,
		priceCents: 6999, // $69.99
		pricePerCredit: 0.00699, // $0.00699 per credit
		savings: "SAVE 30%",
	},
];

export const getCreditsPackageById = (id: PackageId) => {
	return CreditsPackages.find((pkg) => pkg.id === id);
};
