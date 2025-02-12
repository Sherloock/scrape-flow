"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavTabs({ workflowId }: { workflowId: string }) {
	const pathname = usePathname();
	const activeTab = pathname?.split("/")[2];

	return (
		<Tabs value={activeTab} className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<Link href={`/workflow/editor/${workflowId}`}>
					<TabsTrigger value="editor" className="w-full">
						Editor
					</TabsTrigger>
				</Link>
				<Link href={`/workflow/runs/${workflowId}`}>
					<TabsTrigger value="runs" className="w-full">
						Runs
					</TabsTrigger>
				</Link>
			</TabsList>
		</Tabs>
	);
}

export default NavTabs;
