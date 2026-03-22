import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { ProjectsSection } from "@/components/projects-section";
import { CertificationsSection } from "@/components/certifications-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { Navigation } from "@/components/navigation";
import { CustomCursor } from "@/components/custom-cursor";
import { ShakeToContact } from "@/components/shake-to-contact";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Ambient background gradient */}
      <div className="gradient-mesh" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Mobile shake-to-contact feature */}
      <ShakeToContact />

      <Navigation />

      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <CertificationsSection />
        <ServicesSection />
        <ContactSection />
      </div>
    </main>
  );
}
