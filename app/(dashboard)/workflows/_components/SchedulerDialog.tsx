"use client";

import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/UpdateWorkflowCron";
import { toast } from "sonner";
import cronstrue from "cronstrue";
// import parser from "cron-parser";
// TODO: THIS IS NOT WORKING IN CLIENT SIDE COMPONENT
import { isValidCron } from "cron-validator";
import { DeleteWorkflowSchedule } from "@/actions/workflows/DeleteWorkflowSchedule";
import { Separator } from "@/components/ui/separator";
function SchedulerDialog(props: { workflowId: string; cron: string | null }) {
	const [cron, setCron] = useState(props.cron || "");
	const [validCron, setValidCron] = useState(false);
	const [humanReadableCron, setHumanReadableCron] = useState("");

	const saveScheduleMutation = useMutation({
		mutationFn: UpdateWorkflowCron,
		onSuccess: () => {
			toast.success("Workflow scheduled updated successfully!", {
				id: "schedule-workflow",
			});
		},
		onError: () => {
			toast.error("Failed to update schedule!", { id: "schedule-workflow" });
		},
	});
	const deleteScheduleMutation = useMutation({
		mutationFn: DeleteWorkflowSchedule,
		onSuccess: () => {
			toast.success("Workflow schedule removed successfully!", {
				id: "delete-schedule-workflow",
			});
		},
		onError: () => {
			toast.error("Failed to remove schedule!", {
				id: "delete-schedule-workflow",
			});
		},
	});

	useEffect(() => {
		try {
			const isValid = isValidCron(cron);
			if (isValid) {
				const humanReadableCronString = cronstrue.toString(cron);
				setHumanReadableCron(humanReadableCronString);
				setValidCron(true);
			} else {
				setValidCron(false);
			}
		} catch (error) {
			setValidCron(false);
		}
	}, [cron]);

	const workflowHasValidCron = props.cron && props.cron.length > 0;
	const readableSavedCron =
		workflowHasValidCron && cronstrue.toString(props.cron!);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant={"link"}
					size={"sm"}
					className={cn(
						"h-auto p-0 text-sm",
						workflowHasValidCron ? "text-primary" : "text-orange-500"
					)}
				>
					{workflowHasValidCron && (
						<div className="flex items-center gap-2 text-sm">
							<ClockIcon size={12} />
							<span className="text-sm">{readableSavedCron}</span>
						</div>
					)}

					{!workflowHasValidCron && (
						<div className="flex items-center gap-1 text-sm">
							<TriangleAlertIcon size={12} />
							<span className="text-sm">Set schedule</span>
						</div>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className="px-0">
				<CustomDialogHeader
					title="Schedule Workflow execution"
					icon={CalendarIcon}
				/>
				<div className="space-y-4 p-6">
					<p className="text-sm text-muted-foreground">
						Specify a cron expression to schedule peroidic workflow executions.
						All times are in UTC.
					</p>

					{/* <Label htmlFor="cron">Cron expression</Label> */}
					<Input
						placeholder="E.g. * * * * *"
						id="cron"
						value={cron}
						onChange={(e) => setCron(e.target.value)}
					/>

					<div
						className={cn(
							"rounded-md border border-destructive bg-accent p-4 text-sm text-destructive",
							validCron && "border-primary text-primary"
						)}
					>
						{validCron ? humanReadableCron : "Invalid cron expression"}
					</div>

					{workflowHasValidCron && (
						<DialogClose asChild>
							<div className="">
								<Button
									onClick={() => {
										toast.loading("Removing schedule...", {
											id: "delete-schedule-workflow",
										});
										deleteScheduleMutation.mutate(props.workflowId);
									}}
									variant={"link"}
									size={"sm"}
									className={cn(
										"w-full border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
									)}
								>
									Remove current schedule
								</Button>
								<Separator className="my-4" />
							</div>
						</DialogClose>
					)}
				</div>

				<DialogFooter className="gap-2 px-6">
					<DialogClose asChild>
						<Button variant={"secondary"} className="w-full">
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							onClick={() => {
								toast.loading("Saving...", { id: "schedule-workflow" });
								saveScheduleMutation.mutate({
									workflowId: props.workflowId,
									cron: cron,
								});
							}}
							variant={"default"}
							className="w-full"
							disabled={saveScheduleMutation.isPending || !validCron}
						>
							{saveScheduleMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default SchedulerDialog;
