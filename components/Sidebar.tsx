"use client"

import { CoinsIcon, HomeIcon, Link, ShieldCheckIcon, WorkflowIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '../lib/utils'
import Logo from './Logo'
import { Button, buttonVariants } from './ui/button'
const routes = [
	{
		label: "Home",
		href: "/",
		icon: HomeIcon
	},
	{
		label: "Workflows",
		href: "/workflows",
		icon: WorkflowIcon
	},
	{
		label: "Credentials",
		href: "/credentials",
		icon: ShieldCheckIcon
	},
	{
		label: "Billing",
		href: "/billing",
		icon: CoinsIcon
	}
]
export default function DesktopSidebar() {

	const pathname = usePathname();
	const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];

	return (
		<div className='hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate'>
			<div className='flex items-center justify-center gap-2 border-b-[1px] border-separate p-4'>
				<Logo fontSize='xl' />
			</div>

			<div className="flex flex-col p-2 w-full">
				{routes.map((route) => (
					<Link href={route.href} key={route.href} className={buttonVariants({ variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem" })}>
							<route.icon size={20} />
							{route.label}
					</Link>
				))}
			</div>
		</div>
	)
}
