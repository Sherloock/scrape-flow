import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { ExtractDataWithAiTask } from "@/lib/workflow/task/ExtractDataWithAi";
import { getDecryptedCredential } from "@/actions/credentials/getDecryptedCredential";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
const SYSTEM_PROMPT =
	"You are a highly accurate web scraping assistant that extracts data from provided HTML or text content. You will receive: (1) a piece of HTML or text, and (2) a specific prompt describing the data to extract. Your output must strictly adhere to the following rules: \
    1. Return **only** the extracted data as a **valid JSON object or array**—no extra text, explanations, or comments. \
    2. If no matching data is found, return an **empty JSON array** (`[]`). \
    3. The output must always be **well-formatted, syntactically correct JSON**, suitable for parsing without errors. \
    4. Extract data with **precision and completeness**, following the prompt exactly—do not infer or include unrelated information. \
    5. Ensure **consistent data structures** across all extracted entries (e.g., identical keys in objects within an array). \
    6. When extracting lists, tables, or repeated structures, return an **array of objects**, where each object represents a single item or row. \
    7. If nested data is requested, use **nested JSON objects** appropriately. \
    8. **Do not include null or empty values** unless explicitly required by the prompt. \
    Work strictly within the provided content, and never add assumptions or additional information beyond the specified prompt.";
const GEMINI_MODEL = "gemini-2.0-flash";
const OPENAI_MODEL = "gpt-4o-mini";
const MAX_OUTPUT_TOKENS = 8096;
const TEMPERATURE = 1;

// TODO: implement UI for AI model selection
// TODO: let the user choose to use my API key or their own

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
			const credentialId = env.getInput("Credential");
			const decryptedCredential = await getDecryptedCredential(credentialId);

			const result = await GOOGLE_GEMINI_extractData(
				env,
				content,
				prompt,
				decryptedCredential
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

async function GOOGLE_GEMINI_extractData(
	env: ExecutionEnv<typeof ExtractDataWithAiTask>,
	content: string,
	prompt: string,
	decryptedCredential: string
): Promise<string | null> {
	const googleAI = new GoogleGenerativeAI(decryptedCredential);

	const model = await googleAI.getGenerativeModel({
		model: GEMINI_MODEL,
		generationConfig: {
			temperature: TEMPERATURE,
			topP: 1,
			topK: 10,
			maxOutputTokens: MAX_OUTPUT_TOKENS,
		},
	});

	const requestPrompt = `
SYSTEM PROMPT:
${SYSTEM_PROMPT}

USER PROMPT:
this is the prompt that describes the data to extract:
${prompt}

USER CONTENT:
this is the content to extract data from:
${content}
`;

	const contentResult = await model.generateContent(requestPrompt);
	const response = contentResult.response;

	env.log.info(`Prompt tokens: ${response.usageMetadata?.promptTokenCount}`);
	env.log.info(
		`Completion tokens: ${response.usageMetadata?.candidatesTokenCount}`
	);
	env.log.info(`Total tokens: ${response.usageMetadata?.totalTokenCount}`);

	// this api wraps the result in ```json{...}```
	const rawResult = response.text();

	if (!rawResult) {
		env.log.error("Empty response from AI");
		return null;
	}

	try {
		const result = rawResult.replace(/^```json\s*|\s*```$/g, "");
		// Parse and re-stringify to clean up formatting
		const parsed = JSON.parse(result);
		return JSON.stringify(parsed);
	} catch (error) {
		env.log.error("Failed to parse AI response as JSON");
		return null;
	}
}

async function _OPENAI_extractData(
	env: ExecutionEnv<typeof ExtractDataWithAiTask>,
	content: string,
	prompt: string,
	decryptedCredential: string
): Promise<string | null> {
	const openai = new OpenAI({
		apiKey: decryptedCredential,
	});

	const response = await openai.chat.completions.create({
		model: OPENAI_MODEL,
		messages: [
			{
				role: "system",
				content: SYSTEM_PROMPT,
			},
			{
				role: "user",
				content: content,
			},
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: TEMPERATURE,
		max_tokens: MAX_OUTPUT_TOKENS,
	});

	env.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
	env.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);
	env.log.info(`Total tokens: ${response.usage?.total_tokens}`);

	const result = response.choices[0].message?.content;
	if (!result) {
		env.log.error("Empty response from AI");
		return null;
	}

	try {
		const parsed = JSON.parse(result);
		return JSON.stringify(parsed);
	} catch (error) {
		env.log.error("Failed to parse AI response as JSON");
		return null;
	}
}

export const ExtractDataWithAiExecutor = executor.execute.bind(executor);
