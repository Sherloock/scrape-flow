import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LaunchBrowserTask } from "./LaunchBrowser";

type Registry = {
	[K in TaskType]: WorkflowTask & { type: K };
};
export const TaskRegistry: Registry = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
