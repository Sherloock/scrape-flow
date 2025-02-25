"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditsPackages, PackageId } from "@/types/billing";
import { CoinsIcon, CreditCard } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function CreditsPurchase() {
	const [selectedPackage, setSelectedPackage] = useState<PackageId>(
		PackageId.MEDIUM
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<CoinsIcon size={24} className="text-primary" />
					Purchase Credits
				</CardTitle>
				<CardDescription>
					Select the amount of credits you want to purchase.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RadioGroup
					onValueChange={(value) => setSelectedPackage(value as PackageId)}
					value={selectedPackage}
				>
					{CreditsPackages.map((pack) => (
						<div
							key={pack.id}
							className={`relative my-2 flex flex-col space-y-2 rounded-lg p-4 transition-all duration-200 ${
								selectedPackage === pack.id
									? "border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/80"
									: "bg-secondary/50 hover:bg-secondary"
							}`}
							onClick={() => setSelectedPackage(pack.id)}
						>
							{pack.savings && (
								<div className="absolute -right-2 -top-2 rounded-full bg-green-600 px-2 py-1 text-xs font-bold capitalize text-white">
									{pack.savings}
								</div>
							)}
							<div className="flex items-center space-x-3">
								<RadioGroupItem
									value={pack.id}
									id={`${pack.id}`}
									className="h-5 w-5 data-[state=checked]:border-primary data-[state=checked]:text-primary"
								/>
								<div className="flex w-full flex-col space-y-1">
									<div className="flex items-center justify-between">
										<Label
											htmlFor={`${pack.id}`}
											className="text-lg font-semibold"
										>
											{pack.name}
										</Label>
										<span className="font-bold text-primary">
											${(pack.priceCents / 100).toFixed(2)}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span>{pack.label}</span>
										<span>${pack.pricePerCredit.toFixed(5)} per credit</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</RadioGroup>
			</CardContent>

			<CardFooter>
				<Button className="w-full">
					<CreditCard size={20} className="mr-2" />
					Purchase Credits
				</Button>
			</CardFooter>
		</Card>
	);
}

export default CreditsPurchase;
