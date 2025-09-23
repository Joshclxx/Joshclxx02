import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            About <span className="text-accent">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-primary">
                    Hello, I'm Joshclxx!
                  </h3>
                  <p className="text-muted-foreground mb-4 text-pretty text-justify">
                    I'm a frontend developer passionate about building fast,
                    accessible, and responsive web interfaces. I specialize in
                    React, Next.js, TypeScript, Tailwind.CSS and—transforming
                    ideas and designs into smooth, pixel-perfect experiences.
                  </p>
                  <p className="text-muted-foreground mb-4 text-pretty text-justify">
                    With a strong focus on clean code, performance, and
                    responsive design, I enjoy turning complex requirements into
                    intuitive user interfaces that work seamlessly across all
                    devices.
                  </p>
                  <p className="text-muted-foreground text-pretty text-justify">
                    My core strengths include{" "}
                    <strong>Frontend Development</strong> and{" "}
                    <strong>Responsive Design</strong>, ensuring every project
                    is both visually engaging and technically sound.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 rounded-lg transform rotate-3" />
                <Card className="relative shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-primary">
                      Experience
                    </h4>
                    <p className="text-2xl font-bold text-accent">1+ Years</p>
                    <p className="text-sm text-muted-foreground">
                      Currently Studying Frontend Development
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-20 rounded-lg transform -rotate-2" />
                <Card className="relative shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-primary">
                      Projects
                    </h4>
                    <p className="text-2xl font-bold text-accent">4</p>
                    <p className="text-sm text-muted-foreground">
                      Completed Successfully
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-20 rounded-lg transform rotate-1" />
                <Card className="relative shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-primary">
                      Clients
                    </h4>
                    <p className="text-2xl font-bold text-accent">Not Yet</p>
                    <p className="text-sm text-muted-foreground">
                      Open for Opportunities
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
