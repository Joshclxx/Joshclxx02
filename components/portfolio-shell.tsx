"use client";

import { type ReactNode } from "react";
import { SectionFocusProvider } from "./section-focus-context";

/**
 * Client‑side wrapper that provides section focus context
 * to the otherwise server-rendered page tree.
 */
export function PortfolioShell({ children }: { children: ReactNode }) {
  return <SectionFocusProvider>{children}</SectionFocusProvider>;
}
