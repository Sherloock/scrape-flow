"use server";

import { CheckAuth } from "@/actions/auth/CheckAuth";
import { prisma } from "@/lib/prisma";

export async function GetAvailableCredits() {
	const userId = CheckAuth();

	const balance = await prisma.userBalance.findUnique({
		where: { userId },
	});

	if (!balance) {
		return -1;
	}

	return balance.credits;
}
