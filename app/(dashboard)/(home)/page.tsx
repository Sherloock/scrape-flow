import { getStatsCardsData } from "@/actions/analitics/getStatsCardsData";
import { getWorkflowExecutionStats } from "@/actions/analitics/getWorkflowExecutionStats";
import { getUserActiveMonths } from "@/actions/analitics/getUserActiveMonths";
import MonthSelector from "@/app/(dashboard)/(home)/_components/MonthSelector";
import StatsCard from "@/app/(dashboard)/(home)/_components/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helper/waitFor";
import { Month } from "@/types/analitics";
import { CirclePlayIcon, CreditCardIcon, WaypointsIcon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionStatusChart from "@/app/(dashboard)/(home)/_components/ExecutionStatusChart";
import { getCreditsUsageStats as getCreditUsageStats } from "@/actions/analitics/getCreditsUsageStats";
import CreditUsageChart from "@/app/(dashboard)/(home)/_components/CreditUsageChart";

async function HomePage({
	searchParams,
}: {
	searchParams: { year?: string; month?: string };
}) {
	const currentDate = new Date();
	const { year, month } = searchParams;

	const yearMonth: Month = {
		year: year ? parseInt(year) : currentDate.getFullYear(),
		month: month ? parseInt(month) : currentDate.getMonth(),
	};

	return (
		<div className="flex h-full flex-1 flex-col">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Home</h1>
				<Suspense fallback={<Skeleton className="h-[40px] w-[180px]" />}>
					<MonthSelectorWrapper month={yearMonth} />
				</Suspense>
			</div>

			<div className="flex h-full flex-1 flex-col gap-4 py-6">
				<Suspense fallback={<StatsCardSkeleton />}>
					<StatsCards selectedMonth={yearMonth} />
				</Suspense>

				<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
					<StatsExecutionStatus selectedMonth={yearMonth} />
				</Suspense>

				<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
					<CreditUsageMonth selectedMonth={yearMonth} />
				</Suspense>
			</div>
		</div>
	);
}

async function MonthSelectorWrapper({ month }: { month: Month }) {
	const months = await getUserActiveMonths();
	return <MonthSelector months={months} selectedMonth={month} />;
}

async function StatsCards({ selectedMonth }: { selectedMonth: Month }) {
	const stats = await getStatsCardsData(selectedMonth);
	return (
		<div className="grid min-h-[120px] grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-8">
			<StatsCard
				title="Workflow Executions"
				value={stats.workflowExecutions}
				icon={CirclePlayIcon}
			/>
			<StatsCard
				title="Phases Executions"
				value={stats.phasesExecutions}
				icon={WaypointsIcon}
			/>
			<StatsCard
				title="Credits Consumed"
				value={stats.creditsConsumed}
				icon={CreditCardIcon}
			/>
		</div>
	);
}

function StatsCardSkeleton() {
	return (
		<div className="grid min-h-[120px] grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-8">
			{Array.from({ length: 3 }).map((_, index) => (
				<Skeleton key={index} className="min-h-[120px] w-full" />
			))}
		</div>
	);
}

async function StatsExecutionStatus({
	selectedMonth,
}: {
	selectedMonth: Month;
}) {
	const data = await getWorkflowExecutionStats(selectedMonth);
	return <ExecutionStatusChart data={data} />;
}

async function CreditUsageMonth({ selectedMonth }: { selectedMonth: Month }) {
	const data = await getCreditUsageStats(selectedMonth);
	return (
		<CreditUsageChart
			data={data}
			title="Daily credits spent"
			description="Daily credit consumed in selected period"
		/>
	);
}
export default HomePage;
{
	/* <CreditUsageChart
	data={data}
	title="Daily credits spent"
	description="Daily credit consumed in selected period"
/>; */
}
