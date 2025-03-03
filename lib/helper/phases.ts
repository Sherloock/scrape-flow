import { ExecutionPhase } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;

export function getTotalCreditsConsumed(phases: Phase[]) {
	return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}

export function getTotalAICreditsConsumed(
	phases: Array<{
		aiUsage?: {
			creditsConsumed: number | Decimal;
		} | null;
	}>
) {
	return phases.reduce((acc, phase) => {
		const consumed = phase.aiUsage ? Number(phase.aiUsage.creditsConsumed) : 0;
		return acc + consumed;
	}, 0);
}
