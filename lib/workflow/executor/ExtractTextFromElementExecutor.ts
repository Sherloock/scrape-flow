import { Env, ExecutionEnv } from "@/types/executor";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import * as cheerio from "cheerio";
export async function ExtractTextFromElementExecutor(
	env: ExecutionEnv<typeof ExtractTextFromElementTask>
): Promise<boolean> {
	try {
		const selector = env.getInput("Selector");
		if (!selector) {
			env.log.error("Selector not defined");
			return false;
		}

		const html = env.getInput("Html");
		if (!html) {
			env.log.error("HTML not defined");
			return false;
		}

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
}
