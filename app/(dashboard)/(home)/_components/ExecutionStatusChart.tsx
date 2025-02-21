"use client";

import { getWorkflowExecutionStats } from "@/actions/analitics/getWorkflowExecutionStats";
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartContent,
	ChartLegend,
	ChartLegendContent,
	ChartTitle,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Layers2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>;
const chartConfig = {
	success: {
		label: "Success",
		color: "hsl(var(--chart-2))",
	},
	error: {
		label: "Error",
		color: "hsl(var(--chart-1))",
	},
};

function ExecutionStatusChart({ data }: { data: ChartData }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<Layers2 size={24} className="text-primary" />
					Workflow execution status
				</CardTitle>
				<CardDescription>
					Daily number of workflow executions and their statuses
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="max-h-[200px] w-full">
					<AreaChart
						data={data}
						className="max-h-[200px] w-full"
						accessibilityLayer
						margin={{ top: 20 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<YAxis tickLine={false} axisLine={false} />
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip
							content={<ChartTooltipContent className="w-[250px]" />}
						/>
						<Area
							dataKey="success"
							min={0}
							type={"bump"}
							fill={`var(--color-success)`}
							stroke={`var(--color-success)`}
							fillOpacity={0.6}
							stackId={"a"}
						/>
						<Area
							dataKey="error"
							min={0}
							type={"bump"}
							fill={`var(--color-error)`}
							stroke={`var(--color-error)`}
							fillOpacity={0.6}
							stackId={"a"}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default ExecutionStatusChart;
