"server-only";

import { prisma } from "@/lib/prisma";
import {
	CreditsPackage,
	getCreditsPackageById,
	PackageId,
} from "@/types/billing";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export async function handleCheckoutSessionCompleted(
	event: Stripe.Checkout.Session
) {
	if (!event.metadata) {
		throw new Error("Missing metadata");
	}

	const { userId, packageId } = event.metadata;
	// console.log("@@userId", userId);
	// console.log("@@packageId", packageId);
	if (!userId) {
		throw new Error("Missing metadata: userId");
	}

	if (!packageId) {
		throw new Error("Missing metadata: packageId");
	}
	const pack: CreditsPackage | undefined = getCreditsPackageById(
		packageId as PackageId
	);
	// console.log("@@pack", pack);
	if (!pack) {
		throw new Error("Invalid packageId");
	}

	await prisma.userBalance.upsert({
		where: {
			userId,
		},
		create: {
			userId,
			credits: pack.credits,
		},
		update: {
			credits: { increment: pack.credits },
		},
	});

		await prisma.userPurchase.create({
		data: {
			userId,
			stripeId: event.id,
			description: `${pack.name} - ${pack.credits} credits`,
			credits: pack.credits,
			price: event.amount_total!,
			currency: event.currency!,
		},
	});

	revalidatePath(`/billing`);
}
