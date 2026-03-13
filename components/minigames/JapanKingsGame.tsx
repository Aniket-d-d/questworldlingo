"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
  onComplete: (score: number, total: number) => void;
}

type CellState = "empty" | "block" | "king";

const LEVELS = [4, 5, 6];

const REGION_COLORS = [
  "#8b2500",
  "#c9922a",
  "#4a3520",
  "#1f0b06",
  "#a07030",
  "#e8b84b",
  "#6b5a45",
  "#c43c00",
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateSolution(size: number): number[] {
  const cols: number[] = Array(size).fill(-1);
  const used = new Set<number>();

  function backtrack(row: number): boolean {
    if (row === size) return true;
    const order = shuffle(Array.from({ length: size }, (_, i) => i));
    for (const col of order) {
      if (used.has(col)) continue;
      if (row > 0 && Math.abs(col - cols[row - 1]) <= 1) continue;
      cols[row] = col;
      used.add(col);
      if (backtrack(row + 1)) return true;
      used.delete(col);
      cols[row] = -1;
    }
    return false;
  }

  // Retry until a valid permutation is found (should be fast for 4/6/8)
  while (!backtrack(0)) {
    used.clear();
    cols.fill(-1);
  }

  return cols;
}

function generateRegions(size: number, solution: number[]): number[][] {
  const regions = Array.from({ length: size }, () => Array(size).fill(-1));
  const frontier: Array<{ r: number; c: number; id: number }> = [];

  for (let r = 0; r < size; r += 1) {
    const c = solution[r];
    regions[r][c] = r;
    frontier.push({ r, c, id: r });
  }

  let unassigned = size * size - size;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (unassigned > 0) {
    if (frontier.length === 0) break;
    const idx = Math.floor(Math.random() * frontier.length);
    const cell = frontier[idx];
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
      frontier.splice(idx, 1);
      continue;
    }

    const next = neighbors[0];
    regions[next.r][next.c] = cell.id;
    frontier.push({ r: next.r, c: next.c, id: cell.id });
    unassigned -= 1;
  }

  return regions;
}

function createEmptyBoard(size: number): CellState[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "empty"),
  );
}

export default function JapanKingsGame({ difficulty, currentRound, totalRounds, onComplete }: Props) {
  // When difficulty is set, only play that single level; otherwise progress through all 3
  const activeLevels = difficulty ? [LEVELS[difficulty - 1]] : LEVELS;
  const [levelIndex, setLevelIndex] = useState(0);
  const [size, setSize] = useState(activeLevels[0]);
  const [regions, setRegions] = useState<number[][] | null>(null);
  const [board, setBoard] = useState<CellState[][]>(() => createEmptyBoard(LEVELS[0]));
  const [history, setHistory] = useState<CellState[][][]>([]);
  const [status, setStatus] = useState<"loading" | "playing" | "level_complete" | "complete">("loading");
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const nextSize = activeLevels[levelIndex];
    setSize(nextSize);
    setStatus("loading");
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    setTimeout(() => {
      const solution = generateSolution(nextSize);
      const regionMap = generateRegions(nextSize, solution);
      setRegions(regionMap);
      setBoard(createEmptyBoard(nextSize));
      setHistory([]);
      setStatus("playing");
    }, 0);
  }, [levelIndex]);

  const { conflictSet, kingsCount, isWin, conflictMessages, hasConflict } = useMemo(() => {
    if (!regions) {
      return {
        conflictSet: new Set<string>(),
        kingsCount: 0,
        isWin: false,
        conflictMessages: [] as string[],
        hasConflict: false,
      };
    }
    const conflicts = new Set<string>();
    const kingPositions: Array<{ r: number; c: number }> = [];
    const rowConflicts = new Set<number>();
    const colConflicts = new Set<number>();
    let regionConflict = false;
    let adjacencyConflict = false;

    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (board[r][c] === "king") {
          kingPositions.push({ r, c });
        }
      }
    }

    const rowMap = new Map<number, Array<{ r: number; c: number }>>();
    const colMap = new Map<number, Array<{ r: number; c: number }>>();
    const regionMap = new Map<number, Array<{ r: number; c: number }>>();

    for (const pos of kingPositions) {
      rowMap.set(pos.r, [...(rowMap.get(pos.r) ?? []), pos]);
      colMap.set(pos.c, [...(colMap.get(pos.c) ?? []), pos]);
      regionMap.set(regions[pos.r][pos.c], [...(regionMap.get(regions[pos.r][pos.c]) ?? []), pos]);
    }

    function markConflicts(list: Array<{ r: number; c: number }>) {
      if (list.length <= 1) return;
      list.forEach((p) => conflicts.add(`${p.r}-${p.c}`));
    }

    rowMap.forEach((list, row) => {
      if (list.length > 1) rowConflicts.add(row);
      markConflicts(list);
    });
    colMap.forEach((list, col) => {
      if (list.length > 1) colConflicts.add(col);
      markConflicts(list);
    });
    regionMap.forEach((list) => {
      if (list.length > 1) regionConflict = true;
      markConflicts(list);
    });

    const kingSet = new Set(kingPositions.map((p) => `${p.r}-${p.c}`));
    for (const pos of kingPositions) {
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          const nr = pos.r + dr;
          const nc = pos.c + dc;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
          if (kingSet.has(`${nr}-${nc}`)) {
            conflicts.add(`${pos.r}-${pos.c}`);
            conflicts.add(`${nr}-${nc}`);
            adjacencyConflict = true;
          }
        }
      }
    }

    const messages: string[] = [];
    if (rowConflicts.size > 0) {
      const rows = Array.from(rowConflicts).map((r) => r + 1).join(", ");
      messages.push(`Row conflict: multiple kings in row${rowConflicts.size > 1 ? "s" : ""} ${rows}.`);
    }
    if (colConflicts.size > 0) {
      const cols = Array.from(colConflicts).map((c) => c + 1).join(", ");
      messages.push(`Column conflict: multiple kings in column${colConflicts.size > 1 ? "s" : ""} ${cols}.`);
    }
    if (regionConflict) {
      messages.push("Region conflict: multiple kings in the same region.");
    }
    if (adjacencyConflict) {
      messages.push("Adjacency conflict: kings are touching (including diagonals).");
    }

    const win = kingPositions.length === size && conflicts.size === 0;
    return {
      conflictSet: conflicts,
      kingsCount: kingPositions.length,
      isWin: win,
      conflictMessages: messages,
      hasConflict: conflicts.size > 0,
    };
  }, [board, regions, size]);

  useEffect(() => {
    if (!isWin || status !== "playing") return;
    if (levelIndex < activeLevels.length - 1) {
      setStatus("level_complete");
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        advanceTimerRef.current = null;
        setLevelIndex((i) => i + 1);
      }, 1200);
      return;
    }

    setStatus("complete");
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      onComplete(activeLevels.length, activeLevels.length);
    }, 800);
  }, [isWin, status, levelIndex, onComplete]);

  function cycleCell(r: number, c: number) {
    if (status !== "playing") return;
    setBoard((prev) => {
      const prevCopy = prev.map((row) => row.slice());
      setHistory((h) => [...h, prevCopy]);
      const next = prev.map((row) => row.slice());
      const current = next[r][c];
      next[r][c] = current === "empty" ? "block" : current === "block" ? "king" : "empty";
      return next;
    });
  }

  function handleUndo() {
    if (status !== "playing") return;
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      setBoard(last);
      return h.slice(0, -1);
    });
  }

  function handleClear() {
    if (status !== "playing") return;
    setBoard(createEmptyBoard(size));
    setHistory([]);
  }

  function cellBorder(r: number, c: number): React.CSSProperties {
    if (!regions) return {};
    const regionId = regions[r][c];
    const borders = { borderTop: "1px solid var(--border-color)", borderRight: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", borderLeft: "1px solid var(--border-color)" };
    const borderColor = REGION_COLORS[regionId % REGION_COLORS.length];
    const thick = `3px solid ${borderColor}`;

    if (r === 0 || regions[r - 1][c] !== regionId) borders.borderTop = thick;
    if (r === size - 1 || regions[r + 1][c] !== regionId) borders.borderBottom = thick;
    if (c === 0 || regions[r][c - 1] !== regionId) borders.borderLeft = thick;
    if (c === size - 1 || regions[r][c + 1] !== regionId) borders.borderRight = thick;

    return borders;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--accent-gold)",
          marginBottom: "6px",
        }}>
          The King&apos;s Discipline
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Place one King in every row, column, and region — no touching, even diagonally.
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
          marginTop: "6px",
        }}>
          Click a cell to cycle: X → King → empty. Conflicts glow red.
        </p>
      </div>

      {/* Board */}
      <div style={{ display: "flex", gap: "24px", flex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gap: "0",
          width: "min(480px, 100%)",
          height: "min(480px, 100%)",
          aspectRatio: "1",
          border: hasConflict ? "1px solid #c0392b" : "1px solid var(--border-gold)",
          background: hasConflict ? "rgba(192,57,43,0.08)" : "var(--bg-card)",
          boxShadow: hasConflict ? "0 0 18px rgba(192,57,43,0.35)" : "none",
        }}>
          {regions &&
            board.map((row, r) =>
              row.map((cell, c) => {
                const regionId = regions[r][c];
                const isConflict = conflictSet.has(`${r}-${c}`) && cell === "king";
                const kingSize = size === 8 ? "1.7rem" : size === 6 ? "2rem" : "2.3rem";
                const xSize = size === 8 ? "1.3rem" : size === 6 ? "1.5rem" : "1.8rem";

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => cycleCell(r, c)}
                    style={{
                      position: "relative",
                      background: "transparent",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-cinzel)",
                      padding: 0,
                      lineHeight: 1,
                      boxSizing: "border-box",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      ...cellBorder(r, c),
                    }}
                  >
                    {cell === "block" && (
                      <span style={{ color: "var(--text-muted)", fontSize: xSize }}>✕</span>
                    )}
                    {cell === "king" && (
                      <span style={{
                        color: isConflict ? "#c0392b" : "var(--accent-gold-light)",
                        fontSize: kingSize,
                        textShadow: isConflict
                          ? "0 0 12px rgba(192,57,43,0.55)"
                          : "0 0 16px rgba(201,146,42,0.45)",
                      }}>
                        ♔
                      </span>
                    )}
                  </button>
                );
              }),
            )}
        </div>

        {/* Side panel */}
        <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ border: "1px solid var(--border-gold)", padding: "12px", background: "var(--bg-card)" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "6px",
            }}>
              {currentRound && totalRounds ? "Round" : "Level"}
            </p>
            {currentRound && totalRounds ? (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {Array.from({ length: totalRounds }, (_, i) => {
                  const done = i + 1 < currentRound;
                  const active = i + 1 === currentRound;
                  return (
                    <div key={i} style={{
                      width: "22px", height: "22px",
                      border: `1px solid ${done ? "var(--accent-gold)" : active ? "var(--accent-gold-light)" : "var(--border-gold)"}`,
                      background: done ? "rgba(201,146,42,0.15)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-cinzel)", fontSize: "0.58rem",
                      color: done ? "var(--accent-gold)" : active ? "var(--accent-gold-light)" : "var(--text-muted)",
                      transition: "all 0.4s",
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold-light)", fontSize: "1.2rem" }}>
                {levelIndex + 1} / {activeLevels.length}
              </p>
            )}
          </div>

          <div style={{ border: "1px solid var(--border-gold)", padding: "12px", background: "var(--bg-card)" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "6px",
            }}>
              Kings Placed
            </p>
            <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              {kingsCount} / {size}
            </p>
          </div>

          <div style={{ border: "1px solid var(--border-gold)", padding: "12px", background: "var(--bg-card)" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "6px",
            }}>
              Controls
            </p>
            <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Click: X<br />
              Click: ♔<br />
              Click: Clear
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

          {hasConflict && conflictMessages.length > 0 && (
            <div style={{
              border: "1px solid #c0392b",
              padding: "10px",
              background: "rgba(192,57,43,0.08)",
            }}>
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c0392b",
                marginBottom: "6px",
              }}>
                Conflict
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {conflictMessages.map((msg) => (
                  <p key={msg} style={{ fontFamily: "var(--font-crimson)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "16px", minHeight: "26px" }}>
        {status === "loading" && (
          <p style={{ fontFamily: "var(--font-crimson)", color: "var(--text-muted)", fontStyle: "italic" }}>
            Preparing the regions...
          </p>
        )}
        {status === "level_complete" && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold-light)", letterSpacing: "0.1em" }}>
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
