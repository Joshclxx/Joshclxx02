"use client";

import type React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/scroll-reveal";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const origin = window.location.origin;

    await fetch(`${origin}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: "New Message From Portfolio",
        message: formData.message,
      }),
    }).catch((err) => {
      console.log("Error in sending email:", err.message);
      toast.error("Something went wrong.");
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
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
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-foreground">
                    Let&apos;s Connect
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I&apos;m always interested in new opportunities and exciting
                    projects. Whether you have a question or just want to say hi,
                    feel free to reach out!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <a
                        href="mailto:joshclxx02@gmail.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        joshclxx02@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                      <FaWhatsapp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        WhatsApp
                      </p>
                      <p className="text-sm text-muted-foreground">
                        (+63) 967-455-5677
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Location
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quezon City, Philippines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right">
              <Card className="border-border/50 shadow-lg card-glow">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    Send Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-muted/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-muted/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <Textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full resize-none bg-muted/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 h-11"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Footer */}
      <ScrollReveal>
        <footer className="mt-24 pt-8 pb-8 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Brand */}
              <div className="text-center md:text-left">
                <p className="font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display), sans-serif' }}>Joshclxx</p>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} · Built with Next.js, TypeScript &
                  Tailwind CSS
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Joshclxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/Joshclxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  <Linkedin className="h-4 w-4" />
                </a>

                {/* Back to top */}
                <button
                  onClick={scrollToTop}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 ml-2"
                  aria-label="Back to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </section>
  );
}
