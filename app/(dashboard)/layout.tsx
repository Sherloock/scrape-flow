import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import DesktopSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<DesktopSidebar />
			<div className="flex min-h-screen flex-1 flex-col">
				<div className="flex items-center justify-center">
					<header className="container flex h-[50px] items-center justify-between px-6 py-4">
						<BreadcrumbHeader />
						<div className="flex items-center gap-1">
							<ModeToggle />
							<SignedIn>
								<UserButton />
							</SignedIn>
						</div>
					</header>
				</div>
				<Separator />
				<div className="flex-1 overflow-auto">
					<div className="container mx-auto h-full w-full px-6 py-4 text-accent-foreground">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
