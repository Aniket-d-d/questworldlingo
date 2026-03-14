"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  difficulty?: 1 | 2 | 3;
  onComplete: (score: number, total: number) => void;
}

type Op = "+" | "-" | "×" | "÷";

interface Problem {
  a: number;
  b: number;
  op: Op;
  answer: number;
}

const LEVELS: Array<{
  label: string;
  ops: Op[];
}> = [
  { label: "Level I — Sums Only", ops: ["+"] },
  { label: "Level II — Sum or Subtract", ops: ["+", "-"] },
  { label: "Level III — Multiply or Divide", ops: ["×", "÷"] },
];

const PROBLEMS_PER_LEVEL = 3;
const TOTAL_TIME_SECONDS = 60;

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAdd(): Problem {
  while (true) {
    const a = rand(0, 99);
    const b = rand(0, 99);
    const answer = a + b;
    if (answer <= 100) return { a, b, op: "+", answer };
  }
}

function generateSub(): Problem {
  while (true) {
    const a = rand(0, 99);
    const b = rand(0, 99);
    if (a >= b) return { a, b, op: "-", answer: a - b };
  }
}

function generateMul(): Problem {
  while (true) {
    const a = rand(2, 12);
    const b = rand(2, 12);
    const answer = a * b;
    if (answer <= 100) return { a, b, op: "×", answer };
  }
}

function generateDiv(): Problem {
  while (true) {
    const divisor = rand(2, 12);
    const quotient = rand(2, 12);
    const dividend = divisor * quotient;
    if (dividend <= 99 && quotient <= 100) {
      return { a: dividend, b: divisor, op: "÷", answer: quotient };
    }
  }
}

function generateProblem(ops: Op[]): Problem {
  const op = ops[rand(0, ops.length - 1)];
  if (op === "+") return generateAdd();
  if (op === "-") return generateSub();
  if (op === "×") return generateMul();
  return generateDiv();
}

const TIME_LIMITS: Record<number, number> = { 1: 60, 2: 45, 3: 30 };

export default function KoreaMathGame({ difficulty, onComplete }: Props) {
  const activeLevels = LEVELS;
  const timeLimit = difficulty ? TIME_LIMITS[difficulty] : TOTAL_TIME_SECONDS;
  const [gameState, setGameState] = useState<"idle" | "running" | "complete">("idle");
  const [levelIndex, setLevelIndex] = useState(0);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "correct">("idle");
  const [status, setStatus] = useState<"playing" | "level_complete" | "complete">("playing");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const level = activeLevels[levelIndex];
    const nextProblems = Array.from({ length: PROBLEMS_PER_LEVEL }, () => generateProblem(level.ops));
    setProblems(nextProblems);
    setCurrent(0);
    setInput("");
    setFeedback("idle");
    setStatus("playing");
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, [levelIndex]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState !== "running") {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current);
        tickTimerRef.current = null;
      }
      return;
    }

    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    tickTimerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (tickTimerRef.current) clearInterval(tickTimerRef.current);
          tickTimerRef.current = null;
          setGameState("idle");
          setLevelIndex(0);
          setCompletedLevels(new Set());
          setStatus("playing");
          setShowTimeoutMessage(true);
          return timeLimit;
        }
        return t - 1;
      });
    }, 1000);
  }, [gameState]);

  function handleBegin() {
    setShowTimeoutMessage(false);
    setGameState("running");
    setLevelIndex(0);
    setCompletedLevels(new Set());
    setTimeLeft(timeLimit);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (gameState !== "running") return;
    if (!problems.length) return;
    const value = Number(input.trim());
    if (!Number.isFinite(value)) return;
    const problem = problems[current];
    if (value === problem.answer) {
      setFeedback("correct");
      if (current < PROBLEMS_PER_LEVEL - 1) {
        advanceTimerRef.current = setTimeout(() => {
          setCurrent((i) => i + 1);
          setInput("");
          setFeedback("idle");
        }, 450);
      } else if (levelIndex < activeLevels.length - 1) {
        setStatus("level_complete");
        setCompletedLevels((prev) => {
          const next = new Set(prev);
          next.add(levelIndex);
          return next;
        });
        advanceTimerRef.current = setTimeout(() => {
          setLevelIndex((i) => i + 1);
        }, 900);
      } else {
        setStatus("complete");
        setCompletedLevels((prev) => {
          const next = new Set(prev);
          next.add(levelIndex);
          return next;
        });
        setGameState("complete");
        if (tickTimerRef.current) clearInterval(tickTimerRef.current);
        advanceTimerRef.current = setTimeout(() => onComplete(activeLevels.length, activeLevels.length), 700);
      }
    } else {
      setFeedback("wrong");
    }
  }

  const level = activeLevels[levelIndex];
  const problem = problems[current];

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
          Scholar&apos;s Arithmetic
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Solve three mathematical problems per level.
        </p>
        {gameState === "idle" && (
          <div style={{ marginTop: "10px" }}>
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}>
              Level I: 3 addition problems.
              <br />
              Level II: 3 problems of addition or subtraction.
              <br />
              Level III: 3 problems of multiplication or division.
            </p>
          </div>
        )}
      </div>

      {gameState !== "idle" && (
        <>
          {/* Level tracker */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "10px" }}>
            {activeLevels.map((lvl, i) => {
              const isCurrent = i === levelIndex;
              const isComplete = completedLevels.has(i) || i < levelIndex;
              const color = isComplete ? "var(--accent-gold)" : isCurrent ? "var(--accent-gold-light)" : "var(--text-muted)";
              return (
                <div
                  key={lvl.label}
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
                  {lvl.label}
                </div>
              );
            })}
          </div>

          {/* Timer */}

          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}>
              Time Remaining
            </p>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "1.2rem", color: "var(--accent-gold-light)" }}>
              {timeLeft}s
            </p>
          </div>
        </>
      )}

      {/* Progress bar */}
      {gameState !== "idle" && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
          {Array.from({ length: PROBLEMS_PER_LEVEL }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "3px",
                backgroundColor: i <= current - 1 ? "var(--accent-gold)" : "var(--border-gold)",
                transition: "background-color 0.4s",
              }}
            />
          ))}
        </div>
      )}

      {/* Problem */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "18px",
      }}>
        {gameState === "idle" && (
          <div style={{ textAlign: "center", maxWidth: "420px" }}>
            {showTimeoutMessage && (
              <p style={{ fontFamily: "var(--font-crimson)", color: "#c0392b", fontStyle: "italic", marginBottom: "14px" }}>
                Time expired — the scholar resets the trial.
              </p>
            )}
            <button
              onClick={handleBegin}
              style={{
                padding: "16px 36px",
                border: "1px solid var(--accent-gold)",
                background: "transparent",
                color: "var(--accent-gold-light)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.85rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            >
              Begin →
            </button>
          </div>
        )}

        {gameState !== "idle" && problem && (
          <div style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "2rem",
            color: "var(--accent-gold-light)",
            letterSpacing: "0.08em",
          }}>
            {problem.a} {problem.op} {problem.b} = ?
          </div>
        )}

        {gameState !== "idle" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="number"
              value={input}
              onChange={(e) => { setInput(e.target.value); setFeedback("idle"); }}
              placeholder="Answer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
                padding: "10px 14px",
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                width: "140px",
                textAlign: "center",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; }}
            />
            <button
              type="submit"
              disabled={status !== "playing"}
              style={{
                padding: "10px 22px",
                border: "1px solid var(--accent-gold)",
                background: "transparent",
                color: "var(--accent-gold-light)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: status === "playing" ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (status === "playing") { e.currentTarget.style.background = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            >
              Submit
            </button>
          </form>
        )}

        {gameState !== "idle" && feedback === "wrong" && (
          <p style={{ fontFamily: "var(--font-crimson)", color: "#c0392b", fontStyle: "italic" }}>
            That does not match the scholar&apos;s calculation.
          </p>
        )}
        {gameState !== "idle" && feedback === "correct" && (
          <p style={{ fontFamily: "var(--font-crimson)", color: "var(--accent-gold-light)", fontStyle: "italic" }}>
            Correct.
          </p>
        )}
        {gameState !== "idle" && status === "level_complete" && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold)", letterSpacing: "0.1em" }}>
            Level Complete
          </p>
        )}
        {gameState !== "idle" && status === "complete" && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold-light)", letterSpacing: "0.1em" }}>
            Here&apos;s your artifact/excerpt.
          </p>
        )}
      </div>
    </div>
  );
}
