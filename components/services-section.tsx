import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, CheckCircle, Smartphone, GitBranch } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

const services = [
  {
    icon: Code,
    title: "Frontend Development",
    description:
      "Building responsive, performant web applications using modern frameworks like React, Next.js, and Tailwind CSS.",
  },
  {
    icon: Smartphone,
    title: "Responsive UI",
    description:
      "Pixel-perfect layouts tailored for mobile, tablet, and desktop views with fluid design systems.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Testing and reviewing work to ensure consistency, usability, and reliable performance across devices.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description:
      "Using Git and GitHub to manage code, track changes, and collaborate effectively in team projects.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                My <span className="text-primary">Services</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <ScrollReveal key={service.title} delay={index * 100}>
                  <Card className="group text-center border-border/50 hover:border-primary/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-glow h-full">
                    <CardHeader className="pb-2">
                      <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
