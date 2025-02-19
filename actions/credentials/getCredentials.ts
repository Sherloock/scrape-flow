"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";

export async function getCredentials() {
	const userId = checkAuth();

	const credentials = await prisma.credential.findMany({
		where: { userId },
		orderBy: { name: "asc" },
	});

	return credentials;
}
