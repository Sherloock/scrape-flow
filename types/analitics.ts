export type Month = {
	year: number;
	month: number;
};

export function getCurrentMonth(): Month {
	const date = new Date();
	return {
		year: date.getFullYear(),
		month: date.getMonth(),
	};
}
