export enum AiApi {
	BUILT_IN = "BUILT_IN",
	OPENAI = "OPENAI",
	GOOGLE = "GOOGLE",
}

export enum AiModel {
	BUILT_IN = "gemini-2.0-flash",
	OPENAI = "gpt-4o-mini",
	GOOGLE = "gemini-2.0-flash",
}

export enum AiModelLabel {
	BUILT_IN = "Built-in (No API Key Required)",
	OPENAI = "OpenAI ChatGPT",
	GOOGLE = "Google Gemini",
}

export const AiModels = {
	[AiApi.BUILT_IN]: {
		model: AiModel.BUILT_IN,
		label: AiModelLabel.BUILT_IN,
		base_url: "https://generativelanguage.googleapis.com/v1beta/openai/",
	},
	[AiApi.GOOGLE]: {
		model: AiModel.GOOGLE,
		label: AiModelLabel.GOOGLE,
		base_url: "https://generativelanguage.googleapis.com/v1beta",
	},
	[AiApi.OPENAI]: {
		model: AiModel.OPENAI,
		label: AiModelLabel.OPENAI,
		base_url: "https://api.openai.com/v1",
	},
} as const;
