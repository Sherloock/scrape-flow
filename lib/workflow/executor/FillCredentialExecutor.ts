import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { getDecryptedCredential } from "@/actions/credentials/getDecryptedCredential";
import { FillCredentialTask } from "@/lib/workflow/task/FillCredential";

const executor: IExecutor<typeof FillCredentialTask> = {
	...createExecutor(FillCredentialTask),
	execute: async (
		env: ExecutionEnv<typeof FillCredentialTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const selector = env.getInput("Input selector");
			const credentialId = env.getInput("Credential");
			const decryptedCredential = await getDecryptedCredential(credentialId);

			await env.getPage()!.type(selector, decryptedCredential);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const FillCredentialExecutor = executor.execute.bind(executor);
