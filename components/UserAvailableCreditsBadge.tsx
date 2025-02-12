"use client";

import { GetAvailableCredits } from "@/actions/billing/GetAvailableCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
export default function UserAvailableCreditsBadge() {
	const query = useQuery({
		queryKey: ["user-available-credits"],
		queryFn: () => GetAvailableCredits(),
		refetchInterval: 1000 * 30, // 30 seconds
	});

	return (
		<Link
			href="/billing"
			className={cn(
				"w-full items-center space-x-2",
				buttonVariants({ variant: "outline" })
			)}
		>
			<CoinsIcon size={20} className="text-primary" />
			<span className="font-semibold capitalize">
				{query.isLoading && <Loader2Icon className="size-4 animate-spin" />}
				{!query.isLoading && query.data && (
					<ReactCountUpWrapper value={query.data} />
				)}
				{!query.isLoading && !query.data && "-"}
			</span>
		</Link>
	);
}
