import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function NotFoundPage() {
	return (
		<div className='flex-center min-h-screen flex-col p-4'>
			<div className='text-center'>
				<h1 className='text-6xl font-bold text-primary'>404</h1>
				<h2 className='text-semibold mb-2 text-2xl'>Page Not Found</h2>
				<p className='mb-8 max-w-md text-muted-foreground'>
					Oops! You’ve reached the edge of the internet!
				</p>
				<div className='flex-center flex-col gap-4 sm:flex-row'>
					<Link
						href='/'
						className='flex-center rounded-md bg-primary px-4 py-2 text-white transition-colors duration-300 hover:bg-primary/80'
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Going back to safety
					</Link>
				</div>
			</div>

			<footer className='mt-12 text-center text-sm text-muted-foreground'>
				If you think this is an error, please contact our support team.
			</footer>
		</div>
	);
}

export default NotFoundPage;
