"use client";

import ExecuteBtn from "@/app/workflow/_components/topbar/ExecuteBtn";
import SaveBtn from "@/app/workflow/_components/topbar/SaveBtn";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
	title: string;
	subtitle?: string;
	workflowId: string;
}

function Topbar({ title, subtitle, workflowId }: Props) {
	const router = useRouter();
	return (
		<header className="sticky top-0 z-10 flex h-[60px] w-full justify-between border-b-2 bg-background p-2">
			<div className="flex flex-1 gap-2">
				<TooltipWrapper content="Back">
					<Button variant="ghost" size="icon" onClick={() => router.back()}>
						<ChevronLeftIcon size={20} />
					</Button>
				</TooltipWrapper>

				<div>
					<p className="truncate text-ellipsis font-bold"> {title}</p>
					{subtitle && (
						<p className="truncate text-ellipsis text-xs text-muted-foreground">
							{subtitle}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-1 justify-end gap-1">
				<ExecuteBtn workflowId={workflowId}></ExecuteBtn>
				<SaveBtn workflowId={workflowId}></SaveBtn>
			</div>
		</header>
	);
}

export default Topbar;
