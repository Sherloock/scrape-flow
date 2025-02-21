import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { LucideIcon } from "lucide-react";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

interface Props {
	title: string;
	value: number;
	icon: LucideIcon;
}

export default function StatsCard(props: Props) {
	return (
		<Card className="relative h-full overflow-hidden">
			<CardHeader className="flex pb-2">
				<CardTitle className="flex items-center gap-2">
					{props.title}
					<props.icon
						size={120}
						className="absolute -bottom-4 -right-8 stroke-primary text-muted-foreground opacity-10"
					/>
				</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="text-xl font-bold text-primary">
					<ReactCountUpWrapper value={props.value} />
				</div>
			</CardContent>
		</Card>
	);
}
