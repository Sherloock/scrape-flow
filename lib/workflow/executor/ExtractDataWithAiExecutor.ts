import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { ExtractDataWithAiTask } from "@/lib/workflow/task/ExtractDataWithAi";
import { getDecryptedCredential } from "@/actions/credentials/getDecryptedCredential";

const executor: IExecutor<typeof ExtractDataWithAiTask> = {
	...createExecutor(ExtractDataWithAiTask),
	execute: async (
		env: ExecutionEnv<typeof ExtractDataWithAiTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const content = env.getInput("Content");
			const prompt = env.getInput("Prompt");
			const credentialId = env.getInput("Credentials");
			const decryptedCredential = await getDecryptedCredential(credentialId);

			const mockExtractedData = {
				usernameSelector: "#username",
				passwordSelector: "#password",
				loginSelector: "body > div > form > input.btn.btn-primary",
			};

			env.setOutput("Extracted data", JSON.stringify(mockExtractedData));

			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const ExtractDataWithAiExecutor = executor.execute.bind(executor);
