import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const certifications = [
  {
    title: "Six Sigma Yellow belt",
    issuer: "Sis Sigma Study Targeting Success",
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
    title: "UiPath Automation Implementation Methodology Fundamentals",
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
];

export function CertificationsSection() {
  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            <span className="text-accent">Certifications</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card
                key={cert.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={cert.logo || "/placeholder.svg"}
                        alt={`${cert.issuer} logo`}
                        width={80}
                        height={80}
                        className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </a>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-primary mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground mb-1">{cert.issuer}</p>
                    <p className="text-sm text-accent font-medium">
                      {cert.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
