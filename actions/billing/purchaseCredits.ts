"use server";

import { PackageId } from "@/types/billing";
import { checkAuth } from "../auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function purchaseCredits(packageId: PackageId) {
	const userId = checkAuth();

	const balance = await prisma.userBalance.findUnique({
		where: { userId },
	});
}
