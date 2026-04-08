"use client";

import { type ReactNode } from "react";
import { useSectionFocus } from "./section-focus-context";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  /** The section ID this wrapper controls visibility for */
  sectionId: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a page section and controls its visibility based on nav focus.
 * - When no nav is focused (normal scroll): fully visible.
 * - When a nav is focused and this section belongs to it: visible.
 * - When a nav is focused and this section does NOT belong: hidden with slide-out animation.
 */
export function SectionWrapper({ sectionId, children, className }: SectionWrapperProps) {
  const { isSectionVisible, focusedNav } = useSectionFocus();
  const visible = isSectionVisible(sectionId);
  const isFocusMode = focusedNav !== null;

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in-out",
        isFocusMode && !visible && "hidden",
        className
      )}
      data-section-id={sectionId}
      data-visible={visible}
    >
      {children}
    </div>
  );
}
