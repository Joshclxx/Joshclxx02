"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#hero",           label: "Overview",      icon: "📋" },
  { href: "#projects",       label: "Repositories",  icon: "📁" },
  { href: "#certifications", label: "Achievements",  icon: "🏆" },
  { href: "#services",       label: "Packages",      icon: "📦" },
  { href: "#contact",        label: "Contact",       icon: "💬" },
];

// Which scroll-section IDs each nav tab "owns"
const sectionMap: Record<string, string[]> = {
  "#hero":           ["hero", "about", "tech-stack"],
  "#projects":       ["projects"],
  "#certifications": ["certifications"],
  "#services":       ["services"],
  "#contact":        ["contact"],
};

export function Navigation() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll detection — also activates contact when near page bottom
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero", "about", "tech-stack",
        "projects", "certifications", "services", "contact",
      ];
      const scrollPosition = window.scrollY + 120;
      const pageBottom = document.documentElement.scrollHeight - window.innerHeight;

      // If within 80px of the bottom, always highlight contact
      if (window.scrollY >= pageBottom - 80) {
        setActiveSection("contact");
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore persisted theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--gh-header-bg)] border-b border-[var(--gh-border)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 text-foreground hover:text-[var(--gh-text-primary)] transition-colors"
          >
            <svg height="24" viewBox="0 0 16 16" width="24" fill="currentColor" className="opacity-90">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span className="font-semibold text-sm hidden sm:inline">Joshclxx</span>
          </a>

          {/* Desktop nav — GitHub tab style */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => {
              const isActive = (sectionMap[item.href] ?? []).includes(activeSection);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-4 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#f78166] rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right side — theme + mobile */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)] transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--gh-border)]">
            <div className="py-2">
              {navItems.map((item) => {
                const isActive = (sectionMap[item.href] ?? []).includes(activeSection);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-md mx-2",
                      isActive
                        ? "text-foreground bg-[var(--gh-btn-bg)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)]"
                    )}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f78166]" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
