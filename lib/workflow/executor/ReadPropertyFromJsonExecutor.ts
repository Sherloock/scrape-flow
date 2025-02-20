import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/ReadPropertyFromJson";

const executor: IExecutor<typeof ReadPropertyFromJsonTask> = {
	...createExecutor(ReadPropertyFromJsonTask),
	execute: async (
		env: ExecutionEnv<typeof ReadPropertyFromJsonTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const json = env.getInput("JSON");
			const propertyPath = env.getInput("Property path");

			const parsedJson = JSON.parse(json);
			const propertyValue = getProperty(parsedJson, propertyPath);

			if (!propertyValue) {
				env.log.error("Property value not found");
				return false;
			}

			env.setOutput("Property value", propertyValue);
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

export const ReadPropertyFromJsonExecutor = executor.execute.bind(executor);
