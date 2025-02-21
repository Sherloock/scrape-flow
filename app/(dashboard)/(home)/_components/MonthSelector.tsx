"use client";

import { Month } from "@/types/analitics";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;
function MonthSelector({
	months,
	selectedMonth,
}: {
	months: Month[];
	selectedMonth: Month;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	return (
		<Select
			value={`${selectedMonth.year}-${selectedMonth.month}`}
			onValueChange={(value) => {
				const [year, month] = value.split("-");
				const params = new URLSearchParams(searchParams);
				params.set("year", year);
				params.set("month", month);
				router.push(`?${params.toString()}`);
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a month" />
			</SelectTrigger>
			<SelectContent>
				{months.map((interval, index) => (
					<SelectItem key={index} value={`${interval.year}-${interval.month}`}>
						{`${interval.year} ${MONTH_NAMES[interval.month]}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default MonthSelector;
