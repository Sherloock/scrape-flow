import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";

// type ExecutorRegistry = {
// 	[K in ExecutorType]: (phase: ExecutionPhase, node: AppNode) => Promise<boolean>;
// };

export const ExecutorRegistry: any = {
	LAUNCH_BROWSER: LaunchBrowserExecutor,
	PAGE_TO_HTML: PageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
};
