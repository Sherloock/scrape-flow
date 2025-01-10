import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../components/ui/button'
function NotFoundPage() {
	return (
		<div className='flex-center flex-col min-h-screen p-4'>
			<div className="text-center">
				<h1 className="text-6xl font-bold text-primary">404</h1>
				<h2 className="text-2xl text-semibold mb-2">Page Not Found</h2>
				<p className="text-muted-foreground mb-8 max-w-md">Oops! You’ve reached the edge of the internet!</p>
				<div className="flex-center flex-col sm:flex-row gap-4">
					<Link href="/" className="flex-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-300">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Going back to safety
					</Link>
				</div>
			</div>

			<footer className="mt-12 text-center text-sm text-muted-foreground">
				If you think this is an error, please contact our support team.
			</footer>
		</div>
	)
}

export default NotFoundPage