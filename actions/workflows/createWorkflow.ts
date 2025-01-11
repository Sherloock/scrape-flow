'use server';

import {
	createWorkflowSchema,
	createWorkflowSchemaType,
} from '@/schema/workflows';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import { WorkflowStatus } from '../../types/workflow';

export async function createWorkflow(form: createWorkflowSchemaType) {
	const { success, data } = createWorkflowSchema.safeParse(form);
	if (!success) {
		throw new Error('Invalid form data!');
	}

	const { userId } = auth();
	if (!userId) {
		throw new Error('Unauthorized!');
	}

	const result = await prisma.workflow.create({
		data: {
			userId,
			status: WorkflowStatus.DRAFT,
			definition: 'TODO:',
			...data,
		},
	});

	if (!result) {
		throw new Error('Failed to create workflow!');
	}

	redirect(`/workflow/editor/${result.id}`);
}
