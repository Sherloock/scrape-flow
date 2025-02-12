import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
function ReactCountUpWrapper({ value }: { value: number }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return "-";

	return <CountUp end={value} duration={0.5} decimals={0} />;
}

export default ReactCountUpWrapper;
