"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/GetWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCredits } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
	CalendarIcon,
	CircleDashedIcon,
	ClockIcon,
	CreditCardIcon,
	Loader2Icon,
	LucideIcon,
	WorkflowIcon,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
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

							<p className="text-xs text-muted-foreground">{phase.status}</p>
						</Button>
					))}
				</div>
			</aside>

			<div className="flex h-full w-full">
				<pre>{JSON.stringify(phaseDetails.data, null, 2)}</pre>
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

export default ExecutionViewer;
