import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { ProjectsSection } from "@/components/projects-section";
import { GitHubOverview } from "@/components/github-overview";
import { ContributionGraph } from "@/components/contribution-graph";
import { CertificationsSection } from "@/components/certifications-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { Navigation } from "@/components/navigation";
import { ShakeToContact } from "@/components/shake-to-contact";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-background">
      <ShakeToContact />
      <Navigation />

      {/* GitHub-style layout: sidebar + content */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 pt-16">
        {/* Profile area: sidebar (fixed) + main content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-6 lg:py-8">
          {/* Left sidebar: fixed 296px on desktop, full-width centered on mobile */}
          <aside className="w-full lg:w-[296px] lg:flex-shrink-0">
            <HeroSection />
          </aside>

          {/* Right content: README + contributions + tech stack */}
          <div className="flex-1 min-w-0 lg:mt-0">
            <AboutSection />
            <ContributionGraph />
            <TechStackSection />
          </div>
        </div>

        {/* Full-width portfolio section */}
        <div className="space-y-0 pb-4">
          <ProjectsSection />

          <section className="py-6 lg:py-8">
            <GitHubOverview />
          </section>

          <CertificationsSection />
          <ServicesSection />
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
