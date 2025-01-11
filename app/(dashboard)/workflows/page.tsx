import { AlertCircle } from 'lucide-react';
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
				<AlertTitle>No workflows found</AlertTitle>
				<AlertDescription>
					You have not created any workflows yet.
				</AlertDescription>
			</Alert>
		);
	}

	return <div></div>;
}

export default page;
