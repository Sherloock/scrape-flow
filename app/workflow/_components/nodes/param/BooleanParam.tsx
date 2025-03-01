"use client";

import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function BooleanParam({
	param,
	value,
	updateNodeParamValue,
}: ParamProps) {
	const id = useId();

	// Set default value if none provided
	if (value === undefined || value === null) {
		value = param.defaultValue || "0";
		updateNodeParamValue(value);
	}

	// Convert string value to boolean for the Switch component
	const boolValue = value === "1";

	return (
		<div className="flex w-full flex-col gap-1">
			<div className="flex items-center justify-between">
				<Label className="flex text-xs" htmlFor={id}>
					{param.name}
					{param.required && <p className="px-2 text-red-400">*</p>}
				</Label>

				<Switch
					id={id}
					checked={boolValue}
					onCheckedChange={(checked) =>
						updateNodeParamValue(checked ? "1" : "0")
					}
				/>
			</div>
		</div>
	);
}
