"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  targetLines: number;
  dropIntervalMs: number;
  onComplete: (score: number, total: number) => void;
}

type Cell = string | null;

interface Piece {
  matrix: number[][];
  color: string;
  x: number;
  y: number;
}

const GRID_WIDTH = 10;
const GRID_HEIGHT = 16;
const CELL_SIZE = 26;

const SHAPES: Array<{ name: string; color: string; matrix: number[][] }> = [
  {
    name: "I",
    color: "#e8b84b",
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "O",
    color: "#c9922a",
    matrix: [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "T",
    color: "#8b2500",
    matrix: [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "L",
    color: "#a07030",
    matrix: [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "J",
    color: "#6b5a45",
    matrix: [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "S",
    color: "#c43c00",
    matrix: [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "Z",
    color: "#4a3520",
    matrix: [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
];

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => null),
  );
}

function rotateMatrix(matrix: number[][]): number[][] {
  const size = matrix.length;
  const result = Array.from({ length: size }, () => Array(size).fill(0));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      result[x][size - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

function collides(board: Cell[][], piece: Piece): boolean {
  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      if (!piece.matrix[y][x]) continue;
      const boardX = piece.x + x;
      const boardY = piece.y + y;
      if (boardX < 0 || boardX >= GRID_WIDTH || boardY >= GRID_HEIGHT) {
        return true;
      }
      if (boardY >= 0 && board[boardY][boardX]) {
        return true;
      }
    }
  }
  return false;
}

function merge(board: Cell[][], piece: Piece): Cell[][] {
  const next = board.map((row) => row.slice());
  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      if (!piece.matrix[y][x]) continue;
      const boardY = piece.y + y;
      const boardX = piece.x + x;
      if (boardY >= 0 && boardY < GRID_HEIGHT && boardX >= 0 && boardX < GRID_WIDTH) {
        next[boardY][boardX] = piece.color;
      }
    }
  }
  return next;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const cleared = GRID_HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: cleared }, () =>
    Array.from({ length: GRID_WIDTH }, () => null),
  );
  return {
    board: [...emptyRows, ...remaining],
    cleared,
  };
}

function createPiece(): Piece {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    matrix: shape.matrix,
    color: shape.color,
    x: Math.floor(GRID_WIDTH / 2) - 2,
    y: -1,
  };
}

export default function JapanTetrisGame({
  targetLines,
  dropIntervalMs,
  onComplete,
}: Props) {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard);
  const [piece, setPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece>(() => ({
    matrix: SHAPES[0].matrix,
    color: SHAPES[0].color,
    x: Math.floor(GRID_WIDTH / 2) - 2,
    y: -1,
  }));
  const [lines, setLines] = useState(0);
  const [status, setStatus] = useState<"ready" | "playing" | "complete" | "over">("ready");

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  const statusRef = useRef(status);
  const linesRef = useRef(lines);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  useEffect(() => {
    pieceRef.current = piece;
  }, [piece]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  function spawnNext() {
    const currentNext = nextPiece;
    const freshNext = createPiece();
    setNextPiece(freshNext);
    const spawnPiece = { ...currentNext, x: Math.floor(GRID_WIDTH / 2) - 2, y: -1 };
    if (collides(boardRef.current, spawnPiece)) {
      setStatus("over");
      return;
    }
    setPiece(spawnPiece);
  }

  function resetGame() {
    const first = createPiece();
    const second = createPiece();
    setBoard(createEmptyBoard());
    setLines(0);
    setStatus("playing");
    setPiece(first);
    setNextPiece(second);
  }

  function lockPiece(current: Piece) {
    const merged = merge(boardRef.current, current);
    const { board: clearedBoard, cleared } = clearLines(merged);
    setBoard(clearedBoard);

    const newLines = linesRef.current + cleared;
    setLines(newLines);

    if (newLines >= targetLines) {
      setStatus("complete");
      setTimeout(() => onCompleteRef.current(newLines, targetLines), 600);
      return;
    }

    spawnNext();
  }

  function movePiece(dx: number, dy: number) {
    if (!pieceRef.current) return;
    const moved = { ...pieceRef.current, x: pieceRef.current.x + dx, y: pieceRef.current.y + dy };
    if (!collides(boardRef.current, moved)) {
      setPiece(moved);
    } else if (dy === 1) {
      lockPiece(pieceRef.current);
    }
  }

  function hardDrop() {
    if (!pieceRef.current) return;
    let drop = { ...pieceRef.current };
    while (!collides(boardRef.current, { ...drop, y: drop.y + 1 })) {
      drop = { ...drop, y: drop.y + 1 };
    }
    setPiece(drop);
    lockPiece(drop);
  }

  function rotatePiece() {
    if (!pieceRef.current) return;
    const rotated = rotateMatrix(pieceRef.current.matrix);
    const kicks = [0, -1, 1, -2, 2];
    for (const offset of kicks) {
      const candidate = { ...pieceRef.current, matrix: rotated, x: pieceRef.current.x + offset };
      if (!collides(boardRef.current, candidate)) {
        setPiece(candidate);
        return;
      }
    }
  }

  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => {
      if (statusRef.current !== "playing") return;
      movePiece(0, 1);
    }, dropIntervalMs);
    return () => clearInterval(id);
  }, [status, dropIntervalMs]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (statusRef.current !== "playing") return;
      if (e.key === "ArrowLeft") movePiece(-1, 0);
      if (e.key === "ArrowRight") movePiece(1, 0);
      if (e.key === "ArrowDown") movePiece(0, 1);
      if (e.key === "ArrowUp") rotatePiece();
      if (e.key === " ") hardDrop();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function renderCell(x: number, y: number) {
    const cellValue = board[y][x];
    let fill = cellValue ?? "transparent";
    let border = "1px solid var(--border-gold)";

    if (piece) {
      for (let py = 0; py < piece.matrix.length; py += 1) {
        for (let px = 0; px < piece.matrix[py].length; px += 1) {
          if (!piece.matrix[py][px]) continue;
          const boardX = piece.x + px;
          const boardY = piece.y + py;
          if (boardX === x && boardY === y) {
            fill = piece.color;
            border = "1px solid var(--accent-gold-light)";
          }
        }
      }
    }

    return (
      <div
        key={`${x}-${y}`}
        style={{
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          background: fill ? `linear-gradient(180deg, ${fill}, rgba(0,0,0,0.1))` : "transparent",
          border,
          boxShadow: fill ? "0 0 8px rgba(201,146,42,0.25)" : "none",
        }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--accent-gold)",
          marginBottom: "6px",
        }}>
          Falling Sutras
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Clear {targetLines} lines to earn the Lotus Sutra Commentary
        </p>
      </div>

      <div style={{ display: "flex", gap: "24px", flex: 1, alignItems: "stretch" }}>
        {/* Board */}
        <div style={{
          border: "1px solid var(--border-gold)",
          background: "var(--bg-card)",
          padding: "10px",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
          gap: "4px",
          boxShadow: "0 0 18px rgba(0,0,0,0.35) inset",
        }}>
          {Array.from({ length: GRID_HEIGHT }).map((_, y) =>
            Array.from({ length: GRID_WIDTH }).map((_, x) => renderCell(x, y)),
          )}
        </div>

        {/* Side panel */}
        <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ border: "1px solid var(--border-gold)", padding: "12px", background: "var(--bg-card)" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "8px",
            }}>
              Next
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 18px)",
              gap: "4px",
            }}>
              {nextPiece.matrix.flat().map((cell, i) => (
                <div
                  key={i}
                  style={{
                    width: "18px",
                    height: "18px",
                    background: cell ? nextPiece.color : "transparent",
                    border: "1px solid var(--border-gold)",
                  }}
                />
              ))}
            </div>
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
              Lines
            </p>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "1.4rem",
              color: "var(--accent-gold-light)",
            }}>
              {lines} / {targetLines}
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
              ← → move<br />
              ↑ rotate<br />
              ↓ soft drop<br />
              Space hard drop
            </p>
          </div>
        </div>
      </div>

      {/* Footer / status */}
      <div style={{
        marginTop: "18px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        {status === "ready" && (
          <button
            onClick={resetGame}
            style={{
              padding: "10px 26px",
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
            Begin Challenge →
          </button>
        )}

        {status === "playing" && (
          <p style={{ fontFamily: "var(--font-crimson)", color: "var(--text-muted)", fontStyle: "italic" }}>
            The sutras fall. Keep your focus.
          </p>
        )}

        {status === "complete" && (
          <p style={{ fontFamily: "var(--font-cinzel)", color: "var(--accent-gold-light)", letterSpacing: "0.1em" }}>
            Manuscript Secured
          </p>
        )}

        {status === "over" && (
          <button
            onClick={resetGame}
            style={{
              padding: "8px 20px",
              border: "1px solid var(--border-gold)",
              background: "transparent",
              color: "var(--text-muted)",
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
