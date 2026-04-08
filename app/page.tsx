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

import { PortfolioShell } from "@/components/portfolio-shell";
import { SectionWrapper } from "@/components/section-wrapper";
import { SkeletonLoading } from "@/components/skeleton-loading";

export default function Portfolio() {
  return (
    <PortfolioShell>
      <SkeletonLoading />
      <main className="min-h-screen bg-background">

        <Navigation />

        {/* GitHub-style layout: sidebar + content */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16">
          {/* Profile area: sidebar (fixed) + main content */}
          <SectionWrapper sectionId="hero">
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-10 py-4 sm:py-6 lg:py-8">
              {/* Left sidebar: fixed 296px on desktop, full-width centered on mobile */}
              <aside className="w-full lg:w-[296px] lg:flex-shrink-0">
                <HeroSection />
              </aside>

              {/* Right content: README + contributions + tech stack */}
              <div className="flex-1 min-w-0 lg:mt-0 space-y-0">
                <SectionWrapper sectionId="about">
                  <AboutSection />
                </SectionWrapper>
                <SectionWrapper sectionId="about">
                  <ContributionGraph />
                </SectionWrapper>
                <SectionWrapper sectionId="tech-stack">
                  <TechStackSection />
                </SectionWrapper>
              </div>
            </div>
          </SectionWrapper>

          {/* Full-width portfolio section */}
          <div className="space-y-0 pb-4">
            <SectionWrapper sectionId="projects">
              <ProjectsSection />

              <section className="py-4 sm:py-6 lg:py-8">
                <GitHubOverview />
              </section>
            </SectionWrapper>

            <SectionWrapper sectionId="certifications">
              <CertificationsSection />
            </SectionWrapper>

            <SectionWrapper sectionId="services">
              <ServicesSection />
            </SectionWrapper>

            <SectionWrapper sectionId="contact">
              <ContactSection />
            </SectionWrapper>
          </div>
        </div>
      </main>
    </PortfolioShell>
  );
}
