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
import { CoinsIcon, CreditCard, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { purchaseCredits } from "@/actions/billing/purchaseCredits";
// TODO: Add a dialog to show the user the credits they have purchased
function CreditsPurchase() {
	const [selectedPackage, setSelectedPackage] = useState<PackageId>(
		PackageId.P5000
	);
	const [animatingCard, setAnimatingCard] = useState<PackageId | null>(null);

	const mutation = useMutation({
		mutationFn: purchaseCredits,
		onSuccess: () => {
			toast.success("Credits purchased in progress", {
				id: "purchase-credits",
				description: "You will be redirected to the billing page.",
			});
		},
		onError: () => {
			toast.error("Failed to purchase credits", {
				id: "purchase-credits",
				description: "Please try again.",
			});
		},
	});

	const handleCardClick = (packId: PackageId) => {
		setSelectedPackage(packId);
		setAnimatingCard(packId);
		// Reset animation state after animation completes
		setTimeout(() => setAnimatingCard(null), 300);
	};

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
							} ${animatingCard === pack.id ? "scale-[1.02] shadow-md" : ""}`}
							onClick={() => handleCardClick(pack.id)}
						>
							{pack.savings && (
								<div className="absolute -right-2 -top-2 rounded-full bg-green-600 px-2 py-1 text-xs font-bold uppercase text-white">
									{pack.savings}
								</div>
							)}
							{pack.mostPopular && (
								<div className="absolute -left-2 -top-4 rounded-full bg-primary px-3 py-1.5 text-sm font-bold uppercase text-white shadow-sm">
									Most Popular
								</div>
							)}
							<div className="flex items-center gap-2 space-x-3">
								<RadioGroupItem
									value={pack.id}
									id={`${pack.id}`}
									className="h-5 w-5 data-[state=checked]:border-primary data-[state=checked]:text-primary"
								/>

								<div className="flex w-full flex-col space-y-1">
									<div className="flex items-center justify-between">
										{/* Name */}
										<Label
											htmlFor={`${pack.id}`}
											className="text-lg font-semibold"
										>
											{pack.name}
										</Label>
										{/* Price */}
										<span className="font-bold text-primary">
											${(pack.priceCents / 100).toFixed(2)}
										</span>
									</div>

									{/* Comment */}
									{pack.comment && (
										<div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
											<span className="">{pack.comment}</span>
										</div>
									)}

									{/* Credits per credit */}
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span className="font-semibold text-primary">
											{pack.label}
										</span>
										<span>
											${(pack.priceCents / 100 / pack.credits).toFixed(6)} per
											credit
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</RadioGroup>
			</CardContent>

			<CardFooter>
				<Button
					className="w-full"
					disabled={mutation.isPending}
					onClick={() => mutation.mutate(selectedPackage)}
				>
					{mutation.isPending ? (
						<Loader2 className="mr-2 animate-spin" size={20} />
					) : (
						<CreditCard size={20} className="mr-2" />
					)}
					{mutation.isPending ? "Purchasing..." : "Purchase Credits"}
				</Button>
			</CardFooter>
		</Card>
	);
}

export default CreditsPurchase;
