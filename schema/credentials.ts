import { z } from "zod";

export const CreateCredentialSchema = z.object({
	name: z.string().min(1).max(30),
	value: z.string().min(1).max(500),
});
export type CreateCredentialSchemaType = z.infer<typeof CreateCredentialSchema>;

// export const DuplicateCredentialSchema = CreateCredentialSchema.extend({
// 	credentialId: z.string(),
// });
// export type DuplicateCredentialSchemaType = z.infer<
// 	typeof DuplicateCredentialSchema
// >;
