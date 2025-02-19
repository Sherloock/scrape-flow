import { ExecutionEnv } from "@/types/executor";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import * as cheerio from "cheerio";
import { createExecutor, IExecutor } from "./IExecutor";

const executor: IExecutor<typeof ExtractTextFromElementTask> = {
	...createExecutor(ExtractTextFromElementTask),
	execute: async (
		env: ExecutionEnv<typeof ExtractTextFromElementTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const selector = env.getInput("Selector");
			const html = env.getInput("Html");

			const $ = cheerio.load(html);
			const element = $(selector);
			if (!element) {
				env.log.error(`Element with selector ${selector} not found`);
				return false;
			}

			const text = $.text(element);
			if (!text) {
				env.log.error(`Element with selector ${selector} has no text`);
				return false;
			}

			env.setOutput("Extracted text", text);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

export const ExtractTextFromElementExecutor = executor.execute.bind(executor);
