import { AlertCircle, InboxIcon } from 'lucide-react';
import React, { Suspense } from 'react';
import { getWorkflowsForUser } from '../../../actions/workflows/getWorkflowsForUser';
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '../../../components/ui/alert';
import { Skeleton } from '../../../components/ui/skeleton';

function page() {
	return (
		<div className='flex h-full flex-1 flex-col'>
			<div className='flex justify-between'>
				<div className='flex flex-col'>
					<h1 className='text-3xl font-bold'>Workflows</h1>
					<p className='text-muted-foreground'>Manage your workflows</p>
				</div>
			</div>

			<div className='h-full py-6'>
				<Suspense fallback={<UserWorkFlowsSkeleton />}>
					<UserWorkFlows />
				</Suspense>
			</div>
		</div>
	);
}
function UserWorkFlowsSkeleton() {
	return (
		<div className='space-y-2'>
			{[1, 2, 3, 4].map((index) => (
				<Skeleton key={index} className='h-32 w-full' />
			))}
		</div>
	);
}

async function UserWorkFlows() {
	const workflows = await getWorkflowsForUser();

	if (!workflows) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Something went wrong while fetching your workflows. Please try again
					later.
				</AlertDescription>
			</Alert>
		);
	}

	if (workflows.length === 0) {
		return (
			<div className='flex-center h-full flex-col gap-4'>
				<div className='flex-center size-20 rounded-full bg-accent'>
					<InboxIcon className='size-10 stroke-primary' />
				</div>
				<div className='flex flex-col gap-1 text-center'>
					<p className='font-bold'>No workflow created yet</p>
					<p className='text-sm text-muted-foreground'>
						Create your first workflow to get started.
					</p>
				</div>
			</div>
		);
	}

	return <div>Workflows</div>;
}

export default page;
