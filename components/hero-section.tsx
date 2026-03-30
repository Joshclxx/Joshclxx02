"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Download, Mail, MapPin, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const [isDark, setIsDark] = useState(true);

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

  return (
    <section id="hero" className="animate-fade-in-up">
      {/* Profile Image */}
      <div className="mb-4 flex lg:justify-start justify-center">
        <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[296px] lg:h-[296px] aspect-square">
          <div className="w-full h-full rounded-full overflow-hidden border border-[var(--gh-border)] shadow-sm">
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
          {/* Hand wave badge — bottom-right, covers Gemini sparkle */}
          <div
            className="absolute bottom-2 right-2 w-[34px] h-[34px] lg:w-[38px] lg:h-[38px] rounded-full flex items-center justify-center shadow-md border-[2.5px] transition-colors duration-300"
            style={{
              backgroundColor: isDark ? "#ffffff" : "#24292f",
              borderColor: isDark ? "#ffffff" : "#24292f",
            }}
          >
            <span className="text-lg lg:text-xl leading-none select-none">👋</span>
          </div>
        </div>
      </div>


      {/* Name & Username */}
      <div className="mb-4 text-center lg:text-left">
        <h1 className="text-2xl font-semibold text-foreground leading-tight">
          Joshua Colobong
        </h1>
        <p className="text-xl font-light text-muted-foreground">
          Joshclxx
        </p>
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

      {/* Social links — GitHub style */}
      <div className="flex items-center gap-2 text-sm justify-center lg:justify-start">
        <a
          href="https://github.com/Joshclxx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-[var(--gh-accent-blue)] transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>Joshclxx</span>
        </a>
        <span className="text-muted-foreground">·</span>
        <a
          href="https://www.linkedin.com/in/Joshclxx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-[var(--gh-accent-blue)] transition-colors"
        >
          <Linkedin className="h-4 w-4" />
          <span>LinkedIn</span>
        </a>
      </div>

      {/* Divider */}
      <div className="border-b border-[var(--gh-border)] my-4" />

      {/* Highlights — GitHub achievement style */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Highlights
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="gh-badge">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-green)]" />
            Available for hire
          </span>
          <span className="gh-badge">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-blue)]" />
            5 Projects
          </span>
          <span className="gh-badge">
            <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-purple)]" />
            1+ Years Exp
          </span>
        </div>
      </div>
    </section>
  );
}
