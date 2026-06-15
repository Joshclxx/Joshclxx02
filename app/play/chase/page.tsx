"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────
type Bug = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  points: number;
  spawnTime: number;
  lifetime: number;
  caught: boolean;
};
type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "idle" | "playing" | "finished";

const BUG_TYPES = [
  { emoji: "🐛", points: 10, speed: 0.6, size: 36, lifetime: 4000 },
  { emoji: "🪲", points: 15, speed: 0.9, size: 32, lifetime: 3500 },
  { emoji: "🦗", points: 20, speed: 1.3, size: 30, lifetime: 3000 },
  { emoji: "🕷️", points: 25, speed: 1.6, size: 28, lifetime: 2500 },
  { emoji: "🦟", points: 30, speed: 2.0, size: 26, lifetime: 2000 },
  { emoji: "🐝", points: 50, speed: 2.5, size: 24, lifetime: 1500 },
];

const DIFFICULTY_CONFIG: Record<Difficulty, {
  spawnInterval: number;
  speedMult: number;
  lifetimeMult: number;
  gameDuration: number;
  maxBugs: number;
}> = {
  easy:   { spawnInterval: 1200, speedMult: 0.6, lifetimeMult: 1.4, gameDuration: 30, maxBugs: 5 },
  medium: { spawnInterval: 900,  speedMult: 1.0, lifetimeMult: 1.0, gameDuration: 30, maxBugs: 7 },
  hard:   { spawnInterval: 600,  speedMult: 1.5, lifetimeMult: 0.7, gameDuration: 30, maxBugs: 10 },
};

// ── Cat SVGs ─────────────────────────────────────────────────────────────
function CatChasing() {
  return (
    <svg width={48} height={48} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* Focused eyes */}
      <circle cx="32" cy="27" r="6" fill="white" />
      <circle cx="48" cy="27" r="6" fill="white" />
      <circle cx="34" cy="27" r="4" fill="#1a1f2e" />
      <circle cx="50" cy="27" r="4" fill="#1a1f2e" />
      <circle cx="35" cy="26" r="1.5" fill="white" />
      <circle cx="51" cy="26" r="1.5" fill="white" />
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
    </svg>
  );
}

function CatHappy() {
  return (
    <svg width={48} height={48} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
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
      <text x="8" y="14" fontSize="14" style={{ animation: "chaseSparkle 1s ease-in-out infinite" }}>✨</text>
      <text x="64" y="10" fontSize="12" style={{ animation: "chaseSparkle 1s ease-in-out infinite 0.5s" }}>⭐</text>
    </svg>
  );
}

function CatSad() {
  return (
    <svg width={48} height={48} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
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
      <ellipse cx="36" cy="35" rx="1.5" ry="2.5" fill="#58a6ff" style={{ animation: "chaseTear 2s ease-in-out infinite" }} />
      <polygon points="40,35 38,38 42,38" fill="#fda4af" />
      <path d="M37,39 Q40,37 43,39" fill="none" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
    </svg>
  );
}

function CatNeutral() {
  return (
    <svg width={48} height={48} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
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
  idle: ["Click Start! 🐾", "Bugs incoming!", "Ready to pounce?", "I smell bugs! 🐛"],
  playing: ["Get 'em! 🐾", "Pounce! Pounce!", "Don't let them escape!", "More bugs! 🪲", "So many bugs!", "Quick! Over there!"],
  caught: ["Nice catch! 😸", "Got one! ✨", "Meow-gnificent!", "Squish! 🎯", "Purrfect aim!", "Yummy! 🐛"],
  missed: ["It escaped! 😿", "Too slow!", "Aww, missed it!", "They're fast! 💨"],
  endGood: ["Purrfect score! 🏆", "Bug-free zone! ✨", "We make a great team!", "Meow-velous! 😸"],
  endMid: ["Not bad, human!", "We got some~ 🐱", "Almost there!", "More practice! 📝"],
  endBad: ["They got away! 😿", "The bugs won...", "Let's try again!", "My reflexes need work..."],
};

function randomLine(key: keyof typeof CAT_LINES): string {
  const lines = CAT_LINES[key];
  return lines[Math.floor(Math.random() * lines.length)];
}

// ── Splat animation component ────────────────────────────────────────────
function Splat({ x, y, points }: { x: number; y: number; points: number }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: x - 20,
        top: y - 20,
        animation: "chaseSplatPop 0.5s ease-out forwards",
        zIndex: 30,
      }}
    >
      <div className="text-2xl" style={{ animation: "chaseSplatSpin 0.4s ease-out" }}>💥</div>
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
        style={{
          color: "var(--gh-accent-green)",
          animation: "chasePointsFloat 0.8s ease-out forwards",
          textShadow: "0 0 8px rgba(63,185,80,0.5)",
        }}
      >
        +{points}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export default function CatChasePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [caught, setCaught] = useState(0);
  const [escaped, setEscaped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [catMessage, setCatMessage] = useState("");
  const [catMood, setCatMood] = useState<"neutral" | "chasing" | "happy" | "sad">("neutral");
  const [splats, setSplats] = useState<{ id: number; x: number; y: number; points: number }[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [catPos, setCatPos] = useState({ x: 50, y: 50 });

  const fieldRef = useRef<HTMLDivElement>(null);
  const bugsRef = useRef<Bug[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const bestComboRef = useRef(0);
  const caughtRef = useRef(0);
  const escapedRef = useRef(0);
  const nextIdRef = useRef(0);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const gameTimerRef = useRef<ReturnType<typeof setInterval>>();
  const animFrameRef = useRef(0);
  const splatIdRef = useRef(0);
  const phaseRef = useRef<GamePhase>("idle");
  const catPosRef = useRef({ x: 50, y: 50 });
  const difficultyRef = useRef<Difficulty>("medium");
  const highScoreRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { setCatMessage(randomLine("idle")); }, []);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { highScoreRef.current = highScore; }, [highScore]);

  // ── Spawn a bug (reads from refs only) ────────────────────────────────
  const spawnBug = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const config = DIFFICULTY_CONFIG[difficultyRef.current];
    const bugType = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];

    if (bugsRef.current.filter((b) => !b.caught).length >= config.maxBugs) {
      spawnTimerRef.current = setTimeout(spawnBug, config.spawnInterval * 0.5);
      return;
    }

    const edge = Math.floor(Math.random() * 4);
    let x: number, y: number;
    if (edge === 0) { x = Math.random() * 80 + 10; y = 5; }
    else if (edge === 1) { x = Math.random() * 80 + 10; y = 92; }
    else if (edge === 2) { x = 5; y = Math.random() * 70 + 15; }
    else { x = 92; y = Math.random() * 70 + 15; }

    // Aim toward center with some randomness
    const cx = 50 + (Math.random() - 0.5) * 40;
    const cy = 50 + (Math.random() - 0.5) * 30;
    const angle = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * 1.0;
    const speed = bugType.speed * config.speedMult;

    const bug: Bug = {
      id: nextIdRef.current++,
      emoji: bugType.emoji,
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      size: bugType.size,
      points: bugType.points,
      spawnTime: Date.now(),
      lifetime: bugType.lifetime * config.lifetimeMult,
      caught: false,
    };

    bugsRef.current = [...bugsRef.current, bug];
    setBugs([...bugsRef.current]);

    spawnTimerRef.current = setTimeout(spawnBug, config.spawnInterval + Math.random() * 400);
  }, []);

  // ── Animation loop (reads from refs only — zero deps) ─────────────────
  const animLoop = useCallback(() => {
    if (phaseRef.current !== "playing") return;

    const now = Date.now();
    let anyEscaped = false;

    bugsRef.current = bugsRef.current
      .map((bug) => {
        if (bug.caught) return bug;

        // Check expired
        if (now - bug.spawnTime > bug.lifetime) {
          anyEscaped = true;
          escapedRef.current++;
          setEscaped(escapedRef.current);
          comboRef.current = 0;
          setCombo(0);
          return { ...bug, caught: true };
        }

        // Move
        let nx = bug.x + bug.dx;
        let ny = bug.y + bug.dy;
        let ndx = bug.dx;
        let ndy = bug.dy;

        // Bounce off walls
        if (nx < 3 || nx > 97) { ndx = -ndx; nx = Math.max(3, Math.min(97, nx)); }
        if (ny < 3 || ny > 97) { ndy = -ndy; ny = Math.max(3, Math.min(97, ny)); }

        // Slight random direction change for organic movement
        if (Math.random() < 0.03) {
          const twist = (Math.random() - 0.5) * 0.6;
          ndx += twist;
          ndy += (Math.random() - 0.5) * 0.6;
          // Clamp speed
          const spd = Math.hypot(ndx, ndy);
          const maxSpd = 3;
          if (spd > maxSpd) { ndx = (ndx / spd) * maxSpd; ndy = (ndy / spd) * maxSpd; }
        }

        return { ...bug, x: nx, y: ny, dx: ndx, dy: ndy };
      })
      .filter((bug) => {
        if (bug.caught && now - bug.spawnTime > bug.lifetime + 500) return false;
        return true;
      });

    if (anyEscaped) {
      setCatMessage(randomLine("missed"));
      setCatMood("sad");
    }

    setBugs([...bugsRef.current]);

    // Move cat toward nearest uncaught bug (using ref)
    const alive = bugsRef.current.filter((b) => !b.caught);
    if (alive.length > 0) {
      const cp = catPosRef.current;
      const nearest = alive.reduce((a, b) => {
        const da = Math.hypot(a.x - cp.x, a.y - cp.y);
        const db = Math.hypot(b.x - cp.x, b.y - cp.y);
        return da < db ? a : b;
      });
      const newCp = {
        x: cp.x + (nearest.x - cp.x) * 0.04,
        y: cp.y + (nearest.y - cp.y) * 0.04,
      };
      catPosRef.current = newCp;
      setCatPos(newCp);
    }

    animFrameRef.current = requestAnimationFrame(animLoop);
  }, []);

  // ── Click handler ────────────────────────────────────────────────────
  const handleBugClick = useCallback((bugId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const bug = bugsRef.current.find((b) => b.id === bugId);
    if (!bug || bug.caught) return;

    // Mark caught
    bugsRef.current = bugsRef.current.map((b) =>
      b.id === bugId ? { ...b, caught: true } : b
    );
    setBugs([...bugsRef.current]);

    // Score
    comboRef.current++;
    setCombo(comboRef.current);
    if (comboRef.current > bestComboRef.current) {
      bestComboRef.current = comboRef.current;
      setBestCombo(comboRef.current);
    }

    const comboMult = Math.min(comboRef.current, 5);
    const pts = bug.points * comboMult;
    scoreRef.current += pts;
    setScore(scoreRef.current);
    caughtRef.current++;
    setCaught(caughtRef.current);

    // Splat effect
    if (fieldRef.current) {
      const rect = fieldRef.current.getBoundingClientRect();
      const sx = (bug.x / 100) * rect.width;
      const sy = (bug.y / 100) * rect.height;
      const splatId = splatIdRef.current++;
      setSplats((prev) => [...prev, { id: splatId, x: sx, y: sy, points: pts }]);
      setTimeout(() => {
        setSplats((prev) => prev.filter((s) => s.id !== splatId));
      }, 900);
    }

    // Cat reacts
    if (comboRef.current >= 3) {
      setCatMessage(`${comboRef.current}x Combo! 🔥`);
    } else {
      setCatMessage(randomLine("caught"));
    }
    setCatMood("happy");

    // Move cat to catch position
    catPosRef.current = { x: bug.x, y: bug.y };
    setCatPos({ x: bug.x, y: bug.y });
  }, []);

  // ── Start game ──────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficultyRef.current];

    // Cancel any existing loops
    clearInterval(gameTimerRef.current);
    clearTimeout(spawnTimerRef.current);
    cancelAnimationFrame(animFrameRef.current);

    // Reset refs
    bugsRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 0;
    bestComboRef.current = 0;
    caughtRef.current = 0;
    escapedRef.current = 0;
    nextIdRef.current = 0;
    catPosRef.current = { x: 50, y: 50 };

    // Reset state
    setBugs([]);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setCaught(0);
    setEscaped(0);
    setTimeLeft(config.gameDuration);
    setSplats([]);
    setCatPos({ x: 50, y: 50 });
    setCatMessage("Go go go! 🐾");
    setCatMood("chasing");

    phaseRef.current = "playing";
    setPhase("playing");

    // Start spawning
    spawnTimerRef.current = setTimeout(spawnBug, 500);

    // Start animation loop
    animFrameRef.current = requestAnimationFrame(animLoop);

    // Game timer
    let remaining = config.gameDuration;
    gameTimerRef.current = setInterval(() => {
      remaining--;
      setTimeLeft(remaining);

      if (remaining % 10 === 0 && remaining > 0) {
        setCatMessage(randomLine("playing"));
        setCatMood("chasing");
      }

      if (remaining <= 0) {
        clearInterval(gameTimerRef.current);
        clearTimeout(spawnTimerRef.current);
        cancelAnimationFrame(animFrameRef.current);
        phaseRef.current = "finished";
        setPhase("finished");

        const finalScore = scoreRef.current;
        const finalCaught = caughtRef.current;
        const finalEscaped = escapedRef.current;
        const total = finalCaught + finalEscaped;
        const ratio = total > 0 ? finalCaught / total : 0;

        if (ratio >= 0.8) { setCatMessage(randomLine("endGood")); setCatMood("happy"); }
        else if (ratio >= 0.5) { setCatMessage(randomLine("endMid")); setCatMood("neutral"); }
        else { setCatMessage(randomLine("endBad")); setCatMood("sad"); }

        if (finalScore > highScoreRef.current) setHighScore(finalScore);
      }
    }, 1000);
  }, [spawnBug, animLoop]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(gameTimerRef.current);
      clearTimeout(spawnTimerRef.current);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ── Timer bar color ──────────────────────────────────────────────────
  const config = DIFFICULTY_CONFIG[difficulty];
  const timerPct = (timeLeft / config.gameDuration) * 100;
  const timerColor = timeLeft <= 5 ? "var(--gh-accent-red)" : timeLeft <= 10 ? "var(--gh-accent-orange)" : "var(--gh-accent-green)";

  return (
    <div className="flex flex-col px-2 sm:px-6 py-2 sm:py-4 pb-6">
      {/* Title — hidden on mobile */}
      <div className="hidden sm:block text-center mb-1 sm:mb-2 animate-fade-in-up">
        <h1 className="text-lg font-bold text-foreground mb-0.5 flex items-center justify-center gap-2">
          <span>🐾</span>
          Cat Chase
          <span>🐛</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Tap the bugs before they escape! Consecutive catches build combos for bonus points.
        </p>
      </div>

      {/* Difficulty */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 animate-fade-in-up delay-100">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              if (phase !== "playing") {
                setDifficulty(d);
                setPhase("idle");
                setCatMessage(randomLine("idle"));
              }
            }}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md border transition-all duration-200 ${
              difficulty === d
                ? "bg-[var(--gh-accent-green)] text-white border-[var(--gh-accent-green)] shadow-[0_0_12px_rgba(63,185,80,0.3)]"
                : "bg-[var(--gh-btn-bg)] text-muted-foreground border-[var(--gh-border)] hover:border-[var(--gh-text-secondary)] hover:text-foreground"
            }`}
            disabled={phase === "playing"}
            id={`difficulty-${d}`}
          >
            {d === "easy" ? "😺 Easy" : d === "medium" ? "😼 Medium" : "😾 Hard"}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex justify-center mb-1 sm:mb-2 animate-fade-in-up delay-200">
        <div className="inline-flex items-center rounded-lg border border-[var(--gh-border)] overflow-hidden bg-[var(--gh-bg-secondary)] text-xs font-mono">
          <div className="chase-stat-cell text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[9px] sm:text-[10px]">Score</div>
            <div className="text-sm sm:text-base font-bold text-[var(--gh-accent-green)]">{score}</div>
          </div>
          <div className="chase-stat-cell text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[9px] sm:text-[10px]">Combo</div>
            <div className="text-sm sm:text-base font-bold" style={{ color: combo >= 3 ? "var(--gh-accent-orange)" : "var(--foreground)" }}>
              {combo > 0 ? `${combo}x` : "-"}
            </div>
          </div>
          <div className="chase-stat-cell text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[9px] sm:text-[10px]">Caught</div>
            <div className="text-sm sm:text-base font-bold text-[var(--gh-accent-blue)]">{caught}</div>
          </div>
          <div className="chase-stat-cell text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[9px] sm:text-[10px]">Escaped</div>
            <div className="text-sm sm:text-base font-bold text-[var(--gh-accent-red)]">{escaped}</div>
          </div>
          <div className="chase-stat-cell text-center">
            <div className="text-muted-foreground text-[9px] sm:text-[10px]">Time</div>
            <div className="text-sm sm:text-base font-bold" style={{ color: timerColor }}>{timeLeft}s</div>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      {phase === "playing" && (
        <div className="max-w-lg mx-auto w-full mb-1 sm:mb-2 h-1 sm:h-1.5 rounded-full bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPct}%`,
              background: timerColor,
              boxShadow: `0 0 8px ${timerColor}`,
            }}
          />
        </div>
      )}

      {/* Mobile cat message */}
      <div className="flex xl:hidden items-center justify-center gap-2 text-xs text-muted-foreground font-mono mb-1" key={catMessage + "-mobile"}>
        <span className="text-base">{catMood === "happy" ? "😺" : catMood === "sad" ? "😿" : catMood === "chasing" ? "🐾" : "🐱"}</span>
        <span className="inline-block" style={{ animation: "chaseBubbleIn 0.3s ease-out" }}>{catMessage}</span>
      </div>

      {/* Game area — Cat (left) | Field (center) | You (right) */}
      <div className="relative flex items-center justify-center">

        {/* Cat panel (left) — xl only */}
        <div className="hidden xl:flex flex-col items-center gap-2 animate-fade-in-up delay-200 absolute right-full mr-4 top-0" style={{ width: 150 }}>
          <div
            className="rounded-2xl p-2 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              animation: phase === "playing" ? "chaseCatBob 0.8s ease-in-out infinite" : undefined,
            }}
          >
            {catMood === "happy" ? <CatHappy /> : catMood === "sad" ? <CatSad /> : catMood === "chasing" ? <CatChasing /> : <CatNeutral />}
          </div>
          <div
            key={catMessage}
            className="relative text-center text-xs font-medium text-foreground px-3 py-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] shadow-lg"
            style={{ animation: "chaseBubbleIn 0.3s ease-out", width: 140, wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            {catMessage}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--gh-border)]" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">Pet Cat</span>
        </div>

        {/* Game field (center) */}
        <div className="flex flex-col items-center gap-2 w-full flex-1" style={{ maxWidth: 720 }}>
          <div
            ref={fieldRef}
            className="relative rounded-xl border-2 overflow-hidden select-none chase-field"
            style={{
              background: "var(--gh-bg-secondary)",
              borderColor: phase === "playing" ? "var(--gh-accent-green)" : "var(--gh-border)",
              transition: "border-color 0.3s",
              cursor: phase === "playing" ? "crosshair" : "default",
            }}
            id="chase-field"
          >
          {/* Grid pattern background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, var(--gh-text-secondary) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Cat follower */}
          {phase === "playing" && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${catPos.x}%`,
                top: `${catPos.y}%`,
                transform: "translate(-50%, -50%)",
                transition: "left 0.15s ease-out, top 0.15s ease-out",
                zIndex: 5,
                opacity: 0.6,
              }}
            >
              <CatChasing />
            </div>
          )}

          {/* Bugs */}
          {bugs.filter((b) => !b.caught).map((bug) => {
            const age = Date.now() - bug.spawnTime;
            const lifeRatio = age / bug.lifetime;
            const isFlashing = lifeRatio > 0.7;
            return (
              <button
                key={bug.id}
                onClick={(e) => handleBugClick(bug.id, e)}
                className="absolute"
                style={{
                  left: `${bug.x}%`,
                  top: `${bug.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: Math.max(bug.size + 12, 48),
                  height: Math.max(bug.size + 12, 48),
                  fontSize: bug.size,
                  lineHeight: 1,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  zIndex: 10,
                  animation: isFlashing ? "chaseBugFlash 0.3s ease-in-out infinite" : "chaseBugBob 1.5s ease-in-out infinite",
                  transition: "left 0.05s linear, top 0.05s linear",
                  filter: `drop-shadow(0 0 4px rgba(63,185,80,0.3))`,
                }}
                aria-label={`Catch bug ${bug.emoji}`}
              >
                {bug.emoji}
              </button>
            );
          })}

          {/* Splat effects */}
          {splats.map((s) => (
            <Splat key={s.id} x={s.x} y={s.y} points={s.points} />
          ))}

          {/* Idle overlay — inside the board */}
          {phase === "idle" && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: "rgba(13, 17, 23, 0.7)",
                backdropFilter: "blur(4px)",
                zIndex: 20,
              }}
            >
              <div className="text-center px-4">
                <div className="text-4xl mb-3">🐾</div>
                <div className="text-lg font-bold text-foreground mb-2">Ready to Chase?</div>
                <p className="text-xs text-muted-foreground mb-4 max-w-[260px]">
                  Tap bugs before they escape! Build combos for multiplied points.
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-[var(--gh-accent-green)] text-white hover:shadow-[0_0_20px_rgba(63,185,80,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
                  id="start-btn"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {/* Finished overlay — full screen centered card */}
          {phase === "finished" && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              style={{
                background: "rgba(13, 17, 23, 0.85)",
                backdropFilter: "blur(12px)",
                animation: "chaseResultIn 0.35s ease-out",
              }}
            >
              <div
                className="w-full max-w-sm rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 text-center"
                style={{
                  boxShadow: "0 0 60px rgba(63,185,80,0.12), 0 24px 48px rgba(0,0,0,0.4)",
                  animation: "chaseBubbleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {/* Result emoji */}
                <div className="text-5xl mb-3" style={{ animation: "chaseSplatPop 0.5s ease-out forwards" }}>
                  {caught > escaped ? "🏆" : caught === escaped ? "🤝" : "😿"}
                </div>

                {/* Score */}
                <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--gh-accent-green)" }}>
                  {score} pts
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-1">
                  <span><span className="text-[var(--gh-accent-blue)] font-bold">{caught}</span> caught</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span><span className="text-[var(--gh-accent-red)] font-bold">{escaped}</span> escaped</span>
                </div>

                {bestCombo > 1 && (
                  <div className="text-xs text-[var(--gh-accent-orange)] mb-1">
                    Best combo: {bestCombo}x 🔥
                  </div>
                )}
                {score >= highScore && score > 0 && (
                  <div className="text-xs text-[var(--gh-accent-purple)] mb-4" style={{ animation: "chaseSparkle 1s ease-in-out infinite" }}>
                    🏆 New High Score!
                  </div>
                )}
                {highScore > 0 && !(score >= highScore && score > 0) && (
                  <div className="text-xs text-muted-foreground mb-4">
                    High Score: {highScore}
                  </div>
                )}
                {!(highScore > 0) && !(score >= highScore && score > 0) && <div className="mb-4" />}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={startGame}
                    className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-[var(--gh-accent-green)] text-white hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_20px_rgba(63,185,80,0.35)] active:scale-[0.97]"
                    id="play-again-btn"
                  >
                    Play Again
                  </button>
                  <a
                    href="/play"
                    className="flex-1 flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl border border-[var(--gh-border)] text-muted-foreground hover:text-foreground hover:border-[var(--gh-text-secondary)] hover:bg-[var(--gh-btn-bg)] transition-all duration-200"
                  >
                    Arcade
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* You panel (right) — xl only */}
        <div className="hidden xl:flex flex-col items-center gap-2 animate-fade-in-up delay-200 absolute left-full ml-4 top-0" style={{ width: 150 }}>
          <div className="rounded-2xl p-3 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <svg width={70} height={70} viewBox="0 0 80 80">
              <rect x="8" y="8" width="64" height="64" rx="12" fill="#21262d" stroke="var(--gh-border)" strokeWidth="2" />
              <rect x="14" y="14" width="52" height="52" rx="6" fill="#0d1117" />
              <text x="20" y="38" fontSize="10" fill="#3fb950" fontFamily="monospace" fontWeight="bold">&gt;_</text>
              <text x="20" y="52" fontSize="9" fill="#58a6ff" fontFamily="monospace">you</text>
              <rect x="38" y="30" width="2" height="12" fill="#58a6ff" style={{ animation: "chaseCursorBlink 1s step-end infinite" }} />
            </svg>
          </div>
          <span className="text-xs text-muted-foreground font-mono">You</span>
        </div>
      </div>

      {/* High score */}
      {highScore > 0 && (
        <div className="mt-1 text-center text-xs text-muted-foreground font-mono animate-fade-in">
          🏆 High Score: <span className="text-[var(--gh-accent-green)] font-bold">{highScore}</span>
        </div>
      )}

      {/* Animations + responsive field sizing */}
      <style>{`
        /* Responsive stats cells */
        .chase-stat-cell {
          width: clamp(44px, 14vw, 64px);
          padding: 6px 0;
        }

        /* Game field — natural size with responsive width */
        .chase-field {
          width: 100%;
          aspect-ratio: 4 / 3;
          max-width: 480px;
        }
        @media (min-width: 640px) {
          .chase-field {
            max-width: 560px;
          }
        }
        @media (min-width: 1024px) {
          .chase-field {
            max-width: 680px;
          }
        }
        @media (min-width: 1280px) {
          .chase-field {
            max-width: 720px;
          }
        }

        @keyframes chaseBugBob {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes chaseBugFlash {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.85); }
        }
        @keyframes chaseSplatPop {
          0% { transform: scale(0.3); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes chaseSplatSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(180deg); }
        }
        @keyframes chasePointsFloat {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-30px); opacity: 0; }
        }
        @keyframes chaseCatBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes chaseBubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chaseResultIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes chaseCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes chaseSparkle {
          0%, 100% { opacity: 0.6; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes chaseTear {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(3px); opacity: 1; }
        }
        @keyframes memSparkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
