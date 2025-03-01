// Constants for file size units and labels
const SIZE_UNITS = [
	{ value: 1, label: "B" },
	{ value: 1024, label: "KB" },
	{ value: 1024 * 1024, label: "MB" },
	{ value: 1024 * 1024 * 1024, label: "GB" },
	{ value: 1024 * 1024 * 1024 * 1024, label: "TB" },
];

export const formatSize = (bytes: number): string => {
	// Handle special case for 0 bytes
	if (bytes === 0) return `0 ${SIZE_UNITS[0].label}`;

	// Find the appropriate unit
	const unitIndex = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		SIZE_UNITS.length - 1
	);

	// Calculate the value in the selected unit
	const value = bytes / SIZE_UNITS[unitIndex].value;

	// Format with 2 decimal places and the appropriate label
	return `${value.toFixed(2)} ${SIZE_UNITS[unitIndex].label}`;
};
