import { Log, LogFn, LogLevel, LogLevels } from "@/types/log";

import { LogColletor } from "@/types/log";

export function createLogCollector(): LogColletor {
	const logs: Log[] = [];

	const logFns = {} as Record<LogLevel, LogFn>;

	for (const level of LogLevels) {
		logFns[level] = (message: string) => {
			logs.push({ message, level, timestamp: new Date() });
		};
	}

	return {
		getAll: () => logs,
		...logFns,
	};
}
