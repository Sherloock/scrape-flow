"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import React from "react";

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
	return (
		<Button>
			<PlayIcon size={16} className='' />
			<p>Execute</p>
		</Button>
	);
}
