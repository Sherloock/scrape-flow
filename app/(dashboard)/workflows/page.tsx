import React, { Suspense } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import { waitFor } from '../../../lib/helper/waitFor';

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
	await waitFor(3000);
	return <div>UserWorkFlows</div>;
}

export default page;
