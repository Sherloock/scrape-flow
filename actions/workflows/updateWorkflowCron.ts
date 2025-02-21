"use server";

import { checkAuth } from "@/actions/auth/checkAuth";
import { DateFormat } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import cronExpressionParser from "cron-parser";
import { revalidatePath } from "next/cache";
export async function updateWorkflowCron(data: {
	workflowId: string;
	cron: string;
}) {
	const userId = checkAuth();

	try {
		const interval = cronExpressionParser.parse(data.cron, {
			tz: DateFormat.TIMEZONE,
		});

		const workflow = await prisma.workflow.update({
			where: {
				id: data.workflowId,
				userId,
			},
			data: { cron: data.cron, nextRunAt: interval.next().toDate() },
		});
	} catch (error: any) {
		console.error(`Invalid cron expression: ${error.message}`);
		throw new Error("Invalid cron expression");
	}

	revalidatePath("/workflows");
}
