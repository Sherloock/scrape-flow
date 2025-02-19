import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { TaskType } from "@/types/task";
import { ExecutionEnv } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { FillInputExecutor } from "@/lib/workflow/executor/FillInputExecutor";
import { ClickElementExecutor } from "@/lib/workflow/executor/ClickElementExecutor";
import { WaitForElementExecutor } from "@/lib/workflow/executor/WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "@/lib/workflow/executor/DeliverViaWebhookExecutor";

type ExecutorFn<T extends WorkflowTask> = (
	env: ExecutionEnv<T>
) => Promise<boolean>;

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
	[TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
	[TaskType.PAGE_TO_HTML]: PageToHtmlExecutor,
	[TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor,
	[TaskType.FILL_INPUT]: FillInputExecutor,
	[TaskType.CLICK_ELEMENT]: ClickElementExecutor,
	[TaskType.WAIT_FOR_ELEMENT]: WaitForElementExecutor,
	[TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookExecutor,
};
