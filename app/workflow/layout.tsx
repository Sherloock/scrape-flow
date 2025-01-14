import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen w-full flex-col">
			{children}
			<Separator />

			<footer className="flex h-[50px] items-center justify-between px-6 py-4">
				<Logo iconSize={16} />
				<ModeToggle />
			</footer>
		</div>
	);
}

export default layout;
