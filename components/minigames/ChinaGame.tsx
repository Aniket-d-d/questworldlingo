"use client";

import ChinaSudokuGame from "./ChinaSudokuGame";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom IV — Song Dynasty · Chinese
// Game: 3-level Sudoku challenge
export default function ChinaGame({ onComplete }: Props) {
  return <ChinaSudokuGame onComplete={onComplete} />;
}
