"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

/**
 * Client component that renders markdown blog content with
 * syntax highlighting. Separated from the server page to keep
 * `react-markdown` (client-only) isolated.
 */
export function BlogContent({ content }: { content: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
