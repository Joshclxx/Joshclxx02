"use client";

import { useEffect, useState } from "react";

// WMO weather code → label + simple SVG icon id
const WMO: Record<number, { label: string; icon: "sun" | "cloud" | "rain" | "snow" | "fog" | "storm" }> = {
  0:  { label: "Clear",       icon: "sun"   },
  1:  { label: "Mostly clear", icon: "sun"  },
  2:  { label: "Partly cloudy", icon: "cloud"},
  3:  { label: "Overcast",    icon: "cloud" },
  45: { label: "Fog",         icon: "fog"   },
  48: { label: "Icy fog",     icon: "fog"   },
  51: { label: "Drizzle",     icon: "rain"  },
  53: { label: "Drizzle",     icon: "rain"  },
  55: { label: "Drizzle",     icon: "rain"  },
  61: { label: "Rain",        icon: "rain"  },
  63: { label: "Rain",        icon: "rain"  },
  65: { label: "Heavy rain",  icon: "rain"  },
  71: { label: "Snow",        icon: "snow"  },
  73: { label: "Snow",        icon: "snow"  },
  75: { label: "Heavy snow",  icon: "snow"  },
  80: { label: "Showers",     icon: "rain"  },
  81: { label: "Showers",     icon: "rain"  },
  82: { label: "Showers",     icon: "rain"  },
  95: { label: "Thunderstorm",icon: "storm" },
  96: { label: "Thunderstorm",icon: "storm" },
  99: { label: "Thunderstorm",icon: "storm" },
};

function WeatherIcon({ type }: { type: string }) {
  const cls = "h-3.5 w-3.5 shrink-0";
  if (type === "sun") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
  if (type === "cloud") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9Z"/>
    </svg>
  );
  if (type === "rain") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
      <line x1="8" y1="19" x2="8" y2="21"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/>
    </svg>
  );
  if (type === "snow") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
      <line x1="8" y1="20" x2="8" y2="20.01"/><line x1="12" y1="20" x2="12" y2="20.01"/><line x1="16" y1="20" x2="16" y2="20.01"/>
    </svg>
  );
  if (type === "storm") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
      <polyline points="13 11 9 17 15 17 11 23"/>
    </svg>
  );
  // fog
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/>
      <line x1="5" y1="18" x2="19" y2="18"/><line x1="6" y1="6" x2="18" y2="6"/>
    </svg>
  );
}

interface WeatherData { temp: number; label: string; icon: string; city: string }

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async (lat: number, lon: number, city = "Your location") => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
        const res  = await fetch(url);
        const json = await res.json();
        if (cancelled) return;
        const code  = json.current.weather_code as number;
        const temp  = Math.round(json.current.temperature_2m as number);
        const meta  = WMO[code] ?? { label: "Unknown", icon: "cloud" };
        setWeather({ temp, label: meta.label, icon: meta.icon, city });
      } catch { /* silently ignore */ }
      finally { if (!cancelled) setLoading(false); }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          // reverse-geocode city name from coords (free, no key)
          try {
            const geo  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
            const gj   = await geo.json();
            const city = gj.address?.city || gj.address?.town || gj.address?.county || "Local";
            fetchWeather(pos.coords.latitude, pos.coords.longitude, city);
          } catch {
            fetchWeather(pos.coords.latitude, pos.coords.longitude);
          }
        },
        // fallback to Philippines (Manila) if denied
        () => fetchWeather(14.5995, 120.9842, "Manila"),
        { timeout: 5000 }
      );
    } else {
      fetchWeather(14.5995, 120.9842, "Manila");
    }

    return () => { cancelled = true; };
  }, []);

  if (loading) return (
    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md animate-pulse">
      <div className="h-3 w-3 rounded-full bg-muted-foreground/30"/>
      <div className="h-2.5 w-16 rounded bg-muted-foreground/20"/>
    </div>
  );

  if (!weather) return null;

  return (
    <div
      title={`${weather.city} — ${weather.label}`}
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground
        rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]
        hover:border-[var(--gh-border-hover)] transition-colors select-none cursor-default"
    >
      <WeatherIcon type={weather.icon}/>
      <span className="font-medium tabular-nums">{weather.temp}°C</span>
      <span className="text-muted-foreground/60 hidden md:inline">{weather.label}</span>
    </div>
  );
}
