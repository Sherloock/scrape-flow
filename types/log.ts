export const LogLevels = ["info", "warn", "error"] as const;
export type LogLevel = (typeof LogLevels)[number];
export type LogFn = (message: string, level?: LogLevel) => void;
export type Log = {
	level: LogLevel;
	message: string;
	timestamp: Date;
};

export type LogColletor = {
	getAll: () => Log[];
} & {
	[K in LogLevel]: LogFn;
};
