import { z } from 'zod';

export const createWorkflowSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().min(1).max(80).optional(),
});
export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;
