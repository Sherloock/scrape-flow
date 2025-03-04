import { ExecutionEnv } from "@/types/executor";
import { createExecutor, IExecutor } from "./IExecutor";
import { ClearHtmlTask } from "@/lib/workflow/task/ClearHtml";
import { formatSize } from "@/lib/helper/fileSize";
import { JSDOM } from "jsdom";

const executor: IExecutor<typeof ClearHtmlTask> = {
	...createExecutor(ClearHtmlTask),
	execute: async (
		env: ExecutionEnv<typeof ClearHtmlTask>
	): Promise<boolean> => {
		try {
			if (!executor.validateRequiredInputs(env)) {
				return false;
			}

			const html = env.getInput("HTML");
			const clearHead = env.getInput("remove <head> tag");
			const clearScript = env.getInput("remove <script> tag");
			const clearStyle = env.getInput("remove <style> tag");
			const clearLink = env.getInput("remove <link> tag");
			const clearMeta = env.getInput("remove <meta> tag");
			const clearClassAttr = env.getInput("remove 'class' attribute");
			const clearStyleAttr = env.getInput("remove 'style' attribute");

			// Add new configuration options
			const clearComments = env.getInput("remove comments");
			const clearDataAttrs = env.getInput("remove data-* attributes");
			const clearEmptyAttrs = env.getInput("remove empty attributes");
			const clearInlineEvents = env.getInput("remove inline events");
			const minifyHtml = env.getInput("minify HTML");
			const removeHiddenElements = env.getInput("remove hidden elements");
			const removeEmptyElements = env.getInput("remove empty elements");
			const keepMainContent = env.getInput("keep only main content");

			// Create a DOM using JSDOM instead of DOMParser
			const dom = new JSDOM(html);
			const doc = dom.window.document;

			// Remove elements based on settings
			if (clearHead) {
				const headElements = doc.querySelectorAll("head");
				headElements.forEach((el) => el.remove());
			}

			if (clearScript) {
				const scriptElements = doc.querySelectorAll("script");
				scriptElements.forEach((el) => el.remove());
			}

			if (clearStyle) {
				const styleElements = doc.querySelectorAll("style");
				styleElements.forEach((el) => el.remove());
			}

			if (clearLink) {
				const linkElements = doc.querySelectorAll("link");
				linkElements.forEach((el) => el.remove());
			}

			if (clearMeta) {
				const metaElements = doc.querySelectorAll("meta");
				metaElements.forEach((el) => el.remove());
			}

			// Remove attributes
			if (clearClassAttr || clearStyleAttr) {
				const allElements = Array.from(doc.querySelectorAll("*"));
				allElements.forEach((el) => {
					if (clearClassAttr && el.hasAttribute("class")) {
						el.removeAttribute("class");
					}
					if (clearStyleAttr && el.hasAttribute("style")) {
						el.removeAttribute("style");
					}
				});
			}

			// Remove HTML comments
			if (clearComments) {
				const removeComments = (node: Node) => {
					const iterator = doc.createNodeIterator(
						node,
						dom.window.NodeFilter.SHOW_COMMENT
					);
					let currentNode;
					const commentsToRemove = [];
					while ((currentNode = iterator.nextNode())) {
						commentsToRemove.push(currentNode);
					}
					commentsToRemove.forEach((comment) =>
						comment.parentNode?.removeChild(comment)
					);
				};
				removeComments(doc);
			}

			// Remove data-* attributes
			if (clearDataAttrs) {
				const allElements = Array.from(doc.querySelectorAll("*"));
				allElements.forEach((el) => {
					Array.from(el.attributes).forEach((attr) => {
						if (attr.name.startsWith("data-")) {
							el.removeAttribute(attr.name);
						}
					});
				});
			}

			// Remove empty attributes
			if (clearEmptyAttrs) {
				const allElements = Array.from(doc.querySelectorAll("*"));
				allElements.forEach((el) => {
					Array.from(el.attributes).forEach((attr) => {
						if (attr.value === "") {
							el.removeAttribute(attr.name);
						}
					});
				});
			}

			// Remove inline event handlers (onclick, onload, etc.)
			if (clearInlineEvents) {
				const allElements = Array.from(doc.querySelectorAll("*"));
				allElements.forEach((el) => {
					Array.from(el.attributes).forEach((attr) => {
						if (attr.name.startsWith("on")) {
							el.removeAttribute(attr.name);
						}
					});
				});
			}

			// Remove hidden elements
			if (removeHiddenElements) {
				const hiddenElements = doc.querySelectorAll(
					'[hidden], [style*="display: none"], [style*="display:none"], [style*="visibility: hidden"], [style*="visibility:hidden"]'
				);
				hiddenElements.forEach((el) => el.remove());
			}

			// Remove empty elements (no text content and no children)
			if (removeEmptyElements) {
				const removeEmpty = (node: Element) => {
					const elements = Array.from(node.querySelectorAll("*"));
					elements.reverse().forEach((el) => {
						if (el.children.length === 0 && !el.textContent?.trim()) {
							// Skip removing certain elements like br, hr, img, etc.
							if (
								![
									"BR",
									"HR",
									"IMG",
									"INPUT",
									"TEXTAREA",
									"SELECT",
									"BUTTON",
									"IFRAME",
								].includes(el.tagName)
							) {
								el.parentNode?.removeChild(el);
							}
						}
					});
				};
				removeEmpty(doc.body);
			}

			// Keep only main content (attempt to identify and keep only the main content area)
			if (keepMainContent) {
				// Try to find main content containers
				const mainContentSelectors = [
					"main",
					"#main",
					".main",
					"#content",
					".content",
					"article",
					".article",
					"#article",
				];

				let mainContent = null;
				for (const selector of mainContentSelectors) {
					const element = doc.querySelector(selector);
					if (element) {
						mainContent = element;
						break;
					}
				}

				if (mainContent) {
					// Create a new document with only the main content
					const tempDoc = new JSDOM("<!DOCTYPE html><html><body></body></html>")
						.window.document;
					tempDoc.body.appendChild(mainContent.cloneNode(true));
					dom.window.document.documentElement.innerHTML =
						tempDoc.documentElement.innerHTML;
				}
			}

			// Convert back to string
			let cleanedHtml = doc.documentElement.outerHTML;

			// Basic HTML minification
			if (minifyHtml) {
				cleanedHtml = cleanedHtml
					.replace(/\s+/g, " ") // Replace multiple spaces with single space
					.replace(/>\s+</g, "><") // Remove spaces between tags
					.replace(/<!--[\s\S]*?-->/g, "") // Remove comments (using [\s\S] instead of . with s flag)
					.replace(/\s+>/g, ">") // Remove spaces before closing brackets
					.replace(/<\s+/g, "<") // Remove spaces after opening brackets
					.trim();
			}

			// Calculate sizes in bytes (1 char ≈ 1 byte in UTF-8 for ASCII chars)
			const inputSizeBytes = new TextEncoder().encode(html).length;
			const outputSizeBytes = new TextEncoder().encode(cleanedHtml).length;

			env.log.info(`Input HTML size: ${formatSize(inputSizeBytes)}`);
			env.log.info(`Output HTML size: ${formatSize(outputSizeBytes)}`);
			env.log.info(
				`Size reduction: ${(((inputSizeBytes - outputSizeBytes) / inputSizeBytes) * 100).toFixed(2)}%`
			);

			env.setOutput("Cleared HTML", cleanedHtml);
			return true;
		} catch (error) {
			env.log.error(error instanceof Error ? error.message : "Unknown error");
			return false;
		}
	},
};

// function getProperty(obj: any, path: string) {
// 	return path.split(".").reduce((acc, part) => acc && acc[part], obj);
// }

export const ClearHtmlExecutor = executor.execute.bind(executor);
