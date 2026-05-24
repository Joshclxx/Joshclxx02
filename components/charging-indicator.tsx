"use client";

import { useEffect, useState, useRef } from "react";
import { Zap, Battery, BatteryFull, BatteryLow, BatteryMedium } from "lucide-react";

interface BatteryState {
  charging: boolean;
  level: number;
  supported: boolean;
}

export function ChargingIndicator() {
  const [battery, setBattery] = useState<BatteryState | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [splashFading, setSplashFading] = useState(false);
  const prevCharging = useRef<boolean | null>(null);

  useEffect(() => {
    let batt: any = null;

    const update = () => {
      if (batt) {
        setBattery({ charging: batt.charging, level: batt.level, supported: true });
      }
    };

    const init = async () => {
      try {
        if ("getBattery" in navigator) {
          batt = await (navigator as any).getBattery();
          update();
          batt.addEventListener("chargingchange", update);
          batt.addEventListener("levelchange", update);
        } else {
          // API not available — likely iOS or non-secure context
          setBattery({ charging: false, level: 0, supported: false });
        }
      } catch (err) {
        console.log("Battery API error:", err);
        setBattery({ charging: false, level: 0, supported: false });
      }
    };

    init();

    return () => {
      if (batt) {
        batt.removeEventListener("chargingchange", update);
        batt.removeEventListener("levelchange", update);
      }
    };
  }, []);

  // Show splash when charging starts
  useEffect(() => {
    if (battery === null || !battery.supported) return;

    if (battery.charging && (prevCharging.current === false || prevCharging.current === null)) {
      setShowSplash(true);
      setSplashFading(false);

      const fadeTimer = setTimeout(() => setSplashFading(true), 1500);
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
        setSplashFading(false);
      }, 2000);

      prevCharging.current = battery.charging;
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }

    prevCharging.current = battery.charging;
  }, [battery]);

  // Not yet loaded or not supported
  if (!battery || !battery.supported) return null;

  const percent = Math.round(battery.level * 100);

  // Choose battery icon based on level
  const BatteryIcon = battery.charging ? Zap
    : percent > 80 ? BatteryFull
    : percent > 30 ? BatteryMedium
    : BatteryLow;

  const indicatorColor = battery.charging
    ? "var(--gh-accent-green)"
    : percent <= 20 ? "#f85149" : "var(--gh-text-secondary)";

  return (
    <>
      {/* Nav bar indicator — always shows battery, glows when charging */}
      <div
        className={`charging-indicator ${battery.charging ? "charging-indicator--active" : ""}`}
        title={`${battery.charging ? "Charging" : "Battery"} ${percent}%`}
      >
        <div className="charging-bolt" style={{ color: indicatorColor }}>
          <BatteryIcon className="h-3 w-3" />
        </div>
        <span className="charging-text" style={{ color: indicatorColor }}>{percent}%</span>
      </div>

      {/* Center screen splash — only when charging starts */}
      {showSplash && (
        <div className={`charging-splash ${splashFading ? 'charging-splash--fade' : ''}`}>
          <div className="charging-splash-content">
            <div className="charging-splash-ring">
              <div className="charging-splash-ring-inner" />
              <div className="charging-splash-icon">
                <Zap className="h-10 w-10" />
              </div>
            </div>
            <div className="charging-splash-percent">{percent}%</div>
            <div className="charging-splash-label">Charging</div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Nav bar indicator ── */
        .charging-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 2px 8px 2px 4px;
          border-radius: 20px;
          background: color-mix(in srgb, var(--gh-text-secondary) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--gh-text-secondary) 15%, transparent);
          transition: all 0.3s ease;
        }

        .charging-indicator--active {
          background: color-mix(in srgb, var(--gh-accent-green) 12%, transparent);
          border-color: color-mix(in srgb, var(--gh-accent-green) 25%, transparent);
          animation: chargeGlow 2s ease-in-out infinite;
        }

        .charging-bolt {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .charging-indicator--active .charging-bolt {
          animation: chargePulse 1.5s ease-in-out infinite;
          filter: drop-shadow(0 0 4px var(--gh-accent-green));
        }

        .charging-text {
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          transition: color 0.3s ease;
        }

        @keyframes chargePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes chargeGlow {
          0%, 100% {
            box-shadow: 0 0 4px color-mix(in srgb, var(--gh-accent-green) 20%, transparent);
          }
          50% {
            box-shadow: 0 0 12px color-mix(in srgb, var(--gh-accent-green) 40%, transparent),
                        0 0 4px color-mix(in srgb, var(--gh-accent-green) 20%, transparent);
          }
        }

        /* ── Center screen splash ── */
        .charging-splash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: splashIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .charging-splash--fade {
          animation: splashOut 0.5s ease forwards;
        }

        .charging-splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: splashContentIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }

        .charging-splash-ring {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .charging-splash-ring-inner {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--gh-accent-green);
          border-right-color: var(--gh-accent-green);
          animation: splashRingSpin 1.5s linear infinite;
          filter: drop-shadow(0 0 8px var(--gh-accent-green));
        }

        .charging-splash-icon {
          color: var(--gh-accent-green);
          filter: drop-shadow(0 0 16px var(--gh-accent-green));
          animation: splashBoltPulse 1s ease-in-out infinite;
        }

        .charging-splash-percent {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          line-height: 1;
          text-shadow: 0 0 20px rgba(63, 185, 80, 0.5);
        }

        .charging-splash-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        @keyframes splashIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes splashOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes splashContentIn {
          from { opacity: 0; transform: scale(0.7) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes splashRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes splashBoltPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </>
  );
}
