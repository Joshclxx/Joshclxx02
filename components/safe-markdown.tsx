import ReactMarkdown from "react-markdown";

export function SafeMarkdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
      components={{
        p: ({ children }) => <p>{children}</p>,
        strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
        code: ({ children }) => <code className="rounded bg-[var(--gh-btn-bg)] px-1.5 py-0.5 text-xs font-mono text-foreground border border-[var(--gh-border)]">{children}</code>,
        a: ({ children }) => <span>{children}</span>,
        img: () => null,
        h1: ({ children }) => <span>{children}</span>,
        h2: ({ children }) => <span>{children}</span>,
        h3: ({ children }) => <span>{children}</span>,
        ul: ({ children }) => <span>{children}</span>,
        ol: ({ children }) => <span>{children}</span>,
        li: ({ children }) => <span>{children}</span>,
      }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
