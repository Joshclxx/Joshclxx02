"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

// ── Game Card Data ───────────────────────────────────────────────────────
const games = [
  {
    id: "xox",
    title: "Tic-Tac-Toe",
    subtitle: "XOX",
    description: "Challenge the pet cat in a classic game of X's and O's. Three difficulty levels — can you outsmart the cat?",
    href: "/play/xox",
    emoji: "❌⭕",
    tags: ["1v1", "vs Bot", "Strategy"],
    color: "var(--gh-accent-blue)",
    bgGlow: "rgba(88, 166, 255, 0.08)",
    borderGlow: "rgba(88, 166, 255, 0.3)",
    catSvg: (
      <svg width={64} height={64} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
        <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
        <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
        <circle cx="40" cy="30" r="20" fill="#374151" />
        <polygon points="24,16 18,2 32,12" fill="#374151" />
        <polygon points="24,15 19,4 31,12" fill="#fda4af" />
        <polygon points="56,16 62,2 48,12" fill="#374151" />
        <polygon points="56,15 61,4 49,12" fill="#fda4af" />
        <circle cx="32" cy="27" r="5" fill="white" />
        <circle cx="48" cy="27" r="5" fill="white" />
        <circle cx="33" cy="27" r="3" fill="#1a1f2e" />
        <circle cx="49" cy="27" r="3" fill="#1a1f2e" />
        <circle cx="34" cy="26" r="1.2" fill="white" />
        <circle cx="50" cy="26" r="1.2" fill="white" />
        <polygon points="40,34 38,37 42,37" fill="#fda4af" />
        <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
        <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
        {/* Paw waving */}
        <ellipse cx="58" cy="60" rx="6" ry="4" fill="#4b5563" transform="rotate(-30, 58, 60)" style={{ animation: "hubPawWave 1.5s ease-in-out infinite" }} />
      </svg>
    ),
  },
  {
    id: "memory",
    title: "Memory Match",
    subtitle: "PAIRS",
    description: "Test your memory against the cat — take turns flipping cards to find matching pairs. The cat remembers more on harder difficulties!",
    href: "/play/memory",
    emoji: "🧠🃏",
    tags: ["1v1", "vs Bot", "Memory"],
    color: "var(--gh-accent-purple)",
    bgGlow: "rgba(188, 140, 255, 0.08)",
    borderGlow: "rgba(188, 140, 255, 0.3)",
    catSvg: (
      <svg width={64} height={64} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
        <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
        <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
        <circle cx="40" cy="30" r="20" fill="#374151" />
        <polygon points="24,16 18,2 32,12" fill="#374151" />
        <polygon points="24,15 19,4 31,12" fill="#fda4af" />
        <polygon points="56,16 62,2 48,12" fill="#374151" />
        <polygon points="56,15 61,4 49,12" fill="#fda4af" />
        {/* Curious wide eyes */}
        <circle cx="32" cy="27" r="6" fill="white" />
        <circle cx="48" cy="27" r="6" fill="white" />
        <circle cx="33" cy="27" r="3.5" fill="#1a1f2e" />
        <circle cx="49" cy="27" r="3.5" fill="#1a1f2e" />
        <circle cx="34" cy="26" r="1.3" fill="white" />
        <circle cx="50" cy="26" r="1.3" fill="white" />
        <polygon points="40,34 38,37 42,37" fill="#fda4af" />
        <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
        <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
        {/* Thinking dots */}
        <circle cx="66" cy="16" r="2" fill="#bc8cff" style={{ animation: "hubPawWave 1.5s ease-in-out infinite 0s" }} />
        <circle cx="72" cy="10" r="3" fill="#bc8cff" style={{ animation: "hubPawWave 1.5s ease-in-out infinite 0.3s" }} />
      </svg>
    ),
  },
  {
    id: "chase",
    title: "Cat Chase",
    subtitle: "BUGS",
    description: "Tap bugs before they escape! Build combos for multiplied points. How high can you score in 30 seconds?",
    href: "/play/chase",
    emoji: "🐾🐛",
    tags: ["Solo", "Reaction", "High Score"],
    color: "var(--gh-accent-green)",
    bgGlow: "rgba(63, 185, 80, 0.08)",
    borderGlow: "rgba(63, 185, 80, 0.3)",
    catSvg: (
      <svg width={64} height={64} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
        <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
        <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
        <circle cx="40" cy="30" r="20" fill="#374151" />
        <polygon points="24,16 18,2 32,12" fill="#374151" />
        <polygon points="24,15 19,4 31,12" fill="#fda4af" />
        <polygon points="56,16 62,2 48,12" fill="#374151" />
        <polygon points="56,15 61,4 49,12" fill="#fda4af" />
        {/* Excited wide eyes */}
        <circle cx="32" cy="27" r="6" fill="white" />
        <circle cx="48" cy="27" r="6" fill="white" />
        <circle cx="34" cy="27" r="4" fill="#1a1f2e" />
        <circle cx="50" cy="27" r="4" fill="#1a1f2e" />
        <circle cx="35" cy="26" r="1.5" fill="white" />
        <circle cx="51" cy="26" r="1.5" fill="white" />
        <polygon points="40,34 38,37 42,37" fill="#fda4af" />
        <path d="M36,38 Q40,42 44,38" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
        <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
        {/* Paw swiping */}
        <ellipse cx="60" cy="58" rx="6" ry="4" fill="#4b5563" transform="rotate(-20, 60, 58)" style={{ animation: "hubPawWave 0.6s ease-in-out infinite" }} />
      </svg>
    ),
  },
  {
    id: "sudoku",
    title: "Sudoku",
    subtitle: "9×9",
    description: "Fill the grid with numbers 1–9. Three difficulty levels, hints, and notes — can you solve it before the cat falls asleep?",
    href: "/play/sudoku",
    emoji: "🧩🔢",
    tags: ["Solo", "Puzzle", "Logic"],
    color: "var(--gh-accent-orange)",
    bgGlow: "rgba(210, 153, 34, 0.08)",
    borderGlow: "rgba(210, 153, 34, 0.3)",
    catSvg: (
      <svg width={64} height={64} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
        <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
        <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
        <circle cx="40" cy="30" r="20" fill="#374151" />
        <polygon points="24,16 18,2 32,12" fill="#374151" />
        <polygon points="24,15 19,4 31,12" fill="#fda4af" />
        <polygon points="56,16 62,2 48,12" fill="#374151" />
        <polygon points="56,15 61,4 49,12" fill="#fda4af" />
        {/* Focused eyes */}
        <circle cx="32" cy="27" r="5" fill="white" />
        <circle cx="48" cy="27" r="5" fill="white" />
        <circle cx="33" cy="29" r="3" fill="#1a1f2e" />
        <circle cx="49" cy="29" r="3" fill="#1a1f2e" />
        <circle cx="34" cy="28" r="1.2" fill="white" />
        <circle cx="50" cy="28" r="1.2" fill="white" />
        <polygon points="40,34 38,37 42,37" fill="#fda4af" />
        <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
        <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
        {/* Pencil in paw */}
        <line x1="58" y1="64" x2="66" y2="52" stroke="#d29922" strokeWidth="3" strokeLinecap="round" style={{ animation: "hubPawWave 2s ease-in-out infinite" }} />
      </svg>
    ),
  },
];

// ── Main Component ───────────────────────────────────────────────────────
export default function PlayHub() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleGameClick = useCallback(
    (e: React.MouseEvent, game: { id: string; href: string }) => {
      e.preventDefault();
      if (loadingId) return; // prevent double-click
      setLoadingId(game.id);
      router.push(game.href);
    },
    [loadingId, router]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">

      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-muted-foreground mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-green)] animate-pulse" />
          Arcade Mode
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
          🎮 Game Arcade
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Take a break and play some games with the Pet Cat. Pick a game below to get started!
        </p>
      </div>

      {/* Available Games */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-5 animate-fade-in-up delay-100">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Available Games</h2>
          <span className="inline-flex items-center justify-center min-w-[1.25rem] px-1.5 text-[10px] font-bold rounded-full bg-[var(--gh-accent-green)] text-white">
            {games.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {games.map((game, index) => {
            const isHovered = hoveredId === game.id;
            const isLoading = loadingId === game.id;
            return (
              <a
                key={game.id}
                href={game.href}
                className="group block animate-fade-in-up"
                style={{
                  animationDelay: `${(index + 2) * 100}ms`,
                  pointerEvents: loadingId ? "none" : "auto",
                  opacity: loadingId && !isLoading ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={() => setHoveredId(game.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => handleGameClick(e, game)}
                id={`game-${game.id}`}
              >
                <div
                  className="relative rounded-xl border p-4 transition-all duration-300 overflow-hidden h-full"
                  style={{
                    borderColor: isHovered ? game.borderGlow : "var(--gh-border)",
                    background: isHovered ? game.bgGlow : "var(--gh-bg-secondary)",
                    boxShadow: isHovered
                      ? `0 0 24px ${game.borderGlow}, 0 8px 24px rgba(0,0,0,0.12)`
                      : "0 2px 8px rgba(0,0,0,0.06)",
                    transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                  }}
                >


                  <div className="relative flex flex-col items-center text-center gap-3">
                    {/* Cat avatar */}
                    <div
                      className="rounded-xl p-2 border transition-all duration-300"
                      style={{
                        borderColor: isHovered ? game.borderGlow : "var(--gh-border)",
                        background: "var(--gh-bg)",
                        boxShadow: isHovered ? `0 0 12px ${game.borderGlow}` : "none",
                      }}
                    >
                      {game.catSvg}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-[var(--gh-accent-blue)] transition-colors mb-1">
                        {game.title}
                      </h3>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {game.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-medium rounded-full border border-[var(--gh-border)] text-muted-foreground bg-[var(--gh-bg)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Play indicator / Loading spinner */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300"
                      style={{
                        borderColor: isLoading || isHovered ? game.color : "var(--gh-border)",
                        background: isLoading ? game.bgGlow : isHovered ? game.bgGlow : "transparent",
                        color: isLoading || isHovered ? game.color : "var(--gh-text-secondary)",
                        transform: isHovered ? "scale(1.15)" : "scale(1)",
                        boxShadow: isLoading || isHovered ? `0 0 10px ${game.borderGlow}` : "none",
                      }}
                    >
                      {isLoading ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="animate-spin"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="6,3 20,12 6,21" />
                        </svg>
                      )}
                    </div>

                    {/* Loading label */}
                    {isLoading && (
                      <div
                        className="text-[10px] font-medium mt-1"
                        style={{ color: game.color, animation: "hubPulseText 1.2s ease-in-out infinite" }}
                      >
                        Loading...
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>


      {/* Animations */}
      <style>{`
        @keyframes hubPawWave {
          0%, 100% { transform: rotate(-30deg) translateY(0); }
          50% { transform: rotate(-10deg) translateY(-3px); }
        }
        @keyframes hubPulseText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

      `}</style>
    </div>
  );
}
