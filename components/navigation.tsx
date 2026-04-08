"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun, Menu, X, Home, FolderGit2, Award, Package, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionFocus } from "./section-focus-context";

const navItems = [
  { href: "#hero",           label: "Overview",      icon: Home,           mobileLabel: "Home" },
  { href: "#projects",       label: "Repositories",  icon: FolderGit2,     mobileLabel: "Projects" },
  { href: "#certifications", label: "Achievements",  icon: Award,          mobileLabel: "Certs" },
  { href: "#services",       label: "Packages",      icon: Package,        mobileLabel: "Services" },
  { href: "#contact",        label: "Contact",       icon: MessageCircle,  mobileLabel: "Contact" },
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
  const [isSheetClosing, setIsSheetClosing] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const { focusedNav, setFocusedNav, clearFocus } = useSectionFocus();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
      e.preventDefault();
      setFocusedNav(href);

      // Scroll to the section smoothly
      const targetId = href.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [setFocusedNav]
  );

  // Close mobile sheet with animation
  const closeSheet = useCallback(() => {
    setIsSheetClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsSheetClosing(false);
    }, 250);
  }, []);

  // Scroll detection — only runs when NOT in focus mode
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      if (focusedNav !== null) return;

      const sections = [
        "hero", "about", "tech-stack",
        "projects", "certifications", "services", "contact",
      ];
      const scrollPosition = window.scrollY + 120;
      const pageBottom = document.documentElement.scrollHeight - window.innerHeight;

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
  }, [focusedNav]);

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
    <>
      {/* ── Top Navigation Bar ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
        "backdrop-blur-xl bg-[var(--gh-header-bg)]/80",
        isScrolled
          ? "border-[var(--gh-border)] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)]"
          : "border-transparent"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                clearFocus();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
                const isActive = focusedNav
                  ? focusedNav === item.href
                  : (sectionMap[item.href] ?? []).includes(activeSection);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "relative px-3 py-4 text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#f78166] tab-indicator" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right side — blog link + theme */}
            <div className="flex items-center gap-1">
              <a
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)] rounded-md transition-colors"
              >
                <svg className="h-3.5 w-3.5 opacity-70" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
                </svg>
                Blog
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)] transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Mobile menu button — opens slide-up sheet */}
              <div className="md:hidden">
                <button
                  onClick={() => {
                    if (isMenuOpen) {
                      closeSheet();
                    } else {
                      setIsMenuOpen(true);
                    }
                  }}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--gh-btn-bg)] transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Slide-Up Sheet ── */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="mobile-sheet-backdrop md:hidden"
            onClick={closeSheet}
          />
          {/* Sheet */}
          <div className={cn(
            "mobile-sheet md:hidden",
            isSheetClosing && "mobile-sheet-closing"
          )}>
            {/* Handle */}
            <div className="mobile-sheet-handle" />

            {/* Nav items */}
            <div className="py-2">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = focusedNav
                  ? focusedNav === item.href
                  : (sectionMap[item.href] ?? []).includes(activeSection);
                return (
                  <button
                    key={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      closeSheet();
                    }}
                    className={cn(
                      "mobile-sheet-item",
                      isActive && "mobile-sheet-item--active"
                    )}
                  >
                    <IconComp className="h-5 w-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-[var(--gh-accent-blue)]" />
                    )}
                  </button>
                );
              })}

              {/* Divider */}
              <div className="mobile-sheet-divider" />

              {/* Blog link */}
              <a
                href="/blog"
                onClick={closeSheet}
                className="mobile-sheet-item"
              >
                <svg className="h-5 w-5 opacity-70" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
                </svg>
                <span>Blog</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="mobile-bottom-nav md:hidden">
        <div className="mobile-bottom-nav-inner">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = focusedNav
              ? focusedNav === item.href
              : (sectionMap[item.href] ?? []).includes(activeSection);
            return (
              <button
                key={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "mobile-tab",
                  isActive ? "mobile-tab--active" : "mobile-tab--inactive"
                )}
                aria-label={item.label}
              >
                <IconComp className="h-5 w-5 mobile-tab-icon" />
                <span className="mobile-tab-label">{item.mobileLabel}</span>
                {isActive && <span className="mobile-tab-dot" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
