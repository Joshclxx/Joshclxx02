"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/**
 * Maps each nav‑href to the DOM section IDs it "owns".
 * Must stay in sync with the sectionMap in navigation.tsx.
 */
const SECTION_GROUPS: Record<string, string[]> = {
  "#hero":           ["hero", "about", "tech-stack"],
  "#projects":       ["projects"],
  "#certifications": ["certifications"],
  "#services":       ["services"],
  "#contact":        ["contact"],
};

interface SectionFocusState {
  /** null = show all (normal scrolling mode) */
  focusedNav: string | null;
  /** Set focus to a specific nav href (e.g. "#projects") */
  setFocusedNav: (href: string | null) => void;
  /** Clear focus — show all sections again */
  clearFocus: () => void;
  /** Check if a given section ID should be visible */
  isSectionVisible: (sectionId: string) => boolean;
}

const SectionFocusContext = createContext<SectionFocusState | null>(null);

export function SectionFocusProvider({ children }: { children: ReactNode }) {
  const [focusedNav, setFocusedNavState] = useState<string | null>(null);

  const setFocusedNav = useCallback((href: string | null) => {
    setFocusedNavState(href);
  }, []);

  const clearFocus = useCallback(() => {
    setFocusedNavState(null);
  }, []);

  const isSectionVisible = useCallback(
    (sectionId: string): boolean => {
      if (focusedNav === null) return true; // show all
      const owned = SECTION_GROUPS[focusedNav] ?? [];
      return owned.includes(sectionId);
    },
    [focusedNav]
  );

  return (
    <SectionFocusContext.Provider
      value={{ focusedNav, setFocusedNav, clearFocus, isSectionVisible }}
    >
      {children}
    </SectionFocusContext.Provider>
  );
}

export function useSectionFocus() {
  const ctx = useContext(SectionFocusContext);
  if (!ctx) {
    throw new Error("useSectionFocus must be used within a SectionFocusProvider");
  }
  return ctx;
}
