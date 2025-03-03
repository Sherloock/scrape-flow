"use client";

import React from "react";
import CountUp from "react-countup";
function ReactCountUpWrapper({
	value,
	decimals = 0,
}: {
	value: number;
	decimals?: number;
}) {
	// const [mounted, setMounted] = useState(false);

	// useEffect(() => {
	// 	setMounted(true);
	// }, []);

	// if (!mounted) return "-";

	return <CountUp end={value} duration={0.5} decimals={decimals} />;
}

export default ReactCountUpWrapper;
