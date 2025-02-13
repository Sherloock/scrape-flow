import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { AppNode } from "@/types/appNode";

export function CalculateCreditsCost(nodes: AppNode[]): number {
	return nodes.reduce((acc, node) => {
		return acc + TaskRegistry[node.data.type].credits;
	}, 0);
}
