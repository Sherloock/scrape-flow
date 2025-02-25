"use server";

import { prisma } from "@/lib/prisma";
import { checkAuth } from "../auth/checkAuth";
import { redirect } from "next/navigation";

const DEFAULT_FREE_CREDITS = 100;

export async function setupUser() {
	const userId = checkAuth();

	const balance = await prisma.userBalance.findUnique({
		where: { userId },
	});

	if (!balance) {
		await prisma.userBalance.create({
			data: { userId, credits: DEFAULT_FREE_CREDITS },
		});
	}

	redirect("/");
}
