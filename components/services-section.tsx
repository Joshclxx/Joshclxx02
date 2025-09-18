import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, CheckCircle, Smartphone, GitBranch } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Frontend Development",
    description:
      "Building responsive, performant web applications using modern frameworks like React, Next.js, and Vue.js.",
  },
  {
    icon: Smartphone,
    title: "Responsive UI",
    description:
      "Pixel-perfect layout tailored for mobile, tablet, and desktop views.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Testing and reviewing my work to ensure consistency, usability, and reliable performance across different devices.",
  },
  {
    icon: GitBranch,
    title: "Version Control & Collaboration",
    description:
      "Using tools like Git and to manage code, track changes, and collaborate effectively in team projects.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            My <span className="text-accent">Services</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-primary">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-pretty">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
