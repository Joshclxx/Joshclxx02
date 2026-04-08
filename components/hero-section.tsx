"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Download, Mail, MapPin, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MagneticHover } from "@/components/magnetic-hover";

export function HeroSection() {
  const [isDark, setIsDark] = useState(true);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);

  const bubbleMessages = [
    "Hi there! 👋",
    "Welcome! ✨",
    "Let's build! 🚀",
    "Hire me! 💼",
    "React lover 💙",
    "Coffee first ☕",
    "Pixel perfect 🎯",
  ];

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
        setBubbleIndex((prev) => (prev + 1) % bubbleMessages.length);
        setBubbleVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [bubbleMessages.length]);

  return (
    <section id="hero" className="hero-cascade">
      {/* Profile Image */}
      <div className="mb-4 flex lg:justify-start justify-center">
        <div className="profile-avatar-wrapper relative w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] lg:w-[296px] lg:h-[296px] aspect-square">
          <div className="profile-avatar-inner relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--gh-border)] shadow-sm bg-[var(--background)]">
            <Image
              src="/images/josh-profile.png"
              alt="Joshua Colobong"
              width={296}
              height={296}
              priority
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 profile-dark"
            />
            <Image
              src="/images/josh-profile-light.png"
              alt="Joshua Colobong"
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
              {bubbleMessages[bubbleIndex]}
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
          Joshua Colobong
        </h1>
        <div className="flex items-center gap-2 justify-center lg:justify-start">
          <p className="text-xl font-light text-muted-foreground">
            Joshclxx
          </p>
          {/* GitHub-style status indicator */}
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--gh-accent-green)_12%,transparent)] border border-[color-mix(in_srgb,var(--gh-accent-green)_25%,transparent)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gh-accent-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gh-accent-green)]" />
            </span>
            <span className="text-[10px] font-medium text-[var(--gh-accent-green)]">Available</span>
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-center lg:text-left">
        Frontend developer specializing in React, Next.js, TypeScript, and
        Tailwind CSS. Building clean, accessible, and high-performing web
        experiences.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Link
          href="/pdf/Joshclxx_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="gh-btn gh-btn-primary w-full sm:w-auto justify-center text-sm py-1.5"
        >
          <Download className="h-4 w-4" />
          Download CV
        </Link>
        <button
          className="gh-btn w-full sm:w-auto justify-center text-sm py-1.5"
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
      <div className="space-y-1.5 mb-4 text-sm text-center lg:text-left">
        <div className="flex items-center gap-2 text-muted-foreground justify-center lg:justify-start">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span>Frontend Developer</span>
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
      <div className="border-b border-[var(--gh-border)] my-4" />

      {/* Highlights — GitHub achievement style */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Highlights
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="gh-badge transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-green)]" />
            Available for hire
          </span>
          <span className="gh-badge transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-blue)]" />
            5 Projects
          </span>
          <span className="gh-badge transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-purple)]" />
            1+ Years Exp
          </span>
        </div>
      </div>
    </section>
  );
}
