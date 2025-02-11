import { LogColletor } from "@/types/log";
import { WorkflowTask } from "@/types/workflow";
import { Browser, Page } from "puppeteer";

export type Env = {
	browser?: Browser;
	page?: Page;
	phases: Record<
		string, // node.id === task.id
		{
			inputs: Record<string, string>;
			outputs: Record<string, string>;
		}
	>;
};

export type ExecutionEnv<T extends WorkflowTask> = {
	getInput: (name: T["inputs"][number]["name"]) => string;
	setOutput: (name: T["outputs"][number]["name"], value: string) => void;

	getBrowser: () => Browser | undefined;
	setBrowser: (browser: Browser) => void;

	getPage: () => Page | undefined;
	setPage: (page: Page) => void;

	log: LogColletor;
};
