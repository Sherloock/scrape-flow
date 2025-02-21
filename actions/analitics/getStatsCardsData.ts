"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { monthToDateRange } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import { Month } from "@/types/analitics";
import { WorkflowExecutionStatus } from "@/types/workflow";
const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function getStatsCardsData(month: Month): Promise<any> {
	const userId = checkAuth();

	const dateRange = monthToDateRange(month);

	const executions = await prisma.workflowExecution.findMany({
		where: {
			userId,
			startedAt: { gte: dateRange.startDate, lte: dateRange.endDate },
			status: { in: [COMPLETED, FAILED] },
		},
		select: {
			creditsConsumed: true,
			phases: {
				where: {
					creditsConsumed: {
						not: null,
					},
				},
				select: { creditsConsumed: true },
			},
		},
	});

	const stats = {
		workflowExecutions: executions.length,
		phasesExecutions: 0,
		creditsConsumed: 0,
	};

	executions.forEach((execution) => {
		stats.creditsConsumed += execution.creditsConsumed ?? 0;
		stats.phasesExecutions += execution.phases.length;
	});

	return stats;
}
