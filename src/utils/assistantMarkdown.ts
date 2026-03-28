import DOMPurify from "dompurify";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/**
 * Turn model markdown (**bold**, lists, links) into sanitized HTML for v-html.
 */
export function renderAssistantMarkdown(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(raw);
}
