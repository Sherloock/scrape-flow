"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { DateFormat, monthToDateRange } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import { Month } from "@/types/analitics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { eachDayOfInterval, format } from "date-fns";
const { COMPLETED, FAILED } = ExecutionPhaseStatus;

type Stats = Record<string, { success: number; error: number }>;

export async function getCreditsUsageStats(month: Month): Promise<any> {
	const userId = checkAuth();

	const dateRange = monthToDateRange(month);

	const executionPhases = await prisma.executionPhase.findMany({
		where: {
			userId,
			startedAt: { gte: dateRange.startDate, lte: dateRange.endDate },
			status: { in: [COMPLETED, FAILED] },
		},
	});

	const stats: Stats = Object.fromEntries(
		eachDayOfInterval({
			start: dateRange.startDate,
			end: dateRange.endDate,
		}).map((date) => [format(date, DateFormat.DATE), { success: 0, error: 0 }])
	);

	for (const phase of executionPhases) {
		const date = format(phase.startedAt!, DateFormat.DATE);

		if (phase.status === COMPLETED) {
			stats[date].success += phase.creditsConsumed ?? 0;
		} else if (phase.status === FAILED) {
			stats[date].error += phase.creditsConsumed ?? 0;
		}
	}

	const result = Object.entries(stats).map(([date, infos]) => ({
		date,
		...infos,
	}));

	return result;
}
