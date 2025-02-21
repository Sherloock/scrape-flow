"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { prisma } from "@/lib/prisma";
import { Month } from "@/types/analitics";
export async function getUserActiveMonths(): Promise<Month[]> {
	const userId = checkAuth();

	const wfeYears = await prisma.workflowExecution.aggregate({
		where: {
			userId,
		},
		_min: {
			startedAt: true,
		},
	});

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const firstYear = wfeYears._min.startedAt
		? new Date(wfeYears._min.startedAt).getFullYear()
		: currentYear;
	const firstMonth = wfeYears._min.startedAt
		? new Date(wfeYears._min.startedAt).getMonth()
		: currentMonth;

	const intervals: Month[] = [];
	for (let year = firstYear; year <= currentYear; year++) {
		const startMonth = year === firstYear ? firstMonth : 0;
		const endMonth = year === currentYear ? currentMonth : 11;

		for (let month = startMonth; month <= endMonth; month++) {
			intervals.push({ year, month });
		}
	}

	return intervals;
}
