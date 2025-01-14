"use client";

import {
	CoinsIcon,
	HomeIcon,
	MenuIcon,
	ShieldCheckIcon,
	WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Logo from "./Logo";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
const routes = [
	{
		label: "Home",
		href: "/",
		icon: HomeIcon,
	},
	{
		label: "Workflows",
		href: "/workflows",
		icon: WorkflowIcon,
	},
	{
		label: "Credentials",
		href: "/credentials",
		icon: ShieldCheckIcon,
	},
	{
		label: "Billing",
		href: "/billing",
		icon: CoinsIcon,
	},
];
export default function DesktopSidebar() {
	const pathname = usePathname();
	const activeRoute =
		routes.find(
			(route) => route.href.length > 0 && pathname.includes(route.href),
		) || routes[0];

	return (
		<div className="relative hidden h-screen w-full min-w-[280px] max-w-[280px] border-separate overflow-hidden border-r-2 bg-primary/5 text-muted-foreground dark:bg-secondary/30 dark:text-foreground md:block">
			<div className="flex border-separate items-center justify-center gap-2 border-b-[1px] p-4">
				<Logo />
			</div>

			<div className="flex flex-col p-2">TODO CREDITS</div>
			<div className="flex flex-col p-2">
				{routes.map((route) => (
					<Link
						key={route.href}
						href={route.href}
						className={buttonVariants({
							variant:
								activeRoute.href === route.href
									? "sidebarActiveItem"
									: "sidebarItem",
						})}
					>
						<route.icon size={20} />
						{route.label}
					</Link>
				))}
			</div>
		</div>
	);
}

export function MobileSidebar() {
	const pathname = usePathname();
	const activeRoute =
		routes.find(
			(route) => route.href.length > 0 && pathname.includes(route.href),
		) || routes[0];
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="block border-separate bg-background md:hidden">
			<nav className="flex-between container px-8">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger>
						{/* TODO This Button Nest cause hidration error */}
						{/* <Button variant="ghost" size="icon">
								<MenuIcon />
							</Button> */}

						<div className="hover:bg-primary-dark flex cursor-pointer items-center justify-center rounded p-2">
							<MenuIcon />
						</div>
					</SheetTrigger>
					<SheetContent className="w-[400px] space-y-4 sm:w-[540px]">
						<Logo />
						<div className="flex flex-col gap-1">
							{routes.map((route) => (
								<Link
									key={route.href}
									href={route.href}
									className={buttonVariants({
										variant:
											activeRoute.href === route.href
												? "sidebarActiveItem"
												: "sidebarItem",
									})}
									onClick={() => setIsOpen((prev) => !prev)}
								>
									{route.label}
								</Link>
							))}
						</div>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
}
