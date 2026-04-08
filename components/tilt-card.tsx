"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareEnabled?: boolean;
}

/**
 * 3D tilt card with optional glare effect.
 * Creates a parallax-like depth perception on hover.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  glareEnabled = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Tilt calculation — centered around 0
      const tiltX = (0.5 - y) * maxTilt;
      const tiltY = (x - 0.5) * maxTilt;

      setTilt({ x: tiltX, y: tiltY });

      if (glareEnabled) {
        setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
      }
    },
    [maxTilt, glareEnabled]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition:
          tilt.x === 0 && tilt.y === 0
            ? "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)"
            : "transform 0.1s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {/* Glare overlay */}
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-10"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
            transition:
              glare.opacity === 0 ? "opacity 0.4s ease" : "none",
          }}
        />
      )}
    </div>
  );
}
