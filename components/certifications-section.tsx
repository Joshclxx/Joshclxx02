import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
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
    <section id="certifications" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="text-primary">Certifications</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <ScrollReveal key={cert.title} delay={index * 80}>
                <a
                  href={cert.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="h-full border-border/50 hover:border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 border-l-2 border-l-primary/40 hover:border-l-primary card-glow">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={cert.logo || "/placeholder.svg"}
                          alt={`${cert.issuer} logo`}
                          width={64}
                          height={64}
                          className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-sm text-foreground mb-1 leading-snug">
                          {cert.title}
                        </h3>
                        <p className="text-muted-foreground text-xs mb-1">
                          {cert.issuer}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          {cert.date}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary flex-shrink-0 transition-colors duration-300" />
                    </CardContent>
                  </Card>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
