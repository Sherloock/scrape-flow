// import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor"; // s the default executor for puppeteer browser instance
// import { LaunchBrowserExecutor } from "./LaunchBrowserExecutorBrightData"; // is the executor for puppeteer browser instance using bright data
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutorExtraStealth"; // is the executor for puppeteer browser instance using extra stealth
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { TaskType } from "@/types/task";
import { ExecutionEnv } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { FillInputExecutor } from "@/lib/workflow/executor/FillInputExecutor";
import { ClickElementExecutor } from "@/lib/workflow/executor/ClickElementExecutor";
import { WaitForElementExecutor } from "@/lib/workflow/executor/WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "@/lib/workflow/executor/DeliverViaWebhookExecutor";
import { ExtractDataWithAiExecutor } from "@/lib/workflow/executor/ExtractDataWithAiExecutor";
import { ReadPropertyFromJsonExecutor } from "@/lib/workflow/executor/ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "@/lib/workflow/executor/AddPropertyToJsonExecutor";
import { NavigateToUrlExecutor } from "@/lib/workflow/executor/NavigateToUrlExecutor";
import { ScrollToElementExecutor } from "@/lib/workflow/executor/ScrollToElementExecutor";
import { FillCredentialExecutor } from "@/lib/workflow/executor/FillCredentialExecutor";
import { ClearHtmlExecutor } from "@/lib/workflow/executor/ClearHtmlExecutor";

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
	[TaskType.FILL_CREDENTIAL]: FillCredentialExecutor,
	[TaskType.CLICK_ELEMENT]: ClickElementExecutor,
	[TaskType.WAIT_FOR_ELEMENT]: WaitForElementExecutor,
	[TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookExecutor,
	[TaskType.EXTRACT_DATA_WITH_AI]: ExtractDataWithAiExecutor,
	[TaskType.READ_PROPERTY_FROM_JSON]: ReadPropertyFromJsonExecutor,
	[TaskType.ADD_PROPERTY_TO_JSON]: AddPropertyToJsonExecutor,
	[TaskType.NAVIGATE_TO_URL]: NavigateToUrlExecutor,
	[TaskType.SCROLL_TO_ELEMENT]: ScrollToElementExecutor,
	[TaskType.CLEAR_HTML]: ClearHtmlExecutor,
};
