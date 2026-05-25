"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────
type CellValue = "X" | "O" | null;
type Board = CellValue[];
type GameResult = "X" | "O" | "draw" | null;
type Difficulty = "easy" | "medium" | "hard";

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diags
];

// ── Cat SVG Components ───────────────────────────────────────────────────

function CatThinking() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      {/* Body */}
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      {/* Head */}
      <circle cx="40" cy="30" r="20" fill="#374151" />
      {/* Ears */}
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* Eyes — looking up/thinking */}
      <circle cx="32" cy="27" r="5" fill="white" />
      <circle cx="48" cy="27" r="5" fill="white" />
      <circle cx="31" cy="25" r="3" fill="#1a1f2e" />
      <circle cx="47" cy="25" r="3" fill="#1a1f2e" />
      <circle cx="30" cy="24" r="1.2" fill="white" />
      <circle cx="46" cy="24" r="1.2" fill="white" />
      {/* Nose */}
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="24" y1="33" x2="34" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="22" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="56" y1="33" x2="46" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="58" y1="35" x2="47" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      {/* Paws */}
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      {/* Thinking dots */}
      <circle cx="66" cy="18" r="2.5" fill="#8b949e" style={{ animation: "xoxDot 1.5s ease-in-out infinite 0s" }} />
      <circle cx="72" cy="12" r="3.5" fill="#8b949e" style={{ animation: "xoxDot 1.5s ease-in-out infinite 0.3s" }} />
      <circle cx="78" cy="4" r="4.5" fill="#8b949e" style={{ animation: "xoxDot 1.5s ease-in-out infinite 0.6s" }} />
    </svg>
  );
}

function CatHappy() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* Happy squint eyes */}
      <path d="M27,27 Q32,22 37,27" fill="none" stroke="#1a1f2e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M43,27 Q48,22 53,27" fill="none" stroke="#1a1f2e" strokeWidth="2.5" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="25" cy="33" r="4" fill="rgba(253, 164, 175, 0.3)" />
      <circle cx="55" cy="33" r="4" fill="rgba(253, 164, 175, 0.3)" />
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M36,38 Q40,42 44,38" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="33" x2="34" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="22" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="56" y1="33" x2="46" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="58" y1="35" x2="47" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      {/* Sparkles */}
      <text x="8" y="14" fontSize="14" style={{ animation: "xoxSparkle 1s ease-in-out infinite" }}>✨</text>
      <text x="64" y="10" fontSize="12" style={{ animation: "xoxSparkle 1s ease-in-out infinite 0.5s" }}>⭐</text>
    </svg>
  );
}

function CatSad() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* Sad eyes — big watery */}
      <circle cx="32" cy="27" r="6" fill="white" />
      <circle cx="48" cy="27" r="6" fill="white" />
      <circle cx="33" cy="29" r="3.5" fill="#1a1f2e" />
      <circle cx="49" cy="29" r="3.5" fill="#1a1f2e" />
      <circle cx="34" cy="28" r="1.2" fill="white" />
      <circle cx="50" cy="28" r="1.2" fill="white" />
      {/* Tear */}
      <ellipse cx="36" cy="35" rx="1.5" ry="2.5" fill="#58a6ff" style={{ animation: "xoxTear 2s ease-in-out infinite" }} />
      <polygon points="40,35 38,38 42,38" fill="#fda4af" />
      <path d="M37,39 Q40,37 43,39" fill="none" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="24" y1="33" x2="34" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="22" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="56" y1="33" x2="46" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="58" y1="35" x2="47" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
    </svg>
  );
}

function CatNeutral() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
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
      <line x1="24" y1="33" x2="34" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="22" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="56" y1="33" x2="46" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="58" y1="35" x2="47" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
    </svg>
  );
}

// ── Game Logic ───────────────────────────────────────────────────────────

function checkWinner(board: Board): { winner: GameResult; line: number[] | null } {
  for (const combo of WIN_LINES) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as "X" | "O", line: combo };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: "draw", line: null };
  }
  return { winner: null, line: null };
}

// Minimax with alpha-beta pruning
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "draw") return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function getBotMove(board: Board, difficulty: Difficulty): number {
  const available = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  if (available.length === 0) return -1;

  // Easy: random move
  if (difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Medium: 50% random, 50% best
  if (difficulty === "medium" && Math.random() < 0.5) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Hard / Medium-best: minimax
  let bestScore = -Infinity;
  let bestMove = available[0];
  for (const i of available) {
    board[i] = "O";
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

// ── Cat Dialogue ─────────────────────────────────────────────────────────
const CAT_LINES = {
  thinking: ["Hmm...", "Let me think...", "Meow-ment please...", "Calculating...", "Purrfect move incoming..."],
  win: ["Meow haha! 😼", "git push --force! 🐱", "Cat wins! Purr~", "Too easy! 😸", "npm run victory 🏆"],
  lose: ["Nooo! 😿", "I let you win...", "Rematch meow!", "Bug in my code... 🐛", "This is a cat-astrophe!"],
  draw: ["Meh, a tie~ 🐱", "Fair game human.", "We're equal... for now!", "Stalemate! Meow.", "Not bad, human!"],
  playerMove: ["Interesting...", "Oh? That move?", "I see what you did!", "Hmm, noted!", "Clever human..."],
  start: ["Let's play! 🐾", "Ready to lose?", "Your move, human!", "I'm unbeatable! ...maybe", "Meow~ Let's go!"],
};

function randomLine(key: keyof typeof CAT_LINES): string {
  const lines = CAT_LINES[key];
  return lines[Math.floor(Math.random() * lines.length)];
}

// ── Main Component ───────────────────────────────────────────────────────

export default function PlayPage() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState<GameResult>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ player: 0, cat: 0, draws: 0 });
  const [catMessage, setCatMessage] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [botThinking, setBotThinking] = useState(false);
  const [lastPlaced, setLastPlaced] = useState<number | null>(null);
  const [gameCount, setGameCount] = useState(0);
  const boardRef = useRef<Board>(Array(9).fill(null));

  // Hydration-safe init
  useEffect(() => { setCatMessage(randomLine("start")); }, []);

  // Reset game
  const resetGame = useCallback(() => {
    const newBoard: Board = Array(9).fill(null);
    setBoard(newBoard);
    boardRef.current = newBoard;
    setIsPlayerTurn(true);
    setResult(null);
    setWinLine(null);
    setBotThinking(false);
    setLastPlaced(null);
    setCatMessage(randomLine("start"));
    setGameCount((c) => c + 1);
  }, []);

  // Bot plays
  const botPlay = useCallback(
    (currentBoard: Board) => {
      setBotThinking(true);
      setCatMessage(randomLine("thinking"));

      // Artificial delay for "thinking" feel
      const delay = 600 + Math.random() * 800;
      setTimeout(() => {
        const move = getBotMove([...currentBoard], difficulty);
        if (move === -1) return;

        const newBoard = [...currentBoard];
        newBoard[move] = "O";
        setBoard(newBoard);
        boardRef.current = newBoard;
        setLastPlaced(move);
        setBotThinking(false);

        const { winner, line } = checkWinner(newBoard);
        if (winner) {
          setResult(winner);
          setWinLine(line);
          if (winner === "O") {
            setScores((s) => ({ ...s, cat: s.cat + 1 }));
            setCatMessage(randomLine("win"));
          } else if (winner === "draw") {
            setScores((s) => ({ ...s, draws: s.draws + 1 }));
            setCatMessage(randomLine("draw"));
          }
        } else {
          setIsPlayerTurn(true);
          setCatMessage(randomLine("playerMove"));
        }
      }, delay);
    },
    [difficulty]
  );

  // Player clicks cell
  const handleCellClick = useCallback(
    (index: number) => {
      if (!isPlayerTurn || result || board[index] !== null || botThinking) return;

      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      boardRef.current = newBoard;
      setLastPlaced(index);

      const { winner, line } = checkWinner(newBoard);
      if (winner) {
        setResult(winner);
        setWinLine(line);
        if (winner === "X") {
          setScores((s) => ({ ...s, player: s.player + 1 }));
          setCatMessage(randomLine("lose"));
        } else if (winner === "draw") {
          setScores((s) => ({ ...s, draws: s.draws + 1 }));
          setCatMessage(randomLine("draw"));
        }
        return;
      }

      setIsPlayerTurn(false);
      botPlay(newBoard);
    },
    [board, isPlayerTurn, result, botThinking, botPlay]
  );

  // Win line coordinates for the SVG overlay
  const getWinLineCoords = useCallback(() => {
    if (!winLine) return null;
    // Each cell is ~33.33% of the grid
    // Cell centers: col * 33.33 + 16.67, row * 33.33 + 16.67
    const cellCenter = (idx: number) => ({
      x: (idx % 3) * 33.333 + 16.667,
      y: Math.floor(idx / 3) * 33.333 + 16.667,
    });
    const start = cellCenter(winLine[0]);
    const end = cellCenter(winLine[2]);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  }, [winLine]);

  const winCoords = getWinLineCoords();

  // Cat mood based on game state
  const catMood = result === "O" ? "happy" : result === "X" ? "sad" : result === "draw" ? "neutral" : botThinking ? "thinking" : "neutral";

  return (
    <div className="h-full overflow-hidden flex flex-col px-4 sm:px-6 py-2">
      {/* Title area — hidden on mobile */}
      <div className="hidden sm:block text-center mb-2 animate-fade-in-up flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground mb-0.5 flex items-center justify-center gap-2">
          <span>🎮</span>
          Tic-Tac-Toe
          <span>🐱</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          You (X) vs Pet Cat (O) — can you outsmart the cat?
        </p>
      </div>

      {/* Difficulty selector */}
      <div className="flex justify-center gap-2 mb-2 animate-fade-in-up delay-100 flex-shrink-0">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d);
              resetGame();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-200 ${
              difficulty === d
                ? "bg-[var(--gh-accent-blue)] text-white border-[var(--gh-accent-blue)] shadow-[0_0_12px_rgba(88,166,255,0.3)]"
                : "bg-[var(--gh-btn-bg)] text-muted-foreground border-[var(--gh-border)] hover:border-[var(--gh-text-secondary)] hover:text-foreground"
            }`}
            id={`difficulty-${d}`}
          >
            {d === "easy" ? "😺 Easy" : d === "medium" ? "😼 Medium" : "😾 Hard"}
          </button>
        ))}
      </div>



      {/* Main game area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-1 lg:gap-3 min-h-0">

        {/* Cat panel — desktop only */}
        <div className="hidden lg:flex flex-col items-center gap-3 animate-fade-in-up delay-200 order-first lg:order-none" style={{ width: 160, flexShrink: 0 }}>
          <div
            className="relative rounded-2xl p-4 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]"
            style={{
              boxShadow: catMood === "happy"
                ? "0 0 24px rgba(63, 185, 80, 0.15), 0 0 48px rgba(63, 185, 80, 0.05)"
                : catMood === "sad"
                ? "0 0 24px rgba(248, 81, 73, 0.15)"
                : "0 4px 16px rgba(0,0,0,0.1)",
              animation: botThinking ? "xoxBobble 1s ease-in-out infinite" : undefined,
            }}
          >
            {catMood === "thinking" && <CatThinking />}
            {catMood === "happy" && <CatHappy />}
            {catMood === "sad" && <CatSad />}
            {catMood === "neutral" && <CatNeutral />}
          </div>
          {/* Speech bubble */}
          <div
            key={catMessage + gameCount}
            className="relative text-center text-xs font-medium text-foreground px-3 py-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] shadow-lg"
            style={{ animation: "xoxBubbleIn 0.3s ease-out", width: 150, wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            {catMessage}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--gh-border)]" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">Pet Cat (O)</span>
        </div>

        {/* Mobile cat message */}
        <div className="flex lg:hidden items-center justify-center gap-2 text-xs text-muted-foreground font-mono" key={catMessage + "-mobile"}>
          <span className="text-base">{catMood === "happy" ? "😺" : catMood === "sad" ? "😿" : catMood === "thinking" ? "🤔" : "🐱"}</span>
          <span className="inline-block" style={{ animation: "xoxBubbleIn 0.3s ease-out" }}>{catMessage}</span>
        </div>

        {/* Game board */}
        <div className="relative animate-fade-in-up delay-300">
          <div
            className="grid grid-cols-3 gap-[3px] rounded-xl overflow-hidden border-2 p-[3px]"
            style={{
              borderColor: result === "X" ? "var(--gh-accent-blue)" : result === "O" ? "var(--gh-accent-green)" : result === "draw" ? "var(--gh-accent-orange)" : "var(--gh-border)",
              background: "var(--gh-border)",
              transition: "border-color 0.4s ease",
              boxShadow: result ? "0 0 30px rgba(88, 166, 255, 0.1)" : "0 4px 24px rgba(0,0,0,0.15)",
            }}
            id="xox-board"
          >
            {board.map((cell, i) => {
              const isWinCell = winLine?.includes(i);
              const isLast = lastPlaced === i;
              return (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={!!result || cell !== null || !isPlayerTurn || botThinking}
                  className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] lg:w-[130px] lg:h-[130px] flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isWinCell
                      ? result === "X"
                        ? "rgba(88, 166, 255, 0.12)"
                        : "rgba(63, 185, 80, 0.12)"
                      : "var(--gh-bg-secondary)",
                    cursor: result || cell || !isPlayerTurn || botThinking ? "default" : "pointer",
                  }}
                  id={`cell-${i}`}
                  aria-label={`Cell ${i + 1}`}
                >
                  {/* Hover hint */}
                  {!cell && !result && isPlayerTurn && !botThinking && (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-[var(--gh-accent-blue)] opacity-0 hover:opacity-20 transition-opacity duration-150 select-none">
                      X
                    </span>
                  )}
                  {/* Cell content */}
                  {cell && (
                    <span
                      className={`text-4xl sm:text-5xl font-bold select-none ${
                        cell === "X" ? "text-[var(--gh-accent-blue)]" : "text-[var(--gh-accent-green)]"
                      }`}
                      style={{
                        animation: isLast ? "xoxPlacePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" : undefined,
                        textShadow: isWinCell
                          ? cell === "X"
                            ? "0 0 16px rgba(88, 166, 255, 0.5)"
                            : "0 0 16px rgba(63, 185, 80, 0.5)"
                          : "none",
                      }}
                    >
                      {cell}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Win line SVG overlay */}
          {winCoords && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1={winCoords.x1}
                y1={winCoords.y1}
                x2={winCoords.x2}
                y2={winCoords.y2}
                stroke={result === "X" ? "var(--gh-accent-blue)" : "var(--gh-accent-green)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  animation: "xoxLineDrawIn 0.5s ease-out forwards",
                  strokeDasharray: "150",
                  strokeDashoffset: "150",
                  filter: `drop-shadow(0 0 8px ${result === "X" ? "rgba(88,166,255,0.6)" : "rgba(63,185,80,0.6)"})`,
                }}
              />
            </svg>
          )}

          {/* Result overlay */}
          {result && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl"
              style={{
                background: "rgba(13, 17, 23, 0.7)",
                backdropFilter: "blur(4px)",
                animation: "xoxResultIn 0.4s ease-out",
              }}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2" style={{
                  color: result === "X" ? "var(--gh-accent-blue)" : result === "O" ? "var(--gh-accent-green)" : "var(--gh-accent-orange)",
                  textShadow: `0 0 20px ${result === "X" ? "rgba(88,166,255,0.5)" : result === "O" ? "rgba(63,185,80,0.5)" : "rgba(210,153,34,0.5)"}`,
                }}>
                  {result === "X" ? "You Win!" : result === "O" ? "Cat Wins!" : "It's a Draw!"}
                </div>
                <button
                  onClick={resetGame}
                  className="mt-3 px-5 py-2 text-sm font-semibold rounded-lg border border-[var(--gh-accent-green)] text-[var(--gh-accent-green)] hover:bg-[var(--gh-accent-green)] hover:text-white transition-all duration-200 hover:shadow-[0_0_16px_rgba(63,185,80,0.3)]"
                  id="play-again-btn"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Player panel — desktop only */}
        <div className="hidden lg:flex flex-col items-center gap-3 animate-fade-in-up delay-200" style={{ width: 160, flexShrink: 0 }}>
          <div className="rounded-2xl p-4 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <svg width={80} height={80} viewBox="0 0 80 80">
              {/* User avatar — code terminal style */}
              <rect x="8" y="8" width="64" height="64" rx="12" fill="#21262d" stroke="var(--gh-border)" strokeWidth="2" />
              <rect x="14" y="14" width="52" height="52" rx="6" fill="#0d1117" />
              {/* Terminal prompt */}
              <text x="20" y="38" fontSize="10" fill="#3fb950" fontFamily="monospace" fontWeight="bold">&gt;_</text>
              <text x="20" y="52" fontSize="9" fill="#58a6ff" fontFamily="monospace">you</text>
              {/* Blinking cursor */}
              <rect x="38" y="30" width="2" height="12" fill="#58a6ff" style={{ animation: "xoxCursorBlink 1s step-end infinite" }} />
            </svg>
          </div>
          <span className="text-xs text-muted-foreground font-mono">You (X)</span>
        </div>
      </div>

      {/* Scoreboard — hidden on mobile */}
      <div className="hidden sm:flex mt-2 justify-center animate-fade-in-up delay-400 flex-shrink-0">
        <div className="inline-flex items-center gap-0 rounded-lg border border-[var(--gh-border)] overflow-hidden bg-[var(--gh-bg-secondary)] text-xs font-mono">
          <div className="w-[60px] py-2 text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[10px] mb-0.5">You</div>
            <div className="text-base font-bold text-[var(--gh-accent-blue)]">{scores.player}</div>
          </div>
          <div className="w-[60px] py-2 text-center border-r border-[var(--gh-border)]">
            <div className="text-muted-foreground text-[10px] mb-0.5">Draw</div>
            <div className="text-base font-bold text-[var(--gh-accent-orange)]">{scores.draws}</div>
          </div>
          <div className="w-[60px] py-2 text-center">
            <div className="text-muted-foreground text-[10px] mb-0.5">Cat</div>
            <div className="text-base font-bold text-[var(--gh-accent-green)]">{scores.cat}</div>
          </div>
        </div>
      </div>

      {/* Turn indicator */}
      {!result && (
        <div className="mt-1 text-center text-xs text-muted-foreground animate-fade-in flex-shrink-0">
          {isPlayerTurn && !botThinking ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-blue)] animate-pulse" />
              Your turn — tap a cell
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--gh-accent-green)] animate-pulse" />
              Cat is thinking...
            </span>
          )}
        </div>
      )}



      {/* Keyframe animations */}
      <style>{`
        @keyframes xoxDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes xoxSparkle {
          0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(15deg); }
        }
        @keyframes xoxTear {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(4px); opacity: 0.3; }
        }
        @keyframes xoxBobble {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          75% { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes xoxBubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes xoxPlacePop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes xoxLineDrawIn {
          to { stroke-dashoffset: 0; }
        }
        @keyframes xoxResultIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes xoxCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
