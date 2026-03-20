import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";

const projects = [
  {
    title: "Web-Based POS System",
    description:
      "A modern web-based Point of Sale (POS) system built with Next.js, featuring real-time inventory management, seamless payment integration, and an intuitive admin dashboard.",
    image: "/images/pos.png",
    technologies: [
      "Next JS",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Vercel",
      "Git",
    ],
    liveUrl:
      "https://pos-system-git-josh-joshuas-projects-a95d0abd.vercel.app/login?redirect=%2F",
    githubUrl: "https://github.com/Joshclxx/POS-System",
  },
  {
    title: "Card Again",
    description:
      "Teamed up to build a responsive e-commerce platform for Pokemon Cards, focusing on user dashboard, membership features, and performance.",
    image: "/images/card-again.png",
    technologies: ["Webflow"],
    liveUrl: "https://cardagain-d79530.webflow.io/sign-in",
  },
  {
    title: "School Management System",
    description:
      "Built the frontend of a non-financial school management information system, ensuring responsive design and optimized performance.",
    image: "/images/sms.png",
    technologies: [
      "Next JS",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Vercel",
      "Git",
    ],
  },
  {
    title: "Thrift Market Mobile App",
    description:
      "Built the frontend of a thrift market mobile application, ensuring responsive design and optimized performance.",
    image: "/images/thrift.png",
    technologies: [
      "React Native",
      "TypeScript",
      "React Navigation",
      "Zustand",
      "Git",
      "Expo",
    ],
  },
  {
    title: "Palabooks",
    description:
      "Palabooks is a modern web app designed for discovering new stories and showcasing the creativity of emerging writers.",
    image: "/images/palabooks.png",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Git"],
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Featured <span className="text-primary">Projects</span>
              </h2>
              <div className="w-12 h-0.5 bg-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 100}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-glow h-full">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={340}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="flex space-x-2">
                        {project.liveUrl && (
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                            asChild
                          >
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Live
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 text-black hover:bg-white shadow-lg"
                            asChild
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-3.5 w-3.5 mr-1" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {project.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
