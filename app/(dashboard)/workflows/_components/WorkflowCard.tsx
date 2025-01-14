"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
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
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
	FileTextIcon,
	MoreVerticalIcon,
	PlayIcon,
	ShuffleIcon,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";

const statusColors = {
	[WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
	[WorkflowStatus.PUBLISHED]: "bg-primary text-primary-foreground",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
	const isDraft = workflow.status === WorkflowStatus.DRAFT;

	return (
		<Card className='border-separate overflow-hidden rounded-lg border shadow-sm hover:shadow-md hover:shadow-primary/20'>
			<CardContent className='flex h-[100px] items-center justify-between p-4'>
				<div className='flex items-center justify-end space-x-3'>
					<div
						className={cn(
							"flex-center size-10 rounded-full",
							statusColors[workflow.status as WorkflowStatus]
						)}
					>
						{isDraft ? (
							<FileTextIcon className='size-5' />
						) : (
							<PlayIcon className='size-5' />
						)}
					</div>

					<div>
						<h3 className='flex items-center text-base font-bold text-muted-foreground'>
							<Link
								href={`/workflow/editor/${workflow.id}`}
								className='flex items-center hover:underline'
							>
								{workflow.name}
							</Link>

							{isDraft && (
								<span className='ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800'>
									Draft
								</span>
							)}
						</h3>
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					<Link
						href={`/workflow/editor/${workflow.id}`}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"flex items-center gap-2"
						)}
					>
						<ShuffleIcon className='size-16' />
						Edit
					</Link>
					<WorkflowActions workflow={workflow} />
				</div>
			</CardContent>
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
					<Button variant='outline' size='sm'>
						<TooltipWrapper content={"More actions"} side='top'>
							<div className='flex-center h-full w-full'>
								<MoreVerticalIcon className='size-18' />
							</div>
						</TooltipWrapper>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					{/* Edit */}
					<DropdownMenuItem>
						<Link href={`/workflow/editor/${workflow.id}`}>Edit</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{/* Delete */}
					<DropdownMenuItem
						className='flex items-center gap-2 text-destructive'
						onSelect={() => setShowDeleteDialog((prev) => !prev)}
					>
						<TrashIcon className='size-16' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export default WorkflowCard;
