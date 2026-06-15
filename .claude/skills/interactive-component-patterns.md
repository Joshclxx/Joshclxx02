# Skill: Interactive Component Patterns

## Trigger
When creating or modifying interactive components in `components/` that involve animations, user input tracking, or complex state.

## Context
The portfolio has several interactive components that follow common patterns. Use these as reference when building new ones.

## Existing Interactive Components

| Component | Pattern | Key Techniques |
|---|---|---|
| `desktop-pet.tsx` | Cursor tracking + animation | `mousemove` listener, CSS transforms, sprite states |
| `food-bowl.tsx` | Click interaction | State toggle, animation trigger |
| `contribution-graph.tsx` | Data visualization | GitHub API fetch, grid rendering, tooltips |
| `interactive-graph.tsx` | Explorable visualization | Canvas/SVG, hover states, zoom/pan |
| `weather-widget.tsx` | External API display | Fetch weather data, loading states |
| `parallax-background.tsx` | Scroll-driven effect | `scroll` listener, `requestAnimationFrame`, transform |
| `shake-to-contact.tsx` | Device sensor | `devicemotion` event, threshold detection |
| `charging-indicator.tsx` | Battery animation | CSS animation, state-driven visuals |
| `magnetic-hover.tsx` | Mouse proximity | `mousemove` + transform calculation |
| `tilt-card.tsx` | 3D tilt on hover | `mousemove` + CSS `perspective` + `rotateX/Y` |
| `typewriter-text.tsx` | Text animation | `setInterval`, character-by-character reveal |
| `scroll-reveal.tsx` | Scroll trigger | `IntersectionObserver`, fade/slide animation |

## Common Patterns

### 1. Cursor/Mouse Tracking
```typescript
"use client";
import { useState, useEffect, useCallback } from "react";

export function CursorTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return <div style={{ transform: `translate(${position.x}px, ${position.y}px)` }} />;
}
```

### 2. Scroll-Driven Animation
```typescript
"use client";
import { useEffect, useRef, useState } from "react";

export function ScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    />
  );
}
```

### 3. Device Sensor Access
```typescript
"use client";
import { useEffect } from "react";

export function DeviceSensor() {
  useEffect(() => {
    const handler = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      // Process sensor data...
    };
    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, []);
}
```

## Instructions

### When creating a new interactive component:
1. Check if a similar pattern exists in the components above
2. Use `"use client"` directive
3. Clean up event listeners in `useEffect` return
4. Use `useCallback` for event handlers to prevent unnecessary re-renders
5. Use `requestAnimationFrame` for smooth visual updates
6. Test on both desktop and mobile
7. Respect `prefers-reduced-motion` for accessibility

### When modifying an existing interactive component:
1. Read the full component first — these tend to be large (150-300+ lines)
2. Understand the event listener lifecycle before changing state
3. Test that cleanup functions still work after changes
4. Verify mobile touch equivalents still function
