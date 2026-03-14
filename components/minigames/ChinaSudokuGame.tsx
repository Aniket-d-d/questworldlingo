"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  difficulty?: 1 | 2 | 3;
  onComplete: (score: number, total: number) => void;
}

type Cell = number | null;

const LEVELS = [4, 5, 6];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createEmptyGrid(size: number): Cell[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function standardRegions(size: number): number[][] {
  if (size === 4) {
    return Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => Math.floor(r / 2) * 2 + Math.floor(c / 2)),
    );
  }
  if (size === 6) {
    return Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => Math.floor(r / 2) * 3 + Math.floor(c / 3)),
    );
  }
  return [];
}

function generateJigsawRegions(size: number): number[][] {
  const maxAttempts = 200;
  const targetSize = size;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const regions = Array.from({ length: size }, () => Array(size).fill(-1));
    const allCells = shuffle(
      Array.from({ length: size * size }, (_, i) => ({ r: Math.floor(i / size), c: i % size })),
    );
    const seeds = allCells.slice(0, size);
    const regionSizes = Array(size).fill(0);
    const frontiers: Array<Array<{ r: number; c: number }>> = Array.from({ length: size }, () => []);

    seeds.forEach((cell, id) => {
      regions[cell.r][cell.c] = id;
      regionSizes[id] = 1;
      frontiers[id].push(cell);
    });

    let unassigned = size * size - size;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    let safety = 0;
    while (unassigned > 0 && safety < size * size * 20) {
      safety += 1;
      const activeRegions = frontiers
        .map((cells, id) => ({ id, cells }))
        .filter(({ id, cells }) => cells.length > 0 && regionSizes[id] < targetSize);
      if (activeRegions.length === 0) break;
      const pick = activeRegions[Math.floor(Math.random() * activeRegions.length)];
      const cell = pick.cells[Math.floor(Math.random() * pick.cells.length)];
      const neighbors = shuffle(dirs)
        .map(([dr, dc]) => ({ r: cell.r + dr, c: cell.c + dc }))
        .filter(
          (n) =>
            n.r >= 0 &&
            n.r < size &&
            n.c >= 0 &&
            n.c < size &&
            regions[n.r][n.c] === -1,
        );

      if (neighbors.length === 0) {
        pick.cells.splice(pick.cells.indexOf(cell), 1);
        continue;
      }

      const next = neighbors[0];
      regions[next.r][next.c] = pick.id;
      regionSizes[pick.id] += 1;
      pick.cells.push(next);
      unassigned -= 1;
    }

    if (unassigned === 0 && regionSizes.every((s) => s === targetSize)) {
      return regions;
    }
  }

  return standardRegions(4);
}

function isValid(
  grid: Cell[][],
  regions: number[][],
  size: number,
  r: number,
  c: number,
  value: number,
): boolean {
  for (let i = 0; i < size; i += 1) {
    if (grid[r][i] === value) return false;
    if (grid[i][c] === value) return false;
  }
  const regionId = regions[r][c];
  for (let rr = 0; rr < size; rr += 1) {
    for (let cc = 0; cc < size; cc += 1) {
      if (regions[rr][cc] === regionId && grid[rr][cc] === value) return false;
    }
  }
  return true;
}

function solveGrid(grid: Cell[][], regions: number[][], size: number): boolean {
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (grid[r][c] !== null) continue;
      const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
      for (const num of nums) {
        if (!isValid(grid, regions, size, r, c, num)) continue;
        grid[r][c] = num;
        if (solveGrid(grid, regions, size)) return true;
        grid[r][c] = null;
      }
      return false;
    }
  }
  return true;
}

function generatePuzzle(size: number): { solution: number[][]; puzzle: Cell[][]; regions: number[][]; fixed: boolean[][] } {
  const regions = size === 5 ? generateJigsawRegions(size) : standardRegions(size);
  const grid = createEmptyGrid(size);
  solveGrid(grid, regions, size);
  const solution = grid.map((row) => row.map((v) => v ?? 0));

  const totalCells = size * size;
  const givens = Math.max(size + 2, Math.floor(totalCells * 0.45));
  const positions = shuffle(Array.from({ length: totalCells }, (_, i) => i));
  const puzzle: Cell[][] = solution.map((row) => row.map((v) => v));
  const fixed = Array.from({ length: size }, () => Array(size).fill(true));

  let removed = 0;
  for (const pos of positions) {
    if (totalCells - removed <= givens) break;
    const r = Math.floor(pos / size);
    const c = pos % size;
    puzzle[r][c] = null;
    fixed[r][c] = false;
    removed += 1;
  }

  return { solution, puzzle, regions, fixed };
}

export default function ChinaSudokuGame({ difficulty, onComplete }: Props) {
  const activeLevels = difficulty ? [LEVELS[difficulty - 1]] : LEVELS;
  const [levelIndex, setLevelIndex] = useState(0);
  const [size, setSize] = useState(activeLevels[0]);
  const [regions, setRegions] = useState<number[][]>([]);
  const [fixed, setFixed] = useState<boolean[][]>([]);
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid(activeLevels[0]));
  const [initialGrid, setInitialGrid] = useState<Cell[][]>(createEmptyGrid(activeLevels[0]));
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);
  const [status, setStatus] = useState<"playing" | "level_complete" | "complete">("playing");
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const nextSize = activeLevels[levelIndex];
    setSize(nextSize);
    const data = generatePuzzle(nextSize);
    setRegions(data.regions);
    setFixed(data.fixed);
    setGrid(data.puzzle);
    setInitialGrid(data.puzzle);
    setHistory([]);
    setSelectedNumber(null);
    setStatus("playing");
    setConflicts(new Set());
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, [levelIndex]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const nextConflicts = new Set<string>();
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        const value = grid[r]?.[c];
        if (value === null) continue;
        for (let i = 0; i < size; i += 1) {
          if (i !== c && grid[r][i] === value) {
            nextConflicts.add(`${r}-${c}`);
            nextConflicts.add(`${r}-${i}`);
          }
          if (i !== r && grid[i][c] === value) {
            nextConflicts.add(`${r}-${c}`);
            nextConflicts.add(`${i}-${c}`);
          }
        }
        const regionId = regions[r]?.[c];
        for (let rr = 0; rr < size; rr += 1) {
          for (let cc = 0; cc < size; cc += 1) {
            if (rr === r && cc === c) continue;
            if (regions[rr]?.[cc] === regionId && grid[rr][cc] === value) {
              nextConflicts.add(`${r}-${c}`);
              nextConflicts.add(`${rr}-${cc}`);
            }
          }
        }
      }
    }
    setConflicts(nextConflicts);

    const filled = grid.flat().every((v) => v !== null);
    if (filled && nextConflicts.size === 0 && status === "playing") {
      if (levelIndex < activeLevels.length - 1) {
        setStatus("level_complete");
        advanceTimerRef.current = setTimeout(() => {
          setLevelIndex((i) => i + 1);
        }, 900);
      } else {
        setStatus("complete");
        advanceTimerRef.current = setTimeout(() => onComplete(activeLevels.length, activeLevels.length), 700);
      }
    }
  }, [grid, regions, size, status, levelIndex, onComplete]);

  function placeNumber(r: number, c: number) {
    if (status !== "playing") return;
    if (fixed[r]?.[c]) return;
    if (selectedNumber === null) return;
    setGrid((prev) => {
      const prevCopy = prev.map((row) => row.slice());
      setHistory((h) => [...h, prevCopy]);
      const next = prev.map((row) => row.slice());
      next[r][c] = selectedNumber;
      return next;
    });
    setSelectedNumber(null);
  }

  function placeDirect(r: number, c: number, value: number) {
    if (status !== "playing") return;
    if (fixed[r]?.[c]) return;
    if (value < 1 || value > size) return;
    setGrid((prev) => {
      const prevCopy = prev.map((row) => row.slice());
      setHistory((h) => [...h, prevCopy]);
      const next = prev.map((row) => row.slice());
      next[r][c] = value;
      return next;
    });
  }

  function handleUndo() {
    if (status !== "playing") return;
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      setGrid(last);
      return h.slice(0, -1);
    });
  }

  function handleClear() {
    if (status !== "playing") return;
    setGrid(initialGrid.map((row) => row.slice()));
    setHistory([]);
    setSelectedNumber(null);
    setActiveCell(null);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (status !== "playing") return;
      if (!activeCell) return;
      const key = e.key;
      if (key >= "1" && key <= "9") {
        const value = Number(key);
        if (value >= 1 && value <= size) {
          placeDirect(activeCell.r, activeCell.c, value);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCell, size, status]);

  function cellBorder(r: number, c: number): React.CSSProperties {
    if (!regions.length) return {};
    const regionId = regions[r][c];
    const thick = "2px solid var(--border-gold)";
    const borders: React.CSSProperties = {
      borderTop: "1px solid var(--border-color)",
      borderRight: "1px solid var(--border-color)",
      borderBottom: "1px solid var(--border-color)",
      borderLeft: "1px solid var(--border-color)",
    };

    if (r === 0 || regions[r - 1][c] !== regionId) borders.borderTop = thick;
    if (r === size - 1 || regions[r + 1][c] !== regionId) borders.borderBottom = thick;
    if (c === 0 || regions[r][c - 1] !== regionId) borders.borderLeft = thick;
    if (c === size - 1 || regions[r][c + 1] !== regionId) borders.borderRight = thick;

    return borders;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <p style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--accent-gold)",
          marginBottom: "6px",
        }}>
          Scholar&apos;s Sudoku
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Complete each grid without repeating numbers in rows, columns, or regions.
        </p>
      </div>

      {/* Level tracker */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
        {activeLevels.map((lvl, i) => {
          const isCurrent = i === levelIndex;
          const color = isCurrent ? "var(--accent-gold-light)" : "var(--text-muted)";
          return (
            <div
              key={lvl}
              style={{
                padding: "6px 12px",
                border: `1px solid ${color}`,
                color,
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {lvl}×{lvl}
            </div>
          );
        })}
      </div>

      {/* Board + Controls */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
        marginBottom: "16px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          width: "min(420px, 100%)",
          height: "min(420px, 100%)",
          border: "1px solid var(--border-gold)",
          background: "var(--bg-card)",
        }}>
          {grid.map((row, r) =>
            row.map((value, c) => {
              const isFixed = fixed[r]?.[c];
              const isConflict = conflicts.has(`${r}-${c}`);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => placeNumber(r, c)}
                  onFocus={() => setActiveCell({ r, c })}
                  onMouseDown={() => setActiveCell({ r, c })}
                  style={{
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-cinzel)",
                    fontSize: size === 6 ? "1.2rem" : size === 5 ? "1.3rem" : "1.4rem",
                    color: isFixed ? "var(--accent-gold-light)" : "var(--text-secondary)",
                    cursor: isFixed ? "default" : "pointer",
                    lineHeight: 1,
                    ...cellBorder(r, c),
                    backgroundColor: isConflict ? "rgba(192,57,43,0.12)" : "transparent",
                    boxShadow:
                      activeCell && activeCell.r === r && activeCell.c === c
                        ? "inset 0 0 0 2px var(--accent-gold)"
                        : "none",
                  }}
                >
                  {value ?? ""}
                </button>
              );
            }),
          )}
        </div>

        <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ border: "1px solid var(--border-gold)", padding: "12px", background: "var(--bg-card)" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "8px",
            }}>
              Numbers
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {Array.from({ length: size }, (_, i) => i + 1).map((num) => {
                const selected = selectedNumber === num;
                return (
                  <button
                    key={num}
                    onClick={() => setSelectedNumber((prev) => (prev === num ? null : num))}
                    style={{
                      padding: "8px 0",
                      border: `1px solid ${selected ? "var(--accent-gold)" : "var(--border-gold)"}`,
                      background: selected ? "rgba(201,146,42,0.12)" : "transparent",
                      color: selected ? "var(--accent-gold-light)" : "var(--text-secondary)",
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <p style={{
              marginTop: "10px",
              fontFamily: "var(--font-crimson)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}>
              Select a number, then click a cell. Or click a cell and type 1–{size}.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleUndo}
              disabled={status !== "playing" || history.length === 0}
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid var(--border-gold)",
                background: "transparent",
                color: status === "playing" && history.length > 0 ? "var(--text-secondary)" : "var(--text-muted)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: status === "playing" && history.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (status === "playing" && history.length > 0) {
                  e.currentTarget.style.borderColor = "var(--accent-gold)";
                  e.currentTarget.style.color = "var(--accent-gold-light)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-gold)";
                e.currentTarget.style.color =
                  status === "playing" && history.length > 0 ? "var(--text-secondary)" : "var(--text-muted)";
              }}
            >
              Undo
            </button>
            <button
              onClick={handleClear}
              disabled={status !== "playing"}
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid var(--border-gold)",
                background: "transparent",
                color: status === "playing" ? "var(--text-secondary)" : "var(--text-muted)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: status === "playing" ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (status === "playing") {
                  e.currentTarget.style.borderColor = "var(--accent-gold)";
                  e.currentTarget.style.color = "var(--accent-gold-light)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-gold)";
                e.currentTarget.style.color = status === "playing" ? "var(--text-secondary)" : "var(--text-muted)";
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", minHeight: "24px" }}>
        {status === "level_complete" && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold)", letterSpacing: "0.1em" }}>
            Level Complete
          </p>
        )}
        {status === "complete" && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold-light)", letterSpacing: "0.1em" }}>
            Here&apos;s your artifact/excerpt.
          </p>
        )}
      </div>
    </div>
  );
}
