"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on initial mount (page already loads at top)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Still force scroll to top on first load (handles back/forward navigation)
      window.scrollTo(0, 0);
      return;
    }

    // Force scroll to top on route change
    window.scrollTo(0, 0);

    // Fallback: ensure scroll happens after any layout shift
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return null;
}
