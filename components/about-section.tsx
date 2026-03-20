import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FolderOpen, Users } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

const stats = [
  {
    icon: Briefcase,
    value: "1+ Years",
    label: "Experience",
    description: "Currently Studying Frontend Development",
  },
  {
    icon: FolderOpen,
    value: "5",
    label: "Projects",
    description: "Completed Successfully",
  },
  {
    icon: Users,
    value: "Open",
    label: "Availability",
    description: "Seeking New Opportunities",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                About <span className="text-primary">Me</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Bio Text — takes 3 cols */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="left">
                <Card className="shadow-md border-border/50 card-glow">
                  <CardContent className="p-8 md:p-10">
                    <h3 className="text-2xl font-semibold mb-5 text-foreground">
                      Hello, I&apos;m{" "}
                      <span className="text-primary">Joshclxx</span>!
                    </h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        I&apos;m a frontend developer passionate about building
                        fast, accessible, and responsive web interfaces. I
                        specialize in React, Next.js, TypeScript, and
                        Tailwind CSS — transforming ideas and designs into
                        smooth, pixel-perfect experiences.
                      </p>
                      <p>
                        With a strong focus on clean code, performance, and
                        responsive design, I enjoy turning complex requirements
                        into intuitive user interfaces that work seamlessly
                        across all devices.
                      </p>
                      <p>
                        My core strengths include{" "}
                        <strong className="text-foreground">
                          Frontend Development
                        </strong>{" "}
                        and{" "}
                        <strong className="text-foreground">
                          Responsive Design
                        </strong>
                        , ensuring every project is both visually engaging and
                        technically sound.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Stats — takes 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <ScrollReveal key={stat.label} direction="right" delay={index * 120}>
                    <Card className="shadow-md border-border/50 hover:border-primary/20 transition-colors duration-300 card-glow">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-0.5">
                            {stat.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
