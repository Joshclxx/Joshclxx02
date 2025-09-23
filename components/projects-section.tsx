import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "Web-Based POS System",
    description:
      "A modern web-based Point of Sale (POS) system built with Next.js, featuring real-time inventory management, seamless payment integration, and an intuitive admin dashboard.",
    image: "/images/pos.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
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
      "React Native",
      "TypeScript",
      "React Navigation",
      "Zustand",
      "Expo",
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
      "Expo",
    ],
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            Featured <span className="text-accent">Projects</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live
                        </a>
                      </Button>

                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
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
