"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Smartphone, X } from "lucide-react";

/**
 * ShakeToContact – mobile-only feature:
 * 1. Shows a one-time onboarding notification ("Shake your phone to Get in Touch!")
 * 2. Listens for device shake events and smooth-scrolls to #contact
 */
export function ShakeToContact() {
  const [showNotification, setShowNotification] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastShakeTime = useRef(0);
  const shakeThreshold = 15; // m/s² acceleration threshold
  const shakeCooldown = 3000; // 3 seconds cooldown between shakes

  // ── Detect mobile device ──────────────────────────────────────────
  useEffect(() => {
    const mobile =
      window.matchMedia("(pointer: coarse)").matches &&
      "ontouchstart" in window;
    setIsMobile(mobile);
  }, []);

  // ── Smooth-scroll to #contact ─────────────────────────────────────
  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ── Shake detection via DeviceMotionEvent ─────────────────────────
  useEffect(() => {
    if (!isMobile) return;

    let permissionGranted = false;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const magnitude = Math.sqrt(
        acc.x * acc.x + acc.y * acc.y + acc.z * acc.z
      );

      // Subtract gravity (~9.8) and check if remaining force exceeds threshold
      if (magnitude > 9.8 + shakeThreshold) {
        const now = Date.now();
        if (now - lastShakeTime.current > shakeCooldown) {
          lastShakeTime.current = now;
          scrollToContact();
        }
      }
    };

    const startListening = () => {
      window.addEventListener("devicemotion", handleMotion);
      permissionGranted = true;
    };

    // iOS 13+ requires explicit permission request
    const dme = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof dme.requestPermission === "function") {
      // We'll request permission when the user taps the notification
      // For now, just set up a flag; actual request happens on first interaction
      const requestOnInteraction = () => {
        dme.requestPermission!().then((state: string) => {
          if (state === "granted") {
            startListening();
          }
        });
        // Remove after first interaction
        document.removeEventListener("click", requestOnInteraction);
        document.removeEventListener("touchend", requestOnInteraction);
      };

      document.addEventListener("click", requestOnInteraction, { once: true });
      document.addEventListener("touchend", requestOnInteraction, {
        once: true,
      });
    } else {
      // Android / non-iOS – start immediately
      startListening();
    }

    return () => {
      if (permissionGranted) {
        window.removeEventListener("devicemotion", handleMotion);
      }
    };
  }, [isMobile, scrollToContact, shakeThreshold, shakeCooldown]);

  // ── Show onboarding notification (once per session) ───────────────
  useEffect(() => {
    if (!isMobile) return;

    const alreadyShown = sessionStorage.getItem("shake-notification-shown");
    if (alreadyShown) return;

    // Slight delay so the page loads first
    const timer = setTimeout(() => {
      setShowNotification(true);
      sessionStorage.setItem("shake-notification-shown", "true");
    }, 1500);

    return () => clearTimeout(timer);
  }, [isMobile]);

  // ── Auto-dismiss after 5 seconds ─────────────────────────────────
  useEffect(() => {
    if (!showNotification) return;

    const timer = setTimeout(() => {
      dismissNotification();
    }, 5000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const dismissNotification = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsExiting(false);
    }, 400);
  };

  // ── Don't render anything on desktop ──────────────────────────────
  if (!isMobile || !showNotification) return null;

  return (
    <div
      id="shake-notification"
      role="status"
      aria-live="polite"
      onClick={dismissNotification}
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]
        flex items-center gap-3 px-5 py-3.5
        rounded-2xl border border-primary/20
        bg-background/80 backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.05)]
        cursor-pointer select-none
        transition-all duration-400
        ${isExiting
          ? "opacity-0 translate-y-4 scale-95"
          : "animate-shake-toast-in"
        }
      `}
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      {/* Animated phone icon */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center animate-phone-wiggle">
          <Smartphone className="h-4.5 w-4.5 text-primary" />
        </div>
        {/* Subtle pulse ring */}
        <div className="absolute inset-0 rounded-xl bg-primary/5 animate-ping-slow" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">
          Shake your phone 📱
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          to jump to Get in Touch
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismissNotification();
        }}
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
