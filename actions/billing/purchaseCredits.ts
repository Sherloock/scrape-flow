"use server";

import { getCreditsPackageById, PackageId } from "@/types/billing";
import { checkAuth } from "../auth/checkAuth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { getAppUrl } from "@/lib/helper/appUrl";
import { redirect } from "next/navigation";

export async function purchaseCredits(packageId: PackageId) {
	const userId = checkAuth();

	const selectedPackage = getCreditsPackageById(packageId);
	if (!selectedPackage) {
		throw new Error("Invalid package");
	}
	const priceId = selectedPackage.priceId;

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		invoice_creation: {
			enabled: true,
		},
		success_url: getAppUrl("/billing"),
		cancel_url: getAppUrl("/billing"),
		metadata: {
			userId,
			packageId,
		},
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
	});

	if (!session.url) {
		throw new Error("Cannot create checkout session");
	}

	redirect(session.url);
}
