"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/actions/auth/checkAuth";

export async function deleteCredential(name: string) {
	const userId = checkAuth();

	const result = await prisma.credential.delete({
		where: {
			userId_name: {
				userId,
				name,
			},
		},
	});

	revalidatePath("/credentials");
}
