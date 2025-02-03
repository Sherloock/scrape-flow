"use client";

import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
	CalendarIcon,
	CircleDashedIcon,
	ClockIcon,
	CreditCardIcon,
	LucideIcon,
	WorkflowIcon,
} from "lucide-react";
import React from "react";

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
	const query = useQuery({
		queryKey: ["execution", initialData?.id],
		queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
		refetchInterval: (query) => {
			return query.state.data?.status === WorkflowExecutionStatus.RUNNING
				? 1000
				: false;
		},
	});

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

					<ExecutionLabel label="Duration" icon={ClockIcon} value={"TODO"} />

					<ExecutionLabel
						label="Credits consumed"
						icon={CreditCardIcon}
						value={"TODO"}
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
						<Button key={phase.id} className="w-full justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="outline">{index + 1}</Badge>
								<p className="font-semibold">{phase.name}</p>
							</div>
						</Button>
					))}
				</div>
			</aside>
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
