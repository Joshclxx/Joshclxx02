"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserRound, FolderKanban, Award, MessageSquareQuote } from "lucide-react";

const items = [
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/achievements", label: "Achievements & Certificates", icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-[var(--gh-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Private area</p><h1 className="mt-1 text-2xl font-bold text-foreground">Portfolio Admin</h1></div>
          <button type="button" onClick={signOut} className="gh-btn self-start text-sm sm:self-auto"><LogOut className="h-4 w-4" /> Sign out</button>
        </header>
        <nav aria-label="Admin sections" className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${active ? "border-[var(--gh-accent-blue)] bg-[var(--gh-accent-blue)]/10 text-[var(--gh-accent-blue)]" : "border-[var(--gh-border)] text-muted-foreground hover:border-[var(--gh-border-hover)] hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}</Link>;
          })}
        </nav>
        {children}
      </div>
    </main>
  );
}
