"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";
type CellValue = number | null; // 1-9 or null
type Grid = CellValue[][];
type Notes = Set<number>[][];

interface CellPosition {
  row: number;
  col: number;
}

// ── Cat SVG Components ───────────────────────────────────────────────────

function CatWatching() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* Focused eyes — looking down at the board */}
      <circle cx="32" cy="27" r="5" fill="white" />
      <circle cx="48" cy="27" r="5" fill="white" />
      <circle cx="33" cy="29" r="3" fill="#1a1f2e" />
      <circle cx="49" cy="29" r="3" fill="#1a1f2e" />
      <circle cx="34" cy="28" r="1.2" fill="white" />
      <circle cx="50" cy="28" r="1.2" fill="white" />
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <line x1="24" y1="33" x2="34" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="22" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="56" y1="33" x2="46" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="58" y1="35" x2="47" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      {/* Tail swishing */}
      <path d="M62,58 Q72,48 68,38" fill="none" stroke="#374151" strokeWidth="5" strokeLinecap="round"
        style={{ animation: "sudokuTailSwish 2s ease-in-out infinite" }} />
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
      <path d="M27,27 Q32,22 37,27" fill="none" stroke="#1a1f2e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M43,27 Q48,22 53,27" fill="none" stroke="#1a1f2e" strokeWidth="2.5" strokeLinecap="round" />
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
      <text x="8" y="14" fontSize="14" style={{ animation: "sudokuSparkle 1s ease-in-out infinite" }}>✨</text>
      <text x="64" y="10" fontSize="12" style={{ animation: "sudokuSparkle 1s ease-in-out infinite 0.5s" }}>⭐</text>
    </svg>
  );
}

function CatConfused() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* One eye bigger than the other — confused */}
      <circle cx="32" cy="27" r="6" fill="white" />
      <circle cx="48" cy="27" r="4.5" fill="white" />
      <circle cx="33" cy="27" r="3.5" fill="#1a1f2e" />
      <circle cx="49" cy="27" r="2.5" fill="#1a1f2e" />
      <circle cx="34" cy="26" r="1.2" fill="white" />
      <circle cx="50" cy="26" r="1" fill="white" />
      {/* Tilted head */}
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M37,38 Q40,36 43,38" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <line x1="24" y1="33" x2="34" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="22" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="56" y1="33" x2="46" y2="34" stroke="#9ca3af" strokeWidth="0.8" />
      <line x1="58" y1="35" x2="47" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      {/* Question mark */}
      <text x="64" y="16" fontSize="18" fill="#d2a8ff" fontWeight="bold"
        style={{ animation: "sudokuBobble 1.5s ease-in-out infinite" }}>?</text>
    </svg>
  );
}

function CatSleepy() {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#374151" />
      <ellipse cx="40" cy="58" rx="14" ry="12" fill="#4b5563" />
      <circle cx="40" cy="30" r="20" fill="#374151" />
      <polygon points="24,16 18,2 32,12" fill="#374151" />
      <polygon points="24,15 19,4 31,12" fill="#fda4af" />
      <polygon points="56,16 62,2 48,12" fill="#374151" />
      <polygon points="56,15 61,4 49,12" fill="#fda4af" />
      {/* Sleepy half-closed eyes */}
      <path d="M27,28 Q32,25 37,28" fill="none" stroke="#1a1f2e" strokeWidth="2" strokeLinecap="round" />
      <path d="M43,28 Q48,25 53,28" fill="none" stroke="#1a1f2e" strokeWidth="2" strokeLinecap="round" />
      <polygon points="40,34 38,37 42,37" fill="#fda4af" />
      <path d="M38,37 Q40,39 42,37" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="28" cy="70" rx="10" ry="6" fill="#374151" />
      <ellipse cx="52" cy="70" rx="10" ry="6" fill="#374151" />
      {/* Zzz */}
      <text x="60" y="14" fontSize="12" fill="#8b949e" style={{ animation: "sudokuZzz 2s ease-in-out infinite" }}>z</text>
      <text x="68" y="8" fontSize="14" fill="#8b949e" style={{ animation: "sudokuZzz 2s ease-in-out infinite 0.4s" }}>z</text>
      <text x="74" y="2" fontSize="16" fill="#8b949e" style={{ animation: "sudokuZzz 2s ease-in-out infinite 0.8s" }}>Z</text>
    </svg>
  );
}

// ── Sudoku Generator & Solver ────────────────────────────────────────────

function isValid(grid: CellValue[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateFullGrid(): number[][] {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));

  // Fill with backtracking + shuffled numbers for randomness
  function fillGrid(g: CellValue[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === null) {
          const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (isValid(g, r, c, num)) {
              g[r][c] = num;
              if (fillGrid(g)) return true;
              g[r][c] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillGrid(grid);
  return grid as number[][];
}

function generatePuzzle(difficulty: Difficulty): { puzzle: Grid; solution: number[][] } {
  const solution = generateFullGrid();
  const puzzle: Grid = solution.map((row) => [...row]);

  // Number of cells to remove based on difficulty
  const removals = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 54;

  // Create list of all positions, shuffle, remove cells
  const positions = shuffleArray(
    Array.from({ length: 81 }, (_, i) => ({ row: Math.floor(i / 9), col: i % 9 }))
  );

  let removed = 0;
  for (const pos of positions) {
    if (removed >= removals) break;
    puzzle[pos.row][pos.col] = null;
    removed++;
  }

  return { puzzle, solution };
}

// ── Conflict Detection ───────────────────────────────────────────────────

function getConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val !== null) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(c);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => conflicts.add(`${r}-${c}`));
      }
    });
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const val = grid[r][c];
      if (val !== null) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(r);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => conflicts.add(`${r}-${c}`));
      }
    });
  }

  // Check 3x3 boxes
  for (let boxR = 0; boxR < 3; boxR++) {
    for (let boxC = 0; boxC < 3; boxC++) {
      const seen = new Map<number, string[]>();
      for (let r = boxR * 3; r < boxR * 3 + 3; r++) {
        for (let c = boxC * 3; c < boxC * 3 + 3; c++) {
          const val = grid[r][c];
          if (val !== null) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)!.push(`${r}-${c}`);
          }
        }
      }
      seen.forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach((key) => conflicts.add(key));
        }
      });
    }
  }

  return conflicts;
}

// ── Cat Dialogue ─────────────────────────────────────────────────────────
const CAT_LINES = {
  start: ["Let's solve it! 🧩", "Numbers time! 🐾", "I believe in you!", "Sudoku meow~ 🔢", "Focus, human!"],
  progress: ["Keep going! 📝", "Looking good!", "Purrfect so far~", "You got this!", "Nice moves! 🐱"],
  conflict: ["Hmm, that's wrong...", "Duplicate! 😿", "Check again meow~", "Something's off!", "Not quite right..."],
  hint: ["Here's a hint! 💡", "I found one! 🐾", "Try this cell~", "Look here! 👀", "Meow-tip! ✨"],
  win: ["You did it!! 🎉", "Purrfect solve! ✨", "git commit --solved 🐱", "Amazing human! 😸", "Meow-sterpiece! 🏆"],
  timeout: ["Time's up! ⏰", "Too slow! 😿", "The clock won...", "Need more speed!", "Try again meow~"],
  idle: ["Still thinking...?", "Hurry up! ⏰", "Tick tock! 🕐", "*watches clock*", "Time's running!"],
};

function randomLine(key: keyof typeof CAT_LINES): string {
  const lines = CAT_LINES[key];
  return lines[Math.floor(Math.random() * lines.length)];
}

// ── Constants ────────────────────────────────────────────────────────────
const GAME_DURATION = 60;

// ── Main Component ───────────────────────────────────────────────────────

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [solution, setSolution] = useState<number[][]>([]);
  const [initialPuzzle, setInitialPuzzle] = useState<Grid>([]);
  const [grid, setGrid] = useState<Grid>([]);
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [catMessage, setCatMessage] = useState("");
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Notes>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastAction, setLastAction] = useState<string>("");
  const [history, setHistory] = useState<{ grid: Grid; notes: Notes }[]>([]);
  const [animateCell, setAnimateCell] = useState<string | null>(null);
  const [timeBonus, setTimeBonus] = useState<{ amount: number; key: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const solvedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Init empty notes grid
  const createEmptyNotes = (): Notes =>
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()));

  // Generate new puzzle
  const startNewGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setInitialPuzzle(puzzle.map((row) => [...row]));
    setGrid(puzzle.map((row) => [...row]));
    setSolution(sol);
    setSelected(null);
    setConflicts(new Set());
    setSolved(false);
    solvedRef.current = false;
    setFailed(false);
    setNotesMode(false);
    setNotes(createEmptyNotes());
    setTimeLeft(GAME_DURATION);
    setIsRunning(true);
    setHintsUsed(0);
    setLastAction("");
    setHistory([]);
    setTimeBonus(null);
    setCatMessage(randomLine("start"));
  }, []);

  // Mount + initial game
  useEffect(() => {
    setMounted(true);
    startNewGame("easy");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep solvedRef in sync
  useEffect(() => { solvedRef.current = solved; }, [solved]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || solved || failed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!solvedRef.current) {
            setFailed(true);
            setIsRunning(false);
            setCatMessage(randomLine("timeout"));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, solved, failed]);

  // Idle cat messages
  useEffect(() => {
    if (!isRunning || solved || failed) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setCatMessage(randomLine("idle"));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isRunning, solved, failed]);

  // Check for win
  useEffect(() => {
    if (grid.length === 0) return;
    const isFull = grid.every((row) => row.every((cell) => cell !== null));
    if (isFull && conflicts.size === 0) {
      // Verify against solution
      const isCorrect = grid.every((row, r) =>
        row.every((cell, c) => cell === solution[r][c])
      );
      if (isCorrect) {
        setSolved(true);
        setIsRunning(false);
        setCatMessage(randomLine("win"));
      }
    }
  }, [grid, conflicts, solution]);

  // Update conflicts when grid changes
  useEffect(() => {
    if (grid.length > 0) {
      setConflicts(getConflicts(grid));
    }
  }, [grid]);

  // Save to history before each move
  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-50), // keep last 50 states
      {
        grid: grid.map((row) => [...row]),
        notes: notes.map((row) => row.map((s) => new Set(s))),
      },
    ]);
  }, [grid, notes]);

  // Handle number input
  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selected || solved || failed) return;
      const { row, col } = selected;

      // Can't modify initial clues
      if (initialPuzzle[row]?.[col] !== null) return;

      if (notesMode) {
        pushHistory();
        const newNotes = notes.map((r) => r.map((s) => new Set(s)));
        if (newNotes[row][col].has(num)) {
          newNotes[row][col].delete(num);
        } else {
          newNotes[row][col].add(num);
        }
        setNotes(newNotes);
        setLastAction("note");
        return;
      }

      pushHistory();
      const newGrid = grid.map((r) => [...r]);
      // Toggle: if same number, clear it
      if (newGrid[row][col] === num) {
        newGrid[row][col] = null;
      } else {
        newGrid[row][col] = num;
        // Clear notes for this cell
        const newNotes2 = notes.map((r) => r.map((s) => new Set(s)));
        newNotes2[row][col].clear();
        setNotes(newNotes2);

        // Check against solution: +2s for correct, -3s for wrong
        if (num === solution[row]?.[col]) {
          // Correct placement
          setTimeLeft((prev) => prev + 2);
          setTimeBonus({ amount: 2, key: Date.now() });
          if (Math.random() < 0.35) {
            setCatMessage(randomLine("progress"));
          }
          setLastAction("place");
        } else {
          // Wrong placement
          setTimeLeft((prev) => Math.max(0, prev - 3));
          setTimeBonus({ amount: -3, key: Date.now() });
          setCatMessage(randomLine("conflict"));
          setLastAction("conflict");
        }
      }
      setGrid(newGrid);
      setAnimateCell(`${row}-${col}`);
      setTimeout(() => setAnimateCell(null), 350);
    },
    [selected, solved, failed, initialPuzzle, notesMode, notes, grid, solution, pushHistory]
  );

  // Erase cell
  const handleErase = useCallback(() => {
    if (!selected || solved || failed) return;
    const { row, col } = selected;
    if (initialPuzzle[row]?.[col] !== null) return;

    pushHistory();
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = null;
    setGrid(newGrid);

    const newNotes2 = notes.map((r) => r.map((s) => new Set(s)));
    newNotes2[row][col].clear();
    setNotes(newNotes2);
  }, [selected, solved, initialPuzzle, grid, notes, pushHistory]);

  // Undo
  const handleUndo = useCallback(() => {
    if (history.length === 0 || solved || failed) return;
    const prev = history[history.length - 1];
    setGrid(prev.grid);
    setNotes(prev.notes);
    setHistory((h) => h.slice(0, -1));
  }, [history, solved, failed]);

  // Hint
  const handleHint = useCallback(() => {
    if (solved || failed) return;

    // Find an empty cell or wrong cell
    const emptyCells: CellPosition[] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === null || grid[r][c] !== solution[r][c]) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) return;

    // Prefer selected cell if it's empty/wrong, else random
    let target: CellPosition;
    if (
      selected &&
      initialPuzzle[selected.row]?.[selected.col] === null &&
      (grid[selected.row][selected.col] === null || grid[selected.row][selected.col] !== solution[selected.row][selected.col])
    ) {
      target = selected;
    } else {
      target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    pushHistory();
    const newGrid = grid.map((r) => [...r]);
    newGrid[target.row][target.col] = solution[target.row][target.col];
    setGrid(newGrid);
    setSelected(target);
    setHintsUsed((h) => h + 1);
    setAnimateCell(`${target.row}-${target.col}`);
    setTimeout(() => setAnimateCell(null), 350);
    setCatMessage(randomLine("hint"));
    setLastAction("hint");
  }, [solved, grid, solution, selected, initialPuzzle, pushHistory]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (solved || failed) return;

      // Number keys
      if (e.key >= "1" && e.key <= "9") {
        handleNumberInput(parseInt(e.key));
        return;
      }

      // Arrow keys
      if (selected && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const { row, col } = selected;
        switch (e.key) {
          case "ArrowUp":
            setSelected({ row: Math.max(0, row - 1), col });
            break;
          case "ArrowDown":
            setSelected({ row: Math.min(8, row + 1), col });
            break;
          case "ArrowLeft":
            setSelected({ row, col: Math.max(0, col - 1) });
            break;
          case "ArrowRight":
            setSelected({ row, col: Math.min(8, col + 1) });
            break;
        }
        return;
      }

      // Delete / Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        handleErase();
        return;
      }

      // Toggle notes
      if (e.key === "n" || e.key === "N") {
        setNotesMode((prev) => !prev);
      }

      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, solved, handleNumberInput, handleErase, handleUndo]);

  // Count how many of each number are placed
  const numberCounts = (() => {
    const counts: Record<number, number> = {};
    for (let n = 1; n <= 9; n++) counts[n] = 0;
    if (grid.length > 0) {
      grid.forEach((row) =>
        row.forEach((cell) => {
          if (cell !== null) counts[cell]++;
        })
      );
    }
    return counts;
  })();

  // Determine which cells are highlighted (same row/col/box/number as selected)
  const getHighlightType = (row: number, col: number): "selected" | "related" | "sameNum" | null => {
    if (!selected) return null;
    if (selected.row === row && selected.col === col) return "selected";

    const selectedVal = grid[selected.row]?.[selected.col];
    const cellVal = grid[row]?.[col];

    // Same number highlight
    if (selectedVal !== null && cellVal === selectedVal) return "sameNum";

    // Same row, col, or box
    if (selected.row === row || selected.col === col) return "related";
    const selBoxR = Math.floor(selected.row / 3);
    const selBoxC = Math.floor(selected.col / 3);
    const cellBoxR = Math.floor(row / 3);
    const cellBoxC = Math.floor(col / 3);
    if (selBoxR === cellBoxR && selBoxC === cellBoxC) return "related";

    return null;
  };

  // Cat mood
  const gameOver = solved || failed;

  const catMood = solved
    ? "happy"
    : failed
    ? "confused"
    : lastAction === "conflict"
    ? "confused"
    : timeLeft <= 10 && !solved
    ? "sleepy"
    : "watching";

  const timerColor = timeLeft <= 5 ? "var(--gh-accent-red)" : timeLeft <= 10 ? "var(--gh-accent-orange)" : "var(--gh-accent-green)";

  if (!mounted) return null;

  return (
    <div className="flex flex-col px-2 sm:px-6 py-2 sm:py-4 pb-6">
      {/* Title — hidden on mobile */}
      <div className="hidden sm:block text-center mb-1 animate-fade-in-up">
        <h1 className="text-lg font-bold text-foreground mb-0.5 flex items-center justify-center gap-2">
          <span>🧩</span>
          Sudoku
          <span>🐱</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Fill every row, column, and box with 1–9. The cat is watching!
        </p>
      </div>

      {/* Difficulty + Timer row */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-1 sm:mb-2 animate-fade-in-up delay-100 flex-wrap">
        <div className="flex gap-1.5">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                startNewGame(d);
              }}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md border transition-all duration-200 ${
                difficulty === d
                  ? "bg-[var(--gh-accent-blue)] text-white border-[var(--gh-accent-blue)] shadow-[0_0_12px_rgba(88,166,255,0.3)]"
                  : "bg-[var(--gh-btn-bg)] text-muted-foreground border-[var(--gh-border)] hover:border-[var(--gh-text-secondary)] hover:text-foreground"
              }`}
              id={`sudoku-difficulty-${d}`}
            >
              {d === "easy" ? "😺 Easy" : d === "medium" ? "😼 Medium" : "😾 Hard"}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border bg-[var(--gh-bg-secondary)] text-xs font-mono font-bold" style={{ borderColor: timerColor, color: timerColor }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {timeLeft}s
            {/* Time bonus/penalty popup */}
            {timeBonus && (
              <span
                key={timeBonus.key}
                className="absolute -top-5 right-0 text-[11px] font-bold pointer-events-none"
                style={{
                  color: timeBonus.amount > 0 ? "var(--gh-accent-green)" : "var(--gh-accent-red)",
                  animation: "sudokuTimeBonusFloat 1s ease-out forwards",
                  textShadow: `0 0 6px ${timeBonus.amount > 0 ? "rgba(63,185,80,0.5)" : "rgba(248,81,73,0.5)"}`,
                }}
              >
                {timeBonus.amount > 0 ? `+${timeBonus.amount}s` : `${timeBonus.amount}s`}
              </span>
            )}
          </div>
          
          {/* Stats (inline with timer on all sizes) */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <span>💡 <span className="text-[var(--gh-accent-orange)] font-bold">{hintsUsed}</span></span>
            <span>⚠ <span className="text-[var(--gh-accent-red)] font-bold">{conflicts.size}</span></span>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="max-w-lg mx-auto w-full mb-1 sm:mb-2 h-1 sm:h-1.5 rounded-full bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${Math.min((timeLeft / GAME_DURATION) * 100, 100)}%`,
            background: timerColor,
            boxShadow: `0 0 8px ${timerColor}`,
          }}
        />
      </div>

      {/* Mobile cat message */}
      <div className="flex xl:hidden items-center justify-center gap-2 text-xs text-muted-foreground font-mono mb-1" key={catMessage + "-mobile"}>
        <span className="text-base">{catMood === "happy" ? "😺" : catMood === "confused" ? "😿" : catMood === "sleepy" ? "😴" : "🐱"}</span>
        <span className="inline-block" style={{ animation: "sudokuBubbleIn 0.3s ease-out" }}>{catMessage}</span>
      </div>

      {/* Main game area — board + controls centered */}
      <div className="relative flex items-center justify-center">

        {/* Cat panel — xl only (floating left) */}
        <div className="hidden xl:flex flex-col items-center gap-3 animate-fade-in-up delay-200 absolute right-full mr-6 top-0" style={{ width: 150 }}>
          <div
            className="relative rounded-2xl p-4 border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]"
            style={{
              boxShadow: solved
                ? "0 0 24px rgba(63, 185, 80, 0.15), 0 0 48px rgba(63, 185, 80, 0.05)"
                : "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            {catMood === "watching" && <CatWatching />}
            {catMood === "happy" && <CatHappy />}
            {catMood === "confused" && <CatConfused />}
            {catMood === "sleepy" && <CatSleepy />}
          </div>
          {/* Speech bubble */}
          <div
            key={catMessage}
            className="relative text-center text-xs font-medium text-foreground px-3 py-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] shadow-lg"
            style={{ animation: "sudokuBubbleIn 0.3s ease-out", width: 140, wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            {catMessage}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--gh-border)]" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">Pet Cat 🐱</span>
          {/* Stats */}
          <div className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 text-xs">
            <div className="flex justify-between mb-1.5 text-muted-foreground">
              <span>Hints used</span>
              <span className="font-mono text-[var(--gh-accent-orange)]">{hintsUsed}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Errors</span>
              <span className="font-mono text-[var(--gh-accent-red)]">{conflicts.size}</span>
            </div>
          </div>
        </div>

        {/* Center column: Board + Controls */}
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          {/* Sudoku Board */}
          <div className="relative animate-fade-in-up delay-300">
            <div
              className="grid grid-cols-9 rounded-xl overflow-hidden border-2 p-0"
              style={{
                borderColor: solved ? "var(--gh-accent-green)" : "var(--gh-border)",
                background: "var(--gh-border)",
                transition: "border-color 0.4s ease",
                boxShadow: solved ? "0 0 30px rgba(63, 185, 80, 0.15)" : "0 4px 24px rgba(0,0,0,0.15)",
                gap: "1px",
              }}
              id="sudoku-board"
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isInitial = initialPuzzle[r]?.[c] !== null;
                  const hasConflict = conflicts.has(`${r}-${c}`) && !isInitial;
                  const highlight = getHighlightType(r, c);
                  const isAnimating = animateCell === `${r}-${c}`;
                  const cellNotes = notes[r]?.[c] || new Set<number>();

                  // Box border logic — thicker borders between 3x3 boxes
                  const borderRight = (c + 1) % 3 === 0 && c < 8 ? "2px solid var(--gh-text-secondary)" : "none";
                  const borderBottom = (r + 1) % 3 === 0 && r < 8 ? "2px solid var(--gh-text-secondary)" : "none";

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => setSelected({ row: r, col: c })}
                      className="relative flex items-center justify-center transition-all duration-150 sudoku-cell"
                      style={{
                        borderRight,
                        borderBottom,
                        background:
                          highlight === "selected"
                            ? "rgba(88, 166, 255, 0.2)"
                            : highlight === "sameNum"
                            ? "rgba(88, 166, 255, 0.1)"
                            : highlight === "related"
                            ? "rgba(88, 166, 255, 0.05)"
                            : hasConflict
                            ? "rgba(248, 81, 73, 0.1)"
                            : "var(--gh-bg-secondary)",
                        cursor: "pointer",
                        outline: highlight === "selected" ? "2px solid var(--gh-accent-blue)" : "none",
                        outlineOffset: "-2px",
                        zIndex: highlight === "selected" ? 10 : 1,
                      }}
                      id={`sudoku-cell-${r}-${c}`}
                      aria-label={`Row ${r + 1}, Column ${c + 1}${cell ? `, value ${cell}` : ", empty"}`}
                    >
                      {cell !== null ? (
                        <span
                          className={`font-bold select-none sudoku-cell-text ${
                            isInitial
                              ? "text-foreground"
                              : hasConflict
                              ? "text-[var(--gh-accent-red)]"
                              : "text-[var(--gh-accent-blue)]"
                          }`}
                          style={{
                            animation: isAnimating ? "sudokuPlacePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" : undefined,
                            textShadow: hasConflict ? "0 0 8px rgba(248, 81, 73, 0.4)" : "none",
                          }}
                        >
                          {cell}
                        </span>
                      ) : cellNotes.size > 0 ? (
                        <div className="grid grid-cols-3 gap-0 w-full h-full p-[1px]">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <span
                              key={n}
                              className="flex items-center justify-center text-[6px] sm:text-[7px] md:text-[8px] text-muted-foreground select-none leading-none"
                              style={{ opacity: cellNotes.has(n) ? 1 : 0 }}
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>

            {/* Win / Fail overlay */}
            {gameOver && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                style={{
                  background: "rgba(13, 17, 23, 0.85)",
                  backdropFilter: "blur(12px)",
                  animation: "sudokuResultIn 0.35s ease-out",
                }}
              >
                <div
                  className="w-full max-w-sm rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 text-center"
                  style={{
                    boxShadow: `0 0 60px ${solved ? "rgba(63,185,80,0.12)" : "rgba(248,81,73,0.12)"}, 0 24px 48px rgba(0,0,0,0.4)`,
                    animation: "sudokuBubbleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {/* Result emoji */}
                  <div className="text-5xl mb-3" style={{ animation: "sudokuPlacePop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    {solved ? "🎉" : "⏰"}
                  </div>

                  {/* Result title */}
                  <div
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{
                      color: solved ? "var(--gh-accent-green)" : "var(--gh-accent-red)",
                    }}
                  >
                    {solved ? "Puzzle Solved!" : "Time's Up!"}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6 font-mono">
                    <span>⏱ {solved ? `${GAME_DURATION - timeLeft}s` : `${GAME_DURATION}s`}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span>💡 {hintsUsed} hint{hintsUsed !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => startNewGame(difficulty)}
                      className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-[var(--gh-accent-green)] text-white hover:brightness-110 transition-all duration-200 hover:shadow-[0_0_20px_rgba(63,185,80,0.35)] active:scale-[0.97]"
                      id="sudoku-new-game-btn"
                    >
                      {solved ? "New Puzzle" : "Try Again"}
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

          {/* Controls strip — always below board */}
          <div className="flex flex-col items-center gap-2 animate-fade-in-up delay-400 w-full" style={{ flexShrink: 0 }}>
            {/* Number pad — full width row */}
            <div className="flex justify-center gap-1 sm:gap-1.5 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isComplete = numberCounts[num] >= 9;
                return (
                  <button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    disabled={isComplete || gameOver}
                    className={`flex flex-col items-center justify-center rounded-lg border transition-all duration-200 sudoku-numpad-btn ${
                      isComplete
                        ? "opacity-30 cursor-not-allowed border-[var(--gh-border)] bg-[var(--gh-bg)]"
                        : "border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] hover:border-[var(--gh-accent-blue)] hover:bg-[rgba(88,166,255,0.08)] hover:shadow-[0_0_8px_rgba(88,166,255,0.15)] active:scale-95"
                    }`}
                    id={`sudoku-num-${num}`}
                  >
                    <span className={`font-bold sudoku-numpad-text ${notesMode ? "text-[var(--gh-accent-purple)]" : "text-foreground"}`}>
                      {num}
                    </span>
                    <span className="text-[7px] sm:text-[8px] text-muted-foreground font-mono leading-none">{9 - numberCounts[num]}</span>
                  </button>
                );
              })}
            </div>

            {/* Action buttons row */}
            <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
              <button
                onClick={handleUndo}
                disabled={history.length === 0 || gameOver}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md border border-[var(--gh-border)] bg-[var(--gh-btn-bg)] text-muted-foreground hover:text-foreground hover:border-[var(--gh-text-secondary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                id="sudoku-undo-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Undo
              </button>
              <button
                onClick={handleErase}
                disabled={!selected || gameOver || (selected && initialPuzzle[selected.row]?.[selected.col] !== null)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md border border-[var(--gh-border)] bg-[var(--gh-btn-bg)] text-muted-foreground hover:text-foreground hover:border-[var(--gh-text-secondary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                id="sudoku-erase-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
                Erase
              </button>
              <button
                onClick={() => setNotesMode((prev) => !prev)}
                disabled={gameOver}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md border transition-all active:scale-95 ${
                  notesMode
                    ? "bg-[var(--gh-accent-purple)] text-white border-[var(--gh-accent-purple)] shadow-[0_0_8px_rgba(188,140,255,0.3)]"
                    : "border-[var(--gh-border)] bg-[var(--gh-btn-bg)] text-muted-foreground hover:text-foreground hover:border-[var(--gh-text-secondary)]"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
                id="sudoku-notes-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
                Notes
              </button>
              <button
                onClick={handleHint}
                disabled={gameOver}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md border border-[var(--gh-accent-orange)] text-[var(--gh-accent-orange)] bg-transparent hover:bg-[rgba(210,153,34,0.08)] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                id="sudoku-hint-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
                Hint
              </button>
              <button
                onClick={() => startNewGame(difficulty)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md border border-[var(--gh-accent-green)] text-[var(--gh-accent-green)] bg-transparent hover:bg-[var(--gh-accent-green)] hover:text-white transition-all duration-200 hover:shadow-[0_0_12px_rgba(63,185,80,0.25)] active:scale-95"
                id="sudoku-new-game-btn-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
                New
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hints — desktop only */}
      <div className="hidden sm:flex justify-center mt-1 mb-1 text-[10px] text-muted-foreground gap-3 animate-fade-in-up delay-500">
        <span><kbd className="px-1 py-0.5 rounded border border-[var(--gh-border)] bg-[var(--gh-bg)] font-mono text-[9px]">1-9</kbd> Enter number</span>
        <span><kbd className="px-1 py-0.5 rounded border border-[var(--gh-border)] bg-[var(--gh-bg)] font-mono text-[9px]">N</kbd> Toggle notes</span>
        <span><kbd className="px-1 py-0.5 rounded border border-[var(--gh-border)] bg-[var(--gh-bg)] font-mono text-[9px]">←→↑↓</kbd> Navigate</span>
        <span><kbd className="px-1 py-0.5 rounded border border-[var(--gh-border)] bg-[var(--gh-bg)] font-mono text-[9px]">Ctrl+Z</kbd> Undo</span>
      </div>

      {/* Animations + responsive cell sizing */}
      <style>{`
        /* Cell sizing — responsive with proper desktop scaling */
        .sudoku-cell {
          width: clamp(34px, calc((100vw - 32px) / 9), 42px);
          height: clamp(34px, calc((100vw - 32px) / 9), 42px);
        }
        .sudoku-cell-text {
          font-size: clamp(13px, calc((100vw - 32px) / 25), 16px);
        }
        .sudoku-numpad-btn {
          width: clamp(32px, calc((100vw - 48px) / 9), 40px);
          height: clamp(32px, calc((100vw - 48px) / 9), 38px);
        }
        .sudoku-numpad-text {
          font-size: clamp(12px, calc((100vw - 48px) / 30), 15px);
        }
        @media (min-width: 640px) {
          .sudoku-cell {
            width: 52px;
            height: 52px;
          }
          .sudoku-cell-text {
            font-size: 18px;
          }
          .sudoku-numpad-btn {
            width: 48px;
            height: 44px;
          }
          .sudoku-numpad-text {
            font-size: 16px;
          }
        }
        @media (min-width: 1024px) {
          .sudoku-cell {
            width: 56px;
            height: 56px;
          }
          .sudoku-cell-text {
            font-size: 20px;
          }
          .sudoku-numpad-btn {
            width: 52px;
            height: 48px;
          }
          .sudoku-numpad-text {
            font-size: 18px;
          }
        }

        @keyframes sudokuTailSwish {
          0%, 100% { d: path("M62,58 Q72,48 68,38"); }
          50% { d: path("M62,58 Q75,52 72,42"); }
        }
        @keyframes sudokuSparkle {
          0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(15deg); }
        }
        @keyframes sudokuBobble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes sudokuZzz {
          0% { opacity: 0; transform: translateY(4px) scale(0.7); }
          50% { opacity: 1; transform: translateY(-2px) scale(1); }
          100% { opacity: 0; transform: translateY(-8px) scale(0.7); }
        }
        @keyframes sudokuBubbleIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes sudokuPlacePop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sudokuResultIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sudokuTimeBonusFloat {
          0% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; transform: translateY(-12px); }
          100% { opacity: 0; transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
}
