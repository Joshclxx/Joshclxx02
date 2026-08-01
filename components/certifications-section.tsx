import Image from "next/image";
import { ExternalLink, BadgeCheck, Award } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { PortfolioAchievement } from "@/lib/types";

export function CertificationsSection({ achievements }: { achievements: PortfolioAchievement[] }) {
  return (
    <section id="certifications" className="py-8">
      <ScrollReveal>
        <div className="gh-section-heading text-base">
          <Award className="h-4 w-4 text-muted-foreground" />
          Achievements & Certifications
          <span className="gh-counter">{achievements.length}</span>
        </div>
      </ScrollReveal>
      {achievements.length === 0 ? (
        <div className="repo-card border-dashed py-8 text-center">
          <Award className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">Achievements are on the way.</p>
          <p className="mt-1 text-xs text-muted-foreground">Published certificates will appear here.</p>
        </div>
      ) : (
        <div className="cert-timeline space-y-px">
          {achievements.map((achievement, index) => (
            <ScrollReveal key={achievement.id} delay={index * 60}>
              <a href={achievement.credential_url} target="_blank" rel="noopener noreferrer" className="cert-timeline-item group flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[var(--gh-bg-secondary)] transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden border border-[var(--gh-border)] transition-transform duration-200 group-hover:scale-110 z-10 bg-[var(--gh-bg-secondary)]">
                  <Image src={achievement.thumbnail_url} alt={`${achievement.issuer} logo`} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-[var(--gh-accent-blue)] transition-colors line-clamp-2 leading-snug">{achievement.title}</h3>
                    <BadgeCheck className="h-3.5 w-3.5 text-[var(--gh-accent-green)] flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.issuer} · {achievement.issue_year}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 transition-colors" />
              </a>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
