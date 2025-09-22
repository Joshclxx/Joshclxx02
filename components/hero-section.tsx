"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Download, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const to = "joshclxx02@gmail.com";
  const subject = encodeURIComponent("Hello Josh");
  const body = encodeURIComponent(
    "Hi Josh,\n\nI’d like to get in touch about..."
  );

  return (
    <section
      id="hero"
      className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-20" />

      {/* Decorative background objects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating squares */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-accent/30 rotate-45 animate-float" />
        <div
          className="absolute top-64 right-32 w-16 h-16 border border-secondary/50 rotate-12 animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Glowing circles */}
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-12 h-12 bg-secondary/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Star-like shape */}
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-accent rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />

        {/* Abstract blob */}
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-accent/20 to-secondary/10 rounded-[50%] blur-3xl animate-float-slow" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent shadow-2xl animate-glow">
                <Image
                  src="/images/Josh_Formal.png"
                  alt="Profile"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-background rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 text-balance">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Joshua Colobong
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            Frontend Developer
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
            Using React, Next.js & Tailwind CSS to deliver clean, accessible,
            and high-performing frontend solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/pdf/Joshclxx_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-glow"
              >
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
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
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/Joshclxx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110 transform"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/Joshclxx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110 transform"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
