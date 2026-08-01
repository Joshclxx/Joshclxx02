"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Download, Mail, MapPin, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MagneticHover } from "@/components/magnetic-hover";
import type { PortfolioProfile } from "@/lib/types";

const BUBBLE_MESSAGES = [
  "Hi there!",
  "Welcome!",
  "Let's build!",
  "Hire me!",
  "React lover",
  "Coffee first",
  "Pixel perfect",
];

const availabilityDisplay = {
  available: { label: "Available", highlight: "Available for hire", color: "var(--gh-accent-green)" },
  open_to_work: { label: "Open to Work", highlight: "Open to Work", color: "var(--gh-accent-blue)" },
  unavailable: { label: "Unavailable", highlight: "Unavailable", color: "var(--muted-foreground)" },
} as const;

export function HeroSection({ profile, projectCount }: { profile: PortfolioProfile; projectCount: number }) {
  const availability = availabilityDisplay[profile.availability];
  const [isDark, setIsDark] = useState(true);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);

  useEffect(() => {
    const check = () =>
      setIsDark(!document.documentElement.classList.contains("light"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setBubbleVisible(false);
      // After fade-out, change message and fade in
      setTimeout(() => {
        setBubbleIndex((prev) => (prev + 1) % BUBBLE_MESSAGES.length);
        setBubbleVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentBubble = BUBBLE_MESSAGES[bubbleIndex % BUBBLE_MESSAGES.length];

  return (
    <section id="hero" className="hero-cascade">
      {/* Profile Image */}
      <div className="mb-4 flex justify-center lg:justify-start">
        <div className="profile-avatar-wrapper relative w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] lg:w-[296px] lg:h-[296px] aspect-square">
          <div className="profile-avatar-inner relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--gh-border)] shadow-sm bg-[var(--background)]">
            <Image
              src={profile.dark_image_url ?? profile.dark_image_path ?? "/images/josh-profile.png"}
              alt={profile.display_name}
              width={296}
              height={296}
              priority
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 profile-dark"
            />
            <Image
              src={profile.light_image_url ?? profile.light_image_path ?? "/images/josh-profile-light.png"}
              alt={profile.display_name}
              width={296}
              height={296}
              priority
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 profile-light"
            />
          </div>
          {/* Speech bubble — cycles through messages */}
          <div
            className={`profile-speech-bubble absolute -top-2 -right-4 sm:-right-6 lg:-right-8 z-10 transition-all duration-300 ${
              bubbleVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-1"
            }`}
          >
            <div
              className="relative px-3 py-1.5 rounded-2xl shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap select-none"
              style={{
                backgroundColor: isDark ? "#30363d" : "#ffffff",
                color: isDark ? "#e6edf3" : "#1f2328",
                border: `1px solid ${isDark ? "#484f58" : "#d0d7de"}`,
              }}
            >
              {currentBubble}
              {/* Bubble tail */}
              <div
                className="absolute -bottom-1.5 left-5 w-3 h-3 rotate-45"
                style={{
                  backgroundColor: isDark ? "#30363d" : "#ffffff",
                  borderRight: `1px solid ${isDark ? "#484f58" : "#d0d7de"}`,
                  borderBottom: `1px solid ${isDark ? "#484f58" : "#d0d7de"}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Name & Username */}
      <div className="mb-4 text-center lg:text-left">
        <h1 className="text-2xl font-semibold text-foreground leading-tight">
          {profile.display_name}
        </h1>
        <div className="flex items-center justify-center lg:justify-start mt-1">
          {/* GitHub-style status indicator */}
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${availability.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${availability.color} 25%, transparent)` }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: availability.color }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: availability.color }} />
            </span>
            <span className="text-[10px] font-medium" style={{ color: availability.color }}>{availability.label}</span>
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-center lg:text-left">
        {profile.short_bio}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-row gap-2 mb-3 sm:mb-4 justify-center lg:justify-start">
        <Link
          href="/pdf/Joshclxx_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="gh-btn gh-btn-primary flex-1 justify-center text-sm py-1.5"
        >
          <Download className="h-4 w-4" />
          Download CV
        </Link>
        <button
          className="gh-btn flex-1 justify-center text-sm py-1.5"
          onClick={() => {
            const contactSection = document.getElementById("contact");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <Mail className="h-4 w-4" />
          Contact
        </button>
      </div>

      {/* Meta info — GitHub profile style */}
      <div className="space-y-1.5 mb-3 sm:mb-4 text-sm text-center lg:text-left">
        <div className="flex items-center gap-2 text-muted-foreground justify-center lg:justify-start">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span>Software Engineer | Frontend Developer | Mobile App Developer</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground justify-center lg:justify-start">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>Quezon City, Philippines</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground justify-center lg:justify-start">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <a href="mailto:joshclxx02@gmail.com" className="gh-link text-sm">
            joshclxx02@gmail.com
          </a>
        </div>
      </div>

      {/* Social links — GitHub style with magnetic hover */}
      <div className="flex items-center gap-2 text-sm justify-center lg:justify-start">
        <MagneticHover>
          <a
            href="https://github.com/Joshclxx"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link-animated flex items-center gap-1.5 text-muted-foreground hover:text-[var(--gh-accent-blue)]"
          >
            <Github className="h-4 w-4" />
            <span>Joshclxx</span>
          </a>
        </MagneticHover>
        <span className="text-muted-foreground">·</span>
        <MagneticHover>
          <a
            href="https://www.linkedin.com/in/Joshclxx"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link-animated flex items-center gap-1.5 text-muted-foreground hover:text-[var(--gh-accent-blue)]"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </a>
        </MagneticHover>
      </div>

      {/* Divider */}
      <div className="border-b border-[var(--gh-border)] my-3 sm:my-4" />

      {/* Highlights — GitHub achievement style */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Highlights
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="gh-badge transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: availability.color }} />
            {availability.highlight}
          </span>
          <span className="gh-badge transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-blue)]" />
            {projectCount} Projects
          </span>
          <span className="gh-badge transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-purple)]" />
            {profile.experience_years}+ Years Exp.
          </span>
        </div>
      </div>
    </section>
  );
}
