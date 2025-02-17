"use client";

import DeleteWorkflowDialog from "@/app/(dashboard)/workflows/_components/DeleteWorkflowDialog";
import RunBtn from "@/app/(dashboard)/workflows/_components/RunBtn";
import SchedulerDialog from "@/app/(dashboard)/workflows/_components/SchedulerDialog";
import ExecutionStatusIndicator from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import {
	ChevronRightIcon,
	ClockIcon,
	CoinsIcon,
	CornerDownRightIcon,
	FileTextIcon,
	MoreVerticalIcon,
	MoveRightIcon,
	PlayIcon,
	ShuffleIcon,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

const statusColors = {
	[WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
	[WorkflowStatus.PUBLISHED]: "bg-primary text-primary-foreground",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;

	return (
		<Card className="border-separate overflow-hidden rounded-lg border shadow-sm hover:shadow-md hover:shadow-primary/20">
			<CardContent className="flex h-[100px] items-center justify-between p-4">
				<div className="flex items-center justify-end space-x-3">
					<div
						className={cn(
							"flex-center size-10 rounded-full",
							statusColors[workflow.status as WorkflowStatus]
						)}
					>
						{isDraft ? (
							<FileTextIcon className="size-5" />
						) : (
							<PlayIcon className="size-5" />
						)}
					</div>

					<div>
						<h3 className="flex items-center text-base font-bold text-muted-foreground">
							<Link
								href={`/workflow/editor/${workflow.id}`}
								className="flex items-center hover:underline"
							>
								{workflow.name}
							</Link>

							{isDraft && (
								<span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
									Draft
								</span>
							)}
						</h3>
						<ScheduleSection
							isDraft={isDraft}
							creditsCost={workflow.creditsCost}
							workflowId={workflow.id}
							cron={workflow.cron}
						/>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					{/* run */}
					{!isDraft && <RunBtn workflowId={workflow.id} />}

					{/* edit */}
					<Link
						href={`/workflow/editor/${workflow.id}`}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"flex items-center gap-2"
						)}
					>
						<ShuffleIcon className="size-16" />
						Edit
					</Link>
					<WorkflowActions workflow={workflow} />
				</div>
			</CardContent>

			<LastRunDetails workflow={workflow} />
		</Card>
	);
}

function WorkflowActions({ workflow }: { workflow: Workflow }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<DeleteWorkflowDialog
				open={showDeleteDialog}
				setOpen={setShowDeleteDialog}
				workflowName={workflow.name}
				workflowId={workflow.id}
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm">
						<TooltipWrapper content={"More actions"} side="top">
							<div className="flex-center h-full w-full">
								<MoreVerticalIcon className="size-18" />
							</div>
						</TooltipWrapper>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					{/* Edit */}
					<DropdownMenuItem>
						<Link href={`/workflow/editor/${workflow.id}`}>Edit</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{/* Delete */}
					<DropdownMenuItem
						className="flex items-center gap-2 text-destructive"
						onSelect={() => setShowDeleteDialog((prev) => !prev)}
					>
						<TrashIcon className="size-16 stroke-red-500 text-muted-foreground" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

function ScheduleSection({
	isDraft,
	creditsCost,
	workflowId,
	cron,
}: {
	isDraft: boolean;
	creditsCost: number;
	workflowId: string;
	cron: string | null;
}) {
	if (isDraft) return null;
	return (
		<div className="flex items-center gap-2">
			<CornerDownRightIcon size={16} className="text-muted-foreground" />

			<SchedulerDialog
				workflowId={workflowId}
				cron={cron}
				key={`${workflowId}-${cron}`}
			/>
			<MoveRightIcon size={16} className="text-muted-foreground" />

			<TooltipWrapper content={"Credit consuption for full run"} side="top">
				<div className="flex items-center gap-3">
					<Badge
						variant={"outline"}
						className="space-x-2 rounded-sm text-muted-foreground"
					>
						<CoinsIcon size={16} className="text-muted-foreground" />
						<span className="text-sm">{creditsCost}</span>
					</Badge>
				</div>
			</TooltipWrapper>
		</div>
	);
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;

	if (isDraft) return null;

	const { lastRunAt, lastRunStatus, nextRunAt } = workflow;
	const formattedLastRunAt =
		lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

	const nextScheduledRun = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
	const nextScheduledRunUTC =
		nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

	return (
		<div className="flex items-center justify-between bg-primary/5 px-4 py-1">
			<div className="flex items-center gap-2 text-sm">
				{lastRunAt && (
					<Link
						className="group flex items-center gap-2 text-sm"
						href={`/workflow/runs/${workflow.id}`}
					>
						<span>Last Run:</span>
						<ExecutionStatusIndicator
							status={lastRunStatus as WorkflowExecutionStatus}
						/>
						<span>{lastRunStatus}</span>
						<span>{formattedLastRunAt}</span>
						<ChevronRightIcon
							size={14}
							className="-translate-x-[2px] text-muted-foreground transition group-hover:translate-x-0"
						/>
					</Link>
				)}

				{!lastRunAt && (
					<span className="text-muted-foreground">
						No runs yet. Run the workflow to see the last run details.
					</span>
				)}
			</div>

			{nextRunAt && (
				<div className="flex items-center gap-2 text-sm">
					<ClockIcon size={12} className="text-muted-foreground" />
					<span>Next Run:</span>
					<span>{nextScheduledRun}</span>
					<span className="text-xs">({nextScheduledRunUTC} UTC)</span>
				</div>
			)}
		</div>
	);
}

export default WorkflowCard;
