import { Code, CheckCircle, Smartphone, GitBranch } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

const services = [
  {
    icon: Code,
    title: "Frontend Development",
    description:
      "Building responsive, performant web applications using modern frameworks like React, Next.js, and Tailwind CSS.",
    color: "var(--gh-accent-blue)",
  },
  {
    icon: Smartphone,
    title: "Responsive UI",
    description:
      "Pixel-perfect layouts tailored for mobile, tablet, and desktop views with fluid design systems.",
    color: "var(--gh-accent-green)",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Testing and reviewing work to ensure consistency, usability, and reliable performance across devices.",
    color: "var(--gh-accent-purple)",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description:
      "Using Git and GitHub to manage code, track changes, and collaborate effectively in team projects.",
    color: "var(--gh-accent-orange)",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-8">
      {/* Section header */}
      <ScrollReveal>
        <div className="gh-section-heading text-base">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.878.392a1.75 1.75 0 0 0-1.756 0l-5.25 3.045A1.75 1.75 0 0 0 1 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 0 0 1.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514ZM7.875 1.69a.25.25 0 0 1 .25 0l4.63 2.685L8 7.133 3.245 4.375ZM2.5 5.677l5 2.901v5.088l-4.75-2.754a.25.25 0 0 1-.25-.217ZM8.5 13.665V8.578l5-2.901v5.37a.25.25 0 0 1-.125.217Z" />
          </svg>
          Packages & Services
        </div>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <ScrollReveal key={service.title} delay={index * 80}>
              <div
                className="repo-card service-accent group hover:border-[var(--gh-text-secondary)]"
                style={{ '--service-color': service.color } as React.CSSProperties}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_-2px_var(--service-color)]"
                    style={{ backgroundColor: `color-mix(in srgb, ${service.color} 15%, transparent)` }}
                  >
                    <IconComponent
                      className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: service.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
