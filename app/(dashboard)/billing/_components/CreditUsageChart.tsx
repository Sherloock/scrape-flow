"use client";

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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStackedIcon, Layers2 } from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
} from "recharts";
import { getCreditsUsageStats } from "@/actions/analitics/getCreditsUsageStats";

type ChartData = Awaited<ReturnType<typeof getCreditsUsageStats>>;
const chartConfig = {
	success: {
		label: "Successfull Phase Credits",
		color: "hsl(var(--chart-2))",
	},
	error: {
		label: "Failed Phase Credits",
		color: "hsl(var(--chart-1))",
	},
};

function CreditUsageChart({
	data,
	title,
	description,
}: {
	data: ChartData;
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<ChartColumnStackedIcon size={24} className="text-primary" />
					{title}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="max-h-[200px] w-full">
					<BarChart
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
						<Bar
							radius={[0, 0, 4, 4]}
							dataKey="success"
							fill={`var(--color-success)`}
							stroke={`var(--color-success)`}
							fillOpacity={0.8}
							stackId={"a"}
						/>
						<Bar
							radius={[4, 4, 0, 0]}
							dataKey="error"
							fill={`var(--color-error)`}
							stroke={`var(--color-error)`}
							fillOpacity={0.8}
							stackId={"a"}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default CreditUsageChart;
