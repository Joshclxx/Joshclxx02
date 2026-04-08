import Image from "next/image";
import { ExternalLink, BadgeCheck } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

const certifications = [
  {
    title: "Six Sigma Yellow Belt",
    issuer: "Six Sigma Study Targeting Success",
    date: "2025",
    logo: "/images/six-sigma.png",
    pdf: "/pdf/Six-Sigma.pdf",
  },
  {
    title: "Alteryx Foundation Micro Credential",
    issuer: "Alteryx Foundation",
    date: "2025",
    logo: "/images/alteryx-micro.png",
    pdf: "/pdf/Alteryx-Foundation-Micro.pdf",
  },
  {
    title: "UiPath Automation Implementation Methodology",
    issuer: "UiPath",
    date: "2025",
    logo: "/images/ui-path-automation.png",
    pdf: "/pdf/UiPath-Automation.pdf",
  },
  {
    title: "Automation Business Analysis Fundamentals",
    issuer: "UiPath",
    date: "2025",
    logo: "/images/ui-path-business.png",
    pdf: "/pdf/Uipath-Business.pdf",
  },
  {
    title: "Associate Data Analyst",
    issuer: "DataCamp",
    date: "2025",
    logo: "/images/ada.png",
    pdf: "https://www.datacamp.com/certificate/DAA0018643506806",
  },
];

export function CertificationsSection() {
  return (
    <section id="certifications" className="py-8">
      {/* Section header */}
      <ScrollReveal>
        <div className="gh-section-heading text-base">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z" />
          </svg>
          Achievements & Certifications
          <span className="gh-counter">{certifications.length}</span>
        </div>
      </ScrollReveal>

      {/* Certification list — GitHub timeline style */}
      <div className="cert-timeline space-y-px">
        {certifications.map((cert, index) => (
          <ScrollReveal key={cert.title} delay={index * 60}>
            <a
              href={cert.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-timeline-item group flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[var(--gh-bg-secondary)] transition-colors"
            >
              {/* Cert logo */}
              <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border border-[var(--gh-border)] transition-transform duration-200 group-hover:scale-110 z-10 bg-[var(--gh-bg-secondary)]">
                <Image
                  src={cert.logo || "/placeholder.svg"}
                  alt={`${cert.issuer} logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Cert info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-[var(--gh-accent-blue)] transition-colors line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>
                  <BadgeCheck className="h-3.5 w-3.5 text-[var(--gh-accent-green)] flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {cert.issuer} · {cert.date}
                </p>
              </div>

              {/* External link icon */}
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 transition-colors" />
            </a>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
