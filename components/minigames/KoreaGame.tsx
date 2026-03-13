"use client";

import KoreaMathGame from "./KoreaMathGame";

interface Props {
  pairCount: number;
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom III — Goryeo Dynasty · Korean
// difficulty 1 = addition × 3 rounds, 2 = add/subtract × 3 rounds, 3 = multiply/divide × 3 rounds
export default function KoreaGame({ difficulty, currentRound, totalRounds, onComplete }: Props) {
  return <KoreaMathGame difficulty={difficulty} currentRound={currentRound} totalRounds={totalRounds} onComplete={onComplete} />;
}
