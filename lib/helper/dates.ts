import { Month } from "@/types/analitics";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";

export function DatesToDurationString(
	startDate: Date | null | undefined,
	endDate: Date | null | undefined
) {
	if (!startDate || !endDate) {
		return null;
	}

	const timeElapsed = endDate.getTime() - startDate.getTime();

	if (timeElapsed < 1000) {
		return `${timeElapsed}ms`;
	}

	const duration = intervalToDuration({
		start: startDate,
		end: endDate,
	});

	// Build duration string conditionally based on non-zero values
	const parts = [];
	if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
	if (duration.minutes && duration.minutes > 0)
		parts.push(`${duration.minutes}m`);
	parts.push(`${duration.seconds || 0}s`);

	return parts.join(" ");
}

export function monthToDateRange(month: Month): {
	startDate: Date;
	endDate: Date;
} {
	const startDate = startOfMonth(new Date(month.year, month.month));
	const endDate = endOfMonth(new Date(month.year, month.month));

	return { startDate, endDate };
}
