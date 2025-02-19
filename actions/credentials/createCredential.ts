"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";
import {
	CreateCredentialSchema,
	CreateCredentialSchemaType,
} from "@/schema/credentials";
import { revalidatePath } from "next/cache";

export async function createCredential(form: CreateCredentialSchemaType) {
	const { success, data } = CreateCredentialSchema.safeParse(form);

	if (!success) {
		throw new Error("Invalid form data");
	}

	const userId = checkAuth();

	const encryptedValue = await symmetricEncrypt(data.value);
	const result = await prisma.credential.create({
		data: {
			userId,
			name: data.name,
			value: encryptedValue,
		},
	});

	if (!result) {
		throw new Error("Failed to create credential");
	}

	revalidatePath("/credentials");
	// return result;
}
