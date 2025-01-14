'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getWorkflow(workflowId: string) {
	const { userId } = auth();
	if (!userId) {
		throw new Error('Unauthorized!');
	}

	return prisma.workflow.findUnique({
		where: {
			id: workflowId,
			userId,
		},
	});
}
