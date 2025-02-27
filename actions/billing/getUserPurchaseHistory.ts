"use server;";
import { prisma } from "@/lib/prisma";
import { checkAuth } from "../auth/checkAuth";

export async function getUserPurchaseHistory() {
	const userId = checkAuth();

	const transactions = await prisma.userPurchase.findMany({
		where: {
			userId,
		},
		orderBy: {
			date: "desc",
		},
	});

	return transactions;
}
