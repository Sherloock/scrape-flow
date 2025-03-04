"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { symmetricDecrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";

export async function getDecryptedCredential(id: string) {
	const userId = checkAuth();
	const credential = await prisma.credential.findUnique({
		where: {
			id,
			userId,
		},
	});

	if (!credential) {
		throw new Error("Credential not found");
	}

	const decryptedValue = symmetricDecrypt(credential.value as string);

	if (!decryptedValue) {
		throw new Error("Cannot decrypt credential");
	}

	// console.log(decryptedValue);

	return decryptedValue;
}
