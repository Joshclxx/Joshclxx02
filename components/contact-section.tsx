"use client";

import type React from "react";
import { FaViber } from "react-icons/fa";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  ArrowUp,
  Paperclip,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/scroll-reveal";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("email", formData.email);
    body.append("message", formData.message);
    if (file) body.append("attachment", file);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        body,
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const error =
          result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "Something went wrong. Please try again.";
        throw new Error(error);
      }

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setFile(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="contact" className="py-8">
      {/* Section header */}
      <ScrollReveal>
        <div className="gh-section-heading text-base">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.75 1h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 13H8.061l-2.574 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25v-8.5C0 1.784.784 1 1.75 1ZM1.5 2.75v8.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Z" />
          </svg>
          Get In Touch
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {/* Contact Info */}
        <ScrollReveal direction="left">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Let&apos;s Connect
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I&apos;m always interested in new opportunities and exciting
                projects. Whether you have a question or just want to say hi,
                feel free to reach out!
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="mailto:joshclxx02@gmail.com"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[var(--gh-bg-secondary)] transition-colors group"
              >
                <Mail className="h-4 w-4 text-muted-foreground group-hover:text-[var(--gh-accent-blue)]" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">joshclxx02@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md">
                <FaViber className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Viber</p>
                  <p className="text-xs text-muted-foreground">9381712437</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-xs text-muted-foreground">Quezon City, Philippines</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Contact Form — GitHub issue/comment style */}
        <ScrollReveal direction="right">
          <div className="gh-card overflow-hidden">
            {/* Form header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--gh-bg-secondary)] border-b border-[var(--gh-border)]">
              <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Send a message</span>
            </div>

            {/* Form body */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1.5 text-sm bg-[var(--gh-bg)] border border-[var(--gh-border)] rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--gh-accent-blue)] focus:ring-1 focus:ring-[var(--gh-accent-blue)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1.5 text-sm bg-[var(--gh-bg)] border border-[var(--gh-border)] rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--gh-accent-blue)] focus:ring-1 focus:ring-[var(--gh-accent-blue)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Leave a message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-1.5 text-sm bg-[var(--gh-bg)] border border-[var(--gh-border)] rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--gh-accent-blue)] focus:ring-1 focus:ring-[var(--gh-accent-blue)] transition-colors resize-none"
                  />
                </div>

                {/* File attachment (optional) */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Attachment <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  {file ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--gh-bg)] border border-[var(--gh-border)] rounded-md">
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground truncate flex-1">{file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="p-0.5 rounded hover:bg-[var(--gh-btn-bg)] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--gh-bg)] border border-dashed border-[var(--gh-border)] rounded-md cursor-pointer hover:border-[var(--gh-accent-blue)] hover:bg-[var(--gh-bg-secondary)] transition-colors">
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Attach a file</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f && f.size > 5 * 1024 * 1024) {
                            toast.error("Attachments must be 5 MB or smaller.");
                          } else if (f) {
                            setFile(f);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`gh-btn gh-btn-primary w-full justify-center py-2.5 text-sm ${isSubmitting ? 'btn-loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-flex items-center gap-2 opacity-0">
                        <Send className="h-3.5 w-3.5" />
                        Send message
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Footer — GitHub style */}
      <ScrollReveal>
        <footer className="mt-8 sm:mt-16 pt-4 sm:pt-6 border-t border-[var(--gh-border)]">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-4 text-center sm:text-left">
            {/* Left — copyright & info */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} Joshclxx</span>
              <span className="hidden sm:inline">·</span>
              <span>Built with Next.js & Tailwind CSS</span>
            </div>

            {/* Right — social + back to top */}
            <div className="flex items-center gap-4 sm:gap-3">
              <a
                href="https://github.com/Joshclxx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/Joshclxx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>

              <span className="w-px h-4 bg-[var(--gh-border)]" />

              <button
                onClick={scrollToTop}
                className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </section>
  );
}
