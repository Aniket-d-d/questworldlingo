"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  onComplete: (score: number, total: number) => void;
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
}

interface Island {
  id: string;
  r: number;
  c: number;
  required: number;
}

interface BridgeDef {
  a: string;
  b: string;
  count: 1 | 2;
}

interface LevelConfig {
  size: number;
  minIslands: number;
  maxIslands: number;
  maxNumber: number;
  requireDegreeOneNeighbor: boolean;
  minHighCount: number;
  minHighThreshold: number;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { size: 4, minIslands: 6, maxIslands: 8, maxNumber: 4, requireDegreeOneNeighbor: false, minHighCount: 0, minHighThreshold: 0 },
  { size: 5, minIslands: 7, maxIslands: 10, maxNumber: 8, requireDegreeOneNeighbor: false, minHighCount: 2, minHighThreshold: 6 },
  { size: 6, minIslands: 8, maxIslands: 12, maxNumber: 8, requireDegreeOneNeighbor: true, minHighCount: 0, minHighThreshold: 0 },
];

const CELL_SIZE = 70;
const ISLAND_SIZE = 36;

function bridgeKey(a: string, b: string) {
  return [a, b].sort().join("|");
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomIds(count: number): string[] {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length: count }, (_, i) => letters[i]);
}

function buildAllowedPairs(islands: Island[], size: number): Set<string> {
  const islandAt = new Map<string, Island>();
  islands.forEach((i) => islandAt.set(`${i.r}-${i.c}`, i));
  const allowed = new Set<string>();

  for (const i of islands) {
    for (const j of islands) {
      if (i.id === j.id) continue;
      if (i.r !== j.r && i.c !== j.c) continue;
      const rMin = Math.min(i.r, j.r);
      const rMax = Math.max(i.r, j.r);
      const cMin = Math.min(i.c, j.c);
      const cMax = Math.max(i.c, j.c);
      let blocked = false;
      if (i.r === j.r) {
        for (let c = cMin + 1; c < cMax; c += 1) {
          if (islandAt.has(`${i.r}-${c}`)) { blocked = true; break; }
        }
      } else {
        for (let r = rMin + 1; r < rMax; r += 1) {
          if (islandAt.has(`${r}-${i.c}`)) { blocked = true; break; }
        }
      }
      if (!blocked) {
        allowed.add(bridgeKey(i.id, j.id));
      }
    }
  }
  return allowed;
}

type Segment = { orientation: "h" | "v"; row: number; col: number; start: number; end: number };

function segmentFor(islandsById: Record<string, Island>, a: string, b: string): Segment {
  const ia = islandsById[a];
  const ib = islandsById[b];
  if (ia.r === ib.r) {
    return {
      orientation: "h",
      row: ia.r,
      col: 0,
      start: Math.min(ia.c, ib.c),
      end: Math.max(ia.c, ib.c),
    };
  }
  return {
    orientation: "v",
    row: 0,
    col: ia.c,
    start: Math.min(ia.r, ib.r),
    end: Math.max(ia.r, ib.r),
  };
}

function crosses(a: Segment, b: Segment): boolean {
  if (a.orientation === b.orientation) return false;
  const h = a.orientation === "h" ? a : b;
  const v = a.orientation === "v" ? a : b;
  const within =
    v.col > h.start &&
    v.col < h.end &&
    h.row > v.start &&
    h.row < v.end;
  return within;
}

function validatePuzzle(islands: Island[], solution: BridgeDef[]): boolean {
  const islandsById: Record<string, Island> = {};
  islands.forEach((i) => { islandsById[i.id] = i; });
  const allowedPairs = buildAllowedPairs(islands, 0);
  const segments: Segment[] = [];
  const counts: Record<string, number> = {};
  islands.forEach((i) => { counts[i.id] = 0; });

  for (const b of solution) {
    const key = bridgeKey(b.a, b.b);
    if (!allowedPairs.has(key)) return false;
    counts[b.a] += b.count;
    counts[b.b] += b.count;
    const seg = segmentFor(islandsById, b.a, b.b);
    for (const existing of segments) {
      if (crosses(seg, existing)) return false;
    }
    segments.push(seg);
  }

  const countsOk = islands.every((i) => counts[i.id] === i.required);
  if (!countsOk) return false;

  const graph: Record<string, string[]> = {};
  islands.forEach((i) => { graph[i.id] = []; });
  solution.forEach((b) => {
    graph[b.a].push(b.b);
    graph[b.b].push(b.a);
  });
  const visited = new Set<string>();
  const stack = [islands[0].id];
  while (stack.length) {
    const id = stack.pop() as string;
    if (visited.has(id)) continue;
    visited.add(id);
    graph[id].forEach((n) => { if (!visited.has(n)) stack.push(n); });
  }
  return visited.size === islands.length;
}

function buildAdjacency(islands: Island[], allowedPairs: Set<string>): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  islands.forEach((i) => { map[i.id] = []; });
  allowedPairs.forEach((key) => {
    const [a, b] = key.split("|");
    map[a].push(b);
    map[b].push(a);
  });
  return map;
}

function placeRandomIslands(size: number, count: number): Omit<Island, "required">[] {
  const all = shuffle(
    Array.from({ length: size * size }, (_, i) => ({ r: Math.floor(i / size), c: i % size })),
  );
  const ids = randomIds(count);
  return all.slice(0, count).map((pos, idx) => ({
    id: ids[idx],
    r: pos.r,
    c: pos.c,
  }));
}

function buildSpanningTree(
  islands: Island[],
  adjacency: Record<string, string[]>,
  maxNumber: number,
): { bridges: Record<string, number>; counts: Record<string, number> } | null {
  const islandsById: Record<string, Island> = {};
  islands.forEach((i) => { islandsById[i.id] = i; });
  const counts: Record<string, number> = {};
  islands.forEach((i) => { counts[i.id] = 0; });
  const bridges: Record<string, number> = {};
  const segments: Segment[] = [];
  const connected = new Set<string>();
  const start = islands[0].id;
  connected.add(start);

  while (connected.size < islands.length) {
    const candidates: Array<[string, string]> = [];
    connected.forEach((id) => {
      adjacency[id].forEach((n) => {
        if (!connected.has(n)) candidates.push([id, n]);
      });
    });
    const shuffled = shuffle(candidates);
    let added = false;
    for (const [a, b] of shuffled) {
      if (counts[a] + 1 > maxNumber || counts[b] + 1 > maxNumber) continue;
      const key = bridgeKey(a, b);
      const seg = segmentFor(islandsById, a, b);
      if (segments.some((s) => crosses(seg, s))) continue;
      bridges[key] = 1;
      counts[a] += 1;
      counts[b] += 1;
      segments.push(seg);
      connected.add(a);
      connected.add(b);
      added = true;
      break;
    }
    if (!added) return null;
  }
  return { bridges, counts };
}

function canAddEdge(
  a: string,
  b: string,
  bridges: Record<string, number>,
  counts: Record<string, number>,
  maxNumber: number,
  islandsById: Record<string, Island>,
): boolean {
  const key = bridgeKey(a, b);
  const current = bridges[key] ?? 0;
  if (current >= 2) return false;
  if (counts[a] + 1 > maxNumber || counts[b] + 1 > maxNumber) return false;
  if (current === 0) {
    const segNew = segmentFor(islandsById, a, b);
    for (const [k, count] of Object.entries(bridges)) {
      if (count <= 0) continue;
      const [x, y] = k.split("|");
      const segExisting = segmentFor(islandsById, x, y);
      if (crosses(segNew, segExisting)) return false;
    }
  }
  return true;
}

function generatePuzzle(config: LevelConfig): { islands: Island[]; bridges: Record<string, number> } {
  const attempts = 200;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const count = randInt(config.minIslands, config.maxIslands);
    const baseIslands = placeRandomIslands(config.size, count);
    const islands = baseIslands.map((i) => ({ ...i, required: 0 }));
    const allowedPairs = buildAllowedPairs(islands, config.size);
    const adjacency = buildAdjacency(islands, allowedPairs);

    const degs = Object.values(adjacency).map((list) => list.length);
    if (degs.some((d) => d === 0)) continue;
    if (config.requireDegreeOneNeighbor && !degs.some((d) => d === 1)) continue;

    const tree = buildSpanningTree(islands, adjacency, config.maxNumber);
    if (!tree) continue;
    const bridges = { ...tree.bridges };
    const counts = { ...tree.counts };
    const islandsById: Record<string, Island> = {};
    islands.forEach((i) => { islandsById[i.id] = i; });

    const allPairs = shuffle(Array.from(allowedPairs));
    const addTries = config.size * config.size * 4;
    for (let t = 0; t < addTries; t += 1) {
      const key = allPairs[Math.floor(Math.random() * allPairs.length)];
      const [a, b] = key.split("|");
      if (!canAddEdge(a, b, bridges, counts, config.maxNumber, islandsById)) continue;
      bridges[key] = (bridges[key] ?? 0) + 1;
      counts[a] += 1;
      counts[b] += 1;
    }

    if (config.minHighCount > 0) {
      const target = config.minHighThreshold;
      let safety = 0;
      while (safety < 200) {
        const highCount = Object.values(counts).filter((v) => v >= target).length;
        if (highCount >= config.minHighCount) break;
        const candidates = allPairs.filter((key) => {
          const [a, b] = key.split("|");
          return (counts[a] < target || counts[b] < target) &&
            canAddEdge(a, b, bridges, counts, config.maxNumber, islandsById);
        });
        if (!candidates.length) break;
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        const [a, b] = pick.split("|");
        bridges[pick] = (bridges[pick] ?? 0) + 1;
        counts[a] += 1;
        counts[b] += 1;
        safety += 1;
      }
      const highCount = Object.values(counts).filter((v) => v >= target).length;
      if (highCount < config.minHighCount) continue;
    }

    if (Object.values(counts).some((v) => v < 1 || v > config.maxNumber || v > 8)) continue;

    const withRequired = islands.map((i) => ({ ...i, required: counts[i.id] }));
    const solution = Object.entries(bridges).map(([key, count]) => {
      const [a, b] = key.split("|");
      return { a, b, count: count as 1 | 2 };
    });
    if (!validatePuzzle(withRequired, solution)) continue;
    return { islands: withRequired, bridges };
  }
  throw new Error("Failed to generate bridges puzzle");
}

function signatureFor(size: number, islands: Island[]): string {
  const sorted = [...islands].sort((a, b) => a.id.localeCompare(b.id));
  return `${size}|` + sorted.map((i) => `${i.id}:${i.r},${i.c},${i.required}`).join(";");
}

export default function TibetBridgesGame({ onComplete, difficulty, currentRound, totalRounds }: Props) {
  const activeLevels = difficulty ? [LEVEL_CONFIGS[difficulty - 1]] : LEVEL_CONFIGS;
  const [levelIndex, setLevelIndex] = useState(0);
  const [islands, setIslands] = useState<Island[]>([]);
  const [bridges, setBridges] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"playing" | "level_complete" | "complete">("playing");
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSignatureRef = useRef<Record<number, string>>({});

  const level = activeLevels[levelIndex];
  const levelSize = level.size;
  const islandsById = useMemo(() => {
    const map: Record<string, Island> = {};
    islands.forEach((i) => { map[i.id] = i; });
    return map;
  }, [islands]);

  const allowedPairs = useMemo(
    () => (islands.length ? buildAllowedPairs(islands, levelSize) : new Set<string>()),
    [islands, levelSize],
  );

  useEffect(() => {
    try {
      let next = generatePuzzle(level);
      let signature = signatureFor(level.size, next.islands);
      let safety = 0;
      while (lastSignatureRef.current[level.size] === signature && safety < 5) {
        next = generatePuzzle(level);
        signature = signatureFor(level.size, next.islands);
        safety += 1;
      }
      lastSignatureRef.current[level.size] = signature;
      setIslands(next.islands);
      setBridges({});
      setSelected(null);
      setStatus("playing");
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to generate bridges puzzle", err);
    }
  }, [levelIndex]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const islandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    islands.forEach((i) => { counts[i.id] = 0; });
    Object.entries(bridges).forEach(([key, count]) => {
      if (count <= 0) return;
      const [a, b] = key.split("|");
      counts[a] += count;
      counts[b] += count;
    });
    return counts;
  }, [bridges, islands]);

  const isConnected = useMemo(() => {
    if (!islands.length) return false;
    const graph: Record<string, string[]> = {};
    islands.forEach((i) => { graph[i.id] = []; });
    Object.entries(bridges).forEach(([key, count]) => {
      if (count <= 0) return;
      const [a, b] = key.split("|");
      graph[a].push(b);
      graph[b].push(a);
    });
    const visited = new Set<string>();
    const stack = [islands[0].id];
    while (stack.length) {
      const id = stack.pop() as string;
      if (visited.has(id)) continue;
      visited.add(id);
      graph[id].forEach((n) => { if (!visited.has(n)) stack.push(n); });
    }
    return visited.size === islands.length;
  }, [bridges, islands]);

  const { isSolved, countsOk } = useMemo(() => {
    if (!islands.length) return { isSolved: false, countsOk: false };
    const satisfied = islands.every((i) => islandCounts[i.id] === i.required);
    return { isSolved: satisfied && isConnected, countsOk: satisfied };
  }, [islands, islandCounts, isConnected]);

  useEffect(() => {
    if (!isSolved || status !== "playing") return;
    if (levelIndex < activeLevels.length - 1) {
      setStatus("level_complete");
      advanceTimerRef.current = setTimeout(() => {
        setLevelIndex((i) => i + 1);
      }, 900);
    } else {
      setStatus("complete");
      advanceTimerRef.current = setTimeout(() => onComplete(activeLevels.length, activeLevels.length), 700);
    }
  }, [isSolved, levelIndex, status, onComplete]);

  function goToNextLevel() {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setLevelIndex((i) => i + 1);
  }

  function canPlaceBridge(a: string, b: string): boolean {
    const key = bridgeKey(a, b);
    if (!allowedPairs.has(key)) return false;
    const segNew = segmentFor(islandsById, a, b);
    for (const [k, count] of Object.entries(bridges)) {
      if (count <= 0) continue;
      if (k === key) continue;
      const [x, y] = k.split("|");
      const segExisting = segmentFor(islandsById, x, y);
      if (crosses(segNew, segExisting)) return false;
    }
    return true;
  }

  function toggleBridge(a: string, b: string) {
    if (status !== "playing") return;
    const key = bridgeKey(a, b);
    if (!allowedPairs.has(key)) return;
    setBridges((prev) => {
      const current = prev[key] ?? 0;
      if (current === 0) {
        if (!canPlaceBridge(a, b)) return prev;
        return { ...prev, [key]: 1 };
      }
      if (current === 1) {
        return { ...prev, [key]: 2 };
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleIslandClick(id: string) {
    if (status !== "playing") return;
    if (!selected) {
      setSelected(id);
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    toggleBridge(selected, id);
    setSelected(null);
  }

  const boardSize = levelSize * CELL_SIZE;

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
          Island Bridges
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Connect all islands. Each number shows how many bridges leave that island.
        </p>
      </div>

      {/* Level tracker — only shown when playing all levels (no difficulty chosen) */}
      {!difficulty && (
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
        {activeLevels.map((lvl, i) => {
          const isCurrent = i === levelIndex;
          const color = isCurrent ? "var(--accent-gold-light)" : "var(--text-muted)";
          return (
            <div
              key={lvl.size}
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
              {lvl.size}×{lvl.size}
            </div>
          );
        })}
      </div>
      )}

      {/* Round progress boxes when difficulty is chosen */}
      {difficulty && currentRound && totalRounds && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-gold)" }}>
            Round {currentRound} of {totalRounds}
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {Array.from({ length: totalRounds }, (_, i) => (
              <div key={i} style={{
                width: "20px", height: "4px", borderRadius: "2px",
                backgroundColor: i < currentRound - 1 ? "var(--accent-gold)" : i === currentRound - 1 ? "var(--accent-gold-light)" : "var(--border-gold)",
                transition: "background-color 0.4s",
              }} />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: "24px", flex: 1 }}>
        {/* Board */}
        <div style={{
          position: "relative",
          width: boardSize,
          height: boardSize,
          border: "1px solid var(--border-gold)",
          background: "var(--bg-card)",
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(201,146,42,0.15), rgba(201,146,42,0.15) 1px, transparent 1px, transparent ${CELL_SIZE}px),
            repeating-linear-gradient(90deg, rgba(201,146,42,0.15), rgba(201,146,42,0.15) 1px, transparent 1px, transparent ${CELL_SIZE}px)
          `,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          backgroundPosition: "0 0",
        }}>
          {/* Bridges */}
          {Object.entries(bridges).map(([key, count]) => {
            const [a, b] = key.split("|");
            const ia = islandsById[a];
            const ib = islandsById[b];
            if (!ia || !ib) return null;
            const isHorizontal = ia.r === ib.r;
            const startR = ia.r;
            const startC = Math.min(ia.c, ib.c);
            const endC = Math.max(ia.c, ib.c);
            const startRow = Math.min(ia.r, ib.r);
            const endRow = Math.max(ia.r, ib.r);
            const lineOffset = count === 2 ? 6 : 0;

            if (isHorizontal) {
              const top = startR * CELL_SIZE + CELL_SIZE / 2 - 2;
              const left = startC * CELL_SIZE + CELL_SIZE / 2;
              const width = (endC - startC) * CELL_SIZE;
              return (
                <div key={key}>
                  <div style={{
                    position: "absolute",
                    top: top - lineOffset / 2,
                    left,
                    width,
                    height: 4,
                    background: "var(--accent-gold-light)",
                    boxShadow: "0 0 6px rgba(201,146,42,0.35)",
                  }} />
                  {count === 2 && (
                    <div style={{
                      position: "absolute",
                      top: top + lineOffset / 2,
                      left,
                      width,
                      height: 4,
                      background: "var(--accent-gold-light)",
                      boxShadow: "0 0 6px rgba(201,146,42,0.35)",
                    }} />
                  )}
                </div>
              );
            }

            const left = ia.c * CELL_SIZE + CELL_SIZE / 2 - 2;
            const top = startRow * CELL_SIZE + CELL_SIZE / 2;
            const height = (endRow - startRow) * CELL_SIZE;
            return (
              <div key={key}>
                <div style={{
                  position: "absolute",
                  left: left - lineOffset / 2,
                  top,
                  width: 4,
                  height,
                  background: "var(--accent-gold-light)",
                  boxShadow: "0 0 6px rgba(201,146,42,0.35)",
                }} />
                {count === 2 && (
                  <div style={{
                    position: "absolute",
                    left: left + lineOffset / 2,
                    top,
                    width: 4,
                    height,
                    background: "var(--accent-gold-light)",
                    boxShadow: "0 0 6px rgba(201,146,42,0.35)",
                  }} />
                )}
              </div>
            );
          })}

          {/* Islands */}
          {islands.map((island) => {
            const count = islandCounts[island.id] ?? 0;
            const isExact = count === island.required;
            const isOver = count > island.required;
            const bg = isExact ? "rgba(201,146,42,0.18)" : "var(--bg-secondary)";
            const border = isOver ? "#c0392b" : isExact ? "var(--accent-gold)" : "var(--border-gold)";
            return (
              <button
                key={island.id}
                onClick={() => handleIslandClick(island.id)}
                style={{
                  position: "absolute",
                  left: island.c * CELL_SIZE + CELL_SIZE / 2 - ISLAND_SIZE / 2,
                  top: island.r * CELL_SIZE + CELL_SIZE / 2 - ISLAND_SIZE / 2,
                  width: ISLAND_SIZE,
                  height: ISLAND_SIZE,
                  borderRadius: "50%",
                  border: `1px solid ${border}`,
                  background: bg,
                  color: isOver ? "#c0392b" : isExact ? "var(--accent-gold-light)" : "var(--text-secondary)",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  boxShadow: selected === island.id ? "0 0 10px rgba(201,146,42,0.45)" : "none",
                }}
              >
                {island.required}
              </button>
            );
          })}
        </div>

        {/* Instructions */}
        <div style={{ width: "220px", display: "flex", flexDirection: "column", gap: "12px" }}>
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
            <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Click an island, then click another to place a bridge.
              Click again to add a second bridge. Click a third time to remove.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                if (status !== "playing") return;
                setBridges({});
                setSelected(null);
              }}
              disabled={status !== "playing" || Object.values(bridges).length === 0}
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid var(--border-gold)",
                background: "transparent",
                color: status === "playing" && Object.values(bridges).length > 0 ? "var(--text-secondary)" : "var(--text-muted)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: status === "playing" && Object.values(bridges).length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (status === "playing" && Object.values(bridges).length > 0) {
                  e.currentTarget.style.borderColor = "var(--accent-gold)";
                  e.currentTarget.style.color = "var(--accent-gold-light)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-gold)";
                e.currentTarget.style.color =
                  status === "playing" && Object.values(bridges).length > 0 ? "var(--text-secondary)" : "var(--text-muted)";
              }}
            >
              Clear Bridges
            </button>
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
              Status
            </p>
            <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.85rem", color: countsOk ? "var(--accent-gold-light)" : "var(--text-secondary)" }}>
              {countsOk ? "All clues satisfied." : "Clues not satisfied yet."}
            </p>
            <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.85rem", color: isConnected ? "var(--accent-gold-light)" : "var(--text-secondary)", marginTop: "6px" }}>
              {isConnected ? "All islands are connected." : "Islands are not fully connected."}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", minHeight: "24px" }}>
        {status === "level_complete" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold)", letterSpacing: "0.1em" }}>
              Level Complete
            </p>
            {levelIndex < activeLevels.length - 1 && (
              <button
                onClick={goToNextLevel}
                style={{
                  padding: "8px 18px",
                  border: "1px solid var(--border-gold)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                Next Level →
              </button>
            )}
          </div>
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
