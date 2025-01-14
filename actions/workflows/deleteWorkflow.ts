'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';

import { auth } from '@clerk/nextjs/server';

export async function deleteWorkflow(workflowId: string) {
	const { userId } = auth();
	if (!userId) {
		throw new Error('Unauthorized!');
	}

	const result = await prisma.workflow.delete({
		where: {
			id: workflowId,
			userId,
		},
	});
	console.log(result);

	revalidatePath('/workflows');
}
