"use client";

import { useRef, useState, type ReactNode, useCallback } from "react";

interface MagneticHoverProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Magnetic hover effect — element subtly follows the cursor on hover.
 * Used for social icons and CTA buttons to create a premium interactive feel.
 */
export function MagneticHover({
  children,
  className = "",
  strength = 0.3,
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setTransform({ x: deltaX, y: deltaY });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition:
          transform.x === 0 && transform.y === 0
            ? "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)"
            : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}
