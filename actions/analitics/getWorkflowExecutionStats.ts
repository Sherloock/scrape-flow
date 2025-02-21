"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { DateFormat, monthToDateRange } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import { Month } from "@/types/analitics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { eachDayOfInterval, format } from "date-fns";
const { COMPLETED, FAILED } = WorkflowExecutionStatus;

type Stats = Record<string, { success: number; error: number }>;

export async function getWorkflowExecutionStats(month: Month): Promise<any> {
	const userId = checkAuth();

	const dateRange = monthToDateRange(month);

	const executions = await prisma.workflowExecution.findMany({
		where: {
			userId,
			startedAt: { gte: dateRange.startDate, lte: dateRange.endDate },
			// status: { in: [COMPLETED, FAILED] },
		},
	});

	const stats: Stats = Object.fromEntries(
		eachDayOfInterval({
			start: dateRange.startDate,
			end: dateRange.endDate,
		}).map((date) => [format(date, DateFormat.DATE), { success: 0, error: 0 }])
	);

	// todo: thisformat date: {success:0, error:0}
	for (const execution of executions) {
		const date = format(execution.startedAt!, DateFormat.DATE);

		if (execution.status === COMPLETED) {
			stats[date].success++;
		} else if (execution.status === FAILED) {
			stats[date].error++;
		}
	}

	const result = Object.entries(stats).map(([date, infos]) => ({
		date,
		...infos,
	}));

	return result;
}
