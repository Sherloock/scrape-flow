import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";
import { LaunchBrowserTask } from "./LaunchBrowser";

export const TaskRegistry = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
