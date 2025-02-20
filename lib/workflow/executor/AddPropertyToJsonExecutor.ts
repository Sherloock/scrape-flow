import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson";

const executor: IExecutor<typeof AddPropertyToJsonTask> = {
	...createExecutor(AddPropertyToJsonTask),
	execute: async (
		env: ExecutionEnv<typeof AddPropertyToJsonTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const json = env.getInput("JSON");
			const propertyName = env.getInput("Property name");
			const propertyValue = env.getInput("Property value");

			const parsedJson = JSON.parse(json);
			parsedJson[propertyName] = propertyValue;

			env.setOutput("JSON", JSON.stringify(parsedJson));
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

function getProperty(obj: any, path: string) {
	return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export const AddPropertyToJsonExecutor = executor.execute.bind(executor);
