"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────
type Card = {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
};
type Player = "human" | "cat";
type GamePhase = "playing" | "finished";
type Difficulty = "easy" | "medium" | "hard";

// ── Emoji Sets ───────────────────────────────────────────────────────────
const EMOJI_POOL = [
  "🐱", "🐶", "🦊", "🐼", "🐨", "🐯", "🦁", "🐸",
  "🐙", "🦋", "🌸", "🔥", "⚡", "🎸", "🚀", "💎",
  "🍕", "🎮", "🎯", "🧩", "🌈", "🍀", "🎪", "🦄",
];

const GRID_CONFIG: Record<Difficulty, { pairs: number; cols: number }> = {
  easy:   { pairs: 6,  cols: 4 },
  medium: { pairs: 8,  cols: 4 },
  hard:   { pairs: 10, cols: 5 },
};

// Bot memory: how likely the cat remembers a card position (0–1)
const BOT_MEMORY: Record<Difficulty, number> = {
  easy:   0.15,
  medium: 0.45,
  hard:   0.80,
};

// ── Cat SVGs ─────────────────────────────────────────────────────────────
function CatThinking() {
  return (
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
      <circle cx="31" cy="25" r="3" fill="#1a1f2e" />
      <circle cx="47" cy="25" r="3" fill="#1a1f2e" />
      <circle cx="30" cy="24" r="1.2" fill="white" />
      <circle cx="46" cy="24" r="1.2" fill="white" />
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      <circle cx="66" cy="18" r="2.5" fill="#8b949e" style={{ animation: "memDot 1.5s ease-in-out infinite 0s" }} />
      <circle cx="72" cy="12" r="3.5" fill="#8b949e" style={{ animation: "memDot 1.5s ease-in-out infinite 0.3s" }} />
      <circle cx="78" cy="4" r="4.5" fill="#8b949e" style={{ animation: "memDot 1.5s ease-in-out infinite 0.6s" }} />
    </svg>
  );
}

function CatHappy() {
  return (
    <svg width={64} height={64} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      <path d="M27,27 Q32,22 37,27" fill="none" stroke="#1a1f2e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M43,27 Q48,22 53,27" fill="none" stroke="#1a1f2e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="25" cy="33" r="4" fill="rgba(253, 164, 175, 0.3)" />
      <circle cx="55" cy="33" r="4" fill="rgba(253, 164, 175, 0.3)" />
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M36,38 Q40,42 44,38" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      <text x="8" y="14" fontSize="12" style={{ animation: "memSparkle 1s ease-in-out infinite" }}>✨</text>
      <text x="64" y="10" fontSize="10" style={{ animation: "memSparkle 1s ease-in-out infinite 0.5s" }}>⭐</text>
    </svg>
  );
}

function CatSad() {
  return (
    <svg width={64} height={64} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      <circle cx="32" cy="27" r="6" fill="white" />
      <circle cx="48" cy="27" r="6" fill="white" />
      <circle cx="33" cy="29" r="3.5" fill="#1a1f2e" />
      <circle cx="49" cy="29" r="3.5" fill="#1a1f2e" />
      <circle cx="34" cy="28" r="1.2" fill="white" />
      <circle cx="50" cy="28" r="1.2" fill="white" />
      <ellipse cx="36" cy="35" rx="1.5" ry="2.5" fill="#58a6ff" style={{ animation: "memTear 2s ease-in-out infinite" }} />
      <polygon points="40,35 38,38 42,38" fill="#fda4af" />
      <path d="M37,39 Q40,37 43,39" fill="none" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
    </svg>
  );
}

function CatNeutral() {
  return (
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
    </svg>
  );
}

// ── Cat Dialogue ─────────────────────────────────────────────────────────
const CAT_LINES = {
  start: ["Let's flip some cards! 🐾", "I have purr-fect memory!", "Ready? Meow!", "I never forget~ 🧠"],
  thinking: ["Hmm, where was it...", "Let me remember...", "I saw that one before...", "Meow-ment please..."],
  catMatch: ["Found a pair! 😸", "Too easy!", "Meow-gnificent! ✨", "My memory is purrfect!"],
  catMiss: ["Oops! 😿", "I'll remember next time...", "Meh, almost!", "That wasn't right..."],
  humanMatch: ["Lucky guess! 🙄", "Hmph! Not bad...", "You got one...", "Beginner's luck!"],
  humanMiss: ["Hehe~ my turn! 😼", "I saw those! 👀", "Noted! 📝", "Too slow, human!"],
  catWin: ["Cat wins! Meow! 🏆", "Told you I'm purrfect!", "git push --force victory!", "GG EZ 😸"],
  humanWin: ["Nooo! 😿", "Rematch! Please!", "Bug in my memory...", "You cheated! ...maybe not"],
  draw: ["A tie! Not bad~", "We're even... for now!", "Fair game, human!", "Stalemate! 🤝"],
};

function randomLine(key: keyof typeof CAT_LINES): string {
  const lines = CAT_LINES[key];
  return lines[Math.floor(Math.random() * lines.length)];
}

// ── Shuffle ──────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(pairs: number): Card[] {
  const emojis = shuffle(EMOJI_POOL).slice(0, pairs);
  const cards = emojis.flatMap((emoji, i) => [
    { id: i * 2, emoji, matched: false, flipped: false },
    { id: i * 2 + 1, emoji, matched: false, flipped: false },
  ]);
  return shuffle(cards);
}

// ── Main Component ───────────────────────────────────────────────────────
export default function MemoryMatchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<Card[]>([]);
  const [turn, setTurn] = useState<Player>("human");
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [selected, setSelected] = useState<number[]>([]);
  const [scores, setScores] = useState({ human: 0, cat: 0 });
  const [totalScores, setTotalScores] = useState({ human: 0, cat: 0, draws: 0 });
  const [catMessage, setCatMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [gameCount, setGameCount] = useState(0);
  const [lastMatchedIds, setLastMatchedIds] = useState<number[]>([]);

  // Bot memory: stores emoji→card_id mapping for cards the bot has "seen"
  const botMemory = useRef<Map<string, number[]>>(new Map());
  const turnTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Hydration-safe init ──
  useEffect(() => { setCatMessage(randomLine("start")); }, []);

  // ── Init ─────────────────────────────────────────────────────────────
  const startGame = useCallback((diff: Difficulty) => {
    clearTimeout(turnTimerRef.current);
    const { pairs } = GRID_CONFIG[diff];
    const deck = createDeck(pairs);
    setCards(deck);
    setTurn("human");
    setPhase("playing");
    setSelected([]);
    setScores({ human: 0, cat: 0 });
    setCatMessage(randomLine("start"));
    setIsLocked(false);
    setLastMatchedIds([]);
    setGameCount((c) => c + 1);
    botMemory.current = new Map();
  }, []);

  // Init on mount
  useEffect(() => {
    startGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Check win ────────────────────────────────────────────────────────
  const checkGameEnd = useCallback((newCards: Card[], newScores: typeof scores) => {
    if (newCards.every((c) => c.matched)) {
      setPhase("finished");
      if (newScores.human > newScores.cat) {
        setCatMessage(randomLine("humanWin"));
        setTotalScores((s) => ({ ...s, human: s.human + 1 }));
      } else if (newScores.cat > newScores.human) {
        setCatMessage(randomLine("catWin"));
        setTotalScores((s) => ({ ...s, cat: s.cat + 1 }));
      } else {
        setCatMessage(randomLine("draw"));
        setTotalScores((s) => ({ ...s, draws: s.draws + 1 }));
      }
    }
  }, []);

  // ── Record to bot memory ──────────────────────────────────────────────
  const recordToMemory = useCallback((cardId: number, emoji: string) => {
    const mem = botMemory.current;
    const existing = mem.get(emoji) ?? [];
    if (!existing.includes(cardId)) {
      mem.set(emoji, [...existing, cardId]);
    }
  }, []);

  // ── Flip pair evaluation (shared by human and bot) ───────────────────
  const evaluatePair = useCallback(
    (first: number, second: number, currentCards: Card[], player: Player) => {
      const c1 = currentCards[first];
      const c2 = currentCards[second];

      if (c1.emoji === c2.emoji) {
        // Match!
        const newCards = currentCards.map((c) =>
          c.id === c1.id || c.id === c2.id ? { ...c, matched: true, flipped: true } : c
        );
        setCards(newCards);
        setLastMatchedIds([c1.id, c2.id]);
        const newScores = {
          ...scores,
          [player]: scores[player] + 1,
        };
        setScores(newScores);
        setCatMessage(randomLine(player === "cat" ? "catMatch" : "humanMatch"));
        setSelected([]);

        // Check win
        if (newCards.every((c) => c.matched)) {
          setPhase("finished");
          const finalScores = newScores;
          if (finalScores.human > finalScores.cat) {
            setCatMessage(randomLine("humanWin"));
            setTotalScores((s) => ({ ...s, human: s.human + 1 }));
          } else if (finalScores.cat > finalScores.human) {
            setCatMessage(randomLine("catWin"));
            setTotalScores((s) => ({ ...s, cat: s.cat + 1 }));
          } else {
            setCatMessage(randomLine("draw"));
            setTotalScores((s) => ({ ...s, draws: s.draws + 1 }));
          }
          setIsLocked(false);
          return;
        }

        // Same player goes again after a brief pause
        turnTimerRef.current = setTimeout(() => {
          setLastMatchedIds([]);
          if (player === "cat") {
            botTurn(newCards);
          } else {
            setIsLocked(false);
          }
        }, 800);
      } else {
        // No match — flip back
        setCatMessage(randomLine(player === "cat" ? "catMiss" : "humanMiss"));
        turnTimerRef.current = setTimeout(() => {
          const newCards = currentCards.map((c) =>
            c.id === c1.id || c.id === c2.id ? { ...c, flipped: false } : c
          );
          setCards(newCards);
          setSelected([]);
          setLastMatchedIds([]);

          // Switch turns
          if (player === "human") {
            setTurn("cat");
            setIsLocked(true);
            turnTimerRef.current = setTimeout(() => botTurn(newCards), 700);
          } else {
            setTurn("human");
            setIsLocked(false);
          }
        }, 1000);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scores]
  );

  // ── Bot turn ─────────────────────────────────────────────────────────
  const botTurn = useCallback(
    (currentCards: Card[]) => {
      setCatMessage(randomLine("thinking"));
      setIsLocked(true);

      const memChance = BOT_MEMORY[difficulty];
      const unmatched = currentCards
        .map((c, i) => ({ ...c, index: i }))
        .filter((c) => !c.matched);

      if (unmatched.length < 2) return;

      const delay1 = 600 + Math.random() * 600;

      setTimeout(() => {
        // Check if bot remembers a pair
        let knownPair: [number, number] | null = null;
        if (Math.random() < memChance) {
          const mem = botMemory.current;
          for (const [emoji, ids] of mem.entries()) {
            const unmatchedIds = ids.filter((id) => {
              const card = currentCards.find((c) => c.id === id);
              return card && !card.matched;
            });
            if (unmatchedIds.length >= 2) {
              const idx1 = currentCards.findIndex((c) => c.id === unmatchedIds[0]);
              const idx2 = currentCards.findIndex((c) => c.id === unmatchedIds[1]);
              if (idx1 !== -1 && idx2 !== -1) {
                knownPair = [idx1, idx2];
                break;
              }
            }
          }
        }

        let pick1: number, pick2: number;
        if (knownPair) {
          [pick1, pick2] = knownPair;
        } else {
          // Random picks
          const shuffled = shuffle(unmatched);
          pick1 = shuffled[0].index;
          pick2 = shuffled[1].index;
        }

        // Flip first card
        const afterFlip1 = currentCards.map((c, i) =>
          i === pick1 ? { ...c, flipped: true } : c
        );
        setCards(afterFlip1);
        setSelected([pick1]);
        recordToMemory(afterFlip1[pick1].id, afterFlip1[pick1].emoji);

        // Flip second card after delay
        const delay2 = 500 + Math.random() * 500;
        turnTimerRef.current = setTimeout(() => {
          const afterFlip2 = afterFlip1.map((c, i) =>
            i === pick2 ? { ...c, flipped: true } : c
          );
          setCards(afterFlip2);
          setSelected([pick1, pick2]);
          recordToMemory(afterFlip2[pick2].id, afterFlip2[pick2].emoji);

          // Evaluate after brief show
          turnTimerRef.current = setTimeout(() => {
            evaluatePair(pick1, pick2, afterFlip2, "cat");
          }, 700);
        }, delay2);
      }, delay1);
    },
    [difficulty, evaluatePair, recordToMemory]
  );

  // ── Human card click ─────────────────────────────────────────────────
  const handleCardClick = useCallback(
    (index: number) => {
      if (isLocked || phase !== "playing" || turn !== "human") return;
      const card = cards[index];
      if (card.matched || card.flipped || selected.includes(index)) return;

      // Record to bot memory (bot "peeks" at revealed cards)
      if (Math.random() < BOT_MEMORY[difficulty]) {
        recordToMemory(card.id, card.emoji);
      }

      const newCards = cards.map((c, i) =>
        i === index ? { ...c, flipped: true } : c
      );
      setCards(newCards);

      const newSelected = [...selected, index];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setIsLocked(true);
        setTimeout(() => {
          evaluatePair(newSelected[0], newSelected[1], newCards, "human");
        }, 600);
      }
    },
    [cards, selected, isLocked, phase, turn, difficulty, evaluatePair, recordToMemory]
  );

  // ── Derived state ────────────────────────────────────────────────────
  const { cols } = GRID_CONFIG[difficulty];
  const catMood =
    phase === "finished"
      ? scores.cat > scores.human
        ? "happy"
        : scores.cat < scores.human
        ? "sad"
        : "neutral"
      : turn === "cat"
      ? "thinking"
      : "neutral";

  const totalPairs = GRID_CONFIG[difficulty].pairs;

  return (
    <div className="h-full overflow-hidden flex flex-col px-4 sm:px-6 py-2">
      {/* Title — hidden on mobile to save space */}
      <div className="hidden sm:block text-center mb-2 animate-fade-in-up flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground mb-0.5 flex items-center justify-center gap-2">
          <span>🧠</span>
          Memory Match
          <span>🐱</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Find all pairs before the cat does — take turns flipping 2 cards!
        </p>
      </div>

      {/* Difficulty */}
      <div className="flex justify-center gap-2 mb-2 animate-fade-in-up delay-100 flex-shrink-0">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d);
              startGame(d);
            }}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md border transition-all duration-200 ${
              difficulty === d
                ? "bg-[var(--gh-accent-purple)] text-white border-[var(--gh-accent-purple)] shadow-[0_0_12px_rgba(188,140,255,0.3)]"
                : "bg-[var(--gh-btn-bg)] text-muted-foreground border-[var(--gh-border)] hover:border-[var(--gh-text-secondary)] hover:text-foreground"
            }`}
            id={`difficulty-${d}`}
          >
            {d === "easy" ? "😺 Easy (6 pairs)" : d === "medium" ? "😼 Medium (8 pairs)" : "😾 Hard (10 pairs)"}
          </button>
        ))}
      </div>



      {/* Scores bar */}
      <div className="flex justify-center mb-2 animate-fade-in-up delay-200 flex-shrink-0">
        <div className="inline-flex items-center rounded-lg border border-[var(--gh-border)] overflow-hidden bg-[var(--gh-bg-secondary)] text-xs font-mono">
          <div className={`w-[60px] py-2 text-center border-r border-[var(--gh-border)] transition-colors duration-300 ${turn === "human" && phase === "playing" ? "bg-[rgba(88,166,255,0.08)]" : ""}`}>
            <div className="text-muted-foreground text-[10px] mb-0.5 flex items-center justify-center gap-1">
              {turn === "human" && phase === "playing" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--gh-accent-blue)] animate-pulse" />}
              You
            </div>
            <div className="text-base font-bold text-[var(--gh-accent-blue)]">{scores.human}</div>
          </div>
          <div className="w-[40px] py-2 text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[10px] mb-0.5">of</div>
            <div className="text-sm font-bold text-muted-foreground">{totalPairs}</div>
          </div>
          <div className={`w-[60px] py-2 text-center transition-colors duration-300 ${turn === "cat" && phase === "playing" ? "bg-[rgba(63,185,80,0.08)]" : ""}`}>
            <div className="text-muted-foreground text-[10px] mb-0.5 flex items-center justify-center gap-1">
              {turn === "cat" && phase === "playing" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--gh-accent-green)] animate-pulse" />}
              Cat
            </div>
            <div className="text-base font-bold text-[var(--gh-accent-green)]">{scores.cat}</div>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-1 lg:gap-3 min-h-0">
        {/* Cat panel (left) — desktop only */}
        <div className="hidden lg:flex flex-col items-center gap-2 animate-fade-in-up delay-200 order-first lg:order-none" style={{ width: 160, flexShrink: 0 }}>
          <div
            className="rounded-2xl p-3 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]"
            style={{
              boxShadow: catMood === "happy"
                ? "0 0 24px rgba(63, 185, 80, 0.15)"
                : catMood === "sad"
                ? "0 0 24px rgba(248, 81, 73, 0.15)"
                : "0 4px 16px rgba(0,0,0,0.1)",
              animation: turn === "cat" && phase === "playing" ? "memBobble 1s ease-in-out infinite" : undefined,
            }}
          >
            {catMood === "thinking" && <CatThinking />}
            {catMood === "happy" && <CatHappy />}
            {catMood === "sad" && <CatSad />}
            {catMood === "neutral" && <CatNeutral />}
          </div>
          <div
            key={catMessage + gameCount + scores.human + scores.cat}
            className="relative text-center text-xs font-medium text-foreground px-3 py-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] shadow-lg"
            style={{ animation: "memBubbleIn 0.3s ease-out", width: 150, wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            {catMessage}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--gh-border)]" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">Pet Cat</span>
        </div>

        {/* Mobile cat message */}
        <div className="flex lg:hidden items-center justify-center gap-2 text-xs text-muted-foreground font-mono" key={catMessage + "-mobile-" + gameCount}>
          <span className="text-base">{catMood === "happy" ? "😺" : catMood === "sad" ? "😿" : catMood === "thinking" ? "🤔" : "🐱"}</span>
          <span className="inline-block" style={{ animation: "memBubbleIn 0.3s ease-out" }}>{catMessage}</span>
        </div>

        {/* Card grid (center) */}
        <div className="relative animate-fade-in-up delay-300">
          <div
            className="grid mx-auto"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cols === 5 ? 58 : 72}px)`,
              gap: "6px",
            }}
            id="memory-board"
          >
            {cards.map((card, i) => {
              const isFlipped = card.flipped;
              const isMatched = card.matched;
              const isJustMatched = lastMatchedIds.includes(card.id);
              return (
                <div
                  key={`${gameCount}-${card.id}`}
                  style={{
                    width: "100%",
                    aspectRatio: cols === 5 ? "58 / 70" : "72 / 88",
                    perspective: 600,
                  }}
                >
                  <button
                    onClick={() => handleCardClick(i)}
                    disabled={isLocked || isFlipped || isMatched || turn !== "human" || phase !== "playing"}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s ease",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      cursor: isLocked || isFlipped || isMatched || turn !== "human" ? "default" : "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                      outline: "none",
                    }}
                    id={`card-${i}`}
                    aria-label={`Card ${i + 1}${isFlipped ? ` - ${card.emoji}` : ""}`}
                  >
                    {/* Card back */}
                    <div
                      className="rounded-lg border flex items-center justify-center"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        background: "var(--gh-bg-secondary)",
                        borderColor: "var(--gh-border)",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLocked && !isFlipped && !isMatched && turn === "human") {
                          e.currentTarget.style.borderColor = "var(--gh-accent-purple)";
                          e.currentTarget.style.boxShadow = "0 0 12px rgba(188,140,255,0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--gh-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <span className="text-lg text-muted-foreground opacity-30">?</span>
                    </div>

                    {/* Card front */}
                    <div
                      className="rounded-lg border flex items-center justify-center"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: isMatched
                          ? "rgba(63, 185, 80, 0.08)"
                          : "var(--gh-bg-secondary)",
                        borderColor: isMatched ? "var(--gh-accent-green)" : "var(--gh-accent-purple)",
                        boxShadow: isJustMatched
                          ? "0 0 16px rgba(63, 185, 80, 0.4)"
                          : isMatched
                          ? "0 0 8px rgba(63, 185, 80, 0.15)"
                          : "0 0 8px rgba(188, 140, 255, 0.2)",
                      }}
                    >
                      <span
                        className="text-2xl sm:text-3xl select-none"
                        style={{
                          animation: isJustMatched ? "memMatchPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" : undefined,
                        }}
                      >
                        {card.emoji}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Result overlay */}
          {phase === "finished" && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl"
              style={{
                background: "rgba(13, 17, 23, 0.75)",
                backdropFilter: "blur(4px)",
                animation: "memResultIn 0.4s ease-out",
              }}
            >
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{
                    color:
                      scores.human > scores.cat
                        ? "var(--gh-accent-blue)"
                        : scores.cat > scores.human
                        ? "var(--gh-accent-green)"
                        : "var(--gh-accent-orange)",
                    textShadow: `0 0 20px ${
                      scores.human > scores.cat
                        ? "rgba(88,166,255,0.5)"
                        : scores.cat > scores.human
                        ? "rgba(63,185,80,0.5)"
                        : "rgba(210,153,34,0.5)"
                    }`,
                  }}
                >
                  {scores.human > scores.cat
                    ? "You Win!"
                    : scores.cat > scores.human
                    ? "Cat Wins!"
                    : "It's a Draw!"}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {scores.human} – {scores.cat}
                </div>
                <button
                  onClick={() => startGame(difficulty)}
                  className="px-5 py-2 text-sm font-semibold rounded-lg border border-[var(--gh-accent-green)] text-[var(--gh-accent-green)] hover:bg-[var(--gh-accent-green)] hover:text-white transition-all duration-200 hover:shadow-[0_0_16px_rgba(63,185,80,0.3)]"
                  id="play-again-btn"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* You panel (right) — desktop only */}
        <div className="hidden lg:flex flex-col items-center gap-2 animate-fade-in-up delay-200" style={{ width: 160, flexShrink: 0 }}>
          <div className="rounded-2xl p-3 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <svg width={70} height={70} viewBox="0 0 80 80">
              <rect x="8" y="8" width="64" height="64" rx="12" fill="#21262d" stroke="var(--gh-border)" strokeWidth="2" />
              <rect x="14" y="14" width="52" height="52" rx="6" fill="#0d1117" />
              <text x="20" y="38" fontSize="10" fill="#3fb950" fontFamily="monospace" fontWeight="bold">&gt;_</text>
              <text x="20" y="52" fontSize="9" fill="#58a6ff" fontFamily="monospace">you</text>
              <rect x="38" y="30" width="2" height="12" fill="#58a6ff" style={{ animation: "memCursorBlink 1s step-end infinite" }} />
            </svg>
          </div>
          <span className="text-xs text-muted-foreground font-mono">You</span>
        </div>
      </div>

      {/* Turn indicator */}
      {phase === "playing" && (
        <div className="mt-1 text-center text-xs text-muted-foreground animate-fade-in flex-shrink-0">
          {turn === "human" ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-blue)] animate-pulse" />
              Your turn — flip 2 cards
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-green)] animate-pulse" />
              Cat is remembering...
            </span>
          )}
        </div>
      )}

      {/* Overall scoreboard — hidden on mobile */}
      <div className="hidden sm:flex mt-2 justify-center animate-fade-in-up delay-400 flex-shrink-0">
        <div className="inline-flex items-center gap-0 rounded-lg border border-[var(--gh-border)] overflow-hidden bg-[var(--gh-bg-secondary)] text-xs font-mono">
          <div className="w-[60px] py-2 text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[10px] mb-0.5">You</div>
            <div className="text-base font-bold text-[var(--gh-accent-blue)]">{totalScores.human}</div>
          </div>
          <div className="w-[60px] py-2 text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[10px] mb-0.5">Draw</div>
            <div className="text-base font-bold text-[var(--gh-accent-orange)]">{totalScores.draws}</div>
          </div>
          <div className="w-[60px] py-2 text-center">
            <div className="text-muted-foreground text-[10px] mb-0.5">Cat</div>
            <div className="text-base font-bold text-[var(--gh-accent-green)]">{totalScores.cat}</div>
          </div>
        </div>
      </div>





      {/* Animations */}
      <style>{`
        @keyframes memDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes memSparkle {
          0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(15deg); }
        }
        @keyframes memTear {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(4px); opacity: 0.3; }
        }
        @keyframes memBobble {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          75% { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes memBubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes memMatchPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes memResultIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes memCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
