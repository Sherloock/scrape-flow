"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/GetWorkflowPhaseDetails";
import PhaseStatusBadge from "@/app/workflow/runs/[workflowId]/[executionId]/_components/PhaseStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCredits } from "@/lib/helper/phases";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { ExecutionLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
	CalendarIcon,
	CircleDashedIcon,
	ClockIcon,
	CoinsIcon,
	CreditCardIcon,
	Loader2Icon,
	LucideIcon,
	WorkflowIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
	initialData,
}: {
	initialData: ExecutionData;
}) {
	const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

	const query = useQuery({
		queryKey: ["execution", initialData?.id],
		queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
		refetchInterval: (query) => {
			return query.state.data?.status === WorkflowExecutionStatus.RUNNING
				? 1000
				: false;
		},
	});

	const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

	useEffect(() => {
		const phases = query.data?.phases || [];
		if (isRunning) {
			const phaseToSelect = phases.toSorted((a, b) =>
				a.startedAt! > b.startedAt! ? -1 : 1
			)[0];

			if (phaseToSelect) {
				setSelectedPhase(phaseToSelect.id);
			}

			return;
		}

		const phaseToSelect = phases.toSorted((a, b) =>
			a.completedAt! > b.completedAt! ? -1 : 1
		)[0];

		if (phaseToSelect) {
			setSelectedPhase(phaseToSelect.id);
		}
	}, [query.data?.phases, isRunning, setSelectedPhase]);

	const phaseDetails = useQuery({
		queryKey: ["phaseDetails", selectedPhase],
		enabled: selectedPhase !== null,
		queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
	});

	const duration = DatesToDurationString(
		query.data?.startedAt,
		query.data?.completedAt
	);

	const creditsConsumed = GetPhasesTotalCredits(query.data?.phases || []);

	return (
		<div className="flex h-full w-full">
			<aside className="flex w-[440px] min-w-[440px] max-w-[440px] flex-grow border-separate flex-col overflow-hidden border-r-2">
				<div className="px-2 py-4">
					<ExecutionLabel
						label="Status"
						icon={CircleDashedIcon}
						value={query.data?.status}
					/>

					<ExecutionLabel
						label="Started at"
						icon={CalendarIcon}
						value={
							<span className="lowercase">
								{query.data?.startedAt
									? formatDistanceToNow(query.data.startedAt, {
											addSuffix: true,
										})
									: "-"}
							</span>
						}
					/>

					<ExecutionLabel
						label="Duration"
						icon={ClockIcon}
						value={
							duration || <Loader2Icon className="animate-spin" size={20} />
						}
					/>

					<ExecutionLabel
						label="Credits consumed"
						icon={CreditCardIcon}
						value={creditsConsumed}
					/>

					<Separator />

					<div className="flex items-center justify-center px-4 py-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<WorkflowIcon size={20} className="stroke-muted-foreground/80" />
							<span className="font-semibold">Phases</span>
						</div>
					</div>
				</div>

				<Separator />

				<div className="h-full overflow-auto px-2 py-4">
					{query.data?.phases.map((phase, index) => (
						<Button
							variant={selectedPhase === phase.id ? "secondary" : "ghost"}
							key={phase.id}
							className="w-full justify-between"
							onClick={() => {
								if (isRunning) {
									toast.error("Cannot select phase while running");
									return;
								}

								setSelectedPhase(phase.id);
							}}
						>
							<div className="flex items-center gap-2">
								<Badge variant="outline">{index + 1}</Badge>
								<p className="font-semibold">{phase.name}</p>
							</div>

							<PhaseStatusBadge
								status={phase.status as WorkflowExecutionStatus}
							/>
						</Button>
					))}
				</div>
			</aside>

			<div className="flex h-full w-full">
				{isRunning && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-2">
						<Loader2Icon className="animate-spin" size={20} />
						<p className="font-bold text-muted-foreground">
							Run is in progress, please wait
						</p>
					</div>
				)}

				{!isRunning && !selectedPhase && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-2">
						<div className="flex flex-col gap-1 text-center">
							<p className="font-bold">Run completed</p>
							<p className="text-muted-foreground">
								Select a phase to view the details
							</p>
						</div>
					</div>
				)}

				{!isRunning && selectedPhase && phaseDetails.data && (
					<div className="container flex flex-col gap-4 overflow-auto py-4">
						<div className="flex items-center gap-2">
							{/* TODO: Add credits consumed */}
							<Badge variant="outline" className="space-x-4">
								<div className="flex items-center gap-1">
									<CoinsIcon size={16} />
									<span>Credits TODO: {phaseDetails.data.creditsConsumed}</span>
								</div>
							</Badge>

							{/* Duration */}
							<Badge variant="outline" className="space-x-4">
								<div className="flex items-center gap-1">
									<ClockIcon size={16} />
									<span>Duration:</span>
									{DatesToDurationString(
										phaseDetails.data.startedAt,
										phaseDetails.data.completedAt
									) || <Loader2Icon className="animate-spin" size={16} />}
								</div>
							</Badge>
						</div>

						<ParametersViewer
							title="Inputs"
							subTitle="Inputs used for the phase"
							paramsJson={phaseDetails.data.inputs}
						/>

						<ParametersViewer
							title="Outputs"
							subTitle="Outputs generated by the phase"
							paramsJson={phaseDetails.data.outputs}
						/>

						<LogViewer
							title="Logs"
							subTitle="Logs generated by the phase"
							logs={phaseDetails.data.logs}
						/>

						<Separator />
					</div>
				)}
			</div>
		</div>
	);
}

function ExecutionLabel({
	icon,
	label,
	value,
}: {
	icon: LucideIcon;
	label: React.ReactNode;
	value: React.ReactNode;
}) {
	const Icon = icon;
	return (
		<div className="flex items-center justify-between px-4 py-2">
			<div className="flex items-center gap-2 text-muted-foreground">
				<Icon size={20} className="stroke-muted-foreground/80" />
				<span>{label}</span>
			</div>
			<div className="flex items-center gap-2 font-semibold capitalize">
				{value}
			</div>
		</div>
	);
}

function ParametersViewer({
	title,
	subTitle,
	paramsJson,
}: {
	title: string;
	subTitle: string;
	paramsJson: string | null;
}) {
	const params = paramsJson ? JSON.parse(paramsJson) : undefined;

	return (
		<Card>
			<CardHeader className="rounded-lg rounded-b-none border-b bg-gray-50 dark:bg-background">
				<CardTitle className="text-base">{title}</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					{subTitle}
				</CardDescription>
			</CardHeader>

			<CardContent className="py-4">
				<div className="flex flex-col gap-2">
					{!params ||
						(Object.entries(params).length === 0 && (
							<p className="text-sm text-muted-foreground">No parameters</p>
						))}

					{params &&
						Object.entries(params).map(([key, value]) => (
							<div key={key} className="flex items-center gap-4">
								<p className="w-32 text-sm text-muted-foreground">{key}</p>
								<Input
									className="flex-1"
									readOnly
									value={
										typeof value === "string" ? value : JSON.stringify(value)
									}
								/>
							</div>
						))}
				</div>
			</CardContent>
		</Card>
	);
}

function LogViewer({
	logs,
	title = "Logs",
	subTitle = "Logs generated by the phase",
}: {
	logs: ExecutionLog[] | undefined;
	title?: string;
	subTitle?: string;
}) {
	if (!logs || logs.length === 0) return null;

	return (
		<Card className="w-full">
			<CardHeader className="rounded-lg rounded-b-none border-b bg-gray-50 dark:bg-background">
				<CardTitle className="text-base">{title}</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					{subTitle}
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<Table>
					<TableHeader className="text-sm text-muted-foreground">
						<TableRow>
							<TableHead>Time</TableHead>
							<TableHead>Level</TableHead>
							<TableHead>Message</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{logs.map((log) => (
							<TableRow key={log.id} className="text-muted-foreground">
								<TableCell
									width={190}
									className="p-[2px] pl-4 text-xs text-muted-foreground"
								>
									{log.timestamp?.toISOString()}
								</TableCell>
								<TableCell
									width={80}
									className={cn(
										"p-[3px] pl-4 text-xs font-bold uppercase",
										(log.logLevel as LogLevel) === "error" &&
											"text-destructive",
										(log.logLevel as LogLevel) === "info" && "text-primary",
										(log.logLevel as LogLevel) === "warn" && "text-yellow-500"
									)}
								>
									{log.logLevel}
								</TableCell>
								<TableCell className="flex-1 p-[3px] pl-4 text-sm">
									{log.message}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
