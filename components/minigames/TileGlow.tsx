"use client";

import { useState, useEffect, useRef } from "react";

const STAGES = [
  { size: 3, count: 4, label: "Stage I",   gridDesc: "3 × 3" },
  { size: 4, count: 5, label: "Stage II",  gridDesc: "4 × 4" },
  { size: 5, count: 6, label: "Stage III", gridDesc: "5 × 5" },
];

type Phase = "ready" | "showing" | "input" | "stage_clear" | "complete";

interface Props {
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
  onComplete: (score: number, total: number) => void;
}

function pickPattern(size: number, count: number): Set<number> {
  const all = Array.from({ length: size * size }, (_, i) => i);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return new Set(all.slice(0, count));
}

const TILE_SIZE: Record<number, number> = { 3: 82, 4: 66, 5: 54 };
const GAP = 8;

export default function TileGlow({ difficulty = 3, currentRound, totalRounds, onComplete }: Props) {
  // Each difficulty plays a single grid size, repeated 3× by the parent
  const activeStages = [STAGES[difficulty - 1]];
  const [stageIdx, setStageIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [pattern, setPattern] = useState<Set<number>>(new Set());
  const [found, setFound] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [showingPattern, setShowingPattern] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stage = activeStages[stageIdx];

  function addTimer(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }
  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    clearTimers();
    setPhase("ready");
    setFound(new Set());
    setWrongFlash(null);
    setShowingPattern(false);
    setRetrying(false);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIdx]);

  function startStage() {
    clearTimers();
    const p = pickPattern(stage.size, stage.count);
    setPattern(p);
    setFound(new Set());
    setWrongFlash(null);

    // Brief pause → show pattern for 1s → go dark → player's turn
    addTimer(() => {
      setPhase("showing");
      setShowingPattern(true);
    }, 400);

    addTimer(() => {
      setShowingPattern(false);
      addTimer(() => setPhase("input"), 200);
    }, 1400); // 400 delay + 1000ms shown
  }

  function watchAgain() {
    clearTimers();
    setFound(new Set());
    setWrongFlash(null);
    setShowingPattern(true);
    setPhase("showing");

    addTimer(() => {
      setShowingPattern(false);
      addTimer(() => setPhase("input"), 200);
    }, 1000);
  }

  function handleTileClick(idx: number) {
    if (phase !== "input") return;
    if (found.has(idx)) return; // already found, ignore

    if (pattern.has(idx)) {
      // Correct
      const newFound = new Set(found).add(idx);
      setFound(newFound);

      if (newFound.size === pattern.size) {
        setPhase("stage_clear");
        addTimer(() => {
          if (stageIdx < activeStages.length - 1) {
            setStageIdx((s) => s + 1);
          } else {
            setPhase("complete");
            addTimer(() => onComplete(activeStages.length, activeStages.length), 900);
          }
        }, 1300);
      }
    } else {
      // Wrong — red flash, then restart stage with a new pattern
      setWrongFlash(idx);
      setRetrying(true);
      setPhase("showing"); // block further clicks immediately
      addTimer(() => {
        setWrongFlash(null);
        setFound(new Set());
        const newPattern = pickPattern(stage.size, stage.count);
        setPattern(newPattern);
        setShowingPattern(true);
      }, 800);
      addTimer(() => {
        setShowingPattern(false);
        addTimer(() => { setRetrying(false); setPhase("input"); }, 200);
      }, 1800); // 800ms flash + 1000ms shown
    }
  }

  const tileSize = TILE_SIZE[stage.size];

  function getTileStyle(idx: number): React.CSSProperties {
    const isInPattern = pattern.has(idx);
    const isFound = found.has(idx);
    const isShowing = showingPattern && isInPattern;
    const isWrong = wrongFlash === idx;
    const canClick = phase === "input" && !isFound;

    let border = "var(--border-gold)";
    let bg = "var(--bg-card)";
    let shadow = "none";

    if (isFound) {
      border = "var(--accent-gold)";
      bg = "rgba(201,146,42,0.30)";
      shadow = "0 0 18px rgba(201,146,42,0.45), inset 0 0 10px rgba(201,146,42,0.18)";
    } else if (isShowing) {
      border = "var(--accent-gold-light)";
      bg = "rgba(201,146,42,0.38)";
      shadow = "0 0 22px rgba(201,146,42,0.55), inset 0 0 14px rgba(201,146,42,0.22)";
    } else if (isWrong) {
      border = "#8b2500";
      bg = "rgba(139,37,0,0.42)";
      shadow = "0 0 18px rgba(139,37,0,0.65)";
    }

    return {
      width: tileSize,
      height: tileSize,
      border: `1px solid ${border}`,
      background: bg,
      boxShadow: shadow,
      cursor: canClick ? "pointer" : "default",
      transition: "all 0.15s ease",
    };
  }

  const remaining = pattern.size - found.size;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "18px", width: "100%" }}>
        <p style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--accent-gold)",
          marginBottom: "6px",
        }}>
          Memory of Fire
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Tiles glow all at once — select them all from memory
        </p>
      </div>

      {/* Stage / Round progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        {currentRound && totalRounds ? (
          // Round progress (Srivijaya multi-round mode)
          Array.from({ length: totalRounds }, (_, i) => {
            const done = i + 1 < currentRound;
            const active = i + 1 === currentRound;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "26px", height: "26px",
                  border: `1px solid ${done ? "var(--accent-gold)" : active ? "var(--accent-gold-light)" : "var(--border-gold)"}`,
                  background: done ? "rgba(201,146,42,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-cinzel)", fontSize: "0.62rem",
                  color: done ? "var(--accent-gold)" : active ? "var(--accent-gold-light)" : "var(--text-muted)",
                  transition: "all 0.4s",
                }}>
                  {done ? "✓" : i + 1}
                </div>
                {i < totalRounds - 1 && (
                  <span style={{ color: "var(--border-gold)", marginLeft: "2px", fontSize: "0.7rem" }}>·</span>
                )}
              </div>
            );
          })
        ) : (
          // Default: stage progress
          activeStages.map((s, i) => {
            const done = i < stageIdx;
            const active = i === stageIdx;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "26px", height: "26px",
                  border: `1px solid ${done ? "var(--accent-gold)" : active ? "var(--accent-gold-light)" : "var(--border-gold)"}`,
                  background: done ? "rgba(201,146,42,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-cinzel)", fontSize: "0.62rem",
                  color: done ? "var(--accent-gold)" : active ? "var(--accent-gold-light)" : "var(--text-muted)",
                  transition: "all 0.4s",
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{
                  fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.06em",
                  color: active ? "var(--text-secondary)" : "var(--text-muted)",
                }}>
                  {s.gridDesc}
                </span>
                {i < activeStages.length - 1 && (
                  <span style={{ color: "var(--border-gold)", marginLeft: "2px", fontSize: "0.7rem" }}>·</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {phase !== "complete" ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${stage.size}, ${tileSize}px)`,
            gap: `${GAP}px`,
          }}>
            {Array.from({ length: stage.size * stage.size }, (_, i) => (
              <button
                key={i}
                onClick={() => handleTileClick(i)}
                disabled={phase !== "input" || found.has(i)}
                style={getTileStyle(i)}
                onMouseEnter={(e) => {
                  if (phase === "input" && !found.has(i) && wrongFlash !== i) {
                    e.currentTarget.style.borderColor = "var(--accent-gold)";
                    e.currentTarget.style.background = "rgba(201,146,42,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (phase === "input" && !found.has(i) && wrongFlash !== i) {
                    e.currentTarget.style.borderColor = "var(--border-gold)";
                    e.currentTarget.style.background = "var(--bg-card)";
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", animation: "panelFadeIn 0.5s ease forwards" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "1.1rem",
              color: "var(--accent-gold-light)",
              letterSpacing: "0.1em",
              marginBottom: "10px",
            }}>
              Memory Proven
            </p>
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "1rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}>
              The tiles remember what the fire tried to erase.
            </p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        textAlign: "center", marginTop: "20px", minHeight: "64px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
      }}>

        {phase === "ready" && (
          <>
            <p style={{
              fontFamily: "var(--font-crimson)", fontSize: "0.88rem",
              color: "var(--text-muted)", fontStyle: "italic",
            }}>
              {stage.label} · {stage.count} tiles to remember
            </p>
            <button
              onClick={startStage}
              style={{
                padding: "10px 28px",
                border: "1px solid var(--accent-gold)",
                background: "transparent",
                color: "var(--accent-gold-light)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            >
              Show Pattern →
            </button>
          </>
        )}

        {phase === "showing" && (
          <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.95rem", color: retrying ? "#c0392b" : "var(--text-muted)", fontStyle: "italic" }}>
            {retrying ? "Wrong tile — new pattern incoming..." : "Remember the glowing tiles..."}
          </p>
        )}

        {phase === "input" && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.95rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
              {remaining === 0 ? "All found!" : `${remaining} tile${remaining !== 1 ? "s" : ""} remaining`}
            </p>
            <button
              onClick={watchAgain}
              style={{
                padding: "6px 16px",
                border: "1px solid var(--border-gold)",
                background: "transparent",
                color: "var(--text-muted)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              Watch Again
            </button>
          </div>
        )}

        {phase === "stage_clear" && (
          <p style={{
            fontFamily: "var(--font-cinzel)", fontSize: "0.8rem",
            color: "var(--accent-gold)", letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            {stageIdx < STAGES.length - 1 ? `Stage ${stageIdx + 1} Clear · Next →` : "All Stages Complete"}
          </p>
        )}

      </div>
    </div>
  );
}
