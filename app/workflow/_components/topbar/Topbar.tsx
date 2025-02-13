"use client";

import ExecuteBtn from "@/app/workflow/_components/topbar/ExecuteBtn";
import NavTabs from "@/app/workflow/_components/topbar/NavTabs";
import PublishBtn from "@/app/workflow/_components/topbar/PublishBtn";
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
	hideButtons?: boolean;
	isPublished?: boolean;
}

function Topbar({
	title,
	subtitle,
	workflowId,
	hideButtons = false,
	isPublished = false,
}: Props) {
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

			<NavTabs workflowId={workflowId} />

			<div className="flex flex-1 justify-end gap-1">
				{!hideButtons && (
					<>
						<ExecuteBtn workflowId={workflowId}></ExecuteBtn>
						{!isPublished && (
							<>
								<SaveBtn workflowId={workflowId}></SaveBtn>
								<PublishBtn workflowId={workflowId}></PublishBtn>
							</>
						)}
					</>
				)}
			</div>
		</header>
	);
}

export default Topbar;
