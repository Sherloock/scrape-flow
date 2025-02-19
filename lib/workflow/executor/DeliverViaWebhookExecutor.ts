import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook";
import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof DeliverViaWebhookTask> = {
	...createExecutor(DeliverViaWebhookTask),
	execute: async (
		env: ExecutionEnv<typeof DeliverViaWebhookTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const targetUrl = env.getInput("Target URL");
			const body = env.getInput("Body");

			const response = await fetch(targetUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			const status = response.status;

			if (status !== 200) {
				env.log.error(`Failed to deliver to webhook: ${status}`);
				return false;
			}

			env.log.info(`Delivered to webhook: ${targetUrl}`);

			const responseBody = await response.json();
			env.log.info(
				`Response from webhook: ${JSON.stringify(responseBody, null, 2)}`
			);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const DeliverViaWebhookExecutor = executor.execute.bind(executor);
