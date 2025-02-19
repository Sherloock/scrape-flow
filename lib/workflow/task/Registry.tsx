import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { FillInputTask } from "@/lib/workflow/task/FillInput";
import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";
import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook";
import { ExtractDataWithAiTask } from "@/lib/workflow/task/ExtractDataWithAi";

type Registry = {
	[K in TaskType]: WorkflowTask & { type: K };
};
export const TaskRegistry: Registry = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
	FILL_INPUT: FillInputTask,
	CLICK_ELEMENT: ClickElementTask,
	WAIT_FOR_ELEMENT: WaitForElementTask,
	DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
	EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask,
};
