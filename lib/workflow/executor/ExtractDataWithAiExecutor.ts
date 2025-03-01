import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { ExtractDataWithAiTask } from "@/lib/workflow/task/ExtractDataWithAi";
import { getDecryptedCredential } from "@/actions/credentials/getDecryptedCredential";
import { OpenAI } from "openai";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiApi, AiModels } from "@/types/ai";
const SYSTEM_PROMPT =
	"You are a highly precise web scraping assistant tasked with extracting structured data from provided HTML or text content. You will receive the following user inputs: (1) `___CONTENT___:`—the raw HTML or text to process, (2) `___PROMPT___`—a detailed description of the data to extract, and (3) `___FORMAT___`—the expected output structure. Your response must strictly adhere to these rules: 1. Return **only** the extracted data in the exact format specified by `___FORMAT___`—no additional text, explanations, or comments. 2. If the format is JSON and no relevant data is found, return an **empty JSON array** (`[]`). For other formats, return an appropriate empty value. 3. The output must always follow the exact format specified in `___FORMAT___` (JSON, CSV, comma-separated values, etc.). 4. Extract data with **precision and completeness**, strictly following the `___PROMPT___` without inference or inclusion of unrelated details. 5. Maintain **consistent data structures** for all extracted entries when applicable. 6. When handling lists, tables, or repeating elements in JSON format, return an **array of objects**, with each object representing a distinct item or row. 7. If hierarchical data is required and JSON is specified, structure it using **nested JSON objects** accordingly. 8. **Do not include null or empty values** unless explicitly stated in the `___PROMPT___`. Your extraction must be strictly based on the given `___CONTENT___`, without making assumptions or introducing any additional information beyond the specified `___PROMPT___` and `___FORMAT___`.";
const MAX_OUTPUT_TOKENS = 8096;
const TEMPERATURE = 1;

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
			const api = env.getInput("API") as AiApi;
			const format = env.getInput("Format of extracted data");
			const apiKey =
				api === AiApi.BUILT_IN
					? process.env.GEMINI_API_KEY!
					: await getDecryptedCredential(env.getInput("API Key"));

			// TODO more inputs like
			// - temperature
			// - max output tokens
			// - max token

			const result = await extractData(
				api,
				apiKey,
				env,
				content,
				prompt,
				format
			);

			if (!result) {
				env.log.error("Empty response from AI");
				return false;
			}

			env.setOutput("Extracted data", result);

			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

async function extractData(
	api: AiApi,
	apiKey: string,
	env: ExecutionEnv<typeof ExtractDataWithAiTask>,
	content: string,
	prompt: string,
	format: string
): Promise<string | null> {
	const openai = new OpenAI({
		apiKey: apiKey,
		baseURL: AiModels[api].base_url,
	});

	const response = await openai.chat.completions.create({
		model: AiModels[api].model,
		messages: [
			{
				role: "system",
				content: SYSTEM_PROMPT,
			},
			{
				role: "user",
				content: `___CONTENT___: ${content}!`,
			},
			{
				role: "user",
				content: `___PROMPT___: ${prompt}!`,
			},
			{
				role: "user",
				content: `___FORMAT___: ${format}! `,
			},
		],
		temperature: TEMPERATURE,
		max_tokens: MAX_OUTPUT_TOKENS,
	});

	console.log({ OPENAI_response: response });

	const inputTokens = response.usage?.prompt_tokens ?? 0;
	const outputTokens = response.usage?.completion_tokens ?? 0;
	// const totalTokens = response.usage?.total_tokens ?? 0;

	const isPayForUsage = api === AiApi.BUILT_IN;
	env.log.info(
		`Input tokens: ${inputTokens}${isPayForUsage ? ` (${process.env.GEMINI_INPUT_TOKEN_PRICE} credit / 1million tokens)` : ""}`
	);
	env.log.info(
		`Output tokens: ${outputTokens}${isPayForUsage ? ` (${process.env.GEMINI_OUTPUT_TOKEN_PRICE} credit / 1million tokens)` : ""}`
	);
	// env.log.info(`Total tokens: ${totalTokens}`);

	if (isPayForUsage) {
		// 25credit/1m input token
		// 100credit/1m output token
		const creditsConsumed =
			(inputTokens * Number(process.env.GEMINI_INPUT_TOKEN_PRICE!) +
				outputTokens * Number(process.env.GEMINI_OUTPUT_TOKEN_PRICE!)) /
			1000000;
		const roundedCreditsConsumed = Math.round(creditsConsumed);
		env.log.info(
			`Extra credits consumed by AI api usage: ${creditsConsumed.toFixed(6)} -> rounded to ${roundedCreditsConsumed} credits, which will be deducted from your account`
		);
		// TODO: do the actual credit usage
	}
	const rawResult = response.choices[0].message?.content;

	if (!rawResult) {
		env.log.error("Empty response from AI");
		return null;
	}

	// More robust handling of response based on expected format
	let result = rawResult;

	// Check if the content appears to be wrapped in code blocks
	if (/^```(\w*)\s*[\s\S]*\s*```$/.test(rawResult)) {
		// Remove code block markers (handles any language identifier, not just json)
		result = rawResult.replace(/^```(\w*)\s*|\s*```$/g, "");
		env.log.info("Removed code block markers from AI response");
	}

	// Only try to validate as JSON if the format explicitly requests JSON
	if (format.toLowerCase().includes("json")) {
		try {
			JSON.parse(result);
			env.log.info("Successfully validated JSON response");
		} catch (error) {
			env.log.warn("Expected JSON format but received invalid JSON");
		}
	} else {
		env.log.info("Non-JSON format requested, returning raw content");
	}

	return result;

	// try {
	// 	const parsed = JSON.parse(result);
	// 	return JSON.stringify(parsed);
	// } catch (error) {
	// 	env.log.error("Failed to parse AI response as JSON");
	// 	return null;
	// }
}

// async function OPENAI_extractData(
// 	env: ExecutionEnv<typeof ExtractDataWithAiTask>,
// 	content: string,
// 	prompt: string,
// 	apiKey: string,
// 	isUseMyApiKey: boolean = false
// ): Promise<string | null> {
// 	const openai = new OpenAI({
// 		apiKey: apiKey,
// 	});

// 	const response = await openai.chat.completions.create({
// 		model: AiModel.OPENAI,
// 		messages: [
// 			{
// 				role: "system",
// 				content: SYSTEM_PROMPT,
// 			},
// 			{
// 				role: "user",
// 				content: content,
// 			},
// 			{
// 				role: "user",
// 				content: prompt,
// 			},
// 		],
// 		temperature: TEMPERATURE,
// 		max_tokens: MAX_OUTPUT_TOKENS,
// 	});

// 	console.log({ OPENAI_response: response });

// 	env.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
// 	env.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);
// 	env.log.info(`Total tokens: ${response.usage?.total_tokens}`);

// 	const result = response.choices[0].message?.content;
// 	if (!result) {
// 		env.log.error("Empty response from AI");
// 		return null;
// 	}

// 	try {
// 		const parsed = JSON.parse(result);
// 		return JSON.stringify(parsed);
// 	} catch (error) {
// 		env.log.error("Failed to parse AI response as JSON");
// 		return null;
// 	}
// }

// async function BUILT_IN_extractData(
// 	env: ExecutionEnv<typeof ExtractDataWithAiTask>,
// 	content: string,
// 	prompt: string,
// 	apiKey: string
// ): Promise<string | null> {
// 	return GOOGLE_extractData(env, content, prompt, apiKey, true);
// }
// async function GOOGLE_extractData(
// 	env: ExecutionEnv<typeof ExtractDataWithAiTask>,
// 	content: string,
// 	prompt: string,
// 	decryptedCredential: string,
// 	isUseMyApiKey: boolean = false
// ): Promise<string | null> {
// 	const googleAI = new GoogleGenerativeAI(decryptedCredential);

// 	const model = await googleAI.getGenerativeModel({
// 		model: AiModel.GOOGLE,
// 		generationConfig: {
// 			temperature: TEMPERATURE,
// 			topP: 1,
// 			topK: 10,
// 			maxOutputTokens: MAX_OUTPUT_TOKENS,
// 		},
// 	});

// 	const requestPrompt = `
// SYSTEM PROMPT:
// ${SYSTEM_PROMPT}

// USER PROMPT:
// this is the prompt that describes the data to extract:
// ${prompt}

// USER CONTENT:
// this is the content to extract data from:
// ${content}
// `;

// 	const contentResult = await model.generateContent(requestPrompt);
// 	const response = contentResult.response;

// 	console.log({ GOOGLE_response: response });

// 	env.log.info(`Prompt tokens: ${response.usageMetadata?.promptTokenCount}`);
// 	env.log.info(
// 		`Completion tokens: ${response.usageMetadata?.candidatesTokenCount}`
// 	);
// 	env.log.info(`Total tokens: ${response.usageMetadata?.totalTokenCount}`);

// 	// this api wraps the result in ```json{...}```
// 	const rawResult = response.text();

// 	if (!rawResult) {
// 		env.log.error("Empty response from AI");
// 		return null;
// 	}

// 	try {
// 		const result = rawResult.replace(/^```json\s*|\s*```$/g, "");
// 		// Parse and re-stringify to clean up formatting
// 		const parsed = JSON.parse(result);
// 		return JSON.stringify(parsed);
// 	} catch (error) {
// 		env.log.error("Failed to parse AI response as JSON");
// 		return null;
// 	}
// }

export const ExtractDataWithAiExecutor = executor.execute.bind(executor);
