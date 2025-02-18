import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { TaskType } from "@/types/task";
import { ExecutionEnv } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { FillInputExecutor } from "@/lib/workflow/executor/FillInputExecutor";
import { ClickElementExecutor } from "@/lib/workflow/executor/ClickElementExecutor";
import { WaitForElementExecutor } from "@/lib/workflow/executor/WaitForElementExecutor";

type ExecutorFn<T extends WorkflowTask> = (
	env: ExecutionEnv<T>
) => Promise<boolean>;

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
	LAUNCH_BROWSER: LaunchBrowserExecutor,
	PAGE_TO_HTML: PageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
	FILL_INPUT: FillInputExecutor,
	CLICK_ELEMENT: ClickElementExecutor,
	WAIT_FOR_ELEMENT: WaitForElementExecutor,
};
