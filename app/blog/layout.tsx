import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export const metadata: Metadata = {
  title: "JOSHCLXX BLOG",
  description:
    "Insights on the developer ecosystem: trending tools, frameworks, best practices, and tech industry updates.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Simplified blog navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--gh-border)] backdrop-blur-xl bg-[var(--gh-header-bg)]/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + back link */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" />
                </svg>
                Portfolio
              </Link>
              <span className="text-[var(--gh-border)]">/</span>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-foreground font-semibold text-sm"
              >
                <svg
                  className="h-4 w-4 opacity-70"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
                </svg>
                Blog
              </Link>
            </div>

            {/* Right: Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Blog content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-[var(--gh-border)] mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Joshclxx. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
