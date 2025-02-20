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
import { useQuery } from "@tanstack/react-query";
import { getCredentials } from "@/actions/credentials/getCredentials";

export default function CredentialParam({
	param,
	value,
	updateNodeParamValue,
}: ParamProps) {
	const id = useId();

	const query = useQuery({
		queryKey: ["credentials"],
		queryFn: () => getCredentials(),
		refetchInterval: 10000,
	});

	return (
		<div className="flex w-full flex-col gap-1">
			<Label className="flex text-xs" htmlFor={id}>
				{param.name}
				{param.required && <p className="px-2 text-red-400">*</p>}
			</Label>

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

						{query.data?.map((credential) => (
							<SelectItem key={credential.id} value={credential.id}>
								{credential.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
