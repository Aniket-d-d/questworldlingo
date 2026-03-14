"use client";

import ChinaSudokuGame from "./ChinaSudokuGame";

interface Props {
  pairCount: number;
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom IV — Song Dynasty · Chinese
// difficulty 1 = 4×4 × 3 rounds, 2 = 5×5 × 3 rounds, 3 = 6×6 × 3 rounds
export default function ChinaGame({ difficulty, onComplete }: Props) {
  return <ChinaSudokuGame difficulty={difficulty} onComplete={onComplete} />;
}
