"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Premium intro animation that plays when the portfolio first loads.
 * Features a terminal-style boot sequence, animated monogram,
 * loading progress bar, and floating particles — all themed
 * to match the GitHub-dark aesthetic of the portfolio.
 *
 * Duration: ~4 seconds, then fades out to reveal the site.
 */

const BOOT_LINES = [
  { text: "> initializing portfolio...", delay: 0 },
  { text: "> loading modules: react, next.js, typescript", delay: 400 },
  { text: "> compiling components...", delay: 900 },
  { text: "> establishing connection...", delay: 1500 },
  { text: "> system ready ✓", delay: 2200 },
];

const PARTICLE_COUNT = 35;

export function IntroAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [logoRevealed, setLogoRevealed] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
  }>>([]);

  // Generate particles once
  useEffect(() => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? 210 : 140, // blue or green
    }));
  }, []);

  // Boot sequence lines
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, i + 1));
      }, line.delay);
      return () => clearTimeout(timer);
    });
  }, []);

  // Logo reveal
  useEffect(() => {
    const t = setTimeout(() => setLogoRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Glow burst
  useEffect(() => {
    const t = setTimeout(() => setShowGlow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Progress bar
  useEffect(() => {
    const duration = 3400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(eased * 100);
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Exit sequence
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => setIsVisible(false), 700);
    }, 3800);
    return () => clearTimeout(exitTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`intro-overlay ${isExiting ? "intro-exit" : ""}`}
      aria-hidden="true"
    >
      {/* Floating particles */}
      <div className="intro-particles" aria-hidden="true">
        {particlesRef.current.map((p, i) => (
          <span
            key={i}
            className="intro-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              backgroundColor: `hsl(${p.hue}, 80%, 65%)`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient grid */}
      <div className="intro-grid" />

      {/* Central content */}
      <div className="intro-center">
        {/* Animated monogram */}
        <div className={`intro-logo ${logoRevealed ? "intro-logo-revealed" : ""}`}>
          <div className="intro-logo-brackets">
            <span className="intro-bracket intro-bracket-left">&lt;</span>
            <span className="intro-logo-text">
              <span className="intro-logo-j">J</span>
              <span className="intro-logo-c">C</span>
            </span>
            <span className="intro-bracket intro-bracket-right">/&gt;</span>
          </div>
          {/* Glow ring */}
          <div className={`intro-logo-ring ${showGlow ? "intro-logo-ring-active" : ""}`} />
        </div>

        {/* Username */}
        <div className={`intro-username ${logoRevealed ? "intro-username-visible" : ""}`}>
          joshclxx
        </div>

        {/* Subtitle */}
        <div className={`intro-subtitle ${visibleLines >= 2 ? "intro-subtitle-visible" : ""}`}>
          Frontend Developer
        </div>

        {/* Progress bar */}
        <div className="intro-progress-track">
          <div
            className="intro-progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="intro-progress-glow"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Terminal lines */}
        <div className="intro-terminal">
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className={`intro-terminal-line ${
                i < visibleLines ? "intro-terminal-line-visible" : ""
              } ${
                line.text.includes("✓") && i < visibleLines
                  ? "intro-terminal-success"
                  : ""
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom status */}
      <div className={`intro-status ${visibleLines >= 3 ? "intro-status-visible" : ""}`}>
        <span className="intro-status-dot" />
        <span>Loading portfolio...</span>
      </div>
    </div>
  );
}
