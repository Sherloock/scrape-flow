import { z } from "zod";

export const CreateWorkflowSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().max(80).optional(),
});
export type CreateWorkflowSchemaType = z.infer<typeof CreateWorkflowSchema>;

export const DuplicateWorkflowSchema = CreateWorkflowSchema.extend({
	workflowId: z.string(),
});
export type DuplicateWorkflowSchemaType = z.infer<
	typeof DuplicateWorkflowSchema
>;
