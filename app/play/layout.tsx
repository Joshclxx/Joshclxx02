import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Game Arcade — Joshclxx",
  description:
    "Take a break and play mini-games with the Pet Cat. Tic-Tac-Toe, Memory Match, Cat Chase, Sudoku, and more!",
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="flex-shrink-0 border-b border-[var(--gh-border)] backdrop-blur-xl bg-[var(--gh-header-bg)]/80 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + back link */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Portfolio
              </Link>
              <span className="text-[var(--gh-border)]">/</span>
              <Link
                href="/play"
                className="flex items-center gap-2 text-foreground font-semibold text-sm"
              >
                <Gamepad2 className="h-4 w-4 opacity-70" />
                Arcade
              </Link>
            </div>

            {/* Right: GitHub link */}
            <a
              href="https://github.com/joshclxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)] rounded-md transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Content — fills remaining viewport */}
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
