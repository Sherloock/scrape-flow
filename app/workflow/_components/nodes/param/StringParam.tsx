"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import React, { useEffect, useId, useState } from "react";

function StringParam({
	param,
	value,
	updateNodeParamValue,
	disabled,
}: ParamProps) {
	const [internalValue, setInternalValue] = useState(
		value ?? param.defaultValue ?? ""
	);
	const id = useId();

	useEffect(() => {
		setInternalValue(value ?? param.defaultValue ?? "");
	}, [value, param.defaultValue]);

	const Component = param.variant === "textarea" ? Textarea : Input;

	return (
		<div className="w-full space-y-1 p-1">
			<Label htmlFor={id} className="flex text-xs">
				{param.name}
				{param.required && <span className="px-2 text-red-400">*</span>}
			</Label>
			{!disabled && (
				<Component
					id={id}
					disabled={disabled}
					className="text-xs"
					placeholder="Enter value"
					value={internalValue ?? param.defaultValue ?? ""}
					onChange={(e: any) => setInternalValue(e.target.value)}
					onBlur={(e: any) => updateNodeParamValue(e.target.value)}
				/>
			)}

			{param.helperText && (
				<p className="px-2 text-xs text-muted-foreground">{param.helperText}</p>
			)}
		</div>
	);
}

export default StringParam;
