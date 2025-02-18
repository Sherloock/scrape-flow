"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function getAvailableCredits() {
	const userId = checkAuth();

	const balance = await prisma.userBalance.findUnique({
		where: { userId },
	});

	if (!balance) {
		return -1;
	}

	return balance.credits;
}
