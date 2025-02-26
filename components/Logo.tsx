import { cn } from "@/lib/utils";
import Link from "next/link";
// import Image from "next/image";
import React from "react";
import { Network, NetworkIcon, SquareDashedMousePointer } from "lucide-react";

function Logo({
	fontSize = "text-2xl",
	iconSize = 24,
}: {
	fontSize?: string;
	iconSize?: number;
}) {
	return (
		<Link
			href="/"
			className={cn(
				"flex items-center gap-2 text-2xl font-extrabold",
				fontSize
			)}
		>
			<div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
				<NetworkIcon name="logo" size={iconSize} className="stroke-white" />
				{/* <Image
					src="/favicon.ico"
					alt="ScrapeEase Logo"
					width={iconSize}
					height={iconSize}
					className="rounded-md object-contain"
				/> */}
			</div>
			<div>
				<span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
					Scrape
				</span>
				<span className="text-stone-700 dark:text-stone-300">Ease</span>
				{/* <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
					Crawler
				</span> */}
			</div>
		</Link>
	);
}

export default Logo;
