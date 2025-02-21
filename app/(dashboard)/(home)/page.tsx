import { getStatsCardsData } from "@/actions/analitics/getStatsCardsData";
import { getUserActiveMonths } from "@/actions/analitics/getUserActiveMonths";
import MonthSelector from "@/app/(dashboard)/(home)/_components/MonthSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Month } from "@/types/analitics";
import React, { Suspense } from "react";

function HomePage({
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

			<StatsCard selectedMonth={yearMonth} />
		</div>
	);
}

async function MonthSelectorWrapper({ month }: { month: Month }) {
	const months = await getUserActiveMonths();
	return <MonthSelector months={months} selectedMonth={month} />;
}

async function StatsCard({ selectedMonth }: { selectedMonth: Month }) {
	const stats = await getStatsCardsData(selectedMonth);
	return <pre>{JSON.stringify(stats, null, 2)}</pre>;
}
export default HomePage;
