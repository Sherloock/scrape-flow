"use client";

import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
	title?: string;
	subtitle?: string;
	icon?: LucideIcon;
	iconClassName?: string;
	titleClassName?: string;
	subtitleClassName?: string;
}
function CustomDialogHeader(props: Props) {
	return (
		<>
			<DialogHeader>
				<DialogTitle className={props.titleClassName}>
					<div className='mb-2 flex flex-col items-center gap-2'>
						{props.icon && (
							<props.icon
								size={30}
								className={cn("stroke-primary", props.iconClassName)}
							/>
						)}
						{props.title && (
							<p className={cn("text-xl text-primary", props.titleClassName)}>
								{props.title}
							</p>
						)}
						{props.subtitle && (
							<p
								className={cn(
									"text-sm text-muted-foreground",
									props.subtitleClassName
								)}
							>
								{props.subtitle}
							</p>
						)}
					</div>
				</DialogTitle>
			</DialogHeader>

			<Separator className='my-4' />
		</>
	);
}

export default CustomDialogHeader;
