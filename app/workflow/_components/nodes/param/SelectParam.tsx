"use client";

import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type OptionType = {
	label: string;
	value: string;
};

export default function SelectParam({
	param,
	value,
	updateNodeParamValue,
}: ParamProps) {
	const id = useId();

	return (
		<div className="flex w-full flex-col gap-1">
			<Label className="flex text-xs" htmlFor={id}>
				{param.name}
			</Label>

			{param.required && <p className="px-2 text-red-400">*</p>}

			<Select
				onValueChange={(value) => updateNodeParamValue(value)}
				defaultValue={value}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={"Select an option"} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{"Options"}</SelectLabel>

						{param.options.map((option: OptionType) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
