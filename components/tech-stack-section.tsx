"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaFigma,
  FaJsSquare,
} from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";

const technologies = [
  { name: "React", icon: <FaReact className="text-sky-500" />, level: 85 },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-black dark:text-white" />,
    level: 75,
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-blue-600" />,
    level: 85,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-cyan-500" />,
    level: 85,
  },
  {
    name: "JavaScript",
    icon: <FaJsSquare className="text-yellow-400" />,
    level: 75,
  },
  { name: "Node.js", icon: <FaNodeJs className="text-green-600" />, level: 80 },
  { name: "Git", icon: <FaGitAlt className="text-orange-600" />, level: 85 },
  { name: "Figma", icon: <FaFigma className="text-pink-500" />, level: 85 },
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            Tech <span className="text-accent">Stack</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <Card
                key={tech.name}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {tech.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {tech.name}
                  </h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${tech.level}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {tech.level}%
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
