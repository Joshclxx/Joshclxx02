"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Download, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Profile Image */}
          <div className="mb-10 flex justify-center animate-fade-in-up">
            <div className="relative">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden relative ring-4 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl transition-all duration-700 hover:ring-primary/40">
                {/* Dark mode image (default) */}
                <Image
                  src="/images/josh-profile.png"
                  alt="Joshua Colobong — Frontend Developer"
                  width={176}
                  height={176}
                  priority
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out profile-dark"
                />
                {/* Light mode image */}
                <Image
                  src="/images/josh-profile-light.png"
                  alt="Joshua Colobong — Frontend Developer"
                  width={176}
                  height={176}
                  priority
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out profile-light"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 animate-fade-in-up delay-100 tracking-tight">
            Joshua Colobong
          </h1>

          {/* Role badge */}
          <div className="animate-fade-in-up delay-200 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Frontend Developer
            </span>
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed animate-fade-in-up delay-300">
            Building clean, accessible, and high-performing frontend solutions
            with React, Next.js & Tailwind CSS.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14 animate-fade-in-up delay-400">
            <Link
              href="/pdf/Joshclxx_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 px-8 h-12 text-base"
              >
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted hover:border-primary/30 transition-all duration-300 bg-transparent px-8 h-12 text-base"
              onClick={() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 animate-fade-in-up delay-500">
            <a
              href="https://github.com/Joshclxx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/Joshclxx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
