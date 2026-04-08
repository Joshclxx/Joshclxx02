"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

/**
 * Typewriter text animation — types out text character by character
 * when scrolled into view.
 */
export function TypewriterText({
  text,
  speed = 30,
  delay = 200,
  className = "",
  cursorClassName = "",
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isDone) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTyping && !isDone) {
          setIsTyping(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTyping, isDone]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsDone(true);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isTyping, text, speed, delay, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {showCursor && !isDone && (
        <span
          className={`inline-block w-[2px] h-[1em] bg-[var(--gh-accent-green)] ml-0.5 align-text-bottom animate-blink ${cursorClassName}`}
        />
      )}
      {/* Invisible full text for layout measurement */}
      {!isDone && (
        <span className="invisible absolute" aria-hidden="true">
          {text}
        </span>
      )}
    </span>
  );
}
