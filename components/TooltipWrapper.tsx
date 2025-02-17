"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface Props {
	children: React.ReactNode;

	content: React.ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}

function TooltipWrapper(props: Props) {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>{props.children}</TooltipTrigger>
				<TooltipContent side={props.side} align={props.align}>
					{props.content}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default TooltipWrapper;
