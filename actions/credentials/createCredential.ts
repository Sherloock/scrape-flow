"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { symmetricEncrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import {
	CreateCredentialSchema,
	CreateCredentialSchemaType,
} from "@/schema/credentials";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function createCredential(form: CreateCredentialSchemaType) {
	const { success, data } = CreateCredentialSchema.safeParse(form);

	if (!success) {
		throw new Error("Invalid form data");
	}

	const userId = checkAuth();

	try {
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
		return { success: true };
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			throw new Error(`Credential with name "${data.name}" already exists`);
		}
		throw new Error("Failed to create credential");
	}
}
