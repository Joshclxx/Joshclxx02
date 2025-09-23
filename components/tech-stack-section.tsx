"use client";

import Slider from "react-infinite-logo-slider";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaJsSquare,
  FaHtml5,
  FaCss3Alt,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiWebflow,
} from "react-icons/si";

const frameworksAndRuntime = [
  {
    name: "React",
    icon: <FaReact className="text-sky-500 text-4xl sm:text-5xl md:text-6xl" />,
  },
  {
    name: "Next.js",
    icon: (
      <SiNextdotjs className="text-black dark:text-white text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <SiTypescript className="text-blue-600 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <SiTailwindcss className="text-cyan-500 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "JavaScript",
    icon: (
      <FaJsSquare className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "Node.js",
    icon: (
      <FaNodeJs className="text-green-600 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "HTML",
    icon: (
      <FaHtml5 className="text-orange-500 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "CSS",
    icon: (
      <FaCss3Alt className="text-blue-500 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "Webflow",
    icon: (
      <SiWebflow className="text-blue-700 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
];

const toolsAndCollab = [
  {
    name: "Git",
    icon: (
      <FaGitAlt className="text-orange-600 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "GitHub",
    icon: (
      <FaGithub className="text-gray-800 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "Figma",
    icon: (
      <FaFigma className="text-pink-500 text-4xl sm:text-5xl md:text-6xl" />
    ),
  },
  {
    name: "VS Code",
    icon: (
      <img
        src="/icon/vscode.svg"
        alt="VS Code"
        className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16"
      />
    ),
  },
  {
    name: "Vercel",
    icon: (
      <img
        src="/icon/vercel.svg"
        alt="Vercel"
        className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16"
      />
    ),
  },
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12">
            Tech <span className="text-accent">Stack</span>
          </h2>

          {/* Two rows of sliders */}
          <div className="flex flex-col gap-8 sm:gap-12">
            {/* Row 1 - Frameworks & Runtime */}
            <Slider
              width="140px"
              duration={25}
              pauseOnHover={true}
              blurBorders={false}
              blurBorderColor={"#27e6ec"}
            >
              {frameworksAndRuntime.map((tech) => (
                <Slider.Slide key={tech.name}>
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
                    {tech.icon}
                    <span className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg font-semibold text-foreground">
                      {tech.name}
                    </span>
                  </div>
                </Slider.Slide>
              ))}
            </Slider>

            {/* Row 2 - Tools & Collaboration */}
            <Slider
              width="140px"
              duration={15}
              pauseOnHover={true}
              blurBorders={false}
              blurBorderColor={"#fff"}
            >
              {toolsAndCollab.map((tool) => (
                <Slider.Slide key={tool.name}>
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
                    {tool.icon}
                    <span className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg font-semibold text-foreground">
                      {tool.name}
                    </span>
                  </div>
                </Slider.Slide>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}
